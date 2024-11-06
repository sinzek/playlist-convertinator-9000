import { useContext, createContext } from 'react';

export const AuthContext = createContext({});

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;