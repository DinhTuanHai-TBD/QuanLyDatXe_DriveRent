import React from 'react';
import { useApp } from '../../context/AppContext';
import logoTransparent from '../../assets/images/logo_transparent.png';
import nhaTrangCoastalBay from '../../assets/images/nha_trang_coastal_bay.jpg';
import nhaTrangCoastalRoad from '../../assets/images/nhatrang_coastal_road.jpg';
import carInteriorClean from '../../assets/images/car_interior_clean.jpg';
import carRearTrunk from '../../assets/images/car_rear_trunk.jpg';
import carVf8 from '../../assets/images/car_vinfast_vf8.webp';
import carVf3 from '../../assets/images/car_vinfast_vf3.webp';
import carCarnival from '../../assets/images/car_kia_carnival.jpg';
import carMazda3 from '../../assets/images/car_mazda_3.png';
import scooterSh from '../../assets/images/scooter_honda_sh.jpg';
import {
  Car,
  Bike,
  ShieldCheck,
  Wrench,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
  Award,
  Users,
  Compass,
  FileText,
  AlertCircle,
  ArrowRight,
  Zap,
  Navigation,
  ExternalLink,
  PhoneCall,
  Check,
  HeartHandshake
} from 'lucide-react';

export const AboutCustomerView: React.FC = () => {
  const { settings, setCustomerTab, t } = useApp();

  const brandName = settings?.brandTitle || settings?.storeName || 'Nha Trang Car';
  const address = settings?.address || '25 Lê Lợi, Phường Xương Huân, TP. Nha Trang, Tỉnh Khánh Hòa';
  const hotline = settings?.hotline || '0905 888 999';

  // 4 Chỉ số ấn tượng (Stats Counter)
  const stats = [
    {
      num: '100%',
      title: 'Xe đời mới 2023 – 2025',
      desc: 'Toàn bộ đội xe được kiểm định định kỳ, trang bị bảo hiểm thân vỏ 100% và bảo dưỡng chính hãng.',
      icon: Car,
      color: 'text-sky-700 bg-sky-50 border-sky-200'
    },
    {
      num: '15 Phút',
      title: 'Giao xe nội thành 0đ',
      desc: 'Bàn giao xe tận sảnh các khách sạn ven biển Trần Phú, Phạm Văn Đồng và Sân bay Cam Ranh đúng giờ.',
      icon: Clock,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      num: '24/7',
      title: 'Đội cứu hộ lưu động',
      desc: 'Kỹ thuật viên túc trực hỗ trợ sự cố thủng lốp, kích bình ắc quy, đổi xe thay thế trên mọi cung đường vịnh.',
      icon: Wrench,
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      num: '0 VNĐ',
      title: 'Chi phí ẩn phát sinh',
      desc: 'Minh bạch hợp đồng, giá thuê trọn gói niêm yết rõ ràng và hoàn trả 100% tiền cọc ngay khi nhận lại xe.',
      icon: ShieldCheck,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    }
  ];

  // Quy trình kiểm định chất lượng 4 bước với hình ảnh thực tế
  const inspectionSteps = [
    {
      step: '01',
      title: 'Kiểm định kỹ thuật 30 điểm',
      desc: 'Đo áp suất 4 lốp, độ mòn đĩa phanh, mức dầu máy, nước làm mát và quét chẩn đoán mã lỗi động cơ điện tử OBD.',
      tag: 'Kỹ thuật chính hãng',
      image: carInteriorClean,
      icon: Wrench
    },
    {
      step: '02',
      title: 'Khử khuẩn nội thất chuẩn y tế',
      desc: 'Hút bụi chuyên sâu từng khe kẽ, xông tinh dầu thảo mộc tự nhiên và khử khuẩn Ozone khoang cabin trước khi giao.',
      tag: 'Chuẩn y tế 100%',
      image: carInteriorClean,
      icon: Sparkles
    },
    {
      step: '03',
      title: 'Tiện ích hành trình & Cốp rộng',
      desc: 'Khoang hành lý rộng rãi chứa vừa 3-4 vali lớn, trang bị sẵn sạc nhanh đa năng, giá đỡ điện thoại & Vietmap.',
      tag: 'Cốp rộng thoải mái',
      image: carRearTrunk,
      icon: ShieldCheck
    },
    {
      step: '04',
      title: 'Bàn giao minh bạch 360°',
      desc: 'Chụp ảnh & quay video kiểm tra ngoại quan 360° cùng khách hàng, giao xe với bình đầy 100% xăng hoặc pin.',
      tag: 'Minh bạch 0 vết xước',
      image: nhaTrangCoastalRoad,
      icon: CheckCircle2
    }
  ];

  // Showcase Gallery Mosaic Grid: Đội xe giữa khung cảnh biển đảo Nha Trang
  const galleryItems = [
    {
      title: 'Đội Xe Điện Xanh VinFast (VF8 & VF9)',
      category: 'Xe Điện Xanh Hiện Đại',
      desc: 'Trải nghiệm công nghệ lái thông minh ADAS, êm ái trên cung đường biển Trần Phú - Vĩnh Hòa.',
      image: nhaTrangCoastalBay,
      badge: 'VinFast Fleet',
      span: 'lg:col-span-8 lg:row-span-2'
    },
    {
      title: 'Crossover Mini VinFast VF3',
      category: 'Check-in Thời Thượng',
      desc: 'Nhỏ gọn, màu sắc bắt mắt, linh hoạt luồn lách phố ẩm thực Chợ Đầm.',
      image: carVf3,
      badge: 'Hot Trend',
      span: 'lg:col-span-4'
    },
    {
      title: 'Sedan Thể Thao Mazda 3 / Accent',
      category: 'Cặp Đôi Dạo Biển',
      desc: 'Thiết kế sang trọng, tiết kiệm nhiên liệu cho kỳ nghỉ dưỡng trăng mật lãng mạn.',
      image: carMazda3,
      badge: 'Cặp đôi',
      span: 'lg:col-span-4'
    },
    {
      title: 'MPV 7 Chỗ VIP Kia Carnival / Xpander',
      category: 'Gia Đình & Đoàn Du Lịch',
      desc: 'Không gian thương gia rộng rãi, cách âm tốt cho chuyến đi Cam Ranh - Bình Ba.',
      image: carCarnival,
      badge: 'Gia đình 7 chỗ',
      span: 'lg:col-span-6'
    },
    {
      title: 'Xe Máy Tay Ga Cao Cấp Honda SH / Air Blade',
      category: 'Phượt Đèo Biển Vĩnh Hy',
      desc: 'Động cơ bốc, lốp bám đường cực tốt, thỏa sức săn bình minh đèo Lương Sơn.',
      image: scooterSh,
      badge: 'Phượt biển',
      span: 'lg:col-span-6'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 selection:bg-sky-500 selection:text-white space-y-12 sm:space-y-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO COVER: BRAND STORYTELLING TOÀN CẢNH VỊNH BIỂN NHA TRANG */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden w-full min-h-[460px] sm:min-h-[520px] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 border-b border-sky-200/80 shadow-xs"
        style={{
          backgroundImage: `url(${nhaTrangCoastalRoad})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-sky-950/80 to-slate-950/90 pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-center space-y-5 my-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-cyan-300 border border-white/20 backdrop-blur-md text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="tracking-wide uppercase font-black">
              {t('about.badge', 'CÂU CHUYỆN THƯƠNG HIỆU DRIVERENT NHA TRANG')}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-md">
              {t('about.hero_title', 'Tự Do Làm Chủ Mọi Hành Trình Biển')}
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-200 max-w-3xl mx-auto drop-shadow-sm leading-relaxed text-pretty">
              {t('about.hero_desc', 'Chúng tôi kết nối du khách với những cung đường biển đẹp nhất miền Trung bằng đội xe đời mới chất lượng cao, thủ tục giao nhận minh bạch và dịch vụ cứu hộ 24/7 tận tâm.')}
            </p>
          </div>

          {/* Slogan & Nút Khám Phá */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 text-sky-200 border border-sky-500/30 backdrop-blur-md text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Tiêu chuẩn dịch vụ 5 sao &bull; Cam kết 0đ phụ phí ẩn</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setCustomerTab('vehicles');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Xem đội xe &bull; Đặt cọc giữ chỗ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DẢI CHỈ SỐ ẤN TƯỢNG (STATS COUNTER): 4 KHỐI NGANG LẤP ĐẦY MAX-W-[1440PX] */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-sky-100 hover:border-sky-300 shadow-[0_8px_30px_rgba(2,132,199,0.08)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                      Cam kết chất lượng
                    </span>
                  </div>

                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
                      {s.num}
                    </div>
                    <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1 tracking-tight">
                      {s.title}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-sky-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Tiêu chuẩn vận hành DriveRent</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CÂU CHUYỆN THƯƠNG HIỆU & SỨ MỆNH KHỞI NGUYÊN (INTRO SPLIT GRID) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-sky-200/90 p-6 sm:p-10 shadow-sm">
          
          {/* Cột trái (7/12): Câu chuyện khởi nguồn */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-black uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5 text-sky-600" />
              <span>Sứ mệnh đồng hành cùng du khách</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              Kiến Tạo Trải Nghiệm Du Lịch Tự Lái Chuẩn Mực &amp; Văn Minh
            </h2>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Được thành lập từ những người con sinh ra và lớn lên tại phố biển Nha Trang, DriveRent thấu hiểu rằng: Mỗi chuyến du lịch không đơn thuần chỉ là di chuyển từ điểm A đến điểm B, mà là những khoảnh khắc gia đình quây quần, những bức ảnh kỷ niệm tuyệt đẹp bên đèo Lương Sơn và sự thảnh thơi khi được tự do làm chủ vô lăng.
              </p>
              <p>
                Chúng tôi xóa bỏ hoàn toàn nỗi lo của khách du lịch về xe cũ nát, trễ giờ bàn giao hay các khoản phụ phí vô lý. Tại DriveRent, 100% dòng xe đưa vào vận hành đều là đời mới 2023 - 2025, được bảo hiểm thân vỏ đầy đủ và khử khuẩn nội thất trước từng lượt đón khách.
              </p>
            </div>

            {/* 3 Trụ cột giá trị cốt lõi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <span className="text-sm font-black text-sky-900 block">Minh Bạch</span>
                <p className="text-xs text-slate-600">Báo giá trọn gói niêm yết, hợp đồng điện tử rõ ràng từng điều khoản.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <span className="text-sm font-black text-sky-900 block">Tiện Lợi</span>
                <p className="text-xs text-slate-600">Giao nhận xe tận sảnh khách sạn &amp; sân bay Cam Ranh 24/7 chỉ trong 10 phút.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <span className="text-sm font-black text-sky-900 block">An Tâm</span>
                <p className="text-xs text-slate-600">Đội cứu hộ cơ động toàn tỉnh có mặt trong 15-20 phút giải quyết mọi sự cố.</p>
              </div>
            </div>
          </div>

          {/* Cột phải (5/12): Visual Showcase Logo & Badge */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-8 text-white border border-slate-700/60 shadow-xl flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-48 h-32 flex items-center justify-center p-3">
              <img
                src={logoTransparent}
                alt="DriveRent Nha Trang"
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight">
                {brandName} &bull; Hệ Thống Xe Tự Lái Hàng Đầu
              </h3>
              <p className="text-xs text-slate-300">
                Showroom 25 Lê Lợi, Phường Xương Huân, TP. Nha Trang
              </p>
            </div>

            <div className="w-full pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span className="font-mono text-lg font-black text-amber-300 block">15.000+</span>
                <span className="text-[11px] text-slate-300">Lượt khách hài lòng</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span className="font-mono text-lg font-black text-cyan-300 block">4.9 / 5.0</span>
                <span className="text-[11px] text-slate-300">Đánh giá Google Maps</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. QUY TRÌNH KIỂM ĐỊNH CHẤT LƯỢNG 4 BƯỚC (BENTO GRID 4 CỘT VỚI ẢNH THỰC TẾ) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-sky-100">
          <div className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
              TIÊU CHUẨN AN TOÀN TUYỆT ĐỐI
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Quy Trình Kiểm Định &amp; Bàn Giao Xe 4 Bước
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
              Mỗi phương tiện trước khi trao tay khách hàng đều trải qua quy trình kiểm tra nghiêm ngặt tại xưởng kỹ thuật DriveRent.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đạt chuẩn kiểm định Sở GTVT Khánh Hòa</span>
          </div>
        </div>

        {/* Bento Grid 4 Cột Rộng Mở */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inspectionSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-sky-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Area with Tag */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    {/* Step Number Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="w-8 h-8 rounded-xl bg-sky-700 text-white font-black text-xs font-mono flex items-center justify-center shadow-md">
                        {step.step}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/25 text-[11px]">
                        {step.tag}
                      </span>
                      <Icon className="w-4 h-4 text-cyan-300" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-black text-base text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-sky-100 flex items-center gap-1.5 text-[11px] font-bold text-sky-700">
                    <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Nghiệm thu trước từng chuyến xe</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BỘ SƯU TẬP HÌNH ẢNH THỰC TẾ: SHOWCASE MOSAIC GRID HIỆN ĐẠI (MAX-W-[1440PX]) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-sky-100">
          <div className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
              ĐỘI XE THỰC TẾ TẠI VỊNH BIỂN
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Showcase Bộ Sưu Tập Xe Tự Lái Nha Trang
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
              Từ xe điện xanh công nghệ cao VinFast đến xe gia đình 7 chỗ và xe máy phượt biển đảo Vĩnh Hy.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCustomerTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-sky-700 text-white font-black text-xs transition-all cursor-pointer shadow-sm"
          >
            <span>Xem chi tiết giá từng xe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mosaic Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl overflow-hidden border border-sky-200/90 relative group shadow-sm hover:shadow-xl transition-all duration-300 min-h-[280px] sm:min-h-[320px] flex flex-col justify-end p-6 ${item.span}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Overlay Content */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-cyan-300 border border-white/25 text-[11px] font-black uppercase">
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    &bull; {item.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-200 max-w-xl leading-relaxed text-pretty">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. VỊ TRÍ SHOWROOM TRUNG TÂM 25 LÊ LỢI & KẾT NỐI ĐỊA ĐIỂM (COMMAND HUB) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="bg-white rounded-3xl border border-sky-200/90 p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-100">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
                TRUNG TÂM ĐIỀU HÀNH &amp; SHOWROOM
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Văn Phòng &amp; Bãi Xe Trung Tâm TP. Nha Trang
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                📍 {address} — Giao xe tận nơi miễn phí trong 15 phút
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=25+L%C3%AA+L%E1%BB%A3i,+X%C6%B0%C6%A1ng+Hu%C3%A2n,+Nha+Trang,+Kh%C3%A1nh+H%C3%B2a"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Chỉ đường Google Maps</span>
              </a>

              <a
                href={`tel:${hotline.replace(/\s+/g, '')}`}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-sky-600" />
                <span>{hotline}</span>
              </a>
            </div>
          </div>

          {/* Grid Thông Tin Địa Chỉ & Bản Đồ Tương Tác */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* 3 Thẻ Thông Tin Chi Tiết (5/12) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Địa chỉ tiếp đón
                </span>
                <p className="font-bold text-sm text-slate-900 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </p>
                <p className="text-xs text-slate-600 pl-6">
                  Vị trí đắc địa ngay góc Lê Lợi - Phan Chu Trinh, cách Chợ Đầm 300m và bờ biển Trần Phú 400m.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Thời gian hoạt động
                </span>
                <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>06:00 - 22:00 hàng ngày (Cứu hộ trực 24/7)</span>
                </p>
                <p className="text-xs text-slate-600 pl-6">
                  Phục vụ liên tục kể cả Thứ 7, Chủ Nhật và ngày Lễ Tết. Giao xe sân bay Cam Ranh xuyên đêm theo số hiệu chuyến bay.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Kênh hỗ trợ chính thức
                </span>
                <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Hotline: {hotline} &bull; Zalo OA</span>
                </p>
                <p className="text-xs text-slate-600 pl-6">
                  Email hỗ trợ: {settings.email || 'support@driverent.vn'}
                </p>
              </div>
            </div>

            {/* Iframe Google Maps (7/12) */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-sky-200/90 shadow-2xs relative bg-slate-100 min-h-[340px]">
              <iframe
                title="Bản đồ Showroom DriveRent Nha Trang"
                src="https://maps.google.com/maps?q=25%20L%C3%AA%20L%E1%BB%A3i%2C%20X%C6%B0%C6%A1ng%20Hu%C3%A2n%2C%20Nha%20Trang%2C%20Kh%C3%A1nh%20H%C3%B2a&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[340px] border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-sky-200/90 shadow-md text-xs font-bold text-slate-900 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Đang mở cửa đón khách &bull; 25 Lê Lợi</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FOOTER CALL TO ACTION (MAX-W-[1440PX]) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-800/80">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold tracking-wider uppercase text-cyan-300 bg-sky-900/80 px-3 py-1 rounded-full border border-sky-700 inline-block">
              KHÁM PHÁ NHA TRANG THEO CÁCH CỦA BẠN
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Sẵn Sàng Cho Chuyến Lăn Bánh Tuyệt Vời?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed text-pretty">
              Chọn dòng xe yêu thích, giữ chỗ online chỉ với tiền cọc từ 500k và nhận xe sạch đẹp tận nơi sau 15 phút.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="min-h-[48px] px-5 py-3 rounded-2xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-sky-700 transition-all select-none active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>Hotline 24/7: {hotline}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setCustomerTab('vehicles');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
            >
              <span>Xem toàn bộ xe &amp; Đặt cọc</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
