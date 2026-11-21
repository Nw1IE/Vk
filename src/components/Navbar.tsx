import React from 'react';
import { useAuth } from '../context/AuthContext';
import { VkLogo, TelegramLogo } from './common/Icons';
import { Moon, Sun, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, currentProvider, setCurrentProvider, theme, setTheme, logout, loginDemo } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <VkLogo size={32} className="ring-2 ring-white dark:ring-slate-900 rounded-lg shadow-sm" />
            <TelegramLogo size={32} className="ring-2 ring-white dark:ring-slate-900 rounded-full shadow-sm" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-base leading-tight flex items-center gap-1.5">
              Social Auth
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Demo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Авторизация по типу VK ID и Telegram Web
            </p>
          </div>
        </div>

        {/* Center: Switch provider (only when not logged in) */}
        {!user && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => setCurrentProvider('vk')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentProvider === 'vk'
                  ? 'bg-white dark:bg-slate-700 text-[#0077FF] dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <VkLogo size={20} />
              <span>VK ID</span>
            </button>
            <button
              onClick={() => setCurrentProvider('telegram')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentProvider === 'telegram'
                  ? 'bg-white dark:bg-slate-700 text-[#24A1DE] dark:text-sky-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TelegramLogo size={20} />
              <span>Telegram</span>
            </button>
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!user && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-2">
              <Sparkles size={14} className="text-amber-500" />
              <span>Быстрый вход:</span>
              <button
                onClick={() => loginDemo('ivan')}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 font-medium hover:text-[#0077FF] transition-colors border border-slate-200 dark:border-slate-700"
              >
                VK (Иван)
              </button>
              <button
                onClick={() => loginDemo('durov')}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-900/40 text-slate-700 dark:text-slate-300 font-medium hover:text-[#24A1DE] transition-colors border border-slate-200 dark:border-slate-700"
              >
                TG (Дуров)
              </button>
            </div>
          )}

          {/* Theme switcher */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
            aria-label="Сменить тему"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-amber-400" />}
          </button>

          {/* User profile / Logout */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                    {user.name}
                    {user.verified && <ShieldCheck size={14} className="text-blue-500" />}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    @{user.username}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Выйти"
                aria-label="Выйти"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
