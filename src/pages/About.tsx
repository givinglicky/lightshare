import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const About: React.FC = () => {
    return (
        <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        關於 LightShare
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        傳遞光芒，連結鄰里。我們致力於創造一個溫暖、安全且充滿互助精神的社區空間。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="rounded-2xl overflow-hidden shadow-xl aspect-video bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-slate-400">volunteer_activism</span>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">我們的使命</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            在現代快節奏的都市生活中，人們往往與鄰居疏遠。LightShare 的誕生是為了打破這道冰冷的牆，
                            透過「情緒支持」、「生活協助」與「物資共享」，讓每個人都能在需要時找到援手，在有餘力時分享溫暖。
                        </p>
                        <div className="space-y-3">
                            {[
                                { icon: 'favorite', text: '建立以人為本的社群連結' },
                                { icon: 'security', text: '提供安全可靠的互動環境' },
                                { icon: 'rocket_launch', text: '推動社區互助與資源共享' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-600 text-sm">{item.icon}</span>
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-8 md:p-12 text-center space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">準備好加入我們了嗎？</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        無論是尋求幫助還是提供協助，LightShare 都歡迎您的加入。讓我們一起點亮社區的每一個角落。
                    </p>
                    <Link to="/register" className="inline-block bg-vibrant-mint hover:brightness-110 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg shadow-vibrant-mint/20">
                        立即註冊帳戶
                    </Link>
                </div>
            </motion.div>
        </main>
    );
};
