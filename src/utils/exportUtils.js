import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Exports text to a PDF file with basic branding
 * @param {string} text - The transcript text
 */
export const exportToPDF = (text) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 215, 96); // Accent Green
    doc.text('attorney.ai', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Transcripción Jurídica - ${date}`, 20, 30);

    // Content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Split text to fit width
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 45);

    doc.save(`Transcripcion_LexScribe_${date.replace(/\//g, '-')}.pdf`);
};

/**
 * Exports text to a Word (.docx) file
 * @param {string} text - The transcript text
 */
export const exportToWord = async (text) => {
    const date = new Date().toLocaleDateString();

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: "attorney.ai",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `Transcripción Jurídica - ${date}`,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),
                    ...text.split('\n').map(line =>
                        new Paragraph({
                            children: [new TextRun(line)],
                            spacing: { after: 200 },
                        })
                    ),
                    new Paragraph({
                        text: "\n\nDocumento generado por attorney.ai",
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 1000 },
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Transcripcion_LexScribe_${date.replace(/\//g, '-')}.docx`);
};
