import React from 'react';
import { useAuth } from '../context/AuthContext';
import { VkIdBadge, TgIdBadge } from './common/Icons';
import {
  ShieldCheck,
  MapPin,
  Phone,
  Globe,
  Calendar,
  AtSign,
  Fingerprint,
  LogOut,
  Monitor,
  Smartphone,
  Laptop,
  Wifi,
  MessageSquareWarning,
} from 'lucide-react';

export const ProfileDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isVk = user.provider === 'vk';
  const accentClass = isVk ? 'text-[#0077FF]' : 'text-[#24A1DE]';
  const accentBg = isVk ? 'bg-blue-50 dark:bg-blue-950/40' : 'bg-sky-50 dark:bg-sky-950/40';
  const accentRing = isVk ? 'ring-blue-500' : 'ring-sky-500';

  const sessions = [
    {
      icon: <Monitor size={20} />,
      device: 'Windows PC (Chrome 131)',
      location: 'Москва, Россия',
      ip: '178.62.204.14',
      lastActive: 'Сейчас активен',
      isCurrent: true,
    },
    {
      icon: <Smartphone size={20} />,
      device: isVk ? 'iPhone 15 Pro — VK App' : 'iPhone 15 Pro — Telegram',
      location: 'Санкт-Петербург, Россия',
      ip: '94.25.176.88',
      lastActive: '2 часа назад',
      isCurrent: false,
    },
    {
      icon: <Laptop size={20} />,
      device: 'MacBook Pro 16 — Safari 18',
      location: 'Алматы, Казахстан',
      ip: '85.117.112.5',
      lastActive: 'Вчера в 19:42',
      isCurrent: false,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      {/* Welcome Banner */}
      <div
        className={`rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-slate-800 ${
          isVk
            ? 'bg-gradient-to-br from-[#0077FF] via-[#0066DD] to-[#2787f5]'
            : 'bg-gradient-to-br from-[#24A1DE] via-[#1E8FC9] to-[#0088cc]'
        } text-white p-6 sm:p-8`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ${accentRing}/30 shadow-lg`}
          />
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{user.name}</h1>
              {user.verified && (
                <ShieldCheck size={22} className="text-white/80 drop-shadow" />
              )}
            </div>
            <p className="text-sm text-white/80 mb-2.5">@{user.username}</p>
            {user.bio && (
              <p className="text-sm text-white/70 italic max-w-md">&laquo;{user.bio}&raquo;</p>
            )}
            <div className="mt-3">
              {isVk ? <VkIdBadge className="bg-white/15 text-white" /> : <TgIdBadge className="bg-white/15 text-white" />}
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Account Info */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-800 p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Fingerprint size={18} className={accentClass} />
            Информация об аккаунте
          </h3>
          <div className="space-y-3">
            <InfoRow icon={<AtSign size={16} />} label="Имя пользователя" value={`@${user.username}`} />
            <InfoRow icon={<Phone size={16} />} label="Телефон" value={user.phone} />
            <InfoRow icon={<Globe size={16} />} label="Провайдер" value={isVk ? 'VK ID' : 'Telegram'} valueClass={accentClass} />
            <InfoRow icon={<Calendar size={16} />} label="Дата регистрации" value={user.joinedDate} />
            <InfoRow icon={<MapPin size={16} />} label="Текущая сессия" value="Москва, Россия" />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-800 p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className={accentClass} />
            Безопасность
          </h3>
          <div className="space-y-3">
            <SecurityRow label="Двухфакторная аутентификация" enabled />
            <SecurityRow label="Уведомления о входе" enabled />
            <SecurityRow label="Привязанный email" enabled={false} />
            <SecurityRow label="Биометрия" enabled={false} />
          </div>

          <button className={`mt-5 w-full py-2 text-xs font-semibold rounded-lg ${accentBg} ${accentClass} hover:opacity-80 transition-colors`}>
            Настройки безопасности
          </button>
        </div>
      </div>

      {/* Sessions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-800 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Wifi size={18} className={accentClass} />
          Активные сеансы
        </h3>

        <div className="space-y-3">
          {sessions.map((session, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                session.isCurrent
                  ? `${accentBg} border border-slate-200/50 dark:border-slate-700`
                  : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${session.isCurrent ? accentBg : 'bg-slate-100 dark:bg-slate-700'} ${session.isCurrent ? accentClass : 'text-slate-500 dark:text-slate-400'}`}>
                  {session.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {session.device}
                    {session.isCurrent && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400">
                        Текущий
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{session.location}</span>
                    <span>•</span>
                    <span className="font-mono">{session.ip}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 text-right">
                {session.lastActive}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full py-2 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center justify-center gap-1.5">
          <MessageSquareWarning size={14} />
          Завершить все другие сеансы
        </button>
      </div>

      {/* Logout */}
      <div className="flex justify-center pb-6">
        <button
          onClick={logout}
          className="px-8 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-md shadow-rose-500/20 transition-all flex items-center gap-2"
        >
          <LogOut size={18} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}> = ({ icon, label, value, valueClass = '' }) => (
  <div className="flex items-center gap-2.5">
    <span className="text-slate-400 dark:text-slate-500">{icon}</span>
    <div>
      <div className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
        {label}
      </div>
      <div className={`text-sm font-semibold text-slate-800 dark:text-slate-200 ${valueClass}`}>
        {value}
      </div>
    </div>
  </div>
);

const SecurityRow: React.FC<{ label: string; enabled: boolean }> = ({ label, enabled }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        enabled
          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
      }`}
    >
      {enabled ? 'Вкл' : 'Выкл'}
    </span>
  </div>
);
