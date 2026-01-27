import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

function RequireAuth({ children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/inicia-sesion" state={{ from: location }} replace />;
    }

    if (user.subscriptionStatus !== 'active') {
        // If user is logged in but subscription is not active, force logout or show error
        // For now, redirect to login with a message (handled by UI logic or simply block)
        // Ideally we might want a "Suspended" page.
        return <Navigate to="/inicia-sesion" replace />;
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
