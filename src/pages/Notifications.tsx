import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

export const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    return (
        <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500">notifications</span>
                    通知中心
                </h1>
                {notifications.some(n => n.is_read === 0) && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        全部標記為已讀
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((noti) => (
                        <motion.div
                            key={noti.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => noti.is_read === 0 && handleMarkAsRead(noti.id)}
                            className={cn(
                                "p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer",
                                noti.is_read === 1
                                    ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                                    : "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "size-10 rounded-full flex items-center justify-center shrink-0",
                                noti.type === 'like' && "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
                                noti.type === 'comment' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
                                noti.type === 'support' && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
                                noti.type === 'system' && "bg-slate-100 text-slate-600 dark:bg-slate-800"
                            )}>
                                <span className="material-symbols-outlined text-xl">
                                    {noti.type === 'like' && 'sunny'}
                                    {noti.type === 'comment' && 'chat_bubble'}
                                    {noti.type === 'support' && 'volunteer_activism'}
                                    {noti.type === 'system' && 'info'}
                                </span>
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={cn("font-bold text-sm", noti.is_read === 1 ? "text-slate-800 dark:text-slate-200" : "text-slate-900 dark:text-slate-100")}>
                                        {noti.title}
                                    </h3>
                                    <span className="text-xs text-slate-400">{new Date(noti.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 break-words leading-relaxed">
                                    {noti.content}
                                </p>
                            </div>

                            {noti.is_read === 0 && (
                                <div className="size-2 rounded-full bg-emerald-500 mt-2"></div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && notifications.length === 0 && (
                <div className="text-center py-20 space-y-4">
                    <span className="material-symbols-outlined text-6xl text-slate-300">notifications_off</span>
                    <p className="text-slate-500">目前沒有新通知</p>
                </div>
            )}
        </main>
    );
};
