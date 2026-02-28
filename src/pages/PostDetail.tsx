import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockPosts, currentUser } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Comment } from '../types';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find((p) => p.id === id);
  const [isJoined, setIsJoined] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [supporterCount, setSupporterCount] = useState(156);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(post?.comments || []);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold">找不到貼文</h2>
        <Link to="/" className="mt-4 text-vibrant-mint font-bold">返回首頁</Link>
      </div>
    );
  }

  return (
    <main className="flex-grow py-8 px-4">
      <div className="max-w-[720px] mx-auto space-y-6">
        <article className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  className="h-14 w-14 rounded-full border-2 border-primary"
                  alt={post.userName}
                  src={post.userAvatar}
                />
                <div>
                  <h3 className="font-bold text-lg">{post.userName}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{post.location}</span>
                    <span className="mx-1">•</span>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{post.title}</h1>
            {post.image && (
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-6">
                <img className="w-full h-full object-cover" alt={post.title} src={post.image} />
              </div>
            )}
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              {post.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
              <button className="flex items-center gap-2 group">
                <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined fill-icon text-2xl">sunny</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{post.likes} 份正能量</span>
              </button>
              <button className="flex items-center gap-2 group">
                <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">share</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">分享</span>
              </button>
            </div>
          </div>
        </article>

        <div className="bg-primary/50 dark:bg-vibrant-mint/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-vibrant-mint/20">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900"
                  alt={`Supporter ${i}`}
                  src={`https://picsum.photos/seed/supporter${i}/100/100`}
                />
              ))}
              {isJoined && (
                <motion.img
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  className="h-10 w-10 rounded-full border-2 border-vibrant-mint z-10"
                  alt="You"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnC9pkDkJcLlMMiUlDrz975Y54JGfMGZs1xVkSW2sMiv7mowZZBxExV9WBqQieFiYPld-EEqodfIVdpb57wY1WzIRpvT2ehbIMiKk8C5HJMG-yvUMj5XxqBdsLX-fSwZdGgB060xUK3ld6XTqpeP7HwrIpFOfvHuv2vo6ILLl6b0hiNN_g-2ylLntfHZMBfFee54rJp6XDKfawgxONSKxRgsSS4sUIC-uEhEFP_3Brv8OmKJFuXd0ad4T4g69nol2-bT0uzKoTwdA-"
                />
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">今天有 {supporterCount} 人為 {post.userName.split(' ')[0]} 加油</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">您的鼓勵對她很重要</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isJoined) {
                setIsJoined(true);
                setSupporterCount(prev => prev + 1);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }
            }}
            disabled={isJoined}
            className={cn(
              "w-full sm:w-auto px-6 py-2.5 font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2",
              isJoined 
                ? "bg-slate-200 text-slate-500 cursor-default" 
                : "bg-vibrant-mint text-white hover:brightness-110 active:scale-95"
            )}
          >
            {isJoined ? (
              <>
                <span className="material-symbols-outlined text-sm">check_circle</span>
                已加入
              </>
            ) : '加入他們'}
          </button>
        </div>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-vibrant-mint">volunteer_activism</span>
              <span className="text-sm font-bold">感謝您的加入！溫暖已傳遞。</span>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="space-y-6">
          <h2 className="text-xl font-bold px-2">正能量留言</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex gap-4">
              <img
                className="h-10 w-10 rounded-full"
                alt="Current user"
                src={currentUser.avatar}
              />
              <div className="flex-1 space-y-3">
                <textarea
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-vibrant-mint focus:border-vibrant-mint placeholder:text-slate-400"
                  placeholder="想說點暖心的話分享嗎？"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (!commentText.trim()) return;
                      const newComment: Comment = {
                        id: `c${Date.now()}`,
                        userId: currentUser.id,
                        userName: currentUser.name,
                        userAvatar: currentUser.avatar,
                        content: commentText,
                        timestamp: '剛剛',
                        likes: 0
                      };
                      setComments([newComment, ...comments]);
                      setCommentText('');
                    }}
                    disabled={!commentText.trim()}
                    className="px-6 py-2 bg-vibrant-mint text-white font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    發佈留言
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={comment.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800"
              >
                <div className="flex gap-4">
                  <img className="h-10 w-10 rounded-full" alt={comment.userName} src={comment.userAvatar} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold">{comment.userName}</h4>
                      <span className="text-xs text-slate-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-4">{comment.content}</p>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/40 text-vibrant-mint text-sm font-semibold hover:bg-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">auto_awesome</span>
                        送出溫暖
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
