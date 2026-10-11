import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab, UserRole } from '../../types';
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  FileText,
  Users,
  Wrench,
  Receipt,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    contracts,
    maintenanceTasks,
    currentUser,
    switchUser,
    users,
    logout,
    setAppMode,
    setCustomerTab
  } = useApp();

  const activeRentalsCount = contracts.filter((c) => c.status === 'rented').length;
  const pendingSettlementCount = contracts.filter((c) => c.status === 'pending_settlement').length;
  const urgentMaintenanceCount = maintenanceTasks.filter(
    (m) => m.status === 'in_progress' || m.status === 'overdue'
  ).length;

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard
    },
    {
      id: 'fleet',
      label: 'Đội xe',
      icon: Car
    },
    {
      id: 'schedule',
      label: 'Lịch thuê & Đặt trước',
      icon: CalendarDays
    },
    {
      id: 'contracts',
      label: 'Hợp đồng cho thuê',
      icon: FileText,
      badge: activeRentalsCount + pendingSettlementCount,
      badgeColor: pendingSettlementCount > 0 ? 'bg-amber-500' : 'bg-blue-600'
    },
    {
      id: 'customers',
      label: 'Khách hàng',
      icon: Users
    },
    {
      id: 'maintenance',
      label: 'Bảo trì & Sửa chữa',
      icon: Wrench,
      badge: urgentMaintenanceCount > 0 ? urgentMaintenanceCount : undefined,
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'finance',
      label: 'Thu chi & Báo cáo',
      icon: Receipt
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      icon: Settings
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } no-print`}
      >
        {/* Brand Area */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">DriveRent</span>
                <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/60">
                  VN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Quản lý xe máy & ô tô</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu chức năng
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border-r-4 border-sky-500 font-bold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[11px] font-bold rounded-full ${
                      isActive ? 'bg-sky-500 text-slate-950' : `${item.badgeColor || 'bg-slate-700'} text-white`
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User profile & Role switcher */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
          {/* Switch to Customer Portal button */}
          <button
            onClick={() => {
              setAppMode('customer');
              setCustomerTab('home');
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/90 hover:bg-slate-800 text-sky-400 border border-slate-700/80 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Chuyển sang giao diện website dành cho khách hàng đặt xe"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-sky-400" />
              <span>Xem trang khách hàng</span>
            </div>
            <span className="text-[10px] bg-sky-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">Web</span>
          </button>

          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-sky-400 font-medium truncate">{currentUser.roleTitle}</p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Quick switch active role */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                Đổi vai trò thử nghiệm:
              </label>
              <select
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
                className="w-full text-xs font-medium bg-slate-950 border border-slate-700 rounded-md py-1 px-2 text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-slate-900 text-slate-200">
                    {u.name} ({u.roleTitle.split('/')[0].trim()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
