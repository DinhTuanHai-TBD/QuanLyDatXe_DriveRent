import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Bike,
  Plane,
  ShieldCheck,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  MapPin,
  ArrowRight,
  Compass,
  AlertCircle,
  Navigation,
  FileCheck2,
  CalendarCheck,
  CreditCard,
  Building2,
  Fuel
} from 'lucide-react';

import nhaTrangCoastalBay from '../../assets/images/nha_trang_coastal_bay.jpg';
import nhatrangCoastalRoad from '../../assets/images/nhatrang_coastal_road.jpg';
import nhatrangCurveBg from '../../assets/images/nhatrang_curve_bg.jpg';

export const GuideCustomerView: React.FC = () => {
  const { setCustomerTab, settings } = useApp();
  const brandName = settings?.brandTitle || settings?.storeName || 'DriveRent Nha Trang';
  const hotline = settings?.hotline || '0905 888 999';

  // State: Bộ công cụ mô phỏng nhận xe nhanh 1-chạm
  const [pickupLoc, setPickupLoc] = useState<'airport' | 'hotel' | 'showroom'>('airport');
  const [vehicleType, setVehicleType] = useState<'car' | 'motorbike'>('car');

  // State: FAQ Accordion đa lựa chọn
  const [openFaqs, setOpenFaqs] = useState<number[]>([0, 2]);
  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // 1. QUY TRÌNH THUÊ XE 4 BƯỚC INFOGRAPHIC (1 icon + 1 tiêu đề + 1 dòng mô tả)
  const rentalSteps = [
    {
      num: '01',
      title: 'Chọn xe & Cọc 20% Online',
      desc: 'Chọn mẫu xe yêu thích trên web và chuyển cọc 20% qua VietQR để khóa xe tức thì.',
      timeTag: '1–2 Phút',
      icon: CalendarCheck,
      color: 'from-sky-600 to-sky-700'
    },
    {
      num: '02',
      title: 'Xác nhận & Hẹn điểm đón',
      desc: 'Điều phối viên kiểm tra mã chuyến bay thực tế và giao xe tận sảnh Sân bay hoặc Khách sạn.',
      timeTag: '24/7 Theo giờ bay',
      icon: Plane,
      color: 'from-blue-600 to-cyan-700'
    },
    {
      num: '03',
      title: 'Kiểm tra & Bàn giao 5 phút',
      desc: 'Quay video 360° ngoại quan, ký biên bản điện tử và cam kết không giữ giấy tờ gốc.',
      timeTag: '5 Phút nhận xe',
      icon: FileCheck2,
      color: 'from-teal-600 to-emerald-700'
    },
    {
      num: '04',
      title: 'Trả xe & Hoàn cọc tức thì',
      desc: 'Kiểm tra xe nhanh tại điểm hẹn và nhận hoàn trả 100% tiền cọc qua chuyển khoản ngay.',
      timeTag: '3–5 Phút hoàn tiền',
      icon: RotateCcw,
      color: 'from-amber-600 to-orange-700'
    }
  ];

  // 2. CẨM NANG CUNG ĐƯỜNG DẠNG THẺ ẢNH KÈM 3 THÔNG SỐ NGẮN GỌN
  const scenicRoutes = [
    {
      id: 'luong-son',
      title: 'Đèo Lương Sơn – Bãi Tiên',
      tag: 'Ngắm hoàng hôn vịnh biển',
      img: nhatrangCoastalRoad,
      distance: '15 km',
      recommendedVehicle: 'Sedan 4 chỗ & Xe ga',
      duration: '25 phút',
      tip: 'Gió biển thổi mạnh tại các khúc cua bãi đá, nên giữ tốc độ dưới 40 km/h.'
    },
    {
      id: 'vinh-hy',
      title: 'Vịnh Vĩnh Hy & VQG Núi Chúa',
      tag: 'Cung đèo biển kỳ vĩ nhất',
      img: nhatrangCurveBg,
      distance: '90 km',
      recommendedVehicle: 'SUV gầm cao & Xe côn tay',
      duration: '1h45 phút',
      tip: 'Đổ đầy bình trước khi vào Vườn Quốc Gia; chủ động về số thấp khi đổ dốc đèo.'
    },
    {
      id: 'doc-let',
      title: 'Bãi Dài Cam Ranh – Dốc Lết',
      tag: 'Biển cát trắng & Hải sản tươi',
      img: nhaTrangCoastalBay,
      distance: '35 – 45 km',
      recommendedVehicle: 'MPV 7 chỗ & Xe máy',
      duration: '40 phút',
      tip: 'Đại lộ 6 làn xe phẳng ru, tuân thủ đúng tốc độ quy định và chuẩn bị kính râm.'
    }
  ];

  // 3. FAQ RÚT GỌN CÂU TRẢ LỜI NGẮN DƯỚI 2 CÂU
  const conciseFaqs = [
    {
      q: 'Hạ cánh chuyến bay đêm muộn tại Sân bay Cam Ranh (sau 22:00) có nhận xe được không?',
      a: 'Có, DriveRent giao xe 24/7 tại ga đến Sân bay Cam Ranh theo giờ bay thực tế của quý khách mà không tính thêm phụ phí đêm. Nhân viên sẽ cầm biển tên đón bạn ngay tại cửa sảnh đến.'
    },
    {
      q: 'Nếu hãng hàng không delay hoặc tôi hủy chuyến thì tiền cọc 20% xử lý thế nào?',
      a: 'Quý khách được hoàn trả 100% tiền cọc khi thông báo hủy trước 24 giờ nhận xe. Trường hợp chuyến bay hoãn (delay), nhà xe sẽ tự động dời giờ giao xe miễn phí theo giờ hạ cánh mới.'
    },
    {
      q: 'Nhà xe có giữ lại CCCD hoặc Hộ chiếu (Passport) bản gốc của tôi không?',
      a: 'Tuyệt đối không giữ giấy tờ tùy thân gốc của du khách. Nhân viên chỉ đối chiếu và quét ảnh scan tại chỗ rồi gửi trả lại bạn toàn bộ bản gốc ngay trong 2 phút.'
    },
    {
      q: 'Khi trả xe thì tiền cọc trách nhiệm được hoàn trả như thế nào và mất bao lâu?',
      a: 'Khoản cọc được hoàn trả dứt điểm chỉ sau 3–5 phút đối chiếu video bàn giao ban đầu. Quý khách nhận lại 100% tiền cọc tức thì qua chuyển khoản VietQR 24/7 hoặc nhận tiền mặt.'
    },
    {
      q: 'Nếu trong quá trình di chuyển xe bị sự cố hoặc thủng lốp thì xử lý ra sao?',
      a: 'Bạn chỉ cần gọi ngay Hotline cứu hộ 0905 888 999 để đội kỹ thuật viên lưu động hỗ trợ tận nơi sau 15–30 phút. Khách hàng được vá vỏ, kích bình hoặc đổi xe tương đương hoàn toàn miễn phí.'
    },
    {
      q: 'Có giới hạn số kilomet (km) di chuyển trong ngày hay không?',
      a: 'Xe máy hoàn toàn không giới hạn cự ly di chuyển trong địa phận tỉnh Khánh Hòa. Ô tô tự lái áp dụng định mức rộng rãi 350 km/ngày, hoàn toàn thoải mái đi trọn vẹn Vĩnh Hy hoặc Đà Lạt.'
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">

        {/* ========================================================================= */}
        {/* 1. HERO BANNER: TINH GỌN & HIỆN ĐẠI                                      */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl overflow-hidden border border-sky-100 shadow-sm bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 text-white p-6 sm:p-10 lg:p-12">
          {/* Background image mờ sang trọng */}
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url(${nhaTrangCoastalBay})` }}
          />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Cẩm nang du khách • {brandName}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Hướng Dẫn Thuê Xe & Cẩm Nang Lái Xe Nha Trang
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
              Quy trình số hóa 100% không rườm rà: đặt xe 1 phút, nhận xe 5 phút tận nơi và bảo lưu cọc linh hoạt khi lịch trình thay đổi.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. STEPPER NGANG 4 BƯỚC DẠNG INFOGRAPHIC TRỰC QUAN (YÊU CẦU 1)           */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-sky-700 font-extrabold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Quy trình số hóa siêu tốc</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mt-1">
                4 Bước Thuê Xe Tự Lái Tinh Gọn
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tổng thời gian: ~11 phút</span>
            </div>
          </div>

          {/* Stepper Card Grid 4 cột ngang liên kết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            {rentalSteps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Hàng trên: Icon + Badge bước số */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md shadow-sky-900/10 group-hover:scale-105 transition-transform duration-200`}>
                        <IconComp className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-black font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        BƯỚC {step.num}
                      </span>
                    </div>

                    {/* Tiêu đề & 1 DÒNG MÔ TẢ DUY NHẤT */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-sky-700 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Footer Thẻ: Thời gian thực hiện */}
                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500">Thời gian:</span>
                    <span className="text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/80">
                      {step.timeTag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BỘ CÔNG CỤ MÔ PHỎNG LỘ TRÌNH & ĐỐI CHIẾU HỒ SƠ 1-CHẠM                 */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Mô phỏng tức thì</span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Đối Chiếu Hồ Sơ & Điểm Nhận Xe
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Chọn điểm đón và loại xe để xem thủ tục tương ứng
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Cụm nút chọn điểm đón & loại xe */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                  1. Điểm hẹn giao nhận xe
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'airport' as const, label: 'Sân bay Cam Ranh', sub: 'Ga đến 24/7' },
                    { id: 'hotel' as const, label: 'Khách sạn biển', sub: 'Giao tận nơi 0đ' },
                    { id: 'showroom' as const, label: 'Showroom Lê Lợi', sub: 'Nhận sau 3p' }
                  ].map((loc) => {
                    const active = pickupLoc === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setPickupLoc(loc.id)}
                        className={`min-h-[50px] p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                          active
                            ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight">{loc.label}</div>
                        <div className={`text-[10px] mt-0.5 ${active ? 'text-sky-100' : 'text-slate-500'}`}>
                          {loc.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                  2. Loại phương tiện
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVehicleType('car')}
                    className={`min-h-[48px] px-4 py-2 rounded-xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
                      vehicleType === 'car'
                        ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <Car className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Ô tô tự lái (4–7 chỗ)</div>
                      <div className={`text-[10px] ${vehicleType === 'car' ? 'text-sky-100' : 'text-slate-500'}`}>
                        Sedan, SUV đời mới 2023–2025
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('motorbike')}
                    className={`min-h-[48px] px-4 py-2 rounded-xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
                      vehicleType === 'motorbike'
                        ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <Bike className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Xe máy &amp; Xe điện</div>
                      <div className={`text-[10px] ${vehicleType === 'motorbike' ? 'text-sky-100' : 'text-slate-500'}`}>
                        Air Blade, Vision, Feliz
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Khung kết quả hiển thị hồ sơ tinh gọn */}
            <div className="bg-sky-50/70 rounded-2xl border border-sky-200/80 p-5 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-sky-900 border-b border-sky-200/70 pb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-700" />
                  <span>Hồ sơ yêu cầu cho phương tiện đã chọn</span>
                </span>
                <span className="bg-white text-sky-800 px-2 py-0.5 rounded-full border border-sky-200 text-[11px]">
                  Không giữ bản gốc
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                {vehicleType === 'car' ? (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-700 font-bold">•</span>
                      <span><strong>Giấy tờ:</strong> CCCD gắn chip / VNeID mức 2 hoặc Passport + Bằng lái B1/B2 (chỉ đối chiếu scan).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-700 font-bold">•</span>
                      <span><strong>Tiền cọc:</strong> 5 – 15 triệu (hoặc xe máy chính chủ) &bull; Hoàn trả 100% sau 5 phút trả xe.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-700 font-bold">•</span>
                      <span><strong>Giấy tờ:</strong> CCCD / Passport (đối chiếu tại chỗ, không giữ lại).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-700 font-bold">•</span>
                      <span><strong>Tiền cọc:</strong> 1 – 2 triệu đồng &bull; Hoàn trả 100% tức thì qua chuyển khoản khi nhận lại xe.</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 border-t border-sky-200/70 flex items-center justify-between text-xs font-bold text-sky-900">
                <span>Điểm hẹn đã chọn:</span>
                <span className="text-sky-700 font-black">
                  {pickupLoc === 'airport' && 'Ga đến Sân bay Cam Ranh (Theo giờ bay)'}
                  {pickupLoc === 'hotel' && 'Giao tận nơi sảnh khách sạn Nha Trang'}
                  {pickupLoc === 'showroom' && 'Showroom 25 Lê Lợi, TP. Nha Trang'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CẨM NANG CUNG ĐƯỜNG DẠNG THẺ ẢNH KÈM 3 THÔNG SỐ NGẮN GỌN (YÊU CẦU 2) */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-sky-700" />
              <span>Gợi ý cung đường biển đẹp</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Cẩm Nang 3 Cung Đường Ven Biển Nha Trang
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Thông số thực tế và dòng xe tối ưu nhất cho từng lộ trình được đúc kết từ tài xế địa phương.
            </p>
          </div>

          {/* Lưới 3 Thẻ Ảnh Cung Đường (Photo Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenicRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Khối Ảnh Đại Diện Cung Đường với Gradient Overlay */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={route.img}
                      alt={route.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Badge thể loại nổi trên ảnh */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs">
                      {route.tag}
                    </span>

                    {/* Tiêu đề cung đường nằm ở đáy ảnh */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug drop-shadow-md">
                        {route.title}
                      </h3>
                    </div>
                  </div>

                  {/* 3 THÔNG SỐ ĐO LƯỜNG NGẮN GỌN (3 Key Metrics) */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                      {/* Thông số 1: Khoảng cách */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Khoảng cách
                        </span>
                        <span className="text-xs sm:text-sm font-black text-sky-800 block">
                          {route.distance}
                        </span>
                      </div>

                      {/* Thông số 2: Thời gian đi */}
                      <div className="space-y-0.5 border-x border-slate-200 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Thời gian đi
                        </span>
                        <span className="text-xs sm:text-sm font-black text-slate-800 block">
                          {route.duration}
                        </span>
                      </div>

                      {/* Thông số 3: Loại xe khuyên dùng */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                          Xe khuyên dùng
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 block truncate" title={route.recommendedVehicle}>
                          {route.recommendedVehicle}
                        </span>
                      </div>
                    </div>

                    {/* Pro-tip: 1 dòng kinh nghiệm ngắn */}
                    <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">
                        {route.tip}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nút CTA chọn xe đi cung đường này */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerTab('vehicles');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-sky-700 hover:text-white text-slate-700 text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200/90 hover:border-sky-700 active:scale-[0.98]"
                  >
                    <span>Xem xe phù hợp cung đường</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CÂU HỎI THƯỜNG GẶP FAQ: CÂU TRẢ LỜI NGẮN DƯỚI 2 CÂU (YÊU CẦU 3)      */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
              <span>Giải đáp thắc mắc</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Câu Hỏi Thường Gặp Khi Thuê Xe
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Câu trả lời ngắn gọn, minh bạch trực tiếp vào câu hỏi của quý khách.
            </p>
          </div>

          {/* Lưới 2 cột Accordion FAQ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {conciseFaqs.map((faq, idx) => {
              const isOpen = openFaqs.includes(idx);
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-sky-300 shadow-sm'
                      : 'border-slate-200 hover:border-sky-200'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(idx)}
                    className="w-full min-h-[56px] p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 gap-3 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-600 select-none"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl text-xs font-mono font-black flex items-center justify-center shrink-0 ${
                        isOpen ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        0{idx + 1}
                      </span>
                      <span className="leading-snug">{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-sky-700' : ''
                      }`}
                    />
                  </button>

                  {/* Vùng câu trả lời ngắn dưới 2 câu */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. BANNER LIÊN HỆ & ĐẶT XE TOÀN MÀN HÌNH (CTA BANNER)                     */}
        {/* ========================================================================= */}
        <section className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400 bg-sky-950 px-3 py-1 rounded-full border border-sky-800 inline-block">
              Hỗ trợ du khách 24/7
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Sẵn Sàng Cho Chuyến Du Lịch Nha Trang?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Đội ngũ điều phối viên sẵn sàng đón bạn tại Sân bay Cam Ranh hoặc khách sạn ven biển bất kể ngày hay đêm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all select-none active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4 text-sky-400" />
              <span>Hotline SOS: {hotline}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setCustomerTab('vehicles');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[48px] px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
            >
              <span>Chọn xe ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
