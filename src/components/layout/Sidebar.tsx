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
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } no-print`}
      >
        {/* Brand Area */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900">DriveRent</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  Admin
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                      isActive ? 'bg-emerald-600 text-white' : `${item.badgeColor || 'bg-slate-200'} text-slate-700`
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
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-2">
          {/* Switch to Customer Portal button */}
          <button
            onClick={() => {
              setAppMode('customer');
              setCustomerTab('home');
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Chuyển sang giao diện website dành cho khách hàng đặt xe"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              <span>Xem trang khách hàng</span>
            </div>
            <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-mono font-bold">Web</span>
          </button>

          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold truncate">{currentUser.roleTitle}</p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Quick switch active role */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                Đổi vai trò thử nghiệm:
              </label>
              <select
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-white text-slate-800">
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
