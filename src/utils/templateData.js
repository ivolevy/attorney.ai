export const LEGAL_TEMPLATES = [
    // LABORAL
    {
        id: 'telegrama-laboral',
        category: 'Laboral',
        name: 'Telegrama Laboral Ley N° 23.789',
        description: 'Formulario oficial para más de 30 palabras.',
        fields: [
            // DESTINATARIO (COLUMNA IZQUIERDA)
            { id: 'dest_nombre', name: 'Destinatario: Nombre', prompt: '¿Nombre del destinatario?', placeholder: 'Empresa S.A.' },
            { id: 'dest_ramo', name: 'Destinatario: Ramo', prompt: '¿Ramo o actividad?', placeholder: 'Comercio' },
            { id: 'dest_domicilio', name: 'Destinatario: Domicilio', prompt: '¿Domicilio laboral?', placeholder: 'Av. Corrientes 1234' },
            { id: 'dest_cp', name: 'Destinatario: C.P.', prompt: '¿Código Postal?', placeholder: '1414' },
            { id: 'dest_localidad', name: 'Destinatario: Localidad', prompt: '¿Localidad?', placeholder: 'CABA' },
            { id: 'dest_provincia', name: 'Destinatario: Provincia', prompt: '¿Provincia?', placeholder: 'Buenos Aires' },

            // REMITENTE (COLUMNA DERECHA)
            { id: 'rem_nombre', name: 'Remitente: Nombre', prompt: '¿Tu nombre completo?', placeholder: 'Juan Pérez' },
            { id: 'rem_dni', name: 'Remitente: DNI', prompt: '¿Tu número de DNI?', placeholder: '12.345.678' },
            { id: 'rem_fecha', name: 'Remitente: Fecha', prompt: '¿Fecha de hoy?', placeholder: 'DD/MM/AAAA' },
            { id: 'rem_domicilio', name: 'Remitente: Domicilio', prompt: '¿Tu domicilio?', placeholder: 'Calle Falsa 123' },
            { id: 'rem_cp', name: 'Remitente: C.P.', prompt: '¿Tu código postal?', placeholder: '1870' },
            { id: 'rem_localidad', name: 'Remitente: Localidad', prompt: '¿Tu localidad?', placeholder: 'Avellaneda' },
            { id: 'rem_provincia', name: 'Remitente: Provincia', prompt: '¿Tu provincia?', placeholder: 'Buenos Aires' },

            // TIPO DE COMUNICACION (BOTTOM)

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
        id: 'demanda-laboral',
        category: 'Laboral',
        name: 'Demanda Laboral',
        disabled: true,
        description: 'Inicio de demanda por despido incausado.',
        fields: [
            { id: 'actor', name: 'Actor', prompt: '¿Nombre del trabajador?', placeholder: '' },
            { id: 'demandado', name: 'Demandado', prompt: '¿Nombre de la empresa?', placeholder: '' },
            { id: 'monto', name: 'Monto Reclamado', prompt: '¿Monto total de la liquidación?', placeholder: '$...' }
        ],
        richFormat: (answers) => ({
            title: 'INICIA DEMANDA LABORAL',
            header: `${answers.actor || '___'} c/ ${answers.demandado || '___'} s/ DESPIDO`,
            body: [`Vengo a promover demanda laboral por el monto de ${answers.monto || '___'}.`]
        }),
        format: (answers) => `DEMANDA LABORAL: ${answers.actor} c/ ${answers.demandado}`
    },

    // CIVIL
    {
        id: 'demanda-danos',
        category: 'Civil',
        name: 'Demanda Daños',
        disabled: true,
        description: 'Daños y perjuicios por accidente de tránsito.',
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
        name: 'Contrato de Alquiler',
        disabled: true,
        description: 'Convenio de locación para vivienda.',
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
        name: 'Estatuto S.A.',
        disabled: true,
        description: 'Constitución de Sociedad Anónima.',
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
        description: 'Título ejecutivo de pago.',
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
        name: 'Acuerdo NDA',
        disabled: true,
        description: 'Acuerdo de confidencialidad para software.',
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
        name: 'TyC Website',
        disabled: true,
        description: 'Términos y condiciones para App/Web.',
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
        name: 'Registro de Marca',
        disabled: true,
        description: 'Solicitud de registro ante el INPI.',
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
        description: 'Presentación formal por hecho delictivo.',
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
    }
];
