import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RentalContract, Vehicle } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Wrench,
  AlertTriangle,
  Info,
  Car
} from 'lucide-react';
import {
  formatDate,
  formatDateTime,
  formatTimeOnly,
  getContractStatusBadge,
  getVehicleStatusBadge
} from '../utils/formatters';

export const ScheduleView: React.FC = () => {
  const {
    vehicles,
    contracts,
    maintenanceTasks,
    setSelectedContractId,
    setIsCreateContractOpen,
    setActiveTab,
    extendContract,
    showToast
  } = useApp();

  const [viewScope, setViewScope] = useState<'day' | 'week' | 'month'>('week');
  // Current anchor date (default 2026-10-09)
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-10-09T08:00:00'));

  // Quick extension modal state
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [extendingContract, setExtendingContract] = useState<RentalContract | null>(null);
  const [extensionUnits, setExtensionUnits] = useState<number>(1);

  // Navigate dates
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewScope === 'day') d.setDate(d.getDate() - 1);
    else if (viewScope === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewScope === 'day') d.setDate(d.getDate() + 1);
    else if (viewScope === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  // Generate date columns for grid
  const getTimelineDays = (): Date[] => {
    const days: Date[] = [];
    if (viewScope === 'day') {
      days.push(new Date(currentDate));
    } else if (viewScope === 'week') {
      // 7 days starting from Monday of that week
      const start = new Date(currentDate);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      start.setDate(diff);
      for (let i = 0; i < 7; i++) {
        const next = new Date(start);
        next.setDate(start.getDate() + i);
        days.push(next);
      }
    } else {
      // 14 days preview for month
      const start = new Date(currentDate);
      start.setDate(1);
      for (let i = 0; i < 15; i++) {
        const next = new Date(start);
        next.setDate(start.getDate() + i);
        days.push(next);
      }
    }
    return days;
  };

  const timelineDays = getTimelineDays();

  // Helper to check if a contract covers a given day
  const getEventsForVehicleOnDay = (vehicleId: string, day: Date) => {
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0).getTime();
    const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59).getTime();

    // 1. Rental contracts
    const matchedContracts = contracts.filter((c) => {
      if (c.vehicleId !== vehicleId) return false;
      if (c.status === 'cancelled') return false;
      const cStart = new Date(c.startDate).getTime();
      const cEnd = new Date(c.endDate).getTime();
      return (cStart <= dayEnd && cEnd >= dayStart);
    });

    // 2. Maintenance blackout
    const matchedMaintenance = maintenanceTasks.filter((m) => {
      if (m.vehicleId !== vehicleId) return false;
      if (m.status === 'completed') return false;
      const mDate = new Date(m.dueDate).getTime();
      // +/- 1 day buffer for maintenance
      return (mDate >= dayStart - 86400000 && mDate <= dayEnd + 86400000);
    });

    return { contracts: matchedContracts, maintenance: matchedMaintenance };
  };

  const handleOpenExtend = (contract: RentalContract) => {
    setExtendingContract(contract);
    setExtensionUnits(1);
    setIsExtendModalOpen(true);
  };

  const handleConfirmExtend = () => {
    if (!extendingContract) return;

    const oldEnd = new Date(extendingContract.endDate);
    const newEnd = new Date(oldEnd);
    if (extendingContract.pricingType === 'hourly') {
      newEnd.setHours(newEnd.getHours() + extensionUnits);
    } else {
      newEnd.setDate(newEnd.getDate() + extensionUnits);
    }

    const extraFee = extensionUnits * extendingContract.rate;
    const ok = extendContract(
      extendingContract.id,
      newEnd.toISOString(),
      extensionUnits,
      extraFee
    );

    if (ok) {
      setIsExtendModalOpen(false);
      setExtendingContract(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Lịch trình & Đặt xe
          </h2>
          <p className="text-sm text-slate-500">
            Sơ đồ trực quan theo từng xe, chống trùng lịch và hiển thị mốc bảo dưỡng định kỳ
          </p>
        </div>

        <button
          onClick={() => setIsCreateContractOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Đặt lịch / Tạo hợp đồng</span>
        </button>
      </div>

      {/* Timeline Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Thời gian trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1 font-bold text-sm text-slate-800 bg-slate-50 rounded-lg border border-slate-200 min-w-44 text-center">
            {viewScope === 'day' && formatDate(currentDate.toISOString())}
            {viewScope === 'week' && `Tuần: ${formatDate(timelineDays[0]?.toISOString())} - ${formatDate(timelineDays[timelineDays.length - 1]?.toISOString())}`}
            {viewScope === 'month' && `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`}
          </div>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Thời gian tới"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date('2026-10-09T08:00:00'))}
            className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-md"
          >
            Hôm nay (09/10)
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewScope('day')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              viewScope === 'day' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo ngày
          </button>
          <button
            onClick={() => setViewScope('week')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              viewScope === 'week' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo tuần
          </button>
          <button
            onClick={() => setViewScope('month')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              viewScope === 'month' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nửa tháng
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600" />
            <span>Đang thuê</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500" />
            <span>Đã xác nhận</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span>Lịch bảo trì</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3 px-3 w-56 font-bold uppercase tracking-wider border-r border-slate-200 sticky left-0 bg-slate-50 z-10">
                  Phương tiện ({vehicles.length})
                </th>
                {timelineDays.map((d, idx) => {
                  const isToday = d.toISOString().split('T')[0] === '2026-10-09';
                  return (
                    <th
                      key={idx}
                      className={`py-2 px-2 text-center min-w-28 font-bold border-r border-slate-100 ${
                        isToday ? 'bg-blue-50/70 text-blue-900 font-extrabold' : ''
                      }`}
                    >
                      <div>
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()]}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {String(d.getDate()).padStart(2, '0')}/{String(d.getMonth() + 1).padStart(2, '0')}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => {
                return (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Vehicle column */}
                    <td className="p-3 border-r border-slate-200 sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-2">
                        <img
                          src={v.image}
                          alt={v.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-900 truncate text-xs">{v.name}</p>
                          <p className="text-[10px] font-mono font-semibold text-slate-500">{v.plateNumber}</p>
                        </div>
                      </div>
                    </td>

                    {/* Timeline Day Cells */}
                    {timelineDays.map((day, dIdx) => {
                      const { contracts: dayContracts, maintenance: dayMaintenance } = getEventsForVehicleOnDay(
                        v.id,
                        day
                      );
                      const isToday = day.toISOString().split('T')[0] === '2026-10-09';

                      return (
                        <td
                          key={dIdx}
                          className={`p-1.5 align-top border-r border-slate-100 min-h-16 ${
                            isToday ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          <div className="space-y-1">
                            {/* Maintenance block */}
                            {dayMaintenance.map((m) => (
                              <div
                                key={m.id}
                                onClick={() => setActiveTab('maintenance')}
                                className="p-1 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold cursor-pointer hover:bg-amber-200 transition-colors flex items-center gap-1"
                                title={`Bảo dưỡng: ${m.title}`}
                              >
                                <Wrench className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">Bảo trì: {m.title.substring(0, 15)}...</span>
                              </div>
                            ))}

                            {/* Rental blocks */}
                            {dayContracts.map((c) => {
                              const isRented = c.status === 'rented';
                              const isConfirmed = c.status === 'confirmed';
                              const isSettlement = c.status === 'pending_settlement';
                              
                              let bg = 'bg-slate-100 text-slate-800 border-slate-200';
                              if (isRented) bg = 'bg-blue-600 text-white border-blue-700 shadow-2xs';
                              else if (isConfirmed) bg = 'bg-indigo-600 text-white border-indigo-700 shadow-2xs';
                              else if (isSettlement) bg = 'bg-amber-500 text-white border-amber-600';

                              return (
                                <div
                                  key={c.id}
                                  className={`p-1.5 rounded border text-[10px] cursor-pointer hover:opacity-90 transition-all ${bg}`}
                                >
                                  <div
                                    onClick={() => {
                                      setSelectedContractId(c.id);
                                      setActiveTab('contracts');
                                    }}
                                    className="font-bold truncate"
                                  >
                                    {c.id}
                                  </div>
                                  <div className="text-[9px] opacity-90 truncate">
                                    {formatTimeOnly(c.startDate)} - {formatTimeOnly(c.endDate)}
                                  </div>

                                  {/* Quick extend button if rented */}
                                  {isRented && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenExtend(c);
                                      }}
                                      className="mt-1 w-full text-center py-0.5 bg-white/20 hover:bg-white/30 rounded text-[9px] font-bold block"
                                    >
                                      + Gia hạn
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extend Contract Modal */}
      {isExtendModalOpen && extendingContract && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Gia hạn hợp đồng {extendingContract.id}
              </h3>
              <button
                onClick={() => setIsExtendModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p>
                <span className="text-slate-500">Xe thuê:</span>{' '}
                <strong className="text-slate-900">
                  {vehicles.find((v) => v.id === extendingContract.vehicleId)?.name}
                </strong>
              </p>
              <p>
                <span className="text-slate-500">Hạn trả hiện tại:</span>{' '}
                <strong className="text-slate-900">{formatDateTime(extendingContract.endDate)}</strong>
              </p>
              <p>
                <span className="text-slate-500">Hình thức tính:</span>{' '}
                <strong className="text-blue-700">
                  {extendingContract.pricingType === 'hourly' ? 'Thuê theo giờ' : 'Thuê theo ngày'}
                </strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số {extendingContract.pricingType === 'hourly' ? 'giờ' : 'ngày'} muốn gia hạn thêm:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={extensionUnits}
                  onChange={(e) => setExtensionUnits(Math.max(1, Number(e.target.value)))}
                  className="w-24 text-base font-bold font-mono px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                />
                <span className="text-xs text-slate-600 font-medium">
                  {extendingContract.pricingType === 'hourly' ? 'giờ' : 'ngày'} (Đơn giá: {extendingContract.rate.toLocaleString('vi-VN')} đ)
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs flex justify-between items-center">
              <span className="text-blue-900 font-medium">Phí gia hạn dự kiến:</span>
              <span className="font-mono font-extrabold text-blue-700 text-sm">
                {(extensionUnits * extendingContract.rate).toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsExtendModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmExtend}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Xác nhận gia hạn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
