export const LEGAL_TEMPLATES = [
    // LABORAL
    {
        id: 'telegrama-laboral',
        category: 'Laboral',
        name: 'Telegrama Ley 23.789',
        description: 'Formulario oficial para comunicaciones laborales (+30 palabras).',
        fields: [
            // DESTINATARIO (COLUMNA IZQUIERDA)
            { id: 'dest_nombre', name: 'Nombre Destinatario', prompt: '', placeholder: 'Empresa S.A.' },
            { id: 'dest_ramo', name: 'Rama', prompt: '', placeholder: 'Comercio' },
            { id: 'dest_domicilio', name: 'Domicilio', prompt: '', placeholder: 'Av. Corrientes 1234' },
            { id: 'dest_cp', name: 'Código Postal', prompt: '', placeholder: '1414' },
            { id: 'dest_localidad', name: 'Localidad', prompt: '', placeholder: 'CABA' },
            { id: 'dest_provincia', name: 'Provincia', prompt: '', placeholder: 'Buenos Aires' },

            // REMITENTE (COLUMNA DERECHA)
            { id: 'rem_nombre', name: 'Tu Nombre', prompt: '', placeholder: 'Juan Pérez' },
            { id: 'rem_dni', name: 'Tu DNI', prompt: '', placeholder: '12.345.678' },
            { id: 'rem_fecha', name: 'Fecha', prompt: '', placeholder: 'DD/MM/AAAA' },
            { id: 'rem_domicilio', name: 'Tu Domicilio', prompt: '', placeholder: 'Calle Falsa 123' },
            { id: 'rem_cp', name: 'Tu Código Postal', prompt: '', placeholder: '1870' },
            { id: 'rem_localidad', name: 'Tu Localidad', prompt: '', placeholder: 'Avellaneda' },
            { id: 'rem_provincia', name: 'Tu Provincia', prompt: '', placeholder: 'Buenos Aires' },

            // CUERPO (SECTOR SOMBREADO)
            { id: 'texto', name: 'Cuerpo', prompt: 'Dictame el texto del telegrama.', placeholder: 'Por medio de la presente...' }
        ],
        isOfficialForm: 'TCL30',
        richFormat: (answers) => ({
            title: 'TELEGRAMA LABORAL LEY N° 23.789 (TCL +30 PALABRAS)',
            isOfficial: true,
            tipo: answers.tipo_comunicacion || '',
            header: `DESTINATARIO: ${answers.dest_nombre}\nADDR: ${answers.dest_domicilio}`,
            body: [answers.texto || '___'],
            footer: `REMITENTE: ${answers.rem_nombre}`,
            rawAnswers: answers
        }),
        format: (answers) => `TCL 30 - LEY 23.789\n\nDEST: ${answers.dest_nombre}\nADDR: ${answers.dest_domicilio}\n\nTEXTO: ${answers.texto}\n\nREM: ${answers.rem_nombre}\nDNI: ${answers.rem_dni}`
    },
    {
        id: 'ingreso-causas',
        category: 'Laboral',
        name: 'Ingreso de Causas',
        description: 'Recurso Directo a Cámara - Sorteo de Sala (Formulario Oficial).',
        fields: [
            // ABOGADO
            { id: 'abogado_nombre', name: 'Abogado: Nombre', prompt: '¿Nombre completo del abogado patrocinante?', placeholder: 'Dr. Lucas García' },
            { id: 'abogado_tomo', name: 'Abogado: Tomo', prompt: '¿Número de Tomo?', placeholder: '123' },
            { id: 'abogado_folio', name: 'Abogado: Folio', prompt: '¿Número de Folio?', placeholder: '456' },

            // ACTOR
            { id: 'actor_nombre', name: 'Actor: Nombre/Razón Social', prompt: '¿Nombre o Razón Social del actor?', placeholder: 'Juan Pérez' },
            { id: 'actor_ieric', name: 'Actor: I.E.R.I.C.', prompt: '¿Número de I.E.R.I.C.?', placeholder: '12345/6' },
            { id: 'actor_dni', name: 'Actor: DNI', prompt: '¿DNI del actor?', placeholder: '12.345.678' },
            { id: 'actor_sexo', name: 'Actor: Sexo', prompt: '¿Sexo? (Femenino, Masculino u Otro)', placeholder: 'Masculino' },

            // DEMANDADO
            { id: 'demandado_nombre', name: 'Demandado: Nombre', prompt: '¿Nombre o Razón Social del demandado?', placeholder: 'Empresa S.A.' },

            // EXPEDIENTE
            { id: 'expte_numero', name: 'Expte. Administrativo', prompt: '¿Número de Expediente Administrativo y Año?', placeholder: '9999/2024' }
        ],
        isOfficialForm: 'INGRESO_CAUSAS',
        richFormat: (answers) => ({
            title: 'FORMULARIO PARA INGRESO DE CAUSAS (RECURSO DIRECTO A CÁMARA)',
            isOfficial: true,
            isIngresoCausas: true,
            header: 'Cámara Nacional de Apelaciones del Trabajo',
            body: [],
            rawAnswers: answers
        }),
        format: (answers) => `INGRESO DE CAUSAS\n\nACTOR: ${answers.actor_nombre}\nDEMANDADO: ${answers.demandado_nombre}\nEXPTE: ${answers.expte_numero}`
    },
    {
        id: 'inicio-demanda',
        category: 'Laboral',
        name: 'Inicio de Demanda',
        description: 'Formulario de inicio de demanda.',
        fields: [
            { id: 'fuero', name: 'Fuero', prompt: '¿Fuero o Juzgado?', placeholder: 'Laboral' },
            { id: 'objeto', name: 'Objeto', prompt: '¿Objeto del juicio?', placeholder: 'Despido' },
            { id: 'monto', name: 'Monto', prompt: '¿Monto reclamado?', placeholder: '$1.000.000' },
            { id: 'actor_nombre', name: 'Actor: Nombre', prompt: '¿Nombre del actor?', placeholder: 'Juan Pérez' },
            { id: 'actor_dni', name: 'Actor: DNI', prompt: '¿DNI del actor?', placeholder: '12.345.678' },
            { id: 'demandado_nombre', name: 'Demandado', prompt: '¿Nombre del demandado?', placeholder: 'Empresa S.A.' },
            { id: 'abogado_nombre', name: 'Abogado', prompt: '¿Nombre del abogado?', placeholder: 'Dr. Lucas García' }
        ],
        isOfficialForm: 'INICIO_DEMANDA',
        richFormat: (answers) => ({
            title: 'FORMULARIO DE INICIO DE DEMANDA',
            isOfficial: true,
            isInicioDemanda: true,
            header: 'INICIO DE DEMANDA',
            body: [],
            rawAnswers: answers
        }),
        format: (answers) => `INICIO DEMANDA\n\nACTOR: ${answers.actor_nombre}\nDEMANDADO: ${answers.demandado_nombre}\nOBJETO: ${answers.objeto}`
    },
    // PROVINCIA DE BUENOS AIRES
    {
        id: 'pba-3003',
        category: 'PBA',
        name: 'Registro Juicios Universales (PBA)',
        description: 'Formulario de inicio para sucesiones en Provincia de Buenos Aires.',
        fields: [
            { id: 'causante_nombre', name: 'Causante', prompt: '¿Nombre del causante?', placeholder: 'Juan Pérez' },
            { id: 'causante_dni', name: 'DNI', prompt: '¿DNI?', placeholder: '12.345.678' },
            { id: 'departamento', name: 'Depto. Judicial', prompt: '¿Departamento Judicial?', placeholder: 'San Isidro / Lomas de Zamora' }
        ],
        isOfficialForm: 'PBA_3003',
        richFormat: (answers) => ({
            title: 'REGISTRO DE JUICIOS UNIVERSALES - PBA',
            isOfficial: true,
            header: `DEPTO. JUDICIAL: ${answers.departamento || '___'}`,
            body: [`Causante: ${answers.causante_nombre || '___'} (DNI: ${answers.causante_dni || '___'})`],
            rawAnswers: answers
        }),
        format: (answers) => `PBA 3003 - ${answers.causante_nombre}`
    },
    // IGJ
    {
        id: 'igj-retiro',
        category: 'IGJ',
        name: 'Autorización Retiro Sede CPACF',
        description: 'Formulario de autorización para retirar trámites de IGJ en el Colegio.',
        fields: [
            { id: 'profesional_nombre', name: 'Abogado/a', prompt: '¿Nombre del profesional?', placeholder: 'Dr. Lucas García' },
            { id: 'autorizado_nombre', name: 'Autorizado/a', prompt: '¿A quién autorizás a retirar?', placeholder: 'Nombre del gestor/empleado' },
            { id: 'tramite_nro', name: 'N° Trámite', prompt: '¿Número de correlativa o trámite?', placeholder: '1234567' }
        ],
        isOfficialForm: 'IGJ_RETIRO',
        richFormat: (answers) => ({
            title: 'AUTORIZACIÓN RETIRO IGJ - SEDE CPACF',
            isOfficial: true,
            header: 'ANEXO I - AUTORIZACIÓN DE RETIRO',
            body: [
                `Yo, ${answers.profesional_nombre || '___'}, autorizo a ${answers.autorizado_nombre || '___'} a retirar el trámite N° ${answers.tramite_nro || '___'}.`
            ],
            rawAnswers: answers
        }),
        format: (answers) => `IGJ RETIRO - TRAMITE ${answers.tramite_nro}`
    },
    // SECLO CARTA PODER
    {
        id: 'seclo-carta-poder',
        category: 'Laboral',
        name: 'SECLO - Carta Poder',
        description: 'Carta poder para representación en conciliación laboral SECLO.',
        fields: [
            { id: 'otorgante_nombre', name: 'Otorgante', prompt: '¿Nombre del trabajador que otorga el poder?', placeholder: 'Juan Pérez' },
            { id: 'abogado_nombre', name: 'Abogado/a', prompt: '¿Nombre del abogado apoderado?', placeholder: 'Dra. María López' },
            { id: 'tomo_folio', name: 'Tomo/Folio', prompt: '¿Tomo y Folio del abogado?', placeholder: '123/456' }
        ],
        isOfficialForm: 'SECLO_CARTA_PODER',
        richFormat: (answers) => ({
            title: 'CARTA PODER SECLO',
            isOfficial: true,
            header: 'MINISTERIO DE TRABAJO, EMPLEO Y SEGURIDAD SOCIAL',
            body: [
                `Por la presente, ${answers.otorgante_nombre || '___'} otorga poder a ${answers.abogado_nombre || '___'} (T° ${answers.tomo_folio || '___'}) para actuar ante el SECLO.`
            ],
            rawAnswers: answers
        }),
        format: (answers) => `CARTA PODER SECLO - ${answers.otorgante_nombre}`
    },
    // AGIP
    {
        id: 'agip-deuda',
        category: 'AGIP',
        name: 'Inexistencia Deuda (Automotor)',
        description: 'Solicitud de certificado de inexistencia de deuda tributaria.',
        fields: [
            { id: 'dominio', name: 'Dominio/Patente', prompt: '¿Dominio del vehículo?', placeholder: 'ABC 123' },
            { id: 'titular', name: 'Titular', prompt: '¿Nombre del titular?', placeholder: 'Juan Pérez' }
        ],
        isOfficialForm: 'AGIP_DEUDA',
        richFormat: (answers) => ({
            title: 'SOLICITUD CERTIFICADO INEXISTENCIA DEUDA - AGIP',
            isOfficial: true,
            header: 'ADMINISTRACIÓN GUBERNAMENTAL DE INGRESOS PÚBLICOS',
            body: [`Se solicita certificado para el dominio ${answers.dominio || '___'}, titular ${answers.titular || '___'}.`],
            rawAnswers: answers
        }),
        format: (answers) => `AGIP DEUDA - ${answers.dominio}`
    },
    // SEGURIDAD SOCIAL
    {
        id: 'ss-ingreso',
        category: 'Seguridad Social',
        name: 'Ingreso de Causas (SS)',
        description: 'Formulario de ingreso de expedientes para la Cámara Federal de la Seguridad Social.',
        fields: [
            { id: 'actor_nombre', name: 'Actor', prompt: '¿Nombre del actor?', placeholder: 'Juan Pérez' },
            { id: 'actor_cuil', name: 'CUIL', prompt: '¿CUIL del actor?', placeholder: '20-12345678-9' },
            { id: 'objeto', name: 'Objeto', prompt: '¿Objeto del juicio?', placeholder: 'Reajustes Varios' }
        ],
        isOfficialForm: 'SS_INGRESO',
        richFormat: (answers) => ({
            title: 'INGRESO DE CAUSAS - SEGURIDAD SOCIAL',
            isOfficial: true,
            body: [`Actor: ${answers.actor_nombre || '___'} (CUIL: ${answers.actor_cuil || '___'})`, `Objeto: ${answers.objeto || '___'}`],
            rawAnswers: answers
        }),
        format: (answers) => `SS INGRESO - ${answers.actor_nombre}`
    },
    // PENAL
    {
        id: 'casacion-queja',
        category: 'Penal',
        name: 'Recurso de Queja (Casación)',
        description: 'Formulario para recurso de queja ante la Cámara Nacional de Casación Penal.',
        fields: [
            { id: 'imputado_nombre', name: 'Imputado', prompt: '¿Nombre del imputado?', placeholder: 'Juan Pérez' },
            { id: 'causa_nro', name: 'Causa N°', prompt: '¿Número de causa?', placeholder: '1234/2024' },
            { id: 'tribunal_origen', name: 'Tribunal Origen', prompt: '¿Tribunal de origen?', placeholder: 'TOC N° 5' }
        ],
        isOfficialForm: 'CASACION_QUEJA',
        richFormat: (answers) => ({
            title: 'RECURSO DE QUEJA - CASACIÓN PENAL',
            isOfficial: true,
            body: [`Imputado: ${answers.imputado_nombre || '___'}`, `Causa: ${answers.causa_nro || '___'}`, `Origen: ${answers.tribunal_origen || '___'}`],
            rawAnswers: answers
        }),
        format: (answers) => `CASACION QUEJA - ${answers.imputado_nombre}`
    },
    // QUIEBRAS 3003
    {
        id: 'quiebras-3003',
        category: 'Comercial',
        name: 'Registro Quiebras (3003)',
        description: 'Formulario 3003 para Quiebras y Juicios Universales Comerciales.',
        fields: [
            { id: 'razon_social', name: 'Razón Social/Nombre', prompt: '¿Nombre o Razón Social?', placeholder: 'Empresa S.A.' },
            { id: 'cuit_dni', name: 'CUIT/DNI', prompt: '¿CUIT o DNI?', placeholder: '30-12345678-9' }
        ],
        isOfficialForm: 'QUIEBRAS_3003',
        richFormat: (answers) => ({
            title: 'REGISTRO DE JUICIOS UNIVERSALES (QUIEBRAS)',
            isOfficial: true,
            body: [`Entidad: ${answers.razon_social || '___'} (ID: ${answers.cuit_dni || '___'})`],
            rawAnswers: answers
        }),
        format: (answers) => `QUIEBRAS 3003 - ${answers.razon_social}`
    },
    {
        id: 'demanda-danos',
        category: 'Civil',
        name: 'Daños y Perjuicios',
        disabled: true,
        description: 'Demanda por accidente de tránsito y daños civiles.',
        fields: [
            { id: 'actor', name: 'Actor', prompt: '¿Quién demanda?', placeholder: '' },
            { id: 'hecho', name: 'El Hecho', prompt: '¿Cómo fue el accidente?', placeholder: '' }
        ],
        richFormat: (answers) => ({
            title: 'DEMANDA POR DAÑOS Y PERJUICIOS',
            header: `ACTOR: ${answers.actor || '___'}`,
            body: [`HECHOS: ${answers.hecho || '___'}`]
        }),
        format: (answers) => `DEMANDA DAÑOS: ${answers.hecho}`
    },
    {
        id: 'alquiler-vivienda',
        category: 'Civil',
        name: 'Contrato Alquiler',
        disabled: true,
        description: 'Convenio de locación para vivienda particular.',
        fields: [
            { id: 'locador', name: 'Locador', prompt: '¿Nombre del dueño?', placeholder: '' },
            { id: 'locatario', name: 'Locatario', prompt: '¿Nombre del inquilino?', placeholder: '' },
            { id: 'precio', name: 'Precio', prompt: '¿Monto mensual del alquiler?', placeholder: '' }
        ],
        richFormat: (answers) => ({
            title: 'CONTRATO DE LOCACIÓN',
            header: `ENTRE: ${answers.locador || '___'} Y ${answers.locatario || '___'}`,
            body: [`Las partes acuerdan un canon locativo de ${answers.precio || '___'}.`]
        }),
        format: (answers) => `CONTRATO ALQUILER: ${answers.locador} - ${answers.locatario}`
    },

    // COMERCIAL
    {
        id: 'constitucion-sa',
        category: 'Comercial',
        name: 'Sociedad Anónima',
        disabled: true,
        description: 'Estatuto social y acta de constitución de S.A.',
        fields: [
            { id: 'denominacion', name: 'Nombre', prompt: '¿Nombre de la sociedad?', placeholder: '' },
            { id: 'capital', name: 'Capital Social', prompt: '¿Monto del capital inicial?', placeholder: '' }
        ],
        richFormat: (answers) => ({
            title: 'ESTATUTO SOCIAL S.A.',
            header: `SOCIEDAD: ${answers.denominacion || '___'}`,
            body: [`El capital social se fija en la suma de ${answers.capital || '___'}.`]
        }),
        format: (answers) => `S.A. ${answers.denominacion}`
    },
    {
        id: 'pagare',
        category: 'Comercial',
        name: 'Pagaré',
        disabled: true,
        description: 'Título ejecutivo de pago sin protesto.',
        fields: [
            { id: 'monto', name: 'Monto', prompt: '¿Cuál es el importe?', placeholder: '' },
            { id: 'fecha', name: 'Vencimiento', prompt: '¿Cuándo vence?', placeholder: '' }
        ],
        richFormat: (answers) => ({
            title: 'PAGARÉ SIN PROTESTO',
            header: `POR $: ${answers.monto || '___'}`,
            body: [`Pagaré sin protesto a la orden de... el día ${answers.fecha || '___'}.`]
        }),
        format: (answers) => `PAGARÉ POR ${answers.monto}`
    },

    // INFORMÁTICO
    {
        id: 'nda-it',
        category: 'Informático',
        name: 'Confidencialidad',
        disabled: true,
        description: 'Acuerdo NDA para software y desarrollo de sistemas.',
        fields: [
            { id: 'partes', name: 'Partes', prompt: '¿Quiénes firman el acuerdo?', placeholder: '' },
            { id: 'duracion', name: 'Duración', prompt: '¿Por cuánto tiempo es confidencial?', placeholder: '' }
        ],
        richFormat: (answers) => ({
            title: 'ACUERDO DE CONFIDENCIALIDAD (NDA)',
            header: `PARTES: ${answers.partes || '___'}`,
            body: [`La información será confidencial por un período de ${answers.duracion || '___'}.`]
        }),
        format: (answers) => `NDA: ${answers.partes}`
    },
    {
        id: 'terminos-condiciones',
        category: 'Informático',
        name: 'TyC Web/App',
        disabled: true,
        description: 'Términos y condiciones para plataformas digitales.',
        fields: [
            { id: 'sitio', name: 'Sitio Web', prompt: '¿Cuál es la URL o nombre del sitio?', placeholder: '' }
        ],
        richFormat: (answers) => ({
            title: 'TÉRMINOS Y CONDICIONES',
            header: `SITIO: ${answers.sitio || '___'}`,
            body: [`El uso de ${answers.sitio || '___'} implica la aceptación de estos términos.`]
        }),
        format: (answers) => `TyC: ${answers.sitio}`
    },

    // PATENTES
    {
        id: 'registro-marca',
        category: 'Patentes',
        name: 'Registro Marca',
        disabled: true,
        description: 'Solicitud formal de registro ante el INPI.',
        fields: [
            { id: 'marca', name: 'Marca', prompt: '¿Cuál es el nombre de la marca?', placeholder: '' },
            { id: 'clase', name: 'Clase', prompt: '¿En qué clase (Niza) se registra?', placeholder: '' }
        ],
        richFormat: (answers) => ({
            title: 'SOLICITUD DE REGISTRO DE MARCA',
            header: `MARCA: ${answers.marca || '___'}`,
            body: [`Se solicita el registro en la Clase ${answers.clase || '___'}.`]
        }),
        format: (answers) => `REGISTRO MARCA: ${answers.marca}`
    },

    // PENAL
    {
        id: 'denuncia-penal',
        category: 'Penal',
        name: 'Denuncia Penal',
        disabled: true,
        description: 'Presentación formal por presunto hecho delictivo.',
        fields: [
            { id: 'delito', name: 'Delito', prompt: '¿Cuál es el presunto delito?', placeholder: '' },
            { id: 'relato', name: 'Relato', prompt: 'Contame detalladamente qué pasó.', placeholder: '' }
        ],
        richFormat: (answers) => ({
            title: 'DENUNCIA PENAL',
            header: `MOTIVO: ${answers.delito || '___'}`,
            body: [`Relato de los hechos: ${answers.relato || '___'}. Se solicita investigación.`]
        }),
        format: (answers) => `DENUNCIA PENAL por ${answers.delito}`
    },
    // NUEVOS FORMULARIOS CPACF
    {
        id: 'sucesiones-3003',
        category: 'Civil',
        name: 'Sucesiones (3003/56)',
        description: 'Formulario de Juicios Universales para inicio de sucesiones.',
        fields: [
            { id: 'causante_nombre', name: 'Nombre del Causante', prompt: '¿Nombre completo de la persona fallecida?', placeholder: 'Juan Domingo Pérez' },
            { id: 'causante_dni', name: 'DNI del Causante', prompt: '¿DNI del fallecido?', placeholder: '12.345.678' },
            { id: 'fecha_fallecimiento', name: 'Fecha Fallecimiento', prompt: '¿En qué fecha falleció?', placeholder: 'DD/MM/AAAA' },
            { id: 'lugar_fallecimiento', name: 'Lugar', prompt: '¿En qué localidad falleció?', placeholder: 'CABA' },
            { id: 'ultimo_domicilio', name: 'Último Domicilio', prompt: '¿Cuál fue su último domicilio real?', placeholder: 'Calle Falsa 123' },
            { id: 'abogado_nombre', name: 'Abogado', prompt: '¿Nombre del abogado que inicia?', placeholder: 'Dr. Lucas García' }
        ],
        isOfficialForm: '3003_SUCESIONES',
        richFormat: (answers) => ({
            title: 'FORMULARIO DECRETO-LEY 3003/56 (SUCESIONES)',
            isOfficial: true,
            header: 'REGISTRO DE JUICIOS UNIVERSALES',
            body: [
                `Nombre del Causante: ${answers.causante_nombre || '___'}`,
                `DNI: ${answers.causante_dni || '___'}`,
                `Fallecido en: ${answers.lugar_fallecimiento || '___'} el día ${answers.fecha_fallecimiento || '___'}`
            ],
            footer: `Presentado por: ${answers.abogado_nombre || '___'}`,
            rawAnswers: answers
        }),
        format: (answers) => `SUCESIÓN 3003/56 - CAUSANTE: ${answers.causante_nombre}`
    },
    {
        id: 'cedula-civil',
        category: 'Civil',
        name: 'Cédula de Notificación',
        description: 'Cédula oficial del Poder Judicial de la Nación (Fuero Civil).',
        fields: [
            { id: 'destinatario', name: 'Destinatario', prompt: '¿A quién va dirigida la cédula?', placeholder: 'Nombre y Apellido' },
            { id: 'domicilio', name: 'Domicilio', prompt: '¿Domicilio de notificación?', placeholder: 'Calle 123, CABA' },
            { id: 'juzgado', name: 'Juzgado', prompt: '¿Número de juzgado?', placeholder: 'Juzgado Civil N° 15' },
            { id: 'secretaria', name: 'Secretaría', prompt: '¿Secretaría?', placeholder: 'Secretaría Única' },
            { id: 'expediente', name: 'Expediente', prompt: '¿Número de expediente?', placeholder: '12345/2024' },
            { id: 'texto', name: 'Transcripción', prompt: 'Dictame el texto del auto o resolución a transcribir.', placeholder: 'Buenos Aires, 20 de mayo...' }
        ],
        isOfficialForm: 'CEDULA_CIVIL',
        richFormat: (answers) => ({
            title: 'CÉDULA DE NOTIFICACIÓN (PJN CIVIL)',
            isOfficial: true,
            header: `PARA: ${answers.destinatario || '___'}\nDOMICILIO: ${answers.domicilio || '___'}\nEXPTE: ${answers.expediente || '___'}`,
            body: [answers.texto || '___'],
            rawAnswers: answers
        }),
        format: (answers) => `CÉDULA CIVIL - EXPTE: ${answers.expediente}`
    },
    {
        id: 'inicio-comercial',
        category: 'Comercial',
        name: 'Inicio Demanda Comercial',
        description: 'Formulario de inicio de causas para el fuero comercial.',
        fields: [
            { id: 'actor_nombre', name: 'Actor', prompt: '¿Nombre o Razón Social del actor?', placeholder: 'Empresa S.A.' },
            { id: 'demandado_nombre', name: 'Demandado', prompt: '¿Contra quién es la demanda?', placeholder: 'Juan Pérez' },
            { id: 'objeto', name: 'Objeto', prompt: '¿Objeto del juicio?', placeholder: 'Ejecutivo / Quiebra' },
            { id: 'monto', name: 'Monto', prompt: '¿Monto del reclamo?', placeholder: '$1.000.000' }
        ],
        isOfficialForm: 'INICIO_COMERCIAL',
        richFormat: (answers) => ({
            title: 'FORMULARIO DE INICIO - FUERO COMERCIAL',
            isOfficial: true,
            header: 'CÁMARA NACIONAL DE APELACIONES EN LO COMERCIAL',
            body: [
                `Actor: ${answers.actor_nombre || '___'}`,
                `Demandado: ${answers.demandado_nombre || '___'}`,
                `Objeto: ${answers.objeto || '___'}`
            ],
            rawAnswers: answers
        }),
        format: (answers) => `INICIO COMERCIAL - OBJETO: ${answers.objeto}`
    },
    {
        id: 'seclo-inicio',
        category: 'Laboral',
        name: 'SECLO - Inicio Reclamo',
        description: 'Formulario de iniciación del reclamo ante el SECLO.',
        fields: [
            { id: 'actor_nombre', name: 'Trabajador', prompt: '¿Nombre del trabajador?', placeholder: 'Juan Pérez' },
            { id: 'actor_cuil', name: 'CUIL', prompt: '¿CUIL del trabajador?', placeholder: '20-12345678-9' },
            { id: 'empleador_nombre', name: 'Empleador', prompt: '¿Nombre o Razón Social del empleador?', placeholder: 'Empresa S.A.' },
            { id: 'empleador_cuit', name: 'CUIT Empleador', prompt: '¿CUIT del empleador?', placeholder: '30-99999999-9' },
            { id: 'motivo', name: 'Motivo', prompt: '¿Motivo del reclamo?', placeholder: 'Despido incausado / Diferencias salariales' }
        ],
        isOfficialForm: 'SECLO_INICIO',
        richFormat: (answers) => ({
            title: 'SECLO - FORMULARIO DE INICIACIÓN DE RECLAMO',
            isOfficial: true,
            header: 'SERVICIO DE CONCILIACIÓN LABORAL OBLIGATORIA',
            body: [
                `RECLAMANTE: ${answers.actor_nombre || '___'} (CUIL: ${answers.actor_cuil || '___'})`,
                `RECLAMADO: ${answers.empleador_nombre || '___'} (CUIT: ${answers.empleador_cuit || '___'})`,
                `MOTIVO: ${answers.motivo || '___'}`
            ],
            rawAnswers: answers
        }),
        format: (answers) => `SECLO INICIO - RECLAMANTE: ${answers.actor_nombre}`
    },
    {
        id: 'inicio-seguridad-social',
        category: 'Seguridad Social',
        name: 'Inicio de Actuaciones',
        description: 'Formulario para el inicio de causas en el fuero de la Seguridad Social.',
        fields: [
            { id: 'actor_nombre', name: 'Actor', prompt: '¿Nombre del beneficiario/actor?', placeholder: 'Juan Pérez' },
            { id: 'actor_cuil', name: 'CUIL', prompt: '¿CUIL?', placeholder: '20-12345678-9' },
            { id: 'beneficio', name: 'N° Beneficio', prompt: '¿Número de beneficio o expediente ANSES?', placeholder: '00-0-0000000-0' },
            { id: 'objeto', name: 'Objeto', prompt: '¿Objeto del reclamo?', placeholder: 'Reajuste de Haberes' }
        ],
        isOfficialForm: 'INICIO_SS',
        richFormat: (answers) => ({
            title: 'FORMULARIO DE INICIO - SEGURIDAD SOCIAL',
            isOfficial: true,
            header: 'CÁMARA FEDERAL DE LA SEGURIDAD SOCIAL',
            body: [
                `Actor: ${answers.actor_nombre || '___'} (CUIL: ${answers.actor_cuil || '___'})`,
                `Beneficio: ${answers.beneficio || '___'}`,
                `Objeto: ${answers.objeto || '___'}`
            ],
            rawAnswers: answers
        }),
        format: (answers) => `INICIO SS - OBJETO: ${answers.objeto}`
    },
    {
        id: 'cedula-penal',
        category: 'Penal',
        name: 'Cédula Penal Federal',
        description: 'Cédula de notificación para el Fuero Criminal y Correccional Federal.',
        fields: [
            { id: 'destinatario', name: 'Destinatario', prompt: '¿A quién notificamos?', placeholder: 'Nombre' },
            { id: 'domicilio', name: 'Domicilio', prompt: '¿Domicilio?', placeholder: 'Calle 123' },
            { id: 'causa', name: 'Causa N°', prompt: '¿Número de causa?', placeholder: '9999/2024' },
            { id: 'juzgado', name: 'Juzgado', prompt: '¿Juzgado Federal N°?', placeholder: 'Juzgado N° 1' },
            { id: 'texto', name: 'Resolución', prompt: 'Dictame la resolución a notificar.', placeholder: 'Hágase saber que...' }
        ],
        isOfficialForm: 'CEDULA_PENAL',
        richFormat: (answers) => ({
            title: 'CÉDULA DE NOTIFICACIÓN (PENAL FEDERAL)',
            isOfficial: true,
            header: `PARA: ${answers.destinatario || '___'}\nCAUSA: ${answers.causa || '___'}\nJUZGADO: ${answers.juzgado || '___'}`,
            body: [answers.texto || '___'],
            rawAnswers: answers
        }),
        format: (answers) => `CÉDULA PENAL - CAUSA: ${answers.causa}`
    }
];
