import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OnlineBooking } from '../../types';
import {
  Search,
  FileText,
  Calendar,
  Clock,
  Car,
  Bike,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  RotateCcw,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { formatVND, formatDate, formatDateTime } from '../../utils/formatters';

export const LookupBookingCustomerView: React.FC = () => {
  const {
    onlineBookings,
    vehicles,
    cancelOnlineBooking,
    changeOnlineBookingDates,
    setCustomerTab,
    setAppMode,
    isLoggedIn,
    showToast,
    settings
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<OnlineBooking | null>(() => {
    return onlineBookings.length > 0 ? onlineBookings[0] : null;
  });

  // Date change state
  const [isChangingDates, setIsChangingDates] = useState(false);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  // Cancel dialog state
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Thay đổi lịch trình chuyến đi');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('Vui lòng nhập mã đặt xe (BK-xxxx) hoặc số điện thoại', 'error');
      return;
    }

    const query = searchQuery.trim().toLowerCase();
    const cleanPhone = query.replace(/\s+/g, '');

    const found = onlineBookings.find(
      (b) =>
        b.id.toLowerCase() === query ||
        b.customerPhone.replace(/\s+/g, '').includes(cleanPhone)
    );

    if (found) {
      setSelectedBooking(found);
      setIsChangingDates(false);
      setIsCancelConfirmOpen(false);
      showToast(`Đã tìm thấy đơn đặt xe ${found.id}`, 'success');
    } else {
      showToast('Không tìm thấy đơn đặt xe phù hợp với thông tin đã nhập', 'error');
    }
  };

  const handleOpenDateChange = () => {
    if (!selectedBooking) return;
    setNewStartDate(selectedBooking.startDate);
    setNewEndDate(selectedBooking.endDate);
    setIsChangingDates(true);
  };

  const handleSaveDateChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const ok = changeOnlineBookingDates(selectedBooking.id, newStartDate, newEndDate);
    if (ok) {
      // Refresh current selected booking from context
      const updated = onlineBookings.find((b) => b.id === selectedBooking.id);
      if (updated) setSelectedBooking({ ...updated, startDate: newStartDate, endDate: newEndDate });
      setIsChangingDates(false);
    }
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;

    const ok = cancelOnlineBooking(selectedBooking.id, cancelReason);
    if (ok) {
      const updated = onlineBookings.find((b) => b.id === selectedBooking.id);
      if (updated) setSelectedBooking({ ...updated, status: 'cancelled' });
      setIsCancelConfirmOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const vehicle = selectedBooking
    ? vehicles.find((v) => v.id === selectedBooking.vehicleId) || vehicles[0]
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Tra cứu thông tin
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Tra cứu đơn đặt xe trực tuyến
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Nhập mã đặt chỗ (ví dụ: <strong className="text-slate-800">BK-2026-8812</strong>) hoặc số điện thoại quý khách đã đăng ký khi đặt xe.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="pt-2 flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Nhập mã BK-xxxx hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold shadow-xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            Tra cứu
          </button>
        </form>
      </div>

      {/* Booking Details Container */}
      {selectedBooking && vehicle ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden max-w-4xl mx-auto space-y-6 p-6 sm:p-8">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mã đặt xe</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight flex items-center gap-2">
                <span>{selectedBooking.id}</span>
                {selectedBooking.status === 'confirmed' && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Đã thanh toán cọc · Đã xác nhận
                  </span>
                )}
                {selectedBooking.status === 'pending_payment' && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Chờ thanh toán cọc giữ chỗ
                  </span>
                )}
                {selectedBooking.status === 'cancelled' && (
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    Đã hủy đơn
                  </span>
                )}
                {selectedBooking.status === 'expired' && (
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    Hết hạn giữ chỗ
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ngày đặt: {formatDateTime(selectedBooking.createdAt)}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In phiếu xác nhận</span>
              </button>

              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => setIsCancelConfirmOpen(true)}
                  className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Hủy đơn & Hoàn cọc
                </button>
              )}
            </div>
          </div>

          {/* Vehicle & Rental Period Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-4 md:col-span-2">
              <div className="w-24 h-18 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  {vehicle.category}
                </span>
                <h3 className="font-extrabold text-base text-slate-900">{vehicle.name}</h3>
                <p className="text-xs text-slate-500">
                  Biển số bàn giao: {vehicle.plateNumber} · Hộp số: {vehicle.transmission}
                </p>
                <p className="text-xs text-slate-700 font-semibold">
                  Địa điểm giao nhận: {selectedBooking.pickupLocation}
                </p>
              </div>
            </div>

            <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0">
              <span className="text-xs text-slate-500 block">Thời gian thuê</span>
              <p className="text-xs font-bold text-slate-900 mt-1">
                {formatDateTime(selectedBooking.startDate)}
              </p>
              <p className="text-xs text-slate-500">đến</p>
              <p className="text-xs font-bold text-slate-900">
                {formatDateTime(selectedBooking.endDate)}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100/60 text-blue-800 text-[11px] font-bold rounded">
                Tổng cộng: {selectedBooking.units} ngày
              </span>
            </div>
          </div>

          {/* Customer & Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Thông tin người nhận xe
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Họ và tên:</span>
                  <strong className="text-slate-900">{selectedBooking.customerName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <strong className="text-slate-900">{selectedBooking.customerPhone}</strong>
                </div>
                {selectedBooking.customerEmail && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-900">{selectedBooking.customerEmail}</span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Phương thức thanh toán:</span>
                  <span className="text-slate-900 font-medium">
                    {selectedBooking.paymentMethod || 'Chuyển khoản VietQR'}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Status */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tình trạng thanh toán & Tiền cọc
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Tổng tiền thuê dự kiến:</span>
                  <strong className="text-slate-900 font-mono">
                    {formatVND(selectedBooking.totalEstimatedAmount)}
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700 font-bold bg-emerald-50/50 px-2 rounded">
                  <span>Tiền cọc giữ chỗ đã thanh toán:</span>
                  <span className="font-mono">{formatVND(selectedBooking.bookingDepositPaid)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 font-bold text-blue-700">
                  <span>Số tiền còn lại khi nhận xe:</span>
                  <span className="font-mono">{formatVND(selectedBooking.remainingAmountDue)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500 text-[11px]">
                  <span>Tiền cọc bảo đảm hợp đồng:</span>
                  <span className="font-mono">{formatVND(selectedBooking.securityDepositOnPickup)} (Nộp khi nhận xe)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Dates Section */}
          {isChangingDates ? (
            <form onSubmit={handleSaveDateChange} className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-blue-900">Yêu cầu đổi ngày giờ nhận - trả xe</h4>
                <button
                  type="button"
                  onClick={() => setIsChangingDates(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Hủy bỏ
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian nhận xe mới:</label>
                  <input
                    type="datetime-local"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian trả xe mới:</label>
                  <input
                    type="datetime-local"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingDates(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-white"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  Lưu thay đổi lịch xe
                </button>
              </div>
            </form>
          ) : (
            selectedBooking.status === 'confirmed' && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <span className="text-slate-600">
                  Cần điều chỉnh giờ nhận xe do chuyến bay thay đổi?
                </span>
                <button
                  type="button"
                  onClick={handleOpenDateChange}
                  className="px-4 py-2 bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 text-slate-800 font-bold rounded-xl shadow-2xs transition-colors"
                >
                  Yêu cầu đổi lịch nhận xe
                </button>
              </div>
            )
          )}

          {/* Cancel Confirmation Dialog */}
          {isCancelConfirmOpen && (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-3">
              <div className="flex items-start gap-2.5 text-red-900">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm">Xác nhận hủy đơn đặt xe & Hoàn tiền cọc giữ chỗ</h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    Theo chính sách, hủy trước 24 giờ so với giờ hẹn nhận xe sẽ được hoàn trả 100% tiền cọc giữ chỗ ({formatVND(selectedBooking.bookingDepositPaid)}).
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lý do hủy đơn:</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsCancelConfirmOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-white"
                >
                  Không, giữ nguyên đơn
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  Xác nhận hủy đơn ngay
                </button>
              </div>
            </div>
          )}

          {/* Connected Admin Portal shortcut */}
          {isLoggedIn && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
              <div>
                <p className="font-bold">Đã liên thông Hệ thống Quản trị nội bộ DriveRent</p>
                <p className="text-[11px] text-emerald-700">
                  Hợp đồng tương ứng: <strong>{selectedBooking.contractId || 'Đã tạo'}</strong> · Bạn có thể quản lý hợp đồng này ngay trong phân hệ Hợp đồng.
                </p>
              </div>
              <button
                onClick={() => {
                  setAppMode('admin');
                  setCustomerTab('home');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Mở trong Quản trị
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 text-xs">
          Vui lòng nhập mã đơn hoặc số điện thoại phía trên để tra cứu.
        </div>
      )}
    </div>
  );
};
