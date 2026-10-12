import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Bike,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Fuel,
  Gauge,
  HelpCircle,
  FileCheck,
  CreditCard,
  ShieldAlert
} from 'lucide-react';
import { formatVND, calculateBillableUnits, formatDate, formatDateTime } from '../../utils/formatters';

export const VehicleDetailCustomerView: React.FC = () => {
  const {
    vehicles,
    selectedCustomerVehicleId,
    setCustomerTab,
    customerSearchCriteria,
    setCustomerSearchCriteria,
    checkVehicleAvailability,
    createOnlineBooking,
    setActiveCheckoutBooking
  } = useApp();

  const vehicle = vehicles.find((v) => v.id === selectedCustomerVehicleId) || vehicles[0];

  const [startDate, setStartDate] = useState(customerSearchCriteria.startDate);
  const [endDate, setEndDate] = useState(customerSearchCriteria.endDate);
  const [pricingType, setPricingType] = useState<'daily' | 'hourly'>('daily');
  const [pickupLocation, setPickupLocation] = useState(customerSearchCriteria.pickupLocation);

  // Check availability
  const availability = checkVehicleAvailability(vehicle.id, startDate, endDate);

  // Calculate billable units and pricing
  const { units, durationText } = calculateBillableUnits(startDate, endDate, pricingType);
  const rate = pricingType === 'hourly' ? vehicle.hourlyPrice : vehicle.dailyPrice;
  const rentalFee = units * rate;

  // Delivery fee (airport or hotel delivery e.g. 100k-150k for cars, 0 for office)
  const deliveryFee = pickupLocation.includes('Văn phòng')
    ? 0
    : vehicle.type === 'car'
    ? 150000
    : 50000;

  const totalEstimatedAmount = rentalFee + deliveryFee;

  // Booking deposit configured at 20%
  const bookingDepositRequired = Math.round(totalEstimatedAmount * 0.2);
  const remainingAmountDue = totalEstimatedAmount - bookingDepositRequired;

  // Security deposit when receiving car (isolated!)
  const securityDepositOnPickup = vehicle.type === 'car' ? 5000000 : 1000000;

  const handleStartBooking = () => {
    if (!availability.available) return;

    // Save search criteria
    setCustomerSearchCriteria({
      ...customerSearchCriteria,
      startDate,
      endDate,
      pickupLocation
    });

    // Create draft booking and transition to checkout
    const newBooking = createOnlineBooking({
      vehicleId: vehicle.id,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      pickupLocation,
      startDate,
      endDate,
      pricingType,
      units,
      rate,
      rentalFee,
      deliveryFee,
      totalEstimatedAmount,
      bookingDepositRequired,
      bookingDepositPaid: bookingDepositRequired,
      remainingAmountDue,
      securityDepositOnPickup,
      notes: ''
    });

    if (newBooking) {
      setActiveCheckoutBooking(newBooking);
    }
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => {
            setCustomerTab('vehicles');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white/95 text-slate-700 hover:text-emerald-700 font-bold text-xs border border-white/80 shadow-2xs backdrop-blur-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại danh sách xe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photos, Specs, Policies (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Gallery - Liquid Glass */}
          <div className="bg-white/75 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-2">
            <div className="aspect-16/10 bg-gradient-to-b from-slate-100/40 via-slate-100/70 to-slate-200/50 overflow-hidden relative flex items-center justify-center p-8">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-600/90 text-white backdrop-blur-md border border-emerald-400/30 shadow-sm">
                  {vehicle.category}
                </span>
              </div>
            </div>
          </div>

          {/* Title & Overview - Liquid Glass */}
          <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {vehicle.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Năm sản xuất {vehicle.year} · Hộp số {vehicle.transmission} · Màu {vehicle.color}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Giá thuê ngày</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  {formatVND(vehicle.dailyPrice)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ngày</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200/50 backdrop-blur-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Số km thực tế</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {vehicle.currentOdometer.toLocaleString('vi-VN')} km
                </span>
              </div>
              <div className="p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200/50 backdrop-blur-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nhiên liệu</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.fuelLevel}/8 vạch</span>
              </div>
              <div className="p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200/50 backdrop-blur-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bảo dưỡng gần nhất</span>
                <span className="font-bold text-slate-900 text-xs">{formatDate(vehicle.lastMaintenanceDate)}</span>
              </div>
              <div className="p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200/50 backdrop-blur-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Hạn đăng kiểm</span>
                <span className="font-bold text-slate-900 text-xs">{formatDate(vehicle.registrationExpiry)}</span>
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Trang bị nổi bật trên xe:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50/80 text-emerald-800 border border-emerald-200/60 backdrop-blur-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CRITICAL: DEPOSIT POLICIES EXPLAINED (Requirement!) - Liquid Glass Emerald */}
          <div className="bg-emerald-50/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-[0_8px_30px_rgba(16,185,129,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Chính sách cọc minh bạch: Phân biệt rõ 2 loại cọc
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type 1: Booking deposit */}
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-200/60 shadow-2xs space-y-2">
                <span className="font-extrabold text-emerald-700 text-xs block">
                  1. CỌC GIỮ CHỖ TRỰC TUYẾN (20%)
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  • Là khoản thanh toán trước 20% tiền thuê dự kiến để khóa lịch xe trên hệ thống.<br />
                  • <strong>Được đối trừ 100%</strong> vào tiền thuê xe khi quý khách đến nhận xe.<br />
                  • <strong>Hoàn cọc 100%</strong> nếu quý khách báo hủy trước 24 giờ so với giờ nhận xe.
                </p>
              </div>

              {/* Type 2: Security deposit */}
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                <span className="font-extrabold text-slate-900 text-xs block">
                  2. CỌC BẢO ĐẢM HỢP ĐỒNG (KHI NHẬN XE)
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  • Áp dụng khi làm hợp đồng và nhận xe: <strong>{formatVND(securityDepositOnPickup)}</strong>.<br />
                  • Là khoản tiền bảo đảm tài sản trong quá trình quý khách lưu hành.<br />
                  • <strong>Hoàn trả lại 100%</strong> cho quý khách ngay sau khi trả xe và nghiệm thu hiện trạng.
                </p>
              </div>
            </div>
          </div>

          {/* Rental Requirements & Documents - Liquid Glass */}
          <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-3.5 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Điều kiện thuê & Giấy tờ cần mang khi nhận xe
            </h3>
            <ul className="space-y-2.5 text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Căn cước công dân hoặc Hộ chiếu gốc:</strong> Còn hạn sử dụng (nhân viên chỉ đối chiếu và gửi lại khi hoàn tất hợp đồng).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Giấy phép lái xe hợp lệ:</strong> Hạng A1/A2 (cho xe máy), Hạng B1/B2 trở lên (cho ô tô).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Độ tuổi:</strong> Khách thuê từ đủ 18 tuổi trở lên đối với xe máy, từ 20 tuổi trở lên đối với ô tô.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget (1 col) - Liquid Glass */}
        <div className="space-y-6">
          <div className="bg-white/85 backdrop-blur-3xl rounded-3xl p-6 sm:p-7 border border-white/90 shadow-[0_16px_50px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,1)] sticky top-24 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <h3 className="font-extrabold text-sm text-slate-900">Tính giá & Đặt xe này</h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 backdrop-blur-md">
                Gói tiêu chuẩn
              </span>
            </div>

            {/* Availability Status */}
            {availability.available ? (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-emerald-900 flex items-center gap-2 backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Xe còn trống trong thời gian đã chọn!</span>
              </div>
            ) : (
              <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-rose-900 flex items-center gap-2 backdrop-blur-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{availability.conflictReason || 'Xe đã kín lịch giờ này!'}</span>
              </div>
            )}

            {/* Date Pickers */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Thời gian nhận xe:</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thời gian trả xe:</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa điểm giao nhận:</label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
                >
                  <option value="Văn phòng DriveRent (25 Lê Lợi, TP. Nha Trang)">Văn phòng 25 Lê Lợi, TP. Nha Trang (Miễn phí)</option>
                  <option value="Sân bay Quốc tế Cam Ranh">Sân bay Cam Ranh (+150.000 đ ô tô / 50.000 đ xe máy)</option>
                  <option value="Ga đường sắt Nha Trang">Ga đường sắt Nha Trang</option>
                  <option value="Khách sạn nội thành Nha Trang">Khách sạn nội thành Nha Trang (Đường Trần Phú / Hùng Vương)</option>
                </select>
              </div>
            </div>

            {/* Duration text */}
            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/50 flex justify-between text-slate-600">
              <span>Thời lượng tính:</span>
              <strong className="text-slate-900 font-mono">{durationText}</strong>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tiền thuê xe ({units} ngày × {formatVND(rate)}):</span>
                <span className="font-mono font-bold text-slate-900">{formatVND(rentalFee)}</span>
              </div>

              {deliveryFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Phí giao xe tận nơi:</span>
                  <span className="font-mono text-slate-800">+{formatVND(deliveryFee)}</span>
                </div>
              )}

              <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-slate-200/60">
                <span className="text-slate-900">Tổng tiền dự kiến:</span>
                <span className="font-mono text-emerald-700 text-base">{formatVND(totalEstimatedAmount)}</span>
              </div>

              {/* Deposit Required */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl space-y-1 backdrop-blur-xs">
                <div className="flex justify-between font-extrabold text-emerald-950">
                  <span>CỌC GIỮ CHỖ CẦN THANH TOÁN (20%):</span>
                  <span className="font-mono text-emerald-700 text-base">{formatVND(bookingDepositRequired)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700">
                  <span>Số tiền còn lại thanh toán khi nhận xe:</span>
                  <span className="font-mono font-semibold">{formatVND(remainingAmountDue)}</span>
                </div>
              </div>

              {/* Security Deposit Note */}
              <div className="p-2.5 bg-slate-100/60 rounded-xl text-[11px] text-slate-500">
                * Tiền cọc bảo đảm hợp đồng <strong>{formatVND(securityDepositOnPickup)}</strong> sẽ gửi khi nhận xe và hoàn trả 100% khi trả xe.
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleStartBooking}
              disabled={!availability.available}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
              <span>Tiến hành đặt xe & Thanh toán cọc</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
