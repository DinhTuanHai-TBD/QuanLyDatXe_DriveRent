import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Bike,
  QrCode,
  FileCheck2,
  KeyRound,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  CreditCard,
  Scale,
  Check,
  ExternalLink,
  HelpCircle,
  PhoneCall,
  MapPin,
  Plane,
  Building2,
  Store,
  ArrowRight,
  Compass,
  AlertCircle,
  Navigation,
  Fuel
} from 'lucide-react';

import nhaTrangCoastalBay from '../../assets/images/nha_trang_coastal_bay.jpg';

export const GuideCustomerView: React.FC = () => {
  const { setCustomerTab, settings, t } = useApp();
  const brandName = settings?.brandTitle || settings?.storeName || 'Nha Trang Car';
  const hotline = settings?.hotline || '0905 888 999';

  // State: Bộ công cụ mô phỏng lộ trình giao nhận xe thực tế
  const [pickupLocation, setPickupLocation] = useState<'airport' | 'hotel' | 'showroom'>('airport');
  const [vehicleType, setVehicleType] = useState<'car' | 'motorbike'>('car');

  // State: Tab quy trình & chính sách chi tiết (1. Quy trình 4 bước | 2. Điều kiện & Giấy tờ | 3. Quy tắc 2 khoản cọc | 4. Giờ thuê 24h)
  const [activeGuideTab, setActiveGuideTab] = useState<'steps' | 'cond' | 'deposit' | 'hours'>('steps');

  // State: FAQ Accordion đa lựa chọn (cho phép mở độc lập trên lưới 2 cột)
  const [openFaqIndexes, setOpenFaqIndexes] = useState<number[]>([0, 3]);
  const toggleFaq = (index: number) => {
    setOpenFaqIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Tái cấu trúc Quy trình 4 bước thuê xe tự lái
  const steps = [
    {
      step: `${t('home.step_prefix')} 1`,
      num: '01',
      time: t('guide.step1_time'),
      title: t('guide.step1_title'),
      desc: t('guide.step1_desc'),
      highlight: t('guide.step1_highlight'),
      icon: Car
    },
    {
      step: `${t('home.step_prefix')} 2`,
      num: '02',
      time: t('guide.step2_time'),
      title: t('guide.step2_title'),
      desc: t('guide.step2_desc'),
      highlight: t('guide.step2_highlight'),
      icon: Plane
    },
    {
      step: `${t('home.step_prefix')} 3`,
      num: '03',
      time: t('guide.step3_time'),
      title: t('guide.step3_title'),
      desc: t('guide.step3_desc'),
      highlight: t('guide.step3_highlight'),
      icon: ShieldCheck
    },
    {
      step: `${t('home.step_prefix')} 4`,
      num: '04',
      time: t('guide.step4_time'),
      title: t('guide.step4_title'),
      desc: t('guide.step4_desc'),
      highlight: t('guide.step4_highlight'),
      icon: RotateCcw
    }
  ];

  // Khối dữ liệu: Cẩm nang cung đường biển Nha Trang
  const coastalRoutes = [
    {
      id: 'luong-son',
      title: 'Đèo Lương Sơn - Bãi Tiên',
      subtitle: 'Cung đường ngắm hoàng hôn vịnh biển Nha Trang',
      distance: '15 km • 25 phút',
      typeBadge: 'Đường ven biển • Uốn lượn thoai thoải',
      landscape: 'Đường ven biển Phạm Văn Đồng ôm sát vịnh Nha Trang lung linh, bãi đá tự nhiên hùng vĩ, ngắm trọn vẹn thành phố biển lên đèn.',
      idealTime: '16:30 – 18:00 (Bắt trọn hoàng hôn & gió biển mát dịu)',
      carRec: 'Sedan 4-5 chỗ (Mazda 3, Kia K3, Elantra) hoặc CUV (CX-5)',
      carWhy: 'Vận hành êm ái, kính lái góc rộng ngắm vịnh biển, bán kính quay đầu linh hoạt tại các bãi dừng chân check-in.',
      bikeRec: 'Xe tay ga (Vision, Air Blade) hoặc VinFast Feliz',
      bikeWhy: 'Gọn nhẹ, dễ dừng chụp ảnh ven đèo, cốp rộng để vừa 2 mũ bảo hiểm và phụ kiện sống ảo.',
      tip: 'Kinh nghiệm: Gió biển có thể giật mạnh tại các khúc cua thoáng bãi đá; giữ tốc độ an toàn dưới 40km/h.',
      btnLabel: 'Xem xe đi Đèo Lương Sơn'
    },
    {
      id: 'vinh-hy',
      title: 'Vịnh Vĩnh Hy & VQG Núi Chúa',
      subtitle: 'Cung đường đèo biển kỳ vĩ nhất miền Trung',
      distance: '90 km • 1h45',
      typeBadge: 'Đèo dốc quanh co • Vách đá sừng sững',
      landscape: 'Tuyến đường ven biển Cam Ranh - Bình Tiên - Vĩnh Hy ngoạn mục. Một bên là vách núi đá hoa cương, một bên là vịnh biển xanh màu ngọc bích.',
      idealTime: '07:00 – 16:00 (Nắng sớm rực rỡ, ngắm san hô biển trong)',
      carRec: 'SUV 7 chỗ gầm cao (Ford Everest, Fortuner, SantaFe)',
      carWhy: 'Gầm cao leo dốc đèo ổn định, động cơ bốc khỏe, trang bị camera 360 & hỗ trợ đổ đèo dốc dài an toàn tuyệt đối.',
      bikeRec: 'Xe côn tay / Xe số khỏe (Winner X, Exciter) hoặc SH 150cc',
      bikeWhy: 'Động cơ mạnh mẽ leo đèo liên tục không bị đuối, phanh đĩa trước sau kiểm soát tốc độ tối ưu.',
      tip: 'Kinh nghiệm: Đổ đầy bình xăng trước khi vào cung đường vườn quốc gia; chủ động về số thấp (D1/D2/L) khi đổ đèo.',
      btnLabel: 'Xem SUV leo dốc Vĩnh Hy'
    },
    {
      id: 'doc-let',
      title: 'Bãi Dài Cam Ranh - Dốc Lết',
      subtitle: 'Hành trình cát trắng mịn & Hải sản tươi sống',
      distance: '35 - 45 km • 40 phút',
      typeBadge: 'Đại lộ phẳng phiu • Bãi tắm thoải sóng êm',
      landscape: 'Đại lộ Nguyễn Tất Thành và QL1A rộng 4-6 làn xe phẳng ru, kết nối bãi cát trắng mịn, nước trong vắt và các bè hải sản tươi sống.',
      idealTime: '08:00 – 17:00 (Tắm biển thư giãn & thưởng thức hải sản tại bè)',
      carRec: 'MPV 7 chỗ gia đình (Mitsubishi Xpander, Veloz, Carnival)',
      carWhy: 'Khoang xe rộng thoáng, 2 dàn lạnh điều hòa mát sâu, cốp chứa đồ cực lớn cho vali và thùng xốp hải sản tươi mang về.',
      bikeRec: 'Xe tay ga êm ái, tiết kiệm xăng (Air Blade, Lead)',
      bikeWhy: 'Đường phẳng chạy cực êm ru, yên xe ngồi thoải mái cho cặp đôi dạo mát dọc bãi biển nắng vàng.',
      tip: 'Kinh nghiệm: Tuân thủ đúng làn đường và tốc độ quy định trên đại lộ; trang bị kính mát và kem chống nắng đầy đủ.',
      btnLabel: 'Xem MPV gia đình đi Dốc Lết'
    }
  ];

  // 6 Câu hỏi thường gặp chia đều 2 cột song song
  const faqs = [
    {
      q: t('guide.faq_q1'),
      a: t('guide.faq_a1')
    },
    {
      q: t('guide.faq_q4'),
      a: t('guide.faq_a4')
    },
    {
      q: t('guide.faq_q6'),
      a: t('guide.faq_a6')
    },
    {
      q: t('guide.faq_q2'),
      a: t('guide.faq_a2')
    },
    {
      q: t('guide.faq_q5'),
      a: t('guide.faq_a5')
    },
    {
      q: t('guide.faq_q3'),
      a: t('guide.faq_a3')
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. TRANG BÌA (HERO COVER): TOÀN CẢNH WIDE PANORAMA 1440PX */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden w-full min-h-[480px] sm:h-auto sm:min-h-[520px] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-b border-sky-200/80"
        style={{
          backgroundImage: `url(${nhaTrangCoastalBay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-sky-50/85 to-white/95 pointer-events-none" />

        {/* Center: Main Title & 3 Bold Commitment Stat Cards */}
        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-center space-y-6 sm:space-y-8 my-auto">
          
          <div className="space-y-3.5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-balance">
              <span className="text-slate-900 drop-shadow-xs">{t('guide.hero_title')} </span>
              <span className="text-sky-700 drop-shadow-xs font-black">- NHANH CHÓNG &amp; TIỆN LỢI</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-700 max-w-3xl mx-auto drop-shadow-xs leading-relaxed text-pretty">
              {t('guide.hero_desc')}
            </p>
          </div>

          {/* 3 Thẻ Tóm Tắt Con Số Cam Kết (Bolder Commitment Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto pt-2">
            {/* Thẻ 1: 3 Phút - Đặt & Khóa Xe Online */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 group-hover:bg-sky-700 group-hover:text-white transition-all duration-300">
                    <QrCode className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                    VietQR 20%
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-sky-700 tracking-tight tabular-nums">
                    {t('guide.stat_1_val')}
                  </div>
                  <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1">
                    {t('guide.stat_1_title')}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                  {t('guide.stat_1_desc')}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-sky-100/80 flex items-center gap-1.5 text-xs font-bold text-sky-800">
                <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                <span>{t('guide.stat_1_foot')}</span>
              </div>
            </div>

            {/* Thẻ 2: 0 Đồng - Giao Xe Tận Nơi Miễn Phí */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 group-hover:bg-cyan-700 group-hover:text-white transition-all duration-300">
                    <Plane className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    Sân bay &amp; Khách sạn
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-cyan-800 tracking-tight">
                    {t('guide.stat_2_val')}
                  </div>
                  <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1">
                    {t('guide.stat_2_title')}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                  {t('guide.stat_2_desc')}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-sky-100/80 flex items-center gap-1.5 text-xs font-bold text-cyan-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>{t('guide.stat_2_foot')}</span>
              </div>
            </div>

            {/* Thẻ 3: 5 Phút - Nhận Xe & Hoàn Cọc Tức Thì */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 group-hover:bg-sky-700 group-hover:text-white transition-all duration-300">
                    <RotateCcw className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                    Số Hóa 360&deg;
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-sky-900 tracking-tight">
                    {t('guide.stat_3_val')}
                  </div>
                  <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1">
                    {t('guide.stat_3_title')}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                  {t('guide.stat_3_desc')}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-sky-100/80 flex items-center gap-1.5 text-xs font-bold text-sky-800">
                <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                <span>{t('guide.stat_3_foot')}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LAYER CÔNG CỤ TÍNH LỘ TRÌNH & DỰ TOÁN THỦ TỤC THUÊ XE TRỰC TIẾP */}
      {/* ========================================================================= */}
      <section id="guide-tool-layer" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        {/* Modern Soft Card: "Mô phỏng quy trình giao nhận xe thực tế" */}
        <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl border border-sky-100 shadow-xl shadow-sky-950/5 overflow-hidden transition-all duration-300">
          
          {/* Card Header: Phong cách Modern Soft Card với màu biển Nha Trang */}
          <div className="bg-gradient-to-b from-sky-50/80 to-white px-5 sm:px-8 pt-6 pb-4 sm:pt-7 sm:pb-5 border-b border-sky-100 text-center">
            <h2 className="font-extrabold text-slate-900 text-lg sm:text-2xl tracking-tight text-balance">
              {t('guide.tool_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto leading-relaxed text-pretty">
              {t('guide.tool_desc')}
            </p>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            {/* Step 1: Chọn Điểm nhận xe - Segmented Chips chuẩn WCAG (touch target >= 44px, gap >= 8px) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs text-slate-500 font-extrabold">
                  <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center text-xs font-bold">1</span>
                  Điểm giao nhận xe
                </span>
                <span className="text-slate-500 font-medium">Bấm chọn để mô phỏng</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Điểm giao nhận xe">
                {[
                  {
                    id: 'airport' as const,
                    badge: 'CXR',
                    title: t('guide.loc_airport'),
                    subtitle: 'Đón sảnh đến theo giờ bay'
                  },
                  {
                    id: 'hotel' as const,
                    badge: 'HOTEL',
                    title: t('guide.loc_hotel'),
                    subtitle: 'Giao tận nơi miễn phí'
                  },
                  {
                    id: 'showroom' as const,
                    badge: 'SHOWROOM',
                    title: t('guide.loc_showroom'),
                    subtitle: 'Nhận xe trực tiếp sau 3 phút'
                  }
                ].map((loc) => {
                  const isActive = pickupLocation === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setPickupLocation(loc.id)}
                      className={`min-h-[56px] px-3.5 py-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-center select-none active:scale-[0.98] ${
                        isActive
                          ? 'bg-sky-800 text-white shadow-md shadow-sky-900/20 ring-2 ring-sky-700/25'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 w-full">
                        <span className="font-bold text-xs sm:text-sm tracking-tight leading-tight">
                          {loc.title}
                        </span>
                        <span
                          className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {loc.badge}
                        </span>
                      </div>
                      <span
                        className={`text-xs mt-0.5 leading-tight ${
                          isActive ? 'text-sky-100' : 'text-slate-500'
                        }`}
                      >
                        {loc.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Chọn Loại phương tiện - Segmented Chips chuẩn WCAG */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs text-slate-500 font-extrabold">
                  <span className="w-4 h-4 rounded-full bg-sky-700 text-white flex items-center justify-center text-xs">2</span>
                  Phương tiện muốn thuê
                </span>
                <span className="text-slate-500 font-medium">Đối chiếu hồ sơ</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Phương tiện muốn thuê">
                <button
                  type="button"
                  role="radio"
                  aria-checked={vehicleType === 'car'}
                  onClick={() => setVehicleType('car')}
                  className={`min-h-[56px] px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-3 select-none active:scale-[0.98] ${
                    vehicleType === 'car'
                      ? 'bg-sky-800 text-white shadow-md shadow-sky-900/20 ring-2 ring-sky-700/25'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      vehicleType === 'car' ? 'bg-white/15 text-white' : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-bold text-xs sm:text-sm leading-tight">
                      {t('reg.filter_car')}
                    </div>
                    <div
                      className={`text-xs mt-0.5 leading-tight truncate ${
                        vehicleType === 'car' ? 'text-sky-100' : 'text-slate-500'
                      }`}
                    >
                      Sedan, SUV 4 - 7 chỗ tự lái đời mới
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={vehicleType === 'motorbike'}
                  onClick={() => setVehicleType('motorbike')}
                  className={`min-h-[56px] px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-3 select-none active:scale-[0.98] ${
                    vehicleType === 'motorbike'
                      ? 'bg-sky-800 text-white shadow-md shadow-sky-900/20 ring-2 ring-sky-700/25'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      vehicleType === 'motorbike' ? 'bg-white/15 text-white' : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    <Bike className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-bold text-xs sm:text-sm leading-tight">
                      {t('reg.filter_bike')}
                    </div>
                    <div
                      className={`text-xs mt-0.5 leading-tight truncate ${
                        vehicleType === 'motorbike' ? 'text-sky-100' : 'text-slate-500'
                      }`}
                    >
                      Xe tay ga &amp; VinFast Feliz (100% miễn bằng)
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Instant Pathway Result Layer */}
            <div className="pt-2 border-t border-sky-100">
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Status Banner - Xanh biển Nha Trang dịu mát */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2.5 px-3.5 bg-sky-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-sky-950 uppercase tracking-wide">
                        {pickupLocation === 'airport' && 'Đón sảnh đến Sân bay Cam Ranh 24/7 (0đ phụ phí)'}
                        {pickupLocation === 'hotel' && 'Giao xe tận nơi miễn phí tại khách sạn ven biển'}
                        {pickupLocation === 'showroom' && 'Nhận xe trực tiếp tại Showroom 25 Lê Lợi'}
                      </div>
                      <div className="text-xs text-sky-800 font-semibold mt-0.5">
                        {vehicleType === 'car' ? 'Ô tô tự lái 4–7 chỗ đời mới' : 'Xe máy & Xe máy điện du lịch'} &bull; Thủ tục số hóa 5 phút
                      </div>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-200 shrink-0">
                    Bàn giao chuẩn hẹn
                  </span>
                </div>

                {/* Danh sách chuẩn bị & Quy trình tại điểm hẹn - 2 Cột phẳng tinh gọn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                  {/* Mục 1: Giấy tờ & Cọc cần chuẩn bị */}
                  <div className="space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                        <CreditCard className="w-4 h-4 text-sky-700 shrink-0" />
                        <span>1. Hồ sơ &amp; Khoản cọc cần chuẩn bị</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed text-pretty">
                        {vehicleType === 'car' ? (
                          <>
                            &bull; <strong>CCCD gắn chip / VNeID cấp 2</strong> (hoặc Passport du khách quốc tế).<br />
                            &bull; <strong>GPLX B1/B2/B</strong> hợp lệ còn hạn sử dụng.<br />
                            &bull; Tiền cọc trách nhiệm: <strong>5.000.000đ – 15.000.000đ</strong> (hoặc xe máy chính chủ).
                          </>
                        ) : (
                          <>
                            &bull; <strong>CCCD gắn chip / Passport</strong> bản gốc.<br />
                            &bull; <strong>GPLX A1/A2</strong> (Xe máy điện VinFast 100% miễn bằng lái).<br />
                            &bull; Tiền cọc trách nhiệm: <strong>1.000.000đ – 2.000.000đ</strong> (hoặc xe máy cá nhân).
                          </>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">
                      * Nhân viên chỉ đối chiếu tại chỗ, tuyệt đối không giữ giấy tờ tùy thân gốc.
                    </p>
                  </div>

                  {/* Mục 2: Quy trình giao nhận tại điểm hẹn */}
                  <div className="space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">
                        <Clock className="w-4 h-4 text-sky-700 shrink-0" />
                        <span>2. Quy trình bàn giao trong 5 phút</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed text-pretty">
                        {pickupLocation === 'airport' && (
                          <>
                            &bull; <strong>Bước 1:</strong> Nhân viên cầm biển tên đón quý khách tại sảnh đến theo giờ chuyến bay.<br />
                            &bull; <strong>Bước 2:</strong> Hai bên cùng quay video 360&deg; kiểm tra ngoại quan &amp; mức xăng/pin.<br />
                            &bull; <strong>Bước 3:</strong> Ký biên bản số, nhận chìa khóa và vi vu ngay về trung tâm.
                          </>
                        )}
                        {pickupLocation === 'hotel' && (
                          <>
                            &bull; <strong>Bước 1:</strong> Nhân viên lái xe đến sảnh khách sạn trước giờ hẹn 10 phút.<br />
                            &bull; <strong>Bước 2:</strong> Quý khách kiểm tra xe, trang bị 02 nón bảo hiểm hoặc camera hành trình.<br />
                            &bull; <strong>Bước 3:</strong> Thanh toán phần còn lại &amp; gửi cọc trách nhiệm, nhận chìa khóa tại sảnh.
                          </>
                        )}
                        {pickupLocation === 'showroom' && (
                          <>
                            &bull; <strong>Bước 1:</strong> Ghé trực tiếp 25 Lê Lợi, nhân viên mời nước ngọt/cà phê nghỉ ngơi.<br />
                            &bull; <strong>Bước 2:</strong> Lựa chọn xe yêu thích tại bãi đậu và kiểm tra vận hành thử.<br />
                            &bull; <strong>Bước 3:</strong> Hoàn tất hợp đồng điện tử sau 3 phút và khởi hành chuyến đi.
                          </>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100 text-pretty">
                      * Hoàn trả 100% tiền cọc dứt điểm sau 3–5 phút ngay khi quý khách trả xe.
                    </p>
                  </div>
                </div>

                {/* Thanh điều hướng nhanh */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Sparkles className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>100% Xe sạch đẹp, trang bị bảo hiểm vật chất 2 chiều chính hãng</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerTab('vehicles');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="min-h-[48px] px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shadow-sky-800/20"
                  >
                    <span>Xem danh sách xe sẵn sàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KHỐI QUY TRÌNH & CHÍNH SÁCH CHI TIẾT: 4 TAB BO TRÒN BENTO GRID */}
      {/* ========================================================================= */}
      <div id="guide-policy-section" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 scroll-mt-24">

        {/* Thanh 4 Tab quy trình: Bo tròn hoàn toàn (rounded-full), cuộn ngang mượt mà trên mobile */}
        <div className="w-full max-w-3xl mx-auto flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar p-1.5 sm:p-2 bg-slate-100/90 sm:bg-sky-50/80 rounded-full border border-slate-200/80 sm:border-sky-200/80 backdrop-blur-xs touch-pan-x shadow-2xs">
          {[
            { id: 'steps' as const, label: t('guide.tab_steps') },
            { id: 'cond' as const, label: t('guide.tab_cond') },
            { id: 'deposit' as const, label: t('guide.tab_deposit') },
            { id: 'hours' as const, label: t('guide.tab_hours') }
          ].map((tab) => {
            const isActive = activeGuideTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-guide-${tab.id}`}
                type="button"
                role="button"
                aria-pressed={isActive}
                onClick={() => setActiveGuideTab(tab.id)}
                className={`min-h-[44px] px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 ease-out cursor-pointer shrink-0 select-none active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-sky-700 text-white shadow-sm shadow-sky-800/25 ring-1 ring-sky-600/30'
                    : 'text-slate-600 hover:text-sky-800 hover:bg-white/80 hover:shadow-2xs active:bg-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* NỘI DUNG TỪNG TAB */}
        {/* ========================================================================= */}

        {/* TAB 1: QUY TRÌNH 4 BƯỚC THUÊ XE TỰ LÁI (HORIZONTAL PROCESS FLOW / BENTO GRID 4 CỘT) */}
        {activeGuideTab === 'steps' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header tóm tắt */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-200/90 text-center max-w-4xl mx-auto space-y-3 shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 text-sky-800 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                <span>{t('guide.roadmap_badge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight text-balance">
                {t('guide.roadmap_title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed text-pretty">
                {t('guide.roadmap_desc')}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-sky-800">
                <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Tổng thời gian: ~11 phút</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Online &amp; Giao nhận tận nơi</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/80 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Không giữ giấy tờ tùy thân gốc</span>
                </span>
              </div>
            </div>

            {/* Stepper Tracker trên Desktop 4 chặng ngang */}
            <div className="hidden lg:block relative max-w-6xl mx-auto px-8 pb-3">
              <div className="absolute top-6 left-20 right-20 h-1 bg-sky-200/90 rounded-full z-0" />
              <div className="relative z-10 grid grid-cols-4 gap-6 text-center">
                {steps.map((s) => {
                  const IconComp = s.icon;
                  return (
                    <div key={s.num} className="flex flex-col items-center gap-2 group cursor-default">
                      <span className="w-12 h-12 rounded-2xl bg-white border-2 border-sky-700 text-sky-800 font-mono font-black text-xs flex items-center justify-center shadow-md shadow-sky-800/20 group-hover:scale-110 group-hover:bg-sky-700 group-hover:text-white transition-all duration-200">
                        <IconComp className="w-5 h-5 stroke-[2.2]" />
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-black text-sky-700 font-mono block">
                          BƯỚC {s.num}
                        </span>
                        <span className="text-xs font-bold text-slate-700 block truncate max-w-[200px]">
                          {s.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hàng lưới ngang 4 cột (Horizontal Process Flow / Bento Grid 4 cột trên desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {steps.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.num}
                    className="bg-white rounded-3xl border border-sky-200/90 shadow-[0_4px_20px_rgba(2,132,199,0.06)] hover:shadow-[0_16px_36px_rgba(2,132,199,0.12)] hover:border-sky-400 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-800/25 group-hover:scale-105 group-hover:bg-sky-600 transition-all duration-200">
                          <IconComp className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black font-mono px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                          {item.step}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{item.time}</span>
                        </div>

                        <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-snug group-hover:text-sky-700 transition-colors text-balance">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal text-pretty">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-sky-100 flex items-center gap-2 text-xs font-bold text-sky-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="leading-snug">{item.highlight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ĐIỀU KIỆN & GIẤY TỜ THUÊ XE */}
        {activeGuideTab === 'cond' && (
          <div className="bg-white rounded-3xl border border-sky-200/80 shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-sky-100/90 via-sky-50 to-cyan-50/80 p-6 sm:p-7 border-b border-sky-200">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 text-balance">
                {t('guide.cond_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl text-pretty">
                {t('guide.cond_desc')}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* 2-column checklist comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Column 1: Xe máy & Xe tay ga */}
                <div className="rounded-2xl border border-sky-200/90 bg-gradient-to-b from-sky-50/50 to-white p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:border-sky-400 hover:shadow-md transition-all">
                  <div className="space-y-5">
                    {/* Column Header */}
                    <div className="flex items-start justify-between gap-3 flex-wrap border-b border-sky-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                          <Bike className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 block">
                            Phương tiện 2 bánh
                          </span>
                          <h4 className="text-lg font-black text-slate-900 leading-tight">
                            {t('guide.cond_bike_title')}
                          </h4>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-200">
                          {t('guide.cond_bike_badge')}
                        </span>
                        <span className="text-[11px] font-bold text-sky-700">
                          {t('guide.cond_bike_dep_badge')}
                        </span>
                      </div>
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-3.5">
                      {/* Item 1: GPLX */}
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
                          <CheckCircle2 className="w-4 h-4 text-sky-700" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">
                            {t('guide.cond_bike_lic_val')}
                          </div>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed">
                            {t('guide.cond_bike_lic_sub')}
                          </p>
                        </div>
                      </div>

                      {/* Item 2: Định danh CCCD */}
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
                          <CheckCircle2 className="w-4 h-4 text-sky-700" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">
                            {t('guide.cond_bike_id_val')}
                          </div>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed">
                            {t('guide.cond_bike_id_sub')}
                          </p>
                        </div>
                      </div>

                      {/* Item 3: Tiền cọc */}
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
                          <CheckCircle2 className="w-4 h-4 text-sky-700" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">
                            {t('guide.cond_bike_dep_val')}
                          </div>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed">
                            {t('guide.cond_bike_dep_sub')}
                          </p>
                        </div>
                      </div>

                      {/* Item 4: Độ tuổi & Giao nhận */}
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
                          <CheckCircle2 className="w-4 h-4 text-sky-700" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">
                            {t('guide.cond_bike_age_val')}
                          </div>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed">
                            {t('guide.cond_bike_age_sub')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column footer badge */}
                  <div className="mt-5 pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 text-sky-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      Bàn giao 02 nón bảo hiểm chuẩn
                    </span>
                    <span className="text-slate-500">Kèm áo mưa du lịch</span>
                  </div>
                </div>

                {/* Column 2: Ô tô tự lái 4 - 7 chỗ */}
                <div className="rounded-2xl border border-sky-200/90 bg-gradient-to-b from-sky-50/50 to-white p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:border-sky-400 hover:shadow-md transition-all">
                  <div className="space-y-5">
                    {/* Column Header */}
                    <div className="flex items-start justify-between gap-3 flex-wrap border-b border-sky-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-cyan-700 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-800 block">
                            Phương tiện 4 - 7 chỗ
                          </span>
                          <h4 className="text-lg font-black text-slate-900 leading-tight">
                            {t('guide.cond_car_title')}
                          </h4>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-900 border border-cyan-200">
                          {t('guide.cond_car_badge')}
                        </span>
                        <span className="text-[11px] font-bold text-cyan-800">
                          {t('guide.cond_car_dep_badge')}
                        </span>
                      </div>
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-3.5">
                      {/* Item 1: GPLX */}
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-200">
                          <CheckCircle2 className="w-4 h-4 text-cyan-800" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">
                            {t('guide.cond_car_lic_val')}
                          </div>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed">
                            {t('guide.cond_car_lic_sub')}
                          </p>
                        </div>
                      </div>

                      {/* Item 2: Định danh VNeID / CCCD / Passport */}
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-200">
                          <CheckCircle2 className="w-4 h-4 text-cyan-800" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">
                            {t('guide.cond_car_id_val')}
                          </div>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed">
                            {t('guide.cond_car_id_sub')}
                          </p>
                        </div>
                      </div>

                      {/* Item 3: Tiền cọc */}
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-200">
                          <CheckCircle2 className="w-4 h-4 text-cyan-800" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">
                            {t('guide.cond_car_dep_val')}
                          </div>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed">
                            {t('guide.cond_car_dep_sub')}
                          </p>
                        </div>
                      </div>

                      {/* Item 4: Độ tuổi & Giao nhận */}
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-200">
                          <CheckCircle2 className="w-4 h-4 text-cyan-800" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900">
                            {t('guide.cond_car_age_val')}
                          </div>
                          <p className="text-xs text-slate-600 font-normal leading-relaxed">
                            {t('guide.cond_car_age_sub')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column footer badge */}
                  <div className="mt-5 pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 text-cyan-900 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700" />
                      100% Xe có bảo hiểm 2 chiều
                    </span>
                    <span className="text-slate-500">Rửa xe sạch sẽ</span>
                  </div>
                </div>
              </div>

              {/* Shared Bottom Commitment Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 border border-sky-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <span className="font-black text-slate-900 text-xs sm:text-sm block">
                      {t('guide.cond_commit_title')}
                    </span>
                    <p className="text-slate-600 font-normal text-xs">
                      {t('guide.cond_commit_desc')}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-sky-800 font-bold border border-sky-200 shadow-2xs text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Đối chiếu &amp; trả lại tại chỗ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUY TẮC TÁCH BẠCH 2 KHOẢN TIỀN CỌC MINH BẠCH */}
        {activeGuideTab === 'deposit' && (
          <div className="bg-white rounded-3xl border border-sky-200/90 shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-sky-100/90 via-sky-50 to-cyan-50/80 p-6 sm:p-7 border-b border-sky-200">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 text-balance">
                {t('guide.dep_flow_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl text-pretty">
                {t('guide.dep_flow_desc')}
              </p>
            </div>

            <div className="p-5 sm:p-8 space-y-8">
              {/* Visual Split Flow: 2 Pillars Side-by-Side */}
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {/* Branch 1: Khoản 1 - Cọc Giữ Xe Online */}
                  <div className="relative rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50/60 to-white p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:border-sky-400 hover:shadow-md transition-all">
                    <div className="space-y-4">
                      {/* Header with Badge */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-wider text-sky-700">
                              Giai đoạn 1 &bull; Trước chuyến đi
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                              {t('guide.dep_k1_name')}
                            </h4>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-300/80">
                          {t('guide.dep_k1_amount')}
                        </span>
                      </div>

                      {/* Stepper Timeline Mini-flow inside Card */}
                      <div className="bg-white/95 rounded-xl p-3.5 border border-sky-200/80 space-y-2.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-800">
                          <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px] shrink-0 border border-sky-300">1</div>
                          <span className="font-semibold">{t('guide.dep_k1_timing')}</span>
                        </div>
                        <div className="pl-2 border-l-2 border-sky-200 ml-2.5 py-0.5 space-y-2">
                          <div className="flex items-start gap-2 text-slate-700">
                            <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                            <span>{t('guide.dep_k1_purpose')}</span>
                          </div>
                          <div className="flex items-start gap-2 text-emerald-800 font-medium bg-emerald-50/90 p-2.5 rounded-lg border border-emerald-200">
                            <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{t('guide.dep_k1_refund')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom reassurance tag */}
                    <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5 text-sky-800 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        Trừ thẳng vào hóa đơn hợp đồng
                      </span>
                      <span className="text-slate-500 font-semibold">VietQR 24/7</span>
                    </div>
                  </div>

                  {/* Branch 2: Khoản 2 - Cọc Trách Nhiệm Nhận Xe */}
                  <div className="relative rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50/60 to-white p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:border-sky-400 hover:shadow-md transition-all">
                    <div className="space-y-4">
                      {/* Header with Badge */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-wider text-cyan-800">
                              Giai đoạn 2 &bull; Khi nhận bàn giao xe
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                              {t('guide.dep_k2_name')}
                            </h4>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-900 border border-cyan-300/80">
                          {t('guide.dep_k2_amount')}
                        </span>
                      </div>

                      {/* Stepper Timeline Mini-flow inside Card */}
                      <div className="bg-white/95 rounded-xl p-3.5 border border-sky-200/80 space-y-2.5 text-xs">
                        <div className="flex items-center gap-2 text-slate-800">
                          <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-[10px] shrink-0 border border-cyan-300">2</div>
                          <span className="font-semibold">{t('guide.dep_k2_timing')}</span>
                        </div>
                        <div className="pl-2 border-l-2 border-sky-200 ml-2.5 py-0.5 space-y-2">
                          <div className="flex items-start gap-2 text-slate-700">
                            <Check className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                            <span>{t('guide.dep_k2_purpose')}</span>
                          </div>
                          <div className="flex items-start gap-2 text-emerald-800 font-medium bg-emerald-50/90 p-2.5 rounded-lg border border-emerald-200">
                            <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{t('guide.dep_k2_refund')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom reassurance tag */}
                    <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Hoàn trả 100% tại chỗ sau 3-5 phút
                      </span>
                      <span className="text-slate-500 font-semibold">CK 24/7 hoặc Tiền mặt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Matrix Table */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-sky-700" />
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    {t('guide.dep_table_title')}
                  </h4>
                </div>

                {/* Table Container with horizontal scroll wrapper */}
                <div className="overflow-x-auto rounded-2xl border border-sky-200 shadow-2xs bg-white">
                  <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                    <thead>
                      <tr className="bg-sky-100/75 border-b border-sky-200 text-slate-900">
                        <th className="py-3 px-4 font-black uppercase text-[11px] tracking-wider w-[18%]">
                          {t('guide.dep_col_criteria')}
                        </th>
                        <th className="py-3 px-4 font-black text-sky-900 w-[30%]">
                          {t('guide.dep_col_k1')}
                        </th>
                        <th className="py-3 px-4 font-black text-cyan-900 w-[30%]">
                          {t('guide.dep_col_k2')}
                        </th>
                        <th className="py-3 px-4 font-black text-amber-900 w-[22%]">
                          {t('guide.dep_col_k3')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      <tr className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 bg-sky-50/50">
                          {t('guide.dep_row_purpose')}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          {t('guide.dep_k1_purpose')}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          {t('guide.dep_k2_purpose')}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          Bảo đảm vi phạm tốc độ/luật giao thông ngoại tỉnh
                        </td>
                      </tr>
                      <tr className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 bg-sky-50/50">
                          {t('guide.dep_row_rate')}
                        </td>
                        <td className="py-3 px-4 font-black text-sky-800">
                          {t('guide.dep_k1_amount')}
                        </td>
                        <td className="py-3 px-4 font-black text-cyan-900">
                          {t('guide.dep_k2_amount')}
                        </td>
                        <td className="py-3 px-4 font-semibold text-amber-900">
                          Tùy lộ trình ngoại tỉnh (nếu có)
                        </td>
                      </tr>
                      <tr className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 bg-sky-50/50">
                          {t('guide.dep_row_timing')}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {t('guide.dep_k1_timing')}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {t('guide.dep_k2_timing')}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          Khi ký biên bản bàn giao xe
                        </td>
                      </tr>
                      <tr className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 bg-sky-50/50">
                          {t('guide.dep_row_refund_time')}
                        </td>
                        <td className="py-3 px-4 text-emerald-800 font-bold">
                          {t('guide.dep_k1_refund')}
                        </td>
                        <td className="py-3 px-4 text-emerald-800 font-bold">
                          {t('guide.dep_k2_refund')}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          Tự động hoàn sau 15 - 30 ngày
                        </td>
                      </tr>
                      <tr className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 bg-sky-50/50">
                          {t('guide.dep_row_method')}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          {t('guide.dep_method_val1')}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          {t('guide.dep_method_val2')}
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed">
                          {t('guide.dep_method_val3')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Traffic Fine Policy Banner + 3 Trust Badges */}
              <div className="space-y-4">
                {/* Traffic Fine Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-sky-50 to-white border border-amber-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
                      <AlertCircle className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs sm:text-sm font-black text-slate-900">
                        {t('guide.dep_traffic_title')}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal max-w-2xl">
                        {t('guide.dep_traffic_desc')}
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://csgt.vn/tra-cuu-phuong-tien-vi-pham-giao-thong-qua-hinh-anh.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs border border-amber-300 shadow-2xs hover:border-amber-400 transition-all shrink-0 min-h-[44px]"
                  >
                    <span>{t('guide.dep_check_traffic_btn')}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                  </a>
                </div>

                {/* 3 Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 flex items-center gap-2.5 text-xs text-slate-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>{t('guide.dep_badge_insurance')}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
                    <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{t('guide.dep_badge_refund247')}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200 flex items-center gap-2.5 text-xs text-slate-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>{t('guide.dep_badge_nodoc')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QUY ĐỊNH TÍNH THỜI GIAN THUÊ & GIỜ TRỄ HẠN */}
        {activeGuideTab === 'hours' && (
          <div className="bg-white rounded-3xl border border-sky-200/80 shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-sky-100/90 via-sky-50 to-cyan-50/80 p-6 sm:p-7 border-b border-sky-200">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 text-balance">
                {t('guide.time_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl text-pretty">
                {t('guide.time_desc')}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-7">
              {/* Feature 1: Quy tắc cốt lõi 1 Ngày = 24 Tiếng Trọn Vẹn */}
              <div className="rounded-2xl border border-sky-200/90 bg-gradient-to-r from-sky-50/70 via-sky-50/40 to-white p-5 sm:p-6 shadow-2xs hover:border-sky-300 transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-black text-slate-900 text-balance">
                        {t('guide.time_rule_title')}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
                        {t('guide.time_rule_desc')}
                      </p>
                    </div>
                  </div>

                  {/* Practical Example Box */}
                  <div className="shrink-0 bg-white/95 rounded-xl p-4 border border-sky-200/90 shadow-2xs space-y-2 lg:max-w-xs w-full">
                    <div className="flex items-center justify-between text-[11px] font-bold text-sky-800 border-b border-sky-100 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        {t('guide.time_rule_eg_label')}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200">
                        Chuẩn 24H
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Nhận xe:</span>
                        <span className="font-bold text-slate-900">14:00 Hôm nay</span>
                      </div>
                      <div className="flex items-center justify-center py-0.5 text-sky-700 font-bold text-[11px]">
                        <ArrowRight className="w-4 h-4 mr-1 text-sky-600" />
                        Trọn 24 tiếng lưu hành
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Trả xe:</span>
                        <span className="font-bold text-slate-900">14:00 Hôm sau</span>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-sky-100 text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Tính đúng 01 ngày &bull; 0đ phụ thu đêm
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Bảng 3 Mốc Tính Giờ Trễ Hạn Trực Quan (Grace Period Breakdown) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-sky-700" />
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      {t('guide.time_tier_title')}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Áp dụng công khai cho tất cả dòng xe
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Mốc 1: Dưới 1 Giờ */}
                  <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white p-5 space-y-3.5 shadow-2xs hover:-translate-y-1 hover:border-emerald-400 hover:shadow-md transition-all duration-200 ease-out cursor-default flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-2xs shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {t('guide.time_tier1_badge')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-black text-slate-900">
                          {t('guide.time_tier1_label')}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {t('guide.time_tier1_desc')}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                      <span>Phụ phí phát sinh:</span>
                      <span className="text-sm font-black text-emerald-700">0 VNĐ</span>
                    </div>
                  </div>

                  {/* Mốc 2: Từ 1 – 3 Giờ */}
                  <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50/50 to-white p-5 space-y-3.5 shadow-2xs hover:-translate-y-1 hover:border-sky-400 hover:shadow-md transition-all duration-200 ease-out cursor-default flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black shadow-2xs shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-100 text-sky-800 border border-sky-300">
                          {t('guide.time_tier2_badge')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-black text-slate-900">
                          {t('guide.time_tier2_label')}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {t('guide.time_tier2_desc')}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] font-bold text-sky-800">
                      <span>Định mức giờ:</span>
                      <span className="text-xs font-black text-sky-900">20k – 100k/giờ</span>
                    </div>
                  </div>

                  {/* Mốc 3: Quá 4 Giờ */}
                  <div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/50 to-white p-5 space-y-3.5 shadow-2xs hover:-translate-y-1 hover:border-amber-400 hover:shadow-md transition-all duration-200 ease-out cursor-default flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black shadow-2xs shrink-0">
                          <RotateCcw className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                          {t('guide.time_tier3_badge')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-black text-slate-900">
                          {t('guide.time_tier3_label')}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {t('guide.time_tier3_desc')}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold text-amber-900">
                      <span>Quy đổi:</span>
                      <span className="text-xs font-black text-amber-900">Trọn 01 ngày thuê</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traveler Pro Tip Callout */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 border border-sky-200">
                    <Sparkles className="w-4 h-4 text-sky-700" />
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {t('guide.time_notice_tip')}
                  </p>
                </div>
                <a
                  href={`tel:${hotline.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-800 font-bold border border-sky-200 shadow-2xs hover:border-sky-300 transition-all duration-200 shrink-0 min-h-[44px]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                  <span>Hotline {hotline}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. CẨM NANG CUNG ĐƯỜNG NHA TRANG: GỢI Ý XE MÁY & Ô TÔ PHÙ HỢP (LƯỚI 3 CỘT) */}
      {/* ========================================================================= */}
      <section id="guide-routes-section" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 text-sky-800 text-xs font-bold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5 text-sky-700" />
            <span>CẨM NANG CUNG ĐƯỜNG NHA TRANG • KINH NGHIỆM ĐI ĐƯỜNG BIỂN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight text-balance">
            Gợi Ý Xe Phù Hợp Cho 3 Cung Đường Biển Đẹp Nhất
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto text-pretty">
            Mỗi cung đường vịnh biển tại Nha Trang - Khánh Hòa có đặc thù địa hình và cự ly riêng biệt. Nha Trang Car gợi ý chi tiết dòng xe và kinh nghiệm lái an toàn từ tài xế bản địa.
          </p>
        </div>

        {/* Lưới 3 Cột Bento Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {coastalRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-3xl border border-sky-200/90 shadow-[0_4px_24px_rgba(2,132,199,0.06)] hover:shadow-[0_16px_40px_rgba(2,132,199,0.12)] hover:border-sky-400 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="space-y-5">
                {/* Header Card: Icon + Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-700 to-sky-900 text-white flex items-center justify-center shadow-md shadow-sky-900/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                    <Navigation className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-black font-mono px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
                      {route.distance}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {route.idealTime}
                    </span>
                  </div>
                </div>

                {/* Tiêu đề & Cảnh quan */}
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-sky-700 transition-colors tracking-tight text-balance">
                    {route.title}
                  </h3>
                  <div className="text-xs font-bold text-sky-700 bg-sky-50/80 px-2.5 py-1 rounded-lg border border-sky-100 inline-block">
                    {route.typeBadge}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1 text-pretty">
                    {route.landscape}
                  </p>
                </div>

                {/* Phân khu gợi ý phương tiện: Ô tô & Xe máy (Thiết kế phẳng, không lồng card) */}
                <div className="space-y-3 pt-3 border-t border-sky-100">
                  {/* Ô tô */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wide">
                      <div className="w-5 h-5 rounded-md bg-sky-700 text-white flex items-center justify-center text-xs shrink-0">
                        <Car className="w-3.5 h-3.5" />
                      </div>
                      <span className="shrink-0">Ô tô:</span>
                      <span className="font-bold text-sky-900 normal-case">{route.carRec}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal text-pretty pl-7">
                      {route.carWhy}
                    </p>
                  </div>

                  {/* Xe máy */}
                  <div className="space-y-1 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wide">
                      <div className="w-5 h-5 rounded-md bg-cyan-700 text-white flex items-center justify-center text-xs shrink-0">
                        <Bike className="w-3.5 h-3.5" />
                      </div>
                      <span className="shrink-0">Xe máy:</span>
                      <span className="font-bold text-cyan-900 normal-case">{route.bikeRec}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal text-pretty pl-7">
                      {route.bikeWhy}
                    </p>
                  </div>
                </div>

                {/* Mẹo an toàn bản địa */}
                <div className="flex items-start gap-2 text-xs text-amber-950 pt-3 border-t border-sky-100/80">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium text-pretty">
                    {route.tip}
                  </span>
                </div>
              </div>

              {/* Nút CTA chọn xe cho cung đường */}
              <div className="pt-4 mt-4 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('vehicles');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-700 hover:text-white text-sky-800 text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-sky-200 group-hover:border-sky-600 select-none active:scale-[0.98]"
                >
                  <span>{route.btnLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BẢNG FAQ TƯƠNG TÁC: DẠNG LƯỚI 2 CỘT SONG SONG (TIẾT KIỆM CUỘN TRANG) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 text-sky-800 text-xs font-bold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-sky-700" />
            <span>CÂU HỎI THƯỜNG GẶP • GIẢI ĐÁP A - Z</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight text-balance">
            {t('guide.faq_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto text-pretty">
            {t('guide.faq_desc')}
          </p>
        </div>

        {/* Body: 2 Cột Song Song gồm các thẻ độc lập */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
          {/* Cột 1: Câu 1, 2, 3 */}
          <div className="space-y-4">
            {faqs.slice(0, 3).map((faq, sliceIdx) => {
              const idx = sliceIdx;
              const isOpen = openFaqIndexes.includes(idx);
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-sky-300 bg-white shadow-md shadow-sky-900/5'
                      : 'border-sky-200/80 bg-white hover:border-sky-300 hover:shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(idx)}
                    className="min-h-[56px] w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm cursor-pointer transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-600 group select-none gap-3"
                  >
                    <span className="flex items-center gap-3 pr-2">
                      <span
                        className={`w-7 h-7 rounded-xl text-xs flex items-center justify-center shrink-0 font-bold font-mono transition-colors duration-200 shadow-2xs ${
                          isOpen
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-800'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span className="text-pretty leading-snug">{faq.q}</span>
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        isOpen
                          ? 'bg-sky-100 text-sky-700'
                          : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ease-out ${
                          isOpen ? 'rotate-180 text-sky-700' : 'text-slate-500'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Smooth CSS Grid Height Animation */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1 sm:pl-14 text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty border-t border-sky-100/70 mt-1">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cột 2: Câu 4, 5, 6 */}
          <div className="space-y-4">
            {faqs.slice(3, 6).map((faq, sliceIdx) => {
              const idx = sliceIdx + 3;
              const isOpen = openFaqIndexes.includes(idx);
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-sky-300 bg-white shadow-md shadow-sky-900/5'
                      : 'border-sky-200/80 bg-white hover:border-sky-300 hover:shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(idx)}
                    className="min-h-[56px] w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm cursor-pointer transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-600 group select-none gap-3"
                  >
                    <span className="flex items-center gap-3 pr-2">
                      <span
                        className={`w-7 h-7 rounded-xl text-xs flex items-center justify-center shrink-0 font-bold font-mono transition-colors duration-200 shadow-2xs ${
                          isOpen
                            ? 'bg-sky-700 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-800'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span className="text-pretty leading-snug">{faq.q}</span>
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        isOpen
                          ? 'bg-sky-100 text-sky-700'
                          : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ease-out ${
                          isOpen ? 'rotate-180 text-sky-700' : 'text-slate-500'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Smooth CSS Grid Height Animation */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1 sm:pl-14 text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty border-t border-sky-100/70 mt-1">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BANNER HỖ TRỢ VÀ NÚT ĐẶT XE NGAY (RỘNG 1440PX) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-sky-950 p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-900">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold tracking-wider uppercase text-sky-200 bg-sky-900/80 px-3 py-1 rounded-full border border-sky-700 inline-block">
              {t('home.support_badge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white text-balance">
              {t('guide.cta_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed text-pretty">
              {t('guide.cta_desc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="min-h-[48px] px-5 py-3 rounded-2xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-sky-700 transition-all select-none active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline: {hotline}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setCustomerTab('vehicles');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-sky-50 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
            >
              <span>{t('guide.cta_btn')}</span>
              <ArrowRight className="w-4 h-4 text-sky-700" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
