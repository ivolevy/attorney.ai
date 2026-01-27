import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchProfileAndSubscription(session.user);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchProfileAndSubscription(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfileAndSubscription = async (authUser) => {
        try {
            const { data: subscription, error } = await supabase
                .from('subscriptions')
                .select('status')
                .eq('user_id', authUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching subscription:', error);
            }

            setUser({
                ...authUser,
                subscriptionStatus: subscription?.status || 'inactive'
            });
        } catch (error) {
            console.error('Error in fetchProfileAndSubscription:', error);
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

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: 'Credenciales inválidas o error de conexión' };
        }
        return { success: true };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signUp, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
