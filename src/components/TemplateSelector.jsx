import { useState, useMemo } from 'react';
import { BookOpen, Play, X, Mic, ChevronRight, FileText } from 'lucide-react';

const TemplateSelector = ({ onSelect, activeTemplate, currentField, onCancel, isListening, templates = [] }) => {
    const [selectedCategory, setSelectedCategory] = useState('Laboral');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = useMemo(() => {
        const cats = [...new Set(templates.map(t => t.category))].filter(Boolean);
        // Ensure Laboral is first if it exists, otherwise keep order
        return cats.sort((a, b) => a === 'Laboral' ? -1 : b === 'Laboral' ? 1 : 0);
    }, [templates]);

    const filteredTemplates = useMemo(() => {
        return templates.filter(t => {
            const name = t.name || '';
            const description = t.description || '';
            const matchesCategory = selectedCategory === 'Todos' || t.category === selectedCategory;
            const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchTerm, templates]);

    return (
        <div className="library-container">
            {!activeTemplate && (
                <div className="library-search-bar">
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Buscar formulario o palabra clave..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            )}

            <div className="library-header">
                <div className="header-title">
                    <BookOpen size={16} color="var(--accent-green)" />
                    <span>Librería Legal</span>
                </div>
                {!activeTemplate && (
                    <div className="category-scroll">
                        <button
                            className={`cat-pill ${selectedCategory === 'Todos' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('Todos')}
                        >
                            Todos
                        </button>
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
                )}
                {activeTemplate && (
                    <button className="close-circle" onClick={onCancel} style={{ marginLeft: 'auto' }}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {!activeTemplate ? (
                <div className="template-grid">
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className={`template-card ${template.disabled ? 'disabled' : ''}`}
                            onClick={() => !template.disabled && onSelect(template.id)}
                        >
                            <div className="card-icon">
                                <FileText size={20} />
                            </div>
                            <div className="card-content">
                                <h3>{template.name}</h3>
                                <p>{template.description}</p>
                            </div>
                            <div className="card-action">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="active-guide-container">
                    <div className="guide-header">
                        <div className="guide-indicator">
                            <span className="dot"></span>
                            <span>Completando Documento</span>
                        </div>
                        <h2>{activeTemplate.name}</h2>
                    </div>
                    {currentField ? (
                        <div className="prompt-card">
                            <div className="prompt-label">{currentField.label || 'Campo actual'}</div>
                            <p className="prompt-text">{currentField.prompt}</p>
                            {isListening && (
                                <div className="listening-indicator">
                                    <div className="bars">
                                        <span></span><span></span><span></span><span></span>
                                    </div>
                                    <small>Escuchando voz...</small>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="prompt-card success">
                            <p className="prompt-text">✓ Toda la información ha sido recopilada.</p>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .library-container {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    margin: 1rem auto;
                    width: 100%;
                    overflow: hidden;
                    text-align: left;
                    backdrop-filter: blur(20px);
                }

                .library-search-bar {
                    padding: 1.5rem 2rem 0 2rem;
                    display: flex;
                    justify-content: center;
                }

                .search-container {
                    flex: 1;
                    max-width: 500px;
                }

                .search-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 0.8rem 1.5rem;
                    color: #fff;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: center;
                    font-family: 'Outfit', sans-serif;
                }

                .search-input:focus {
                    border-color: var(--accent-green);
                    background: rgba(255, 255, 255, 0.08);
                    box-shadow: 0 0 30px rgba(30, 215, 96, 0.15);
                    text-align: left;
                    transform: translateY(-2px);
                }

                .library-header {
                    display: flex;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #fff;
                    font-weight: 600;
                    font-size: 1.1rem;
                    font-family: 'Outfit', sans-serif;
                }

                .category-scroll {
                    display: flex;
                    gap: 0.5rem;
                    overflow-x: auto;
                    scrollbar-width: none;
                    padding: 4px;
                }
                .category-scroll::-webkit-scrollbar { display: none; }
                
                .cat-pill {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: #888;
                    font-size: 0.85rem;
                    padding: 0.5rem 1rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                    font-family: 'Outfit', sans-serif;
                }
                .cat-pill:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: #fff;
                }
                .cat-pill.active {
                    background: var(--accent-green);
                    color: #000;
                    font-weight: 600;
                    border-color: var(--accent-green);
                }

                .template-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    padding: 1.5rem 2rem;
                    gap: 1.25rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .template-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 1.5rem;
                    display: flex;
                    gap: 1.25rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .template-card:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(30, 215, 96, 0.3);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
                }

                .card-icon {
                    width: 44px;
                    height: 44px;
                    background: rgba(30, 215, 96, 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent-green);
                    flex-shrink: 0;
                }

                .card-content {
                    flex: 1;
                }

                .card-content h3 {
                    margin: 0 0 0.4rem 0;
                    font-size: 1rem;
                    color: #fff;
                    font-family: 'Outfit', sans-serif;
                }

                .card-content p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: #888;
                    line-height: 1.4;
                }

                .card-action {
                    display: flex;
                    align-items: center;
                    color: #444;
                    transition: color 0.3s;
                }

                .template-card:hover .card-action {
                    color: var(--accent-green);
                }

                .template-card.disabled {
                    opacity: 0.3;
                    filter: grayscale(1);
                    cursor: not-allowed;
                }

                /* Active Guide Container */
                .active-guide-container {
                    padding: 2rem;
                }

                .guide-header {
                    margin-bottom: 2rem;
                }

                .guide-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--accent-green);
                    margin-bottom: 0.5rem;
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    background: var(--accent-green);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--accent-green);
                    animation: pulse-dot 2s infinite;
                }

                @keyframes pulse-dot {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .guide-header h2 {
                    font-size: 1.75rem;
                    margin: 0;
                    font-family: 'Outfit', sans-serif;
                }

                .prompt-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 2rem;
                    position: relative;
                }

                .prompt-card.success {
                    border-color: var(--accent-green);
                    background: rgba(30, 215, 96, 0.05);
                }

                .prompt-label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: #666;
                    margin-bottom: 1rem;
                    letter-spacing: 0.05em;
                }

                .prompt-text {
                    font-size: 1.5rem;
                    line-height: 1.3;
                    color: #fff;
                    margin: 0;
                    font-family: 'Outfit', sans-serif;
                }

                .listening-indicator {
                    margin-top: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .bars {
                    display: flex;
                    align-items: flex-end;
                    gap: 3px;
                    height: 20px;
                }

                .bars span {
                    width: 3px;
                    background: var(--accent-green);
                    border-radius: 2px;
                    animation: bar-wave 1s infinite;
                }

                .bars span:nth-child(1) { height: 10px; animation-delay: 0.1s; }
                .bars span:nth-child(2) { height: 18px; animation-delay: 0.3s; }
                .bars span:nth-child(3) { height: 14px; animation-delay: 0.2s; }
                .bars span:nth-child(4) { height: 16px; animation-delay: 0.4s; }

                @keyframes bar-wave {
                    0%, 100% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1); }
                }

                .listening-indicator small {
                    color: #666;
                    font-size: 0.8rem;
                }

                .close-circle {
                    background: rgba(255,255,255,0.05);
                    border: none;
                    color: #666;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .close-circle:hover { color: #fff; background: var(--danger); }

                @media (max-width: 768px) {
                    .template-grid {
                        grid-template-columns: 1fr;
                        padding: 1rem;
                    }
                    .library-header {
                        padding: 1rem;
                    }
                    .prompt-text {
                        font-size: 1.2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default TemplateSelector;
