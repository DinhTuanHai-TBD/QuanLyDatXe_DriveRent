import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Car,
  PieChart,
  BarChart3,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { formatVND, formatDate } from '../utils/formatters';

export const FinanceReportView: React.FC = () => {
  const { contracts, vehicles, maintenanceTasks, showToast } = useApp();

  const [startDateFilter, setStartDateFilter] = useState('2026-10-01');
  const [endDateFilter, setEndDateFilter] = useState('2026-10-31');

  // Filtered contracts in range
  const rangeContracts = contracts.filter((c) => {
    if (c.status === 'cancelled') return false;
    const cDate = c.startDate.split('T')[0];
    return cDate >= startDateFilter && cDate <= endDateFilter;
  });

  // Filtered maintenance tasks in range
  const rangeMaintenance = maintenanceTasks.filter((m) => {
    const mDate = m.dueDate;
    return mDate >= startDateFilter && mDate <= endDateFilter;
  });

  // 1. Tiền thuê dịch vụ (Tổng giá trị hợp đồng trong kỳ)
  const totalRentalRevenue = rangeContracts.reduce((sum, c) => {
    return sum + (c.finalSettlement ? c.finalSettlement.totalServiceFee : c.totalServiceFee);
  }, 0);

  // 2. Khoản đã thu thực tế
  const totalCollected = rangeContracts.reduce((sum, c) => {
    if (c.finalSettlement) return sum + c.finalSettlement.totalServiceFee;
    return sum + c.amountPaid;
  }, 0);

  // 3. Công nợ cần thu
  const totalReceivables = rangeContracts
    .filter((c) => c.status !== 'completed')
    .reduce((sum, c) => sum + Math.max(0, c.totalServiceFee - c.amountPaid), 0);

  // 4. Tiền cọc đang giữ (Tách biệt hoàn toàn!)
  const heldDeposits = contracts
    .filter((c) => c.status === 'rented' || c.status === 'confirmed' || c.status === 'pending_settlement')
    .reduce((sum, c) => sum + (c.deposit || 0), 0);

  // 5. Chi phí bảo dưỡng kỹ thuật
  const totalMaintenanceCost = rangeMaintenance.reduce((sum, m) => sum + m.cost, 0);

  // 6. Chênh lệch thu dịch vụ trừ chi phí kỹ thuật (Không gọi là lợi nhuận ròng doanh nghiệp!)
  const operationalSpread = totalCollected - totalMaintenanceCost;

  // Per vehicle efficiency analytics
  const vehicleStats = vehicles.map((v) => {
    const vehContracts = rangeContracts.filter((c) => c.vehicleId === v.id);
    const revenue = vehContracts.reduce((sum, c) => {
      return sum + (c.finalSettlement ? c.finalSettlement.totalServiceFee : c.totalServiceFee);
    }, 0);
    const trips = vehContracts.length;
    const maintCost = rangeMaintenance
      .filter((m) => m.vehicleId === v.id)
      .reduce((sum, m) => sum + m.cost, 0);
    const netContribution = revenue - maintCost;

    return {
      vehicle: v,
      revenue,
      trips,
      maintCost,
      netContribution
    };
  });

  // Sort by revenue descending
  vehicleStats.sort((a, b) => b.revenue - a.revenue);

  // Fleet Utilization rate simulation
  const rentedNow = vehicles.filter((v) => v.status === 'rented').length;
  const utilizationRate = Math.round((rentedNow / vehicles.length) * 100);

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Tên xe,Biển số,Loại xe,Số lượt thuê,Tiền thuê dịch vụ,Chi phí bảo dưỡng,Đóng góp thu chi\n';
    const rows = vehicleStats
      .map(
        (s) =>
          `"${s.vehicle.name}","${s.vehicle.plateNumber}","${s.vehicle.category}",${s.trips},${s.revenue},${s.maintCost},${s.netContribution}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DriveRent_BaoCaoHieuQua_${startDateFilter}_${endDateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Đã xuất dữ liệu hiệu quả đội xe ra file CSV thành công!', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Thu chi & Hiệu quả đội xe
          </h2>
          <p className="text-sm text-slate-500">
            Báo cáo dòng tiền dịch vụ, chi phí bảo trì và tỷ lệ khai thác xe (Nha Trang)
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm text-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Xuất bảng dữ liệu (CSV)</span>
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-700">Khoảng thời gian báo cáo:</span>
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
          />
          <span>đến</span>
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setStartDateFilter('2026-10-01');
              setEndDateFilter('2026-10-31');
            }}
            className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded font-semibold"
          >
            Tháng này
          </button>
          <button
            onClick={() => {
              setStartDateFilter('2026-07-01');
              setEndDateFilter('2026-09-30');
            }}
            className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded font-semibold"
          >
            Quý trước
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards (Strictly no "lợi nhuận" label for gross rental fee!) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Rental Fee */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tiền thuê dịch vụ
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
            {formatVND(totalRentalRevenue)}
          </p>
          <span className="text-[11px] text-slate-500">Giá trị hợp đồng trong kỳ</span>
        </div>

        {/* Collected */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Khoản đã thu
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-700 font-mono">
            {formatVND(totalCollected)}
          </p>
          <span className="text-[11px] text-emerald-700">Dòng tiền thuê thực nhận</span>
        </div>

        {/* Receivables */}
        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
            Công nợ chưa thu
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-amber-700 font-mono">
            {formatVND(totalReceivables)}
          </p>
          <span className="text-[11px] text-amber-800">Khoản thu khi trả xe</span>
        </div>

        {/* Held Deposits (Isolated!) */}
        <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-2xs">
          <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">
            Tiền cọc đang giữ
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-indigo-700 font-mono">
            {formatVND(heldDeposits)}
          </p>
          <span className="text-[11px] text-indigo-700">Khoản cọc tách riêng</span>
        </div>

        {/* Maintenance Cost */}
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block mb-1">
            Chi phí bảo trì
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-rose-700 font-mono">
            {formatVND(totalMaintenanceCost)}
          </p>
          <span className="text-[11px] text-rose-800">Vật tư & tiền công thợ</span>
        </div>
      </div>

      {/* Visual Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Biểu đồ phân bổ tiền thuê theo loại phương tiện
              </h3>
              <p className="text-xs text-slate-500">So sánh hiệu quả giữa xe ô tô tự lái và xe máy du lịch</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700">
              Tổng: {formatVND(totalRentalRevenue)}
            </span>
          </div>

          {/* Graphical Bars */}
          <div className="space-y-4 pt-2">
            {(() => {
              const carRevenue = vehicleStats
                .filter((s) => s.vehicle.type === 'car')
                .reduce((sum, s) => sum + s.revenue, 0);
              const bikeRevenue = vehicleStats
                .filter((s) => s.vehicle.type === 'motorbike')
                .reduce((sum, s) => sum + s.revenue, 0);
              const maxRev = Math.max(carRevenue, bikeRevenue, 1);

              return (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-800">Ô tô tự lái ({vehicles.filter((v) => v.type === 'car').length} xe)</span>
                      <span className="font-mono text-blue-700 font-bold">{formatVND(carRevenue)}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${(carRevenue / maxRev) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-800">Xe máy du lịch ({vehicles.filter((v) => v.type === 'motorbike').length} xe)</span>
                      <span className="font-mono text-emerald-700 font-bold">{formatVND(bikeRevenue)}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${(bikeRevenue / maxRev) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Fleet Utilization Rate (1 col) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Tỷ lệ khai thác xe hiện tại
            </h3>
            <div className="text-center py-6">
              <span className="text-5xl font-black text-blue-600 font-mono tracking-tight">
                {utilizationRate}%
              </span>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {rentedNow} / {vehicles.length} xe đang cho thuê
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
            <p>• Sẵn sàng phục vụ: <strong>{vehicles.filter((v) => v.status === 'available').length} xe</strong></p>
            <p>• Đang bảo dưỡng: <strong>{vehicles.filter((v) => v.status === 'maintenance').length} xe</strong></p>
          </div>
        </div>
      </div>

      {/* Per-Vehicle Performance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            Bảng hiệu quả kinh doanh từng xe trong kỳ
          </h3>
          <span className="text-xs text-slate-500">Sắp xếp theo doanh thu tiền thuê giảm dần</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Phương tiện</th>
                <th className="py-3 px-4">Biển số</th>
                <th className="py-3 px-4">Loại xe</th>
                <th className="py-3 px-4 text-center">Lượt thuê</th>
                <th className="py-3 px-4 text-right">Tiền thuê dịch vụ</th>
                <th className="py-3 px-4 text-right">Chi phí bảo trì</th>
                <th className="py-3 px-4 text-right">Đóng góp thu chi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicleStats.map((item) => (
                <tr key={item.vehicle.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.vehicle.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      {item.vehicle.plateNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {item.vehicle.category}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {item.trips} lượt
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatVND(item.revenue)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700 font-semibold">
                    {formatVND(item.maintCost)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-blue-700 text-sm">
                    {formatVND(item.netContribution)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
