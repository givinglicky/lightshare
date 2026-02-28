import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const SearchResults: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleLike = async (e: React.MouseEvent, postId: string, isLiked: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const result = isLiked
                ? await postService.unlikePost(postId)
                : await postService.likePost(postId);

            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? { ...p, likes_count: result.likes_count, is_liked: result.is_liked }
                    : p
            ));
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    const handleBookmark = async (e: React.MouseEvent, postId: string, isBookmarked: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const result = isBookmarked
                ? await postService.unbookmarkPost(postId)
                : await postService.bookmarkPost(postId);

            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? { ...p, is_bookmarked: result.is_bookmarked }
                    : p
            ));
        } catch (err) {
            console.error('Bookmark failed:', err);
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            try {
                setLoading(true);
                const data = await postService.searchPosts(query);
                setPosts(data);
            } catch (err: any) {
                setError(err.message || '搜尋失敗');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return (
            <main className="max-w-[600px] mx-auto px-4 py-12 text-center w-full">
                <div className="animate-pulse flex flex-col gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-[600px] mx-auto px-4 py-8 pb-24 w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-1">搜尋結果</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    關鍵字「<span className="text-vibrant-mint font-bold">{query}</span>」的搜尋結果如下：
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Link
                                to={`/post/${post.id}`}
                                className="block bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all hover:border-vibrant-mint/50"
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                                            alt={post.author_name}
                                            src={post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=random`}
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">{post.author_name}</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(post.created_at).toLocaleDateString()} • {post.location}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleBookmark(e, post.id, !!post.is_bookmarked)}
                                            className={cn(
                                                "ml-auto p-2 rounded-full transition-all",
                                                post.is_bookmarked ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            <span className={cn("material-symbols-outlined text-[20px]", post.is_bookmarked && "fill-icon")}>bookmark</span>
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 leading-snug">{post.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                                        {post.content}
                                    </p>
                                </div>
                                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                    <span className="text-xs font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">location_on</span> {post.location}
                                    </span>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={(e) => handleLike(e, post.id, !!post.is_liked)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all",
                                                post.is_liked
                                                    ? "bg-amber-500 text-white shadow-sm"
                                                    : "bg-amber-warm dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 hover:bg-amber-100"
                                            )}
                                        >
                                            <span className={cn("material-symbols-outlined text-[18px]", post.is_liked && "fill-icon")}>sunny</span>
                                            <span className="text-xs font-bold">{post.likes_count}</span>
                                        </button>
                                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                                            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                            <span>{post.comments_count}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    <div className="mt-8 p-10 text-center rounded-2xl bg-primary/10 dark:bg-slate-800/20 border-2 border-dashed border-primary/40">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">找不到相關貼文。</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">試試其他的關鍵字，或者隨意逛逛。</p>
                        <Link to="/feed" className="inline-block mt-4 text-vibrant-mint font-bold hover:underline">返回動態牆</Link>
                    </div>
                )}
            </div>
        </main>
    );
};
