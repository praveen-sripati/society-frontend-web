import { notification } from 'antd';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Permission, UserRole, hasPermission } from '../config/permissions';
import { API_ENDPOINTS, NOTIFICATION_CONFIG } from '../constants';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_ENDPOINTS.BASE_URL;

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface User {
    userId: string;
    role: UserRole;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    checkPermission: (permission: Permission) => boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const checkAuth = async () => {
        try {
            const response = await axios.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
            setUser(response.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const checkPermission = (permission: Permission): boolean => {
        return hasPermission(user?.role, permission);
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await axios.post(API_ENDPOINTS.AUTH.LOGOUT);
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            notification.error({
                message: 'Logout Failed',
                description: 'There was a problem logging out. Please try again.',
                ...NOTIFICATION_CONFIG
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            isLoading, 
            user, 
            checkPermission, 
            checkAuth,
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requiredPermission 
}) => {
    const { isAuthenticated, isLoading, checkPermission } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredPermission && !checkPermission(requiredPermission)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

// Public Route Component
interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return null; // or a loading spinner
    }

    if (isAuthenticated) {
        return <Navigate to={(location.state as any)?.from?.pathname || '/dashboard'} replace />;
    }

    return <>{children}</>;
}; 