import { useState, useMemo } from 'react';
import { LEGAL_TEMPLATES } from '../utils/templateData';
import { BookOpen, Play, X, Mic, ChevronRight } from 'lucide-react';

const TemplateSelector = ({ onSelect, activeTemplate, currentField, onCancel }) => {
    const [selectedCategory, setSelectedCategory] = useState('Laboral'); // Start with a specific category for cleaner initial view

    const categories = useMemo(() => {
        return [...new Set(LEGAL_TEMPLATES.map(t => t.category))];
    }, []);

    const filteredTemplates = useMemo(() => {
        return LEGAL_TEMPLATES.filter(t => t.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="library-container">
            <div className="library-header">
                <div className="header-title">
                    <BookOpen size={16} color="var(--accent-green)" />
                    <span>Librería Legal</span>
                </div>
                <div className="category-scroll">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                {activeTemplate && (
                    <button className="close-circle" onClick={onCancel}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {!activeTemplate ? (
                <div className="template-list-compact">
                    {filteredTemplates.map((template) => (
                        <div 
                            key={template.id} 
                            className={`compact-card ${template.disabled ? 'disabled' : ''}`} 
                            onClick={() => !template.disabled && onSelect(template.id)}
                        >
                            <div className="card-main">
                                <h5>{template.name}</h5>
                                <p>{template.description}</p>
                            </div>
                            {!template.disabled && <ChevronRight size={16} className="arrow-icon" />}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="active-guide-compact">
                    <div className="guide-status-bar">
                        <div className="shimmer-line"></div>
                        <span>Completando: <strong>{activeTemplate.name}</strong></span>
                    </div>
                    {currentField ? (
                        <div className="mini-prompt-box">
                            <span className="field-label">{currentField.name}</span>
                            <p className="prompt-txt">{currentField.prompt}</p>
                            <div className="mic-wave">
                                <span></span><span></span><span></span>
                                <small>Escuchando...</small>
                            </div>
                        </div>
                    ) : (
                        <div className="mini-prompt-box success">
                            <p className="prompt-txt">✓ Todo listo</p>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .library-container {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    margin-top: 2.5rem;
                    overflow: hidden;
                    text-align: left;
                }
                .library-header {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    gap: 1rem;
                }
                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #888;
                    white-space: nowrap;
                }
                .category-scroll {
                    display: flex;
                    gap: 0.4rem;
                    overflow-x: auto;
                    scrollbar-width: none;
                }
                .category-scroll::-webkit-scrollbar { display: none; }
                
                .cat-pill {
                    background: transparent;
                    border: none;
                    color: #666;
                    font-size: 0.75rem;
                    padding: 0.25rem 0.6rem;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .cat-pill.active {
                    background: rgba(30, 215, 96, 0.1);
                    color: var(--accent-green);
                    font-weight: 500;
                }

                .template-list-compact {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    padding: 0.5rem;
                    gap: 0.5rem;
                }
                .compact-card {
                    background: rgba(255, 255, 255, 0.01);
                    border: 1px solid transparent;
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .compact-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(30, 215, 96, 0.2);
                    transform: translateX(2px);
                }
                .compact-card.disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    filter: grayscale(1);
                    pointer-events: none;
                }
                .compact-card.disabled:hover {
                    background: rgba(255, 255, 255, 0.01);
                    border-color: transparent;
                    transform: none;
                }
                .card-main h5 {
                    margin: 0;
                    font-size: 0.85rem;
                    color: #eee;
                }
                .card-main p {
                    margin: 0.1rem 0 0 0;
                    font-size: 0.7rem;
                    color: #666;
                }
                .arrow-icon {
                    color: #444;
                    transition: color 0.2s;
                }
                .compact-card:hover .arrow-icon {
                    color: var(--accent-green);
                }

                /* Active Guide refined */
                .active-guide-compact {
                    padding: 1rem;
                }
                .guide-status-bar {
                    font-size: 0.7rem;
                    color: #888;
                    margin-bottom: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .shimmer-line {
                    height: 2px;
                    width: 20px;
                    background: var(--accent-green);
                    box-shadow: 0 0 10px var(--accent-green);
                }
                .mini-prompt-box {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    padding: 1rem;
                    position: relative;
                }
                .field-label {
                    position: absolute;
                    top: -8px;
                    left: 12px;
                    background: #0a0a0a;
                    padding: 0 6px;
                    font-size: 0.6rem;
                    color: var(--accent-green);
                    text-transform: uppercase;
                }
                .prompt-txt {
                    margin: 0;
                    font-size: 1rem;
                    color: #fff;
                }
                .mic-wave {
                    margin-top: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                .mic-wave span {
                    width: 3px;
                    height: 8px;
                    background: var(--accent-green);
                    border-radius: 2px;
                    animation: wave 1s infinite;
                }
                .mic-wave span:nth-child(2) { animation-delay: 0.2s; }
                .mic-wave span:nth-child(3) { animation-delay: 0.4s; }
                .mic-wave small {
                    margin-left: 0.5rem;
                    font-size: 0.6rem;
                    color: #666;
                }

                .close-circle {
                    background: rgba(255,255,255,0.05);
                    border: none;
                    color: #666;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    margin-left: auto;
                }
                .close-circle:hover { color: #fff; background: var(--danger); }

                @keyframes wave {
                    0%, 100% { height: 4px; }
                    50% { height: 12px; }
                }

                @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(0.9); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default TemplateSelector;
