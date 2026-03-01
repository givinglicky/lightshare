import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, Trash2, Users, FileText, Activity } from 'lucide-react';
import api from '../services/api';

interface Stats {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface AdminPost {
    id: string;
    title: string;
    user_name: string;
    created_at: string;
}

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [posts, setPosts] = useState<AdminPost[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts'>('overview');
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, usersRes, postsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/posts')
            ]);
            setStats(statsRes.stats);
            setUsers(usersRes.users);
            setPosts(postsRes.posts);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            alert('無法載入管理員資料，請確認您已登入且具有管理權限');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!window.confirm(`確定要將此用戶設定為 ${newRole === 'admin' ? '管理員' : '一般用戶'} 嗎？`)) return;

        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            alert('角色更新成功');
            fetchData();
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('角色更新失敗');
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!window.confirm('確定要永久刪除這篇貼文嗎？此操作無法還原。')) return;

        try {
            await api.delete(`/admin/posts/${postId}`);
            alert('貼文已刪除');
            fetchData();
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('貼文刪除失敗');
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center">載入中...</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <ShieldAlert className="w-8 h-8 text-red-500" />
                <h1 className="text-3xl font-bold dark:text-white">系統管理後台</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b dark:border-slate-800 pb-2">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 px-2 border-b-2 font-medium transition-colors ${activeTab === 'overview' ? 'border-primary-vibrant text-primary-vibrant' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    總覽 (Overview)
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-2 px-2 border-b-2 font-medium transition-colors ${activeTab === 'users' ? 'border-primary-vibrant text-primary-vibrant' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    用戶管理 (Users)
                </button>
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`pb-2 px-2 border-b-2 font-medium transition-colors ${activeTab === 'posts' ? 'border-primary-vibrant text-primary-vibrant' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    內容管理 (Posts)
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">總註冊用戶</p>
                            <p className="text-3xl font-bold dark:text-white">{stats.totalUsers}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-full">
                            <FileText className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">總發表貼文</p>
                            <p className="text-3xl font-bold dark:text-white">{stats.totalPosts}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-full">
                            <Activity className="w-8 h-8 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">總互動留言</p>
                            <p className="text-3xl font-bold dark:text-white">{stats.totalComments}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300">名稱</th>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300">信箱 (Email)</th>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300">註冊時間</th>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300">角色</th>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300 w-32">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 dark:text-slate-200 font-medium">{user.name}</td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.role === 'user' ? (
                                                <button
                                                    onClick={() => handleRoleChange(user.id, 'admin')}
                                                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                                                    title="設為管理員"
                                                >
                                                    <Shield className="w-4 h-4" /> 設為管理員
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRoleChange(user.id, 'user')}
                                                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                                                    title="降為一般用戶"
                                                >
                                                    取消管理員
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">沒有用戶資料</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300">貼文標題</th>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300">作者</th>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300">發佈時間</th>
                                    <th className="p-4 font-medium text-slate-600 dark:text-slate-300 w-24">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {posts.map(post => (
                                    <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 dark:text-slate-200 font-medium">
                                            <a href={`/post/${post.id}`} target="_blank" rel="noreferrer" className="hover:text-primary-vibrant hover:underline">
                                                {post.title}
                                            </a>
                                        </td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{post.user_name}</td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(post.created_at).toLocaleString()}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDeletePost(post.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="刪除"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">沒有貼文資料</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};
