import { apiRequest } from './api';
import { NotificationData } from '../types';

export const notificationService = {
    /**
     * 取得通知列表
     */
    getNotifications: async () => {
        return apiRequest<NotificationData>('/notifications');
    },

    /**
     * 標記單則通知為已讀
     */
    markAsRead: async (id: string) => {
        return apiRequest<{ success: boolean }>(`/notifications/${id}/read`, {
            method: 'PUT',
        });
    },

    /**
     * 全部標記為已讀
     */
    markAllAsRead: async () => {
        return apiRequest<{ success: boolean }>('/notifications/read-all', {
            method: 'PUT',
        });
    },
};
