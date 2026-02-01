import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';
import tclPdfUrl from '../assets/library/laboral/tcl30/tcl30web.pdf?url';
import ingresoCausasPngUrl from '../assets/library/laboral/ingreso-causas/ingreso-causas.png?url';
import inicioDemandaPngUrl from '../assets/library/laboral/inicio-demanda/formulario inicio demanda.png?url';

/**
 * Exports text to a PDF file with basic branding or rich formatting
 * @param {string|object} content - The transcript text or rich content object
 */
export const exportToPDF = async (content) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    let currentY = 20;

    // Helper to sanitize filename
    const getFilename = (title) => {
        if (!title) return `Documento_Legal_${date}.pdf`;
        const sanitized = title.replace(/[^a-z0-9]/gi, '_').toUpperCase();
        return `${sanitized}_${date}.pdf`;
    };

    // If it's the rich structure from templateData
    if (content && content.title && content.body) {
        const { title, header, body, isOfficial, rawAnswers } = content;
        const filename = getFilename(title);

        if (isOfficial) {

            // 1. TCL 30
            if (title.includes('TCL 30') || title.includes('TCL +30')) {
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
                            color: rgb(0, 0, 0.5)
                        });
                    };

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

                    const bodyText = body[0] || '';
                    const bodyFontSize = 9;
                    const bodyX = (8.0 / 100) * width;
                    const bodyYStart = (1 - (33.0 / 100)) * height;

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
                    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), filename);
                    return;
                } catch (err) {
                    console.error('Error with TCL PDF:', err);
                }
            }

            // 2. INGRESO DE CAUSAS
            else if (content.isIngresoCausas) {
                try {
                    const pdfDoc = await PDFDocument.create();
                    const page = pdfDoc.addPage();
                    const { width, height } = page.getSize();

                    // Embed PNG
                    const response = await fetch(ingresoCausasPngUrl);
                    const pngImageBytes = await response.arrayBuffer();
                    const pngImage = await pdfDoc.embedPng(pngImageBytes);
                    page.drawImage(pngImage, {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                    });

                    const draw = (text, xPct, yPct, size = 11) => {
                        if (!text) return;
                        page.drawText(text.toString().toUpperCase(), {
                            x: (xPct / 100) * width,
                            y: (1 - (yPct / 100)) * height,
                            size: size,
                            color: rgb(0, 0, 0.4) // Navy like the app
                        });
                    };

                    draw(rawAnswers.abogado_tomo, 27.5, 40.2);
                    draw(rawAnswers.abogado_folio, 34.5, 40.2);
                    draw(rawAnswers.abogado_nombre, 43.5, 40.2);
                    draw(rawAnswers.actor_nombre, 18.5, 55.6);
                    draw(rawAnswers.actor_ieric, 43.5, 55.6);
                    draw(rawAnswers.actor_dni, 18.5, 57.4);

                    // Sexo checkboxes (Approximate X positions)
                    const s = (rawAnswers.actor_sexo || '').toLowerCase();
                    if (s.includes('fem')) draw('X', 45.1, 59.2, 14);
                    else if (s.includes('masc')) draw('X', 60.1, 59.2, 14);
                    else if (s) draw('X', 88.3, 59.2, 14);

                    draw(rawAnswers.demandado_nombre, 18.5, 67.0);
                    draw(rawAnswers.expte_numero, 18.5, 80.5);

                    const pdfBytes = await pdfDoc.save();
                    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), filename);
                    return;
                } catch (err) {
                    console.error('Error with Ingreso Causas PDF:', err);
                }
            }

            // 3. INICIO DE DEMANDA
            else if (content.isInicioDemanda) {
                try {
                    const pdfDoc = await PDFDocument.create();
                    const page = pdfDoc.addPage();
                    const { width, height } = page.getSize();

                    // Embed PNG
                    const response = await fetch(inicioDemandaPngUrl);
                    const pngImageBytes = await response.arrayBuffer();
                    const pngImage = await pdfDoc.embedPng(pngImageBytes);
                    page.drawImage(pngImage, {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                    });

                    const draw = (text, xPct, yPct, size = 11) => {
                        if (!text) return;
                        page.drawText(text.toString().toUpperCase(), {
                            x: (xPct / 100) * width,
                            y: (1 - (yPct / 100)) * height,
                            size: size,
                            color: rgb(0, 0, 0.4)
                        });
                    };

                    // Coordinates mapped from RichDocumentPreview (top/left) to PDF (x/y)
                    // PDF Y is from bottom-up, so y = 1 - (top / 100)
                    // PDF X is left-right, so x = left / 100
                    draw(rawAnswers.fuero, 20, 15);
                    draw(rawAnswers.objeto, 20, 20);
                    draw(rawAnswers.monto, 20, 25);
                    draw(rawAnswers.actor_nombre, 20, 30);
                    draw(rawAnswers.actor_dni, 65, 30);
                    draw(rawAnswers.demandado_nombre, 20, 35);
                    draw(rawAnswers.abogado_nombre, 20, 40);

                    const pdfBytes = await pdfDoc.save();
                    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), filename);
                    return;
                } catch (err) {
                    console.error('Error with Inicio Demanda PDF:', err);
                }
            }
        }

        // --- GENERIC RICH TEXT EXPORT ---
        doc.setFont('times', 'bold');
        doc.setFontSize(16);
        const titleWidth = doc.getTextWidth(title);
        const centerX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
        doc.text(title, centerX, currentY);
        doc.line(centerX, currentY + 1, centerX + titleWidth, currentY + 1);
        currentY += 20;

        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        const headerLines = doc.splitTextToSize(header, 170);
        doc.text(headerLines, 20, currentY);
        currentY += (headerLines.length * 7) + 10;

        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        body.forEach(para => {
            const splitPara = doc.splitTextToSize(para, 170);
            doc.text(splitPara, 20, currentY, { align: 'justify', maxWidth: 170 });
            currentY += (splitPara.length * 7) + 10;
            if (currentY > 270) {
                doc.addPage();
                currentY = 20;
            }
        });

        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }
        currentY += 20;
        doc.line(120, currentY, 190, currentY);
        doc.setFontSize(8);
        doc.text('Firma del compareciente', 135, currentY + 5);

        doc.save(filename);

    } else {
        // --- PLAIN TEXT EXPORT ---
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

        doc.save(`Transcripcion_${date}.pdf`);
    }
};


