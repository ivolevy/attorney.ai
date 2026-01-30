import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Skeleton from './Skeleton';

function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Skeleton type="page-home" />;
    }

    if (!user) {
        return <Navigate to="/inicia-sesion" state={{ from: location }} replace />;
    }

    return (
        <>
            <Navbar />
            <div className="auth-content-wrapper">
                {children}
            </div>
        </>
    );
}

export default RequireAuth;
