import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechRecognition = () => {
    const [text, setText] = useState('');
    const [interimText, setInterimText] = useState('');
    const [isListening, _setIsListening] = useState(false);
    const isListeningRef = useRef(false);

    const setIsListening = useCallback((val) => {
        isListeningRef.current = val;
        _setIsListening(val);
    }, []);
    const [error, setError] = useState(null);
    const [autoRestart, _setAutoRestart] = useState(false);
    const autoRestartRef = useRef(autoRestart);

    const setAutoRestart = useCallback((val) => {
        autoRestartRef.current = val;
        _setAutoRestart(val);
    }, []);

    // Use ref for recognition to avoid dependency cycles and re-instantiation
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'es-AR';

            const processCommands = (transcript) => {
                let processed = transcript;
                const commands = {
                    'punto seguido': '. ',
                    'punto aparte': '\n\n',
                    'punto y aparte': '\n\n',
                    'párrafo aparte': '\n\n',
                    'parrafo aparte': '\n\n',
                    'punto final': '.',
                    'punto': '.',
                    'coma': ',',
                    'dos puntos': ':',
                    'punto y coma': ';',
                    'nuevo párrafo': '\n\n',
                    'nuevo parrafo': '\n\n',
                    'párrafo nuevo': '\n\n',
                    'parrafo nuevo': '\n\n',
                    'puntos suspensivos': '...',
                    'nueva línea': '\n',
                    'nueva linea': '\n',
                    'abrir signo de interrogación': '¿',
                    'cerrar signo de interrogación': '?',
                    'signo de pregunta': '?',
                    'signo de interrogación': '?',
                    'signo de exclamación': '!',
                    'punto de exclamación': '!',
                    'abrir paréntesis': '(',
                    'cerrar paréntesis': ')',
                    'comillas': '"',
                    'guion': '-',
                    'guión': '-',
                    'guion medio': '-',
                    'barra': '/',

                };

                // Verbal numbers to digits (simple common ones)
                const verbalNumbers = {
                    'cero': '0', 'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5', 'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9',
                    'diez': '10', 'once': '11', 'doce': '12', 'trece': '13', 'catorce': '14', 'quince': '15', 'dieciseis': '16', 'diecisiete': '17', 'dieciocho': '18', 'diecinueve': '19',
                    'veinte': '20', 'veintiuno': '21', 'veintidós': '22', 'veintitrés': '23', 'veinticuatro': '24', 'veinticinco': '25', 'veintiseis': '26', 'veintisiete': '27', 'veintiocho': '28', 'veintinueve': '29',
                    'treinta': '30', 'cuarenta': '40', 'cincuenta': '50', 'sesenta': '60', 'setenta': '70', 'ochenta': '80', 'noventa': '90',
                    'cien': '100', 'mil': '1000'
                };

                // Replace specific combined forms like "cuarenticuatro"
                processed = processed.replace(/\b(cuarenticuatro|cuarenticinco|cuarentiseis|cuarentisiete|cuarentiocho|cuarentinueve)\b/gi, (match) => {
                    const map = { 'cuarenticuatro': '44', 'cuarenticinco': '45', 'cuarentiseis': '46', 'cuarentisiete': '47', 'cuarentiocho': '48', 'cuarentinueve': '49' };
                    return map[match.toLowerCase()] || match;
                });

                // Replace "número y número" (e.g., "cuarenta y cuatro")
                processed = processed.replace(/\b(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)\s+y\s+(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/gi, (match, p1, p2) => {
                    const ten = verbalNumbers[p1.toLowerCase()];
                    const unit = verbalNumbers[p2.toLowerCase()];
                    return (parseInt(ten) + parseInt(unit)).toString();
                });

                // Apply commands replacements
                Object.keys(commands).forEach(cmd => {
                    // Use more flexible regex: \s* instead of \s? to handle multiple spaces if any
                    // Also guard against partial matches where necessary, but \b should handle it.
                    // We escape special regex chars in cmd just in case (though our list is safe currently)
                    const regex = new RegExp(`(^|\\s+)${cmd}\\b`, 'gi');
                    processed = processed.replace(regex, (match, prefix) => {
                        return (prefix.includes('\n') ? prefix : ' ') + commands[cmd];
                    });
                });

                // NEW: Date formatting (15 del 2 -> 15/2, 5 de mayo -> 5/5, 15 del 12 del 25 -> 15/12/25)
                const months = {
                    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
                    'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
                };

                // Pattern with year: "15 del 12 del 25" OR "15/12 del 25"
                processed = processed.replace(/(\d+)(?:\s+(?:del|de|barra)\s+|[/])(\d+|[a-z]+)(?:\s+(?:del|de|barra)\s+|[/])(\d+)/gi, (match, day, month, year) => {
                    let mIdx = month.toLowerCase();
                    let mNum = months[mIdx] || month;
                    return `${day}/${mNum}/${year}`;
                });

                // Pattern without year: "15 del 2" OR "5 de mayo"
                processed = processed.replace(/(\d+)\s+(del|de)\s+(\d+|[a-z]+)\b/gi, (match, day, prep, month) => {
                    let m = month.toLowerCase();
                    if (months[m]) {
                        return `${day}/${months[m]}`;
                    } else if (!isNaN(parseInt(month))) {
                        return `${day}/${month}`;
                    }
                    return match;
                });

                // NEW: Spelling corrections (e.g., "Levy con y" -> "Levy", "Levi con igriega" -> "Levy")
                processed = processed.replace(/(\w+)[iy]?\s+con\s+(i\s*griega|igriega|y)\b/gi, (match, word) => {
                    const lowWord = word.toLowerCase();
                    if (lowWord.endsWith('i')) {
                        return word.slice(0, -1) + 'y';
                    }
                    if (lowWord.endsWith('y')) {
                        return word;
                    }
                    return word + 'y';
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

                let hasLowConfidence = false;

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscriptChunk += processCommands(transcript);
                        // Check confidence
                        const confidence = event.results[i][0].confidence;
                        if (confidence && confidence < 0.6) {
                            hasLowConfidence = true;
                        }
                    } else {
                        interimTranscriptChunk += transcript;
                    }
                }

                if (finalTranscriptChunk) {
                    setText(prev => {
                        const base = prev;
                        const addition = finalTranscriptChunk;

                        // Helper to capitalize first valid char
                        const capitalizeFirstChar = (str) => {
                            // Find first alphanumeric char
                            return str.replace(/^(\s*)([a-z\u00C0-\u00FF])/i, (match, separator, char) => {
                                return separator + char.toUpperCase();
                            });
                        };

                        // 1. If we are just starting or previous text is empty/whitespace
                        if (!base || !base.trim()) {
                            // Just capitalize existing addition, preserve its leading structure (like \n)
                            return capitalizeFirstChar(addition);
                        }

                        // 2. Determine separator
                        const endsWithWhitespace = /[\s\n]$/.test(base);
                        // If base ends in whitespace, we don't need to add another space, unless it's just a standard word boundary
                        // But usually recognition adds spaces. Let's start safe. 
                        const separator = endsWithWhitespace ? '' : ' ';

                        // 3. Check context for capitalization
                        // Ends in . ! ? or matches a newline structure at the end
                        const isNewSentence = /[.!?]\s*$/.test(base) || /\n\s*$/.test(base);

                        let finalAddition = addition;
                        if (isNewSentence) {
                            finalAddition = capitalizeFirstChar(addition);
                            // If base ends in newline, we likely don't want a leading space in addition if it exists
                            if (/\n\s*$/.test(base)) {
                                finalAddition = finalAddition.trimStart(); // Remove leading space if we are on a new line
                            }
                        }

                        // 4. Join
                        return base + separator + finalAddition;
                    });

                    if (recognitionRef.current.onFinalCallback) {
                        if (hasLowConfidence) {
                            recognitionRef.current.onFinalCallback('__LOW_CONFIDENCE__');
                        } else {
                            recognitionRef.current.onFinalCallback(finalTranscriptChunk.trim());
                        }
                    }

                    setInterimText('');
                } else {
                    setInterimText(interimTranscriptChunk);
                }
            };

            recognition.onerror = (event) => {
                // Ignore 'aborted' and 'no-speech' to prevent error state spam and loops
                if (event.error === 'no-speech' || event.error === 'aborted') {
                    return;
                }
                console.error("Speech usage error", event.error);
                setError(event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                if (autoRestartRef.current) {
                    // Small delay to prevent rapid-fire loops on certain browsers/error states
                    setTimeout(() => {
                        if (autoRestartRef.current) {
                            try {
                                recognition.start();
                                setIsListening(true);
                            } catch (e) {
                                console.error("Auto-restart failed", e);
                                setIsListening(false);
                            }
                        }
                    }, 100);
                } else {
                    setIsListening(false);
                }
            };

            recognitionRef.current = recognition;
        } else {
            // Logic handled by isSupported check below
        }
    }, [setIsListening]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListeningRef.current) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setError(null);
            } catch (err) {
                console.error("Manual start failed", err);
            }
        }
    }, [setIsListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListeningRef.current) {
            try {
                recognitionRef.current.stop();
                setIsListening(false);
            } catch (err) {
                console.error("Manual stop failed", err);
            }
        }
    }, [setIsListening]);

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
        error,
        setAutoRestart,
        setOnFinal: (cb) => {
            if (recognitionRef.current) {
                recognitionRef.current.onFinalCallback = cb;
            }
        }
    };
};

export default useSpeechRecognition;
