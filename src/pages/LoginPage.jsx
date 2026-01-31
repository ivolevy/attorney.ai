import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';
import '../index.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return <Skeleton type="page-login" />;
  }

  if (loginSuccess) {
    return (
      <div className="login-transition-container">
        <Skeleton type="page-home" />
        <div className="login-success-overlay">
          <div className="success-content">
            <Scale size={48} className="success-icon-spin" />
            <h2>Sesión Iniciada</h2>
            <p>Entrando al sistema principal...</p>
          </div>
        </div>
      </div>
    );
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password, rememberMe);

      if (result.success) {
        setLoginSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(result.error || 'Credenciales incorrectas');
        setLoading(false);
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

          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
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

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.25rem',
            padding: '0 0.5rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--accent-green)',
                  cursor: 'pointer'
                }}
              />
              Mantener sesión iniciada
            </label>
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
            {loading ? (
              <>
                <div className="loader-spinner"></div>
                Iniciando sesión...
              </>
            ) : (
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

      <div className="footer" style={{ position: 'fixed', bottom: 0, zIndex: 100 }}>
        Copyright © 2026 Lexia. Todos los derechos reservados. - Powered by <a href="https://www.linkedin.com/in/ivan-levy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-green)', textDecoration: 'none' }}>Ivan Levy</a>
      </div>
    </>
  );
}

export default LoginPage;
