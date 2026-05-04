import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // 1. Check for initial session
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    await fetchProfileAndSubscription(session.user);
                } else {
                    // Fallback to mock user ONLY if no supabase session exists
                    const savedMock = localStorage.getItem('lexia_mock_user');
                    if (savedMock) {
                        setUser(JSON.parse(savedMock));
                    }
                }
            } catch (err) {
                console.error("Auth initialization error:", err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth event:", event);
            if (session) {
                await fetchProfileAndSubscription(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                localStorage.removeItem('lexia_mock_user');
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfileAndSubscription = async (authUser) => {
        try {
            // First set basic user info so UI isn't empty
            setUser(prev => ({ ...authUser, ...prev }));

            const { data: subData, error: subError } = await supabase
                .from('subscriptions')
                .select('status')
                .eq('user_id', authUser.id)
                .maybeSingle();

            if (subError) throw subError;

            setUser({
                ...authUser,
                subscriptionStatus: subData?.status || 'inactive'
            });
        } catch (error) {
            console.error('Error fetching extra user data:', error);
            // Don't log out on error, just keep the auth user
            setUser(authUser);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, message: 'Revisa tu email para confirmar tu cuenta' };
    };

    const login = async (email, password, remember = true) => {
        setLoading(true);
        setError('');

        // Mock fallback for development/demo
        if ((email === 'admin@admin.com' || email === 'lexia@admin.com') && (password === 'admin' || password === 'lexia_password')) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser = {
                id: 'mock-id',
                email: email,
                subscriptionStatus: 'premium'
            };

            if (remember) {
                localStorage.setItem('lexia_mock_user', JSON.stringify(mockUser));
            }

            setUser(mockUser);
            setLoading(false);
            return { success: true };
        }

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setLoading(false);
            return { success: false, error: 'Credenciales inválidas o error de conexión' };
        }

        // fetchProfileAndSubscription will be called by onAuthStateChange
        return { success: true };
    };

    const logout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('lexia_mock_user');
            setUser(null);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signUp, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
