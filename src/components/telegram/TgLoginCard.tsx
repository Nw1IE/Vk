import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TelegramLogo } from '../common/Icons';
import { QrCode, Phone, ArrowRight, Shield, RefreshCw, KeyRound, CheckCircle2, ChevronDown } from 'lucide-react';

const COUNTRIES = [
  { code: '+7', name: 'Россия / Казахстан', flag: '🇷🇺' },
  { code: '+375', name: 'Беларусь', flag: '🇧🇾' },
  { code: '+998', name: 'Узбекистан', flag: '🇺🇿' },
  { code: '+1', name: 'США / Канада', flag: '🇺🇸' },
  { code: '+49', name: 'Германия', flag: '🇩🇪' },
  { code: '+971', name: 'ОАЭ', flag: '🇦🇪' },
];

export const TgLoginCard: React.FC = () => {
  const {
    sendVerificationCode,
    verifyAndLogin,
    loginWithQr,
    loginDemo,
    pendingCode,
    prefilledCodeInput,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'qr' | 'phone'>('qr');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneBody, setPhoneBody] = useState('999 123-45-67');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (prefilledCodeInput) {
      setCode(prefilledCodeInput);
    }
  }, [prefilledCodeInput]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const fullPhone = `${selectedCountry.code} ${phoneBody}`.trim();

  const handleSendCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneBody || phoneBody.replace(/\D/g, '').length < 6) {
      setErrorMessage('Пожалуйста, введите корректный номер телефона');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      sendVerificationCode(fullPhone, 'telegram');
      setIsLoading(false);
      setStep('verify');
      setTimer(60);
      setCanResend(false);
    }, 600);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.length < 4) {
      setErrorMessage('Введите проверочный код из Telegram');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = verifyAndLogin(fullPhone, code, 'telegram');
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Ошибка проверки кода');
      }
    }, 500);
  };

  const handleResend = () => {
    if (!canResend) return;
    sendVerificationCode(fullPhone, 'telegram');
    setTimer(60);
    setCanResend(false);
  };

  return (
    <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-all">
      {/* Telegram Card Header */}
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-sky-50 dark:bg-sky-950/60 rounded-full mb-3 shadow-inner">
          <TelegramLogo size={46} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {authMode === 'qr' ? 'Вход по QR-коду' : 'Вход в Telegram'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          {authMode === 'qr'
            ? 'Отсканируйте камерой приложения Telegram для быстрого входа'
            : 'Введите номер телефона для получения кода в приложении'}
        </p>
      </div>

      {/* Mode: QR Code (Default in Telegram Web) */}
      {authMode === 'qr' && (
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="relative p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-sky-300 dark:border-sky-800 shadow-sm">
            {/* Simulated QR Code SVG */}
            <div className="relative w-48 h-48 bg-white flex items-center justify-center p-2 rounded-xl overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="11" y="11" width="13" height="13" fill="currentColor" />
                <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="76" y="11" width="13" height="13" fill="currentColor" />
                <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="11" y="76" width="13" height="13" fill="currentColor" />
                
                {/* Patterns */}
                <rect x="36" y="8" width="8" height="6" fill="currentColor" />
                <rect x="48" y="10" width="12" height="6" fill="currentColor" />
                <rect x="36" y="20" width="12" height="8" fill="currentColor" />
                <rect x="54" y="20" width="6" height="8" fill="currentColor" />
                
                <rect x="10" y="38" width="8" height="8" fill="currentColor" />
                <rect x="22" y="38" width="8" height="14" fill="currentColor" />
                <circle cx="50" cy="50" r="14" fill="#24A1DE" />
                
                <rect x="70" y="38" width="10" height="8" fill="currentColor" />
                <rect x="84" y="44" width="10" height="18" fill="currentColor" />

                <rect x="36" y="72" width="14" height="6" fill="currentColor" />
                <rect x="56" y="72" width="8" height="16" fill="currentColor" />
                <rect x="70" y="72" width="12" height="12" fill="currentColor" />
                <rect x="88" y="76" width="6" height="18" fill="currentColor" />
              </svg>
              {/* Telegram plane icon in middle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <TelegramLogo size={26} />
              </div>
              {/* Animated scanning bar */}
              <div className="absolute left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_8px_#24A1DE] animate-scan pointer-events-none" />
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1 text-left bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 w-full">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Инструкция:</div>
            <div>1. Откройте <b>Telegram</b> на телефоне</div>
            <div>2. Перейдите в <b>Настройки → Устройства → Подключить устройство</b></div>
            <div>3. Наведите камеру на этот экран</div>
          </div>

          <button
            type="button"
            onClick={() => loginWithQr('telegram')}
            className="mt-4 w-full py-3 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900 text-[#24A1DE] dark:text-sky-300 font-semibold text-sm transition-all border border-sky-200 dark:border-sky-900 flex items-center justify-center gap-2"
          >
            <QrCode size={16} />
            <span>Симулировать сканирование камеры</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('phone');
              setStep('input');
              setErrorMessage('');
            }}
            className="mt-3 text-xs text-[#24A1DE] hover:underline font-semibold flex items-center gap-1"
          >
            <Phone size={13} />
            <span>Войти по номеру телефона</span>
          </button>
        </div>
      )}

      {/* Mode: Phone */}
      {authMode === 'phone' && (
        <div className="mt-6">
          {step === 'input' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Страна
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span>{selectedCountry.flag}</span>
                      <span>{selectedCountry.name}</span>
                    </span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-20 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.code + c.name}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                        >
                          <span className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span>{c.name}</span>
                          </span>
                          <span className="text-slate-400 font-mono">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Номер телефона
                </label>
                <div className="flex rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-[#24A1DE] focus-within:border-transparent">
                  <span className="px-3 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-sm border-r border-slate-300 dark:border-slate-700 flex items-center">
                    {selectedCountry.code}
                  </span>
                  <input
                    type="tel"
                    value={phoneBody}
                    onChange={(e) => setPhoneBody(e.target.value)}
                    placeholder="999 123-45-67"
                    className="w-full px-3 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none"
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                  Код будет отправлен в приложение Telegram
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#24A1DE] hover:bg-[#1f93cb] active:scale-[0.99] text-white font-semibold text-base shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Далее</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('qr');
                    setErrorMessage('');
                  }}
                  className="text-xs text-[#24A1DE] hover:underline font-semibold"
                >
                  Вернуться ко входу по QR-коду
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Код отправлен в приложение на номер:
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {fullPhone}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setErrorMessage('');
                  }}
                  className="text-xs text-[#24A1DE] hover:underline block mt-1 mx-auto"
                >
                  Изменить номер
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Проверочный код
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="XXXXXX"
                    className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-xl font-bold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#24A1DE] focus:border-transparent transition-all"
                    autoFocus
                  />
                  <KeyRound size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
                {pendingCode && (
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span>
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResend}
                          className="text-[#24A1DE] hover:underline font-medium"
                        >
                          Отправить код повторно
                        </button>
                      ) : (
                        <span>Повторная отправка через {timer} с</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCode(pendingCode.code)}
                      className="text-[#24A1DE] hover:underline font-medium"
                    >
                      Вставить ({pendingCode.code})
                    </button>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#24A1DE] hover:bg-[#1f93cb] active:scale-[0.99] text-white font-semibold text-base shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Войти в аккаунт</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Demo Fast Login */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
        <span className="text-xs text-slate-400 dark:text-slate-500 block mb-2.5">
          Или войдите сразу под тестовым аккаунтом:
        </span>
        <button
          type="button"
          onClick={() => loginDemo('durov')}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Павел Дуров"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span>Войти как Павел Дуров (@durov)</span>
        </button>
      </div>

      {/* Footer Security */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <Shield size={12} className="text-[#24A1DE]" />
        <span>Официальный протокол авторизации MTProto</span>
      </div>
    </div>
  );
};
