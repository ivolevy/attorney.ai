import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';
import tclPdfUrl from '../assets/library/tcl30/tcl30web.pdf?url';

/**
 * Exports text to a PDF file with basic branding or rich formatting
 * @param {string|object} content - The transcript text or rich content object
 */
export const exportToPDF = async (content) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    let currentY = 20;

    // Check if it is rich content
    if (typeof content === 'object' && content.richFormat && typeof content.richFormat === 'function') {
        // This handles passing the template object itself with answers,
        // but to keep it simple and decoupled, we'll check if it has the rich structure directly
    }

    // If it's the rich structure from templateData
    if (content && content.title && content.body) {
        const { title, header, body, isOfficial, rawAnswers } = content;

        if (isOfficial && (title.includes('TCL 30') || title.includes('TCL +30'))) {
            // OFFICIAL PDF FILLING STRATEGY
            const fillOfficialPDF = async () => {
                try {
                    const response = await fetch(tclPdfUrl);
                    const existingPdfBytes = await response.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(existingPdfBytes);
                    const pages = pdfDoc.getPages();
                    const firstPage = pages[0];
                    const { width, height } = firstPage.getSize();

                    const draw = (text, xPct, yPct, size = 9) => {
                        if (!text) return;
                        firstPage.drawText(text.toString().toUpperCase(), {
                            x: (xPct / 100) * width,
                            y: (1 - (yPct / 100)) * height,
                            size: size,
                            color: rgb(0, 0, 0.5) // Dark blue typewriter style
                        });
                    };

                    // Recalibrated coordinates for PDF-lib filling (Synced with UI - One Touch Higher)
                    draw(rawAnswers.dest_nombre, 8.0, 13.4);
                    draw(rawAnswers.dest_ramo, 8.0, 16.6);
                    draw(rawAnswers.dest_domicilio, 8.0, 20.0);
                    draw(rawAnswers.dest_cp, 36.5, 20.0);
                    draw(rawAnswers.dest_localidad, 8.0, 23.7);
                    draw(rawAnswers.dest_provincia, 32.5, 23.7);

                    draw(rawAnswers.rem_nombre, 56.0, 13.4);
                    draw(rawAnswers.rem_dni, 56.0, 16.6);
                    draw(rawAnswers.rem_fecha, 83.0, 16.6);
                    draw(rawAnswers.rem_domicilio, 56.0, 20.0);
                    draw(rawAnswers.rem_cp, 85.0, 20.0);
                    draw(rawAnswers.rem_localidad, 56.0, 23.7);
                    draw(rawAnswers.rem_provincia, 81.0, 23.7);

                    // Body
                    const bodyText = body[0] || '';
                    const bodyFontSize = 9;
                    const bodyX = (8.0 / 100) * width;
                    const bodyYStart = (1 - (33.0 / 100)) * height;

                    // Simple word wrap for PDF
                    const words = bodyText.split(' ');
                    let currentLine = '';
                    let yOffset = 0;
                    words.forEach(word => {
                        if ((currentLine + word).length > 80) {
                            firstPage.drawText(currentLine, { x: bodyX, y: bodyYStart - yOffset, size: bodyFontSize });
                            currentLine = word + ' ';
                            yOffset += 15;
                        } else {
                            currentLine += word + ' ';
                        }
                    });
                    firstPage.drawText(currentLine, { x: bodyX, y: bodyYStart - yOffset, size: bodyFontSize });

                    const pdfBytes = await pdfDoc.save();
                    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), `TCL_OFICIAL_${date.replace(/\//g, '-')}.pdf`);
                } catch (err) {
                    console.error('Error filling PDF:', err);
                    alert('Error al generar el PDF oficial. Se usará el formato estándar.');
                }
            };

            await fillOfficialPDF();
            return;
        }

        // Title - Centered and Underlined
        doc.setFont('times', 'bold');
        doc.setFontSize(16);
        const titleWidth = doc.getTextWidth(title);
        const centerX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
        doc.text(title, centerX, currentY);
        doc.line(centerX, currentY + 1, centerX + titleWidth, currentY + 1);
        currentY += 20;

        // Header (Expte, etc)
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        const headerLines = doc.splitTextToSize(header, 170);
        doc.text(headerLines, 20, currentY);
        currentY += (headerLines.length * 7) + 10;

        // Body Paragraphs
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        body.forEach(para => {
            const splitPara = doc.splitTextToSize(para, 170);
            // In legal docs, we usually have an indent
            doc.text(splitPara, 20, currentY, { align: 'justify', maxWidth: 170 });
            currentY += (splitPara.length * 7) + 10;

            // Handle page overflow
            if (currentY > 270) {
                doc.addPage();
                currentY = 20;
            }
        });

        // Signature
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }
        currentY += 20;
        doc.line(120, currentY, 190, currentY);
        doc.setFontSize(8);
        doc.text('Firma del compareciente', 135, currentY + 5);

    } else {
        // Standard non-template export
        const text = typeof content === 'string' ? content : JSON.stringify(content);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(30, 215, 96); // Accent Green
        doc.text('Lexia', 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Transcripción - ${date}`, 20, 30);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        const splitText = doc.splitTextToSize(text, 170);
        doc.text(splitText, 20, 45);
    }

    doc.save(`Documento_Legal_${date.replace(/\//g, '-')}.pdf`);
};

/**
 * Exports text to a Word (.docx) file
 * @param {string|object} content - The transcript text or rich content object
 */
export const exportToWord = async (content) => {
    const date = new Date().toLocaleDateString();
    let sections = [];

    if (content && content.title && content.body) {
        const { title, header, body } = content;

        sections = [{
            properties: {
                page: {
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch margins
                }
            },
            children: [
                new Paragraph({
                    children: [new TextRun({ text: title, bold: true, underline: {}, size: 32 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                new Paragraph({
                    children: [new TextRun({ text: header, bold: true, size: 24 })],
                    spacing: { after: 400 },
                }),
                ...body.map(para => new Paragraph({
                    children: [new TextRun({ text: para, size: 24 })],
                    alignment: AlignmentType.JUSTIFIED,
                    indent: { firstLine: 720 }, // 0.5 inch indent
                    spacing: { after: 200 },
                })),
            ]
        }];
    } else {
        const text = typeof content === 'string' ? content : JSON.stringify(content);
        sections = [{
            children: [
                new Paragraph({
                    text: "Lexia",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: `Transcripción - ${date}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                ...text.split('\n').map(line =>
                    new Paragraph({
                        children: [new TextRun(line)],
                        spacing: { after: 200 },
                    })
                ),
            ],
        }];
    }

    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Documento_Legal_${date.replace(/\//g, '-')}.docx`);
};
