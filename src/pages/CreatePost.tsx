import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';

export const CreatePost: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '情緒支持',
    privacy: 'public',
    location: '台北市, 台灣', // 預設位置
  });
  const [image, setImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // 最後一步，提交表單
      try {
        setLoading(true);
        await postService.createPost({
          ...formData,
          image: image || undefined,
        });
        navigate('/success');
      } catch (err) {
        console.error('Failed to create post:', err);
        alert('發布失敗，請稍後再試。');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/20 overflow-hidden flex flex-col">
        {/* ... header ... */}
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
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">您需要哪方面的支持？</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">別急，這是一個無須擔憂評價的友善空間。</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">標題</label>
                      <input
                        className="w-full p-4 rounded-lg border-2 border-primary/40 bg-background-light/30 focus:border-vibrant-mint focus:ring-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all font-bold"
                        placeholder="為您的訊息取個標題"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">內容</label>
                      <textarea
                        className="w-full min-h-[160px] p-6 rounded-lg border-2 border-primary/40 bg-background-light/30 focus:border-vibrant-mint focus:ring-0 text-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all resize-none"
                        placeholder="我正在尋求關於...的建議"
                        maxLength={2000}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      ></textarea>
                      <div className="absolute bottom-4 right-4 text-xs font-bold text-slate-400">
                        <span className={formData.content.length >= 1900 ? "text-red-500" : ""}>{formData.content.length}</span> / 2000
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">添加圖片 (選填)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {!image ? (
                    <button
                      onClick={triggerFileInput}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-primary/40 hover:border-vibrant-mint hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                      <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-vibrant group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                      </div>
                      <span className="text-sm font-bold text-slate-500 group-hover:text-vibrant-mint">點擊上傳圖片</span>
                    </button>
                  ) : (
                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary/20 group">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                          onClick={triggerFileInput}
                          className="size-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          onClick={removeImage}
                          className="size-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">為您的貼文分類</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">選擇最合適的分類，讓對的人看到您的需求。</p>
                <div className="flex flex-wrap gap-3">
                  {['情緒支持', '物資共享', '社區動態', '尋求建議', '正能量分享'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={cn(
                        "px-6 py-2 rounded-full border-2 transition-all text-sm font-medium",
                        formData.category === cat
                          ? "bg-vibrant-mint text-white border-vibrant-mint shadow-md scale-105"
                          : "border-primary/40 text-slate-600 dark:text-slate-300 hover:border-vibrant-mint hover:bg-primary/20"
                      )}
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
                  <label className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    formData.privacy === 'public' ? "border-vibrant-mint bg-vibrant-mint/5" : "border-primary/40 hover:bg-primary/10"
                  )}>
                    <input
                      type="radio"
                      name="privacy"
                      className="text-vibrant-mint focus:ring-vibrant-mint"
                      checked={formData.privacy === 'public'}
                      onChange={() => setFormData({ ...formData, privacy: 'public' })}
                    />
                    <div>
                      <p className="font-bold">公開發布</p>
                      <p className="text-sm text-slate-500">所有人都可以看到您的貼文</p>
                    </div>
                  </label>
                  <label className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                    formData.privacy === 'anonymous' ? "border-vibrant-mint bg-vibrant-mint/5" : "border-primary/40 hover:bg-primary/10"
                  )}>
                    <input
                      type="radio"
                      name="privacy"
                      className="text-vibrant-mint focus:ring-vibrant-mint"
                      checked={formData.privacy === 'anonymous'}
                      onChange={() => setFormData({ ...formData, privacy: 'anonymous' })}
                    />
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
            disabled={loading}
            className="px-8 py-2.5 rounded-full text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-primary/40 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span> 返回
          </button>
          <button
            onClick={handleNext}
            disabled={loading || (step === 1 && (!formData.title || !formData.content))}
            className="px-10 py-2.5 rounded-full bg-[#4ade80] text-white font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {step === 3 ? '發布貼文' : '下一步'} <span className="material-symbols-outlined text-lg">send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

// 輔助函式 (cn)
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
