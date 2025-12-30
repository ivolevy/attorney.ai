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

            const firstField = template.fields[0];
            speak(`Iniciando ${template.name}.`, () => {
                speak(firstField.prompt);
            });
        }
    }, [speak]);

    const handleAnswer = useCallback((transcript) => {
        if (!activeTemplate) return;

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

        const newAnswers = { ...answers, [currentField.id]: processedTranscript };
        setAnswers(newAnswers);

        if (onUpdateText) {
            onUpdateText(activeTemplate.format(newAnswers));
        }

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
        isBotSpeaking
    };
};

export default useConversationalTemplate;
