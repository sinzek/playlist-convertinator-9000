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
        if(token) {
            try {
                const decodedToken = jwtDecode(token);
                const isExpired = Date.now() >= decodedToken.exp * 1000;
                
                if(!isExpired) {
                    setAuth({
                        isAuthenticated: true,
                        token: token,
                        user: decodedToken.username,
                        role: decodedToken.role,
                        loading: false
                    });
                    
                    // automatic logout
                    const timeUntilExpiry = decodedToken.exp * 1000 - Date.now();
                    setTimeout(logout, timeUntilExpiry);
                } else {
                    logout();
                }
            } catch(error) {
                console.error("Failed to decode token:", error);
                logout();
            }
        } else {
            // no token found, setting loading to false
            setAuth(prev => ({ 
                ...prev, 
                isAuthenticated: false,
                loading: false 
            }));
        }
    };

    useEffect(() => {
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
    // useEffect(() => {
    //     console.log('Auth state updated:', auth);
    // }, [auth]);

    const contextValue = {
        auth,
        setAuth,
        logout,
        verifyToken
    };

    if (auth.loading) {
        return <div>Loading...</div>; // INSERT FUTURE LOADING COMPONENT HERE
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};