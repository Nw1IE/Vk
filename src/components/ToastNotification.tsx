import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { VkLogo, TelegramLogo } from './common/Icons';
import { X, Copy, Check, BellRing } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, dismissToast, fillCodeDirectly } = useAuth();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      dismissToast(toasts[0].id);
    }, 15000);
    return () => clearTimeout(timer);
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-auto">
      {toasts.map((toast) => {
        const isVk = toast.provider === 'vk';

        return (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${
              isVk
                ? 'bg-white/95 dark:bg-slate-900/95 border-blue-200 dark:border-blue-900 text-slate-800 dark:text-slate-100 shadow-blue-500/10'
                : 'bg-white/95 dark:bg-slate-900/95 border-sky-200 dark:border-sky-900 text-slate-800 dark:text-slate-100 shadow-sky-500/10'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {isVk ? <VkLogo size={24} /> : <TelegramLogo size={24} />}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <BellRing size={12} className={isVk ? 'text-[#0077FF]' : 'text-[#24A1DE]'} />
                    {toast.title}
                  </span>
                  <div className="text-xs text-slate-400">Только что</div>
                </div>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                aria-label="Закрыть"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {toast.message}
            </p>

            {toast.code && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-slate-400">Код:</span>
                  <span className="font-mono text-base font-bold tracking-widest text-slate-900 dark:text-white">
                    {toast.code}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (toast.code) {
                      fillCodeDirectly(toast.code);
                      setCopiedId(toast.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    isVk
                      ? 'bg-[#0077FF] hover:bg-[#0066DD] text-white shadow-sm'
                      : 'bg-[#24A1DE] hover:bg-[#1f93cb] text-white shadow-sm'
                  }`}
                >
                  {copiedId === toast.id ? (
                    <>
                      <Check size={14} />
                      Вставлено!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Вставить код
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
