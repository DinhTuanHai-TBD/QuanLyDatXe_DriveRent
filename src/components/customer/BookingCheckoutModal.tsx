import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Bike,
  ShieldCheck,
  Copy,
  Printer,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { formatVND, formatDate, formatDateTime } from '../../utils/formatters';

export const BookingCheckoutModal: React.FC = () => {
  const {
    activeCheckoutBooking,
    setActiveCheckoutBooking,
    vehicles,
    verifyOnlineBookingPayment,
    cancelOnlineBooking,
    settings,
    setCustomerTab,
    setAppMode,
    isLoggedIn,
    showToast
  } = useApp();

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Payment states
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Sync state when active checkout booking changes
  useEffect(() => {
    if (activeCheckoutBooking) {
      setStep('info');
      setCustomerName(activeCheckoutBooking.customerName || '');
      setCustomerPhone(activeCheckoutBooking.customerPhone || '');
      setCustomerEmail(activeCheckoutBooking.customerEmail || '');
      setSpecificAddress(activeCheckoutBooking.pickupLocation || '');
      setNotes(activeCheckoutBooking.notes || '');
      setTimeLeft(600);
      setConfirmedBookingId(null);
    }
  }, [activeCheckoutBooking?.id]);

  // Countdown timer for 10 minutes hold
  useEffect(() => {
    if (!activeCheckoutBooking || step === 'success') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCheckoutBooking, step]);

  if (!activeCheckoutBooking) return null;

  const vehicle = vehicles.find((v) => v.id === activeCheckoutBooking.vehicleId) || vehicles[0];

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (step === 'payment') {
      if (confirm('Bạn có chắc chắn muốn thoát? Đơn đặt giữ chỗ của bạn sẽ được lưu tạm trong 10 phút.')) {
        setActiveCheckoutBooking(null);
      }
    } else {
      setActiveCheckoutBooking(null);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Vui lòng nhập họ và tên của bạn', 'error');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      showToast('Vui lòng nhập số điện thoại hợp lệ để nhận tin nhắn xác nhận', 'error');
      return;
    }
    if (!agreedTerms) {
      showToast('Vui lòng xác nhận đồng ý với điều khoản thuê xe', 'error');
      return;
    }

    // Update active booking details
    activeCheckoutBooking.customerName = customerName;
    activeCheckoutBooking.customerPhone = customerPhone;
    activeCheckoutBooking.customerEmail = customerEmail;
    activeCheckoutBooking.pickupLocation = specificAddress || activeCheckoutBooking.pickupLocation;
    activeCheckoutBooking.notes = notes;

    setStep('payment');
  };

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const success = verifyOnlineBookingPayment(
        activeCheckoutBooking.id,
        'Chuyển khoản VietQR (Cổng trực tuyến)'
      );
      setIsProcessingPayment(false);
      if (success) {
        setConfirmedBookingId(activeCheckoutBooking.id);
        setStep('success');
      }
    }, 800);
  };

  const handleCancelBooking = () => {
    if (confirm('Bạn có chắc chắn muốn hủy giữ chỗ đơn đặt xe này?')) {
      cancelOnlineBooking(activeCheckoutBooking.id, 'Khách hàng chủ động hủy tại cổng thanh toán');
      setActiveCheckoutBooking(null);
      showToast('Đã hủy đơn giữ chỗ xe', 'info');
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label}`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white/90 backdrop-blur-3xl rounded-3xl max-w-2xl w-full border border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,1)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/60 flex items-center justify-between bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {step === 'info' && 'Thông tin đặt xe & Giữ chỗ'}
                  {step === 'payment' && 'Thanh toán cọc giữ chỗ trực tuyến'}
                  {step === 'success' && 'Đặt xe & Giữ chỗ thành công!'}
                </h3>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 backdrop-blur-xs">
                  {activeCheckoutBooking.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {step === 'info' && 'Bước 1/2: Điền thông tin người nhận xe'}
                {step === 'payment' && 'Bước 2/2: Quét mã VietQR chuyển khoản cọc'}
                {step === 'success' && 'Hệ thống đã khóa lịch và sẵn sàng bàn giao'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: INFORMATION */}
          {step === 'info' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Selected Vehicle Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-100/60 backdrop-blur-md border border-slate-200/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-white/90 rounded-xl overflow-hidden border border-white/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{vehicle.name}</h4>
                    <p className="text-xs text-slate-500">
                      Biển số: {vehicle.plateNumber} · {vehicle.transmission} · {vehicle.category}
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      {formatDateTime(activeCheckoutBooking.startDate)} → {formatDateTime(activeCheckoutBooking.endDate)} ({activeCheckoutBooking.units} ngày)
                    </p>
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                  <span className="text-[11px] text-slate-500 block">Cọc giữ chỗ 20% cần nộp</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    {formatVND(activeCheckoutBooking.bookingDepositRequired)}
                  </span>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Thông tin người thuê xe (Để nhân viên đối chiếu và lập hợp đồng)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Họ và tên người nhận xe <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Số điện thoại liên hệ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0905 123 456"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email nhận biên lai xác nhận (Tùy chọn)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Số CCCD / Hộ chiếu (Nếu có sẵn)
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập để làm hợp đồng trước"
                      value={identityNumber}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Địa chỉ nhận xe chi tiết hoặc Ghi chú chuyến bay
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Ga đến Quốc nội - Sân bay Cam Ranh (Chuyến VN123 đến lúc 09:30)"
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Yêu cầu thêm (Tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Cần 2 mũ bảo hiểm cỡ lớn, chuẩn bị thêm 2 áo mưa mỏng..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Financial Breakdown Table - Liquid Glass */}
              <div className="p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-2xs space-y-2.5 text-xs">
                <h5 className="font-bold text-slate-900 pb-2 border-b border-slate-200/60">
                  Bảng chi tiết thanh toán & Tiền cọc minh bạch
                </h5>
                <div className="flex justify-between text-slate-600">
                  <span>Tiền thuê ({activeCheckoutBooking.units} ngày × {formatVND(activeCheckoutBooking.rate)}):</span>
                  <span className="font-mono font-semibold">{formatVND(activeCheckoutBooking.rentalFee)}</span>
                </div>
                {activeCheckoutBooking.deliveryFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Phí giao nhận tận nơi ({activeCheckoutBooking.pickupLocation}):</span>
                    <span className="font-mono font-semibold">+{formatVND(activeCheckoutBooking.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-bold pt-1.5 border-t border-slate-200/60">
                  <span>Tổng tiền thuê dự kiến:</span>
                  <span className="font-mono">{formatVND(activeCheckoutBooking.totalEstimatedAmount)}</span>
                </div>

                <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex justify-between items-center text-emerald-950 font-extrabold text-sm backdrop-blur-xs">
                  <div>
                    <span>Cọc giữ chỗ trực tuyến cần thanh toán (20%):</span>
                    <p className="text-[10px] text-emerald-700 font-normal">
                      Khóa lịch xe ngay, đối trừ 100% vào tiền thuê khi nhận xe
                    </p>
                  </div>
                  <span className="font-mono text-base text-emerald-700">
                    {formatVND(activeCheckoutBooking.bookingDepositRequired)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-700 pt-1 text-[11px]">
                  <span>Số tiền còn lại thanh toán khi nhận xe:</span>
                  <span className="font-mono font-bold text-emerald-800">{formatVND(activeCheckoutBooking.remainingAmountDue)}</span>
                </div>

                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-950 backdrop-blur-xs">
                  <strong>* Tiền cọc bảo đảm tài sản khi ký hợp đồng:</strong> {formatVND(activeCheckoutBooking.securityDepositOnPickup)} (Được giữ riêng và hoàn trả 100% cho quý khách ngay khi bàn giao xe nguyên vẹn).
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  Tôi xác nhận thông tin trên là chính xác và đồng ý với{' '}
                  <span className="text-emerald-700 font-bold">Chính sách giữ xe & hoàn cọc</span> của DriveRent (Hủy trước 24h hoàn 100% cọc).
                </span>
              </label>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-white cursor-pointer"
                >
                  Quay lại
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Chuyển sang Quét mã VietQR cọc</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VIETQR PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Countdown banner */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-amber-950 text-xs backdrop-blur-md">
                <div className="flex items-center gap-2 font-semibold">
                  <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
                  <span>Thời gian giữ xe tạm thời còn lại:</span>
                </div>
                <div className="font-mono font-black text-amber-900 text-sm bg-white/90 px-3 py-1 rounded-xl border border-amber-200 shadow-2xs">
                  {formatCountdown(timeLeft)}
                </div>
              </div>

              {/* QR and Transfer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Simulated VietQR Box */}
                <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 p-6 rounded-3xl text-white text-center shadow-lg space-y-4 border border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 pb-2 border-b border-slate-700">
                    <span>CỔNG THANH TOÁN VIETQR</span>
                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px]">NAPAS 247</span>
                  </div>

                  {/* QR Image Graphic */}
                  <div className="bg-white p-3.5 rounded-2xl mx-auto w-48 h-48 shadow-inner flex flex-col items-center justify-center relative">
                    <QrCode className="w-36 h-36 text-slate-900" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <Car className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-300">Quét mã bằng ứng dụng Ngân hàng bất kỳ</p>
                    <p className="text-xl font-black font-mono tracking-tight text-white">
                      {formatVND(activeCheckoutBooking.bookingDepositRequired)}
                    </p>
                  </div>
                </div>

                {/* Transfer Details Details */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                    Thông tin chuyển khoản thủ công
                  </h4>

                  <div className="p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/70 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Ngân hàng:</span>
                      <strong className="text-slate-900">{settings.bankName}</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Số tài khoản:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-emerald-700 font-mono text-sm">{settings.bankAccount}</strong>
                        <button
                          onClick={() => handleCopy(settings.bankAccount, 'Số tài khoản')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                          title="Sao chép"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Chủ tài khoản:</span>
                      <strong className="text-slate-900 text-right">{settings.bankAccountName}</strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Số tiền:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-emerald-700 font-mono text-sm font-black">
                          {formatVND(activeCheckoutBooking.bookingDepositRequired)}
                        </strong>
                        <button
                          onClick={() => handleCopy(String(activeCheckoutBooking.bookingDepositRequired), 'Số tiền')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                          title="Sao chép"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                      <span className="text-slate-500">Nội dung CK:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-emerald-950 font-mono bg-emerald-500/15 px-2 py-0.5 rounded-lg text-xs">
                          {activeCheckoutBooking.id}
                        </strong>
                        <button
                          onClick={() => handleCopy(activeCheckoutBooking.id, 'Nội dung chuyển khoản')}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                          title="Sao chép"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Hệ thống tự động kích hoạt hợp đồng và gửi SMS/Zalo xác nhận trong 30 giây kể từ khi nhận được tiền cọc.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <span>Đang kiểm tra giao dịch ngân hàng...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mô phỏng Quét mã & Thanh toán thành công ngay</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('info')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sửa thông tin người nhận</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Hủy giữ chỗ đơn này
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Đặt xe & Thanh toán cọc giữ chỗ thành công!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Lịch xe đã được khóa riêng cho quý khách trên hệ thống DriveRent. Chúng tôi đã gửi biên lai xác nhận qua số điện thoại <strong>{activeCheckoutBooking.customerPhone}</strong>.
                </p>
              </div>

              {/* Booking Voucher Card */}
              <div className="p-5 bg-white/75 backdrop-blur-md rounded-3xl border border-white/80 text-left space-y-3.5 max-w-lg mx-auto shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Mã xác nhận giữ chỗ</span>
                    <p className="text-lg font-black text-emerald-700 font-mono tracking-wider">
                      {activeCheckoutBooking.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Trạng thái</span>
                    <p className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 backdrop-blur-xs">
                      Đã thu cọc · Chờ nhận xe
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-500">Khách hàng:</span>
                    <p className="font-bold text-slate-900">{activeCheckoutBooking.customerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Xe đã chọn:</span>
                    <p className="font-bold text-slate-900">{vehicle.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Thời gian nhận:</span>
                    <p className="font-semibold text-slate-900">{formatDateTime(activeCheckoutBooking.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Thời gian trả:</span>
                    <p className="font-semibold text-slate-900">{formatDateTime(activeCheckoutBooking.endDate)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Địa điểm giao nhận xe:</span>
                    <p className="font-semibold text-slate-900">{activeCheckoutBooking.pickupLocation}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500">Tiền cọc giữ chỗ đã thanh toán:</span>
                    <p className="text-sm font-black text-emerald-600 font-mono">
                      {formatVND(activeCheckoutBooking.bookingDepositRequired)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Tiền thuê còn lại khi nhận xe:</span>
                    <p className="text-sm font-black text-emerald-800 font-mono">
                      {formatVND(activeCheckoutBooking.remainingAmountDue)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions Reminder */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-left text-xs text-emerald-950 space-y-1.5 backdrop-blur-xs">
                <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Hướng dẫn chuẩn bị khi nhận xe:</span>
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-800">
                  <li>Mang theo CCCD / Hộ chiếu gốc và Giấy phép lái xe hợp lệ.</li>
                  <li>Chuẩn bị tiền cọc bảo đảm tài sản <strong>{formatVND(activeCheckoutBooking.securityDepositOnPickup)}</strong> (hoàn lại 100% khi trả xe).</li>
                  <li>Nhân viên sẽ liên hệ trước 1 giờ để xác nhận vị trí giao xe. Hotline hỗ trợ: {settings.hotline}.</li>
                </ul>
              </div>

              {/* Cross-system Sync Notice */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-left text-xs text-emerald-950 flex items-center justify-between backdrop-blur-xs">
                <div>
                  <p className="font-bold">Đã đồng bộ sang Hệ thống Quản trị nội bộ!</p>
                  <p className="text-[11px] text-emerald-700">
                    Hợp đồng mới đã được tạo và hiển thị trong danh sách Hợp đồng / Lịch giao nhận của nhân viên cửa hàng.
                  </p>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setActiveCheckoutBooking(null);
                      setAppMode('admin');
                      setCustomerTab('home');
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-sm shadow-emerald-600/20"
                  >
                    Xem trên Trang Quản trị
                  </button>
                )}
              </div>

              {/* Final Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 border border-slate-200/80 bg-white/80 hover:bg-white rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In phiếu xác nhận</span>
                </button>

                <button
                  onClick={() => {
                    setActiveCheckoutBooking(null);
                    setCustomerTab('lookup');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Tra cứu đơn đặt xe</span>
                </button>

                <button
                  onClick={() => {
                    setActiveCheckoutBooking(null);
                    setCustomerTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 cursor-pointer"
                >
                  Hoàn tất & Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
