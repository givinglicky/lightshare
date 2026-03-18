import { apiRequest } from './api';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    location?: string;
    role?: string;
    created_at?: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await apiRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response;
    },

    async getCurrentUser(): Promise<AuthUser> {
        const response = await apiRequest<AuthUser>('/auth/me');
        return response;
    },

    async googleLogin(credential: string): Promise<AuthResponse> {
        const response = await apiRequest<AuthResponse>('/auth/google', {
            method: 'POST',
            body: JSON.stringify({ credential }),
        });
        return response;
    },

    async updateUser(data: Partial<AuthUser>): Promise<AuthUser> {
        const response = await apiRequest<AuthUser>('/users/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response;
    },
};
