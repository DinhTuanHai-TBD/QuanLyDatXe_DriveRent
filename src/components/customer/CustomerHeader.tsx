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
  ShieldCheck,
  UserCheck,
  ExternalLink,
  Lock
} from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  const {
    customerTab,
    setCustomerTab,
    settings,
    setIsAdminLoginModalOpen,
    setAppMode,
    isLoggedIn,
    currentUser
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-200 font-semibold">
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>25 Lê Lợi, TP. Nha Trang</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Giờ mở cửa: 06:00 - 22:00 hàng ngày</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.hotline.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold"
            >
              <Phone className="w-3 h-3" />
              <span>Hotline 24/7: {settings.hotline}</span>
            </a>

            {/* Quick Admin Portal Button */}
            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-colors border border-slate-700 cursor-pointer"
              title="Dành cho chủ cửa hàng và nhân viên nội bộ"
            >
              <Lock className="w-2.5 h-2.5 text-sky-400" />
              <span>Trang quản trị</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20 group-hover:bg-orange-600 transition-colors">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                DriveRent
              </span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                Nha Trang
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Cho thuê xe máy & ô tô tự lái</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = customerTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleSelectTab(link.id)}
                className={`py-1 transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-sky-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleSelectTab('lookup')}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Tra cứu đơn</span>
          </button>

          <button
            onClick={() => handleSelectTab('vehicles')}
            className="px-4 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow-sm shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Car className="w-3.5 h-3.5" />
            <span>Xem xe & Đặt cọc</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleSelectTab(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                customerTab === link.id
                  ? 'bg-sky-50 text-sky-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleSelectTab('vehicles')}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl font-bold text-xs text-center shadow-sm shadow-orange-500/20"
            >
              Xem danh sách xe & Đặt ngay
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAdminLoginModalOpen(true);
              }}
              className="w-full py-2 bg-slate-900 text-slate-200 hover:text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>Chuyển sang Trang quản trị nội bộ</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
