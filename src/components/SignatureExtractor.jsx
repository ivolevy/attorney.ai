import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, X, SlidersHorizontal, Image as ImageIcon, Eraser, Undo, Crop } from 'lucide-react';
import '../index.css';

export default function SignatureExtractor({ onClose }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [threshold, setThreshold] = useState(15); // Default threshold percentage for adaptive thresholding
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultImg, setResultImg] = useState(null);
    const [eraserMode, setEraserMode] = useState(false);
    const [cropMode, setCropMode] = useState(true); // Default to crop mode now
    const [eraserSize, setEraserSize] = useState(30);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hoverPos, setHoverPos] = useState({ x: -1000, y: -1000 }); // track mouse for eraser overlay

    // History for Undo
    const [history, setHistory] = useState([]);

    // Crop state
    const [cropStart, setCropStart] = useState(null);
    const [cropEnd, setCropEnd] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [cropRect, setCropRect] = useState(null);

    const canvasRef = useRef(null);
    const originalImageRef = useRef(null);
    const fileInputRef = useRef(null);
    const displayCanvasRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target.result);
            setResultImg(null); // Reset previous result
        };
        reader.readAsDataURL(file);
    };

    const processImage = () => {
        if (!imageSrc || !canvasRef.current || !originalImageRef.current) return;
        setIsProcessing(true);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = originalImageRef.current;

        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        const width = canvas.width;
        const height = canvas.height;

        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const outImageData = ctx.createImageData(width, height);
        const outData = outImageData.data;

        // Parameters for adaptive thresholding
        const s = Math.floor(width / 8); // Size of the local window
        const t = threshold / 100; // Threshold percentage, e.g., 15% -> 0.15

        // Helper to get pixel grayscale value
        const getGray = (x, y) => {
            if (x < 0) x = 0;
            if (x >= width) x = width - 1;
            if (y < 0) y = 0;
            if (y >= height) y = height - 1;
            const i = (y * width + x) * 4;
            return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        };

        // Calculate integral image for fast local average computation
        const integralImg = new Uint32Array(width * height);
        for (let i = 0; i < width; i++) {
            let sum = 0;
            for (let j = 0; j < height; j++) {
                sum += getGray(i, j);
                if (i === 0) {
                    integralImg[j * width + i] = sum;
                } else {
                    integralImg[j * width + i] = integralImg[j * width + i - 1] + sum;
                }
            }
        }

        // Apply adaptive thresholding based on Bradley-Roth algorithm
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let x1 = Math.max(i - s / 2, 0);
                let x2 = Math.min(i + s / 2, width - 1);
                let y1 = Math.max(j - s / 2, 0);
                let y2 = Math.min(j + s / 2, height - 1);

                x1 = Math.floor(x1);
                x2 = Math.floor(x2);
                y1 = Math.floor(y1);
                y2 = Math.floor(y2);

                let count = (x2 - x1) * (y2 - y1);
                let sum = integralImg[y2 * width + x2] -
                    integralImg[y1 * width + x2] -
                    integralImg[y2 * width + x1] +
                    integralImg[y1 * width + x1];

                const index = (j * width + i) * 4;
                const gray = getGray(i, j);

                // If the pixel is darker than the local average by `t` percent
                const isInk = (gray * count) <= (sum * (1.0 - t));

                if (isInk) {
                    // Keep original color but increase contrast slightly for punchiness
                    outData[index] = Math.max(0, data[index] - 20); // R
                    outData[index + 1] = Math.max(0, data[index + 1] - 20); // G
                    outData[index + 2] = Math.max(0, data[index + 2] - 20); // B
                    outData[index + 3] = 255; // Fully opaque
                } else {
                    // Make it white (or transparent if desired, here keeping white)
                    outData[index] = 255;
                    outData[index + 1] = 255;
                    outData[index + 2] = 255;
                    outData[index + 3] = 0; // Transparent (so it can be placed over white or anything)
                }
            }
        }

        ctx.putImageData(outImageData, 0, 0);

        const displayCanvas = displayCanvasRef.current;
        if (displayCanvas) {
            displayCanvas.width = width;
            displayCanvas.height = height;
            const displayCtx = displayCanvas.getContext('2d');
            displayCtx.putImageData(outImageData, 0, 0);
            setResultImg(displayCanvas.toDataURL('image/png'));
            setHistory([]); // Reset undo history on new process
            setCropRect({ x: 0, y: 0, width, height }); // Reset crop
        }

        setIsProcessing(false);
    };

    const saveHistory = () => {
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas) return;

        // Keep last 10 steps to prevent huge memory usage limit
        setHistory(prev => {
            const newHist = [...prev, displayCanvas.toDataURL('image/png')];
            return newHist.slice(-10);
        });
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas) return;

        const previousState = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1)); // Remove last state

        const img = new Image();
        img.onload = () => {
            const ctx = displayCanvas.getContext('2d');
            ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
            ctx.drawImage(img, 0, 0);
            setResultImg(displayCanvas.toDataURL('image/png'));
        };
        img.src = previousState;
    };

    const startInteraction = (e) => {
        if (cropMode) {
            startCrop(e);
        } else if (eraserMode) {
            startErase(e);
        }
    };

    const stopInteraction = () => {
        setHoverPos({ x: -1000, y: -1000 }); // Hide eraser overlay when leaving canvas
        if (cropMode) {
            stopCrop();
        } else if (eraserMode) {
            stopErase();
        }
    };

    const moveInteraction = (e) => {
        if (eraserMode) {
            const rect = displayCanvasRef.current.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            setHoverPos({
                x: clientX - rect.left,
                y: clientY - rect.top
            });
            erase(e);
        } else if (cropMode) {
            drawCrop(e);
        }
    };

    const startErase = (e) => {
        setIsDrawing(true);
        saveHistory();
        erase(e, true);
    };

    const stopErase = () => {
        setIsDrawing(false);
    };

    const erase = (e, force = false) => {
        if (!isDrawing && !force) return;
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas) return;

        const ctx = displayCanvas.getContext('2d');
        const rect = displayCanvas.getBoundingClientRect();

        // Use client width/height against true canvas width/height to get scale factor
        const scaleX = displayCanvas.width / rect.width;
        const scaleY = displayCanvas.height / rect.height;

        // Handle both mouse and touch events
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        // Scale the eraser radius relatively to the canvas actual pixel size
        // Using average scale to keep it roughly circular
        const avgScale = (scaleX + scaleY) / 2;
        const effectiveRadius = eraserSize * avgScale;

        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        // 0.5 fixes crisp edges during erasing on HTML5 Canvas
        ctx.arc(x, y, effectiveRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Update the download URL silently without triggering full reload
        setResultImg(displayCanvas.toDataURL('image/png'));
    };

    // --- Cropping Logic ---
    const getCoordinates = (e) => {
        const displayCanvas = displayCanvasRef.current;
        const rect = displayCanvas.getBoundingClientRect();
        const scaleX = displayCanvas.width / rect.width;
        const scaleY = displayCanvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const screenX = clientX - rect.left;
        const screenY = clientY - rect.top;

        return {
            x: screenX * scaleX,
            y: screenY * scaleY,
            screenX,
            screenY
        };
    };

    const startCrop = (e) => {
        setIsCropping(true);
        const coords = getCoordinates(e);
        setCropStart(coords);
        setCropEnd(coords);
    };

    const drawCrop = (e) => {
        if (!isCropping) return;
        setCropEnd(getCoordinates(e));
    };

    const stopCrop = () => {
        if (!isCropping) return;
        setIsCropping(false);
        if (cropStart && cropEnd) {
            const x = Math.min(cropStart.x, cropEnd.x);
            const y = Math.min(cropStart.y, cropEnd.y);
            let w = Math.abs(cropEnd.x - cropStart.x);
            let h = Math.abs(cropEnd.y - cropStart.y);

            // Minimum crop size to prevent accident clicks ruining the image
            if (w < 20 || h < 20) {
                setCropStart(null);
                setCropEnd(null);
                return;
            }

            setCropRect({ x, y, width: w, height: h });
            applyCrop(x, y, w, h);
            setCropStart(null);
            setCropEnd(null);
        }
    };

    const applyCrop = (x, y, w, h) => {
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas) return;

        saveHistory(); // Save pre-crop state

        const ctx = displayCanvas.getContext('2d');
        const imageData = ctx.getImageData(x, y, w, h);

        displayCanvas.width = w;
        displayCanvas.height = h;

        ctx.putImageData(imageData, 0, 0);
        setResultImg(displayCanvas.toDataURL('image/png'));
    };
    // -----------------------

    // Re-process when image or threshold changes
    useEffect(() => {
        if (imageSrc && originalImageRef.current && originalImageRef.current.complete) {
            processImage();
        }
    }, [threshold, imageSrc]);

    const handleImageLoad = () => {
        processImage();
    };

    const handleDownload = () => {
        if (!resultImg) return;
        const link = document.createElement('a');
        link.href = resultImg;
        link.download = `firma-extraida-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="signature-extractor-overlay">
            <div className="signature-extractor-container">
                <div className="se-header">
                    <h2>
                        <ImageIcon className="se-icon" size={24} />
                        Extractor de Firmas Inteligente
                    </h2>
                    <button className="icon-btn danger" onClick={onClose} title="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <div className="se-body">
                    {!imageSrc ? (
                        <div
                            className="se-upload-area"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={48} className="upload-icon" />
                            <p>Haz clic para subir de la foto de la firma</p>
                            <span className="se-hint">Soporta JPG, PNG</span>
                        </div>
                    ) : (
                        <div className="se-workspace">
                            <div className="se-controls">
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        className={`secondary-btn mode-btn ${cropMode ? 'active' : ''}`}
                                        onClick={() => { setCropMode(true); setEraserMode(false); }}
                                    >
                                        <Crop size={16} /> Recortar
                                    </button>
                                    <button
                                        className={`secondary-btn mode-btn ${eraserMode ? 'active' : ''}`}
                                        onClick={() => { setEraserMode(true); setCropMode(false); }}
                                    >
                                        <Eraser size={16} /> Goma
                                    </button>
                                </div>

                                {eraserMode && (
                                    <div className="slider-group">
                                        <label>
                                            <Eraser size={16} /> Tamaño de la Goma
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="150"
                                            value={eraserSize}
                                            onChange={(e) => setEraserSize(Number(e.target.value))}
                                            className="threshold-slider"
                                        />
                                        <span className="se-hint">Pinta con el ratón o dedo sobre las palabras sobrantes.</span>
                                    </div>
                                )}

                                {cropMode && (
                                    <div className="slider-group">
                                        <label>
                                            <Crop size={16} /> Herramienta de Recorte
                                        </label>
                                        <span className="se-hint">Haz clic y arrastra sobre la firma para enmarcarla. El resto se eliminará.</span>
                                    </div>
                                )}

                                <div className="se-actions">
                                    {history.length > 0 && (
                                        <button className="secondary-btn" onClick={handleUndo}>
                                            <Undo size={16} /> Deshacer ({history.length})
                                        </button>
                                    )}
                                    <button className="secondary-btn" onClick={() => setImageSrc(null)}>
                                        <RefreshCw size={16} /> Subir otra
                                    </button>
                                    <button className="primary-btn" onClick={handleDownload} disabled={!resultImg}>
                                        <Download size={16} /> Descargar Firma
                                    </button>
                                </div>
                            </div>

                            <div className="se-preview-area">
                                <div className="se-preview-box">
                                    <p className="se-preview-title">Resultado (Fondo Blanco)</p>
                                    <div className="se-image-wrapper">
                                        {/* Hidden canvas for processing */}
                                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                                        {/* Hidden original image to get raw data */}
                                        <img
                                            ref={originalImageRef}
                                            src={imageSrc}
                                            alt="Original"
                                            style={{ display: 'none' }}
                                            onLoad={handleImageLoad}
                                            crossOrigin="anonymous"
                                        />

                                        {isProcessing ? (
                                            <div className="se-loading">Procesando...</div>
                                        ) : null}

                                        <div style={{ position: 'relative', display: (!isProcessing && resultImg) ? 'inline-block' : 'none' }}>
                                            <canvas
                                                ref={displayCanvasRef}
                                                className="se-result-img"
                                                style={{
                                                    display: 'block',
                                                    cursor: cropMode ? 'crosshair' : (eraserMode ? 'crosshair' : 'default'),
                                                    touchAction: (eraserMode || cropMode) ? 'none' : 'auto', // disable scroll while interacting on mobile
                                                    border: eraserMode ? '2px dashed var(--accent-green)' : 'none'
                                                }}
                                                onMouseDown={startInteraction}
                                                onMouseMove={moveInteraction}
                                                onMouseUp={stopInteraction}
                                                onMouseLeave={stopInteraction}
                                                onTouchStart={startInteraction}
                                                onTouchMove={moveInteraction}
                                                onTouchEnd={stopInteraction}
                                            />

                                            {/* Overlay for drawing crop rectangle live */}
                                            {isCropping && cropStart && cropEnd && (
                                                <div style={{
                                                    position: 'absolute',
                                                    border: '2px dashed var(--accent-green)',
                                                    backgroundColor: 'rgba(30, 215, 96, 0.2)',
                                                    pointerEvents: 'none',
                                                    left: `${Math.min(cropStart.screenX, cropEnd.screenX)}px`,
                                                    top: `${Math.min(cropStart.screenY, cropEnd.screenY)}px`,
                                                    width: `${Math.abs(cropEnd.screenX - cropStart.screenX)}px`,
                                                    height: `${Math.abs(cropEnd.screenY - cropStart.screenY)}px`,
                                                    zIndex: 10
                                                }} />
                                            )}

                                            {/* Eraser visual overlay */}
                                            {eraserMode && hoverPos.x !== -1000 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    pointerEvents: 'none',
                                                    left: `${hoverPos.x}px`,
                                                    top: `${hoverPos.y}px`,
                                                    width: `${eraserSize * 2}px`,
                                                    height: `${eraserSize * 2}px`,
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: 'rgba(30, 215, 96, 0.4)',
                                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                                    borderRadius: '50%',
                                                    zIndex: 10,
                                                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                                                }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
}
