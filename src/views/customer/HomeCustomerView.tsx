import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBannerSlider } from '../../components/customer/HeroBannerSlider';
import {
  Car,
  Bike,
  Calendar,
  Clock,
  MapPin,
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Sparkles,
  PhoneCall,
  ChevronDown,
  Star
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export const HomeCustomerView: React.FC = () => {
  const {
    vehicles,
    setCustomerTab,
    setSelectedCustomerVehicleId,
    customerSearchCriteria,
    setCustomerSearchCriteria,
    settings
  } = useApp();

  const [vehicleType, setVehicleType] = useState(customerSearchCriteria.vehicleType || 'all');
  const [startDate, setStartDate] = useState(customerSearchCriteria.startDate);
  const [endDate, setEndDate] = useState(customerSearchCriteria.endDate);
  const [pickupLocation, setPickupLocation] = useState(customerSearchCriteria.pickupLocation);
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

  const featuredVehicles = vehicles.slice(0, 4);

  const qualityStandards = [
    {
      step: '01',
      title: 'Đo kiểm 12 hạng mục kỹ thuật',
      desc: 'Hệ thống phanh, áp suất lốp, mức dầu nhớt, nước mát, còi đèn và bình ắc quy được kiểm tra trước mỗi lượt giao xe.'
    },
    {
      step: '02',
      title: 'Vệ sinh & diệt khuẩn 100%',
      desc: 'Hút bụi toàn diện, lau bề mặt bằng dung dịch kháng khuẩn chuyên dụng, khử mùi điều hòa và rửa vỏ xe sạch bóng.'
    },
    {
      step: '03',
      title: 'Trang bị phụ kiện & giấy tờ hợp lệ',
      desc: '2 mũ bảo hiểm đạt chuẩn, áo mưa DriveRent, giá đỡ điện thoại dẫn đường và bản sao công chứng Cavet kèm bảo hiểm.'
    },
    {
      step: '04',
      title: 'Biên bản bàn giao minh bạch 2 chiều',
      desc: 'Chụp ảnh 4 góc xe, ghi nhận chính xác đồng hồ ODO và vạch xăng. Có chữ ký xác nhận của cả khách hàng và nhân viên.'
    }
  ];

  const faqs = [
    {
      q: 'Cần những giấy tờ gì khi đến nhận xe tự lái tại DriveRent?',
      a: 'Quý khách chỉ cần mang theo: (1) Căn cước công dân hoặc Hộ chiếu gốc còn thời hạn; (2) Giấy phép lái xe hợp lệ tương ứng với loại xe thuê (Hạng A1/A2 đối với xe máy, Hạng B1/B2 trở lên đối với ô tô).'
    },
    {
      q: 'Tiền cọc giữ chỗ trực tuyến khác gì với tiền cọc bảo đảm hợp đồng khi nhận xe?',
      a: 'Tiền cọc giữ chỗ trực tuyến (20% tiền thuê dự kiến) nhằm đảm bảo xe được khóa lịch và giữ riêng cho quý khách trong 10 phút. Khoản này sẽ được đối trừ trực tiếp vào tiền thuê xe. Còn tiền cọc bảo đảm hợp đồng (5.000.000 đ cho ô tô hoặc 1.000.000 đ cho xe máy) sẽ được gửi lại 100% cho quý khách ngay khi bàn giao lại xe nguyên vẹn.'
    },
    {
      q: 'Quy tắc tính thời gian thuê xe tại DriveRent như thế nào?',
      a: 'DriveRent áp dụng quy tắc rõ ràng: Thuê theo ngày tính trọn vẹn 24 giờ kể từ thời điểm nhận xe thực tế. Thuê theo giờ tính làm tròn lên số giờ thực tế, tối thiểu 1 giờ.'
    },
    {
      q: 'Chính sách hủy đơn đặt xe và hoàn tiền cọc giữ chỗ ra sao?',
      a: 'Hủy trước 24 giờ so với giờ nhận xe sẽ được hoàn trả 100% tiền cọc giữ chỗ. Hủy trong vòng 24 giờ sẽ áp dụng phí xử lý giữ xe theo quy chế của cửa hàng.'
    }
  ];

  return (
    <div className="space-y-16 pb-16 bg-white">
      {/* 1. HERO BANNER SLIDER */}
      <HeroBannerSlider onExploreClick={() => setCustomerTab('vehicles')} />

      {/* 2. KHUNG TÌM KIẾM NỔI LIQUID GLASS */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 -mt-12 sm:-mt-16 relative z-30">
        <div className="bg-white/80 hover:bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-white/60 transition-all">
          <form onSubmit={handleSearchSubmit} className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Tìm & Kiểm tra xe còn trống theo thời gian</span>
              </span>

              <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl text-xs font-bold w-fit">
                <button
                  type="button"
                  onClick={() => setVehicleType('all')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    vehicleType === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả xe
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('car')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    vehicleType === 'car' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ô tô tự lái
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('motorbike')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    vehicleType === 'motorbike' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-xs"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-xs"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-xs"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer hover:shadow-lg"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Tìm xe còn trống</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 3. BỘ SƯU TẬP XE TIÊU BIỂU */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-2 border-b border-slate-100">
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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            <span>Xem toàn bộ {vehicles.length} xe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-4/3 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-200/40 overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-800 shadow-2xs border border-slate-200/60">
                      {v.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-extrabold text-base text-slate-900 truncate">{v.name}</h3>
                  <p className="text-xs text-slate-500">
                    {v.transmission} · Đời {v.year} · {v.color}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {v.features.slice(0, 2).map((feat, idx) => (
                      <span key={idx} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
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
                    <span className="text-sm font-black text-emerald-600 font-mono">
                      {formatVND(v.dailyPrice)}/ngày
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                    {formatVND(v.hourlyPrice)}/h
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSelectVehicle(v.id)}
                    className="w-full py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center cursor-pointer transition-colors"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleSelectVehicle(v.id)}
                    className="w-full py-2 px-2 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-600 rounded-xl text-center shadow-2xs cursor-pointer transition-colors"
                  >
                    Đặt xe này
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MỤC GIỚI THIỆU & CAM KẾT CHẤT LƯỢNG (GỘP TỪ ABOUT) */}
      <section className="bg-slate-50 py-16 px-4 sm:px-8 border-y border-slate-200/80">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
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

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">100%</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5">Xe đời mới</p>
                  <p className="text-[10px] text-slate-400">2023 - 2025</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">24/7</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5">Cứu hộ tận nơi</p>
                  <p className="text-[10px] text-slate-400">Sân bay, khách sạn</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center">
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">0 đ</span>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5">Phí ẩn phát sinh</p>
                  <p className="text-[10px] text-slate-400">Hợp đồng rõ ràng</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">Đội ô tô tự lái</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sedan 5 chỗ (Vios, Accent, Mazda 3), MPV 7 chỗ (Xpander, Veloz) và SUV gầm cao phục vụ gia đình, trang bị camera hành trình và Apple CarPlay.
                </p>
                <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Chỉ từ 750k/ngày
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Bike className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">Đội xe máy du lịch</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Xe ga (Vision, Air Blade, Lead) và xe số (Wave Alpha) máy khỏe, tiết kiệm xăng, leo đèo đầm chắc, trang bị sẵn 2 mũ bảo hiểm đạt chuẩn và áo mưa.
                </p>
                <span className="inline-block text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  Chỉ từ 130k/ngày
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-8">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Quy trình chuẩn hóa
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                4 Tiêu chuẩn bàn giao xe an toàn tuyệt đối
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {qualityStandards.map((std) => (
                <div key={std.step} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                  <span className="text-xs font-black text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded-md">
                    {std.step}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">{std.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{std.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUY TRÌNH THUÊ XE 4 BƯỚC ĐƠN GIẢN */}
      <section className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-xs font-black text-slate-900 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
              Bước 1
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Chọn xe & Lịch trình</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lựa chọn dòng xe phù hợp với nhu cầu và chọn khung giờ nhận/trả xe thuận tiện.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg">
              Bước 2
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Đặt cọc 20% giữ chỗ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quét mã QR chuyển khoản giữ chỗ trong 10 phút, hệ thống tự động khóa lịch xe cho bạn.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-xs font-black text-slate-900 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
              Bước 3
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Nhận xe & Ký hợp đồng</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Đối chiếu CCCD/GPLX gốc, kiểm tra 6 hạng mục xe và nhận bàn giao xe sạch đẹp.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg">
              Bước 4
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">Hoàn trả xe & Nhận lại cọc</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quyết toán chi phí minh bạch, nhận lại 100% tiền cọc hợp đồng ngay khi trả xe.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION & HỖ TRỢ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Giải đáp thắc mắcc
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Câu hỏi thường gặp khi thuê xe
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-emerald-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
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
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-extrabold text-sm">Bạn cần tư vấn thêm lịch trình hoặc loại xe?</h4>
            <p className="text-xs text-slate-400">Đội ngũ DriveRent hỗ trợ trực tiếp 24/7 không ngày nghỉ.</p>
          </div>
          <a
            href={`tel:${settings.hotline.replace(/\s+/g, '')}`}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gọi ngay: {settings.hotline}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
