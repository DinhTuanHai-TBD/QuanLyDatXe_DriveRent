import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBannerSlider } from '../../components/customer/HeroBannerSlider';
import {
  Car,
  Bike,
  Search,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export const HomeCustomerView: React.FC = () => {
  const { vehicles, setCustomerTab, settings } = useApp();

  // Bộ lọc tìm kiếm nhanh nổi
  const [vehicleType, setVehicleType] = useState<'all' | 'car' | 'motorbike'>('all');
  const [pickupLocation, setPickupLocation] = useState('Văn phòng DriveRent (25 Lê Lợi, TP. Nha Trang)');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Accordion FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Đội xe tiêu biểu (lọc hiển thị 4 xe)
  const featuredVehicles = vehicles.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerTab('vehicles');
  };

  const handleSelectVehicle = (vehicleId: string) => {
    sessionStorage.setItem('selected_vehicle_id', vehicleId);
    setCustomerTab('vehicles');
  };

  const qualityStandards = [
    {
      step: '01',
      title: 'Kiểm định 12 hạng mục',
      desc: '100% xe được test phanh, lốp, áp suất và động cơ trước khi lăn bánh giao khách.'
    },
    {
      step: '02',
      title: 'Khử khuẩn & Rửa xe sạch',
      desc: 'Khoang nội thất được xịt khử mùi ion âm, rửa xe sạch bóng trước từng cuốc thuê.'
    },
    {
      step: '03',
      title: 'Hồ sơ pháp lý minh bạch',
      desc: 'Bảo hiểm dân sự & tự nguyện đầy đủ, giấy đăng kiểm còn hạn trên 6 tháng.'
    },
    {
      step: '04',
      title: 'Cứu hộ lưu động 24/7',
      desc: 'Hỗ trợ đổi xe thay thế trong 45 phút nếu gặp sự cố kỹ thuật ngoài ý muốn.'
    }
  ];

  const faqs = [
    {
      q: 'Thủ tục thuê xe tự lái tại DriveRent cần chuẩn bị những gì?',
      a: 'Quý khách chỉ cần: 1. Căn cước công dân (CCCD gắn chip) hoặc Hộ chiếu (Passport); 2. Giấy phép lái xe (GPLX hạng B1/B2 đối với ô tô, A1/A2 đối với xe máy) còn hạn sử dụng; 3. Khoản tiền cọc trách nhiệm hợp đồng (từ 5 - 15 triệu tùy dòng ô tô, hoặc 1 - 2 triệu đối với xe máy), cọc sẽ được hoàn trả 100% ngay khi kết thúc bàn giao xe.'
    },
    {
      q: 'Quy tắc tính thời gian thuê xe tại DriveRent như thế nào?',
      a: 'DriveRent áp dụng quy tắc rõ ràng: Thuê theo ngày tính trọn vẹn 24 giờ kể từ thời điểm nhận xe thực tế (làm tròn lên ngày kế tiếp nếu quá giờ quy định). Thuê theo giờ tính làm tròn lên số giờ thực tế, tối thiểu 1 giờ. Chúng tôi không tự ý hoán đổi giữa các gói để luôn đảm bảo quyền lợi tốt nhất cho khách hàng.'
    },
    {
      q: 'Chính sách hủy đơn đặt xe và hoàn tiền cọc giữ chỗ ra sao?',
      a: 'Hủy trước 24 giờ so với giờ nhận xe sẽ được hoàn trả 100% tiền cọc giữ chỗ. Hủy trong vòng 24 giờ sẽ áp dụng phí xử lý giữ xe theo quy chế của cửa hàng.'
    }
  ];

  return (
    <div className="space-y-20 pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-100/70 min-h-screen">
      {/* 1. HERO BANNER SLIDER (FULL WIDTH LIQUID GLASS) */}
      <HeroBannerSlider onExploreClick={() => setCustomerTab('vehicles')} />

      {/* 2. KHUNG TÌM KIẾM NỔI LIQUID GLASS */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 -mt-12 sm:-mt-16 relative z-30">
        <div className="bg-white/80 hover:bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-white/60 transition-all">
          <form onSubmit={handleSearchSubmit} className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200/50 gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Tìm & Kiểm tra xe còn trống theo thời gian</span>
              </span>

              <div className="flex items-center gap-1.5 p-1.5 bg-white/60 backdrop-blur-md rounded-2xl text-xs font-bold w-fit border border-white/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => setVehicleType('all')}
                  className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                    vehicleType === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả xe
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('car')}
                  className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                    vehicleType === 'car'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ô tô tự lái
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('motorbike')}
                  className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                    vehicleType === 'motorbike'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Xe máy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Địa điểm nhận xe</span>
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-xs shadow-2xs"
                >
                  <option value="Văn phòng DriveRent (25 Lê Lợi, TP. Nha Trang)">
                    Văn phòng DriveRent (25 Lê Lợi, TP. Nha Trang)
                  </option>
                  <option value="Sân bay Quốc tế Cam Ranh">
                    Sân bay Quốc tế Cam Ranh (Giao tận cổng ga)
                  </option>
                  <option value="Ga đường sắt Nha Trang">Ga đường sắt Nha Trang</option>
                  <option value="Khách sạn / Resort nội thành Nha Trang">
                    Khách sạn / Resort nội thành Nha Trang
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ngày & Giờ nhận xe *</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-xs shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ngày & Giờ trả xe *</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-xs shadow-2xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer border border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Tìm xe còn trống</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 3. BỘ SƯU TẬP XE TIÊU BIỂU (THẺ XE LIQUID GLASS) */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-2 border-b border-slate-200/60">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Phương tiện tiêu biểu
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Danh sách xe nổi bật được yêu thích nhất
            </h2>
          </div>
          <button
            onClick={() => setCustomerTab('vehicles')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <span>Xem toàn bộ {vehicles.length} xe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white/70 hover:bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                <div className="relative aspect-4/3 bg-gradient-to-b from-slate-50/80 via-slate-100/60 to-slate-200/40 overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/75 backdrop-blur-md text-slate-800 shadow-2xs border border-white/70">
                      {v.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-extrabold text-base text-slate-900 truncate">{v.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {v.transmission} · Đời {v.year} · {v.color}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {v.features.slice(0, 2).map((feat, idx) => (
                      <span key={idx} className="text-[10px] text-slate-600 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-medium border border-slate-200/60">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-200/40 mt-2 space-y-3">
                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Giá thuê ngày</span>
                    <span className="text-base font-black text-emerald-700 font-mono">
                      {formatVND(v.dailyPrice)}/ngày
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono font-bold">
                    {formatVND(v.hourlyPrice)}/h
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSelectVehicle(v.id)}
                    className="w-full py-2.5 px-2 text-xs font-bold text-slate-700 bg-white/70 hover:bg-white rounded-xl text-center cursor-pointer transition-all border border-slate-200/70 shadow-2xs"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleSelectVehicle(v.id)}
                    className="w-full py-2.5 px-2 text-xs font-bold text-white bg-slate-900/95 hover:bg-emerald-600 rounded-xl text-center shadow-md hover:shadow-lg cursor-pointer transition-all border border-white/20"
                  >
                    Đặt xe này
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MỤC GIỚI THIỆU & CAM KẾT CHẤT LƯỢNG (LIQUID GLASS) */}
      <section className="bg-white/40 backdrop-blur-2xl py-20 px-4 sm:px-8 border-y border-white/60">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Về thương hiệu cho thuê xe DriveRent
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Người bạn đồng hành tin cậy trên mọi cung đường
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                DriveRent khởi đầu từ mong muốn mang lại trải nghiệm thuê xe tự lái minh bạch, văn minh và an tâm nhất cho du khách khi đến tham quan các thành phố du lịch.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Chúng tôi xóa bỏ nỗi lo xe cũ máy yếu, hỏng vặt giữa đèo hoặc chi phí phụ thu mập mờ bằng việc chuẩn hóa 100% đội xe đời mới, hợp đồng số hóa rõ ràng và quy trình cọc giữ chỗ trực tuyến tiện lợi.
              </p>

              <div className="grid grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-3xl bg-white/75 hover:bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] text-center transition-all">
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">100%</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5">Xe đời mới</p>
                  <p className="text-[10px] text-slate-400">2023 - 2025</p>
                </div>
                <div className="p-4 rounded-3xl bg-white/75 hover:bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] text-center transition-all">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">24/7</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5">Cứu hộ tận nơi</p>
                  <p className="text-[10px] text-slate-400">Sân bay, khách sạn</p>
                </div>
                <div className="p-4 rounded-3xl bg-white/75 hover:bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] text-center transition-all">
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">0 đ</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5">Phí ẩn phát sinh</p>
                  <p className="text-[10px] text-slate-400">Hợp đồng rõ ràng</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white/75 hover:bg-white/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-3.5 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center border border-emerald-500/20 shadow-xs">
                  <Car className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">Đội ô tô tự lái</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Sedan 5 chỗ (Vios, Accent, Mazda 3), MPV 7 chỗ (Xpander, Veloz) và SUV gầm cao phục vụ gia đình, trang bị camera hành trình và Apple CarPlay.
                </p>
                <span className="inline-block text-[11px] font-bold text-emerald-800 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                  Chỉ từ 750k/ngày
                </span>
              </div>

              <div className="bg-white/75 hover:bg-white/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-3.5 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-slate-900/10 text-slate-900 flex items-center justify-center border border-slate-900/20 shadow-xs">
                  <Bike className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">Đội xe máy du lịch</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Xe ga (Vision, Air Blade, Lead) và xe số (Wave Alpha) máy khỏe, tiết kiệm xăng, leo đèo đầm chắc, trang bị sẵn 2 mũ bảo hiểm đạt chuẩn và áo mưa.
                </p>
                <span className="inline-block text-[11px] font-bold text-slate-800 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Chỉ từ 130k/ngày
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/50">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-8">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Quy trình chuẩn hóa
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                4 Tiêu chuẩn bàn giao xe an toàn tuyệt đối
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {qualityStandards.map((std) => (
                <div key={std.step} className="bg-white/75 hover:bg-white/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-2.5 transition-all">
                  <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {std.step}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">{std.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{std.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUY TRÌNH THUÊ XE 4 BƯỚC ĐƠN GIẢN (LIQUID GLASS) */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Thủ tục đơn giản
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Chỉ 4 bước để bắt đầu chuyến hành trình
          </h2>
          <p className="text-xs text-slate-500">
            Không cần thủ tục rườm rà, hỗ trợ giữ chỗ trực tuyến mọi lúc mọi nơi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white/75 hover:bg-white/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-2.5 transition-all">
            <span className="text-xs font-black text-slate-900 font-mono bg-slate-100 px-3 py-1 rounded-xl">
              Bước 1
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Chọn xe & Lịch trình</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Lựa chọn dòng xe phù hợp với nhu cầu và chọn khung giờ nhận/trả xe thuận tiện.
            </p>
          </div>

          <div className="bg-white/75 hover:bg-white/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-2.5 transition-all">
            <span className="text-xs font-black text-emerald-800 font-mono bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/20">
              Bước 2
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Đặt cọc 20% giữ chỗ</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Quét mã QR chuyển khoản giữ chỗ trong 10 phút, hệ thống tự động khóa lịch xe cho bạn.
            </p>
          </div>

          <div className="bg-white/75 hover:bg-white/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-2.5 transition-all">
            <span className="text-xs font-black text-slate-900 font-mono bg-slate-100 px-3 py-1 rounded-xl">
              Bước 3
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Nhận xe & Ký hợp đồng</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Đối chiếu CCCD/GPLX gốc, kiểm tra 6 hạng mục xe và nhận bàn giao xe sạch đẹp.
            </p>
          </div>

          <div className="bg-white/75 hover:bg-white/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-2.5 transition-all">
            <span className="text-xs font-black text-emerald-800 font-mono bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/20">
              Bước 4
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Hoàn trả xe & Nhận lại cọc</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Quyết toán chi phí minh bạch, nhận lại 100% tiền cọc hợp đồng ngay khi trả xe.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION & HỖ TRỢ (LIQUID GLASS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Giải đáp thắc mắc
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Câu hỏi thường gặp khi thuê xe
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/75 hover:bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-emerald-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 pt-3.5 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Banner Liquid Glass Dark */}
        <div className="p-8 rounded-3xl bg-slate-950/85 hover:bg-slate-950/90 text-white flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-2xl border border-white/20 shadow-2xl transition-all">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="font-extrabold text-base">Bạn cần tư vấn thêm lịch trình hoặc loại xe?</h4>
            <p className="text-xs text-slate-300 font-medium">Đội ngũ DriveRent hỗ trợ trực tiếp 24/7 không ngày nghỉ.</p>
          </div>
          <a
            href={`tel:${settings.hotline.replace(/\s+/g, '')}`}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shrink-0 transition-all shadow-xl border border-white/20 hover:scale-105 active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gọi ngay: {settings.hotline}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
