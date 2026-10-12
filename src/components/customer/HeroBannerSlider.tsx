import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Sparkles,
  Video,
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

// Assets hình nền và xe trong dự án DriveRent
import garageStudioBg from '../../assets/images/garage_studio_bg.jpg';
import greenFutureBg from '../../assets/images/green_future_bg.jpeg';
import bannerNgangVideo from '../../assets/images/banner_ngang.mp4';

// Các xe đã được tách nền trong suốt chuẩn Studio
import carXpanderTransparent from '../../assets/images/car_mitsubishi_xpander_transparent.png';
import carViosTransparent from '../../assets/images/car_toyota_vios_transparent.png';
import scooterAirBladeTransparent from '../../assets/images/scooter_honda_airblade_transparent.png';
import scooterVisionTransparent from '../../assets/images/scooter_honda_vision_transparent.png';
import gfSelectedCar from '../../assets/images/gf_selected_car.png';
import gfSignatureCar from '../../assets/images/gf_signature_car.png';

// Huy hiệu danh mục phân hạng
import gfSignatureBadge from '../../assets/images/gf_signature_badge.png';
import gfSelectedBadge from '../../assets/images/gf_selected_badge.png';
import gfStandardBadge from '../../assets/images/gf_standard_badge.png';

interface SlideData {
  id: string;
  tierKey: 'signature' | 'selected' | 'standard';
  headlineMain: string;
  headlineSub: string;
  name: string;
  category: string;
  pricePerDay: number;
  pricePerHour: number;
  carImage: string;
  badgeImage: string;
  leftInfo: {
    title: string;
    desc1: string;
    desc2: string;
  };
  rightInfo: {
    bookingHint: string;
    depositPolicy: string;
  };
}

export const HeroBannerSlider: React.FC<{ onExploreClick?: () => void }> = ({ onExploreClick }) => {
  const slides: SlideData[] = [
    {
      id: 'slide-xpander',
      tierKey: 'selected',
      headlineMain: 'LƯỚT NGAY XPANDER',
      headlineSub: 'XE CHUẨN GIÁ ÊM',
      name: 'Mitsubishi Xpander 7 Chỗ Tự Động',
      category: 'MPV 7 Chỗ Gia Đình Rộng Rãi',
      pricePerDay: 950000,
      pricePerHour: 120000,
      carImage: carXpanderTransparent,
      badgeImage: gfSelectedBadge,
      leftInfo: {
        title: 'Kiểm định 12 hạng mục',
        desc1: 'Kiểm tra kỹ thuật khung gầm, phanh đĩa và hệ thống điều hòa trước khi bàn giao',
        desc2: 'Hồ sơ pháp lý minh bạch 100%'
      },
      rightInfo: {
        bookingHint: 'Giữ chỗ 10 phút nhận xe',
        depositPolicy: 'Cọc online 20% - Hoàn 100%'
      }
    },
    {
      id: 'slide-vios',
      tierKey: 'standard',
      headlineMain: 'LƯỚT NGAY VIOS 1.5G',
      headlineSub: 'TIẾT KIỆM & ÊM ÁI',
      name: 'Toyota Vios 1.5G CVT Đời Mới',
      category: 'Sedan 5 Chỗ Đô Thị Tiết Kiệm',
      pricePerDay: 750000,
      pricePerHour: 90000,
      carImage: carViosTransparent,
      badgeImage: gfStandardBadge,
      leftInfo: {
        title: 'Vận hành êm ái',
        desc1: 'Trang bị Apple CarPlay, camera hành trình và cảm biến lùi an toàn',
        desc2: 'Giao xe tận nơi sân bay & trung tâm'
      },
      rightInfo: {
        bookingHint: 'Chỉ từ 90k/giờ tự lái',
        depositPolicy: 'Thủ tục CCCD nhận xe trong 5 phút'
      }
    },
    {
      id: 'slide-vf8',
      tierKey: 'signature',
      headlineMain: 'LƯỚT NGAY VF 8',
      headlineSub: 'LÊN ĐỜI XE LƯỚT',
      name: 'VinFast VF 8 Plus - SUV Điện Thông Minh',
      category: 'D-SUV 5 Chỗ Công Nghệ Cao',
      pricePerDay: 1150000,
      pricePerHour: 140000,
      carImage: gfSelectedCar,
      badgeImage: gfSignatureBadge,
      leftInfo: {
        title: 'Tiêu chuẩn Signature',
        desc1: 'Mạng lưới showroom chuẩn xưởng dịch vụ chính hãng toàn quốc',
        desc2: 'Miễn phí sạc pin tại trạm V-GREEN'
      },
      rightInfo: {
        bookingHint: 'Trải nghiệm xe điện tương lai',
        depositPolicy: 'Bảo hiểm thân vỏ toàn diện 100%'
      }
    },
    {
      id: 'slide-airblade',
      tierKey: 'standard',
      headlineMain: 'LƯỚT NGAY AIR BLADE',
      headlineSub: 'DẠO PHỐ CỰC CHILL',
      name: 'Honda Air Blade 125cc Smartkey',
      category: 'Xe Tay Ga Thể Thao Đô Thị',
      pricePerDay: 180000,
      pricePerHour: 30000,
      carImage: scooterAirBladeTransparent,
      badgeImage: gfStandardBadge,
      leftInfo: {
        title: 'Tự do khám phá',
        desc1: 'Trang bị 2 mũ bảo hiểm đạt chuẩn, kèm áo mưa & giá đỡ điện thoại GPS',
        desc2: 'Máy êm tiết kiệm xăng vượt trội'
      },
      rightInfo: {
        bookingHint: 'Giá thuê chỉ từ 30k/giờ',
        depositPolicy: 'Không phát sinh phụ phí ẩn'
      }
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [bgMode, setBgMode] = useState<'garage' | 'greenfuture' | 'video'>('garage');

  // Tự động chuyển slide sau 6 giây
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setAnimKey((k) => k + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setAnimKey((k) => k + 1);
  };

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setCurrentIndex(idx);
    setAnimKey((k) => k + 1);
  };

  const currentSlide = slides[currentIndex];
  const nextSlide = slides[(currentIndex + 1) % slides.length];

  return (
    <div
      className="relative w-full bg-slate-100 pt-3 pb-12 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* KHUNG SHOWROOM CÔNG NGHỆ CAO CHUẨN ĐỒNG NHẤT */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl min-h-[520px] sm:min-h-[580px] md:min-h-[620px] flex flex-col justify-between p-5 sm:p-8 md:p-10 bg-slate-900">
          
          {/* 1. HÌNH NỀN ẨN PHÍA SAU: SHOWROOM GARA ĐÃ XÓA XE */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {bgMode === 'video' ? (
              <video
                key="gf-video-bg"
                autoPlay
                loop
                muted
                playsInline
                poster={garageStudioBg}
                className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
              >
                <source src={bannerNgangVideo} type="video/mp4" />
              </video>
            ) : bgMode === 'greenfuture' ? (
              <img
                src={greenFutureBg}
                alt="Green Future Robotic Studio"
                className="w-full h-full object-cover object-center filter brightness-[0.97]"
              />
            ) : (
              <img
                src={garageStudioBg}
                alt="High-tech Garage Studio"
                className="w-full h-full object-cover object-center filter brightness-[0.97] contrast-[1.02]"
              />
            )}

            {/* Lớp phủ tương phản mềm mại giúp văn bản luôn nổi bật rõ ràng */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-slate-900/35" />

            {/* Logo chìm mờ DRIVERENT trong không gian gara */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] font-black text-8xl md:text-9xl tracking-widest text-slate-900 select-none pointer-events-none">
              DRIVERENT
            </div>

            {/* Ánh sáng sàn phản chiếu bóng bẩy */}
            <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          </div>

          {/* NÚT CHUYỂN ĐỔI CHẾ ĐỘ NỀN GARA / STUDIO / VIDEO Ở GÓC PHẢI TRÊN */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 p-1 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200 shadow-xs transition-all">
            <button
              onClick={() => setBgMode('garage')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                bgMode === 'garage'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Hình nền Gara Đèn Vòm LED (Đã xóa xe)"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Gara Vòm LED</span>
            </button>
            <button
              onClick={() => setBgMode('greenfuture')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                bgMode === 'greenfuture'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Hình nền Robot Studio"
            >
              <Layers className="w-3 h-3" />
              <span>Robot Studio</span>
            </button>
            <button
              onClick={() => setBgMode('video')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                bgMode === 'video'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Chuyển sang Video 3D loop"
            >
              <Video className="w-3 h-3" />
              <span>Video 3D</span>
            </button>
          </div>

          {/* 2. TIÊU ĐỀ LỚN TRÊN ĐẦU (HIỆN LÊN SAU KHI XE VÀO) */}
          <div
            key={`headline-${animKey}`}
            className="relative z-20 text-center space-y-1 pt-2 animate-topTitle"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase drop-shadow-xs">
              {currentSlide.headlineMain}
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-emerald-800 tracking-wide uppercase">
              {currentSlide.headlineSub}
            </p>
          </div>

          {/* 3. KHU VỰC TRUNG TÂM: XE CHẠY VÀO TRỰC TIẾP TRÊN BỆ GARA + 2 BÊN THÔNG TIN */}
          <div className="relative z-20 my-auto py-2 flex items-center justify-between">
            
            {/* THÔNG TIN BÊN TRÁI: KIỂM ĐỊNH 12 HẠNG MỤC */}
            <div
              key={`left-panel-${animKey}`}
              className="hidden lg:block w-72 space-y-3 text-left animate-leftPanel"
            >
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {currentSlide.leftInfo.title}
                    </h3>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                      Tiêu chuẩn xanh
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {currentSlide.leftInfo.desc1}
                </p>

                <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{currentSlide.leftInfo.desc2}</span>
                </div>
              </div>
            </div>

            {/* CHIẾC XE CHÍNH GIỮA: ĐÃ TÁCH NỀN TRONG SUỐT ĐỖ ĐỒNG NHẤT TRÊN BỆ GARA */}
            <div className="relative flex-1 flex items-center justify-center min-h-[240px] sm:min-h-[300px] md:min-h-[340px]">
              <div
                key={`car-viewport-${animKey}`}
                className="relative z-20 animate-carDriveIn flex flex-col items-center justify-center"
              >
                {/* Ánh sáng đèn vòm phản chiếu nhẹ dưới gầm */}
                <div className="absolute -bottom-3 w-3/4 h-14 bg-gradient-to-t from-white/70 via-emerald-100/25 to-transparent blur-xl pointer-events-none" />

                {/* Ảnh xe đã xóa nền đỗ hoàn hảo trên sàn gara */}
                <img
                  src={currentSlide.carImage}
                  alt={currentSlide.name}
                  className="w-auto h-48 sm:h-64 md:h-76 lg:h-84 object-contain filter drop-shadow-[0_22px_30px_rgba(0,0,0,0.42)] transition-transform duration-300 hover:scale-[1.02]"
                />

                {/* Bóng đổ sàn xe ăn khớp với bệ nâng gara */}
                <div className="w-[85%] h-5 mx-auto bg-slate-950/45 blur-md rounded-full -mt-3 animate-shadowSettle" />
                
                {/* Tên xe gắn nhãn kèm giá trên mobile */}
                <div className="lg:hidden mt-3 text-center space-y-1">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-black text-slate-900 shadow-md border border-slate-200">
                    <span>{currentSlide.name}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-emerald-700">{formatVND(currentSlide.pricePerDay)}/ngày</span>
                  </div>
                </div>
              </div>
            </div>

            {/* THÔNG TIN BÊN PHẢI: GIÁ & MÃ QR / ĐẶT XE */}
            <div
              key={`right-panel-${animKey}`}
              className="hidden lg:flex flex-col items-end w-72 space-y-3 text-right animate-rightPanel"
            >
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg w-full space-y-2 text-right">
                <div className="flex items-center justify-end gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bảng giá niêm yết</span>
                </div>
                
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tracking-tight block">
                    {formatVND(currentSlide.pricePerDay)}
                    <span className="text-xs text-slate-500 font-normal"> /ngày</span>
                  </span>
                  <span className="text-xs text-slate-600 font-semibold font-mono">
                    ({formatVND(currentSlide.pricePerHour)} /giờ)
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-left">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-900">{currentSlide.rightInfo.bookingHint}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">{currentSlide.rightInfo.depositPolicy}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Xem chi tiết & Đặt ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4. THÔNG TIN BÊN DƯỚI: 3 HUY HIỆU DANH MỤC */}
          <div
            key={`bottom-bar-${animKey}`}
            className="relative z-20 pt-4 border-t border-slate-300/60 flex flex-wrap items-center justify-between gap-4 animate-bottomBar"
          >
            {/* CÁC HUY HIỆU XE TRONG DỰ ÁN */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              {slides.map((s, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => goToSlide(idx)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-white shadow-md border border-emerald-500/40 ring-2 ring-emerald-500/20 scale-105'
                        : 'bg-white/60 hover:bg-white/90 border border-slate-200/60 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={s.badgeImage}
                      alt={s.tierKey}
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow-xs"
                    />
                    <div>
                      <span className={`text-xs font-black uppercase block leading-tight ${
                        isActive ? 'text-emerald-700' : 'text-slate-800'
                      }`}>
                        {s.tierKey}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                        {s.name.split(' ')[0]} {s.name.split(' ')[1]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CHẤM ĐIỀU HƯỚNG SLIDE */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-9 bg-emerald-600 shadow-xs'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Xem xe ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* TEASER XE KẾ TIẾP Ở GÓC DƯỚI TRÁI */}
          <div
            onClick={handleNext}
            className="hidden sm:flex absolute bottom-3 left-4 z-30 items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white backdrop-blur-md border border-slate-200 shadow-xs transition-all cursor-pointer group"
            title="Bấm để xem xe tiếp theo"
          >
            <div className="w-12 h-8 overflow-hidden relative rounded-md bg-slate-100 flex items-center justify-center">
              <img
                src={nextSlide.carImage}
                alt={nextSlide.name}
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Kế tiếp</span>
              <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700 flex items-center gap-1">
                {nextSlide.headlineMain} →
              </span>
            </div>
          </div>

          {/* NÚT ĐIỀU HƯỚNG TRÁI / PHẢI */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-700 flex items-center justify-center shadow-lg border border-slate-200 transition-all cursor-pointer hover:scale-110 active:scale-95"
            title="Lướt xe trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-700 flex items-center justify-center shadow-lg border border-slate-200 transition-all cursor-pointer hover:scale-110 active:scale-95"
            title="Lướt xe kế tiếp"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* KEYFRAMES HIỆU ỨNG THỜI GIAN THỰC */}
      <style>{`
        @keyframes carDriveInEffect {
          0% {
            opacity: 0;
            transform: translateX(140%) scale(0.92);
            filter: blur(4px);
          }
          65% {
            opacity: 1;
            transform: translateX(-18px) scale(1.02);
            filter: blur(0px);
          }
          85% {
            transform: translateX(6px) scale(0.995);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0px);
          }
        }
        .animate-carDriveIn {
          animation: carDriveInEffect 0.85s cubic-bezier(0.18, 0.9, 0.28, 1) forwards;
        }

        @keyframes shadowSettleEffect {
          0% {
            opacity: 0;
            transform: scaleX(0.4);
          }
          65% {
            opacity: 0.85;
            transform: scaleX(1.15);
          }
          100% {
            opacity: 0.55;
            transform: scaleX(1);
          }
        }
        .animate-shadowSettle {
          animation: shadowSettleEffect 0.85s cubic-bezier(0.18, 0.9, 0.28, 1) forwards;
        }

        @keyframes topTitleEffect {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-topTitle {
          animation: topTitleEffect 0.6s ease-out 0.2s both;
        }

        @keyframes leftPanelEffect {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-leftPanel {
          animation: leftPanelEffect 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
        }

        @keyframes rightPanelEffect {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-rightPanel {
          animation: rightPanelEffect 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.52s both;
        }

        @keyframes bottomBarEffect {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-bottomBar {
          animation: bottomBarEffect 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
        }
      `}</style>
    </div>
  );
};
