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
  ShieldAlert,
  Building2,
  Plane,
  Train,
  MapPin,
  FileText,
  Check,
  Loader2,
  Zap,
  MessageCircle,
  Search,
  Navigation
} from 'lucide-react';
import { formatVND, formatDate, formatDateTime } from '../../utils/formatters';

// Hàm tự động định dạng số điện thoại Việt Nam (09xx xxx xxx hoặc 0xxx xxx xxx)
const formatVNPhoneNumber = (val: string): string => {
  let digits = val.replace(/\D/g, '');
  if (digits.startsWith('84') && digits.length > 9) {
    digits = '0' + digits.slice(2);
  }
  const trimmed = digits.slice(0, 10);
  if (trimmed.length <= 4) return trimmed;
  if (trimmed.length <= 7) return `${trimmed.slice(0, 4)} ${trimmed.slice(4)}`;
  return `${trimmed.slice(0, 4)} ${trimmed.slice(4, 7)} ${trimmed.slice(7)}`;
};

// 4 Chip chọn nhanh địa điểm giao xe tại Nha Trang
const QUICK_PICKUP_LOCATIONS = [
  {
    label: 'Tại Showroom (25 Lê Lợi)',
    fullText: 'Tại Showroom (25 Lê Lợi, TP. Nha Trang)',
    icon: Building2,
    badge: 'Miễn phí'
  },
  {
    label: 'Sân bay Cam Ranh',
    fullText: 'Sân bay Cam Ranh (Ga Quốc nội / Quốc tế)',
    icon: Plane,
    badge: '+150k'
  },
  {
    label: 'Ga Nha Trang',
    fullText: 'Ga Nha Trang (17 Thái Nguyên)',
    icon: Train,
    badge: 'Miễn phí'
  },
  {
    label: 'Khách sạn dọc đường Trần Phú / Phạm Văn Đồng',
    fullText: 'Khách sạn dọc đường Trần Phú / Phạm Văn Đồng',
    icon: MapPin,
    badge: 'Giao tận nơi'
  }
];

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
    showToast,
    t,
    translateVehicle
  } = useApp();

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [showQuickTerms, setShowQuickTerms] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Payment states
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Sync state when active checkout booking changes
  useEffect(() => {
    if (activeCheckoutBooking) {
      setStep('info');
      setCustomerName(activeCheckoutBooking.customerName || '');
      setCustomerPhone(formatVNPhoneNumber(activeCheckoutBooking.customerPhone || ''));
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
  const transV = translateVehicle(vehicle);

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
      showToast(t('checkout.toast_enter_name'), 'error');
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('Vui lòng nhập số điện thoại hợp lệ (10 chữ số: 09xx xxx xxx)', 'error');
      return;
    }
    if (!agreedTerms) {
      showToast('Vui lòng đồng ý với quy định thuê xe & điều khoản cọc để tiếp tục', 'error');
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
    showToast('Đang kết nối cổng Napas 247 để kiểm tra thanh toán...', 'info');
    setTimeout(() => {
      const success = verifyOnlineBookingPayment(
        activeCheckoutBooking.id,
        'Chuyển khoản VietQR (Cổng trực tuyến Napas 247)'
      );
      setIsProcessingPayment(false);
      if (success) {
        setConfirmedBookingId(activeCheckoutBooking.id);
        setStep('success');
        showToast('Xác nhận đặt cọc thành công! Xe đã được giữ.', 'success');
      }
    }, 1200);
  };

  const handleCancelBooking = () => {
    if (confirm(t('checkout.toast_cancelled') + '?')) {
      cancelOnlineBooking(activeCheckoutBooking.id, 'Customer cancellation');
      setActiveCheckoutBooking(null);
      showToast(t('checkout.toast_cancelled'), 'info');
    }
  };

  const handleCopy = (text: string, label: string, key?: string) => {
    navigator.clipboard.writeText(text);
    if (key) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {step === 'info' && t('checkout.modal_title')}
                  {step === 'payment' && t('checkout.step_payment')}
                  {step === 'success' && t('checkout.success_title')}
                </h3>
                <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/80 backdrop-blur-xs">
                  {activeCheckoutBooking.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {step === 'info' && t('checkout.step_info')}
                {step === 'payment' && t('checkout.step_payment')}
                {step === 'success' && t('checkout.step_success')}
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
                      {vehicle.plateNumber} · {transV.transmission} · {transV.bodyType}
                    </p>
                    <p className="text-xs text-sky-700 font-semibold mt-0.5">
                      {formatDateTime(activeCheckoutBooking.startDate)} → {formatDateTime(activeCheckoutBooking.endDate)} ({activeCheckoutBooking.units} {t('checkout.days_count')})
                    </p>
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                  <span className="text-[11px] text-slate-500 block">{t('checkout.deposit_required')}</span>
                  <span className="text-lg font-black text-sky-800 font-mono">
                    {formatVND(activeCheckoutBooking.bookingDepositRequired)}
                  </span>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t('checkout.step_info')}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>{t('checkout.cust_name')}</span>
                        <span className="text-rose-500 font-black">*</span>
                      </label>
                      <span className="text-[10px] font-medium text-slate-400">Bắt buộc</span>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/80 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>

                  {/* Số điện thoại (Tự động định dạng 09xx xxx xxx) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>{t('checkout.cust_phone')}</span>
                        <span className="text-rose-500 font-black">*</span>
                      </label>
                      <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                        Định dạng 09xx xxx xxx
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        maxLength={12}
                        placeholder="0905 123 456"
                        value={customerPhone}
                        onChange={(e) => {
                          const formatted = formatVNPhoneNumber(e.target.value);
                          setCustomerPhone(formatted);
                        }}
                        className="w-full px-3.5 py-2.5 bg-white/80 border border-slate-200/90 rounded-xl text-xs font-semibold tracking-wide text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400 placeholder:font-normal"
                      />
                      {customerPhone.replace(/\D/g, '').length === 10 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Dùng để nhận SMS mã cọc & nhân viên liên hệ giao xe</p>
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>{t('checkout.cust_email')}</span>
                        <span className="text-rose-500 font-black">*</span>
                      </label>
                      <span className="text-[10px] font-medium text-slate-400">Bắt buộc</span>
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/80 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                    />
                  </div>

                  {/* CCCD / Hộ chiếu */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        {t('checkout.cust_id')}
                      </label>
                      <span className="text-[10px] font-medium text-emerald-600">Chấp nhận VNeID</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Nhập số CCCD/Passport để làm hợp đồng trước"
                      value={identityNumber}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/80 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Địa điểm nhận xe & 4 Chip chọn nhanh Nha Trang */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t('checkout.pickup_loc')}</span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Chọn nhanh địa điểm bên dưới</span>
                  </div>

                  {/* 4 Chip chọn nhanh địa điểm Nha Trang */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {QUICK_PICKUP_LOCATIONS.map((loc) => {
                      const isSelected = specificAddress === loc.fullText || specificAddress === loc.label;
                      const IconComponent = loc.icon;
                      return (
                        <button
                          key={loc.label}
                          type="button"
                          onClick={() => setSpecificAddress(loc.fullText)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 select-none ${
                            isSelected
                              ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-sm ring-1 ring-sky-400'
                              : 'bg-white/80 border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-sky-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              isSelected ? 'bg-sky-200/70 text-sky-900' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {loc.badge}
                            </span>
                          </div>
                          <span className="text-xs font-bold leading-tight line-clamp-2">
                            {loc.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Input địa chỉ chi tiết */}
                  <input
                    type="text"
                    placeholder="Hoặc nhập địa chỉ cụ thể: Khách sạn, số phòng, giờ hạ cánh chuyến bay..."
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                  />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    * Nhân viên Nha Trang Car sẽ liên hệ xác nhận giờ hạ cánh hoặc địa chỉ khách sạn trước 60 phút để bàn giao xe đúng hẹn.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Yêu cầu thêm (Tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Cần chuẩn bị 2 mũ bảo hiểm cỡ lớn, chuẩn bị thêm ghế trẻ em ISOFIX..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Financial Breakdown Table - Liquid Glass */}
              <div className="p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-2xs space-y-2.5 text-xs">
                <h5 className="font-bold text-slate-900 pb-2 border-b border-slate-200/60">
                  {t('checkout.rental_summary')}
                </h5>
                <div className="flex justify-between text-slate-600">
                  <span>{t('checkout.rental_fee_label')} ({activeCheckoutBooking.units} {t('checkout.days_count')} × {formatVND(activeCheckoutBooking.rate)}):</span>
                  <span className="font-mono font-semibold">{formatVND(activeCheckoutBooking.rentalFee)}</span>
                </div>
                {activeCheckoutBooking.deliveryFee > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{t('checkout.delivery_fee_label')} ({activeCheckoutBooking.pickupLocation}):</span>
                    <span className="font-mono font-semibold">+{formatVND(activeCheckoutBooking.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-bold pt-1.5 border-t border-slate-200/60">
                  <span>{t('checkout.total_estimated_label')}</span>
                  <span className="font-mono">{formatVND(activeCheckoutBooking.totalEstimatedAmount)}</span>
                </div>

                <div className="p-3.5 bg-sky-50/80 rounded-xl border border-sky-200/80 flex justify-between items-center text-sky-950 font-extrabold text-sm backdrop-blur-xs">
                  <div>
                    <span>{t('checkout.deposit_20_title')}</span>
                    <p className="text-[10px] text-sky-700 font-normal">
                      {t('checkout.deposit_20_sub')}
                    </p>
                  </div>
                  <span className="font-mono text-base text-sky-700">
                    {formatVND(activeCheckoutBooking.bookingDepositRequired)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-700 pt-1 text-[11px]">
                  <span>{t('checkout.remaining_due_label')}</span>
                  <span className="font-mono font-bold text-sky-800">{formatVND(activeCheckoutBooking.remainingAmountDue)}</span>
                </div>

                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-950 backdrop-blur-xs">
                  <strong>{t('checkout.security_contract_label')}</strong> {formatVND(activeCheckoutBooking.securityDepositOnPickup)} {t('checkout.security_contract_note')}
                </div>
              </div>

              {/* Checkbox 'Đồng ý với quy định thuê xe & điều khoản cọc' - Ô cảm ứng lớn có viền mềm mại */}
              <div
                onClick={() => setAgreedTerms(!agreedTerms)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                  agreedTerms
                    ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-500/20 shadow-sm'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                    agreedTerms
                      ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {agreedTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 text-xs space-y-1">
                  <div className="font-bold text-slate-900 leading-snug">
                    Tôi đã đọc và đồng ý với Quy định thuê xe & Điều khoản đặt cọc giữ chỗ của Nha Trang Car
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Cam kết hoàn 100% tiền cọc khi thông báo hủy trước 24 giờ hoặc trong trường hợp bất khả kháng (thời tiết bão lũ, chuyến bay bị hủy).
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuickTerms(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-700 hover:text-sky-800 underline decoration-sky-400 underline-offset-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Xem nhanh tóm tắt quy định thuê xe & quyền lợi cọc (không mất dữ liệu)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-white cursor-pointer"
                >
                  {t('checkout.btn_back')}
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 hover:from-sky-700 hover:via-cyan-700 hover:to-teal-600 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{t('checkout.btn_proceed_pay')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VIETQR PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Đồng hồ đếm ngược giữ xe 10 phút - Ocean Blue Pulse Bar */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50/60 to-white border border-sky-200/90 shadow-[0_2px_12px_rgba(14,165,233,0.08)] space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-600/10 text-sky-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>Hệ thống đang ưu tiên giữ xe cho bạn</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Lịch xe được khóa bảo đảm trong thời gian đếm ngược
                      </p>
                    </div>
                  </div>

                  {/* Đồng hồ đếm ngược số to rõ */}
                  <div className="text-right shrink-0">
                    <div className="font-mono text-base sm:text-lg font-black text-sky-700 bg-white px-3 py-1 rounded-xl border border-sky-200 shadow-2xs tracking-tight">
                      {formatCountdown(timeLeft)}
                    </div>
                  </div>
                </div>

                {/* Thanh tiến trình Pulse Bar viền xanh biển phát sáng */}
                <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                    style={{ width: `${Math.max(0, Math.min(100, (timeLeft / 600) * 100))}%` }}
                  />
                </div>
              </div>

              {/* QR and Transfer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* Simulated VietQR Napas 247 Card */}
                <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-5 rounded-3xl text-white text-center shadow-xl space-y-3.5 border border-white/10 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Header thẻ QR */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 pb-2.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span className="tracking-wide">VIETQR CHUẨN NAPAS 247</span>
                    </div>
                    <span className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-xs">
                      XÁC THỰC TỰ ĐỘNG
                    </span>
                  </div>

                  {/* QR Image Graphic with center badge & fallback */}
                  <div className="bg-white p-3 rounded-2xl mx-auto w-48 h-48 sm:w-52 sm:h-52 shadow-inner flex flex-col items-center justify-center relative group">
                    <img
                      src={`https://img.vietqr.io/image/MB-${settings.bankAccount}-compact2.png?amount=${activeCheckoutBooking.bookingDepositRequired}&addInfo=${encodeURIComponent(activeCheckoutBooking.id)}&accountName=${encodeURIComponent(settings.bankAccountName)}`}
                      alt="VietQR Napas 247"
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallbackEl = document.getElementById('vietqr-fallback-svg');
                        if (fallbackEl) fallbackEl.style.display = 'flex';
                      }}
                    />
                    <div id="vietqr-fallback-svg" className="hidden absolute inset-0 flex-col items-center justify-center p-2 text-slate-900">
                      <QrCode className="w-36 h-36" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white flex items-center justify-center shadow-md">
                          <Car className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-300">
                      Mở app ngân hàng hoặc Momo để quét mã QR
                    </p>
                    <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-1.5">
                      <span>{formatVND(activeCheckoutBooking.bookingDepositRequired)}</span>
                    </div>
                    <span className="inline-block text-[10px] font-medium text-cyan-300 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
                      Tự động điền đúng số tiền & cú pháp CK
                    </span>
                  </div>
                </div>

                {/* Transfer Details with 1-Touch Copy Buttons */}
                <div className="space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                        <span>Thông tin chuyển khoản thủ công</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">Nếu không quét QR</span>
                    </div>

                    <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                      {/* Ngân hàng & Tên chủ TK */}
                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100 text-slate-700">
                        <div>
                          <span className="text-slate-400 block text-[11px]">{t('checkout.bank_name_label')}</span>
                          <strong className="text-slate-900 font-bold text-xs">{settings.bankName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">{t('checkout.bank_holder_label')}</span>
                          <strong className="text-slate-900 font-bold text-xs truncate block">{settings.bankAccountName}</strong>
                        </div>
                      </div>

                      {/* Số tài khoản */}
                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <div>
                          <span className="text-slate-500 text-[11px] block">{t('checkout.bank_account_label')}</span>
                          <strong className="text-sky-700 font-mono text-sm tracking-wide font-black">
                            {settings.bankAccount}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.bankAccount, 'Số tài khoản', 'account')}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                          title="Sao chép số tài khoản"
                        >
                          {copiedKey === 'account' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span className="text-emerald-700">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Chép STK</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Ô NỔI BẬT 1: SỐ TIỀN CỌC + NÚT 1-CHẠM SAO CHÉP */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50/70 border border-sky-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wide">
                            Số tiền đặt cọc cần chuyển
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            Đúng từng số 0
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xl sm:text-2xl font-black font-mono text-sky-700">
                            {formatVND(activeCheckoutBooking.bookingDepositRequired)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(String(activeCheckoutBooking.bookingDepositRequired), 'Số tiền cọc', 'amount')}
                            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/30 transition-all cursor-pointer shrink-0"
                          >
                            {copiedKey === 'amount' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                <span>Đã chép số tiền</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-white" />
                                <span>Sao chép số tiền</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Ô NỔI BẬT 2: NỘI DUNG CHUYỂN KHOẢN + NÚT 1-CHẠM SAO CHÉP */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                            Nội dung chuyển khoản (Cú pháp CK)
                          </span>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded">
                            Bắt buộc ghi đúng
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-base sm:text-lg font-black font-mono text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                            {activeCheckoutBooking.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(activeCheckoutBooking.id, 'Nội dung chuyển khoản', 'content')}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-amber-600/30 transition-all cursor-pointer shrink-0"
                          >
                            {copiedKey === 'content' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                <span>Đã chép cú pháp</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-white" />
                                <span>Sao chép nội dung CK</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-amber-800 leading-tight pt-0.5">
                          * Hệ thống đối soát Napas 247 tự động nhận diện mã đơn và kích hoạt ngay sau 5–10 giây.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 hover:from-sky-700 hover:via-cyan-700 hover:to-teal-600 active:scale-[0.98] disabled:opacity-75 disabled:cursor-wait text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer min-h-[52px]"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Đang kiểm tra giao dịch chuyển khoản...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>Tôi đã chuyển khoản thành công</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('info')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('checkout.btn_edit_info')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelBooking}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    {t('checkout.btn_cancel_hold')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION & DIGITAL RENTAL VOUCHER */}
          {step === 'success' && (
            <div className="space-y-5 text-center">
              {/* Top celebration badge & headline */}
              <div className="space-y-2">
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-50 animate-in zoom-in-90">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Đặt cọc giữ xe thành công!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Lịch xe đã được khóa riêng cho quý khách trên hệ thống. Tin nhắn xác nhận đã gửi đến <strong>{activeCheckoutBooking.customerPhone}</strong>.
                </p>
              </div>

              {/* THẺ VÉ XÁC NHẬN ĐIỆN TỬ (DIGITAL RENTAL VOUCHER) */}
              <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden text-left max-w-xl mx-auto">
                {/* Header Voucher */}
                <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                      NHA TRANG CAR · DIGITAL RENTAL VOUCHER
                    </span>
                    <div className="text-xs text-slate-300">
                      Khách hàng: <strong className="text-white">{activeCheckoutBooking.customerName}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Mã giữ xe</span>
                    <span className="text-base sm:text-xl font-mono font-black text-cyan-300 tracking-wider">
                      {activeCheckoutBooking.id}
                    </span>
                  </div>
                </div>

                {/* Thân Voucher */}
                <div className="p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                  {/* Khối hình ảnh và thông số xe */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-black text-sm text-slate-900 truncate">{vehicle.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          Đã cọc thành công
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        Biển số: <strong className="text-slate-800">{vehicle.plateNumber}</strong> · {transV.transmission} · {transV.fuelType}
                      </p>
                      <p className="text-[11px] font-semibold text-sky-700">
                        Thời hạn: {activeCheckoutBooking.units} ngày vi vu Nha Trang
                      </p>
                    </div>
                  </div>

                  {/* Lưới thông tin thời gian & địa điểm nhận xe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Thời gian nhận - trả */}
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Lịch trình nhận & trả xe
                      </span>
                      <div className="text-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Nhận xe:</span>
                          <span className="font-bold">{formatDateTime(activeCheckoutBooking.startDate)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                          <span className="text-slate-500 text-[11px]">Trả xe:</span>
                          <span className="font-bold">{formatDateTime(activeCheckoutBooking.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Địa điểm giao xe */}
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> Địa điểm hẹn giao xe
                      </span>
                      <p className="font-bold text-slate-900 leading-snug">
                        {activeCheckoutBooking.pickupLocation || 'Tại Showroom (25 Lê Lợi, TP. Nha Trang)'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Nhân viên sẽ có mặt trước 15-30 phút bàn giao xe
                      </p>
                    </div>
                  </div>

                  {/* Đường răng cưa voucher nét đứt (Perforated ticket line) */}
                  <div className="relative py-1">
                    <div className="border-t-2 border-dashed border-slate-200" />
                    <div className="absolute -left-7 -top-2 w-4 h-4 rounded-full bg-slate-950/70" />
                    <div className="absolute -right-7 -top-2 w-4 h-4 rounded-full bg-slate-950/70" />
                  </div>

                  {/* Khối tài chính minh bạch */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 block">Tiền cọc giữ xe:</span>
                      <div className="text-base sm:text-lg font-black font-mono text-emerald-700 flex items-center gap-1">
                        <span>{formatVND(activeCheckoutBooking.bookingDepositRequired)}</span>
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      </div>
                      <span className="text-[10px] text-emerald-800 font-medium">Đã thanh toán qua VietQR</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-slate-600 block">Số tiền còn lại khi nhận xe:</span>
                      <div className="text-base sm:text-lg font-black font-mono text-sky-800">
                        {formatVND(activeCheckoutBooking.remainingAmountDue)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">Thanh toán khi ký bàn giao</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TÍCH HỢP 3 NÚT HÀNH ĐỘNG TIỆN ÍCH DU KHÁCH */}
              <div className="space-y-2 max-w-xl mx-auto">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-left pl-1">
                  Tiện ích hỗ trợ chuyến đi
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Nút 1: Mở Google Maps chỉ đường đến Showroom */}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=25+L%C3%AA+L%E1%BB%A3i,+X%C6%B0%C6%A1ng+Hu%C3%A2n,+Nha+Trang,+Kh%C3%A1nh+H%C3%B2a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-400 hover:bg-sky-50/40 text-slate-800 text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Navigation className="w-4 h-4 text-sky-600" />
                    </div>
                    <span className="text-center font-bold">Chỉ đường Google Maps</span>
                    <span className="text-[10px] text-slate-400 font-normal">Đến 25 Lê Lợi Nha Trang</span>
                  </a>

                  {/* Nút 2: Nhắn Zalo điều phối viên để nhận vị trí xe */}
                  <a
                    href={`https://zalo.me/${(settings.hotline || '0905888999').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800 text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-center font-bold">Nhắn Zalo điều phối</span>
                    <span className="text-[10px] text-slate-400 font-normal">Nhận ảnh xe & vị trí tài xế</span>
                  </a>

                  {/* Nút 3: Tải/In phiếu xác nhận PDF */}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-bold flex flex-col items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Printer className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-center font-bold">Tải / In phiếu PDF</span>
                    <span className="text-[10px] text-slate-400 font-normal">Lưu về máy hoặc in ra giấy</span>
                  </button>
                </div>
              </div>

              {/* LƯU Ý KHI NHẬN XE */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-left text-xs text-emerald-950 space-y-1 max-w-xl mx-auto">
                <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Chuẩn bị nhận xe: Xuất trình CCCD / VNeID Mức 2 và Giấy phép lái xe hợp lệ</span>
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed pl-5.5">
                  Cửa hàng chỉ chụp ảnh đối chiếu, không giữ bản gốc CCCD của bạn. Hotline hỗ trợ 24/7: <strong>{settings.hotline || '0905 888 999'}</strong>.
                </p>
              </div>

              {/* NÚT CHUYỂN HƯỚNG NHANH SANG TRANG TRA CỨU ĐƠN HÀNG */}
              <div className="pt-2 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCheckoutBooking(null);
                    setCustomerTab('lookup');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 hover:from-sky-700 hover:via-cyan-700 hover:to-teal-600 active:scale-[0.98] text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[48px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Tra cứu & Theo dõi trạng thái đơn hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCheckoutBooking(null);
                    setCustomerTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer min-h-[48px]"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Terms & Policy Modal Overlay - Khách xem tóm tắt không bị mất dữ liệu */}
      {showQuickTerms && (
        <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Tóm tắt Quy định thuê xe & Đặt cọc</h4>
                  <p className="text-[11px] text-slate-500">Minh bạch 100% — Bảo vệ quyền lợi khách thuê</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickTerms(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>1. Giấy tờ đơn giản & Không giữ CCCD gốc</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-5">
                  Chỉ cần đối chiếu CCCD gắn chip hoặc tài khoản VNeID Mức 2 và GPLX hợp lệ. Cửa hàng chỉ chụp ảnh lưu hồ sơ, hoàn lại toàn bộ bản gốc ngay sau khi ký biên bản.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>2. Tiền cọc giữ xe thanh toán trước</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-5">
                  Chỉ từ 500.000đ (xe máy) đến 1.000.000đ (ô tô) để khóa lịch xe trên hệ thống. Khoản cọc này được trừ thẳng vào tổng chi phí khi nhận xe.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>3. Chính sách hoàn cọc & Đổi ngày linh hoạt</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-5">
                  Hoàn 100% tiền cọc nếu báo trước 24 giờ nhận xe, hoặc hoàn tiền ngay trong trường hợp bất khả kháng (chuyến bay bị hủy, thời tiết bão lũ tại Nha Trang).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>4. Tiêu chuẩn giao nhận xe</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-5">
                  Đồng kiểm tra quay video vết xước 360°, bàn giao bình đầy xăng hoặc pin trên 90%, xe đã qua khử khuẩn và vệ sinh sạch sẽ thơm tho.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>5. Cứu hộ kỹ thuật 24/7</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-5">
                  Đội ngũ hỗ trợ sự cố lưu động có mặt sau 15–30 phút tại TP. Nha Trang & Bãi Dài Cam Ranh. Hotline hỗ trợ: <strong>0905 888 999</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQuickTerms(false)}
              className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
            >
              <span>Đã hiểu & Tiếp tục đặt xe</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
