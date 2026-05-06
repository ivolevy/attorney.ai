import React, { useEffect } from 'react';
import tclBg from '../assets/library/laboral/tcl30/tcl30web.png';
import ingresoCausasBg from '../assets/library/laboral/ingreso-causas/ingreso-causas.png';
import inicioDemandaBg from '../assets/library/laboral/inicio-demanda/inicio-demanda.png';
import sucesiones3003Bg from '../assets/library/civil/sucesiones-3003.png';
import inicioComercialBg from '../assets/library/comercial/inicio-comercial.png';
import secloInicioBg from '../assets/library/seclo/seclo-inicio.png';
import ssIngresoBg from '../assets/library/ss/ss-ingreso.png';
import penalQuejaBg from '../assets/library/penal/casacion-queja.png';
import quiebras3003Bg from '../assets/library/comercial/quiebras-3003.png';
import agipDeudaBg from '../assets/library/Formularios_-_AGIP/Solicitud_Certificado_de_Inexistencia_de_Deuda_Tributaria_-_Departamento_Automotor/21042215_AGIP_Rentas_Inexistencia_Deuda_Automotor_page_1.png';
import secloCartaPoderBg from '../assets/library/Formularios_-_SECLO/Carta_Poder/seclo_carta_poder.png';
import ssInicioBg from '../assets/library/Formularios_-_Fuero_de_la_Seguridad_Social/Cámara_Federal_de_la_Seguridad_Social_Formulario_para_ingreso_de_causas_Ingreso_de_Expedientes/21042209_SS_ingreso_causas_page_1.png';
import inicioComercialOfficialBg from '../assets/library/Formularios_-_Fuero_Comercial/Ingreso_Demanda_Comercial/30032210_Ingreso Demanda Comercial Frente y Dorso_page_1.png';
import sucesiones3003CivilBg from '../assets/library/Formularios_-_Fuero_Civil/Poder_Judicial_de_la_Nación_Dto-Ley_300356_Sucesiones_-_Juicios_universales/21042208_Formulario_PJN_Sucesiones_3003_civil_page_1.png';
import igjAnexoBg from '../assets/library/Inspección_General_de_Justicia_IGJ/Formulario_de_Autorización_para_Retiro_en_Sede_CPACF_CPACF/anexo_i_colegio_abogados_page_1.png';

const RichDocumentPreview = ({ data, updateAnswers, interimText, activeFieldId, onNextField }) => {
    if (!data) return null;

    const { title, header, body, footer, isOfficial, rawAnswers } = data;

    useEffect(() => {
        if (activeFieldId) {
            const activeEl = document.querySelector('.active-field');
            if (activeEl) {
                activeEl.focus();
            }
        }
    }, [activeFieldId]);

    const handleFieldChange = (fieldId, value) => {
        if (updateAnswers && rawAnswers) {
            updateAnswers({
                ...rawAnswers,
                [fieldId]: value
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.target.tagName === 'TEXTAREA' && e.shiftKey) {
                return;
            }
            e.preventDefault();
            if (onNextField) onNextField();
        }
    };

    const getValue = (fieldId, baseValue) => {
        const val = baseValue || '';
        if (activeFieldId === fieldId && interimText) {
            const separator = (val && !val.endsWith(' ') && !interimText.startsWith('\n')) ? ' ' : '';
            return val + separator + interimText;
        }
        return val;
    };

    const renderDynamicOverlay = (layout, rawAnswers) => {
        if (!layout || Object.keys(layout).length === 0) return null;

        return (
            <div className="tcl-overlay">
                {Object.entries(layout).map(([fieldId, config]) => {
                    const isTextarea = config.type === 'textarea';
                    const Component = isTextarea ? 'textarea' : 'input';
                    
                    return (
                        <Component
                            key={fieldId}
                            className={`field-abs-input ${isTextarea ? 'field-abs-textarea' : ''} ${activeFieldId === fieldId ? 'active-field' : ''}`}
                            style={{ 
                                top: config.top, 
                                left: config.left, 
                                width: config.width,
                                height: config.height || (isTextarea ? '150px' : 'auto'),
                                border: 'none',
                                background: 'rgba(0, 123, 255, 0.05)',
                                padding: '2px 4px',
                                fontSize: isTextarea ? '12px' : '14px',
                                resize: 'none'
                            }}
                            value={getValue(fieldId, rawAnswers?.[fieldId])}
                            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={fieldId.replace(/_/g, ' ')}
                            name={fieldId}
                        />
                    );
                })}
            </div>
        );
    };

    const renderContent = () => {
        // PRIORIDAD 1: Layout dinámico desde la DB
        if (isOfficial && rawAnswers && data.layout && Object.keys(data.layout).length > 0) {
            // Determinar imagen de fondo
            let bgImage = data.backgroundUrl;
            if (!bgImage) {
                // Fallback inteligente basado en el título o categoría
                const upperTitle = title.toUpperCase();
                if (upperTitle.includes('TCL') || upperTitle.includes('TELEGRAMA')) bgImage = tclBg;
                else if (upperTitle.includes('SUCESIONES') || upperTitle.includes('3003')) bgImage = sucesiones3003Bg;
                else if (upperTitle.includes('SECLO')) bgImage = secloCartaPoderBg;
                else if (upperTitle.includes('CAUSAS') || upperTitle.includes('INGRESO')) bgImage = ingresoCausasBg;
                else if (upperTitle.includes('DEMANDA')) bgImage = inicioDemandaBg;
                else if (upperTitle.includes('COMERCIAL')) bgImage = inicioComercialBg;
                else bgImage = tclBg; // Último recurso
            }

            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={bgImage} 
                        onError={(e) => { 
                            e.target.onerror = null; 
                            // Si falla la carga, intentamos un placeholder neutro o el fondo de SECLO que es genérico
                            e.target.src = secloCartaPoderBg; 
                        }}
                        alt="Official Form" 
                        className="tcl-bg-image" 
                    />
                    {renderDynamicOverlay(data.layout, rawAnswers)}
                </div>
            );
        }
        // FALLBACK: Lógica estándar para formularios que aún no tienen layout en DB
        return (
            <div className="document-standard">
                <div className="document-header-professional">
                    <div className="law-firm-header">LEXIA LEGAL ENGINE</div>
                    <div className="document-header-content">{header}</div>
                </div>
                <div className="document-body-professional">
                    {body.map((p, i) => (
                        <p key={i} className="document-paragraph">{p}</p>
                    ))}
                </div>
                {footer && (
                    <div className="document-footer-professional">
                        <div className="footer-line"></div>
                        <pre>{footer}</pre>
                    </div>
                )}
                <div className="digital-stamp">
                    DOCUMENTO GENERADO POR LEXIA AI - VALIDEZ DIGITAL
                </div>
            </div>
        );
    };

    return (
        <div className="rich-preview-container">
            <div className="document-page">
                {/* <div className="official-stamp">BORRADOR</div> */}
                <h2 className="preview-title">{title}</h2>
                <div className="document-content-area">
                    {renderContent()}
                </div>
            </div>

            <style>{`
                .rich-preview-container {
                    background: #111;
                    padding: 0;
                    border-radius: 12px;
                    color: white;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                }
                .document-page {
                    background: #fdfcf9; /* Subtle parchment color */
                    width: 100%;
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 0;
                    box-shadow: 0 10px 50px rgba(0,0,0,0.7);
                    color: #1a1a1a;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #e5e0d5;
                }
                .document-standard {
                    padding: 60px 80px;
                    font-family: 'Times New Roman', Times, serif;
                    line-height: 1.8;
                    color: #1a1a1a;
                }
                .document-header-professional {
                    margin-bottom: 40px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 20px;
                }
                .law-firm-header {
                    font-family: 'Inter', sans-serif;
                    font-size: 10px;
                    letter-spacing: 2px;
                    color: #888;
                    margin-bottom: 10px;
                }
                .document-header-content {
                    font-weight: bold;
                    white-space: pre-line;
                    font-size: 14px;
                }
                .document-body-professional {
                    min-height: 400px;
                }
                .document-paragraph {
                    margin-bottom: 20px;
                    text-align: justify;
                    font-size: 16px;
                }
                .document-footer-professional {
                    margin-top: 60px;
                    font-size: 14px;
                }
                .footer-line {
                    width: 150px;
                    height: 1px;
                    background: #333;
                    margin-bottom: 10px;
                }
                .digital-stamp {
                    margin-top: 100px;
                    font-size: 9px;
                    color: #aaa;
                    text-align: center;
                    letter-spacing: 1px;
                    border: 1px dashed #eee;
                    padding: 10px;
                }
                .preview-title {
                    font-size: 13px;
                    text-transform: uppercase;
                    color: #888;
                    padding: 15px 40px;
                    border-bottom: 1px solid #f0f0f0;
                    margin: 0;
                    text-align: center;
                    background: #fafafa;
                    font-weight: 500;
                }
                .document-content-area {
                    flex: 1;
                    padding: 0;
                    position: relative;
                }
                .tcl-pixel-perfect {
                    position: relative;
                    width: 100%;
                }
                .tcl-bg-image {
                    width: 100%;
                    display: block;
                    image-rendering: -webkit-optimize-contrast;
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
                    font-size: 14px;
                    letter-spacing: -0.01em;
                    pointer-events: auto;
                    padding: 2px 4px;
                    margin: 0;
                    transition: background 0.2s ease;
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
