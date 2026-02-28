import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * 路由守衛元件
 * 
 * 功能：
 * 1. 檢查用戶是否已登入
 * 2. 如果正在載入身分資訊（如自動初始化中），顯示簡單的載入狀態
 * 3. 如果未登入，導向 /login 並記住當前想去的路徑，方便登入後跳轉回來
 * 4. 如果已登入，呈現子元件內容
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
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
        // 導向登入頁，並將當前路徑存入 state，讓登入後可以跳回來
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
