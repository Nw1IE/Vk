import React from 'react';
import { useAuth } from '../context/AuthContext';
import { VkLoginCard } from './vk/VkLoginCard';
import { TgLoginCard } from './telegram/TgLoginCard';
import { ProfileDashboard } from './ProfileDashboard';
import { Lock, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { user, currentProvider, loginDemo } = useAuth();

  if (user) {
    return (
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen transition-colors">
        <ProfileDashboard />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen transition-colors">
      {/* Hero Text */}
      <div className="text-center mb-8 max-w-lg">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-100 dark:border-blue-900/50">
          <Lock size={13} />
          <span>Безопасная авторизация</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          Войдите через
          <span className="text-[#0077FF]"> VK</span> или
          <span className="text-[#24A1DE]"> Telegram</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed">
          Демо авторизации по номеру телефона и QR-коду — как в реальных приложениях ВКонтакте и Telegram Web
        </p>
      </div>

      {/* Auth Card */}
      {currentProvider === 'vk' ? <VkLoginCard /> : <TgLoginCard />}

      {/* Mobile Demo Shortcuts */}
      <div className="lg:hidden mt-6 flex flex-col gap-2 items-center w-full max-w-[440px]">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles size={12} className="text-amber-500" />
          Быстрый вход в демо-аккаунт:
        </span>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => loginDemo('ivan')}
            className="flex-1 py-2.5 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0077FF] hover:text-[#0077FF] transition-colors"
          >
            Иван (VK)
          </button>
          <button
            onClick={() => loginDemo('durov')}
            className="flex-1 py-2.5 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#24A1DE] hover:text-[#24A1DE] transition-colors"
          >
            Дуров (TG)
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500 pb-6 max-w-xs space-y-1">
        <p>Данный сайт является демонстрацией.</p>
        <p>Настоящие данные не запрашиваются и не сохраняются.</p>
      </footer>
    </main>
  );
};
