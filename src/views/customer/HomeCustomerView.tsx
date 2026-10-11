import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Bike,
  Calendar,
  Clock,
  MapPin,
  Search,
  CheckCircle2,
  ShieldCheck,
  Fuel,
  ArrowRight,
  HelpCircle,
  Sparkles,
  PhoneCall,
  ChevronDown
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export const HomeCustomerView: React.FC = () => {
  const {
    vehicles,
    setCustomerTab,
    setSelectedCustomerVehicleId,
    customerSearchCriteria,
    setCustomerSearchCriteria,
    checkVehicleAvailability
  } = useApp();

  // Local search widget inputs
  const [vehicleType, setVehicleType] = useState(customerSearchCriteria.vehicleType || 'all');
  const [startDate, setStartDate] = useState(customerSearchCriteria.startDate);
  const [endDate, setEndDate] = useState(customerSearchCriteria.endDate);
  const [pickupLocation, setPickupLocation] = useState(customerSearchCriteria.pickupLocation);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerSearchCriteria({
      vehicleType,
      startDate,
      endDate,
      pickupLocation
    });
    setCustomerTab('vehicles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedCustomerVehicleId(vehicleId);
    setCustomerTab('vehicle_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured vehicles (4 vehicles)
  const featuredVehicles = vehicles.slice(0, 4);

  const faqs = [
    {
      q: 'Cần những giấy tờ gì khi đến nhận xe tự lái tại DriveRent?',
      a: 'Quý khách chỉ cần mang theo: (1) Căn cước công dân hoặc Hộ chiếu gốc còn thời hạn; (2) Giấy phép lái xe hợp lệ tương ứng với loại xe thuê (Hạng A1/A2 đối với xe máy, Hạng B1/B2 trở lên đối với ô tô). Nhân viên sẽ đối chiếu và gửi lại giấy tờ cho quý khách ngay khi ký hợp đồng.'
    },
    {
      q: 'Tiền cọc giữ chỗ trực tuyến khác gì với tiền cọc bảo đảm hợp đồng khi nhận xe?',
      a: 'Tiền cọc giữ chỗ trực tuyến (thường là 20% tiền thuê dự kiến) nhằm đảm bảo xe được khóa lịch và giữ riêng cho quý khách trên hệ thống. Khoản này sẽ được đối trừ trực tiếp vào tiền thuê xe. Còn tiền cọc bảo đảm hợp đồng (5.000.000 đ cho ô tô hoặc 1.000.000 đ cho xe máy) sẽ được gửi lại 100% cho quý khách ngay khi bàn giao lại xe nguyên vẹn.'
    },
    {
      q: 'Quy tắc tính thời gian thuê xe tại DriveRent như thế nào?',
      a: 'DriveRent áp dụng quy tắc rõ ràng: Thuê theo ngày tính trọn vẹn 24 giờ kể từ thời điểm nhận xe thực tế (làm tròn lên ngày kế tiếp nếu quá giờ quy định). Thuê theo giờ tính làm tròn lên số giờ thực tế, tối thiểu 1 giờ. Chúng tôi không tự ý hoán đổi giữa các gói để luôn đảm bảo quyền lợi tốt nhất cho khách hàng.'
    },
    {
      q: 'Chính sách hủy đơn đặt xe và hoàn tiền cọc giữ chỗ ra sao?',
      a: 'Nếu kế hoạch chuyến đi thay đổi, quý khách có thể gửi yêu cầu hủy trên trang "Tra cứu đặt xe" hoặc liên hệ hotline. Hủy trước 24 giờ so với giờ nhận xe sẽ được hoàn trả 100% tiền cọc giữ chỗ. Hủy trong vòng 24 giờ sẽ áp dụng phí xử lý giữ xe theo quy chế của cửa hàng.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION - COASTAL BREEZE GRADIENT */}
      <section className="relative bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white pt-14 pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Subtle decorative glow circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Dịch vụ cho thuê xe du lịch uy tín tại TP. Nha Trang</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-xs">
              Thuê xe dễ dàng cho hành trình của bạn
            </h1>

            <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-xl">
              Trải nghiệm vi vu Nha Trang, Bãi Dài Cam Ranh, Dốc Lết, đèo Lương Sơn và vịnh Vĩnh Hy với đội xe máy và ô tô tự lái đời mới, sạch sẽ, máy êm và thủ tục giữ chỗ trực tuyến nhanh chóng.
            </p>
          </div>

          {/* QUICK SEARCH WIDGET CARD */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 text-slate-900 shadow-xl border border-slate-200/80">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-sky-600" />
                  Tìm & Kiểm tra xe còn trống theo thời gian
                </span>

                {/* Segmented type selector */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setVehicleType('all')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      vehicleType === 'all'
                        ? 'bg-white text-sky-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả xe
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('car')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      vehicleType === 'car'
                        ? 'bg-white text-sky-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ô tô tự lái
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('motorbike')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      vehicleType === 'motorbike'
                        ? 'bg-white text-sky-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Xe máy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Pickup Location */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    <span>Địa điểm nhận xe</span>
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 font-medium text-slate-800 text-xs cursor-pointer"
                  >
                    <option value="Văn phòng DriveRent (25 Lê Lợi, TP. Nha Trang)">
                      Văn phòng DriveRent (25 Lê Lợi, TP. Nha Trang)
                    </option>
                    <option value="Sân bay Quốc tế Cam Ranh">
                      Sân bay Quốc tế Cam Ranh (Giao tận cổng ga)
                    </option>
                    <option value="Ga đường sắt Nha Trang">Ga đường sắt Nha Trang</option>
                    <option value="Khách sạn nội thành Nha Trang (Đường Trần Phú / Hùng Vương)">
                      Khách sạn nội thành Nha Trang (Đường Trần Phú / Hùng Vương)
                    </option>
                  </select>
                </div>

                {/* Pickup Date Time */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ngày & Giờ nhận xe *</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 font-medium text-slate-800 text-xs"
                  />
                </div>

                {/* Return Date Time */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ngày & Giờ trả xe *</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 font-medium text-slate-800 text-xs"
                  />
                </div>

                {/* Submit button - Sunset Orange CTA */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Tìm xe còn trống</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* COMPACT ABOUT SECTION (GIỚI THIỆU GỌN GÀNG TRỰC TIẾP TRÊN TRANG CHỦ) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Story & Intro */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Về DriveRent Nha Trang · 25 Lê Lợi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Người bạn đồng hành tin cậy trên mọi cung đường biển
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tọa lạc tại <strong className="text-slate-900 font-bold">25 Lê Lợi, Phường Xương Huân, TP. Nha Trang</strong> (cách biển Trần Phú và Chợ Đầm chỉ 2 phút di chuyển), DriveRent cung cấp đội xe máy du lịch và ô tô tự lái đời mới được tuyển chọn nghiêm ngặt. Chúng tôi cam kết trải nghiệm di chuyển tự do, minh bạch 100% không chi phí ẩn, cùng quy trình kiểm tra bảo dưỡng và bàn giao đối chiếu chuẩn mực.
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span className="font-extrabold text-xs text-slate-900">Bảo dưỡng định kỳ</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Kiểm tra thắng, lốp, động cơ và vệ sinh sạch sẽ sau mỗi lượt khách.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="font-extrabold text-xs text-slate-900">Giao nhận tận nơi</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Tại 25 Lê Lợi, Sân bay Cam Ranh, Ga xe lửa & khách sạn nội thành.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-xs text-slate-900">Cứu hộ 24/7</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Hỗ trợ nhanh trong 15-25 phút nội thành khi có sự cố phát sinh.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Location & Stats Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-5 sm:p-6 space-y-4 border border-slate-700 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Văn phòng DriveRent</h4>
                    <span className="text-[10px] text-slate-400">Trụ sở chính tại TP. Nha Trang</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  06:00 - 22:00
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">25 Lê Lợi, Phường Xương Huân, TP. Nha Trang, Khánh Hòa</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-slate-200 font-bold">Hotline: 0905 888 999 (Zalo / Gọi 24/7)</span>
                </div>
              </div>

              {/* Quick Distance Badges */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                  🌊 <span className="text-slate-200 font-semibold">Biển Trần Phú:</span> 2 phút
                </div>
                <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                  🛍️ <span className="text-slate-200 font-semibold">Chợ Đầm:</span> 3 phút
                </div>
                <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                  🚂 <span className="text-slate-200 font-semibold">Ga Nha Trang:</span> 6 phút
                </div>
                <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                  ✈️ <span className="text-slate-200 font-semibold">Sân bay Cam Ranh:</span> 35 phút
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
              Phương tiện tiêu biểu
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Danh sách xe nổi bật được yêu thích nhất
            </h2>
          </div>
          <button
            onClick={() => setCustomerTab('vehicles')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
          >
            <span>Xem tất cả {vehicles.length} xe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredVehicles.map((v) => {
            const availability = checkVehicleAvailability(v.id, startDate, endDate);
            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs">
                        {v.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 truncate">{v.name}</h3>
                    <p className="text-xs text-slate-500">
                      {v.transmission} · Đời {v.year} · {v.color}
                    </p>

                    {/* Features badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {v.features.slice(0, 2).map((feat, idx) => (
                        <span key={idx} className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-2 space-y-3">
                  <div className="flex items-baseline justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Giá thuê ngày</span>
                      <span className="text-sm font-extrabold text-sky-700 font-mono">
                        {formatVND(v.dailyPrice)}/ngày
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatVND(v.hourlyPrice)}/h
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSelectVehicle(v.id)}
                      className="w-full py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center cursor-pointer transition-colors"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleSelectVehicle(v.id)}
                      className="w-full py-2 px-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-lg text-center shadow-xs shadow-orange-500/20 cursor-pointer transition-all"
                    >
                      Đặt xe này
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 CORE SERVICE BENEFITS */}
      <section className="bg-slate-100 py-12 px-4 sm:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Cam kết dịch vụ
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Lợi ích khi lựa chọn thuê xe tại DriveRent
            </h2>
            <p className="text-xs text-slate-600">
              Mọi thủ tục đều rõ ràng, bảo vệ quyền lợi tối đa cho khách hàng du lịch
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Báo giá minh bạch, rõ ràng</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đơn giá niêm yết công khai theo ngày và giờ. Không tự ý phát sinh phụ phí ẩn khi bàn giao xe.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Thông tin xe đầy đủ 100%</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ảnh chụp thực tế, biển số thật, số km hiện tại và hạn đăng kiểm bảo hiểm luôn cập nhật chính xác.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Giao nhận có biên bản đối chiếu</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kiểm tra 6 hạng mục kỹ thuật, chụp ảnh hiện trạng lúc nhận và lúc trả để đối chiếu công bằng.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Hỗ trợ khách hàng 24/7</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đội ngũ kỹ thuật viên luôn sẵn sàng hỗ trợ chỉ đường, hướng dẫn vận hành và cứu hộ khẩn cấp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RENTAL WORKFLOW (5 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Quy trình tiện lợi
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            5 bước thuê xe đơn giản tại DriveRent
          </h2>
          <p className="text-xs text-slate-600">
            Giữ chỗ nhanh chóng trực tuyến, nhận xe tiện lợi ngay tại sân bay hoặc khách sạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Chọn xe & Lịch thuê', desc: 'Chọn mẫu xe máy hoặc ô tô phù hợp với lịch trình du lịch.' },
            { step: '02', title: 'Điền thông tin', desc: 'Nhập họ tên, số điện thoại và địa điểm nhận xe thuận tiện.' },
            { step: '03', title: 'Cọc giữ chỗ online', desc: 'Thanh toán cọc giữ chỗ 20% qua chuyển khoản hoặc ví điện tử.' },
            { step: '04', title: 'Nhận mã xác nhận', desc: 'Hệ thống xác minh và cấp mã đặt xe cùng biên lai tức thì.' },
            { step: '05', title: 'Nhận xe & Ký hợp đồng', desc: 'Mang CCCD/GPLX đến nhận xe, đối chiếu tình trạng và vi vu.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-sky-600 font-black text-xl font-mono">{item.step}</span>
              <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Giải đáp thắc mắc
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Câu hỏi thường gặp của khách hàng
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-sky-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA BANNER - COASTAL BREEZE & SUNSET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-sky-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sẵn sàng cho chuyến du lịch Nha Trang tuyệt vời?
            </h3>
            <p className="text-sky-100 text-xs sm:text-sm max-w-xl">
              Kiểm tra lịch xe còn trống và đặt cọc giữ chỗ ngay hôm nay để nhận xe đúng giờ tại sân bay Cam Ranh hoặc 25 Lê Lợi!
            </p>
          </div>
          <button
            onClick={() => {
              setCustomerTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-7 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/30 text-sm shrink-0 transition-all cursor-pointer relative z-10"
          >
            Xem danh sách xe & Đặt giữ chỗ
          </button>
        </div>
      </section>
    </div>
  );
};
