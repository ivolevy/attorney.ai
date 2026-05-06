import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';

// Local fallbacks
import tclPdf from '../assets/library/laboral/tcl30/tcl30web.png'; // Wait, TCL was PDF before, but if it's PNG I should handle it.
// Actually, I'll use the PNG as a fallback if PDF is not available.

/**
 * Exports text to a PDF file with basic branding or rich formatting
 * @param {string|object} content - The transcript text or rich content object
 */
export const exportToPDF = async (content) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString().replace(/\//g, '-');
    let currentY = 20;

    // Track export in PostHog
    if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('document_exported', {
            is_rich_content: typeof content === 'object',
            title: typeof content === 'object' ? content.title : 'Simple Transcript'
        });
    }

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
            // Track event in PostHog
            if (window.posthog) {
                window.posthog.capture('document_exported', {
                    template_id: content.isOfficialForm || 'unknown',
                    template_name: title,
                    is_official: true
                });
            }

            // 1. TCL 30
            if (title.includes('TCL 30') || title.includes('TCL +30')) {
                try {
                    const pdfUrl = content.pdfUrl || content.backgroundUrl; // Use PDF if available, fallback to PNG
                    const response = await fetch(pdfUrl);
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

            // 2. MOTOR DINÁMICO (Basado en el layout de la DB)
            else if (content.layout && Object.keys(content.layout).length > 0) {
                try {
                    const pdfDoc = await PDFDocument.create();
                    const page = pdfDoc.addPage();
                    const { width, height } = page.getSize();

                    // Embed PNG from Supabase URL or local fallback
                    const imageUrl = content.backgroundUrl;
                    if (!imageUrl) throw new Error("No background image for official form");

                    const response = await fetch(imageUrl);
                    const imageBytes = await response.arrayBuffer();
                    
                    // Soporte para PNG o JPG
                    let embeddedImage;
                    if (imageUrl.toLowerCase().endsWith('.png')) {
                        embeddedImage = await pdfDoc.embedPng(imageBytes);
                    } else {
                        embeddedImage = await pdfDoc.embedJpg(imageBytes);
                    }

                    page.drawImage(embeddedImage, {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                    });

                    const draw = (text, xPct, yPct, size = 10) => {
                        if (!text) return;
                        page.drawText(text.toString().toUpperCase(), {
                            x: (xPct / 100) * width,
                            y: (1 - (yPct / 100)) * height,
                            size: size,
                            color: rgb(0, 0, 0.4)
                        });
                    };

                    // Dibujar cada campo definido en el layout
                    Object.entries(content.layout).forEach(([fieldId, coords]) => {
                        const value = rawAnswers[fieldId];
                        if (value) {
                            const xPct = parseFloat(coords.left);
                            const yPct = parseFloat(coords.top);
                            
                            // Si es un campo de texto largo (ej: cuerpo del telegrama)
                            if (coords.type === 'textarea' || fieldId === 'texto') {
                                const words = value.toString().toUpperCase().split(' ');
                                let currentLine = '';
                                let yOffset = 0;
                                const wrapWidth = 70; // Caracteres por línea aprox
                                
                                words.forEach(word => {
                                    if ((currentLine + word).length > wrapWidth) {
                                        draw(currentLine, xPct, yPct + (yOffset / height * 100));
                                        currentLine = word + ' ';
                                        yOffset += 12; // Salto de línea
                                    } else {
                                        currentLine += word + ' ';
                                    }
                                });
                                draw(currentLine, xPct, yPct + (yOffset / height * 100));
                            } else {
                                draw(value, xPct, yPct);
                            }
                        }
                    });

                    const pdfBytes = await pdfDoc.save();
                    saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), filename);
                    return;
                } catch (err) {
                    console.error('Error with Dynamic PDF:', err);
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


