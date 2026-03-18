import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export const Success: React.FC = () => {
    const location = useLocation();
    const isRegister = new URLSearchParams(location.search).get('type') === 'register';

    return (
        <main className="flex-1 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-10 text-center border border-primary/20"
            >
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-24 h-24 bg-vibrant-mint rounded-full flex items-center justify-center text-white shadow-lg shadow-vibrant-mint/30"
                        >
                            <span className="material-symbols-outlined text-5xl">check</span>
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full border-4 border-vibrant-mint"
                        ></motion.div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {isRegister ? '註冊成功！' : '發布成功！'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                    {isRegister 
                        ? '歡迎加入社區！請檢查您的信箱以驗證帳戶（如果專案已開啟驗證），然後即可開始探索。' 
                        : '您的故事已經分享到社群中。感謝您的信任與分享，讓這個世界多了一份溫暖。'}
                </p>

        <div className="space-y-4">
          <Link
            to="/feed"
            className="block w-full py-4 bg-vibrant-mint text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-md"
          >
            查看我的貼文
          </Link>
          <Link
            to="/"
            className="block w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            返回首頁
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          貼文通常會在幾分鐘內出現在鄰居的動態中。
        </p>
      </motion.div>
    </main>
  );
};
