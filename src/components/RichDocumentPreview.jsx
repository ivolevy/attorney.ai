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

    const renderContent = () => {
        if (isOfficial && (title.includes('TCL 30') || title.includes('TCL +30'))) {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || tclBg} 
                        onError={(e) => { e.target.onerror = null; e.target.src = tclBg; }}
                        alt="TCL Form" 
                        className="tcl-bg-image" 
                    />

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
                <div className="ingreso-causas-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || ingresoCausasBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = ingresoCausasBg; }}
                        alt="Ingreso Causas Form" 
                        className="ingreso-causas-bg-image" 
                    />

                    <div className="ingreso-causas-overlay">
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
                <div className="inicio-demanda-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || inicioDemandaBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = inicioDemandaBg; }}
                        alt="Inicio Demanda Form" 
                        className="inicio-demanda-bg-image" 
                    />

                    <div className="inicio-demanda-overlay">
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

        if (isOfficial && rawAnswers && data.isOfficialForm === '3003_SUCESIONES') {
            return (
                <div className="sucesiones-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || sucesiones3003Bg} 
                        onError={(e) => { e.target.onError = null; e.target.src = sucesiones3003Bg; }}
                        alt="Sucesiones Form" 
                        className="sucesiones-bg-image" 
                    />

                    <div className="sucesiones-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'causante_nombre' ? 'active-field' : ''}`}
                            style={{ top: '34.0%', left: '27.5%', width: '60%' }}
                            value={getValue('causante_nombre', rawAnswers?.causante_nombre)}
                            onChange={(e) => handleFieldChange('causante_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nombre del Causante"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'causante_dni' ? 'active-field' : ''}`}
                            style={{ top: '39.0%', left: '27.5%', width: '30%' }}
                            value={getValue('causante_dni', rawAnswers?.causante_dni)}
                            onChange={(e) => handleFieldChange('causante_dni', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="DNI"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'fecha_fallecimiento' ? 'active-field' : ''}`}
                            style={{ top: '59.5%', left: '27.5%', width: '20%' }}
                            value={getValue('fecha_fallecimiento', rawAnswers?.fecha_fallecimiento)}
                            onChange={(e) => handleFieldChange('fecha_fallecimiento', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Fecha"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'lugar_fallecimiento' ? 'active-field' : ''}`}
                            style={{ top: '59.5%', left: '72.5%', width: '20%' }}
                            value={getValue('lugar_fallecimiento', rawAnswers?.lugar_fallecimiento)}
                            onChange={(e) => handleFieldChange('lugar_fallecimiento', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Lugar"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'ultimo_domicilio' ? 'active-field' : ''}`}
                            style={{ top: '64.5%', left: '27.5%', width: '60%' }}
                            value={getValue('ultimo_domicilio', rawAnswers?.ultimo_domicilio)}
                            onChange={(e) => handleFieldChange('ultimo_domicilio', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Último Domicilio"
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '83.5%', left: '27.5%', width: '60%' }}
                            value={getValue('abogado_nombre', rawAnswers?.abogado_nombre)}
                            onChange={(e) => handleFieldChange('abogado_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Abogado"
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'INICIO_COMERCIAL') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || inicioComercialOfficialBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = inicioComercialOfficialBg; }}
                        alt="Inicio Comercial" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_nombre' ? 'active-field' : ''}`}
                            style={{ top: '55.5%', left: '21.0%', width: '30%' }}
                            value={getValue('actor_nombre', rawAnswers?.actor_nombre)}
                            onChange={(e) => handleFieldChange('actor_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'INICIO_SS') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || ssInicioBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = ssInicioBg; }}
                        alt="Inicio SS" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_nombre' ? 'active-field' : ''}`}
                            style={{ top: '32.0%', left: '20.0%', width: '60%' }}
                            value={getValue('actor_nombre', rawAnswers?.actor_nombre)}
                            onChange={(e) => handleFieldChange('actor_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'SECLO_INICIO') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || secloInicioBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = secloInicioBg; }}
                        alt="SECLO Form" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_nombre' ? 'active-field' : ''}`}
                            style={{ top: '32.0%', left: '25.0%', width: '50%' }}
                            value={getValue('actor_nombre', rawAnswers?.actor_nombre)}
                            onChange={(e) => handleFieldChange('actor_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_cuil' ? 'active-field' : ''}`}
                            style={{ top: '35.5%', left: '25.0%', width: '30%' }}
                            value={getValue('actor_cuil', rawAnswers?.actor_cuil)}
                            onChange={(e) => handleFieldChange('actor_cuil', e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'empleador_nombre' ? 'active-field' : ''}`}
                            style={{ top: '53.5%', left: '25.0%', width: '50%' }}
                            value={getValue('empleador_nombre', rawAnswers?.empleador_nombre)}
                            onChange={(e) => handleFieldChange('empleador_nombre', e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'motivo' ? 'active-field' : ''}`}
                            style={{ top: '78.5%', left: '10.0%', width: '80%' }}
                            value={getValue('motivo', rawAnswers?.motivo)}
                            onChange={(e) => handleFieldChange('motivo', e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'SS_INGRESO') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || ssIngresoBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = ssIngresoBg; }}
                        alt="SS Ingreso Form" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_nombre' ? 'active-field' : ''}`}
                            style={{ top: '35.0%', left: '18.0%', width: '40%' }}
                            value={getValue('actor_nombre', rawAnswers?.actor_nombre)}
                            onChange={(e) => handleFieldChange('actor_nombre', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'CASACION_QUEJA') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || penalQuejaBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = penalQuejaBg; }}
                        alt="Penal Queja Form" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'imputado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '30.0%', left: '20.0%', width: '40%' }}
                            value={getValue('imputado_nombre', rawAnswers?.imputado_nombre)}
                            onChange={(e) => handleFieldChange('imputado_nombre', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === '3003_SUCESIONES') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || sucesiones3003CivilBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = sucesiones3003CivilBg; }}
                        alt="3003 Sucesiones" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'causante_nombre' ? 'active-field' : ''}`}
                            style={{ top: '35.0%', left: '20.0%', width: '60%' }}
                            value={getValue('causante_nombre', rawAnswers?.causante_nombre)}
                            onChange={(e) => handleFieldChange('causante_nombre', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'CEDULA_CIVIL') {
            return (
                <div className="document-standard">
                    <div className="document-header-professional">
                        <div className="law-firm-header">CÉDULA DE NOTIFICACIÓN OFICIAL</div>
                        <div className="document-header-content">{header}</div>
                    </div>
                    <div className="document-body-professional">
                        {body.map((p, i) => (
                            <p key={i} className="document-paragraph">{p}</p>
                        ))}
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'AGIP_DEUDA') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || agipDeudaBg} 
                        onError={(e) => { e.target.onError = null; e.target.src = agipDeudaBg; }}
                        alt="AGIP Deuda" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'dominio' ? 'active-field' : ''}`}
                            style={{ top: '35.0%', left: '20.0%', width: '30%' }}
                            value={getValue('dominio', rawAnswers?.dominio)}
                            onChange={(e) => handleFieldChange('dominio', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'SECLO_CARTA_PODER') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || secloCartaPoderBg} 
                        onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                        alt="SECLO Carta Poder" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        {/* OTORGANTE INFO */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'otorgante_nombre' ? 'active-field' : ''}`}
                            style={{ top: '66.8%', left: '26.8%', width: '35%' }}
                            value={getValue('otorgante_nombre', rawAnswers?.otorgante_nombre)}
                            onChange={(e) => handleFieldChange('otorgante_nombre', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'otorgante_fecha_nac' ? 'active-field' : ''}`}
                            style={{ top: '69.8%', left: '26.8%', width: '15%' }}
                            value={getValue('otorgante_fecha_nac', rawAnswers?.otorgante_fecha_nac)}
                            onChange={(e) => handleFieldChange('otorgante_fecha_nac', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'otorgante_nacionalidad' ? 'active-field' : ''}`}
                            style={{ top: '69.8%', left: '53.0%', width: '15%' }}
                            value={getValue('otorgante_nacionalidad', rawAnswers?.otorgante_nacionalidad)}
                            onChange={(e) => handleFieldChange('otorgante_nacionalidad', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'otorgante_estado_civil' ? 'active-field' : ''}`}
                            style={{ top: '69.8%', left: '78.0%', width: '15%' }}
                            value={getValue('otorgante_estado_civil', rawAnswers?.otorgante_estado_civil)}
                            onChange={(e) => handleFieldChange('otorgante_estado_civil', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'otorgante_domicilio' ? 'active-field' : ''}`}
                            style={{ top: '72.8%', left: '26.8%', width: '65%' }}
                            value={getValue('otorgante_domicilio', rawAnswers?.otorgante_domicilio)}
                            onChange={(e) => handleFieldChange('otorgante_domicilio', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'otorgante_localidad' ? 'active-field' : ''}`}
                            style={{ top: '75.8%', left: '26.8%', width: '45%' }}
                            value={getValue('otorgante_localidad', rawAnswers?.otorgante_localidad)}
                            onChange={(e) => handleFieldChange('otorgante_localidad', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'otorgante_cp' ? 'active-field' : ''}`}
                            style={{ top: '75.8%', left: '80.0%', width: '12%' }}
                            value={getValue('otorgante_cp', rawAnswers?.otorgante_cp)}
                            onChange={(e) => handleFieldChange('otorgante_cp', e.target.value)}
                        />

                        {/* ABOGADOS TABLE */}
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '84.8%', left: '15.2%', width: '35%' }}
                            value={getValue('abogado_nombre', rawAnswers?.abogado_nombre)}
                            onChange={(e) => handleFieldChange('abogado_nombre', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_tomo' ? 'active-field' : ''}`}
                            style={{ top: '84.8%', left: '51.5%', width: '8%' }}
                            value={getValue('abogado_tomo', rawAnswers?.abogado_tomo)}
                            onChange={(e) => handleFieldChange('abogado_tomo', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_folio' ? 'active-field' : ''}`}
                            style={{ top: '84.8%', left: '62.5%', width: '8%' }}
                            value={getValue('abogado_folio', rawAnswers?.abogado_folio)}
                            onChange={(e) => handleFieldChange('abogado_folio', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'abogado_matricula' ? 'active-field' : ''}`}
                            style={{ top: '84.8%', left: '73.5%', width: '15%' }}
                            value={getValue('abogado_matricula', rawAnswers?.abogado_matricula)}
                            onChange={(e) => handleFieldChange('abogado_matricula', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'QUIEBRAS_3003') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || quiebras3003Bg} 
                        onError={(e) => { e.target.onError = null; e.target.src = quiebras3003Bg; }}
                        alt="Quiebras 3003 Form" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'razon_social' ? 'active-field' : ''}`}
                            style={{ top: '34.0%', left: '27.5%', width: '60%' }}
                            value={getValue('razon_social', rawAnswers?.razon_social)}
                            onChange={(e) => handleFieldChange('razon_social', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'PBA_3003') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || sucesiones3003Bg} 
                        onError={(e) => { e.target.onError = null; e.target.src = sucesiones3003Bg; }}
                        alt="PBA 3003 Form" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <div style={{ position: 'absolute', top: '15%', left: '40%', fontSize: '20px', fontWeight: 'bold', color: '#888' }}>3003/56</div>
                        <input
                            className={`field-abs-input ${activeFieldId === 'causante_nombre' ? 'active-field' : ''}`}
                            style={{ top: '37.0%', left: '27.5%', width: '60%' }}
                            value={getValue('causante_nombre', rawAnswers?.causante_nombre)}
                            onChange={(e) => handleFieldChange('causante_nombre', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'causante_dni' ? 'active-field' : ''}`}
                            style={{ top: '44.5%', left: '27.5%', width: '25%' }}
                            value={getValue('causante_dni', rawAnswers?.causante_dni)}
                            onChange={(e) => handleFieldChange('causante_dni', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'fecha_fallecimiento' ? 'active-field' : ''}`}
                            style={{ top: '44.5%', left: '68.0%', width: '22%' }}
                            value={getValue('fecha_fallecimiento', rawAnswers?.fecha_fallecimiento)}
                            onChange={(e) => handleFieldChange('fecha_fallecimiento', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'lugar_fallecimiento' ? 'active-field' : ''}`}
                            style={{ top: '51.5%', left: '27.5%', width: '60%' }}
                            value={getValue('lugar_fallecimiento', rawAnswers?.lugar_fallecimiento)}
                            onChange={(e) => handleFieldChange('lugar_fallecimiento', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'IGJ_RETIRO') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || (typeof igjAnexoBg !== 'undefined' ? igjAnexoBg : '')} 
                        onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                        alt="IGJ Anexo" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'profesional_nombre' ? 'active-field' : ''}`}
                            style={{ top: '51.0%', left: '15.0%', width: '70%' }}
                            value={getValue('profesional_nombre', rawAnswers?.profesional_nombre)}
                            onChange={(e) => handleFieldChange('profesional_nombre', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'autorizado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '59.0%', left: '15.0%', width: '70%' }}
                            value={getValue('autorizado_nombre', rawAnswers?.autorizado_nombre)}
                            onChange={(e) => handleFieldChange('autorizado_nombre', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'tramite_nro' ? 'active-field' : ''}`}
                            style={{ top: '38.0%', left: '15.0%', width: '20%' }}
                            value={getValue('tramite_nro', rawAnswers?.tramite_nro)}
                            onChange={(e) => handleFieldChange('tramite_nro', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'INICIO_COMERCIAL') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || inicioComercialOfficialBg} 
                        onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                        alt="Inicio Comercial" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_nombre' ? 'active-field' : ''}`}
                            style={{ top: '23.5%', left: '26.5%', width: '65%' }}
                            value={getValue('actor_nombre', rawAnswers?.actor_nombre)}
                            onChange={(e) => handleFieldChange('actor_nombre', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'demandado_nombre' ? 'active-field' : ''}`}
                            style={{ top: '30.5%', left: '26.5%', width: '65%' }}
                            value={getValue('demandado_nombre', rawAnswers?.demandado_nombre)}
                            onChange={(e) => handleFieldChange('demandado_nombre', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'objeto' ? 'active-field' : ''}`}
                            style={{ top: '37.5%', left: '26.5%', width: '40%' }}
                            value={getValue('objeto', rawAnswers?.objeto)}
                            onChange={(e) => handleFieldChange('objeto', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'monto' ? 'active-field' : ''}`}
                            style={{ top: '37.5%', left: '75.0%', width: '15%' }}
                            value={getValue('monto', rawAnswers?.monto)}
                            onChange={(e) => handleFieldChange('monto', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

        if (isOfficial && rawAnswers && data.isOfficialForm === 'INICIO_SS') {
            return (
                <div className="tcl-pixel-perfect">
                    <img 
                        src={data.backgroundUrl || ssInicioBg} 
                        onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
                        alt="Inicio Seguridad Social" 
                        className="tcl-bg-image" 
                    />
                    <div className="tcl-overlay">
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_nombre' ? 'active-field' : ''}`}
                            style={{ top: '25.5%', left: '26.5%', width: '65%' }}
                            value={getValue('actor_nombre', rawAnswers?.actor_nombre)}
                            onChange={(e) => handleFieldChange('actor_nombre', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'actor_cuil' ? 'active-field' : ''}`}
                            style={{ top: '32.5%', left: '26.5%', width: '30%' }}
                            value={getValue('actor_cuil', rawAnswers?.actor_cuil)}
                            onChange={(e) => handleFieldChange('actor_cuil', e.target.value)}
                        />
                        <input
                            className={`field-abs-input ${activeFieldId === 'beneficio' ? 'active-field' : ''}`}
                            style={{ top: '32.5%', left: '65.0%', width: '25%' }}
                            value={getValue('beneficio', rawAnswers?.beneficio)}
                            onChange={(e) => handleFieldChange('beneficio', e.target.value)}
                        />
                    </div>
                </div>
            );
        }

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
