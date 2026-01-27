import { useRef, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useConversationalTemplate from '../hooks/useConversationalTemplate';
import { exportToPDF, exportToWord } from '../utils/exportUtils';
import TemplateSelector from '../components/TemplateSelector';
import RichDocumentPreview from '../components/RichDocumentPreview';
import {
  Mic, MicOff, Trash2, Copy, AlertCircle, FileText, FileDown,
  ExternalLink, Scale
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
    updateAnswers
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
        setAutoRestart(true);
        startListening();
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

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && isListening) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [text, isListening]);

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
        <div className="legal-logo">
          <Scale size={48} color="var(--accent-green)" strokeWidth={1.5} />
        </div>
        <h1>Lexia</h1>

        {error && (
          <div style={{ color: 'var(--danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} />
            <span>{error === 'not-allowed' ? 'Acceso al micrófono denegado' : 'Error: ' + error}</span>
          </div>
        )}

        <div className={`transcript-card ${isListening ? 'active' : ''}`}>
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
              />
            ) : (
              <textarea
                ref={textareaRef}
                className="transcript-textarea"
                value={text}
                onChange={handleChange}
                placeholder="Presiona el micrófono y comienza a hablar, o elige una plantilla abajo..."
                spellCheck="false"
              />
            )}
          </div>

          {(interimText || isListening) && !activeTemplate && (
            <div className="interim-display">
              {interimText ? interimText : <span style={{ opacity: 0.3 }}>...</span>}
            </div>
          )}
        </div>

        <div className="controls">
          <div className="control-item">
            <button className="icon-btn" onClick={resetText} title="Borrar todo" disabled={!text}>
              <Trash2 size={24} />
            </button>
            <span className="control-label">Borrar</span>
          </div>

          <div className="control-item">
            <button className="icon-btn" onClick={handleDownload} title="Exportar a PDF" disabled={!text && !activeTemplate}>
              <FileText size={24} />
            </button>
            <span className="control-label">PDF</span>
          </div>

          <div className="control-item">
            <button
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              title={isListening ? "Pausar" : "Escuchar"}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
            <span className="control-label" style={{ color: isListening ? 'var(--accent-green)' : '' }}>
              {isListening ? 'Pausar' : 'Dictar'}
            </span>
          </div>

          <div className="control-item">
            <button className="icon-btn" onClick={() => exportToWord(activeTemplate ? activeTemplate.richFormat(answers) : text)} title="Exportar a Word" disabled={!text}>
              <FileDown size={24} />
            </button>
            <span className="control-label">Word</span>
          </div>

          <div className="control-item">
            <button className="icon-btn" onClick={handleCopy} title="Copiar texto" disabled={!text}>
              <Copy size={24} />
            </button>
            <span className="control-label">Copiar</span>
          </div>
        </div>

        <div className="voice-commands-info">
          Comandos: "punto", "coma", "dos puntos", "nuevo párrafo", "borrar"
          {activeTemplate && currentField?.id === 'texto' && ', "finalizado"'}
        </div>

        <div className="quick-actions-panel">
          <h3>Acciones Rápidas</h3>
          <div className="action-buttons">
            <button className="action-btn wa-btn" onClick={openWhatsApp} disabled={!text}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              whatsapp
            </button>
            <button className="action-btn ai-btn" onClick={openChatGPT} disabled={!text}>
              <img src="/12222560.png" alt="ChatGPT" width="20" height="20" style={{ objectFit: 'contain' }} />
              chatgpt
            </button>
            <button className="action-btn docs-btn" onClick={openGoogleDocs} disabled={!text}>
              <ExternalLink size={20} />
              google docs
            </button>
          </div>
        </div>

        <TemplateSelector
          onSelect={startTemplate}
          activeTemplate={activeTemplate}
          currentField={currentField}
          onCancel={stopTemplate}
        />
      </div>

      <div className="footer">
        Powered by <a href="https://www.linkedin.com/in/ivan-levy/" target="_blank" rel="noopener noreferrer">Ivan Levy</a>
      </div>
    </>
  );
}

export default HomePage;
