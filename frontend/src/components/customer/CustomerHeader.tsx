import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerTab } from '../../types';
import { LANGUAGE_OPTIONS } from '../../i18n/translations';
import logoIcon from '../../assets/images/logo_icon.png';
import {
  Car,
  Phone,
  Clock,
  MapPin,
  Menu,
  X,
  User,
  Globe,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  const {
    customerTab,
    setCustomerTab,
    settings,
    logout,
    setAppMode,
    currentLanguage,
    setLanguage,
    t
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Theo dõi vị trí cuộn trang: chuyển màu header và tính tiến độ cuộn trang cho nút Lên đầu trang
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 20);
      setShowScrollTop(scrollY > 280);

      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / winHeight) * 100));
        setScrollProgress(progress);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Đóng dropdown ngôn ngữ khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = LANGUAGE_OPTIONS.find((l) => l.code === currentLanguage) || LANGUAGE_OPTIONS[0];

  // Menu điều hướng tinh gọn đa ngôn ngữ (Đã đưa 'Xe cho thuê' thành nút CTA chính bên phải)
  const navLinks: Array<{ id: CustomerTab; label: string }> = [
    { id: 'home', label: t('nav.home') },
    { id: 'regulations', label: t('nav.regulations') },
    { id: 'guide', label: t('nav.guide') },
    { id: 'lookup', label: t('nav.lookup') },
    { id: 'contact', label: t('nav.contact') }
  ];

  const handleSelectTab = (tab: CustomerTab) => {
    setCustomerTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
          : 'bg-transparent border-b border-white/20'
      }`}
    >
      {/* Thanh thông tin trên cùng (Trong suốt ở đầu trang -> Mờ khi kéo xuống) */}
      <div
        className={`relative z-30 text-xs py-1.5 px-4 sm:px-8 transition-colors duration-300 ${
          isScrolled
            ? 'bg-white/70 backdrop-blur-md border-b border-slate-100/80 text-slate-600'
            : 'bg-transparent border-b border-white/10 text-slate-800'
        }`}
      >
        <div className="max-w-[1520px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>{settings.address || '25 Lê Lợi, TP. Nha Trang'}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-700 font-medium text-xs">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{t('nav.open_hours')}</span>
            </span>
          </div>

          {/* Cụm công cụ bên phải dòng trên: Ngôn ngữ & Đăng nhập */}
          <div className="flex items-center gap-2">
            {/* 1. Nút chọn ngôn ngữ (Được đưa lên dòng trên) */}
            <div className="relative z-50" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  isScrolled
                    ? 'text-slate-700 hover:text-sky-700 bg-slate-100/90 hover:bg-sky-50 border border-slate-200/80 shadow-2xs'
                    : 'bg-white/50 hover:bg-white/80 backdrop-blur-xl border border-white/70 shadow-2xs text-slate-800 hover:text-sky-700'
                }`}
                title={t('action.language')}
                aria-label={t('action.language')}
              >
                <span className="text-sm leading-none drop-shadow-2xs">{activeLang.flag}</span>
                <span className="font-bold">{activeLang.name}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Menu thả xuống của Language Switcher */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white/98 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.18)] p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
                    <span>{t('action.language')}</span>
                  </div>
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const isSelected = lang.code === currentLanguage;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 text-sky-800 font-extrabold'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-sky-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Nút Đăng nhập (Được đưa lên dòng trên) */}
            <button
              onClick={() => {
                logout();
                setAppMode('admin');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                isScrolled
                  ? 'text-slate-700 hover:text-sky-700 bg-slate-100/90 hover:bg-sky-50 border border-slate-200/80 shadow-2xs'
                  : 'bg-white/50 hover:bg-white/80 backdrop-blur-xl border border-white/70 shadow-2xs text-slate-800 hover:text-sky-700'
              }`}
              title={t('nav.admin_tooltip')}
            >
              <User className="w-3.5 h-3.5 text-sky-700" />
              <span>{t('action.login')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thanh Menu chính (Taskbar) */}
      <div className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        <div
          onClick={() => handleSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <img
            src={logoIcon}
            alt="Nha Trang Car"
            className="w-10 h-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors block leading-tight">
              Nha Trang Car
            </span>
            <p className="text-xs text-slate-700 font-medium">{t('nav.tagline')}</p>
          </div>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold">
          {navLinks.map((link) => {
            const isActive = customerTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleSelectTab(link.id)}
                className={`py-1 transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-sky-800 font-black'
                    : isScrolled
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-800 hover:text-sky-700'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Nút hành động chính: Xem xe & Đặt cọc (Độc lập, nổi bật và thoáng đãng) */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => handleSelectTab('vehicles')}
            className={`px-5 py-2.5 text-xs font-black text-white rounded-full shadow-md transition-all flex items-center gap-2 border hover:scale-105 active:scale-95 cursor-pointer min-h-[44px] ${
              customerTab === 'vehicles'
                ? 'bg-sky-800 border-sky-600 shadow-sky-900/40 ring-2 ring-sky-500/50'
                : 'bg-sky-700 hover:bg-sky-800 border-sky-600 shadow-[0_4px_16px_rgba(3,105,161,0.3)]'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{t('action.view_book')}</span>
          </button>
        </div>

        {/* Toggle Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white/50"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Drawer Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = customerTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleSelectTab(link.id)}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Bộ chọn ngôn ngữ trên Mobile */}
          <div className="pt-2 border-t border-slate-200/70">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>{t('action.language')}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGE_OPTIONS.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-3 border-t border-slate-200/70 flex flex-col gap-2">
            <button
              onClick={() => handleSelectTab('vehicles')}
              className="w-full py-2.5 px-4 text-center text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>{t('action.view_book')}</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
                setAppMode('admin');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 font-bold text-sm border border-slate-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-600" />
                <span>{t('action.login')}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">{t('action.admin_portal')}</span>
            </button>
          </div>
        </div>
      )}
      </header>


      {/* 2. CỤM TIỆN ÍCH NỔI GÓC PHẢI MÀN HÌNH (SCROLL TO TOP & HOTLINE 24/7) */}
      <aside aria-label="Floating Actions" className="fixed bottom-6 right-6 z-50 select-none flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Nút Cuộn Lên Đầu Trang (Tự động hiển thị khi lướt xuống > 280px) */}
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={t('nav.scroll_to_top')}
          className={`pointer-events-auto group relative w-11 h-11 rounded-full bg-white/95 hover:bg-white text-sky-600 hover:text-cyan-600 backdrop-blur-2xl border border-sky-300/60 hover:border-cyan-400 shadow-[0_8px_25px_rgba(2,132,199,0.22)] hover:shadow-[0_12px_32px_rgba(6,182,212,0.45)] flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer ${
            showScrollTop
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
          }`}
          title={t('nav.scroll_to_top')}
        >
          {/* Vòng tròn viền tiến độ cuộn trang (Scroll Progress Ring) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="2.5"
            />
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="url(#scrollTopGrad)"
              strokeWidth="2.5"
              strokeDasharray="106.8"
              strokeDashoffset={106.8 - (106.8 * scrollProgress) / 100}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-150"
            />
            <defs>
              <linearGradient id="scrollTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Mũi tên chỉ lên trên với hiệu ứng hover đẩy lên nhẹ */}
          <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 relative z-10" />

          {/* Tooltip hiển thị bên trái khi rê chuột */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap bg-slate-900/90 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-lg border border-slate-700/60 backdrop-blur-md">
            {t('nav.scroll_to_top')}
          </span>
        </button>

        {/* Nút Hotline 24/7 (Rê chuột mở rộng hiện số) */}
        <div className="pointer-events-auto">
          <a
            href={`tel:${settings.hotline.replace(/\s+/g, '')}`}
            className="group relative flex items-center bg-white/95 hover:bg-white backdrop-blur-2xl border border-sky-300 hover:border-sky-500 rounded-full p-2 shadow-[0_8px_24px_rgba(2,132,199,0.2)] hover:shadow-[0_12px_32px_rgba(2,132,199,0.35)] transition-all duration-300 ease-out hover:scale-105 active:scale-95 cursor-pointer"
            title={`${t('nav.hotline_call_now')}: ${settings.hotline}`}
          >
            {/* Hiệu ứng sóng âm phát sáng xung quanh icon */}
            <span className="absolute left-2 w-11 h-11 rounded-full bg-sky-400/30 animate-ping pointer-events-none" />

            {/* Icon điện thoại tròn màu xanh biển Nha Trang */}
            <div className="relative z-10 w-11 h-11 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-600/30 shrink-0 transition-transform duration-300 group-hover:rotate-12">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>

            {/* Ô số điện thoại: Tự động mở rộng mượt mà khi rê chuột vào */}
            <div className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:px-3 transition-all duration-300 ease-out whitespace-nowrap">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider leading-none mb-0.5">
                {t('nav.hotline_floating')}
              </p>
              <p className="text-sm font-black text-sky-900 font-mono tracking-tight leading-tight">
                {settings.hotline}
              </p>
            </div>
          </a>
        </div>
      </aside>
    </>
  );
};
