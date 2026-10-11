import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Plus,
  Bell,
  Search,
  Car,
  AlertTriangle,
  Clock,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { formatVND, formatDate } from '../../utils/formatters';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const {
    activeTab,
    setIsCreateContractOpen,
    contracts,
    vehicles,
    maintenanceTasks,
    setActiveTab,
    setSelectedContractId,
    setSelectedVehicleId,
    settings,
    setAppMode,
    setCustomerTab
  } = useApp();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Calculate alerts
  // 1. Pending settlement contracts
  const pendingSettlements = contracts.filter((c) => c.status === 'pending_settlement');
  
  // 2. Overdue returns: contracts currently rented where endDate < now
  const now = new Date();
  const overdueContracts = contracts.filter((c) => {
    if (c.status !== 'rented') return false;
    return new Date(c.endDate) < now;
  });

  // 3. Vehicles due or overdue for maintenance
  const urgentMaintenance = maintenanceTasks.filter(
    (m) => m.status === 'overdue' || m.status === 'in_progress' || m.status === 'upcoming'
  );

  const totalAlertCount = pendingSettlements.length + overdueContracts.length + urgentMaintenance.length;

  // Title by tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tổng quan cửa hàng';
      case 'fleet':
        return 'Quản lý đội xe';
      case 'schedule':
        return 'Lịch trình cho thuê xe';
      case 'contracts':
        return 'Quản lý hợp đồng';
      case 'customers':
        return 'Danh sách khách hàng';
      case 'maintenance':
        return 'Bảo dưỡng & Sửa chữa';
      case 'finance':
        return 'Báo cáo thu chi & Hiệu quả xe';
      case 'settings':
        return 'Cấu hình cửa hàng';
      default:
        return 'DriveRent';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 no-print">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {getTabTitle()}
            </h1>
            <span className="hidden md:inline-flex text-xs px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-600">
              {settings.city}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Alert Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertOpen(!isAlertOpen)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
            title="Thông báo cảnh báo"
          >
            <Bell className="w-5 h-5" />
            {totalAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalAlertCount}
              </span>
            )}
          </button>

          {/* Alert Popover */}
          {isAlertOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsAlertOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    Trung tâm cảnh báo nghiệp vụ
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                    {totalAlertCount} việc cần xử lý
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 mt-2">
                  {/* Overdue alerts */}
                  {overdueContracts.length > 0 && (
                    <div className="py-2.5 space-y-1.5">
                      <p className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Hợp đồng quá hạn trả xe ({overdueContracts.length})
                      </p>
                      {overdueContracts.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedContractId(c.id);
                            setActiveTab('contracts');
                            setIsAlertOpen(false);
                          }}
                          className="p-2 rounded-lg bg-rose-50/60 hover:bg-rose-100/70 cursor-pointer text-xs transition-colors"
                        >
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>{c.id}</span>
                            <span className="text-rose-600">Quá hạn</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">
                            Xe: {vehicles.find((v) => v.id === c.vehicleId)?.name} · Hạn trả: {formatDate(c.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pending settlements */}
                  {pendingSettlements.length > 0 && (
                    <div className="py-2.5 space-y-1.5">
                      <p className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        Chờ quyết toán ({pendingSettlements.length})
                      </p>
                      {pendingSettlements.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedContractId(c.id);
                            setActiveTab('contracts');
                            setIsAlertOpen(false);
                          }}
                          className="p-2 rounded-lg bg-amber-50/60 hover:bg-amber-100/70 cursor-pointer text-xs transition-colors"
                        >
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>{c.id}</span>
                            <span className="text-amber-700">Đã nhận xe</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">
                            Cần tính cọc khấu trừ và chốt thu/hoàn tiền
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Maintenance alerts */}
                  {urgentMaintenance.length > 0 && (
                    <div className="py-2.5 space-y-1.5">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Bảo trì định kỳ ({urgentMaintenance.length})
                      </p>
                      {urgentMaintenance.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            setActiveTab('maintenance');
                            setIsAlertOpen(false);
                          }}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs transition-colors"
                        >
                          <div className="font-semibold text-slate-800">{m.title}</div>
                          <p className="text-slate-500 text-[11px]">
                            Xe: {vehicles.find((v) => v.id === m.vehicleId)?.name} · Dự kiến: {formatDate(m.dueDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {totalAlertCount === 0 && (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Tất cả hoạt động đều trong tầm kiểm soát!
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Switch to customer view button */}
        <button
          onClick={() => {
            setAppMode('customer');
            setCustomerTab('home');
          }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100/80 text-sky-700 hover:text-sky-900 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-sky-200"
          title="Xem trang web dành cho khách hàng đặt xe"
        >
          <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
          <span>Trang khách hàng</span>
        </button>

        {/* Highlighted Create Contract Button - Sunset Orange Accent CTA */}
        <button
          onClick={() => setIsCreateContractOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-orange-500/20 transition-all focus:outline-hidden focus:ring-2 focus:ring-orange-400/40 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tạo hợp đồng</span>
        </button>
      </div>
    </header>
  );
};
