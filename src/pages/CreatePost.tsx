import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreatePost: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/success');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/20 overflow-hidden flex flex-col">
        <div className="bg-mint dark:bg-mint/10 px-6 py-4 flex items-start gap-4 border-b border-mint/20">
          <span className="material-symbols-outlined text-green-700 dark:text-green-400 mt-1">shield_with_heart</span>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">安全空間承諾</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">您的故事在我們這裡很安全。我們將您的隱私與身心健康放在首位。</p>
          </div>
        </div>

        <div className="p-8 flex-1">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">第 {step} 步 (共 3 步)</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {step === 1 ? '訊息內容' : step === 2 ? '分類標籤' : '隱私設定'}
              </span>
            </div>
            <div className="w-full bg-primary/30 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%`, backgroundColor: '#4ade80' }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">您需要哪方面的支持？</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">別急，這是一個無須擔憂評價的友善空間。</p>
                <div className="relative group">
                  <textarea
                    className="w-full min-h-[200px] p-6 rounded-lg border-2 border-primary/40 bg-background-light/30 focus:border-slate-900 focus:ring-0 text-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all resize-none"
                    placeholder="我正在尋求關於...的建議"
                  ></textarea>
                  <div className="absolute bottom-4 right-4 text-xs text-slate-400">0 / 2000</div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">為您的貼文分類</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">選擇最合適的分類，讓對的人看到您的需求。</p>
                <div className="flex flex-wrap gap-3">
                  {['情緒支持'].map((cat) => (
                    <button
                      key={cat}
                      className="px-6 py-2 rounded-full border-2 border-primary/40 hover:border-vibrant-mint hover:bg-primary/20 transition-all text-sm font-medium bg-primary/20 border-vibrant-mint"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">最後一步：隱私設定</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">您可以選擇匿名發布，或僅對特定群體可見。</p>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary/40 cursor-pointer hover:bg-primary/10 transition-all">
                    <input type="radio" name="privacy" className="text-vibrant-mint focus:ring-vibrant-mint" defaultChecked />
                    <div>
                      <p className="font-bold">公開發布</p>
                      <p className="text-sm text-slate-500">所有人都可以看到您的貼文</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary/40 cursor-pointer hover:bg-primary/10 transition-all">
                    <input type="radio" name="privacy" className="text-vibrant-mint focus:ring-vibrant-mint" />
                    <div>
                      <p className="font-bold">匿名發布</p>
                      <p className="text-sm text-slate-500">隱藏您的真實姓名與頭像</p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-6 bg-background-light/50 dark:bg-slate-800/50 border-t border-primary/20 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="px-8 py-2.5 rounded-full text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-primary/40 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span> 返回
          </button>
          <button
            onClick={handleNext}
            className="px-10 py-2.5 rounded-full bg-[#4ade80] text-white font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center gap-2"
          >
            {step === 3 ? '發布貼文' : '下一步'} <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </main>
  );
};
