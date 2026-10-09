import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Car,
  CheckCircle,
  Clock,
  Wrench,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Calendar,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileText,
  User
} from 'lucide-react';
import {
  formatVND,
  formatDate,
  formatDateTime,
  formatTimeOnly,
  getVehicleStatusBadge,
  getContractStatusBadge
} from '../utils/formatters';

export const DashboardView: React.FC = () => {
  const {
    vehicles,
    contracts,
    maintenanceTasks,
    setIsCreateContractOpen,
    setActiveTab,
    setSelectedContractId,
    setSelectedVehicleId,
    setIsHandoverModalOpen,
    setIsReturnModalOpen,
    setIsSettlementModalOpen,
    setActiveContractForAction
  } = useApp();

  // Metrics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.status === 'available').length;
  const rentedVehicles = vehicles.filter((v) => v.status === 'rented').length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'maintenance').length;

  // Financial Summary
  // 1. Tiền thuê dịch vụ (tổng tiền thuê của các hợp đồng không bị hủy)
  const nonCancelledContracts = contracts.filter((c) => c.status !== 'cancelled');
  const totalRentalRevenue = nonCancelledContracts.reduce((sum, c) => {
    return sum + (c.finalSettlement ? c.finalSettlement.totalServiceFee : c.totalServiceFee);
  }, 0);

  // 2. Khoản đã thu thực tế từ khách
  const totalCollected = nonCancelledContracts.reduce((sum, c) => {
    if (c.finalSettlement) {
      // Khi đã quyết toán: tiền dịch vụ thực tế đã được thanh toán
      return sum + c.finalSettlement.totalServiceFee;
    }
    return sum + c.amountPaid;
  }, 0);

  // 3. Tiền cọc đang giữ (chỉ của các hợp đồng đang thuê hoặc đã xác nhận hoặc chờ quyết toán)
  const heldDeposits = contracts
    .filter((c) => c.status === 'rented' || c.status === 'confirmed' || c.status === 'pending_settlement')
    .reduce((sum, c) => sum + (c.deposit || 0), 0);

  // 4. Công nợ (khoản chưa thanh toán của các hợp đồng đang hoạt động/chờ quyết toán)
  const totalReceivables = nonCancelledContracts
    .filter((c) => c.status !== 'completed')
    .reduce((sum, c) => {
      const remaining = c.totalServiceFee - c.amountPaid;
      return sum + Math.max(0, remaining);
    }, 0);

  // Today's schedule (pickups & returns scheduled for today)
  // Simulation: using current date or 2026-10-09
  const todayStr = '2026-10-09';
  const todayPickups = contracts.filter((c) => {
    const isToday = c.startDate.startsWith(todayStr);
    return isToday && (c.status === 'confirmed' || c.status === 'draft');
  });

  const todayReturns = contracts.filter((c) => {
    const isToday = c.endDate.startsWith(todayStr);
    return isToday && c.status === 'rented';
  });

  // Overdue contracts (rented contracts past endDate)
  const now = new Date();
  const overdueContracts = contracts.filter((c) => {
    if (c.status !== 'rented') return false;
    return new Date(c.endDate) < now;
  });

  // Upcoming / Overdue maintenance
  const urgentMaintenanceTasks = maintenanceTasks.filter(
    (m) => m.status === 'overdue' || m.status === 'in_progress'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tổng quan cửa hàng</h2>
          <p className="text-sm text-slate-500">
            Cập nhật tình hình xe, lịch giao nhận hôm nay và luồng tài chính
          </p>
        </div>

        <button
          onClick={() => setIsCreateContractOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Tạo hợp đồng</span>
        </button>
      </div>

      {/* Fleet Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div
          onClick={() => setActiveTab('fleet')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Tổng số xe</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalVehicles}
            </span>
            <span className="text-xs font-semibold text-slate-600">xe đang quản lý</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Bao gồm {vehicles.filter((v) => v.type === 'car').length} ô tô & {vehicles.filter((v) => v.type === 'motorbike').length} xe máy
          </div>
        </div>

        {/* Available */}
        <div
          onClick={() => setActiveTab('fleet')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200/80 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Sẵn sàng</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-200 transition-colors">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {availableVehicles}
            </span>
            <span className="text-xs font-semibold text-emerald-800">
              ({Math.round((availableVehicles / totalVehicles) * 100)}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            Có thể ký hợp đồng & giao khách ngay
          </div>
        </div>

        {/* Rented */}
        <div
          onClick={() => setActiveTab('fleet')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-blue-200/80 shadow-2xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Đang cho thuê</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-200 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700 font-mono tabular-nums">
              {rentedVehicles}
            </span>
            <span className="text-xs font-semibold text-blue-800">
              ({Math.round((rentedVehicles / totalVehicles) * 100)}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-blue-700 font-medium">
            Khách đang lưu hành trên đường
          </div>
        </div>

        {/* Maintenance */}
        <div
          onClick={() => setActiveTab('maintenance')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Đang bảo dưỡng</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 group-hover:bg-amber-200 transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
              {maintenanceVehicles}
            </span>
            <span className="text-xs font-semibold text-amber-800">
              ({Math.round((maintenanceVehicles / totalVehicles) * 100)}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium">
            Tại xưởng kiểm tra kỹ thuật
          </div>
        </div>
      </div>

      {/* Financial Summary Strip (Deposit Isolated!) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Tóm tắt luồng tài chính
            </h3>
            <p className="text-xs text-slate-500">
              Tiền cọc giữ riêng, không tính lẫn vào doanh thu thuê
            </p>
          </div>
          <button
            onClick={() => setActiveTab('finance')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Chi tiết thu chi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          {/* Rental fee */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Tiền thuê dịch vụ
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tabular-nums">
              {formatVND(totalRentalRevenue)}
            </p>
            <span className="text-[11px] text-slate-500">Tổng giá trị hợp đồng</span>
          </div>

          {/* Collected */}
          <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Khoản đã thu
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {formatVND(totalCollected)}
            </p>
            <span className="text-[11px] text-emerald-800">Tiền thuê đã nhận thực tế</span>
          </div>

          {/* Deposit Held (Isolated!) */}
          <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                Tiền cọc đang giữ
              </span>
              <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-1.5 py-0.2 rounded">
                Tách riêng
              </span>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-indigo-700 font-mono tabular-nums">
              {formatVND(heldDeposits)}
            </p>
            <span className="text-[11px] text-indigo-700">Tài sản đảm bảo của khách</span>
          </div>

          {/* Receivables */}
          <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-100">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Công nợ cần thu
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-amber-700 font-mono tabular-nums">
              {formatVND(totalReceivables)}
            </p>
            <span className="text-[11px] text-amber-800">Khoản thu khi trả xe</span>
          </div>
        </div>
      </div>

      {/* Operational Schedule & Critical Alerts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Pickups and Returns (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Pickups */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Lịch giao xe hôm nay ({todayPickups.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Hôm nay: {formatDate(todayStr)}</span>
            </div>

            {todayPickups.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Không có lịch giao xe mới trong hôm nay.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayPickups.map((c) => {
                  const vehicle = vehicles.find((v) => v.id === c.vehicleId);
                  return (
                    <div key={c.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={vehicle?.image}
                            alt={vehicle?.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{vehicle?.name}</span>
                            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                              {vehicle?.plateNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Giờ giao: <span className="font-bold text-slate-700">{formatTimeOnly(c.startDate)}</span> · HĐ: {c.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveContractForAction(c);
                            setIsHandoverModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
                        >
                          Bàn giao xe
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContractId(c.id);
                            setActiveTab('contracts');
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Today Returns */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Lịch nhận trả xe hôm nay ({todayReturns.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Khách hoàn trả phương tiện</span>
            </div>

            {todayReturns.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Không có lịch nhận xe đến hạn hôm nay.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayReturns.map((c) => {
                  const vehicle = vehicles.find((v) => v.id === c.vehicleId);
                  return (
                    <div key={c.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={vehicle?.image}
                            alt={vehicle?.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{vehicle?.name}</span>
                            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                              {vehicle?.plateNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Hẹn trả lúc: <span className="font-bold text-emerald-700">{formatTimeOnly(c.endDate)}</span> · HĐ: {c.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveContractForAction(c);
                            setIsReturnModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                        >
                          Nhận xe
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContractId(c.id);
                            setActiveTab('contracts');
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Operational Alerts & Warnings (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Cảnh báo cần giải quyết
            </h3>

            <div className="space-y-3 mt-3">
              {/* Overdue alert */}
              {overdueContracts.length > 0 && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      Hợp đồng quá hạn ({overdueContracts.length})
                    </span>
                    <button
                      onClick={() => setActiveTab('contracts')}
                      className="text-[11px] font-bold text-rose-700 underline"
                    >
                      Xử lý
                    </button>
                  </div>
                  <p className="text-xs text-rose-900 mt-1">
                    Khách chưa hoàn trả xe đúng cam kết. Cần liên hệ nhắc nhở hoặc tính phí gia hạn.
                  </p>
                </div>
              )}

              {/* Maintenance alerts */}
              {urgentMaintenanceTasks.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      Bảo dưỡng & Sửa chữa ({urgentMaintenanceTasks.length})
                    </span>
                    <button
                      onClick={() => setActiveTab('maintenance')}
                      className="text-[11px] font-bold text-amber-800 underline"
                    >
                      Xem xưởng
                    </button>
                  </div>
                  <p className="text-xs text-amber-900 mt-1">
                    Xe đang ở xưởng sửa chữa hoặc đã đến số km cần thay dầu/lốp.
                  </p>
                </div>
              )}

              {/* Unsettled contracts */}
              {contracts.filter((c) => c.status === 'pending_settlement').length > 0 && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Chờ quyết toán cọc ({contracts.filter((c) => c.status === 'pending_settlement').length})
                    </span>
                    <button
                      onClick={() => setActiveTab('contracts')}
                      className="text-[11px] font-bold text-blue-700 underline"
                    >
                      Quyết toán
                    </button>
                  </div>
                  <p className="text-xs text-blue-900 mt-1">
                    Xe đã nhận lại về bãi, cần đối chiếu hư hỏng và hoàn cọc cho khách.
                  </p>
                </div>
              )}

              {overdueContracts.length === 0 &&
                urgentMaintenanceTasks.length === 0 &&
                contracts.filter((c) => c.status === 'pending_settlement').length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Không có cảnh báo phát sinh nào.
                  </div>
                )}
            </div>
          </div>

          {/* Quick Fleet Grid Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Sơ đồ nhanh đội xe</h3>
              <button
                onClick={() => setActiveTab('fleet')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Tất cả
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {vehicles.slice(0, 9).map((v) => {
                const badge = getVehicleStatusBadge(v.status);
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicleId(v.id);
                      setActiveTab('fleet');
                    }}
                    className={`p-2 rounded-lg border text-center cursor-pointer transition-all hover:scale-102 ${badge.bg} ${badge.border}`}
                    title={`${v.name} (${v.plateNumber}) - ${badge.text}`}
                  >
                    <p className="text-[11px] font-bold text-slate-900 truncate">{v.name.split(' ')[0]} {v.name.split(' ')[1] || ''}</p>
                    <p className="text-[10px] font-mono text-slate-600 truncate">{v.plateNumber}</p>
                    <span className={`inline-block mt-1 text-[9px] font-bold px-1 rounded ${badge.textCol}`}>
                      {badge.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
