import { useRef, useEffect, useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useConversationalTemplate from '../hooks/useConversationalTemplate';
import { exportToPDF } from '../utils/exportUtils';
import TemplateSelector from '../components/TemplateSelector';
import RichDocumentPreview from '../components/RichDocumentPreview';
import Skeleton from '../components/Skeleton';
import { Save, FileText, Send, Download, LogOut, ChevronDown, User, ArrowLeft, Search, PlusCircle, CheckCircle, Clock, Info, Scale, PenTool, AlertCircle, MicOff, Mic, Copy, Trash2, ExternalLink } from 'lucide-react';
import { supabase, getTemplates } from '../supabaseClient';
import { LEGAL_TEMPLATES as LOCAL_TEMPLATES } from '../utils/templateData';
import '../index.css';

import SignatureExtractor from '../components/SignatureExtractor';

const HomePage = ({ user, onLogout }) => {
  // State
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Existing state from original HomePage
  const [currentTemplate, setCurrentTemplate] = useState(null);

  // Load templates from Supabase
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const dbTemplates = await getTemplates();
        
        // Merge DB templates with local templates, prioritizing DB for same IDs
        const merged = [...dbTemplates];
        const dbIds = new Set(dbTemplates.map(t => t.id));
        
        LOCAL_TEMPLATES.forEach(local => {
          if (!dbIds.has(local.id)) {
            merged.push(local);
          }
        });
        
        setTemplates(merged);
      } catch (err) {
        console.error("Failed to load templates from DB, falling back to local", err);
        setTemplates(LOCAL_TEMPLATES);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  // Helper to render dynamic templates from DB
  const renderRichFormat = (template, answers) => {
    if (!template.config?.richTemplate) {
      // Fallback for old local templates that have a function
      return typeof template.richFormat === 'function' 
        ? template.richFormat(answers) 
        : { title: template.name, body: [JSON.stringify(answers)] };
    }

    const { richTemplate } = template.config;
    
    const replaceVars = (str) => {
      if (typeof str !== 'string') return str;
      return str.replace(/{{(\w+)}}/g, (match, key) => answers[key] || '___');
    };

    return {
      title: replaceVars(richTemplate.title),
      isOfficial: true,
      isOfficialForm: template.config.isOfficialForm,
      header: replaceVars(richTemplate.header),
      body: Array.isArray(richTemplate.body) 
        ? richTemplate.body.map(replaceVars) 
        : [replaceVars(richTemplate.body)],
      footer: replaceVars(richTemplate.footer),
      rawAnswers: answers,
      backgroundUrl: template.background_url, // Pass the DB URL to the preview
      pdfUrl: template.config?.pdf_url // Pass the PDF URL for generation
    };
  };

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

  const [showSignatureExtractor, setShowSignatureExtractor] = useState(false);
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
    wakeSpeak,
    finalizeTemplate,
    isConfirmationStep
  } = useConversationalTemplate(
    templates,
    (newText) => {
      setText(newText);
    },
    () => handleDownloadRef.current && handleDownloadRef.current()
  );

  const handleDownload = () => {
    const content = activeTemplate ? renderRichFormat(activeTemplate, answers) : text;
    exportToPDF(content);
    stopListening();
  };

  const handleBack = () => {
    stopTemplate();
    stopListening();
  };

  // Update ref
  useEffect(() => {
    handleDownloadRef.current = handleDownload;
  }, [activeTemplate, answers, text, stopListening]);

  const [micManuallyStopped, setMicManuallyStopped] = useState(false);

  const startListeningWithChoice = () => {
    setMicManuallyStopped(false);
    startListening();
  };

  const stopListeningWithChoice = () => {
    setMicManuallyStopped(true);
    stopListening();
  };

  // Connect conversational logic to STT
  useEffect(() => {
    if (activeTemplate) {
      if (isBotSpeaking) {
        setAutoRestart(false);
        stopListening();
      } else {
        setAutoRestart(true);
        // If not speaking and mic wasn't manually stopped, ensure it's on
        if (!micManuallyStopped && !isListening) {
          startListening();
        }
      }

      setOnFinal((transcript) => {
        const cleaned = transcript
          .replace(/^(datos del destinatario|destinatario|remitente|tu nombre|tu apellido|dni)\s*/gi, '');
        if (cleaned) handleAnswer(cleaned);
      });
    } else {
      setAutoRestart(false);
      setOnFinal(null);
    }
  }, [activeTemplate, handleAnswer, setAutoRestart, setOnFinal, startListening, isBotSpeaking, stopListening, micManuallyStopped, isListening]);

  // Silence timer for auto-advance
  const silenceTimerRef = useRef(null);
  const wasSpeakingRef = useRef(false);

  // Handle silence and advance
  useEffect(() => {
    if (!activeTemplate || !currentField || currentField.id === 'texto' || isBotSpeaking) {
      if (isBotSpeaking) wasSpeakingRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      return;
    }

    if (interimText) {
      wasSpeakingRef.current = true;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    } else {
      if (wasSpeakingRef.current) {
        wasSpeakingRef.current = false;
        // Only advance if there's actually a value in the current field
        if (answers[currentField.id]) {
          silenceTimerRef.current = setTimeout(() => {
            advanceToNextField(() => {
              // Ensure mic stays on/restarts after bot prompt
              if (!micManuallyStopped) startListening();
            });
          }, 1500);
        }
      }
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [interimText, activeTemplate, currentField, isBotSpeaking, advanceToNextField, answers, micManuallyStopped, startListening]);



  // Handle template selection
  const handleSelectTemplate = (templateId) => {
    wakeSpeak();
    // Pre-start listening to unlock it for Safari/iOS
    startListening(); 
    startTemplate(templateId);
  };

  // Auto-start bot when template is loaded
  const botStartedRef = useRef(null);
  useEffect(() => {
    if (activeTemplate && botStartedRef.current !== activeTemplate.id) {
      botStartedRef.current = activeTemplate.id;
      // Small delay to ensure hook state settles
      const timer = setTimeout(() => startBot(), 150);
      return () => clearTimeout(timer);
    }
    if (!activeTemplate) {
      botStartedRef.current = null;
    }
  }, [activeTemplate, startBot]);

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
          <div className="error-alert" style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--danger)',
            color: 'var(--danger)', 
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            maxWidth: '600px',
            margin: '0 auto 1.5rem'
          }}>
            <AlertCircle size={24} />
            <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{error}</span>
          </div>
        )}

        {!activeTemplate ? (
          <>
            <TemplateSelector
              templates={templates}
              onSelect={handleSelectTemplate}
              activeTemplate={activeTemplate}
              currentField={currentField}
              onCancel={stopTemplate}
              isListening={isListening}
              onMicStart={startListening}
            />
            <div className="minimal-start-view" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="free-thinking-btn signature-btn"
                onClick={() => setShowSignatureExtractor(true)}
              >
                <PenTool size={18} />
                <span>Extraer Firma</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className="back-to-library-btn"
              onClick={handleBack}
              title="Volver"
              style={{ marginBottom: '0.25rem', marginLeft: '1rem' }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Volver
            </button>
            <div className={`focus-mode-layout ${isListening ? 'listening' : ''}`}>
              <div className="focus-left-area">
                <div className={`transcript-card ${isListening ? 'active' : ''}`}>
                  {isTemplateLoading ? (
                    <div className="skeleton-overlay-container">
                      <Skeleton type="document" />
                      <div className="loading-overlay-text">
                        <div className="loading-spinner-dots">
                          <span></span><span></span><span></span>
                        </div>
                        Iniciando...
                      </div>
                    </div>
                  ) : (
                    <div className="preview-scroll-container">
                      <RichDocumentPreview
                        data={renderRichFormat(activeTemplate, answers)}
                        updateAnswers={updateAnswers}
                        interimText={interimText}
                        activeFieldId={currentField?.id}
                        onNextField={advanceToNextField}
                      />
                    </div>
                  )}

                  {(interimText || isListening) && (
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
                      onClick={isListening ? stopListeningWithChoice : startListeningWithChoice}
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
                        onClick={() => {
                          if (activeTemplate) {
                            resetTemplate(() => {
                              if (!micManuallyStopped) startListening();
                            });
                          } else {
                            resetText();
                          }
                        }}
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



                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showSignatureExtractor && (
        <SignatureExtractor onClose={() => setShowSignatureExtractor(false)} />
      )}

      <div className="footer">
        Powered by <a href="https://www.linkedin.com/in/ivan-levy/" target="_blank" rel="noopener noreferrer">Ivan Levy</a>
      </div>
    </>
  );
}

export default HomePage;
