import { useState, useCallback, useRef } from 'react';
import { LEGAL_TEMPLATES } from '../utils/templateData';

const useConversationalTemplate = (onUpdateText, onDownload) => {
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [currentFieldIndex, setCurrentFieldIndex] = useState(-1);
    const [answers, setAnswers] = useState({});
    const [isHandsFree, setIsHandsFree] = useState(false);
    const [isConfirmationStep, setIsConfirmationStep] = useState(false);
    const [isBotSpeaking, setIsBotSpeaking] = useState(false);

    const synthRef = useRef(window.speechSynthesis);

    const speak = useCallback((text, onEnd) => {
        if (!synthRef.current) return;

        synthRef.current.cancel();
        setIsBotSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;

        utterance.onend = () => {
            setIsBotSpeaking(false);
            if (onEnd) onEnd();
        };

        utterance.onerror = () => {
            setIsBotSpeaking(false);
        };

        synthRef.current.speak(utterance);
    }, []);

    const startTemplate = useCallback((templateId) => {
        const template = LEGAL_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            setActiveTemplate(template);
            setAnswers({});
            setCurrentFieldIndex(0);
            setIsConfirmationStep(false);
            if (onUpdateText) onUpdateText(template.format({}));
        }
    }, [onUpdateText]);

    const startBot = useCallback(() => {
        if (!activeTemplate || currentFieldIndex === -1) return;

        const firstField = activeTemplate.fields[0];
        speak(`Iniciando ${activeTemplate.name}.`, () => {
            speak(firstField.prompt);
        });
    }, [activeTemplate, currentFieldIndex, speak]);

    // Text cleaning helpers
    const cleanNumericInput = (text) => {
        // Keep only digits
        return text.replace(/[^\d]/g, '');
    };

    const cleanDateInput = (text) => {
        let processed = text.toLowerCase();
        // Replace common verbal separators
        processed = processed.replace(/\s+(del|de|barra)\s+/g, '/');
        // Handle verbal "uno" or "primero"
        processed = processed.replace(/\b(uno|primero)\b/g, '1');
        // Keep only digits and slash
        return processed.replace(/[^\d/]/g, '');
    };

    const finalizeTemplate = useCallback(() => {
        if (!activeTemplate) return;
        speak("Documento completado. ¿Deseas descargar el archivo?");
        setIsConfirmationStep(true);
        setCurrentFieldIndex(-1);
    }, [activeTemplate, speak]);

    const advanceToNextField = useCallback(() => {
        if (!activeTemplate || currentFieldIndex === -1) return;

        const nextIndex = currentFieldIndex + 1;
        if (nextIndex < activeTemplate.fields.length) {
            setCurrentFieldIndex(nextIndex);
            const nextField = activeTemplate.fields[nextIndex];

            let message = nextField.prompt;
            // Transition cue for sender data
            if (nextField.id === 'rem_nombre') {
                message = "Ahora los datos del remitente. " + message;
            }

            speak(message);
        } else {
            // Trigger completion immediately
            speak("Documento completado. ¿Deseas descargar el archivo?");
            setIsConfirmationStep(true);
            setCurrentFieldIndex(-1);
        }
    }, [activeTemplate, currentFieldIndex, speak]);

    const goToPreviousField = useCallback(() => {
        if (!activeTemplate) return;

        // If we are in confirmation step, go back to the last field
        if (isConfirmationStep) {
            setIsConfirmationStep(false);
            const lastIndex = activeTemplate.fields.length - 1;
            setCurrentFieldIndex(lastIndex);
            speak(activeTemplate.fields[lastIndex].prompt);
            return;
        }

        if (currentFieldIndex > 0) {
            const prevIndex = currentFieldIndex - 1;
            setCurrentFieldIndex(prevIndex);
            speak(activeTemplate.fields[prevIndex].prompt);
        }
    }, [activeTemplate, currentFieldIndex, isConfirmationStep, speak]);

    const resetTemplate = useCallback(() => {
        if (!activeTemplate) return;
        setAnswers({});
        setCurrentFieldIndex(0);
        setIsConfirmationStep(false);
        if (onUpdateText) onUpdateText('');
        speak(`Reiniciando ${activeTemplate.name}.`, () => {
            speak(activeTemplate.fields[0].prompt);
        });
    }, [activeTemplate, speak, onUpdateText]);

    const goToField = useCallback((fieldId) => {
        if (!activeTemplate) return;
        const index = activeTemplate.fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
            setCurrentFieldIndex(index);
            setIsConfirmationStep(false);
            speak(activeTemplate.fields[index].prompt);
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
        const lowerTranscript = transcript.toLowerCase();

        // Voice command: CLEAR / BORRAR
        if (lowerTranscript === 'borrar' || lowerTranscript === 'corregir' || lowerTranscript === 'limpiar' || lowerTranscript === 'borra') {
            if (currentField.id === 'texto') {
                // For 'texto' field, remove the last segment
                const existingText = answers[currentField.id] || '';
                const segments = existingText.split(' ').filter(s => s.trim() !== '');
                if (segments.length > 0) {
                    segments.pop(); // Remove the last segment
                    const newText = segments.join(' ');
                    const newAnswers = { ...answers, [currentField.id]: newText };
                    setAnswers(newAnswers);
                    if (onUpdateText) onUpdateText(activeTemplate.format(newAnswers));
                    speak("Último segmento borrado.");
                } else {
                    speak("El campo de texto ya está vacío.");
                }
            } else {
                // For other fields, clear the entire field
                const newAnswers = { ...answers, [currentField.id]: '' };
                setAnswers(newAnswers);
                if (onUpdateText) onUpdateText(activeTemplate.format(newAnswers));
                speak(`Campo ${currentField.name} borrado.`);
            }
            return;
        }

        let processedTranscript = transcript;

        // Strict numeric formatting for CP and DNI
        if (['dest_cp', 'rem_cp', 'rem_dni'].includes(currentField.id)) {
            processedTranscript = cleanNumericInput(transcript);
            if (!processedTranscript && transcript.trim().length > 0) {
                speak("No he entendido. Por favor di sólo números.");
                return;
            }
        }

        // Strict date formatting
        if (['rem_fecha', 'fecha'].includes(currentField.id)) {
            processedTranscript = cleanDateInput(transcript);
            if (!processedTranscript && transcript.trim().length > 0) {
                speak("No he entendido. Por favor di una fecha válida.");
                return;
            }
        }

        // Custom filter for communication type (extract number)
        if (currentField.id === 'tipo_comunicacion') {
            const verbalMap = { 'uno': '1', 'una': '1', 'dos': '2', 'tres': '3' };

            Object.keys(verbalMap).forEach(key => {
                if (lowerTranscript.includes(key)) processedTranscript = verbalMap[key];
            });

            if (processedTranscript === transcript) {
                const match = transcript.match(/\d/);
                if (match) processedTranscript = match[0];
            }
        }

        // Special logic for long body text (keep appending until "finalizado")
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
        const separator = existingVal ? ' ' : '';
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
        finalizeTemplate,
        isConfirmationStep
    };
};

export default useConversationalTemplate;
