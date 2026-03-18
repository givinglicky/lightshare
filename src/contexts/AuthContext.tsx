import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiRequest } from '../services/api';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    // 初始化：檢查本地 Token 並同步用戶資料
    useEffect(() => {
        async function initializeAuth() {
            // 首先檢查是否有手動登入的 token
            if (token) {
                try {
                    const userData = await apiRequest<User>('/auth/me');
                    setUser(userData);
                } catch (error) {
                    console.error('認證初始化失敗:', error);
                    logout();
                }
            } else if (supabase) {
                // 如果沒有 token，檢查 Supabase 會話 (例如 Google 登入後重導向回來)
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const sbUser: User = {
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                        avatar: session.user.user_metadata?.avatar_url || '',
                        bio: '',
                        created_at: session.user.created_at,
                        role: 'user'
                    };
                    setUser(sbUser);
                    setToken(session.access_token);
                    localStorage.setItem('token', session.access_token);
                }
            }
            setIsLoading(false);
        }

        initializeAuth();

        // 監聽 Supabase 認證狀態變化
        const { data: { subscription } } = supabase?.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const sbUser: User = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                    avatar: session.user.user_metadata?.avatar_url || '',
                    bio: '',
                    created_at: session.user.created_at,
                    role: 'user'
                };
                setUser(sbUser);
                setToken(session.access_token);
                localStorage.setItem('token', session.access_token);
            } else if (event === 'SIGNED_OUT') {
                logout();
            }
        }) || { data: { subscription: null } };

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// 自訂 Hook 方便各元件存取
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
