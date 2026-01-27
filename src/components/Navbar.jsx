import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scale, ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/inicia-sesion');
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            height: '70px',
            background: 'rgba(20, 30, 20, 0.6)', // Dark semi-transparent base
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(30, 215, 96, 0.2)', // Greenish border
            borderRadius: '100px', // Pill shape
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
            {/* Left Side: Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    background: 'var(--accent-green)',
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Scale size={20} color="#000" strokeWidth={2} />
                </div>
                <span style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    letterSpacing: '-0.5px',
                    color: '#fff'
                }}>
                    Lexia
                </span>
            </div>

            {/* Right Side: User Profile & Dropdown */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '12px',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>
                            {user?.email?.split('@')[0] || 'Usuario'}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                            {user?.email}
                        </span>
                    </div>
                    <ChevronDown size={18} color="rgba(255,255,255,0.7)" />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '120%',
                        right: '0',
                        width: '200px',
                        background: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '4px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Cuenta</p>
                            <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>Administrador</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                                padding: '10px 12px',
                                background: 'transparent',
                                border: 'none',
                                color: '#ff6b6b',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <LogOut size={16} />
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
