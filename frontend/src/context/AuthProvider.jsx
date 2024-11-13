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
        error: null,
        spotifyConnected: false,
        YTMusicConnected: false
    });

    const clearAuth = () => {
        setAuth({
            isAuthenticated: false,
            token: null,
            email: "",
            user: "",
            pwdHash: "",
            role: "",
            loading: false,
            error: null,
            spotifyConnected: false,
            YTMusicConnected: false
        });
        localStorage.removeItem("accessToken");
    };

    const verifyConnectedAccounts = async (username) => {
        try {
            const response = await instance.get(`/users?username=${username}`);
            setAuth(prev => ({
                ...prev,
                spotifyConnected: response.data.spotifyConnected,
                YTMusicConnected: response.data.YTMusicConnected
            }));
            return [ response.data.spotifyConnected, response.data.YTMusicConnected ];

            
        } catch(error) {
            setAuth(prev => ({
                ...prev,
                isAuthenticated: false,
                loading: false,
                error: 'No user found'
            }));
            return false;
        }
    }

    const refreshAccessToken = async () => {
        try {
            const response = await instance.post("/refresh-token", {}, {
                withCredentials: true
            });

            const { accessToken } = response.data;
            
            if (!accessToken) {
                throw new Error('No access token received');
            }

            localStorage.setItem("accessToken", accessToken);
            await verifyToken(accessToken);
            
            return accessToken;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            clearAuth();
            throw error;
        }
    };

    const logout = async () => {
        try {
            await instance.post("/logout", {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            clearAuth();
        }
    };

    const verifyToken = async (token) => {
        if (!token) {
            try {
                await refreshAccessToken();
                return;
            } catch (error) {
                setAuth(prev => ({
                    ...prev,
                    isAuthenticated: false,
                    loading: false,
                    error: 'No valid authentication found'
                }));
                return;
            }
        }

        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            
            if (decodedToken.exp <= currentTime) {
                // Token is expired
                await refreshAccessToken();
                return;
            }

            const connectedAccts = await verifyConnectedAccounts(decodedToken.username);

            setAuth({
                isAuthenticated: true,
                token: token,
                email: decodedToken.email,
                user: decodedToken.username,
                pwdHash: decodedToken.password,
                role: decodedToken.role,
                loading: false,
                error: null,
                spotifyConnected: connectedAccts[0],
                YTMusicConnected: connectedAccts[1]
            });

            // Set up refresh timer
            const timeUntilRefresh = (decodedToken.exp * 1000 - Date.now()) - 60000;
            const refreshTimer = setTimeout(() => {
                refreshAccessToken().catch(console.error);
            }, Math.max(0, timeUntilRefresh)); // Ensure non-negative timeout

            return () => clearTimeout(refreshTimer);
        } catch (error) {
            console.error("Token verification failed:", error);
            clearAuth();
            setAuth(prev => ({
                ...prev,
                error: 'Invalid token format'
            }));
        }
    };

    useEffect(() => {
        const interceptor = instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
    
                // Check if error is 401 and we haven't tried refreshing yet
                // AND the failed request isn't the refresh token endpoint itself
                if (error.response?.status === 401 && 
                    !originalRequest._retry &&
                    !originalRequest.url.includes('refresh-token')) {
                    originalRequest._retry = true;
    
                    try {
                        const newToken = await refreshAccessToken();
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return instance(originalRequest);
                    } catch (refreshError) {
                        clearAuth();
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
        let cleanup;
        const token = localStorage.getItem("accessToken");
        
        const initAuth = async () => {
            cleanup = await verifyToken(token);
        };

        initAuth();

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
        
        return () => {
            if (cleanup) cleanup();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const contextValue = {
        auth,
        setAuth,
        logout,
        verifyToken,
        refreshAccessToken,
        verifyConnectedAccounts,
    };

    if (auth.loading) {
        return <div className="skeleton h-full w-full"></div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};