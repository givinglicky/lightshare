import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import { cn } from '../lib/utils';

export const Feed: React.FC = () => {
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
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getPosts();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || '無法取得貼文');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="max-w-[600px] mx-auto px-4 py-6 pb-24 text-center">
        <div className="animate-pulse flex flex-col gap-6 mt-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-[600px] mx-auto px-4 py-6 pb-24 text-center">
        <div className="mt-12 p-6 bg-red-50 text-red-600 rounded-xl">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            重試
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[600px] mx-auto px-4 py-6 pb-24">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold mb-1">社群動態</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">幫助鄰居，傳遞善意。</p>
      </div>

      <div className="flex flex-col gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-transform active:scale-[0.99]"
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
          ))
        ) : (
          <div className="mt-8 p-10 text-center rounded-2xl bg-primary/10 dark:bg-slate-800/20 border-2 border-dashed border-primary/40">
            <span className="material-symbols-outlined text-5xl text-vibrant-mint mb-4">volunteer_activism</span>
            <p className="text-slate-600 dark:text-slate-300 font-medium">今天沒有更多貼文了。</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">晚點再來看看，或者親自發起一份善意。</p>
          </div>
        )}
      </div>

      <Link
        to="/create"
        className="fixed bottom-6 right-6 w-16 h-16 bg-amber-warm dark:bg-amber-400 text-amber-900 rounded-2xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </Link>
    </main>
  );
};
