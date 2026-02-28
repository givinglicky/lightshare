import React from 'react';

export const LegalPage: React.FC<{ title: string }> = ({ title }) => {
    return (
        <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-20 text-center">
            <h1 className="text-3xl font-bold mb-8">{title}</h1>
            <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    這是一份示範文件。在正式上線前，請務必諮詢法律協助以完善您的{title}。
                </p>
                <div className="mt-8 space-y-6 text-left border-t border-slate-200 dark:border-slate-800 pt-8">
                    <section className="space-y-2">
                        <p className="font-bold text-slate-800 dark:text-slate-200">1. 服務概述</p>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            本平台旨在促進社區互助與分享，提供鄰里間的情緒支持與物資共享空間。
                        </p>
                    </section>
                    <section className="space-y-2">
                        <p className="font-bold text-slate-800 dark:text-slate-200">2. 用戶守則</p>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            所有用戶必須建立真實帳戶，並承諾傳遞正向能量。禁止發布任何形式的霸凌、惡意言論或違法資訊。
                        </p>
                    </section>
                    <section className="space-y-2">
                        <p className="font-bold text-slate-800 dark:text-slate-200">3. 隱私保護</p>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            我們重視您的隱私，所有個人資料僅用於提供更優質的社區服務，並受到嚴密的加密保護。
                        </p>
                    </section>
                    <section className="space-y-2">
                        <p className="font-bold text-slate-800 dark:text-slate-200">4. 內容責任</p>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            用戶應對其發布的內容承擔全部法律責任，系統有權移除不符社群規範的文章。
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
};
