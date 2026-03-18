import { apiRequest } from './api';
import { Post } from '../types';

export const postService = {
    /**
     * 取得所有貼文
     */
    getPosts: async (category?: string, page: number = 1, limit: number = 20) => {
        let url = `/posts?page=${page}&limit=${limit}`;
        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }
        return apiRequest<Post[]>(url);
    },

    /**
     * 取得單篇貼文詳情
     */
    getPostById: async (id: string) => {
        return apiRequest<Post>(`/posts/${id}`);
    },

    /**
     * 建立新貼文
     */
    createPost: async (postData: {
        title: string;
        content: string;
        category: string;
        location: string;
        privacy: string;
        image?: string;
    }) => {
        return apiRequest<Post>('/posts', {
            method: 'POST',
            body: JSON.stringify(postData),
        });
    },

    /**
     * 刪除貼文
     */
    deletePost: async (id: string) => {
        return apiRequest<{ success: true }>(`/posts/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * 搜尋貼文
     */
    searchPosts: async (query: string) => {
        return apiRequest<Post[]>(`/posts/search?q=${encodeURIComponent(query)}`);
    },

    /**
     * 取得貼文留言
     */
    getComments: async (postId: string) => {
        return apiRequest<any[]>(`/posts/${postId}/comments`);
    },

    /**
     * 新增留言
     */
    createComment: async (postId: string, content: string, parentId?: string) => {
        return apiRequest<any>(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, parent_id: parentId }),
        });
    },

    /**
     * 點讚貼文
     */
    likePost: async (postId: string) => {
        return apiRequest<{ likes_count: number; is_liked: number }>(`/posts/${postId}/like`, {
            method: 'POST',
        });
    },

    /**
     * 取消點讚
     */
    unlikePost: async (postId: string) => {
        return apiRequest<{ likes_count: number; is_liked: number }>(`/posts/${postId}/like`, {
            method: 'DELETE',
        });
    },

    /**
     * 收藏貼文
     */
    bookmarkPost: async (postId: string) => {
        return apiRequest<{ is_bookmarked: number }>(`/posts/${postId}/bookmark`, {
            method: 'POST',
        });
    },

    /**
     * 取消收藏
     */
    unbookmarkPost: async (postId: string) => {
        return apiRequest<{ is_bookmarked: number }>(`/posts/${postId}/bookmark`, {
            method: 'DELETE',
        });
    },

    /**
     * 取得個人收藏列表
     */
    getBookmarks: async () => {
        return apiRequest<Post[]>('/users/me/bookmarks');
    },

    /**
     * 加入支持者
     */
    supportPost: async (postId: string) => {
        return apiRequest<{ supporters_count: number; is_supported: number }>(`/posts/${postId}/support`, {
            method: 'POST',
        });
    },

    /**
     * 取得個人貼文
     */
    getMyPosts: async () => {
        return apiRequest<Post[]>('/posts/me');
    }
};
