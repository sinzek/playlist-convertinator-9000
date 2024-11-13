import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { instance } from "../api/axios.js";
import { AuthContext } from './useAuth.js';

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ 
        isAuthenticated: false, 
        token: null, 
        email: "",
        user: "", 
        pwdHash: "",
        role: "", 
        loading: true,
        connectedAccounts: false
    });

    const refreshAccessToken = async () => {
        try {
            const response = await instance.post("/refresh-token", {}, {
                withCredentials: true // needed for cookies to be included
            });

            const { accessToken } = response.data;
            
            // Store only the access token in localStorage
            localStorage.setItem("accessToken", accessToken);
            
            // Verify and set the new access token
            await verifyToken(accessToken);
            
            return accessToken;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            logout();
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Call logout endpoint to clear the refresh token cookie
            await instance.post("/logout", {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setAuth({
                isAuthenticated: false,
                token: null,
                email: "",
                user: "",
                pwdHash: "",
                role: "",
                loading: false,
                connectedAccounts: false
            });
            localStorage.removeItem("accessToken");
        }
    };

    const verifyToken = async (token) => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const isExpired = Date.now() >= decodedToken.exp * 1000;

                if (!isExpired) {
                    setAuth({
                        isAuthenticated: true,
                        token: token,
                        email: decodedToken.email,
                        user: decodedToken.username,
                        pwdHash: decodedToken.password,
                        role: decodedToken.role,
                        loading: false
                    });

                    // set up refresh timer to 1 minute before token expires
                    const timeUntilRefresh = (decodedToken.exp * 1000 - Date.now()) - 60000; // Refresh 1 minute before expiry
                    setTimeout(refreshAccessToken, timeUntilRefresh);
                } else {
                    // token expired, try refresh
                    try {
                        await refreshAccessToken();
                    } catch (error) {
                        logout();
                    }
                }
            } catch (error) {
                console.error("Failed to decode token:", error);
                logout();
            }
        } else {
            // no access token in localstorage, try refresh if cookie exists
            try {
                await refreshAccessToken();
            } catch (error) {
                setAuth(prev => ({
                    ...prev,
                    isAuthenticated: false,
                    loading: false
                }));
            }
        }
    };

    useEffect(() => {

        const interceptor = instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If error is 401 and we haven't tried refreshing yet
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await refreshAccessToken();
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return instance(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            instance.interceptors.response.eject(interceptor);
        };
    }, []);

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

    const contextValue = {
        auth,
        setAuth,
        logout,
        verifyToken,
        refreshAccessToken
    };

    if (auth.loading) {
        return (
            <>
                <div className="skeleton h-full w-full"></div>
            </>
        );
    }


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};