import React, { useState } from 'react';
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

  // Menu điều hướng tinh gọn (Đã gộp "Giới thiệu" vào Trang chủ)
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
    <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
      {/* Thanh thông tin trên cùng */}
      <div className="bg-slate-950/90 backdrop-blur-xl text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-[1520px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-200 font-semibold">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{settings.address || '25 Lê Lợi, TP. Nha Trang'}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Giờ mở cửa: 06:00 - 22:00 hàng ngày</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.hotline.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <Phone className="w-3 h-3" />
              <span>Hotline 24/7: {settings.hotline}</span>
            </a>

            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-semibold transition-all border border-white/20 backdrop-blur-md cursor-pointer text-[10px]"
              title="Dành cho chủ cửa hàng và nhân viên nội bộ"
            >
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              <span>Quản trị</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thanh Menu chính Liquid Glass */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        <div
          onClick={() => handleSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 backdrop-blur-md flex items-center justify-center shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                DriveRent
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-white/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
                {settings.city || 'Nha Trang'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Thuê xe máy & ô tô tự lái</p>
          </div>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = customerTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleSelectTab(link.id)}
                className={`py-1 transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
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

        {/* Nút hành động Liquid Glass */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleSelectTab('lookup')}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white/60 hover:bg-white/90 backdrop-blur-xl rounded-xl transition-all flex items-center gap-1.5 border border-white/80 shadow-xs cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tra cứu đơn</span>
          </button>

          <button
            onClick={() => handleSelectTab('vehicles')}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900/90 hover:bg-emerald-600 rounded-full shadow-md backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Car className="w-3.5 h-3.5" />
            <span>Xem xe & Đặt cọc</span>
          </button>
        </div>

        {/* Toggle Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Drawer Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
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
