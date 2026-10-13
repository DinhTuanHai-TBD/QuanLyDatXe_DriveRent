import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerTab } from '../../types';
import {
  Car,
  Phone,
  Clock,
  MapPin,
  Menu,
  X,
  Search,
  Lock
} from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  const {
    customerTab,
    setCustomerTab,
    settings,
    setIsAdminLoginModalOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Theo dõi vị trí cuộn trang: ở đầu trang là Liquid Glass trong suốt, khi kéo xuống chuyển sang màu trắng
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu điều hướng tinh gọn
  const navLinks: Array<{ id: CustomerTab; label: string }> = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'vehicles', label: 'Xe cho thuê' },
    { id: 'guide', label: 'Hướng dẫn thuê xe' },
    { id: 'lookup', label: 'Tra cứu đặt xe' },
    { id: 'contact', label: 'Liên hệ' }
  ];

  const handleSelectTab = (tab: CustomerTab) => {
    setCustomerTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white border-b border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
          : 'bg-white/25 backdrop-blur-2xl border-b border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.85)]'
      }`}
    >
      {/* Thanh thông tin trên cùng (Liquid Glass khi ở đầu trang -> Trắng khi cuộn xuống) */}
      <div
        className={`text-[11px] py-1.5 px-4 sm:px-8 transition-colors duration-300 ${
          isScrolled
            ? 'bg-white border-b border-slate-100 text-slate-600'
            : 'bg-white/20 border-b border-white/35 text-slate-800'
        }`}
      >
        <div className="max-w-[1520px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{settings.address || '25 Lê Lợi, TP. Nha Trang'}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Giờ mở cửa: 06:00 - 22:00 hàng ngày</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.hotline.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-600 font-extrabold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline 24/7: {settings.hotline}</span>
            </a>

            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer text-[10px] ${
                isScrolled
                  ? 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80'
                  : 'bg-white/45 hover:bg-white/75 text-slate-800 hover:text-emerald-800 border border-white/60 backdrop-blur-md shadow-2xs'
              }`}
              title="Dành cho chủ cửa hàng và nhân viên nội bộ"
            >
              <Lock className="w-2.5 h-2.5 text-emerald-600" />
              <span>Quản trị</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thanh Menu chính (Taskbar) */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        <div
          onClick={() => handleSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
              isScrolled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white'
                : 'bg-white/50 text-emerald-700 border border-white/70 backdrop-blur-md shadow-xs group-hover:bg-emerald-600 group-hover:text-white'
            }`}
          >
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                DriveRent
              </span>
              <span
                className={`text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded-full transition-all ${
                  isScrolled
                    ? 'bg-emerald-50 border border-emerald-200/70'
                    : 'bg-white/55 backdrop-blur-md border border-white/70 shadow-2xs'
                }`}
              >
                {settings.city || 'Nha Trang'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold">Thuê xe máy & ô tô tự lái</p>
          </div>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-bold">
          {navLinks.map((link) => {
            const isActive = customerTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleSelectTab(link.id)}
                className={`py-1 transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-emerald-700 font-extrabold'
                    : isScrolled
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-800 hover:text-emerald-700'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 inset-x-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Nút hành động */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleSelectTab('lookup')}
            className={`px-3.5 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              isScrolled
                ? 'text-slate-700 hover:text-emerald-700 bg-slate-100/90 hover:bg-emerald-50 border border-slate-200/80'
                : 'text-slate-800 hover:text-emerald-800 bg-white/45 hover:bg-white/75 backdrop-blur-xl border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tra cứu đơn</span>
          </button>

          <button
            onClick={() => handleSelectTab('vehicles')}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-md shadow-emerald-600/25 backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/30 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Car className="w-3.5 h-3.5" />
            <span>Xem xe & Đặt cọc</span>
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
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
