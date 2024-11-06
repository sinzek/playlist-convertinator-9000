import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { instance } from "../api/axios.js";
import { AuthContext } from './useAuth.js';

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ 
        isAuthenticated: false, 
        token: null, 
        user: "", 
        role: "", 
        loading: true
    });

    const logout = () => {
        console.log('Logout called - setting loading to false');
        setAuth({
            isAuthenticated: false,
            token: null,
            user: "",
            role: "",
            loading: false,
        });
        localStorage.removeItem("accessToken");
    };

    const verifyToken = async (token) => {
        console.log('Verifying token, current loading state:', auth.loading);
        if(token) {
            try {
                const decodedToken = jwtDecode(token);
                const isExpired = Date.now() >= decodedToken.exp * 1000;
                
                if(!isExpired) {
                    console.log('Token valid - updating auth state');
                    setAuth({
                        isAuthenticated: true,
                        token: token,
                        user: decodedToken.username,
                        role: decodedToken.role,
                        loading: false
                    });
                    
                    // Set up automatic logout
                    const timeUntilExpiry = decodedToken.exp * 1000 - Date.now();
                    setTimeout(logout, timeUntilExpiry);
                } else {
                    console.log('Token expired - logging out');
                    logout();
                }
            } catch(error) {
                console.error("Failed to decode token:", error);
                logout();
            }
        } else {
            console.log('No token found - setting loading to false');
            setAuth(prev => ({ 
                ...prev, 
                isAuthenticated: false,
                loading: false 
            }));
        }
    };

    useEffect(() => {
        console.log('Initial useEffect running');
        // Check initial token
        const token = localStorage.getItem("accessToken");
        verifyToken(token);

        // Set up storage event listener
        const handleStorageChange = (e) => {
            if (e.key === "accessToken") {
                if (!e.newValue) {
                    logout();
                } else {
                    verifyToken(e.newValue);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Debug log for auth state changes
    useEffect(() => {
        console.log('Auth state updated:', auth);
    }, [auth]);

    const contextValue = {
        auth,
        setAuth,
        logout,
        verifyToken
    };

    if (auth.loading) {
        console.log('Rendering loading component');
        return <div>Loading...</div>; // Your loading component here
    }

    console.log('Rendering main component');
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};