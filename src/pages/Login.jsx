// https://freefrontend.com/css-login-forms/

import React, { useState } from 'react';
import supabase from '../config/supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import img from '../assets/img/secondlogin.webp';
import Box from '@mui/material/Box';

export default function Login() {
    const [name, setName] = useState(''); // State for sign-up name
    const [password, setPassword] = useState(''); // State for sign-up password
    const [email, setEmail] = useState(''); // State for sign-up email

    const [logpassword, setLogpassword] = useState(''); // State for login password
    const [logemail, setLogemail] = useState(''); // State for login email
    const [formError, setFormError] = useState(null); // State for form error message
    const [formSuccess, setFormSuccess] = useState(null); // State for form success message
    const navigate = useNavigate(); // Navigation hook

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission

        if (!name || !password || !email) {
            setFormError("Please fill in all the fields correctly"); // Set error if any field is empty
            setFormSuccess(null); // Clear success message
            return;
        }
        if (password.length < 6) {
            setFormError("Please fill in all the fields correctly. Password must be at least 6 characters long."); // Set error if password is too short
            setFormSuccess(null); // Clear success message
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        });

        if (error) {
            setFormError("There has been an error "); // Set error if sign-up fails
        } else if (data) {
            const { error: roleError } = await supabase
                .from('user_roles')
                .insert({ user_id: data.user.id, role_user: 2 });

            const { error: userInfoError } = await supabase
                .from('user_info')
                .insert({ username: name, user_email: email });

            if (roleError || userInfoError) {
                setFormError("There has been an error "); // Set error if any insert operation fails
            } else {
                setFormSuccess("User signed up successfully. Check your Email!."); // Set success message
                setName(''); // Clear name field
                setPassword(''); // Clear password field
                setEmail(''); // Clear email field
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form submission

        if (!logpassword || !logemail) {
            setFormError("Please fill in all the fields correctly"); // Set error if any field is empty
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: logemail,
                password: logpassword
            });

            if (error) {
                setFormError("That email address or password doesn’t look right."); // Set error if login fails
                return;
            }

            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                setFormError("Session error. Please try again."); // Set error if session retrieval fails
                return;
            }

            if (sessionData) {
                const { user } = sessionData.session;
                if (user) {
                    const { data: userData, error: userError } = await supabase
                        .from('user_roles')
                        .select('role_user')
                        .eq('user_id', user.id)
                        .single();

                    if (userError) {
                        setFormError("User role error."); // Set error if user role retrieval fails
                        return;
                    }

                    if (userData.role_user === 1) { 
                        navigate('/admin/dashboard'); // Navigate to admin dashboard
                    } 
                    else if(userData.role_user === 2){
                        navigate('/dashboard'); // Navigate to user dashboard
                    }
                    else {
                        navigate('/login'); // Navigate to login if no role matches
                    }
                }
            }

            setFormError(null); // Clear error message
        } catch (error) {
            setFormError("An error occurred. Please try again."); // Set error for any other exception
        }
    };

    return (
        <div className='log-container'>
            <div className="login__container">
                {/* Display error alert if there's a form error */}
                {formError && 
                    <Alert variant="filled" severity="error" sx={{ marginBottom: '20px' }}>
                        {formError}
                    </Alert>
                }
                {/* Display success alert if form submission is successful */}
                {formSuccess && 
                    <Alert variant="filled" severity="success" sx={{ marginBottom: '20px' }}>
                        {formSuccess}
                    </Alert>
                }
                
                <div className="login__card">
                    <input type="checkbox" id="chk" aria-hidden="true" />

                    <div className="signup">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="chk" aria-hidden="true">Sign up</label>
                            <input type="text" name="txt" placeholder="User name" required="" value={name} onChange={(e) => setName(e.target.value)} />
                            <input type="email" name="email" placeholder="Email" required="" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" name="pswd" placeholder="Password" required="" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="submit">Sign up</button>
                        </form>
                    </div>

                    <div className="login">
                        <form onSubmit={handleLogin}>
                            <label htmlFor="chk" aria-hidden="true">Login</label>
                            <input type="email" name="email" placeholder="Email" required="" value={logemail} onChange={(e) => setLogemail(e.target.value)} />
                            <input type="password" name="pswd" placeholder="Password" required="" value={logpassword} onChange={(e) => setLogpassword(e.target.value)} />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Display image next to the login container
            <Box sx={{ position: 'absolute', right: 'calc(50% - 515px)' }}>
                <img width='340px' src={img} alt='login character' />
            </Box> */}
        </div>
    );
}
