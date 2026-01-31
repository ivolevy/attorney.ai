import { useRef, useEffect, useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useConversationalTemplate from '../hooks/useConversationalTemplate';
import { exportToPDF } from '../utils/exportUtils';
import TemplateSelector from '../components/TemplateSelector';
import RichDocumentPreview from '../components/RichDocumentPreview';
import Skeleton from '../components/Skeleton';
import {
  Mic, MicOff, Trash2, Copy, AlertCircle, FileText, FileDown,
  ExternalLink, Scale, CheckCircle2
} from 'lucide-react';
import '../index.css';

function HomePage() {
  const {
    text,
    setText,
    interimText,
    isListening,
    startListening,
    stopListening,
    resetText,
    hasSupport,
    error,
    setAutoRestart,
    setOnFinal
  } = useSpeechRecognition();

  const [showFreeText, setShowFreeText] = useState(false);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState(null);

  // Ref to break circular dependency between useConversationalTemplate and handleDownload
  const handleDownloadRef = useRef(null);

  const {
    activeTemplate,
    currentField,
    answers,
    startTemplate,
    handleAnswer,
    stopTemplate,
    isBotSpeaking,
    updateAnswers,
    advanceToNextField,
    goToPreviousField,
    resetTemplate,
    startBot,
    finalizeTemplate,
    isConfirmationStep
  } = useConversationalTemplate(
    (newText) => {
      setText(newText);
    },
    () => handleDownloadRef.current && handleDownloadRef.current()
  );

  const handleDownload = () => {
    const content = activeTemplate ? activeTemplate.richFormat(answers) : text;
    exportToPDF(content);
    stopListening();
  };

  const handleBack = () => {
    setShowFreeText(false);
    stopTemplate();
    stopListening();
  };

  const handleStartFreeThinking = () => {
    setShowFreeText(true);
    // Removed automatic startListening()
  };

  // Update ref
  useEffect(() => {
    handleDownloadRef.current = handleDownload;
  }, [activeTemplate, answers, text, stopListening]);

  // Connect conversational logic to STT
  useEffect(() => {
    if (activeTemplate) {
      // Don't listen while the bot is speaking to avoid feedback loops
      if (isBotSpeaking) {
        setAutoRestart(false);
        stopListening();
      } else {
        // Only auto-restart if the user had the mic enabled (isListening)
        // or just set auto-restart to true so it persists IF they turn it on.
        setAutoRestart(true);
      }

      setOnFinal((transcript) => {
        // Clean transcript from common bot-echoed words
        const cleaned = transcript
          .replace(/^(datos del destinatario|destinatario|remitente|tu nombre|tu apellido|dni)\s*/gi, '')
          .trim();
        if (cleaned) handleAnswer(cleaned);
      });
    } else {
      setAutoRestart(false);
      setOnFinal(null);
    }
  }, [activeTemplate, handleAnswer, setAutoRestart, setOnFinal, startListening, isBotSpeaking, stopListening]);

  // Silence timer for auto-advance
  const silenceTimerRef = useRef(null);
  const wasSpeakingRef = useRef(false);

  useEffect(() => {
    // If bot is speaking or invalid state, clear timer
    if (!activeTemplate || !currentField || currentField.id === 'texto' || isBotSpeaking) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      return;
    }

    if (interimText) {
      // User is speaking
      wasSpeakingRef.current = true;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    } else {
      // User is not speaking (interimText empty)
      if (wasSpeakingRef.current) {
        // We just finished speaking
        wasSpeakingRef.current = false;

        // Only set timer if we have some answer for the current field
        if (answers[currentField.id]) {
          silenceTimerRef.current = setTimeout(() => {
            advanceToNextField();
          }, 1500);
        }
      }
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [interimText, activeTemplate, currentField, isBotSpeaking, advanceToNextField, answers]);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && isListening) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text, isListening]);

  // Handle Loading Transition for Template Start
  useEffect(() => {
    let timer;
    if (isTemplateLoading && pendingTemplateId) {
      // 1. Show skeleton for 1s
      timer = setTimeout(() => {
        startTemplate(pendingTemplateId);
        setIsTemplateLoading(false);
        setPendingTemplateId(null);

        // 2. Wait 1s with document visible before bot speaks
        setTimeout(() => {
          startBot();
        }, 1000);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isTemplateLoading, pendingTemplateId, startTemplate, startBot]);

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openChatGPT = () => {
    const url = `https://chatgpt.com/?q=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openGoogleDocs = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        window.open('https://docs.new', '_blank');
      });
    } else {
      window.open('https://docs.new', '_blank');
    }
  };

  if (!hasSupport) {
    return (
      <div className="container">
        <h1 style={{ color: 'var(--danger)' }}>Navegador no soportado</h1>
        <p className="subtitle">Lo sentimos, tu navegador no soporta la API de reconocimiento de voz.</p>
      </div>
    );
  }

  return (
    <>
      <div className="ambient-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="container">


        {error && (
          <div style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} />
            <span>{error === 'not-allowed' ? 'Acceso al micrófono denegado' : 'Error: ' + error}</span>
          </div>
        )}

        {!(activeTemplate || showFreeText || isTemplateLoading) ? (
          <>
            <TemplateSelector
              onSelect={(id) => {
                setShowFreeText(false);
                setIsTemplateLoading(true);
                setPendingTemplateId(id);
              }}
              activeTemplate={activeTemplate}
              currentField={currentField}
              onCancel={stopTemplate}
            />
            <div className="minimal-start-view">
              <button className="free-thinking-btn" onClick={handleStartFreeThinking}>
                <Scale size={18} />
                <span>Pensar libremente</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`focus-mode-layout ${isListening ? 'listening' : ''}`}>
              <div className="focus-left-area">
                <div className={`transcript-card ${isListening ? 'active' : ''}`}>
                  {isTemplateLoading ? (
                    <Skeleton type="document" />
                  ) : (
                    <div className="preview-scroll-container">
                      {activeTemplate ? (
                        <RichDocumentPreview
                          data={activeTemplate ? activeTemplate.richFormat(answers) : {
                            title: 'Documento en Proceso',
                            body: [text]
                          }}
                          updateAnswers={updateAnswers}
                          interimText={interimText}
                          activeFieldId={currentField?.id}
                          onNextField={advanceToNextField}
                        />
                      ) : (
                        <textarea
                          ref={textareaRef}
                          className="transcript-textarea"
                          value={text}
                          onChange={handleChange}
                          placeholder="Escribe o dicta libremente tus ideas..."
                          spellCheck="false"
                          autoFocus
                        />
                      )}
                    </div>
                  )}

                  {(interimText || isListening) && !activeTemplate && (
                    <div className="interim-display">
                      {interimText ? interimText : <span style={{ opacity: 0.3 }}>...</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="focus-right-controls">
                <div className="controls-stack">
                  <div className="main-mic-control">
                    <button
                      className={`mic-button-large ${isListening ? 'listening' : ''}`}
                      onClick={isListening ? stopListening : startListening}
                      title={isListening ? "Pausar" : "Escuchar"}
                    >
                      {isListening ? <MicOff size={40} /> : <Mic size={40} />}
                    </button>
                    <span className="control-label-main">
                      {isListening ? 'Escuchando...' : 'Toca para dictar'}
                    </span>

                    {activeTemplate && !isTemplateLoading && (
                      <button
                        className={`finalize-btn-side ${isConfirmationStep ? 'completed' : ''}`}
                        onClick={finalizeTemplate}
                        disabled={isConfirmationStep}
                        title={isConfirmationStep ? "Documento finalizado" : "Finalizar dictado y descargar"}
                      >
                        <div className={`red-circle-btn ${isConfirmationStep ? 'green' : ''}`}></div>
                        <span>{isConfirmationStep ? "Finalizado" : "Finalizar manualmente"}</span>
                      </button>
                    )}
                  </div>

                  <div className="secondary-controls-grid">
                    <div className="control-item">
                      <button
                        className="icon-btn"
                        onClick={handleBack}
                        title="Volver a la Librería"
                      >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                      </button>
                      <span className="control-label">Volver</span>
                    </div>

                    <div className="control-item">
                      <button
                        className="icon-btn"
                        onClick={activeTemplate ? resetTemplate : resetText}
                        title="Reiniciar"
                      >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                      </button>
                      <span className="control-label">Reiniciar</span>
                    </div>

                    <div className="control-item">
                      <button className="icon-btn" onClick={handleDownload} title="Exportar a PDF" disabled={!text && !activeTemplate}>
                        <FileText size={24} />
                      </button>
                      <span className="control-label">PDF</span>
                    </div>



                    {!activeTemplate && (
                      <div className="control-item">
                        <button className="icon-btn" onClick={handleCopy} title="Copiar texto" disabled={!text}>
                          <Copy size={24} />
                        </button>
                        <span className="control-label">Copiar</span>
                      </div>
                    )}

                    {!activeTemplate && (
                      <div className="control-item">
                        <button className="icon-btn danger" onClick={handleBack} title="Cerrar">
                          <Trash2 size={24} />
                        </button>
                        <span className="control-label">Cerrar</span>
                      </div>
                    )}
                  </div>

                  <div className="voice-commands-info focus-info">
                    Comandos: "punto", "coma", "nuevo párrafo", "borrar"
                    {activeTemplate && currentField?.id === 'texto' && ', "finalizado"'}
                  </div>

                  {/* Conditionally hide quick actions panel */}
                  {!activeTemplate && !showFreeText && (
                    <div className="quick-actions-panel focus-panel">
                      <h3>Acciones Rápidas</h3>
                      <div className="action-buttons horizontal">
                        <button className="action-btn wa-btn mini" onClick={openWhatsApp} disabled={!text}>
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </button>
                        <button className="action-btn ai-btn mini" onClick={openChatGPT} disabled={!text}>
                          <img src="/12222560.png" alt="ChatGPT" width="16" height="16" style={{ objectFit: 'contain' }} />
                        </button>
                        <button className="action-btn docs-btn mini" onClick={openGoogleDocs} disabled={!text}>
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="footer">
        Powered by <a href="https://www.linkedin.com/in/ivan-levy/" target="_blank" rel="noopener noreferrer">Ivan Levy</a>
      </div>
    </>
  );
}

export default HomePage;
