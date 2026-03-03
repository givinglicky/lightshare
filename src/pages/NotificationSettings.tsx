import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface SettingItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex-1 pr-4">
      <h4 className="font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={cn(
        "w-12 h-6 rounded-full transition-colors relative",
        enabled ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
      )}
    >
      <div
        className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
          enabled ? "left-7" : "left-1"
        )}
      />
    </button>
  </div>
);

export const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    newComments: true,
    newLikes: true,
    communityUpdates: false,
    directMessages: true,
    emailDigest: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
        <h2 className="text-2xl font-bold">通知設定</h2>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">推播通知</h3>
        
        <SettingItem
          title="新留言"
          description="當有人在您的貼文下留言時通知您"
          enabled={settings.newComments}
          onToggle={() => toggleSetting('newComments')}
        />
        
        <SettingItem
          title="新的心心"
          description="當有人為您的貼文點贊時通知您"
          enabled={settings.newLikes}
          onToggle={() => toggleSetting('newLikes')}
        />

        <SettingItem
          title="私訊"
          description="當有人給您發送私訊時通知您"
          enabled={settings.directMessages}
          onToggle={() => toggleSetting('directMessages')}
        />

        <SettingItem
          title="社群更新"
          description="接收來自 陽光種子希望園 的重要公告與活動資訊"
          enabled={settings.communityUpdates}
          onToggle={() => toggleSetting('communityUpdates')}
        />
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">電子郵件</h3>
        
        <SettingItem
          title="每日摘要"
          description="每天發送一封電子郵件，彙整您錯過的動態"
          enabled={settings.emailDigest}
          onToggle={() => toggleSetting('emailDigest')}
        />
      </div>

      <div className="mt-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-amber-600">info</span>
          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            關閉通知可能會讓您錯過鄰居的即時回應或求助請求。建議至少保留「新留言」通知。
          </p>
        </div>
      </div>
    </main>
  );
};
