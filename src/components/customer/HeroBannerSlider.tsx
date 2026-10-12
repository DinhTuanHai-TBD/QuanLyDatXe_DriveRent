import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  ArrowRight,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

// Import ảnh thực tế trong dự án
import xpanderImg from '../../assets/images/car_mitsubishi_xpander_1791537608474.jpg';
import viosImg from '../../assets/images/car_toyota_vios_1791537588925.jpg';
import airbladeImg from '../../assets/images/scooter_honda_airblade_1791537634617.jpg';
import visionImg from '../../assets/images/scooter_honda_vision_1791537620987.jpg';

export interface SlideData {
  id: string;
  vehicleId: string;
  tierKey: 'signature' | 'selected' | 'standard';
  headlineMain: string;
  headlineSub: string;
  name: string;
  category: string;
  pricePerDay: number;
  pricePerHour: number;
  carImage: string;
  badgeLabel: string;
  badgeColor: string;
  leftInfo: {
    title: string;
    desc1: string;
    desc2: string;
  };
  rightInfo: {
    bookingHint: string;
    depositPolicy: string;
  };
  badges: Array<{
    title: string;
    sub: string;
  }>;
}

export const HeroBannerSlider: React.FC<{ onExploreClick?: () => void }> = ({ onExploreClick }) => {
  const slides: SlideData[] = [
    {
      id: 'slide-xpander',
      vehicleId: 'V-02',
      tierKey: 'signature',
      headlineMain: 'LƯỚT NGAY XPANDER',
      headlineSub: 'XE CHUẨN GIÁ ÊM',
      name: 'Mitsubishi Xpander 7 Chỗ Tự Động',
      category: 'MPV 7 chỗ gia đình',
      pricePerDay: 950000,
      pricePerHour: 120000,
      carImage: xpanderImg,
      badgeLabel: 'SIGNATURE 2024',
      badgeColor: 'emerald',
      leftInfo: {
        title: 'Kiểm định 12 hạng mục',
        desc1: 'Tại mạng lưới kỹ thuật chuẩn xưởng dịch vụ ủy quyền chính hãng',
        desc2: 'Hồ sơ bảo dưỡng & pháp lý minh bạch 100%'
      },
      rightInfo: {
        bookingHint: 'Giữ chỗ 10 phút nhận xe',
        depositPolicy: 'Cọc trực tuyến 20% - Hoàn 100% nếu hủy trước 24h'
      },
      badges: [
        { title: 'Signature', sub: '100% Đời mới 2024' },
        { title: 'Selected', sub: 'Nội thất khử khuẩn Nano' },
        { title: 'Standard', sub: 'Bảo hiểm vật chất 2 chiều' }
      ]
    },
    {
      id: 'slide-vios',
      vehicleId: 'V-01',
      tierKey: 'selected',
      headlineMain: 'LƯỚT NGAY VIOS 1.5G',
      headlineSub: 'TIẾT KIỆM & ÊM ÁI',
      name: 'Toyota Vios 1.5G Tự Động',
      category: 'Sedan 5 chỗ công nghệ',
      pricePerDay: 750000,
      pricePerHour: 90000,
      carImage: viosImg,
      badgeLabel: 'SELECTED GRADE A',
      badgeColor: 'teal',
      leftInfo: {
        title: 'Tiêu chuẩn Selected',
        desc1: 'Đầy đủ Camera hành trình góc rộng & Apple CarPlay / Android Auto không dây',
        desc2: 'Hỗ trợ giao xe tận cổng Sân bay Cam Ranh & Khách sạn'
      },
      rightInfo: {
        bookingHint: 'Khóa lịch xe tức thì',
        depositPolicy: 'Thủ tục CCCD & GPLX B1/B2 đơn giản'
      },
      badges: [
        { title: 'Signature', sub: 'Động cơ Dual VVT-i êm ái' },
        { title: 'Selected', sub: 'Cảm biến lùi & Cân bằng điện tử' },
        { title: 'Standard', sub: 'Bàn giao xe sạch bóng 100%' }
      ]
    },
    {
      id: 'slide-airblade',
      vehicleId: 'V-04',
      tierKey: 'selected',
      headlineMain: 'LƯỚT NGAY AIR BLADE 160',
      headlineSub: 'BỨT PHÁ PHONG CÁCH',
      name: 'Honda Air Blade 160 ABS',
      category: 'Xe tay ga thể thao',
      pricePerDay: 160000,
      pricePerHour: 25000,
      carImage: airbladeImg,
      badgeLabel: 'SELECTED POWER',
      badgeColor: 'blue',
      leftInfo: {
        title: 'Trang bị an toàn cao cấp',
        desc1: 'Phanh ABS chống bó cứng & Khóa thông minh Smartkey chống trộm',
        desc2: 'Tặng kèm 2 mũ bảo hiểm 3/4 đạt chuẩn & giá đỡ điện thoại'
      },
      rightInfo: {
        bookingHint: 'Thuê theo giờ hoặc theo ngày',
        depositPolicy: 'Cọc bảo đảm nhận xe chỉ 1.000.000 đ'
      },
      badges: [
        { title: 'Signature', sub: 'Động cơ eSP+ 4 van bốc êm' },
        { title: 'Selected', sub: 'Phanh đĩa an toàn ABS' },
        { title: 'Standard', sub: 'Áo mưa đôi & Bảo hiểm đi kèm' }
      ]
    },
    {
      id: 'slide-vision',
      vehicleId: 'V-03',
      tierKey: 'standard',
      headlineMain: 'LƯỚT NGAY VISION',
      headlineSub: 'DẠO PHỐ BIỂN CỰC CHILL',
      name: 'Honda Vision Smartkey',
      category: 'Xe tay ga thời trang',
      pricePerDay: 130000,
      pricePerHour: 20000,
      carImage: visionImg,
      badgeLabel: 'STANDARD PLUS',
      badgeColor: 'emerald',
      leftInfo: {
        title: 'Khám phá tự do & Tiết kiệm',
        desc1: 'Mức tiêu hao xăng cực thấp chỉ 1.8L/100km, cốp xe rộng rãi thoải mái',
        desc2: 'Cứu hộ lưu động 24/7 nội thành Nha Trang'
      },
      rightInfo: {
        bookingHint: 'Nhận xe trong 5 phút',
        depositPolicy: 'Chỉ cần CCCD bản gốc hoặc Hộ chiếu'
      },
      badges: [
        { title: 'Signature', sub: 'Khóa thông minh Smartkey' },
        { title: 'Selected', sub: 'Động cơ eSP êm dịu' },
        { title: 'Standard', sub: 'Đầy đủ phụ kiện bảo hộ' }
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      triggerSlideNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const triggerSlideNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setAnimating(false);
    }, 450);
  };

  const triggerSlidePrev = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setAnimating(false);
    }, 450);
  };

  const goToSlide = (index: number) => {
    if (animating || index === currentIndex) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setAnimating(false);
    }, 450);
  };

  const current = slides[currentIndex];
  const nextSlide = slides[(currentIndex + 1) % slides.length];

  return (
    <div
      className="relative w-full bg-slate-950 text-white overflow-hidden py-10 lg:py-16 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        background: 'radial-gradient(ellipse 85% 65% at 50% 38%, #1e293b 0%, #0f172a 60%, #020617 100%)'
      }}
    >
      {/* 3D Studio Lighting & Grid Wireframe */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Overhead soft spotlight dome */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[450px] bg-emerald-500/12 blur-[140px] rounded-full" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-teal-400/8 blur-[100px] rounded-full" />

        {/* Floor 3D Grid Perspective */}
        <div
          className="absolute bottom-0 left-0 right-0 h-76 opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.09) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.09) 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px',
            transform: 'perspective(520px) rotateX(62deg) translateY(45px)',
            transformOrigin: 'bottom center'
          }}
        />

        {/* Watermark Brand Text phía sau xe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] sm:text-[180px] lg:text-[230px] font-black text-white/[0.035] tracking-widest uppercase select-none pointer-events-none whitespace-nowrap">
          DRIVERENT
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. TIÊU ĐỀ LỚN PHÍA TRÊN */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2.5 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Studio 3D Xe Lướt • Sẵn Sàng Giao Ngay</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
            {current.headlineMain} —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              {current.headlineSub}
            </span>
          </h1>

          <div className="flex items-center justify-center gap-2 mt-2 text-slate-400 text-sm sm:text-base font-medium">
            <span>{current.name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">{current.category}</span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              {current.badgeLabel}
            </span>
          </div>
        </div>

        {/* 2. KHU VỰC TRUNG TÂM: XE NẰM CHÍNH GIỮA + 2 CỘT THÔNG TIN BAY 2 BÊN */}
        <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] flex items-center justify-center">
          {/* Cột thông tin BÊN TRÁI (Staggered Animation LeftBox) */}
          <div
            key={`left-${current.id}`}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-20 max-w-xs space-y-3 pointer-events-auto animate-leftBox"
          >
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:border-emerald-500/60">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{current.leftInfo.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-normal">
                {current.leftInfo.desc1}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium pt-2.5 border-t border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{current.leftInfo.desc2}</span>
              </div>
            </div>

            <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between backdrop-blur-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hoàn thiện nội ngoại thất:</span>
              </span>
              <span className="text-emerald-400 font-bold">99.8% Chuẩn Mới</span>
            </div>
          </div>

          {/* CHIẾC XE NẰM CHÍNH GIỮA TRUNG TÂM (HIỆU ỨNG STUDIO 3D) */}
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {/* Vùng ảnh xe với animation lướt carDriveIn */}
            <div
              key={`car-${current.id}`}
              className={`relative w-full flex items-center justify-center transition-all duration-500 ease-out ${
                animating
                  ? 'opacity-0 scale-95 translate-x-32'
                  : 'opacity-100 scale-100 translate-x-0 animate-carDriveIn'
              }`}
            >
              <img
                src={current.carImage}
                alt={current.name}
                className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl h-auto max-h-[340px] sm:max-h-[420px] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.9)] filter contrast-105"
                loading="eager"
              />
            </div>

            {/* Bóng đổ 3D dưới sàn studio */}
            <div className="w-4/5 max-w-2xl h-9 bg-black/75 blur-xl rounded-full -mt-4 sm:-mt-6 mx-auto" />
          </div>

          {/* Cột thông tin BÊN PHẢI (Giá & QR Cọc giữ chỗ - Staggered Animation RightBox) */}
          <div
            key={`right-${current.id}`}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-20 max-w-xs space-y-3 pointer-events-auto animate-rightBox"
          >
            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 shadow-2xl text-right">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                Giá niêm yết công khai
              </span>
              <div className="text-3xl lg:text-4xl font-black text-emerald-400 font-mono tracking-tight mt-1">
                {formatVND(current.pricePerDay)}
                <span className="text-sm font-sans font-medium text-slate-400">/ngày</span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">
                Hoặc <span className="text-white font-bold">{formatVND(current.pricePerHour)}/giờ</span> (tối thiểu 4h)
              </div>

              {/* QR Cọc giữ chỗ 10 phút */}
              <div
                onClick={() => setShowQrModal(true)}
                className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-end gap-3 text-left cursor-pointer group/qr hover:bg-slate-800/40 p-2 rounded-xl transition-all"
                title="Bấm để phóng to mã QR giữ xe"
              >
                <div className="text-right">
                  <div className="text-[11px] font-bold text-white flex items-center justify-end gap-1 group-hover/qr:text-emerald-400 transition-colors">
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{current.rightInfo.bookingHint}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{current.rightInfo.depositPolicy}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-md group-hover/qr:scale-105 transition-transform">
                  <QrCode className="w-8 h-8 text-slate-900" />
                </div>
              </div>

              {/* Nút bấm xem thông số */}
              <button
                onClick={onExploreClick}
                className="w-full mt-3.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-emerald-900/50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Xem thông số & Đặt xe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. THÔNG TIN PHÍA DƯỚI GẦM XE: 3 HUY HIỆU KIỂM ĐỊNH (Staggered Animation BottomBar) */}
        <div
          key={`badges-${current.id}`}
          className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto animate-bottomBar"
        >
          {current.badges.map((badge, bIdx) => (
            <div
              key={bIdx}
              className="bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3 backdrop-blur-xs transition-all hover:border-emerald-500/40"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                0{bIdx + 1}
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                  <span>{badge.title}</span>
                  {bIdx === 0 && <Award className="w-3 h-3 text-emerald-400" />}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {badge.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Thẻ giá & cọc hiển thị gọn dưới cùng màn hình nhỏ */}
        <div className="md:hidden mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Giá thuê chỉ từ</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {formatVND(current.pricePerDay)}
              <span className="text-xs font-sans text-slate-400">/ngày</span>
            </div>
          </div>
          <button
            onClick={onExploreClick}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <span>Đặt xe ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. GÓC DƯỚI BÊN TRÁI: MUI XE TIẾP THEO CHỜ SẴN & THANH ĐIỀU HƯỚNG */}
        <div className="hidden lg:flex items-center justify-between mt-8 pt-4 border-t border-slate-800/80">
          {/* Mui xe tiếp theo */}
          <button
            onClick={triggerSlideNext}
            className="group flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer"
            title="Xem xe tiếp theo"
          >
            <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src={nextSlide.carImage}
                alt={nextSlide.name}
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform"
              />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Xe tiếp theo:</div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                {nextSlide.name}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all ml-2" />
          </button>

          {/* Bộ điều hướng & Chấm tròn */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-emerald-500 shadow-xs shadow-emerald-500/50'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Đi tới xe ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerSlidePrev}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-all cursor-pointer hover:scale-105"
                aria-label="Xe trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={triggerSlideNext}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-all cursor-pointer hover:scale-105"
                aria-label="Xe kế tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR giữ chỗ khi người dùng bấm vào QR code */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-1">Mã QR Cọc Giữ Xe 10 Phút</h3>
            <p className="text-xs text-slate-400 mb-4">{current.name}</p>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-4">
              <div className="w-48 h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-800">
                <QrCode className="w-36 h-36 text-slate-900" />
                <span className="text-[10px] font-bold text-slate-500 mt-1">DRIVE-RENT-HOLD-20%</span>
              </div>
            </div>
            <p className="text-xs text-emerald-400 font-semibold mb-4">
              Chuyển khoản cọc 20% ({formatVND(current.pricePerDay * 0.2)}) để khóa xe tức thì
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}

      {/* CSS Keyframes riêng cho xe lướt vào giữa và các khối thông tin xuất hiện so le */}
      <style>{`
        @keyframes carDriveIn {
          0% {
            opacity: 0;
            transform: translateX(140px) scale(0.92);
          }
          60% {
            opacity: 1;
            transform: translateX(-12px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes leftBoxEffect {
          0% {
            opacity: 0;
            transform: translate(-30px, -50%);
          }
          100% {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }
        @keyframes rightBoxEffect {
          0% {
            opacity: 0;
            transform: translate(30px, -50%);
          }
          100% {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }
        @keyframes bottomBarEffect {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-carDriveIn {
          animation: carDriveIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .animate-leftBox {
          animation: leftBoxEffect 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
          will-change: transform, opacity;
        }
        .animate-rightBox {
          animation: rightBoxEffect 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
          will-change: transform, opacity;
        }
        .animate-bottomBar {
          animation: bottomBarEffect 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};
