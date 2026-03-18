import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { cn } from '../lib/utils';

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { authUser, updateAuthUser } = useAuth();
  const [name, setName] = useState(authUser?.name || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [avatar, setAvatar] = useState(authUser?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!authUser) return;
    setIsSaving(true);
    try {
      const updatedUser = await authService.updateUser({ 
        name, 
        bio,
        avatar 
      });
      updateAuthUser(updatedUser);
      navigate('/profile');
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('儲存失敗，請稍後再試');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-[600px] mx-auto w-full px-4 py-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-2xl font-bold">編輯個人資料</h2>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary shadow-sm transition-opacity group-hover:opacity-80"
              style={{ backgroundImage: `url("${avatar}")` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 text-white rounded-full p-2">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <p className="text-xs text-slate-400 mt-3">點擊更換頭像</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="輸入您的姓名"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">個人簡介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              placeholder="介紹一下你自己吧..."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "w-full py-4 rounded-2xl bg-primary text-slate-900 font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2",
            isSaving && "opacity-70 cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full"></span>
              儲存中...
            </>
          ) : (
            "儲存變更"
          )}
        </button>
      </div>
    </main>
  );
};
