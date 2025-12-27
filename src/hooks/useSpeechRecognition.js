import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechRecognition = () => {
    const [text, setText] = useState('');
    const [interimText, setInterimText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);

    // Use ref for recognition to avoid dependency cycles and re-instantiation
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'es-ES';

            recognition.onresult = (event) => {
                let finalTranscriptChunk = '';
                let interimTranscriptChunk = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscriptChunk += event.results[i][0].transcript;
                    } else {
                        interimTranscriptChunk += event.results[i][0].transcript;
                    }
                }

                if (finalTranscriptChunk) {
                    setText(prev => prev + ' ' + finalTranscriptChunk);
                    setInterimText(''); // Clear interim once verified
                } else {
                    setInterimText(interimTranscriptChunk);
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech usage error", event.error);
                if (event.error === 'no-speech') {
                    return;
                }
                setError(event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                // When it ends, check if we should still be listening (e.g. if it stopped due to silence but user didn't click stop)
                // For simplicity in this demo, we just stop the UI state.
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            // Logic handled by isSupported check below
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setError(null);
            } catch (err) {
                console.error(err);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    const resetText = useCallback(() => {
        setText('');
        setInterimText('');
    }, []);

    // Sync check for support
    const isSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

    return {
        text,
        setText, // Exposed for manual editing
        interimText,
        isListening,
        startListening,
        stopListening,
        resetText,
        hasSupport: isSupported,
        error
    };
};

export default useSpeechRecognition;
