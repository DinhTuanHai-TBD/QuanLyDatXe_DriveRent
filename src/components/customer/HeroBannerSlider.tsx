import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

// Hình nền Gara Vòm LED chuẩn Studio
import garageStudioBg from '../../assets/images/garage_studio_bg.jpg';

// Các xe đã được tách nền trong suốt chuẩn Studio
import carXpanderTransparent from '../../assets/images/car_mitsubishi_xpander_transparent.png';
import carViosTransparent from '../../assets/images/car_toyota_vios_transparent.png';
import scooterAirBladeTransparent from '../../assets/images/scooter_honda_airblade_transparent.png';
import gfSelectedCar from '../../assets/images/gf_selected_car.png';

interface SlideData {
  id: string;
  headlineMain: string;
  headlineSub: string;
  name: string;
  category: string;
  pricePerDay: number;
  pricePerHour: number;
  carImage: string;
  leftInfo: {
    title: string;
    badge: string;
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
      headlineMain: 'LƯỚT NGAY XPANDER',
      headlineSub: 'XE CHUẨN GIÁ ÊM',
      name: 'Mitsubishi Xpander 7 Chỗ Tự Động',
      category: 'MPV 7 Chỗ Gia Đình Rộng Rãi',
      pricePerDay: 950000,
      pricePerHour: 120000,
      carImage: carXpanderTransparent,
      leftInfo: {
        title: 'Kiểm định 12 hạng mục',
        badge: 'TIÊU CHUẨN XANH',
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
      headlineMain: 'LƯỚT NGAY VIOS 1.5G',
      headlineSub: 'TIẾT KIỆM & ÊM ÁI',
      name: 'Toyota Vios 1.5G CVT Đời Mới',
      category: 'Sedan 5 Chỗ Đô Thị Tiết Kiệm',
      pricePerDay: 750000,
      pricePerHour: 90000,
      carImage: carViosTransparent,
      leftInfo: {
        title: 'Vận hành êm ái',
        badge: 'ĐÔ THỊ THÔNG MINH',
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
      headlineMain: 'LƯỚT NGAY VF 8',
      headlineSub: 'LÊN ĐỜI XE LƯỚT',
      name: 'VinFast VF 8 Plus - SUV Điện Thông Minh',
      category: 'D-SUV 5 Chỗ Công Nghệ Cao',
      pricePerDay: 1150000,
      pricePerHour: 140000,
      carImage: gfSelectedCar,
      leftInfo: {
        title: 'Tiêu chuẩn Signature',
        badge: 'CÔNG NGHỆ TƯƠNG LAI',
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
      headlineMain: 'LƯỚT NGAY AIR BLADE',
      headlineSub: 'DẠO PHỐ CỰC CHILL',
      name: 'Honda Air Blade 125cc Smartkey',
      category: 'Xe Tay Ga Thể Thao Đô Thị',
      pricePerDay: 180000,
      pricePerHour: 30000,
      carImage: scooterAirBladeTransparent,
      leftInfo: {
        title: 'Tự do khám phá',
        badge: 'TIỆN ÍCH TỐI ĐA',
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

  return (
    <div
      className="relative w-full overflow-hidden select-none min-h-[740px] sm:min-h-[780px] md:min-h-[840px] lg:min-h-[880px] flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. HÌNH NỀN GARA FULL MÀN HÌNH (EDGE-TO-EDGE) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={garageStudioBg}
          alt="High-tech Garage Studio"
          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
        />

        {/* Lớp phủ tương phản Gradient Liquid mượt mà */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-slate-950/40" />

        {/* Watermark mờ DRIVERENT trong không gian gara */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] font-black text-8xl md:text-9xl lg:text-[11rem] tracking-widest text-slate-900 select-none pointer-events-none">
          DRIVERENT
        </div>

        {/* Vệt ánh sáng mặt sàn phản chiếu bóng xe */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
      </div>

      {/* KHUNG KÍNH TRONG SUỐT LIQUID GLASS VIỀN NGOÀI (CHUẨN GREEN FUTURE) */}
      <div className="absolute top-28 sm:top-28 md:top-30 bottom-4 left-3 right-3 sm:left-5 sm:right-5 md:left-7 md:right-7 rounded-[2.5rem] border border-white/40 pointer-events-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-[1px] z-10" />

      {/* 2. TIÊU ĐỀ LỚN TRÊN ĐẦU (RỘNG RÃI, DƯỚI THANH HEADER LIQUID GLASS CỐ ĐỊNH) */}
      <div
        key={`headline-${animKey}`}
        className="relative z-20 text-center space-y-2 pt-32 sm:pt-36 md:pt-40 px-4 animate-topTitle"
      >
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight uppercase drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)]">
          {currentSlide.headlineMain}
        </h1>
        <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-emerald-800 tracking-wide uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]">
          {currentSlide.headlineSub}
        </p>
      </div>

      {/* 3. KHU VỰC TRUNG TÂM: XE CHẠY VÀO & 2 BÊN THÔNG TIN LIQUID GLASS */}
      <div className="relative z-20 my-auto py-2 w-full px-8 sm:px-14 md:px-20 lg:px-24 xl:px-32 flex items-center justify-between">
        
        {/* THÔNG TIN BÊN TRÁI: KIỂM ĐỊNH 12 HẠNG MỤC (LIQUID GLASS FROSTED) */}
        <div
          key={`left-panel-${animKey}`}
          className="hidden lg:block w-80 space-y-3 text-left animate-leftPanel shrink-0"
        >
          <div className="p-5 rounded-3xl bg-white/20 hover:bg-white/30 backdrop-blur-2xl border border-white/50 shadow-[0_12px_36px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.7)] space-y-3 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/90 text-white flex items-center justify-center shadow-md backdrop-blur-sm">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                  {currentSlide.leftInfo.title}
                </h3>
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider">
                  {currentSlide.leftInfo.badge}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              {currentSlide.leftInfo.desc1}
            </p>

            <div className="pt-2 border-t border-white/30 flex items-center gap-2 text-xs text-emerald-900 font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{currentSlide.leftInfo.desc2}</span>
            </div>
          </div>
        </div>

        {/* CHIẾC XE CHÍNH GIỮA: ĐỖ ĐỒNG NHẤT TRÊN BỆ KIM LOẠI GARA */}
        <div className="relative flex-1 flex items-center justify-center min-h-[260px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] px-2 sm:px-6">
          <div
            key={`car-viewport-${animKey}`}
            className="relative z-20 animate-carDriveIn flex flex-col items-center justify-center"
          >
            {/* Vòm ánh sáng sàn chiếu dưới gầm */}
            <div className="absolute -bottom-3 w-4/5 h-16 bg-gradient-to-t from-white/70 via-emerald-100/30 to-transparent blur-xl pointer-events-none" />

            {/* Ảnh chiếc xe tách nền trong suốt đỗ hoàn hảo trên bệ gara */}
            <img
              src={currentSlide.carImage}
              alt={currentSlide.name}
              className="w-auto h-52 sm:h-68 md:h-84 lg:h-96 xl:h-[420px] object-contain filter drop-shadow-[0_24px_35px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-[1.02]"
            />

            {/* Bóng đổ sàn xe ăn khớp với bệ nâng gara */}
            <div className="w-[85%] h-6 mx-auto bg-slate-950/45 blur-lg rounded-full -mt-4 animate-shadowSettle" />
            
            {/* Nhãn xe liquid glass trên màn hình nhỏ */}
            <div className="lg:hidden mt-3 text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-2xl text-xs font-black text-slate-900 shadow-md border border-white/50">
                <span>{currentSlide.name}</span>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                <span className="text-emerald-800 font-extrabold">{formatVND(currentSlide.pricePerDay)}/ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* THÔNG TIN BÊN PHẢI: GIÁ & MÃ QR / ĐẶT XE (LIQUID GLASS FROSTED) */}
        <div
          key={`right-panel-${animKey}`}
          className="hidden lg:flex flex-col items-end w-80 space-y-3 text-right animate-rightPanel shrink-0"
        >
          <div className="p-5 rounded-3xl bg-white/20 hover:bg-white/30 backdrop-blur-2xl border border-white/50 shadow-[0_12px_36px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.7)] w-full space-y-3 text-right transition-all">
            <div className="flex items-center justify-end gap-1.5 text-[11px] font-black text-slate-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Bảng giá niêm yết</span>
            </div>
            
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono tracking-tight block drop-shadow-xs">
                {formatVND(currentSlide.pricePerDay)}
                <span className="text-xs text-slate-600 font-bold"> /ngày</span>
              </span>
              <span className="text-xs text-slate-700 font-extrabold font-mono">
                ({formatVND(currentSlide.pricePerHour)} /giờ)
              </span>
            </div>

            <div className="pt-2.5 border-t border-white/30 flex items-center justify-between text-left">
              <div className="w-11 h-11 rounded-2xl bg-white/40 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-inner shrink-0 border border-white/40">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-900">{currentSlide.rightInfo.bookingHint}</p>
                <p className="text-[11px] text-emerald-800 font-extrabold">{currentSlide.rightInfo.depositPolicy}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900/90 hover:bg-emerald-600 text-white rounded-2xl text-xs font-extrabold transition-all shadow-xl backdrop-blur-md border border-white/25 cursor-pointer hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            <span>Xem chi tiết & Đặt ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. CHẤM ĐIỀU HƯỚNG SLIDE DƯỚI ĐÁY (ĐÃ BỎ 4 Ô HUY HIỆU VÀ Ô KẾ TIẾP) */}
      <div className="relative z-20 pb-8 sm:pb-10 flex items-center justify-center gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx
                ? 'w-10 bg-emerald-600 shadow-md'
                : 'w-2.5 bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/40'
            }`}
            title={`Xem xe ${idx + 1}`}
          />
        ))}
      </div>

      {/* 5. NÚT ĐIỀU HƯỚNG TRÁI / PHẢI (LIQUID GLASS, ĐẶT NGOÀI RÌA, KHÔNG CHE THÔNG TIN) */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/25 hover:bg-white/45 text-slate-800 hover:text-emerald-700 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-2xl border border-white/50 transition-all cursor-pointer hover:scale-110 active:scale-95"
        title="Lướt xe trước"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/25 hover:bg-white/45 text-slate-800 hover:text-emerald-700 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-2xl border border-white/50 transition-all cursor-pointer hover:scale-110 active:scale-95"
        title="Lướt xe kế tiếp"
      >
        <ChevronRight className="w-6 h-6 stroke-[2.2]" />
      </button>

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
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-topTitle {
          animation: topTitleEffect 0.6s ease-out 0.2s both;
        }

        @keyframes leftPanelEffect {
          0% {
            opacity: 0;
            transform: translateX(-40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-leftPanel {
          animation: leftPanelEffect 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
        }

        @keyframes rightPanelEffect {
          0% {
            opacity: 0;
            transform: translateX(40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-rightPanel {
          animation: rightPanelEffect 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.52s both;
        }
      `}</style>
    </div>
  );
};
