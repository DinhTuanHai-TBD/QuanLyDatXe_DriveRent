import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RentalContract, ContractStatus } from '../types';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Printer,
  Car,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Ban,
  Receipt,
  X,
  ChevronRight
} from 'lucide-react';
import {
  formatVND,
  formatDate,
  formatDateTime,
  getContractStatusBadge
} from '../utils/formatters';

export const ContractsView: React.FC = () => {
  const {
    contracts,
    vehicles,
    customers,
    selectedContractId,
    setSelectedContractId,
    setIsCreateContractOpen,
    setIsHandoverModalOpen,
    setIsReturnModalOpen,
    setIsSettlementModalOpen,
    setIsPrintContractOpen,
    setActiveContractForAction,
    cancelContract
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContractStatus>('all');
  const [dateFilter, setDateFilter] = useState('');

  // Cancel reason state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Khách đổi kế hoạch chuyến đi');

  // Filter contracts
  const filteredContracts = contracts.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    const cust = customers.find((cu) => cu.id === c.customerId);
    const veh = vehicles.find((v) => v.id === c.vehicleId);

    if (term) {
      const matchId = c.id.toLowerCase().includes(term);
      const matchCust = cust?.fullName.toLowerCase().includes(term) || cust?.phone.includes(term);
      const matchVeh = veh?.name.toLowerCase().includes(term) || veh?.plateNumber.toLowerCase().includes(term);
      if (!matchId && !matchCust && !matchVeh) return false;
    }

    if (statusFilter !== 'all' && c.status !== statusFilter) return false;

    if (dateFilter) {
      if (!c.startDate.startsWith(dateFilter) && !c.endDate.startsWith(dateFilter)) return false;
    }

    return true;
  });

  const selectedContract = contracts.find((c) => c.id === selectedContractId);
  const selectedVehicle = selectedContract ? vehicles.find((v) => v.id === selectedContract.vehicleId) : null;
  const selectedCustomer = selectedContract ? customers.find((c) => c.id === selectedContract.customerId) : null;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hợp đồng cho thuê</h2>
          <p className="text-sm text-slate-500">
            Quản lý quy trình thuê xe khép kín từ lập hợp đồng, giao nhận đến quyết toán
          </p>
        </div>

        <button
          onClick={() => setIsCreateContractOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl shadow-sm shadow-orange-500/20 text-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tạo hợp đồng</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã HĐ, tên khách hàng, số điện thoại, biển số xe..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shrink-0 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái ({contracts.length})</option>
            <option value="draft">Nháp ({contracts.filter((c) => c.status === 'draft').length})</option>
            <option value="confirmed">Đã xác nhận ({contracts.filter((c) => c.status === 'confirmed').length})</option>
            <option value="rented">Đang thuê ({contracts.filter((c) => c.status === 'rented').length})</option>
            <option value="pending_settlement">Chờ quyết toán ({contracts.filter((c) => c.status === 'pending_settlement').length})</option>
            <option value="completed">Hoàn tất ({contracts.filter((c) => c.status === 'completed').length})</option>
            <option value="cancelled">Đã hủy ({contracts.filter((c) => c.status === 'cancelled').length})</option>
          </select>

          {/* Date filter */}
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-rose-600 font-semibold hover:underline"
              >
                Xóa ngày
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mã Hợp đồng</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Phương tiện</th>
                <th className="py-3 px-4">Thời gian thuê</th>
                <th className="py-3 px-4 text-right">Tổng tiền dịch vụ</th>
                <th className="py-3 px-4 text-right">Tiền cọc</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((c) => {
                const vehicle = vehicles.find((v) => v.id === c.vehicleId);
                const customer = customers.find((cu) => cu.id === c.customerId);
                const badge = getContractStatusBadge(c.status);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Contract ID */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{c.id}</span>
                      <span className="text-[10px] text-slate-400">{formatDate(c.createdAt)}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{customer?.fullName || 'Khách vãng lai'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{customer?.phone}</p>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{vehicle?.name}</p>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {vehicle?.plateNumber}
                      </span>
                    </td>

                    {/* Period */}
                    <td className="py-3 px-4 text-slate-600">
                      <div>
                        {formatDateTime(c.startDate)} → {formatDateTime(c.endDate)}
                      </div>
                      <span className="text-[10px] text-sky-700 font-medium">
                        {c.units} {c.pricingType === 'hourly' ? 'giờ' : 'ngày'}
                      </span>
                    </td>

                    {/* Service Fee */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatVND(c.finalSettlement ? c.finalSettlement.totalServiceFee : c.totalServiceFee)}
                    </td>

                    {/* Deposit */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-indigo-700 text-xs">
                      {formatVND(c.deposit)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${badge.bg} ${badge.textCol} ${badge.border}`}
                      >
                        {badge.text}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedContractId(c.id)}
                          className="px-2.5 py-1 text-xs font-bold text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Detail Modal with Actions */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md border border-sky-200">
                  {selectedContract.id}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">Chi tiết hợp đồng cho thuê</h3>
                {(() => {
                  const b = getContractStatusBadge(selectedContract.status);
                  return (
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${b.bg} ${b.textCol} ${b.border}`}>
                      {b.text}
                    </span>
                  );
                })()}
              </div>
              <button
                onClick={() => setSelectedContractId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 text-xs flex-1">
              {/* Vehicle & Customer Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Phương tiện thuê
                  </span>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedVehicle?.image}
                      alt={selectedVehicle?.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{selectedVehicle?.name}</p>
                      <p className="font-mono font-bold text-xs text-sky-700">{selectedVehicle?.plateNumber}</p>
                      <p className="text-[11px] text-slate-500">{selectedVehicle?.category} · Đời {selectedVehicle?.year}</p>
                    </div>
                  </div>
                </div>

                {/* Customer */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Khách hàng
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">{selectedCustomer?.fullName}</p>
                    <p className="text-slate-600 font-mono">{selectedCustomer?.phone}</p>
                    <p className="text-slate-500 text-[11px] mt-1">CCCD: {selectedCustomer?.identityNumber}</p>
                    <p className="text-slate-500 text-[11px]">Nơi ở: {selectedCustomer?.address}</p>
                  </div>
                </div>
              </div>

              {/* Rental Timeline */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Thời hạn & Hình thức tính cước
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block">Bắt đầu:</span>
                    <strong className="text-slate-900">{formatDateTime(selectedContract.startDate)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Kết thúc dự kiến:</span>
                    <strong className="text-slate-900">{formatDateTime(selectedContract.endDate)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gói & Số lượng:</span>
                    <strong className="text-blue-700">
                      {selectedContract.units} {selectedContract.pricingType === 'hourly' ? 'giờ' : 'ngày'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Handover inspection info if exists */}
              {selectedContract.handoverRecord && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 uppercase">
                      Biên bản bàn giao xe (Lúc giao)
                    </span>
                    <span className="text-[11px] text-blue-700">
                      Giao bởi: {selectedContract.handoverRecord.performedBy}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block">Giờ giao thực tế:</span>
                      <strong>{formatDateTime(selectedContract.handoverRecord.actualTime)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Số km (Odo):</span>
                      <strong className="font-mono">{selectedContract.handoverRecord.odometer.toLocaleString('vi-VN')} km</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nhiên liệu:</span>
                      <strong>{selectedContract.handoverRecord.fuelLevel}/8 vạch</strong>
                    </div>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    <strong>Ghi chú:</strong> {selectedContract.handoverRecord.notes || 'Bình thường'}
                  </p>
                </div>
              )}

              {/* Return inspection info if exists */}
              {selectedContract.returnRecord && (
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 uppercase">
                      Biên bản nhận trả xe (Lúc nhận)
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Nhận bởi: {selectedContract.returnRecord.performedBy}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block">Giờ nhận thực tế:</span>
                      <strong>{formatDateTime(selectedContract.returnRecord.actualTime)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Số km (Odo):</span>
                      <strong className="font-mono">{selectedContract.returnRecord.odometer.toLocaleString('vi-VN')} km</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nhiên liệu hoàn trả:</span>
                      <strong>{selectedContract.returnRecord.fuelLevel}/8 vạch</strong>
                    </div>
                  </div>
                  {selectedContract.returnRecord.damageFee > 0 && (
                    <p className="text-rose-700 font-bold text-[11px]">
                      Phạt hư hại / hụt xăng: {formatVND(selectedContract.returnRecord.damageFee)} ({selectedContract.returnRecord.damageNotes})
                    </p>
                  )}
                </div>
              )}

              {/* Financial Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Bảng kê chi phí & Tiền cọc
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tiền thuê cơ bản:</span>
                    <span className="font-mono font-bold text-slate-900">{formatVND(selectedContract.baseRentalFee)}</span>
                  </div>
                  {selectedContract.surcharges.map((s) => (
                    <div key={s.id} className="flex justify-between text-slate-600">
                      <span>+ {s.reason}:</span>
                      <span className="font-mono">+{formatVND(s.amount)}</span>
                    </div>
                  ))}
                  {selectedContract.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>- Chiết khấu:</span>
                      <span className="font-mono">-{formatVND(selectedContract.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-extrabold text-sm">
                    <span>Tổng tiền dịch vụ:</span>
                    <span className="font-mono text-blue-700 text-base">{formatVND(selectedContract.totalServiceFee)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-indigo-200 text-indigo-900 font-bold bg-indigo-50/70 p-2 rounded-lg">
                    <span>TIỀN CỌC ĐẢM BẢO (TÁCH RIÊNG):</span>
                    <span className="font-mono text-sm">{formatVND(selectedContract.deposit)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar Depending on Status (Requirement!) */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50 sticky bottom-0">
              <div className="flex items-center gap-2">
                {/* Print button always available */}
                <button
                  onClick={() => setIsPrintContractOpen(true)}
                  className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In hợp đồng</span>
                </button>

                {/* Cancel action if not completed or cancelled */}
                {selectedContract.status !== 'completed' && selectedContract.status !== 'cancelled' && (
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    Hủy hợp đồng
                  </button>
                )}
              </div>

              {/* Main Workflow Buttons */}
              <div className="flex items-center gap-2">
                {/* Status: Confirmed -> Giao xe */}
                {selectedContract.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      setActiveContractForAction(selectedContract);
                      setIsHandoverModalOpen(true);
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow-sm shadow-orange-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tiến hành giao xe</span>
                  </button>
                )}

                {/* Status: Rented -> Nhận xe */}
                {selectedContract.status === 'rented' && (
                  <button
                    onClick={() => {
                      setActiveContractForAction(selectedContract);
                      setIsReturnModalOpen(true);
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-sm shadow-sky-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Nhận trả xe</span>
                  </button>
                )}

                {/* Status: Pending Settlement -> Quyết toán */}
                {selectedContract.status === 'pending_settlement' && (
                  <button
                    onClick={() => {
                      setActiveContractForAction(selectedContract);
                      setIsSettlementModalOpen(true);
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow-sm shadow-orange-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Quyết toán & Hoàn cọc</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedContractId(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedContract && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <h4 className="font-extrabold text-base text-rose-600 flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Xác nhận hủy hợp đồng {selectedContract.id}?
            </h4>
            <p className="text-xs text-slate-600">
              Khi hủy hợp đồng, xe sẽ tự động được giải phóng về trạng thái <strong>Sẵn sàng</strong> nếu chưa bàn giao.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lý do hủy hợp đồng *</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Không hủy
              </button>
              <button
                onClick={() => {
                  cancelContract(selectedContract.id, cancelReason);
                  setIsCancelModalOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Đồng ý hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
