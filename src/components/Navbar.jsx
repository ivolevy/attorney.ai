import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scale, LogOut, ChevronDown, User } from 'lucide-react';
import '../index.css';

function Navbar() {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="navbar-container">
            <nav className="navbar-glass">
                <div className="nav-left">
                    <div className="nav-logo">
                        <Scale size={20} color="#fff" />
                    </div>
                    <span className="app-name">Lexia</span>
                </div>

                <div className="nav-right">
                    <div
                        className="user-menu"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className="user-email">{user?.email}</span>
                        <ChevronDown size={16} className={`chevron ${dropdownOpen ? 'open' : ''}`} />

                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={logout} className="dropdown-item">
                                    <LogOut size={14} />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
