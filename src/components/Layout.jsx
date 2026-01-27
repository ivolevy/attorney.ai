import Navbar from './Navbar';
import RequireAuth from './RequireAuth';

function Layout({ children }) {
    return (
        <RequireAuth>
            <div style={{ minHeight: '100vh', background: '#000' }}>
                <Navbar />
                {/* Add padding top to account for the fixed navbar + some spacing */}
                <div style={{ paddingTop: '100px', paddingLeft: '2rem', paddingRight: '2rem' }}>
                    {children}
                </div>
            </div>
        </RequireAuth>
    );
}

export default Layout;
