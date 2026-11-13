import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import logoIcon from '../../assets/images/logo_icon.png';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const CustomerFooter: React.FC = () => {
  const { settings, setCustomerTab, t } = useApp();
  
  // Quản lý hiệu ứng xe lướt đường khi rê chuột
  const [isDriving, setIsDriving] = useState(false);
  const cooldownRef = useRef(false);

  const handleTriggerDrive = () => {
    if (isDriving || cooldownRef.current) return;
    setIsDriving(true);
    cooldownRef.current = true;
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName.includes('carDriveLap') || e.animationName.includes('DriveLap')) {
      setIsDriving(false);
      setTimeout(() => {
        cooldownRef.current = false;
      }, 500);
    }
  };

  return (
    <footer className="relative text-slate-300 text-xs w-full overflow-hidden select-none">
      {/* 1. ĐƯỜNG BORDER CHÍNH: NÉT VẼ Ô TÔ LIỀN MẠCH VÀ XE CHẠY LƯỚT ĐƯỜNG (Car Drive Lap Interaction) */}
      <div className="relative w-full overflow-hidden leading-none select-none">
        
        {/* Vạch kẻ mặt đường liên tục toàn màn hình làm đường chạy */}
        <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-sky-500/20 via-sky-400 to-sky-500/20 shadow-[0_0_10px_rgba(56,189,248,0.7)] z-10"></div>
        
        {/* Vạch kẻ tim đường đứt quãng dạ quang phản quang ban đêm */}
        <div className="absolute bottom-0 inset-x-0 h-[2.5px] z-10 pointer-events-none opacity-30">
          <svg className="w-full h-[2.5px]" preserveAspectRatio="none">
            <line x1="0" y1="1" x2="100%" y2="1" stroke="#38bdf8" strokeWidth="2" strokeDasharray="16 14" />
          </svg>
        </div>

        {/* Khung căn giữa xe ô tô (Nhận sự kiện rê chuột & click để kích hoạt chạy) */}
        <div className="relative flex justify-center w-full z-20">
          
          <div
            onMouseEnter={handleTriggerDrive}
            onClick={handleTriggerDrive}
            onAnimationEnd={handleAnimationEnd}
            className={`w-[320px] sm:w-[460px] md:w-[560px] shrink-0 relative cursor-pointer select-none group ${
              isDriving ? 'car-drive-lap' : ''
            }`}
            title={t('footer.drive_hint') || 'Rê chuột để lướt xe!'}
          >
            {/* Tooltip gợi ý nhỏ khi rê chuột (tự ẩn khi xe bắt đầu phóng) */}
            <div
              className={`absolute -top-7 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none whitespace-nowrap bg-sky-500/90 text-white text-[10px] font-bold py-0.5 px-2.5 rounded-full shadow-[0_2px_8px_rgba(56,189,248,0.5)] flex items-center gap-1.5 z-30 ${
                isDriving ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <span>🚗</span>
              <span>{t('footer.drive_hint') || 'Rê chuột để lướt xe!'}</span>
            </div>

            <svg
              viewBox="0 0 560 80"
              className="w-full h-auto block overflow-visible"
              style={{ display: 'block' }}
            >
              <defs>
                {/* Dải chuyển màu neon cho nét viền thân xe */}
                <linearGradient id="carBorderStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="25%" stopColor="#0ea5e9" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="75%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                {/* Ánh sáng đèn pha LED chiếu rọi về phía trước */}
                <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
                  <stop offset="20%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>

                {/* Bộ lọc phát sáng Neon Dạ Quang cho nét viền xe */}
                <filter id="neonCarFilter" x="-10%" y="-30%" width="120%" height="160%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Vệt gió khí động học phía sau khi xe phóng đi */}
              <g
                className={`transition-opacity duration-300 ${
                  isDriving ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                }`}
              >
                <line x1="-15" y1="45" x2="-65" y2="45" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 8" strokeLinecap="round" />
                <line x1="-25" y1="53" x2="-85" y2="53" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="14 10" strokeLinecap="round" />
                <line x1="-10" y1="61" x2="-55" y2="61" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" />
                <line x1="-30" y1="69" x2="-95" y2="69" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="12 8" strokeLinecap="round" />
              </g>

              {/* Chùm sáng đèn pha rọi về phía trước bên phải (Sáng bừng lên khi xe chạy) */}
              <polygon
                points="505,48 640,38 640,74 505,53"
                fill="url(#headlightBeam)"
                className={`transition-all duration-300 ${
                  isDriving ? 'opacity-100 filter drop-shadow-[0_0_12px_#38bdf8]' : 'opacity-75 group-hover:opacity-100'
                }`}
              />

              {/* Khối thân xe màu Slate-900 ăn liền hoàn toàn vào Footer bên dưới */}
              <path
                d="M 0,79 
                   L 35,79 
                   C 48,79 56,71 65,61 
                   C 72,53 78,45 90,41 
                   C 105,36 125,35 150,34 
                   C 185,33 215,17 250,14 
                   C 285,11 325,11 360,14 
                   C 395,17 420,30 445,37 
                   C 470,42 490,47 505,53 
                   C 515,57 522,66 528,79 
                   L 560,79 
                   L 560,80 
                   L 0,80 Z"
                fill="#0f172a"
              />

              {/* NÉT VẼ VIỀN Ô TÔ THỂ THAO LIỀN MẠCH PHÁT SÁNG NEON */}
              <path
                d="M 0,79 
                   L 35,79 
                   C 48,79 56,71 65,61 
                   C 72,53 78,45 90,41 
                   C 105,36 125,35 150,34 
                   C 185,33 215,17 250,14 
                   C 285,11 325,11 360,14 
                   C 395,17 420,30 445,37 
                   C 470,42 490,47 505,53 
                   C 515,57 522,66 528,79 
                   L 560,79"
                fill="none"
                stroke="url(#carBorderStroke)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonCarFilter)"
              />

              {/* Khung kính cửa sổ khoang lái cách điệu (Tinted Panoramic Window) */}
              <path
                d="M 160,34
                   C 188,33 215,19 248,16
                   C 282,13 322,13 355,16
                   C 388,19 412,30 435,37
                   L 418,41
                   C 392,35 370,23 345,21
                   C 310,18 265,21 230,29
                   L 190,36
                   Z"
                fill="#0284c7"
                opacity="0.4"
                stroke="#38bdf8"
                strokeWidth="0.8"
              />
              {/* Trụ B ngăn kính màu Slate-900 */}
              <line x1="298" y1="13" x2="295" y2="31" stroke="#0f172a" strokeWidth="2.5" />

              {/* Đèn hậu đỏ thể thao sắc sảo (Ruby Red Neon) */}
              <rect x="58" y="44" width="7" height="3" rx="1.5" fill="#f43f5e" filter="url(#neonCarFilter)" />

              {/* Đèn pha LED công nghệ cao sắc sảo (Diamond Cyan Neon) */}
              <ellipse cx="503" cy="50" rx="4" ry="2" fill="#e0f2fe" filter="url(#neonCarFilter)" />

              {/* Hốc vòm bánh xe sau (Wheel Arch) */}
              <path
                d="M 98,79 A 17,17 0 0,1 132,79"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeOpacity="0.4"
              />
              {/* Cụm bánh sau thể thao (quay tít khi xe chạy) */}
              <g transform="translate(115, 65)">
                <circle cx="0" cy="0" r="13" fill="#020617" stroke="#334155" strokeWidth="1.5" />
                <g className={isDriving ? 'wheel-spinning' : ''}>
                  <circle cx="0" cy="0" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2.8" fill="#38bdf8" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="-5.5" y1="-5.5" x2="5.5" y2="5.5" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="-5.5" y1="5.5" x2="5.5" y2="-5.5" stroke="#38bdf8" strokeWidth="0.8" />
                </g>
              </g>

              {/* Hốc vòm bánh xe trước (Wheel Arch) */}
              <path
                d="M 418,79 A 17,17 0 0,1 452,79"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeOpacity="0.4"
              />
              {/* Cụm bánh trước thể thao (quay tít khi xe chạy) */}
              <g transform="translate(435, 65)">
                <circle cx="0" cy="0" r="13" fill="#020617" stroke="#334155" strokeWidth="1.5" />
                <g className={isDriving ? 'wheel-spinning' : ''}>
                  <circle cx="0" cy="0" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2.8" fill="#38bdf8" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="-5.5" y1="-5.5" x2="5.5" y2="5.5" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="-5.5" y1="5.5" x2="5.5" y2="-5.5" stroke="#38bdf8" strokeWidth="0.8" />
                </g>
              </g>
            </svg>
          </div>

        </div>
      </div>

      {/* 3. KHỐI THÂN CHÍNH FOOTER (Màu Slate-900) */}
      <div className="bg-slate-900 pt-6 pb-8">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={logoIcon}
                alt="Nha Trang Car"
                className="w-9 h-9 object-contain"
              />
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">Nha Trang Car</span>
                <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">DriveRent</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-cyan-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('footer.commit')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-xs">{t('footer.quick_nav')}</h4>
            <ul className="space-y-2">
              {[
                { tab: 'home' as const, label: t('nav.home') },
                { tab: 'vehicles' as const, label: t('nav.vehicles') },
                { tab: 'regulations' as const, label: t('nav.regulations'), scroll: true },
                { tab: 'guide' as const, label: t('nav.guide') },
                { tab: 'lookup' as const, label: t('nav.lookup') },
                { tab: 'contact' as const, label: t('nav.contact'), scroll: true }
              ].map((item) => (
                <li key={item.tab}>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerTab(item.tab);
                      if (item.scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-sky-300 hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group text-left"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-sky-400 transition-colors" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy & Rental Notice */}
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-xs">{t('footer.policies')}</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-sky-400 mt-0.5">•</span>
                <span><strong className="text-slate-300 font-semibold">{t('modal.term_limit_title')}</strong> {t('modal.term_limit_desc')}</span>
              </li>
              <li className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-sky-400 mt-0.5">•</span>
                <span><strong className="text-slate-300 font-semibold">{t('modal.term_fuel_title')}</strong> {t('modal.term_fuel_desc')}</span>
              </li>
              <li className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-sky-400 mt-0.5">•</span>
                <span><strong className="text-slate-300 font-semibold">{t('modal.term_smoke_title')}</strong> {t('modal.term_smoke_desc')}</span>
              </li>
              <li className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-sky-400 mt-0.5">•</span>
                <span><strong className="text-slate-300 font-semibold">{t('modal.term_hours_title')}</strong> {t('modal.term_hours_desc')}</span>
              </li>
              <li className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-sky-400 mt-0.5">•</span>
                <span><strong className="text-slate-300 font-semibold">{t('modal.location_free_delivery_title')}</strong> {t('modal.location_free_delivery_desc')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase tracking-wider text-xs">{t('footer.contact_info')}</h4>
            <div className="space-y-2.5 text-slate-300 text-xs">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={`tel:${settings.hotline.replace(/\s+/g, '')}`}
                  className="font-black text-white hover:text-sky-300 transition-colors duration-200 tracking-wide"
                >
                  {settings.hotline}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-sky-300 transition-colors duration-200"
                >
                  {settings.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{t('nav.open_hours')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-slate-800 text-center text-[11px] text-slate-400">
          <div>
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </div>
  </footer>
  );
};
