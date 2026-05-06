import { useState, useCallback, useRef } from 'react';
import { LEGAL_TEMPLATES } from '../utils/templateData';

const useConversationalTemplate = (templates, onUpdateText, onDownload) => {
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [currentFieldIndex, setCurrentFieldIndex] = useState(-1);
    const [answers, setAnswers] = useState({});
    const [isHandsFree, setIsHandsFree] = useState(false);
    const [isConfirmationStep, setIsConfirmationStep] = useState(false);
    const [isBotSpeaking, setIsBotSpeaking] = useState(false);

    const synthRef = useRef(window.speechSynthesis);

    const speak = useCallback((text, onEnd) => {
        if (!synthRef.current) {
            if (onEnd) onEnd();
            return;
        }

        const runSpeak = () => {
            synthRef.current.cancel();
            setIsBotSpeaking(true);

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 1.0;

            utterance.onend = () => {
                setIsBotSpeaking(false);
                if (onEnd) onEnd();
            };

            utterance.onerror = (e) => {
                console.error("Speech error:", e);
                setIsBotSpeaking(false);
                if (onEnd) onEnd();
            };

            synthRef.current.speak(utterance);
        };

        const voices = synthRef.current.getVoices();
        if (voices.length === 0) {
            // Wait briefly for voices, but don't block forever
            let timeoutTriggered = false;
            const voicesTimeout = setTimeout(() => {
                timeoutTriggered = true;
                runSpeak();
            }, 500);

            const handleVoicesChanged = () => {
                if (!timeoutTriggered) {
                    clearTimeout(voicesTimeout);
                    synthRef.current.onvoiceschanged = null;
                    runSpeak();
                }
            };
            synthRef.current.onvoiceschanged = handleVoicesChanged;
        } else {
            runSpeak();
        }
    }, []);

    const wakeSpeak = useCallback(() => {
        if (!synthRef.current) return;
        const utterance = new SpeechSynthesisUtterance("");
        utterance.volume = 0;
        synthRef.current.speak(utterance);
    }, []);

    const startTemplate = useCallback((templateId) => {
        const template = (templates || LEGAL_TEMPLATES).find(t => t.id === templateId);
        if (template) {
            setActiveTemplate(template);
            setAnswers({});
            setCurrentFieldIndex(0);
            setIsConfirmationStep(false);
            
            // Dynamic format if not present
            const formatFn = template.format || ((ans) => {
                const title = template.title || template.name;
                const body = Object.entries(ans)
                    .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
                    .join('\n');
                return `${title}\n\n${body}`;
            });
            
            if (onUpdateText) onUpdateText(formatFn({}));
        }
    }, [templates, onUpdateText]);

    const startBot = useCallback((onEnd) => {
        if (!activeTemplate || currentFieldIndex === -1) {
            if (onEnd) onEnd();
            return;
        }

        const firstField = activeTemplate.fields[0];
        const templateName = activeTemplate.name || activeTemplate.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const firstFieldText = firstField.prompt ? `${firstField.name}. ${firstField.prompt}` : firstField.name;
        const introText = `Iniciando ${templateName}. ${firstFieldText}`;

        speak(introText, onEnd);
    }, [activeTemplate, currentFieldIndex, speak]);

    // Text cleaning helpers
    // --- INTELIGENCIA DE VOZ: DICCIONARIOS Y COMANDOS ---
    const LEGAL_DICTIONARY = {
        "casa ante": "causante",
        "casaante": "causante",
        "litis consorcio": "litisconsorcio",
        "litisconsorcio": "litisconsorcio",
        "pervencion": "perención",
        "perencion": "perención",
        "exordio": "exordio",
        "traslado": "traslado",
        "fojas": "fojas",
        "foja": "foja",
        "vuestra señoria": "Vuestra Señoría",
        "usía": "Usía",
        "proveer de conformidad": "Proveer de conformidad",
        "sera justicia": "Será Justicia"
    };

    const PUNCTUATION_MAP = {
        " punto y coma": ";",
        " punto aparte": ".\n",
        " punto seguido": ".",
        " punto": ".",
        " coma": ",",
        " dos puntos": ":",
        " nueva línea": "\n",
        " abrir paréntesis": "(",
        " cerrar paréntesis": ")",
        " arroba": "@"
    };

    const processTranscript = (text, fieldId) => {
        let processed = text.toLowerCase();

        // 1. Aplicar Diccionario Legal
        Object.entries(LEGAL_DICTIONARY).forEach(([key, val]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            processed = processed.replace(regex, val);
        });

        // 2. Aplicar Puntuación Automática
        Object.entries(PUNCTUATION_MAP).forEach(([key, val]) => {
            const regex = new RegExp(key, 'gi');
            processed = processed.replace(regex, val);
        });

        // 3. Limpieza de Contexto (Numéricos / Fechas)
        if (['dest_cp', 'rem_cp', 'rem_dni', 'tipo_comunicacion'].includes(fieldId)) {
            processed = processed.replace(/[^\d]/g, '');
        }

        if (['rem_fecha', 'fecha'].includes(fieldId)) {
            processed = processed.replace(/\s+(del|de|barra)\s+/g, '/');
            processed = processed.replace(/\b(uno|primero)\b/g, '1');
            processed = processed.replace(/[^\d/]/g, '');
        }

        return processed;
    };
    // ----------------------------------------------------

    const cleanNumericInput = (text) => {
        return text.replace(/[^\d]/g, '');
    };

    const cleanDateInput = (text) => {
        let processed = text.toLowerCase();
        processed = processed.replace(/\s+(del|de|barra)\s+/g, '/');
        processed = processed.replace(/\b(uno|primero)\b/g, '1');
        return processed.replace(/[^\d/]/g, '');
    };

    const finalizeTemplate = useCallback(() => {
        if (!activeTemplate) return;
        speak("Documento completado. ¿Deseas descargar el archivo?");
        setIsConfirmationStep(true);
        setCurrentFieldIndex(-1);
    }, [activeTemplate, speak]);

    const advanceToNextField = useCallback((onEnd) => {
        if (!activeTemplate || currentFieldIndex === -1) {
            if (onEnd) onEnd();
            return;
        }

        const nextIndex = currentFieldIndex + 1;
        if (nextIndex < activeTemplate.fields.length) {
            setCurrentFieldIndex(nextIndex);
            const nextField = activeTemplate.fields[nextIndex];

            // Only speak name + prompt if prompt exists. Otherwise just the name.
            let promptText = nextField.prompt ? `${nextField.name}. ${nextField.prompt}` : nextField.name;

            if (nextField.id === 'rem_nombre') {
                promptText = "Ahora los datos del remitente. " + promptText;
            }

            speak(promptText, onEnd);
        } else {
            speak("Documento completado. ¿Deseas descargar el archivo?", onEnd);
            setIsConfirmationStep(true);
            setCurrentFieldIndex(-1);
        }
    }, [activeTemplate, currentFieldIndex, speak]);

    const goToPreviousField = useCallback(() => {
        if (!activeTemplate) return;

        if (isConfirmationStep) {
            setIsConfirmationStep(false);
            const lastIndex = activeTemplate.fields.length - 1;
            setCurrentFieldIndex(lastIndex);
            const field = activeTemplate.fields[lastIndex];
            speak(field.prompt);
            return;
        }

        if (currentFieldIndex > 0) {
            const prevIndex = currentFieldIndex - 1;
            setCurrentFieldIndex(prevIndex);
            const field = activeTemplate.fields[prevIndex];
            speak(field.prompt);
        }
    }, [activeTemplate, currentFieldIndex, isConfirmationStep, speak]);

    const resetTemplate = useCallback((onEnd) => {
        if (!activeTemplate) {
            if (onEnd) onEnd();
            return;
        }
        setAnswers({});
        setCurrentFieldIndex(0);
        setIsConfirmationStep(false);
        if (onUpdateText) onUpdateText('');

        const firstField = activeTemplate.fields[0];
        speak(`Reiniciando ${activeTemplate.name}.`, () => {
            speak(firstField.prompt, onEnd);
        });
    }, [activeTemplate, speak, onUpdateText]);

    const goToField = useCallback((fieldId) => {
        if (!activeTemplate) return;
        const index = activeTemplate.fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
            setCurrentFieldIndex(index);
            setIsConfirmationStep(false);
            const field = activeTemplate.fields[index];
            speak(field.prompt);
        }
    }, [activeTemplate, speak]);


    const handleAnswer = useCallback((transcript) => {
        if (!activeTemplate) return;

        // Handle low confidence signal from speech recognition
        if (transcript === '__LOW_CONFIDENCE__') {
            speak("No he entendido. Por favor, repítelo.");
            return;
        }

        // Final confirmation logic
        if (isConfirmationStep) {
            const affirmative = ['sí', 'si', 'sí por favor', 'dale', 'bueno', 'descargar', 'ok', 'claro', 'obvio', 'descargalo'];
            const lowerTranscript = transcript.toLowerCase();

            if (affirmative.some(keyword => lowerTranscript.includes(keyword))) {
                speak("Descargando archivo en pdf.");
                if (onDownload) {
                    onDownload();
                }
                // Reset state immediately after download
                setActiveTemplate(null);
                setCurrentFieldIndex(-1);
                setIsConfirmationStep(false);
                setAnswers({});
            } else {
                speak("Entendido.");
            }
            setIsConfirmationStep(false);
            setCurrentFieldIndex(-1);
            return;
        }

        if (currentFieldIndex === -1) return;

        const currentField = activeTemplate.fields[currentFieldIndex];
        const lowerTranscript = transcript.toLowerCase().trim();

        // --- MOTOR DE COMANDOS GLOBALES ---
        if (lowerTranscript === 'siguiente' || lowerTranscript === 'continuar') {
            advanceToNextField();
            return;
        }

        if (lowerTranscript === 'atrás' || lowerTranscript === 'corregir anterior' || lowerTranscript === 'volver') {
            goToPreviousField();
            return;
        }

        if (lowerTranscript === 'repetir' || lowerTranscript === 'qué dijiste') {
            speak(currentField.prompt || currentField.name);
            return;
        }

        if (lowerTranscript === 'borrar todo' || lowerTranscript === 'limpiar campo') {
            const newAnswers = { ...answers, [currentField.id]: '' };
            setAnswers(newAnswers);
            if (onUpdateText) onUpdateText(activeTemplate.format(newAnswers));
            speak("Campo limpiado.");
            return;
        }

        // Comando de borrado simple (mantiene lógica existente mejorada)
        if (lowerTranscript === 'borrar' || lowerTranscript === 'borra') {
            if (currentField.id === 'texto') {
                const existingText = answers[currentField.id] || '';
                const words = existingText.trim().split(' ');
                if (words.length > 0) {
                    words.pop();
                    const newText = words.join(' ');
                    const newAnswers = { ...answers, [currentField.id]: newText };
                    setAnswers(newAnswers);
                    if (onUpdateText) onUpdateText(activeTemplate.format(newAnswers));
                    speak("Última palabra borrada.");
                }
            } else {
                const newAnswers = { ...answers, [currentField.id]: '' };
                setAnswers(newAnswers);
                if (onUpdateText) onUpdateText(activeTemplate.format(newAnswers));
                speak("Campo borrado.");
            }
            return;
        }

        // --- PROCESAMIENTO INTELIGENTE DEL TEXTO ---
        let processedTranscript = processTranscript(transcript, currentField.id);

        // Validaciones de seguridad
        if (['dest_cp', 'rem_cp', 'rem_dni'].includes(currentField.id) && !processedTranscript) {
            speak("No entendí los números. Por favor, repítelos.");
            return;
        }

        // Lógica especial para el cuerpo del texto (Append + Finalizado)
        if (currentField.id === 'texto') {
            const isFinished = lowerTranscript.includes('finalizado') ||
                lowerTranscript.includes('terminar') ||
                lowerTranscript.includes('listo');

            // Remove the trigger word from the text
            let cleanedText = transcript.replace(/\b(finalizado|terminar|listo)\b/gi, '');

            const existingText = answers[currentField.id] || '';
            let updatedText = '';

            if (!existingText) {
                // If it starts with newline, keep it, otherwise trim start
                updatedText = /^\s*[\n\r]/.test(cleanedText) ? cleanedText : cleanedText.trimStart();
            } else {
                // If cleanedText starts with a newline, punctuation or space, don't add extra space
                // AND don't trimStart if it's a newline
                if (/^[\n\r\t.,!?;:]/.test(cleanedText)) {
                    // Start with newline/punct: remove trailing spaces BUT KEEP NEWLINES
                    updatedText = existingText.replace(/[ \t]+$/, '') + cleanedText;
                } else {
                    // Normal text: remove trailing spaces, add space, add new text
                    updatedText = existingText.replace(/[ \t]+$/, '') + ' ' + cleanedText.trimStart();
                }
            }

            const newAnswers = { ...answers, [currentField.id]: updatedText };
            setAnswers(newAnswers);

            if (onUpdateText) {
                onUpdateText(activeTemplate.format(newAnswers));
            }

            if (isFinished) {
                speak("Texto completado. ¿Deseas descargar el archivo?");
                setIsConfirmationStep(true);
                setCurrentFieldIndex(-1);
            }
            return; // Stay in the same field or move to confirmation
        }

        // For regular fields, APPEND text too, to allow corrections or multi-part answers before timeout
        const existingVal = answers[currentField.id] || '';
        // If existing value is not empty, add a space (unless it's like a date maybe? but safer to add space)
        // Actually for fields like DNI or CP, we might want to concatenate without space if it's digit by digit,
        // but user usually says full number. Let's assume space is safer.
        // If existing value is not empty, check if we need a separator
        // If transcript starts with newline, no space needed.
        // If existingVal ends with newline, no space needed.
        const needsSpace = existingVal &&
            !existingVal.match(/\s$/) &&
            !processedTranscript.match(/^\s/);

        const separator = needsSpace ? ' ' : '';
        const newVal = existingVal + separator + processedTranscript;

        const newAnswers = { ...answers, [currentField.id]: newVal };
        setAnswers(newAnswers);

        if (onUpdateText) {
            onUpdateText(activeTemplate.format(newAnswers));
        }

        // DO NOT AUTO ADVANCE HERE. Handled by silence timer in HomePage.
    }, [activeTemplate, currentFieldIndex, answers, speak, onUpdateText, isConfirmationStep, onDownload]);

    const stopTemplate = useCallback(() => {
        setActiveTemplate(null);
        setCurrentFieldIndex(-1);
        setIsConfirmationStep(false);
        setAnswers({});
        if (synthRef.current) synthRef.current.cancel();
    }, []);

    const updateAnswers = useCallback((newAnswers) => {
        setAnswers(newAnswers);
        if (activeTemplate && onUpdateText) {
            onUpdateText(activeTemplate.format(newAnswers));
        }
    }, [activeTemplate, onUpdateText]);

    return {
        activeTemplate,
        currentField: isConfirmationStep ? { prompt: '¿Deseas descargar el archivo?' } : (activeTemplate?.fields[currentFieldIndex] || null),
        answers,
        updateAnswers,
        startTemplate,
        handleAnswer,
        stopTemplate,
        isHandsFree,
        setIsHandsFree,
        isBotSpeaking,
        advanceToNextField,
        goToPreviousField,
        resetTemplate,
        goToField,
        startBot,
        wakeSpeak,
        finalizeTemplate,
        isConfirmationStep
    };
};

export default useConversationalTemplate;
