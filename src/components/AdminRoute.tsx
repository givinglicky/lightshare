import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
    children: React.ReactNode;
}

/**
 * 管理員專屬路由守衛
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary-vibrant/30 border-t-primary-vibrant rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">認證中，請稍候...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== 'admin') {
        // 如果不是管理員，導向首頁或自訂的無權限頁面
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
