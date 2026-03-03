import React from 'react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  return (
    <main className="max-w-[800px] mx-auto px-6 py-12 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-block p-8 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-6 relative group">
          <div className="absolute inset-0 bg-amber-400/30 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <span className="material-symbols-outlined text-amber-500 text-6xl z-20 animate-spin-slow fill-icon relative">sunny</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">關於 陽光種子希望園</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          我們相信，每一份小小的善意都像是一顆種子，只要有陽光的照耀與細心的呵護，終將在心田開出希望的花朵。
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-amber-600 flex items-center gap-2">
            <span className="material-symbols-outlined">wb_sunny</span>
            我們的使命
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            「陽光種子希望園」致力於打造一個溫暖、互助的社區平台。我們希望透過簡單的分享與互動，連結鄰里間的情感，讓處於困境中的人感受到溫暖，讓願意付出的人找到方向。
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
            <span className="material-symbols-outlined">psychiatry</span>
            我們的願景
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            我們願景是讓社區不再只是地理上的劃分，而是心靈上的依靠。在這裡，沒有人是孤島，每一顆種子都能獲得成長的力量，共同編織出一片充滿陽光的希望森林。
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 md:p-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-6">為什麼選擇我們？</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-amber-500 text-3xl font-bold">100%</div>
            <p className="text-sm font-bold">純粹的善意</p>
            <p className="text-xs text-slate-500">不帶任何商業目的，只為傳遞溫暖。</p>
          </div>
          <div className="space-y-2">
            <div className="text-emerald-500 text-3xl font-bold">即時</div>
            <p className="text-sm font-bold">鄰里互助</p>
            <p className="text-xs text-slate-500">連結最親近的力量，解決燃眉之急。</p>
          </div>
          <div className="space-y-2">
            <div className="text-blue-500 text-3xl font-bold">安全</div>
            <p className="text-sm font-bold">隱私保護</p>
            <p className="text-xs text-slate-500">我們重視您的安全，建立互信的環境。</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-20 text-center">
        <p className="text-slate-500 italic">「讓愛傳遞到每個角落，從一顆種子開始。」</p>
      </div>
    </main>
  );
};
