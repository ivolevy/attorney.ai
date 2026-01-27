import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../index.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      setLoading(false);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setLoading(false);
      setError('Ocurrió un error inesperado');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1rem 0.5rem 3rem',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const focusStyle = {
    borderColor: 'var(--accent-green)',
    boxShadow: '0 0 0 2px rgba(30, 215, 96, 0.2)'
  };

  return (
    <>
      <div className="ambient-bg">
        <div className="blob blob-1" style={{ top: '10%', left: '20%' }}></div>
        <div className="blob blob-2" style={{ bottom: '10%', right: '20%' }}></div>
      </div>

      <div className="container" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="legal-logo" style={{ marginBottom: '2rem' }}>
          <Scale size={64} color="var(--accent-green)" strokeWidth={1.5} />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Bienvenido</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Ingresa a tu cuenta de Lexia
        </p>

        {error && (
          <div style={{
            background: 'rgba(255, 50, 50, 0.1)',
            border: '1px solid rgba(255, 50, 50, 0.3)',
            color: '#ff6b6b',
            padding: '0.8rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          width: '100%'
        }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Mail size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <Lock size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'var(--accent-green)',
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              fontSize: '1rem',
              fontWeight: '400',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Ingresando...' : (
              <>
                Iniciar Sesión
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          ¿Olvidaste tu contraseña?{' '}
          <a
            href="https://www.linkedin.com/in/ivan-levy/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-green)', textDecoration: 'none', fontWeight: '500' }}
          >
            Contacta a un administrador
          </a>
        </p>
      </div>

      <div className="footer" style={{ position: 'fixed', bottom: 0 }}>
        Copyright © 2026 Lexia. Todos los derechos reservados.
      </div>
    </>
  );
}

export default LoginPage;
