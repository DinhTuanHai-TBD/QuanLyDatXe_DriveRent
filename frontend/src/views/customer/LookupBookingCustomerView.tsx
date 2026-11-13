import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OnlineBooking } from '../../types';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  CreditCard,
  Phone,
  PhoneCall,
  User,
  ArrowRight,
  FileText,
  KeyRound,
  RotateCcw,
  Sparkles,
  Ticket,
  QrCode,
  Navigation,
  ExternalLink,
  MessageSquare,
  Plane,
  Building2,
  Train,
  Check,
  HelpCircle,
  Car
} from 'lucide-react';
import { formatVND, formatDateTime } from '../../utils/formatters';

export const LookupBookingCustomerView: React.FC = () => {
  const {
    onlineBookings,
    vehicles,
    cancelOnlineBooking,
    changeOnlineBookingDates,
    showToast,
    isLoggedIn,
    setAppMode,
    setCustomerTab,
    settings,
    t,
    translateVehicle
  } = useApp();

  const hotline = settings?.hotline || '0905 888 999';

  const [searchQuery, setSearchQuery] = useState('');
  // Khởi tạo null để hiển thị Empty State nếu chưa tra cứu, hoặc tải đơn đầu tiên nếu người dùng muốn
  const [selectedBooking, setSelectedBooking] = useState<OnlineBooking | null>(null);

  // Date change state
  const [isChangingDates, setIsChangingDates] = useState(false);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  // Cancel dialog state
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Thay đổi lịch trình công tác / du lịch');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showToast(t('lookup.placeholder', 'Nhập mã đặt xe hoặc số điện thoại...'), 'error');
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
      showToast(t('lookup.empty_prompt', 'Không tìm thấy đơn đặt xe trùng khớp. Vui lòng kiểm tra lại!'), 'error');
    }
  };

  const vehicle = selectedBooking
    ? vehicles.find((v) => v.id === selectedBooking.vehicleId) || vehicles[0]
    : vehicles[0];

  const handleOpenDateChange = () => {
    if (!selectedBooking) return;
    setNewStartDate(selectedBooking.startDate);
    setNewEndDate(selectedBooking.endDate);
    setIsChangingDates(true);
    setIsCancelConfirmOpen(false);
  };

  // Tính toán thời gian mới và chênh lệch chi phí thời gian thực
  const costDelta = useMemo(() => {
    if (!selectedBooking || !newStartDate || !newEndDate) return null;
    try {
      const start = new Date(newStartDate);
      const end = new Date(newEndDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null;

      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const newDays = Math.max(1, Math.ceil(diffHours / 24));
      const oldDays = selectedBooking.units || 1;
      const daysDiff = newDays - oldDays;

      const dailyPrice = vehicle?.dailyRate || Math.round(selectedBooking.totalEstimatedAmount / oldDays);
      const newTotalEstimated = newDays * dailyPrice;
      const oldTotalEstimated = selectedBooking.totalEstimatedAmount;
      const costDiff = newTotalEstimated - oldTotalEstimated;
      const newRemainingAmountDue = Math.max(0, newTotalEstimated - selectedBooking.bookingDepositPaid);

      return {
        newDays,
        oldDays,
        daysDiff,
        dailyPrice,
        oldTotalEstimated,
        newTotalEstimated,
        costDiff,
        newRemainingAmountDue,
      };
    } catch {
      return null;
    }
  }, [selectedBooking, newStartDate, newEndDate, vehicle]);

  const handleSaveDateChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const ok = changeOnlineBookingDates(selectedBooking.id, newStartDate, newEndDate);
    if (ok) {
      const updated = onlineBookings.find((b) => b.id === selectedBooking.id);
      if (updated) {
        setSelectedBooking({
          ...updated,
          startDate: newStartDate,
          endDate: newEndDate,
          units: costDelta ? costDelta.newDays : updated.units,
          totalEstimatedAmount: costDelta ? costDelta.newTotalEstimated : updated.totalEstimatedAmount,
          remainingAmountDue: costDelta ? costDelta.newRemainingAmountDue : updated.remainingAmountDue,
        });
      }
      setIsChangingDates(false);
      showToast(t('action.confirm', 'Đã cập nhật lịch trình thuê xe thành công!'), 'success');
    }
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;

    const ok = cancelOnlineBooking(selectedBooking.id, cancelReason);
    if (ok) {
      const updated = onlineBookings.find((b) => b.id === selectedBooking.id);
      if (updated) setSelectedBooking({ ...updated, status: 'cancelled' });
      setIsCancelConfirmOpen(false);
      showToast(t('lookup.status_cancelled', 'Đơn đặt xe đã được hủy theo yêu cầu.'), 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Xác định thông tin lộ trình và chỉ đường theo địa điểm nhận xe
  const getPickupGuideInfo = (locationStr: string) => {
    const loc = locationStr.toLowerCase();
    if (loc.includes('cam ranh') || loc.includes('sân bay') || loc.includes('airport')) {
      return {
        title: 'Sân bay Quốc tế Cam Ranh (CXR)',
        badge: 'Ga Đến Quốc Nội & Quốc Tế',
        guide: 'Nhân viên trực tiếp đón khách tại Cổng Ga Đến (Cột số 4), cầm bảng tên quý khách và kiểm tra bàn giao xe chỉ trong 10 phút.',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Cam+Ranh+International+Airport,+Khanh+Hoa',
        icon: Plane,
        accent: 'text-indigo-600 bg-indigo-50 border-indigo-200'
      };
    }
    if (loc.includes('ga') || loc.includes('tàu') || loc.includes('train')) {
      return {
        title: 'Ga Đường Sắt Nha Trang (17 Thái Nguyên)',
        badge: 'Cổng Ga Trung Tâm',
        guide: 'Xe được điều động đỗ sẵn tại Quảng trường 19/8 trước giờ tàu dừng 15 phút. Nhân viên hỗ trợ mang hành lý lên cốp xe.',
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ga+Nha+Trang,+Th%C3%A1i+Nguy%C3%AAn,+Nha+Trang',
        icon: Train,
        accent: 'text-cyan-600 bg-cyan-50 border-cyan-200'
      };
    }
    return {
      title: 'Showroom Trung Tâm DriveRent (25 Lê Lợi)',
      badge: 'Văn Phòng Chính',
      guide: 'Ngay góc ngã 4 Lê Lợi - Phan Chu Trinh (Cách Chợ Đầm 300m, Biển Trần Phú 400m). Quý khách đến quầy xuất trình vé để nhận chìa khóa ngay.',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25+L%C3%AA+L%E1%BB%A3i,+X%C6%B0%C6%A1ng+Hu%C3%A2n,+Nha+Trang,+Kh%C3%A1nh+H%C3%B2a',
      icon: Building2,
      accent: 'text-sky-600 bg-sky-50 border-sky-200'
    };
  };

  const pickupGuide = selectedBooking ? getPickupGuideInfo(selectedBooking.pickupLocation) : getPickupGuideInfo('');

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10 print:p-0 print:m-0 print:max-w-full">
      {/* CSS @media print Chuyên Biệt Cho Bản In A4 Hoàn Hảo */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm 8mm 10mm;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 10pt !important;
            line-height: 1.35 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header,
          footer,
          nav,
          #lookup-search-card,
          .print\\:hidden,
          button,
          .toast-container,
          [data-floating-action],
          .fixed {
            display: none !important;
          }
          main {
            padding-top: 0 !important;
            margin: 0 !important;
          }
          #printable-voucher {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: 1.5px solid #0284c7 !important;
            border-radius: 16px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          #printable-voucher .rounded-3xl {
            border-radius: 14px !important;
          }
        }
      `}</style>
      
      {/* ========================================================================= */}
      {/* 1. KHUNG TÌM KIẾM ĐƠN ĐẶT XE SANG TRỌNG & TIỆN ÍCH DEMO 1-CHẠM */}
      {/* ========================================================================= */}
      <div id="lookup-search-card" className="bg-white rounded-3xl border border-sky-200/90 shadow-sm overflow-hidden print:hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-sky-100/90 via-sky-50 to-cyan-50/80 border-b border-sky-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-700 text-white uppercase tracking-wider shadow-2xs">
              <KeyRound className="w-3.5 h-3.5" />
              <span>{t('lookup.badge', 'TRA CỨU HÀNH TRÌNH ĐIỆN TỬ')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('lookup.title', 'Trung Tâm Tra Cứu Đơn Đặt Xe & Quản Lý Hành Trình')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {t('lookup.desc', 'Xem vé điện tử, quét mã nhận xe tại quầy, chỉ đường Google Maps và đổi ngày linh hoạt.')}
            </p>
          </div>

          {/* Form Tra Cứu (Touch Target >= 48px) */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto md:min-w-[440px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t('lookup.placeholder', 'Nhập mã đặt xe hoặc số điện thoại...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[48px] pl-10 pr-4 py-3 bg-white border border-sky-300 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-hidden focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 shadow-2xs transition-all"
              />
            </div>
            <button
              type="submit"
              className="min-h-[48px] px-6 py-3 bg-sky-700 hover:bg-sky-800 active:scale-[0.98] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-sky-800/20 transition-all cursor-pointer shrink-0 select-none flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{t('lookup.btn_search', 'Tra cứu ngay')}</span>
            </button>
          </form>
        </div>

        {/* Gợi ý test thử nhanh nếu có đơn trong hệ thống */}
        {onlineBookings.length > 0 && (
          <div className="px-6 sm:px-8 py-3.5 bg-white border-t border-sky-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 font-medium">Đơn đặt xe demo sẵn có:</span>
              {onlineBookings.slice(0, 3).map((b) => {
                const isCurrent = selectedBooking?.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(b.id);
                      setSelectedBooking(b);
                      setIsChangingDates(false);
                      setIsCancelConfirmOpen(false);
                    }}
                    className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-sky-700 text-white shadow-2xs'
                        : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
                    }`}
                  >
                    <span>{b.id}</span>
                    <span className="text-[11px] opacity-80">({b.customerName})</span>
                  </button>
                );
              })}
            </div>

            <span className="text-slate-600 text-xs font-medium hidden lg:inline">
              ⚡ Hệ thống lưu trữ bảo mật &bull; Cập nhật trạng thái tự động
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. NỘI DUNG CHÍNH: DASHBOARD HÀNH TRÌNH DU KHÁCH (KHI CÓ ĐƠN) */}
      {/* ========================================================================= */}
      {selectedBooking && vehicle ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* ======================================================================= */}
          {/* THANH TIẾN TRÌNH HÀNH TRÌNH 4 NẤC NGANG TOÀN MÀN HÌNH (JOURNEY STEPPER) */}
          {/* ======================================================================= */}
          <div className="bg-white rounded-3xl border border-sky-200/90 p-6 sm:p-8 shadow-sm space-y-6 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-100">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-xs" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Tiến Trình Chuẩn Bị &amp; Bàn Giao Xe Tự Lái Thực Tế
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Hành trình đơn xe <strong className="text-sky-800 font-mono">{selectedBooking.id}</strong> đang được giám sát bởi trung tâm điều phối DriveRent
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Đã xác nhận &bull; Sẵn sàng phục vụ</span>
              </div>
            </div>

            {/* Stepper Rail 4 Nấc Ngang */}
            <div className="relative pt-3 pb-2">
              {/* Connecting Background Line */}
              <div className="hidden sm:block absolute top-7.5 left-[10%] right-[10%] h-1 bg-slate-200 -z-0">
                {/* Active progress fill to step 2 (38%) */}
                <div className="h-full bg-gradient-to-r from-emerald-500 via-sky-600 to-cyan-500 w-[42%]" />
              </div>

              {/* Grid 4 Nấc Bước */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10 text-left sm:text-center">
                
                {/* Nấc 1: Đã cọc giữ xe (Done) */}
                <div className="flex sm:flex-col items-center sm:items-center gap-3.5 sm:gap-2 bg-slate-50/70 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-600/30 shrink-0">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
                      Đã hoàn tất
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                      1. Đã cọc giữ xe
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium max-w-[180px] sm:mx-auto">
                      Xác nhận thanh toán cọc VietQR thành công, xe đã được khóa giữ trên hệ thống.
                    </p>
                  </div>
                </div>

                {/* Nấc 2: Đang kiểm tra & Khử khuẩn (Active) */}
                <div className="flex sm:flex-col items-center sm:items-center gap-3.5 sm:gap-2 bg-sky-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-sky-200 sm:border-none">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sky-700 text-white flex items-center justify-center font-black text-sm shadow-md shadow-sky-700/30 ring-4 ring-sky-200">
                      <Sparkles className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-600" />
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 text-[11px] font-black uppercase">
                      Đang xử lý
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-sky-900 mt-1">
                      2. Kiểm tra &amp; Khử khuẩn
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium max-w-[180px] sm:mx-auto">
                      Kiểm tra áp suất lốp, bình xăng/pin 100% và khử khuẩn nội thất chuẩn y tế.
                    </p>
                  </div>
                </div>

                {/* Nấc 3: Sẵn sàng bàn giao (Upcoming) */}
                <div className="flex sm:flex-col items-center sm:items-center gap-3.5 sm:gap-2 bg-slate-50/70 sm:bg-transparent p-3 sm:p-0 rounded-2xl opacity-75 sm:opacity-100">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                    <KeyRound className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold uppercase">
                      Tiếp theo
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                      3. Sẵn sàng bàn giao
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium max-w-[180px] sm:mx-auto">
                      Điều phối xe đến điểm hẹn, tài xế gọi điện trước 30 phút để đón quý khách.
                    </p>
                  </div>
                </div>

                {/* Nấc 4: Hoàn tất & Trả cọc (Upcoming) */}
                <div className="flex sm:flex-col items-center sm:items-center gap-3.5 sm:gap-2 bg-slate-50/70 sm:bg-transparent p-3 sm:p-0 rounded-2xl opacity-75 sm:opacity-100">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold uppercase">
                      Kết thúc
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                      4. Hoàn tất &amp; Trả cọc
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium max-w-[180px] sm:mx-auto">
                      Ký biên bản nghiệm thu xe và hoàn trả 100% tiền đặt cọc trách nhiệm ngay tại sảnh.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 3. KHU VỰC HIỂN THỊ ĐƠN ĐẶT XE: 2 CỘT CÂN ĐỐI (6 : 6) */}
          {/* ======================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ===================================================================== */}
            {/* CỘT TRÁI (6/12): THẺ VÉ XÁC NHẬN ĐIỆN TỬ (DIGITAL RENTAL VOUCHER) */}
            {/* ===================================================================== */}
            <div className="lg:col-span-6 space-y-6">
              
              <div id="printable-voucher" className="bg-white rounded-3xl border border-sky-200/90 shadow-xl shadow-sky-950/5 overflow-hidden relative">
                
                {/* Thông tin in pháp lý A4 (ẩn trên web, chỉ hiện khi in) */}
                <div className="hidden print:flex items-center justify-between p-6 border-b-2 border-sky-700 bg-white text-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                      🚗
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-sky-950 uppercase tracking-tight">
                        CÔNG TY CỔ PHẦN DỊCH VỤ DU LỊCH &amp; VẬN TẢI DRIVERENT NHA TRANG
                      </h2>
                      <p className="text-xs text-slate-700 font-semibold mt-0.5">
                        Trụ sở chính: 25 Lê Lợi, P. Xương Huân, TP. Nha Trang, Tỉnh Khánh Hòa
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        MST: 4201889999 &bull; GPKD Vận tải đường bộ số 56/GP-SGTVT
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs space-y-0.5">
                    <span className="font-extrabold text-sky-900 block">Hotline 24/7: {hotline}</span>
                    <span className="text-slate-600 font-mono block">Website: https://driverent.vn</span>
                  </div>
                </div>

                {/* Header Dải Màu Vịnh Biển Nha Trang */}
                <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 text-white p-6 sm:p-7 relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top row: Badge vé điện tử & Trạng thái */}
                  <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-xs font-bold text-white tracking-wider uppercase shadow-2xs">
                      <Ticket className="w-3.5 h-3.5 text-cyan-200" />
                      <span>{t('lookup.badge', 'PHIẾU XÁC NHẬN ĐIỆN TỬ')}</span>
                    </div>

                    {/* Status Badge */}
                    {selectedBooking.status === 'confirmed' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-100 border border-emerald-400/40 text-xs font-black backdrop-blur-md shadow-2xs">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span>{t('lookup.status_confirmed', 'ĐÃ XÁC NHẬN CỌC')}</span>
                      </div>
                    )}
                    {selectedBooking.status === 'pending_payment' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 text-amber-100 border border-amber-400/40 text-xs font-black backdrop-blur-md shadow-2xs">
                        <span>{t('lookup.status_pending', 'CHỜ THANH TOÁN')}</span>
                      </div>
                    )}
                    {selectedBooking.status === 'cancelled' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/25 text-rose-100 border border-rose-400/40 text-xs font-black backdrop-blur-md shadow-2xs">
                        <span>{t('lookup.status_cancelled', 'ĐÃ HỦY ĐƠN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Mã Đơn & Nút In Vé */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4 pt-2 relative z-10">
                    <div>
                      <span className="text-xs text-sky-200 uppercase font-black tracking-wider block">
                        Mã đặt xe chính thức
                      </span>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-wider text-white tabular-nums drop-shadow-xs mt-0.5">
                        {selectedBooking.id}
                      </div>
                      <p className="text-xs text-sky-100/90 font-medium mt-1">
                        Ngày tạo: {formatDateTime(selectedBooking.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="min-h-[44px] px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-sky-900 border border-white/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm select-none active:scale-[0.98]"
                      >
                        <Printer className="w-4 h-4" />
                        <span>In vé PDF / A4</span>
                      </button>

                      {selectedBooking.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => setIsCancelConfirmOpen(true)}
                          className="min-h-[44px] px-3.5 py-2 rounded-full bg-rose-500/25 hover:bg-rose-500 text-white border border-rose-300/40 text-xs font-bold transition-all cursor-pointer shadow-sm select-none active:scale-[0.98]"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thân Vé: Thông Tin Xe & QR Quét Bàn Giao */}
                <div className="p-6 sm:p-7 space-y-6">
                  
                  {/* Khối Ảnh Xe & QR Nhận Xe Tại Quầy */}
                  <div className="flex flex-col sm:flex-row gap-5 items-stretch bg-sky-50/70 p-5 rounded-2xl border border-sky-100">
                    <div className="w-28 h-24 rounded-2xl overflow-hidden bg-white shadow-2xs shrink-0 flex items-center justify-center p-2 mx-auto sm:mx-0">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain filter drop-shadow-xs"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-lg">
                          {translateVehicle(vehicle).category}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {vehicle.plateNumber}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 truncate">
                        {vehicle.name}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Hộp số {translateVehicle(vehicle).transmission} &bull; Đời xe {vehicle.year} &bull; Màu {vehicle.color}
                      </p>
                    </div>

                    {/* QR Code Quét Nhận Xe */}
                    <div className="w-28 bg-white p-2.5 rounded-xl border border-sky-200/80 flex flex-col items-center justify-center shrink-0 mx-auto sm:mx-0 shadow-2xs">
                      <svg className="w-16 h-16 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                        <rect x="0" y="0" width="28" height="28" rx="4" fill="currentColor" />
                        <rect x="4" y="4" width="20" height="20" rx="2" fill="white" />
                        <rect x="8" y="8" width="12" height="12" rx="2" fill="currentColor" />

                        <rect x="72" y="0" width="28" height="28" rx="4" fill="currentColor" />
                        <rect x="76" y="4" width="20" height="20" rx="2" fill="white" />
                        <rect x="80" y="8" width="12" height="12" rx="2" fill="currentColor" />

                        <rect x="0" y="72" width="28" height="28" rx="4" fill="currentColor" />
                        <rect x="4" y="76" width="20" height="20" rx="2" fill="white" />
                        <rect x="8" y="80" width="12" height="12" rx="2" fill="currentColor" />

                        <rect x="36" y="8" width="8" height="8" />
                        <rect x="48" y="8" width="8" height="8" />
                        <rect x="36" y="20" width="8" height="8" />
                        <rect x="56" y="20" width="8" height="8" />
                        <rect x="8" y="36" width="8" height="8" />
                        <rect x="20" y="48" width="8" height="8" />
                        <rect x="36" y="36" width="12" height="12" rx="1" fill="#0284c7" />
                        <rect x="52" y="36" width="8" height="8" />
                        <rect x="64" y="36" width="8" height="8" />
                        <rect x="36" y="52" width="8" height="8" />
                        <rect x="48" y="52" width="8" height="8" />
                        <rect x="64" y="52" width="8" height="8" />
                        <rect x="80" y="36" width="8" height="8" />
                        <rect x="80" y="52" width="8" height="8" />
                        <rect x="36" y="68" width="8" height="8" />
                        <rect x="48" y="80" width="8" height="8" />
                        <rect x="64" y="68" width="8" height="8" />
                        <rect x="80" y="80" width="8" height="8" />
                      </svg>
                      <span className="text-[10px] font-black text-sky-950 mt-1 uppercase tracking-tight">
                        Quét nhận xe
                      </span>
                    </div>
                  </div>

                  {/* Lịch trình nhận/trả xe & Nút đổi ngày */}
                  <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium text-xs block">Thời gian thuê:</span>
                      <p className="font-bold text-slate-900">
                        {formatDateTime(selectedBooking.startDate)} &rarr; {formatDateTime(selectedBooking.endDate)}
                      </p>
                      <p className="text-xs text-sky-800 font-semibold">
                        Tổng thời gian: <strong>{selectedBooking.units} ngày</strong>
                      </p>
                    </div>

                    {selectedBooking.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={handleOpenDateChange}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold transition-all cursor-pointer shadow-2xs select-none self-start sm:self-auto print:hidden"
                      >
                        Đổi ngày thuê
                      </button>
                    )}
                  </div>

                  {/* Vết Răng Cưa Cắt Vé Voucher */}
                  <div className="relative py-1 select-none pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-slate-50 border-r border-sky-200 -left-9.5 absolute top-1/2 -translate-y-1/2 shadow-inner" />
                    <div className="w-full border-b-2 border-dashed border-sky-200" />
                    <div className="w-7 h-7 rounded-full bg-slate-50 border-l border-sky-200 -right-9.5 absolute top-1/2 -translate-y-1/2 shadow-inner" />
                  </div>

                  {/* Bảng Chi Tiết Thanh Toán & Tiền Cọc */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Người nhận xe */}
                    <div className="rounded-2xl bg-sky-50/40 p-4 space-y-2.5 text-xs">
                      <span className="text-[11px] font-black text-sky-900 uppercase tracking-wider block pb-1 border-b border-sky-100">
                        Thông tin khách hàng
                      </span>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-500">Họ và tên:</span>
                        <strong className="text-slate-900">{selectedBooking.customerName}</strong>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-500">Số điện thoại:</span>
                        <strong className="text-slate-900 font-mono">{selectedBooking.customerPhone}</strong>
                      </div>
                      {selectedBooking.customerEmail && (
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-500">Email:</span>
                          <span className="text-slate-900 truncate max-w-[140px]">{selectedBooking.customerEmail}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-500">Phương thức:</span>
                        <span className="text-slate-900 font-medium">{selectedBooking.paymentMethod || 'VietQR'}</span>
                      </div>
                    </div>

                    {/* Chi tiết thanh toán */}
                    <div className="rounded-2xl bg-sky-50/40 p-4 space-y-2.5 text-xs">
                      <span className="text-[11px] font-black text-sky-900 uppercase tracking-wider block pb-1 border-b border-sky-100">
                        Chi tiết thanh toán
                      </span>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-500">Tổng tiền dự kiến:</span>
                        <strong className="text-slate-900 font-mono">{formatVND(selectedBooking.totalEstimatedAmount)}</strong>
                      </div>
                      <div className="flex justify-between py-1 bg-white px-2 rounded-lg border border-sky-100 font-bold text-sky-800">
                        <span>Đã cọc giữ xe:</span>
                        <span className="font-mono">{formatVND(selectedBooking.bookingDepositPaid)}</span>
                      </div>
                      <div className="flex justify-between py-0.5 font-bold text-sky-950">
                        <span>Còn lại khi nhận xe:</span>
                        <span className="font-mono">{formatVND(selectedBooking.remainingAmountDue)}</span>
                      </div>
                      <div className="flex justify-between py-0.5 text-slate-500 text-[11px]">
                        <span>Thế chấp trách nhiệm:</span>
                        <span className="font-mono font-bold text-slate-700">{formatVND(selectedBooking.securityDepositOnPickup)} (Hoàn khi trả xe)</span>
                      </div>
                    </div>

                  </div>

                  {/* Dấu Mộc Xác Nhận Điện Tử & Cam Kết Hoàn Cọc */}
                  <div className="pt-4 border-t border-sky-200/60 flex items-center justify-between gap-4 bg-sky-50/30 p-4 rounded-2xl">
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Cam kết hoàn cọc 100% minh bạch</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Phiếu này có giá trị xác nhận đặt cọc điện tử chính thức từ DriveRent Nha Trang.
                      </p>
                    </div>

                    {/* Digital Stamp SVG */}
                    <div className="w-20 h-20 shrink-0 -rotate-6 select-none opacity-90">
                      <svg className="w-full h-full filter drop-shadow-2xs" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="56" fill="#fef2f2" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="5 3" />
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#dc2626" strokeWidth="1.5" />
                        <text x="60" y="38" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="900" letterSpacing="2">★★★</text>
                        <text x="60" y="52" textAnchor="middle" fill="#b91c1c" fontSize="8.5" fontWeight="900">DRIVERENT</text>
                        <text x="60" y="65" textAnchor="middle" fill="#dc2626" fontSize="6.5" fontWeight="700">ĐÃ XÁC NHẬN CỌC</text>
                        <rect x="25" y="83" width="70" height="14" rx="3" fill="#dc2626" />
                        <text x="60" y="93" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900" letterSpacing="0.5">VERIFIED</text>
                      </svg>
                    </div>
                  </div>

                </div>

              </div>

              {/* HỘP THOẠI ĐỔI NGÀY THUÊ XE TRỰC TIẾP */}
              {isChangingDates && (
                <form onSubmit={handleSaveDateChange} className="p-6 rounded-3xl bg-white border-2 border-sky-300 shadow-md space-y-4 animate-in fade-in duration-200 print:hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-700" />
                      <h4 className="font-black text-sm text-slate-900">Đổi Lịch Trình Thuê Xe</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsChangingDates(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Đóng
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Ngày &amp; Giờ nhận xe mới:</label>
                      <input
                        type="datetime-local"
                        value={newStartDate}
                        onChange={(e) => setNewStartDate(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Ngày &amp; Giờ trả xe mới:</label>
                      <input
                        type="datetime-local"
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  {costDelta && (
                    <div className="p-3.5 bg-sky-50 rounded-xl text-xs space-y-2 border border-sky-200">
                      <div className="flex justify-between font-bold">
                        <span>Số ngày mới: {costDelta.newDays} ngày</span>
                        <span>Tổng tiền mới: {formatVND(costDelta.newTotalEstimated)}</span>
                      </div>
                      <div className="flex justify-between text-sky-900 font-bold pt-1 border-t border-sky-200">
                        <span>Chênh lệch chi phí:</span>
                        <span>{costDelta.costDiff >= 0 ? `+${formatVND(costDelta.costDiff)}` : `-${formatVND(Math.abs(costDelta.costDiff))}`}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsChangingDates(false)}
                      className="min-h-[44px] px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="min-h-[44px] px-5 py-2 bg-sky-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer"
                    >
                      Lưu lịch trình mới
                    </button>
                  </div>
                </form>
              )}

              {/* HỘP THOẠI HỦY ĐƠN AN TÂM */}
              {isCancelConfirmOpen && (
                <div className="p-6 rounded-3xl bg-white border-2 border-rose-300 shadow-md space-y-4 animate-in fade-in duration-200 print:hidden">
                  <div className="flex items-center gap-2 text-rose-700 font-black text-sm pb-2 border-b border-rose-100">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>Xác Nhận Hủy Đơn &amp; Hoàn Cọc Linh Hoạt</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Theo chính sách minh bạch của DriveRent, quý khách hủy đơn trước 12 tiếng sẽ được bảo lưu 100% tiền cọc cho lần thuê sau hoặc hoàn tiền vào số tài khoản đã chuyển.
                  </p>
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-700 block">Lý do hủy đơn:</label>
                    <input
                      type="text"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCancelConfirmOpen(false)}
                      className="min-h-[44px] px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      Giữ lại đơn
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCancel}
                      className="min-h-[44px] px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer"
                    >
                      Xác nhận hủy đơn
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* ===================================================================== */}
            {/* CỘT PHẢI (6/12): CHỈ ĐƯỜNG ĐIỂM HẸN + ZALO TÀI XẾ + CHÍNH SÁCH DU KHÁCH */}
            {/* ===================================================================== */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* KHỐI 1: HƯỚNG DẪN ĐƯỜNG ĐI ĐẾN ĐIỂM HẸN NHẬN XE + GOOGLE MAPS */}
              <div className="bg-white rounded-3xl border border-sky-200/90 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3.5 border-b border-sky-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Điểm Hẹn &amp; Chỉ Đường Nhận Xe
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Địa điểm giao nhận theo yêu cầu của đơn
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${pickupGuide.accent}`}>
                    {pickupGuide.badge}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <pickupGuide.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-black text-sm text-slate-900">
                        {pickupGuide.title}
                      </h4>
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        📍 {selectedBooking.pickupLocation}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-sky-100">
                    {pickupGuide.guide}
                  </p>
                </div>

                {/* Nút 1-Chạm: Mở Google Maps Chỉ Đường */}
                <a
                  href={pickupGuide.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 transition-all cursor-pointer select-none"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Mở chỉ đường Google Maps đến điểm nhận xe</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* KHỐI 2: LIÊN HỆ TRỰC TIẾP TÀI XẾ / ĐIỀU PHỐI VIÊN QUA ZALO & CALL */}
              <div className="bg-white rounded-3xl border border-sky-200/90 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3.5 border-b border-sky-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Liên Hệ Đội Điều Phối &amp; Tài Xế Giao Xe
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Túc trực 24/7 đón tiễn sân bay và khách sạn
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Trực ban 24/7
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50/60 to-sky-50 border border-sky-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                      👨‍✈️
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">Điều phối viên phụ trách:</span>
                      <strong className="text-sm font-black text-slate-900 block mt-0.5">
                        Đội xe DriveRent Nha Trang
                      </strong>
                      <span className="text-xs text-emerald-700 font-bold block mt-0.5">
                        ● Đang trực tuyến sẵn sàng giao xe
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-sky-800 bg-white px-2.5 py-1 rounded-lg border border-sky-200 hidden sm:inline-block">
                    {hotline}
                  </span>
                </div>

                {/* 2 Nút Hành Động Tiện Ích Du Khách */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`https://zalo.me/${hotline.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[46px] px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Nhắn Zalo điều phối</span>
                  </a>

                  <a
                    href={`tel:${hotline.replace(/\s+/g, '')}`}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-amber-300" />
                    <span>Gọi Hotline 24/7</span>
                  </a>
                </div>
              </div>

              {/* KHỐI 3: CHÍNH SÁCH HỖ TRỢ ĐỔI GIỜ BAY & BẢO ĐẢM QUYỀN LỢI */}
              <div className="bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white rounded-3xl border border-sky-800/80 p-6 sm:p-7 shadow-lg space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-sky-800/80">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-black text-sm sm:text-base text-white tracking-tight">
                    Cam Kết Đặc Quyền Dành Cho Du Khách
                  </h4>
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base shrink-0">✈️</span>
                    <div>
                      <strong className="text-white block font-bold">Delay chuyến bay? Hoàn toàn miễn phí</strong>
                      <span>Chúng tôi tự động theo dõi số hiệu chuyến bay, giữ xe sạch đẹp và chờ quý khách hạ cánh mà không tính phụ phí trễ giờ.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-base shrink-0">🔄</span>
                    <div>
                      <strong className="text-white block font-bold">Đổi ngày giữ cọc 100%</strong>
                      <span>Nếu lịch trình thay đổi do thời tiết hoặc kế hoạch cá nhân, quý khách được dời lịch và bảo lưu nguyên vẹn số tiền cọc đã đóng.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-base shrink-0">📋</span>
                    <div>
                      <strong className="text-white block font-bold">Thủ tục nhận xe chỉ 5 phút</strong>
                      <span>Chỉ cần xuất trình CCCD gắn chip / VNeID (hoặc Hộ chiếu + Bằng lái quốc tế IDP đối với du khách nước ngoài).</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : null}

      {/* Admin Portal Shortcut nếu đang đăng nhập */}
      {isLoggedIn && (
        <div className="p-4 sm:p-5 bg-sky-50 border border-sky-300 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-sky-950 print:hidden">
          <div>
            <p className="font-bold">{t('action.admin_portal', 'Cổng Quản Trị Hệ Thống')}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAppMode('admin');
              setCustomerTab('home');
            }}
            className="min-h-[44px] px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl shrink-0 transition-colors cursor-pointer shadow-sm shadow-sky-800/20"
          >
            {t('footer.admin_portal_enter', 'Vào trang Admin')}
          </button>
        </div>
      )}

    </div>
  );
};
