import React from 'react';
import { Link } from 'react-router-dom';
import { mockPosts } from '../constants';

export const Feed: React.FC = () => {
  return (
    <main className="max-w-[600px] mx-auto px-4 py-6 pb-24">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold mb-1">社群動態</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">幫助鄰居，傳遞善意。</p>
      </div>

      <div className="flex flex-col gap-6">
        {mockPosts.map((post) => (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="bg-white dark:bg-slate-900/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-transform active:scale-[0.99]"
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-3 mb-4">
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                  alt={post.userName}
                  src={post.userAvatar}
                />
                <div>
                  <p className="font-semibold text-sm">{post.userName}</p>
                  <p className="text-xs text-slate-400">{post.timestamp} • {post.location}</p>
                </div>
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
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-warm dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 transition-all hover:bg-amber-100 active:scale-95">
                <span className="material-symbols-outlined text-[20px] fill-icon">sunny</span>
                <span className="text-sm font-bold">{post.likes} 份正能量</span>
              </button>
            </div>
          </Link>
        ))}

        <div className="mt-8 p-10 text-center rounded-2xl bg-primary/10 dark:bg-slate-800/20 border-2 border-dashed border-primary/40">
          <span className="material-symbols-outlined text-5xl text-vibrant-mint mb-4">volunteer_activism</span>
          <p className="text-slate-600 dark:text-slate-300 font-medium">今天沒有更多貼文了。</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">晚點再來看看，或者親自發起一份善意。</p>
        </div>
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
