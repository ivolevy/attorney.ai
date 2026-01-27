import { supabase } from './src/supabaseClient.js';

async function createAdmin() {
    console.log("Creating user lexia@admin.com with compliant password...");
    const { data, error } = await supabase.auth.signUp({
        email: 'lexia@admin.com',
        password: 'lexia_password', // Min 6 chars
    });

    if (error) {
        console.error("Error creating user:", error.message);
    } else {
        console.log("User created successfully:", data.user?.id);
    }
}

createAdmin();
