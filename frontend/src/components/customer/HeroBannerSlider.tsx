import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

// 1. Hình nền Cung đường ven biển Nha Trang do người dùng lưu trong thư mục Ảnh (2752x1536)
import nhatrangCoastalBg from '../../assets/images/nhatrang_coastal_bg.jpg';

// 2. Các dòng xe đã đổ bóng tiếp xúc mặt đường chuẩn quang học cho từng dòng xe
import carViosRealistic from '../../assets/images/car_vios_realistic_shadow.png';
import carXpanderRealistic from '../../assets/images/car_xpander_realistic_shadow.png';
import carMazda3Realistic from '../../assets/images/car_mazda3_realistic_shadow.png';
import carVF8Realistic from '../../assets/images/car_vf8_realistic_shadow.png';
import scooterAirBladeRealistic from '../../assets/images/scooter_airblade_realistic_shadow.png';

interface SlideData {
  id: string;
  topSublabel?: string;
  headlineMain: string;
  headlineSub: string;
  name: string;
  category: string;
  pricePerDay: number;
  pricePerHour: number;
  carImage: string;
  featuresInfo: {
    title: string;
    badge: string;
    desc1: string;
    desc2: string;
  };
  pricingInfo: {
    bookingHint: string;
    depositPolicy: string;
  };
}

export const HeroBannerSlider: React.FC<{ onExploreClick?: () => void }> = ({ onExploreClick }) => {
  const { t } = useApp();
  const slides: SlideData[] = [
    {
      id: 'slide-vios',
      topSublabel: t('hero.top_sublabel'),
      headlineMain: t('hero.vios_title'),
      headlineSub: t('hero.vios_sub'),
      name: t('hero.vios_name'),
      category: t('hero.vios_category', 'Sedan 5 Chỗ Đô Thị Tiết Kiệm'),
      pricePerDay: 750000,
      pricePerHour: 90000,
      carImage: carViosRealistic,
      featuresInfo: {
        title: t('hero.vios_feat_title'),
        badge: t('hero.vios_feat_badge'),
        desc1: t('hero.vios_feat_desc1'),
        desc2: t('hero.vios_feat_desc2')
      },
      pricingInfo: {
        bookingHint: t('hero.vios_price_hint'),
        depositPolicy: t('hero.vios_price_policy')
      }
    },
    {
      id: 'slide-xpander',
      topSublabel: t('hero.top_sublabel'),
      headlineMain: t('hero.xpander_title'),
      headlineSub: t('hero.xpander_sub'),
      name: t('hero.xpander_name'),
      category: t('hero.xpander_category', 'MPV 7 Chỗ Gia Đình Rộng Rãi'),
      pricePerDay: 950000,
      pricePerHour: 120000,
      carImage: carXpanderRealistic,
      featuresInfo: {
        title: t('hero.xpander_feat_title'),
        badge: t('hero.xpander_feat_badge'),
        desc1: t('hero.xpander_feat_desc1'),
        desc2: t('hero.xpander_feat_desc2')
      },
      pricingInfo: {
        bookingHint: t('hero.xpander_price_hint'),
        depositPolicy: t('hero.xpander_price_policy')
      }
    },
    {
      id: 'slide-vf8',
      topSublabel: t('hero.top_sublabel'),
      headlineMain: t('hero.vf8_title'),
      headlineSub: t('hero.vf8_sub'),
      name: t('hero.vf8_name'),
      category: t('hero.vf8_category', 'D-SUV 5 Chỗ Công Nghệ Cao'),
      pricePerDay: 1150000,
      pricePerHour: 140000,
      carImage: carVF8Realistic,
      featuresInfo: {
        title: t('hero.vf8_feat_title'),
        badge: t('hero.vf8_feat_badge'),
        desc1: t('hero.vf8_feat_desc1'),
        desc2: t('hero.vf8_feat_desc2')
      },
      pricingInfo: {
        bookingHint: t('hero.vf8_price_hint'),
        depositPolicy: t('hero.vf8_price_policy')
      }
    },
    {
      id: 'slide-mazda3',
      topSublabel: t('hero.top_sublabel'),
      headlineMain: t('hero.mazda3_title'),
      headlineSub: t('hero.mazda3_sub'),
      name: t('hero.mazda3_name'),
      category: t('hero.mazda3_category', 'Sedan 5 Chỗ Thể Thao Phong Cách'),
      pricePerDay: 850000,
      pricePerHour: 110000,
      carImage: carMazda3Realistic,
      featuresInfo: {
        title: t('hero.mazda3_feat_title'),
        badge: t('hero.mazda3_feat_badge'),
        desc1: t('hero.mazda3_feat_desc1'),
        desc2: t('hero.mazda3_feat_desc2')
      },
      pricingInfo: {
        bookingHint: t('hero.mazda3_price_hint'),
        depositPolicy: t('hero.mazda3_price_policy')
      }
    },
    {
      id: 'slide-airblade',
      topSublabel: t('hero.top_sublabel'),
      headlineMain: t('hero.airblade_title'),
      headlineSub: t('hero.airblade_sub'),
      name: t('hero.airblade_name'),
      category: t('hero.airblade_category', 'Xe Tay Ga Thể Thao Đô Thị'),
      pricePerDay: 180000,
      pricePerHour: 30000,
      carImage: scooterAirBladeRealistic,
      featuresInfo: {
        title: t('hero.airblade_feat_title'),
        badge: t('hero.airblade_feat_badge'),
        desc1: t('hero.airblade_feat_desc1'),
        desc2: t('hero.airblade_feat_desc2')
      },
      pricingInfo: {
        bookingHint: t('hero.airblade_price_hint'),
        depositPolicy: t('hero.airblade_price_policy')
      }
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tự động chuyển slide sau 7 giây
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 7000);
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
      className="relative w-full h-screen min-h-[660px] max-h-[1080px] overflow-hidden select-none flex flex-col justify-between pb-16 sm:pb-20 lg:pb-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. HÌNH NỀN CUNG ĐƯỜNG VEN BIỂN NHA TRANG (2752x1536 EDGE-TO-EDGE) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={nhatrangCoastalBg}
          alt="Cung đường biển Nha Trang"
          className="w-full h-full object-cover object-bottom filter brightness-[1.01] contrast-[1.02]"
        />

        {/* Lớp phủ tương phản Gradient mượt mà cho text đọc rõ trên nền trời */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Họa tiết 01: Vệt Sóng Khí Động Học (Aero-Wave Streamlines) uốn lượn ven biển */}
        <div className="absolute inset-x-0 bottom-12 h-64 pointer-events-none overflow-hidden opacity-45">
          <svg className="w-[140%] -ml-[20%] h-full" viewBox="0 0 1200 300" fill="none" preserveAspectRatio="none">
            <path
              d="M0,150 C300,60 500,240 800,120 C1000,40 1100,180 1200,130"
              stroke="url(#oceanWaveGrad1)"
              strokeWidth="3.5"
              strokeDasharray="8,6"
            />
            <path
              d="M0,180 C250,100 450,260 750,150 C950,80 1050,220 1200,170"
              stroke="url(#oceanWaveGrad2)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="oceanWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.1" />
                <stop offset="40%" stopColor="#0EA5E9" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="oceanWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0F172A" stopOpacity="0" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 2. TIÊU ĐỀ LỚN TRÊN ĐẦU (RỘNG RÃI, DƯỚI THANH HEADER TRONG SUỐT) */}
      <div
        key={`headline-${animKey}`}
        className="relative z-20 text-center space-y-1 pt-22 sm:pt-24 md:pt-26 px-4 animate-topTitle shrink-0"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)] leading-tight">
          {currentSlide.headlineMain}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-sky-800 tracking-wide uppercase drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]">
          {currentSlide.headlineSub}
        </p>
      </div>

      {/* 3. KHU VỰC TRUNG TÂM: XE CHẠY VÀO TRÊN ĐƯỜNG & 2 Ô GIỚI THIỆU XẾP CHỒNG BÊN PHẢI */}
      <div className="relative z-20 my-auto py-1 w-full px-6 sm:px-10 md:px-12 lg:px-14 xl:px-20 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-3 lg:gap-6 mb-3 sm:mb-5 lg:mb-6">
        
        {/* KHU VỰC XE BÊN TRÁI / TRUNG TÂM: XE ĐỖ VỮNG VÀNG TRÊN LÀN ĐƯỜNG BIỂN VỚI BÓNG ĐỔ CHÂN THẬT */}
        <div className="relative flex-1 w-full flex items-center justify-center lg:justify-start lg:pl-4 xl:pl-8">
          <div
            key={`car-viewport-${animKey}`}
            className="relative z-20 animate-carDriveIn flex flex-col items-center justify-center"
          >
            {/* Ảnh chiếc xe đã được căn chỉnh bóng đổ tiếp xúc bánh xe & gầm xe chuẩn quang học */}
            <img
              src={currentSlide.carImage}
              alt={currentSlide.name}
              className="relative z-10 w-auto max-w-full h-36 sm:h-44 md:h-52 lg:h-[220px] xl:h-[260px] object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-[1.02]"
            />

            {/* Nhãn xe & nút đặt nhanh trên thiết bị di động */}
            <div className="lg:hidden mt-2 text-center flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-2xl text-xs font-black text-slate-900 shadow-md border border-white/80">
                <span>{currentSlide.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span className="text-sky-700 font-extrabold">{formatVND(currentSlide.pricePerDay)}{t('home.per_day')}</span>
              </div>
              <button
                type="button"
                onClick={onExploreClick}
                aria-label={t('action.view_book')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-sky-700 hover:bg-sky-800 text-white rounded-full text-xs font-black shadow-md shadow-sky-800/30 active:scale-95 cursor-pointer transition-all"
              >
                <span>{t('action.view_book')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2 Ô GIỚI THIỆU ĐƯA VỀ BÊN PHẢI XẾP CHỒNG LÊN NHAU */}
        <div
          key={`right-panels-stack-${animKey}`}
          className="hidden lg:block lg:w-[320px] xl:w-[360px] shrink-0 space-y-2.5 animate-rightPanel"
        >
          {/* Ô 1: VẬN HÀNH ÊM ÁI & TIÊU CHUẨN TRANG BỊ */}
          <div className="p-4 rounded-2xl bg-white/75 hover:bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-2 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30 shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-slate-900 leading-tight">
                  {currentSlide.featuresInfo.title}
                </h2>
                <span className="text-xs text-sky-800 font-black uppercase tracking-wider">
                  {currentSlide.featuresInfo.badge}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {currentSlide.featuresInfo.desc1}
            </p>

            <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-xs text-sky-900 font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="truncate">{currentSlide.featuresInfo.desc2}</span>
            </div>
          </div>

          {/* Ô 2: BẢNG GIÁ NIÊM YẾT & ĐẶT CỌC GIỮ CHỖ */}
          <div className="p-4 rounded-2xl bg-white/75 hover:bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-2 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('home.rate_daily')}</span>
              </div>
              <span className="text-xs text-slate-700 font-bold font-mono">
                ({formatVND(currentSlide.pricePerHour)}{t('home.per_hour')})
              </span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-sky-900 font-mono tracking-tight block drop-shadow-xs">
                {formatVND(currentSlide.pricePerDay)}
                <span className="text-xs text-slate-700 font-bold"> {t('home.per_day')}</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 font-black border border-sky-300/60 shadow-2xs">
                {t('specs.available')}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-left">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700 shrink-0 border border-sky-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{currentSlide.pricingInfo.bookingHint}</p>
                <p className="text-xs text-slate-700 font-medium">{currentSlide.pricingInfo.depositPolicy}</p>
              </div>
            </div>
          </div>

          {/* NÚT XEM CHI TIẾT & ĐẶT NGAY */}
          <button
            type="button"
            onClick={onExploreClick}
            aria-label={t('action.view_book')}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] bg-sky-700 hover:bg-sky-800 text-white rounded-full text-xs font-black transition-all shadow-md shadow-sky-800/30 cursor-pointer active:scale-95"
          >
            <span>{t('action.view_book')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. CHẤM ĐIỀU HƯỚNG SLIDE (VÙNG BẤM TỐI THIỂU 44PX CHO CẢM ỨNG DI ĐỘNG) */}
      <div className="relative z-20 pb-3 sm:pb-4 px-4 flex items-center justify-center shrink-0">
        <div className="flex items-center justify-center gap-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              title={`Slide ${idx + 1}`}
              className="p-3 flex items-center justify-center cursor-pointer group focus:outline-hidden"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 block ${
                  currentIndex === idx
                    ? 'w-8 bg-sky-600 shadow-md shadow-sky-600/40'
                    : 'w-2 bg-white/70 group-hover:bg-white group-hover:w-3'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 5. NÚT ĐIỀU HƯỚNG TRÁI / PHẢI (TRÒN MỜ KÍNH LIQUID GLASS - VÙNG BẤM TỐI THIỂU 44PX) */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label={t('action.back')}
        className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/60 hover:bg-white/90 text-slate-800 flex items-center justify-center shadow-lg backdrop-blur-md border border-white/80 transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-hidden"
        title={t('action.back')}
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label={t('action.confirm')}
        className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/60 hover:bg-white/90 text-slate-800 flex items-center justify-center shadow-lg backdrop-blur-md border border-white/80 transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-hidden"
        title={t('action.confirm')}
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* KEYFRAMES HIỆU ỨNG THỜI GIAN THỰC */}
      <style>{`
        @keyframes carDriveInEffect {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.94);
            filter: blur(4px);
          }
          65% {
            opacity: 1;
            transform: translateX(-12px) scale(1.01);
            filter: blur(0px);
          }
          85% {
            transform: translateX(4px) scale(0.998);
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

        @keyframes rightPanelEffect {
          0% {
            opacity: 0;
            transform: translateX(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-rightPanel {
          animation: rightPanelEffect 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-carDriveIn,
          .animate-topTitle,
          .animate-rightPanel {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};
