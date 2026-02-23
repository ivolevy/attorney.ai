import React, { useEffect } from 'react';
import tclBg from '../assets/library/laboral/tcl30/tcl30web.png';
import ingresoCausasBg from '../assets/library/laboral/ingreso-causas/ingreso-causas.png';
import inicioDemandaBg from '../assets/library/laboral/inicio-demanda/formulario inicio demanda.png';

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

    const renderContent = () => {
        if (isOfficial && (title.includes('TCL 30') || title.includes('TCL +30'))) {
            return (
                <div className="tcl-pixel-perfect">
                    <img src={tclBg} alt="TCL Form" className="tcl-bg-image" />

                    <div className="tcl-overlay">
                        {/* DESTINATARIO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'dest_nombre' ? 'active-field' : ''}`}
                            style={{ top: '11.8%', left: '8.0%', width: '35%' }}
                            value={getValue('dest_nombre', rawAnswers?.dest_nombre)}
                            onChange={(e) => handleFieldChange('dest_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nombre Destinatario"
                            name="dest_nombre"
                            aria-label="Nombre del Destinatario"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'dest_ramo' ? 'active-field' : ''}`}
                            style={{ top: '15.5%', left: '8.0%', width: '35%' }}
                            value={getValue('dest_ramo', rawAnswers?.dest_ramo)}
                            onChange={(e) => handleFieldChange('dest_ramo', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ramo/Actividad"
                            name="dest_ramo"
                            aria-label="Ramo o actividad principal del destinatario"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'dest_domicilio' ? 'active-field' : ''}`}
                            style={{ top: '19.1%', left: '8.0%', width: '28%' }}
                            value={getValue('dest_domicilio', rawAnswers?.dest_domicilio)}
                            onChange={(e) => handleFieldChange('dest_domicilio', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Domicilio"
                            name="dest_domicilio"
                            aria-label="Domicilio del destinatario"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'dest_cp' ? 'active-field' : ''}`}
                            style={{ top: '19.1%', left: '36.5%', width: '6%' }}
                            value={getValue('dest_cp', rawAnswers?.dest_cp)}
                            onChange={(e) => handleFieldChange('dest_cp', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="CP"
                            name="dest_cp"
                            aria-label="Código Postal del destinatario"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'dest_localidad' ? 'active-field' : ''}`}
                            style={{ top: '22.8%', left: '8.0%', width: '18%' }}
                            value={getValue('dest_localidad', rawAnswers?.dest_localidad)}
                            onChange={(e) => handleFieldChange('dest_localidad', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Localidad"
                            name="dest_localidad"
                            aria-label="Localidad del destinatario"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'dest_provincia' ? 'active-field' : ''}`}
                            style={{ top: '22.8%', left: '32.5%', width: '18%' }}
                            value={getValue('dest_provincia', rawAnswers?.dest_provincia)}
                            onChange={(e) => handleFieldChange('dest_provincia', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Provincia"
                            name="dest_provincia"
                            aria-label="Provincia del destinatario"
                        />

                        {/* REMITENTE */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'rem_nombre' ? 'active-field' : ''}`}
                            style={{ top: '11.8%', left: '56.0%', width: '35%' }}
                            value={getValue('rem_nombre', rawAnswers?.rem_nombre)}
                            onChange={(e) => handleFieldChange('rem_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nombre Remitente"
                            name="rem_nombre"
                            aria-label="Nombre del Remitente"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'rem_dni' ? 'active-field' : ''}`}
                            style={{ top: '15.5%', left: '56.0%', width: '24%' }}
                            value={getValue('rem_dni', rawAnswers?.rem_dni)}
                            onChange={(e) => handleFieldChange('rem_dni', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="DNI"
                            name="rem_dni"
                            aria-label="DNI del remitente"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'rem_fecha' ? 'active-field' : ''}`}
                            style={{ top: '15.5%', left: '83.0%', width: '10%' }}
                            value={getValue('rem_fecha', rawAnswers?.rem_fecha)}
                            onChange={(e) => handleFieldChange('rem_fecha', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Fecha"
                            name="rem_fecha"
                            aria-label="Fecha"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'rem_domicilio' ? 'active-field' : ''}`}
                            style={{ top: '19.1%', left: '56.0%', width: '28%' }}
                            value={getValue('rem_domicilio', rawAnswers?.rem_domicilio)}
                            onChange={(e) => handleFieldChange('rem_domicilio', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Domicilio"
                            name="rem_domicilio"
                            aria-label="Domicilio del remitente"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'rem_cp' ? 'active-field' : ''}`}
                            style={{ top: '19.1%', left: '85.0%', width: '6%' }}
                            value={getValue('rem_cp', rawAnswers?.rem_cp)}
                            onChange={(e) => handleFieldChange('rem_cp', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="CP"
                            name="rem_cp"
                            aria-label="Código Postal del remitente"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'rem_localidad' ? 'active-field' : ''}`}
                            style={{ top: '22.8%', left: '56.0%', width: '18%' }}
                            value={getValue('rem_localidad', rawAnswers?.rem_localidad)}
                            onChange={(e) => handleFieldChange('rem_localidad', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Localidad"
                            name="rem_localidad"
                            aria-label="Localidad del remitente"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'rem_provincia' ? 'active-field' : ''}`}
                            style={{ top: '22.8%', left: '81.0%', width: '15.5%' }}
                            value={getValue('rem_provincia', rawAnswers?.rem_provincia)}
                            onChange={(e) => handleFieldChange('rem_provincia', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Provincia"
                            name="rem_provincia"
                            aria-label="Provincia del remitente"
                        />

                        {/* CUERPO - Sector Sombreado */}
                        <textarea
                            className={`field-abs-textarea ${activeFieldId === 'texto' ? 'active-field' : ''}`}
                            style={{ top: '30.0%', left: '8.0%', width: '81.5%', height: '54.0%' }}
                            value={getValue('texto', rawAnswers?.texto)}
                            onChange={(e) => handleFieldChange('texto', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe aquí el cuerpo del mensaje..."
                            name="texto"
                            aria-label="Cuerpo del mensaje"
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

        if (isOfficial && data.isIngresoCausas) {
            return (
                <div className="tcl-pixel-perfect">
                    <img src={ingresoCausasBg} alt="Ingreso Causas Form" className="tcl-bg-image" />
                    <div className="tcl-overlay">
                        {/* ABOGADO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_tomo' ? 'active-field' : ''}`}
                            style={{ top: '40.2%', left: '26.8%', width: '7%' }}
                            value={getValue('abogado_tomo', rawAnswers?.abogado_tomo)}
                            onChange={(e) => handleFieldChange('abogado_tomo', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="abogado_tomo"
                            aria-label="Tomo del Abogado"
                            placeholder="Tomo"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_folio' ? 'active-field' : ''}`}
                            style={{ top: '40.2%', left: '33.8%', width: '7%' }}
                            value={getValue('abogado_folio', rawAnswers?.abogado_folio)}
                            onChange={(e) => handleFieldChange('abogado_folio', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="abogado_folio"
                            aria-label="Folio del Abogado"
                            placeholder="Folio"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '40.2%', left: '42.8%', width: '40%' }}
                            value={getValue('abogado_nombre', rawAnswers?.abogado_nombre)}
                            onChange={(e) => handleFieldChange('abogado_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="abogado_nombre"
                            aria-label="Nombre del Abogado"
                            placeholder="Nombre del Abogado"
                        />

                        {/* ACTOR */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_nombre' ? 'active-field' : ''}`}
                            style={{ top: '55.6%', left: '17.8%', width: '25%' }}
                            value={getValue('actor_nombre', rawAnswers?.actor_nombre)}
                            onChange={(e) => handleFieldChange('actor_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="actor_nombre"
                            aria-label="Nombre del Actor"
                            placeholder="Nombre del Actor"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_ieric' ? 'active-field' : ''}`}
                            style={{ top: '55.6%', left: '42.8%', width: '40%' }}
                            value={getValue('actor_ieric', rawAnswers?.actor_ieric)}
                            onChange={(e) => handleFieldChange('actor_ieric', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="actor_ieric"
                            aria-label="IERIC"
                            placeholder="IERIC"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_dni' ? 'active-field' : ''}`}
                            style={{ top: '57.4%', left: '17.8%', width: '25%' }}
                            value={getValue('actor_dni', rawAnswers?.actor_dni)}
                            onChange={(e) => handleFieldChange('actor_dni', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="actor_dni"
                            aria-label="DNI del Actor"
                            placeholder="DNI"
                        />

                        {/* DEMANDADO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'demandado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '67.0%', left: '17.8%', width: '33%' }}
                            value={getValue('demandado_nombre', rawAnswers?.demandado_nombre)}
                            onChange={(e) => handleFieldChange('demandado_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="demandado_nombre"
                            aria-label="Nombre del Demandado"
                            placeholder="Nombre del Demandado"
                        />

                        {/* EXPEDIENTE */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'expte_numero' ? 'active-field' : ''}`}
                            style={{ top: '80.5%', left: '17.8%', width: '36%' }}
                            value={getValue('expte_numero', rawAnswers?.expte_numero)}
                            onChange={(e) => handleFieldChange('expte_numero', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="expte_numero"
                            aria-label="Número de Expediente"
                            placeholder="Número de Expediente"
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && data.isInicioDemanda) {
            return (
                <div className="tcl-pixel-perfect">
                    <img src={inicioDemandaBg} alt="Inicio Demanda Form" className="tcl-bg-image" />
                    <div className="tcl-overlay">
                        {/* FUERO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'fuero' ? 'active-field' : ''}`}
                            style={{ top: '15%', left: '20%', width: '30%' }}
                            value={getValue('fuero', rawAnswers?.fuero)}
                            onChange={(e) => handleFieldChange('fuero', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="fuero"
                            aria-label="Fuero"
                            placeholder="Fuero"
                        />

                        {/* OBJETO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'objeto' ? 'active-field' : ''}`}
                            style={{ top: '20%', left: '20%', width: '60%' }}
                            value={getValue('objeto', rawAnswers?.objeto)}
                            onChange={(e) => handleFieldChange('objeto', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="objeto"
                            aria-label="Objeto de la demanda"
                            placeholder="Objeto de la demanda"
                        />

                        {/* MONTO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'monto' ? 'active-field' : ''}`}
                            style={{ top: '25%', left: '20%', width: '20%' }}
                            value={getValue('monto', rawAnswers?.monto)}
                            onChange={(e) => handleFieldChange('monto', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="monto"
                            aria-label="Monto"
                            placeholder="$ Monto"
                        />

                        {/* ACTOR */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_nombre' ? 'active-field' : ''}`}
                            style={{ top: '30%', left: '20%', width: '40%' }}
                            value={getValue('actor_nombre', rawAnswers?.actor_nombre)}
                            onChange={(e) => handleFieldChange('actor_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="actor_nombre"
                            aria-label="Nombre del Actor"
                            placeholder="Nombre del Actor"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_dni' ? 'active-field' : ''}`}
                            style={{ top: '30%', left: '65%', width: '20%' }}
                            value={getValue('actor_dni', rawAnswers?.actor_dni)}
                            onChange={(e) => handleFieldChange('actor_dni', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="actor_dni"
                            aria-label="DNI del Actor"
                            placeholder="DNI"
                        />

                        {/* DEMANDADO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'demandado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '35%', left: '20%', width: '40%' }}
                            value={getValue('demandado_nombre', rawAnswers?.demandado_nombre)}
                            onChange={(e) => handleFieldChange('demandado_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="demandado_nombre"
                            aria-label="Nombre del Demandado"
                            placeholder="Nombre del Demandado"
                        />

                        {/* ABOGADO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '40%', left: '20%', width: '40%' }}
                            value={getValue('abogado_nombre', rawAnswers?.abogado_nombre)}
                            onChange={(e) => handleFieldChange('abogado_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            name="abogado_nombre"
                            aria-label="Nombre del Abogado"
                            placeholder="Nombre del Abogado"
                        />
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
                    background: white;
                    width: 100%;
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 0;
                    box-shadow: 0 10px 50px rgba(0,0,0,0.7);
                    color: #333;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }
                .official-stamp {
                    position: absolute;
                    top: 25px;
                    right: -35px;
                    transform: rotate(45deg);
                    background: rgba(255, 0, 0, 0.03);
                    color: rgba(255, 0, 0, 0.15);
                    border: 1px solid rgba(255, 0, 0, 0.1);
                    padding: 4px 40px;
                    font-weight: 800;
                    font-size: 11px;
                    letter-spacing: 3px;
                    pointer-events: none;
                    z-index: 10;
                    text-transform: uppercase;
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
