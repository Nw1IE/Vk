import React from 'react';

export const VkLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="28" height="28" rx="7" fill="#0077FF" />
    <path
      d="M15.48 19.5c-5.83 0-9.15-4-9.29-10.67h2.92c.1 4.9 2.26 6.97 3.97 7.4V8.83h2.75v4.22c1.68-.18 3.46-2.09 4.06-4.22h2.75c-.46 2.65-2.38 4.56-3.73 5.34 1.35.63 3.52 2.31 4.34 5.33h-3.03c-.65-2.02-2.26-3.58-4.41-3.72v3.72h-.33z"
      fill="#ffffff"
    />
  </svg>
);

export const TelegramLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="14" cy="14" r="14" fill="#24A1DE" />
    <path
      d="M6.3 13.78l13.5-5.2c.62-.23 1.16.14.96.99l-2.3 10.82c-.17.77-.63.95-1.27.6l-3.5-2.58-1.69 1.63c-.19.19-.34.34-.7.34l.25-3.58 6.52-5.89c.28-.25-.06-.39-.44-.14L10.97 15.8l-3.48-1.09c-.76-.24-.77-.75.16-1.12z"
      fill="#ffffff"
    />
  </svg>
);

export const VkIdBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs tracking-wide ${className}`}>
    <span className="w-2 h-2 rounded-full bg-[#0077FF]"></span>
    VK ID
  </div>
);

export const TgIdBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 font-semibold text-xs tracking-wide ${className}`}>
    <span className="w-2 h-2 rounded-full bg-[#24A1DE]"></span>
    Telegram Login
  </div>
);
