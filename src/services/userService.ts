import { apiRequest } from './api';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
    location: string;
    role: string;
    created_at: string;
}

export interface UpdateUserData {
    name?: string;
    bio?: string;
    location?: string;
    avatar?: string;
}

export const userService = {
    async getProfile(userId: string): Promise<UserProfile> {
        return apiRequest<UserProfile>(`/users/${userId}`);
    },

    async updateProfile(userId: string, data: UpdateUserData): Promise<UserProfile> {
        return apiRequest<UserProfile>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async getUserPosts(userId: string): Promise<any[]> {
        return apiRequest<any[]>(`/users/${userId}/posts`);
    },

    async getUserBookmarks(userId: string): Promise<any[]> {
        return apiRequest<any[]>(`/users/${userId}/bookmarks`);
    },
};
