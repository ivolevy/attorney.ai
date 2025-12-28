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

            const processCommands = (transcript) => {
                let processed = transcript;
                const commands = {
                    'punto': '.',
                    'coma': ',',
                    'dos puntos': ':',
                    'punto y coma': ';',
                    'nuevo párrafo': '\n\n',
                    'nueva línea': '\n',
                    'abrir signo de interrogación': '¿',
                    'cerrar signo de interrogación': '?',
                    'comillas': '"',
                };

                Object.keys(commands).forEach(cmd => {
                    // Use regex with word boundaries, case insensitive
                    const regex = new RegExp(`\\s?\\b${cmd}\\b`, 'gi');
                    processed = processed.replace(regex, (match) => {
                        return commands[cmd];
                    });
                });

                // Post-processing: remove spaces before punctuation
                processed = processed.replace(/\s+([.,:;?])/g, '$1');

                // Capitalize first letter of sentences
                processed = processed.replace(/([.!?])\s*([a-z])/g, (match, p1, p2) => p1 + ' ' + p2.toUpperCase());

                return processed;
            };

            recognition.onresult = (event) => {
                let finalTranscriptChunk = '';
                let interimTranscriptChunk = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscriptChunk += processCommands(transcript);
                    } else {
                        interimTranscriptChunk += transcript;
                    }
                }

                if (finalTranscriptChunk) {
                    setText(prev => {
                        const base = prev.trim();
                        const addition = finalTranscriptChunk.trim();
                        if (!base) return addition.charAt(0).toUpperCase() + addition.slice(1);
                        return base + ' ' + addition;
                    });
                    setInterimText('');
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
