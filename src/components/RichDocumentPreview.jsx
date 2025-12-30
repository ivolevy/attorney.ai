import React from 'react';
import tclBg from '../assets/library/tcl30/tcl30web.png';

const RichDocumentPreview = ({ data, updateAnswers, interimText, activeFieldId }) => {
    if (!data) return null;

    const { title, header, body, footer, isOfficial, tipo, rawAnswers } = data;

    const handleFieldChange = (fieldId, value) => {
        if (updateAnswers && rawAnswers) {
            updateAnswers({
                ...rawAnswers,
                [fieldId]: value
            });
        }
    };

    const getValue = (fieldId, baseValue) => {
        const val = baseValue || '';
        if (activeFieldId === fieldId && interimText) {
            // Append interim text visually
            const separator = (val && !val.endsWith(' ') && !interimText.startsWith('\n')) ? ' ' : '';
            return val + separator + interimText;
        }
        return val;
    };

    const renderContent = () => {
        if (isOfficial && (title.includes('TCL 30') || title.includes('TCL +30'))) {
            return (
                <div className="tcl-pixel-perfect">
                    <img src={tclBg} alt="TCL Form" className="tcl-bg-image" />
                    
                    {/* OVERLAY FIELDS */}
                    <div className="tcl-overlay">
                        {/* DESTINATARIO */}
                        <input 
                            className={`field-abs-input ${activeFieldId === 'dest_nombre' ? 'active-field' : ''}`} 
                            style={{ top: '11.8%', left: '8.0%', width: '35%' }}
                            value={getValue('dest_nombre', rawAnswers?.dest_nombre)}
                            onChange={(e) => handleFieldChange('dest_nombre', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'dest_ramo' ? 'active-field' : ''}`}
                            style={{ top: '15.5%', left: '8.0%', width: '35%' }}
                            value={getValue('dest_ramo', rawAnswers?.dest_ramo)}
                            onChange={(e) => handleFieldChange('dest_ramo', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'dest_domicilio' ? 'active-field' : ''}`}
                            style={{ top: '19.1%', left: '8.0%', width: '28%' }}
                            value={getValue('dest_domicilio', rawAnswers?.dest_domicilio)}
                            onChange={(e) => handleFieldChange('dest_domicilio', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'dest_cp' ? 'active-field' : ''}`}
                            style={{ top: '19.1%', left: '36.5%', width: '6%' }}
                            value={getValue('dest_cp', rawAnswers?.dest_cp)}
                            onChange={(e) => handleFieldChange('dest_cp', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'dest_localidad' ? 'active-field' : ''}`}
                            style={{ top: '22.8%', left: '8.0%', width: '18%' }}
                            value={getValue('dest_localidad', rawAnswers?.dest_localidad)}
                            onChange={(e) => handleFieldChange('dest_localidad', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'dest_provincia' ? 'active-field' : ''}`}
                            style={{ top: '22.8%', left: '32.5%', width: '18%' }}
                            value={getValue('dest_provincia', rawAnswers?.dest_provincia)}
                            onChange={(e) => handleFieldChange('dest_provincia', e.target.value)}
                            placeholder=""
                        />

                        {/* REMITENTE */}
                        <input 
                            className={`field-abs-input ${activeFieldId === 'rem_nombre' ? 'active-field' : ''}`}
                            style={{ top: '11.8%', left: '56.0%', width: '35%' }}
                            value={getValue('rem_nombre', rawAnswers?.rem_nombre)}
                            onChange={(e) => handleFieldChange('rem_nombre', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'rem_dni' ? 'active-field' : ''}`}
                            style={{ top: '15.5%', left: '56.0%', width: '24%' }}
                            value={getValue('rem_dni', rawAnswers?.rem_dni)}
                            onChange={(e) => handleFieldChange('rem_dni', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'rem_fecha' ? 'active-field' : ''}`}
                            style={{ top: '15.5%', left: '83.0%', width: '10%' }}
                            value={getValue('rem_fecha', rawAnswers?.rem_fecha)}
                            onChange={(e) => handleFieldChange('rem_fecha', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'rem_domicilio' ? 'active-field' : ''}`}
                            style={{ top: '19.1%', left: '56.0%', width: '28%' }}
                            value={getValue('rem_domicilio', rawAnswers?.rem_domicilio)}
                            onChange={(e) => handleFieldChange('rem_domicilio', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'rem_cp' ? 'active-field' : ''}`}
                            style={{ top: '19.1%', left: '85.0%', width: '6%' }}
                            value={getValue('rem_cp', rawAnswers?.rem_cp)}
                            onChange={(e) => handleFieldChange('rem_cp', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'rem_localidad' ? 'active-field' : ''}`}
                            style={{ top: '22.8%', left: '56.0%', width: '18%' }}
                            value={getValue('rem_localidad', rawAnswers?.rem_localidad)}
                            onChange={(e) => handleFieldChange('rem_localidad', e.target.value)}
                            placeholder=""
                        />
                        <input 
                            className={`field-abs-input ${activeFieldId === 'rem_provincia' ? 'active-field' : ''}`}
                            style={{ top: '22.8%', left: '81.0%', width: '15.5%' }}
                            value={getValue('rem_provincia', rawAnswers?.rem_provincia)}
                            onChange={(e) => handleFieldChange('rem_provincia', e.target.value)}
                            placeholder=""
                        />

                        {/* CUERPO - Sector Sombreado */}
                        <textarea 
                            className={`field-abs-textarea ${activeFieldId === 'texto' ? 'active-field' : ''}`}
                            style={{ top: '30.0%', left: '8.0%', width: '81.5%', height: '54.0%' }}
                            value={getValue('texto', rawAnswers?.texto)}
                            onChange={(e) => handleFieldChange('texto', e.target.value)}
                            placeholder=""
                        />

                        {activeFieldId === 'texto' && (
                            <div className="voice-guidance-popup">
                                <div className="pulse-recorder"></div>
                                <span>Di <strong>"Finalizado"</strong> para terminar</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="document-standard">
                <div className="document-header">
                    <pre>{header}</pre>
                </div>
                <div className="document-body">
                    {body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {footer && (
                    <div className="document-footer">
                        <pre>{footer}</pre>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="rich-preview-container">
            <div className="document-page">
                <div className="official-stamp">BORRADOR</div>
                <h2 className="preview-title">{title}</h2>
                <div className="document-content-area">
                    {renderContent()}
                </div>
            </div>

            <style>{`
                .rich-preview-container {
                    background: #1a1a1a;
                    padding: 1rem;
                    border-radius: 12px;
                    color: white;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }
                .document-page {
                    background: white;
                    width: 100%;
                    max-width: 650px;
                    min-height: 800px;
                    padding: 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    color: #333;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .official-stamp {
                    position: absolute;
                    top: 20px;
                    right: -30px;
                    transform: rotate(45deg);
                    background: rgba(255, 0, 0, 0.05);
                    color: rgba(255, 0, 0, 0.2);
                    border: 1px solid rgba(255, 0, 0, 0.2);
                    padding: 2px 30px;
                    font-weight: 700;
                    font-size: 14px;
                    letter-spacing: 2px;
                    pointer-events: none;
                    z-index: 10;
                }
                .preview-title {
                    font-size: 14px;
                    text-transform: uppercase;
                    color: #666;
                    padding: 20px 40px;
                    border-bottom: 1px solid #eee;
                    margin: 0;
                    text-align: center;
                    background: #fcfcfc;
                }
                .document-content-area {
                    flex: 1;
                    padding: 0;
                    position: relative;
                }
                .tcl-pixel-perfect {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                .tcl-bg-image {
                    width: 100%;
                    display: block;
                }
                .tcl-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                .field-abs-input, .field-abs-textarea {
                    position: absolute;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: #000080;
                    font-family: 'Courier New', Courier, monospace;
                    font-weight: bold;
                    font-size: clamp(7px, 0.95vw, 11px);
                    letter-spacing: -0.01em;
                    pointer-events: auto;
                    padding: 0;
                    margin: 0;
                }
                .field-abs-input:hover, .field-abs-textarea:hover {
                    background: rgba(0, 0, 128, 0.05);
                }
                .field-abs-input:focus, .field-abs-textarea:focus {
                    background: rgba(0, 0, 128, 0.1);
                    border-bottom: 1px dashed #000080;
                }
                .active-field {
                    background: rgba(30, 215, 96, 0.05) !important;
                    border: 1px solid rgba(30, 215, 96, 0.6) !important;
                    box-shadow: 0 0 25px 5px rgba(30, 215, 96, 0.4);
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }
                .voice-guidance-popup {
                    position: absolute;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1e1e1e;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 50px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 100;
                    font-size: 14px;
                    animation: slideDown 0.5s ease-out;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .pulse-recorder {
                    width: 10px;
                    height: 10px;
                    background-color: #ff4444;
                    border-radius: 50%;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 68, 68, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .field-abs-textarea {
                    resize: none;
                    line-height: 1.8;
                    overflow-y: auto;
                }
                .type-abs {
                    position: absolute;
                    color: #000;
                    transform: translate(-50%, -50%);
                }

                @media (max-width: 600px) {
                    .field-abs { font-size: 2vw; }
                    .tcl-body-abs { font-size: 2.5vw; }
                }

                @keyframes slideIn {
                    from { transform: translateY(20px) rotateX(10deg); opacity: 0; }
                    to { transform: translateY(0) rotateX(0); opacity: 1; }
                }

                @media (max-width: 600px) {
                    .tcl-grid { grid-template-columns: 1fr; }
                    .tcl-header-yellow h1 { font-size: 1.4rem; }
                }
            `}</style>
        </div>
    );
};

export default RichDocumentPreview;
