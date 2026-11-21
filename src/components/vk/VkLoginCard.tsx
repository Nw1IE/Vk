import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VkLogo } from '../common/Icons';
import { QrCode, Smartphone, ArrowRight, Shield, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';

export const VkLoginCard: React.FC = () => {
  const {
    sendVerificationCode,
    verifyAndLogin,
    loginWithQr,
    loginDemo,
    pendingCode,
    prefilledCodeInput,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'phone' | 'qr'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+7 999 123-45-67');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync prefilled code if user clicked "Вставить код" from toast
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

  const handleSendCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setErrorMessage('Пожалуйста, введите корректный номер телефона');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      sendVerificationCode(phoneNumber, 'vk');
      setIsLoading(false);
      setStep('verify');
      setTimer(60);
      setCanResend(false);
    }, 600);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.length < 4) {
      setErrorMessage('Введите проверочный код из SMS / Push');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = verifyAndLogin(phoneNumber, code, 'vk');
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Ошибка проверки кода');
      }
    }, 500);
  };

  const handleResend = () => {
    if (!canResend) return;
    sendVerificationCode(phoneNumber, 'vk');
    setTimer(60);
    setCanResend(false);
  };

  return (
    <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-all">
      {/* VK Card Header */}
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-2xl mb-3 shadow-inner">
          <VkLogo size={42} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Вход ВКонтакте
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Единая учетная запись <span className="font-semibold text-[#0077FF]">VK ID</span> для всех сервисов
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mt-6">
        <button
          type="button"
          onClick={() => {
            setAuthMode('phone');
            setErrorMessage('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
            authMode === 'phone'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Smartphone size={16} />
          По телефону
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('qr');
            setErrorMessage('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
            authMode === 'qr'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <QrCode size={16} />
          По QR-коду
        </button>
      </div>

      {/* Mode: Phone */}
      {authMode === 'phone' && (
        <div className="mt-6">
          {step === 'input' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Телефон или электронная почта
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077FF] focus:border-transparent text-base transition-all"
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                  На этот номер придет проверочный код в уведомлении или SMS
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
                className="w-full py-3.5 px-4 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] active:scale-[0.99] text-white font-semibold text-base shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Продолжить</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Код отправлен на номер:
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {phoneNumber}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setErrorMessage('');
                  }}
                  className="text-xs text-[#0077FF] hover:underline block mt-1 mx-auto"
                >
                  Изменить номер
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Код подтверждения
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="XXXXXX"
                    className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-xl font-bold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077FF] focus:border-transparent transition-all"
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
                          className="text-[#0077FF] hover:underline font-medium"
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
                      className="text-[#0077FF] hover:underline font-medium"
                    >
                      Вставить код ({pendingCode.code})
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
                className="w-full py-3.5 px-4 rounded-xl bg-[#0077FF] hover:bg-[#0066DD] active:scale-[0.99] text-white font-semibold text-base shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Подтвердить и войти</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Mode: QR Code */}
      {authMode === 'qr' && (
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="relative p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-800 shadow-sm group">
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
                <rect x="36" y="10" width="6" height="6" fill="currentColor" />
                <rect x="46" y="10" width="14" height="6" fill="currentColor" />
                <rect x="36" y="22" width="10" height="6" fill="currentColor" />
                <rect x="52" y="22" width="8" height="6" fill="currentColor" />
                
                <rect x="10" y="38" width="8" height="8" fill="currentColor" />
                <rect x="24" y="38" width="6" height="14" fill="currentColor" />
                <rect x="36" y="36" width="28" height="28" rx="6" fill="#0077FF" />
                
                <rect x="70" y="38" width="10" height="8" fill="currentColor" />
                <rect x="86" y="44" width="8" height="18" fill="currentColor" />

                <rect x="36" y="72" width="14" height="6" fill="currentColor" />
                <rect x="56" y="72" width="8" height="16" fill="currentColor" />
                <rect x="70" y="72" width="12" height="12" fill="currentColor" />
                <rect x="88" y="76" width="6" height="18" fill="currentColor" />
              </svg>
              {/* VK icon in middle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-1 rounded-lg shadow-md">
                  <VkLogo size={24} />
                </div>
              </div>
              {/* Scan laser line animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_#0077FF] animate-scan pointer-events-none" />
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 max-w-xs leading-relaxed">
            Наведите камеру смартфона или откройте раздел «QR-код» в приложении ВКонтакте
          </p>

          <button
            type="button"
            onClick={() => loginWithQr('vk')}
            className="mt-4 w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-[#0077FF] dark:text-blue-300 font-semibold text-sm transition-all border border-blue-200 dark:border-blue-900 flex items-center justify-center gap-2"
          >
            <QrCode size={16} />
            <span>Симулировать сканирование QR-кода</span>
          </button>
        </div>
      )}

      {/* Demo Fast Login */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
        <span className="text-xs text-slate-400 dark:text-slate-500 block mb-2.5">
          Или выполните тестовый вход:
        </span>
        <button
          type="button"
          onClick={() => loginDemo('ivan')}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
            alt="Иван"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span>Войти как Иван Иванов (тестовый аккаунт)</span>
        </button>
      </div>

      {/* Footer Security */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <Shield size={12} className="text-[#0077FF]" />
        <span>Защищено сквозным шифрованием VK ID</span>
      </div>
    </div>
  );
};
