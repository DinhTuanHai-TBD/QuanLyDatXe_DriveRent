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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => {
            setCustomerTab('vehicles');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách xe</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photos, Specs, Policies (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Gallery */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs space-y-2">
            <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-sky-600 text-white shadow-xs">
                  {vehicle.category}
                </span>
              </div>
            </div>
          </div>

          {/* Title & Overview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {vehicle.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Năm sản xuất {vehicle.year} · Hộp số {vehicle.transmission} · Màu {vehicle.color}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Giá thuê ngày</span>
                <span className="text-2xl font-black text-sky-700 font-mono">
                  {formatVND(vehicle.dailyPrice)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ngày (24h)</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Số km thực tế</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {vehicle.currentOdometer.toLocaleString('vi-VN')} km
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nhiên liệu</span>
                <span className="font-bold text-slate-900 text-sm">{vehicle.fuelLevel}/8 vạch</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bảo dưỡng gần nhất</span>
                <span className="font-bold text-slate-900 text-xs">{formatDate(vehicle.lastMaintenanceDate)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Hạn đăng kiểm</span>
                <span className="font-bold text-slate-900 text-xs">{formatDate(vehicle.registrationExpiry)}</span>
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Trang bị nổi bật trên xe:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-100 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CRITICAL: DEPOSIT POLICIES EXPLAINED (Requirement!) */}
          <div className="bg-sky-50/70 rounded-2xl p-6 border border-sky-200 space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-700" />
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                Chính sách cọc minh bạch: Phân biệt rõ 2 loại cọc
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type 1: Booking deposit */}
              <div className="bg-white p-4 rounded-xl border border-sky-200/80 shadow-2xs space-y-2">
                <span className="font-extrabold text-sky-700 text-xs block">
                  1. CỌC GIỮ CHỖ TRỰC TUYẾN (20%)
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  • Là khoản thanh toán trước 20% tiền thuê dự kiến để khóa lịch xe trên hệ thống.<br />
                  • <strong>Được đối trừ 100%</strong> vào tiền thuê xe khi quý khách đến nhận xe.<br />
                  • <strong>Hoàn cọc 100%</strong> nếu quý khách báo hủy trước 24 giờ so với giờ nhận xe.
                </p>
              </div>

              {/* Type 2: Security deposit */}
              <div className="bg-white p-4 rounded-xl border border-sky-200/80 shadow-2xs space-y-2">
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

          {/* Rental Requirements & Documents */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Điều kiện thuê & Giấy tờ cần mang khi nhận xe
            </h3>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Căn cước công dân hoặc Hộ chiếu gốc:</strong> Còn hạn sử dụng (nhân viên chỉ đối chiếu và gửi lại khi hoàn tất hợp đồng).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Giấy phép lái xe hợp lệ:</strong> Hạng A1/A2 (cho xe máy), Hạng B1/B2 trở lên (cho ô tô).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Độ tuổi:</strong> Khách thuê từ đủ 18 tuổi trở lên đối với xe máy, từ 20 tuổi trở lên đối với ô tô.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md sticky top-20 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Tính giá & Đặt xe này</h3>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Gói 24h
              </span>
            </div>

            {/* Availability Status */}
            {availability.available ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Xe còn trống trong thời gian đã chọn!</span>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-center gap-2">
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thời gian trả xe:</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa điểm giao nhận:</label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  <option value="Văn phòng DriveRent (25 Lê Lợi, TP. Nha Trang)">Văn phòng 25 Lê Lợi, TP. Nha Trang (Miễn phí)</option>
                  <option value="Sân bay Quốc tế Cam Ranh">Sân bay Cam Ranh (+150.000 đ ô tô / 50.000 đ xe máy)</option>
                  <option value="Ga đường sắt Nha Trang">Ga đường sắt Nha Trang</option>
                  <option value="Khách sạn nội thành Nha Trang">Khách sạn nội thành Nha Trang (Đường Trần Phú / Hùng Vương)</option>
                </select>
              </div>
            </div>

            {/* Duration text */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between text-slate-600">
              <span>Thời lượng tính:</span>
              <strong className="text-slate-900 font-mono">{durationText}</strong>
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
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

              <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-slate-200">
                <span className="text-slate-900">Tổng tiền dự kiến:</span>
                <span className="font-mono text-sky-700 text-base">{formatVND(totalEstimatedAmount)}</span>
              </div>

              {/* Deposit Required */}
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
                <div className="flex justify-between font-extrabold text-sky-950">
                  <span>CỌC GIỮ CHỖ CẦN THANH TOÁN (20%):</span>
                  <span className="font-mono text-sky-700 text-base">{formatVND(bookingDepositRequired)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-sky-700">
                  <span>Số tiền còn lại thanh toán khi nhận xe:</span>
                  <span className="font-mono font-semibold">{formatVND(remainingAmountDue)}</span>
                </div>
              </div>

              {/* Security Deposit Note */}
              <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500">
                * Tiền cọc bảo đảm hợp đồng <strong>{formatVND(securityDepositOnPickup)}</strong> sẽ gửi khi nhận xe và hoàn trả 100% khi trả xe.
              </div>
            </div>

            {/* Action button - Sunset Orange CTA */}
            <button
              onClick={handleStartBooking}
              disabled={!availability.available}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-sm shadow-orange-500/20 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
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
