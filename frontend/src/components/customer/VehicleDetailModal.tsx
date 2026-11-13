import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Vehicle } from '../../types';
import { useApp } from '../../context/AppContext';
import carInteriorImg from '../../assets/images/car_interior_clean.jpg';
import carRearTrunkImg from '../../assets/images/car_rear_trunk.jpg';
import {
  X,
  Star,
  ShieldCheck,
  Sparkles,
  Zap,
  Fuel,
  Users,
  Box,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Compass,
  Tv,
  Eye,
  Gauge,
  Wind,
  ArrowRight,
  MapPin,
  Check,
  Share2,
  Heart,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  ChevronRight,
  Sliders,
  Plane,
  Baby,
  Camera,
  Briefcase,
  Calendar,
  Smartphone,
  Navigation,
  Plus,
  Minus,
  Video,
  FileCheck,
  Globe
} from 'lucide-react';

export interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  durationTab: 'day' | 'month';
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  durationTab,
  isOpen,
  onClose,
  onBookNow
}) => {
  const { t, settings, showToast, translateVehicle, customerSearchCriteria } = useApp();
  const brandName = settings?.brandTitle || settings?.storeName || 'Nha Trang Car';

  const [activeTab, setActiveTab] = useState<'specs' | 'docs' | 'location'>('specs');
  const [isLiked, setIsLiked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Khởi tạo số ngày thuê dựa trên tìm kiếm hoặc mặc định 1 ngày
  const getInitialDays = () => {
    try {
      if (customerSearchCriteria?.startDate && customerSearchCriteria?.endDate) {
        const s = new Date(customerSearchCriteria.startDate);
        const e = new Date(customerSearchCriteria.endDate);
        const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) return diff;
      }
    } catch {}
    return 1;
  };

  const [rentalDays, setRentalDays] = useState<number>(1);

  useEffect(() => {
    setRentalDays(getInitialDays());
  }, [customerSearchCriteria?.startDate, customerSearchCriteria?.endDate]);

  // Tiện ích chọn thêm 1-chạm (Add-on Services)
  const [selectedAddons, setSelectedAddons] = useState({
    airportDelivery: false, // +150.000đ
    babySeat: false,        // 0đ
    dashcam4k: false        // 0đ
  });

  const toggleAddon = (key: 'airportDelivery' | 'babySeat' | 'dashcam4k') => {
    setSelectedAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Lắng nghe phím ESC, khóa cuộn body và ẩn thanh taskbar/header khi modal mở
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewPhoto) {
          setPreviewPhoto(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Ẩn thanh header / taskbar để người dùng tập trung vào popup
    document.body.classList.add('popup-modal-open');
    const headerEl = document.querySelector('header');
    const originalHeaderDisplay = headerEl ? headerEl.style.display : '';
    if (headerEl) {
      headerEl.style.display = 'none';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('popup-modal-open');
      if (headerEl) {
        headerEl.style.display = originalHeaderDisplay;
      }
    };
  }, [isOpen, onClose, previewPhoto]);

  if (!isOpen || !vehicle) return null;

  const transV = translateVehicle(vehicle);

  const isElectric =
    vehicle.fuelType === 'electric' ||
    vehicle.name.toLowerCase().includes('vf') ||
    vehicle.name.toLowerCase().includes('vinfast') ||
    vehicle.category.toLowerCase().includes('điện');

  const monthlyPrice =
    (vehicle as any).monthlyPrice ||
    Math.round((vehicle.dailyPrice * 22) / 100000) * 100000;

  const displayPrice = durationTab === 'month' ? monthlyPrice : vehicle.dailyPrice;
  const formattedPrice = displayPrice.toLocaleString('vi-VN');
  const unitText = durationTab === 'month' ? t('specs.month_unit', 'VNĐ/Tháng') : t('specs.day_unit', 'VNĐ/Ngày');

  // Tính toán chi phí động (Dynamic Price Calculations)
  const dailyRate = durationTab === 'month' ? monthlyPrice : vehicle.dailyPrice;
  const activeDays = durationTab === 'month' ? 30 : Math.max(1, rentalDays);
  const baseRentalFee = durationTab === 'month' ? dailyRate : dailyRate * activeDays;
  const addonFees = selectedAddons.airportDelivery ? 150000 : 0;
  const totalEstimatedFee = baseRentalFee + addonFees;

  // Tiền cọc giữ xe thanh toán trước (500k cho xe máy, 1.000.000đ cho ô tô)
  const depositRequired = vehicle.type === 'motorbike' ? 500000 : 1000000;
  const remainingAmountDue = Math.max(0, totalEstimatedFee - depositRequired);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.name} - ${brandName}`,
        text: `Thuê xe ${vehicle.name} tự lái tại Nha Trang`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast?.(t('modal.share_copied'), 'success');
    }
  };

  const scrollToSection = (id: string, tab: 'specs' | 'docs' | 'location') => {
    setActiveTab(tab);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Danh sách tiện nghi xe đa ngôn ngữ
  const amenitiesList = [
    { icon: <Compass className="w-4 h-4 text-sky-600" />, label: t('modal.amenity_gps') },
    { icon: <Tv className="w-4 h-4 text-blue-600" />, label: t('modal.amenity_carplay') },
    { icon: <Eye className="w-4 h-4 text-purple-600" />, label: t('modal.amenity_cam360') },
    { icon: <Gauge className="w-4 h-4 text-amber-600" />, label: t('modal.amenity_tpms') },
    { icon: <Wind className="w-4 h-4 text-teal-600" />, label: t('modal.amenity_sunroof') },
    { icon: <ShieldCheck className="w-4 h-4 text-rose-600" />, label: t('modal.amenity_abs') },
    { icon: <Zap className="w-4 h-4 text-cyan-600" />, label: t('modal.amenity_charging') },
    { icon: <Sparkles className="w-4 h-4 text-amber-500" />, label: t('modal.amenity_ac') }
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex flex-col bg-white shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full max-w-none max-h-none rounded-none'
            : 'rounded-3xl max-w-5xl w-full max-h-[92vh]'
        }`}
      >
        {/* ============================================================ */}
        {/* MIOTO TOP TAB BAR (Đặc điểm, Giấy tờ thuê xe, Vị trí xe, ⤢, ✕) */}
        {/* ============================================================ */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-14 flex items-center justify-between gap-4 select-none shrink-0">
          <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-bold text-slate-600 overflow-x-auto no-scrollbar">
            <button
              onClick={() => scrollToSection('mioto-section-specs', 'specs')}
              className={`py-3.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'specs' ? 'text-slate-950 font-black' : 'hover:text-slate-950'
              }`}
            >
              {t('modal.tab_specs')}
              {activeTab === 'specs' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('mioto-section-docs', 'docs')}
              className={`py-3.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'docs' ? 'text-slate-950 font-black' : 'hover:text-slate-950'
              }`}
            >
              {t('modal.tab_docs')}
              {activeTab === 'docs' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('mioto-section-location', 'location')}
              className={`py-3.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'location' ? 'text-slate-950 font-black' : 'hover:text-slate-950'
              }`}
            >
              {t('modal.tab_location')}
              {activeTab === 'location' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-950 rounded-full" />
              )}
            </button>
          </nav>

          {/* Cụm nút Phóng to / Thu nhỏ & Đóng */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
              title={t('action.close')}
              aria-label={t('action.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NỘI DUNG CUỘN DỌC CHÍNH (SCROLLABLE MODAL BODY) */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* ============================================================ */}
          {/* 1. THƯ VIỆN ẢNH CHUẨN MIOTO (1 ẢNH LỚN + 3 ẢNH DỌC) */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Ảnh lớn bên trái (Hero Photo - col-span-8) */}
            <div
              onClick={() => setPreviewPhoto(vehicle.image)}
              className="lg:col-span-8 relative h-64 sm:h-80 lg:h-[420px] rounded-2xl bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/70 border border-slate-200/90 overflow-hidden flex items-center justify-center p-6 group cursor-pointer"
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 shadow-md backdrop-blur-md border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span>{t('modal.real_photo')}</span>
              </div>
            </div>

            {/* 3 ảnh phụ bên phải (Stacked Thumbnails - col-span-4) */}
            <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-3 h-28 sm:h-36 lg:h-[420px]">
              
              {/* Thumbnail 1: Góc đầu xe & Badge hoàn tiền */}
              <div
                onClick={() => setPreviewPhoto(vehicle.image)}
                className="relative rounded-2xl bg-slate-100 border border-slate-200/90 overflow-hidden flex items-center justify-center p-2 group cursor-pointer"
              >
                <img
                  src={vehicle.image}
                  alt="Front Angle"
                  className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-1.5 left-2 hidden sm:block text-[10px] font-bold text-sky-800 bg-sky-50/90 px-2 py-0.5 rounded border border-sky-200/80 backdrop-blur-xs">
                  {t('modal.satisfaction')}
                </div>
              </div>

              {/* Thumbnail 2: Khoang nội thất sạch sẽ */}
              <div
                onClick={() => setPreviewPhoto(carInteriorImg)}
                className="relative rounded-2xl bg-slate-100 border border-slate-200/90 overflow-hidden flex items-center justify-center group cursor-pointer"
              >
                <img
                  src={carInteriorImg}
                  alt="Interior"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-1.5 left-2 hidden sm:block text-[10px] font-bold text-white bg-slate-900/75 px-2 py-0.5 rounded backdrop-blur-xs">
                  {t('modal.clean_cabin')}
                </div>
              </div>

              {/* Thumbnail 3: Khoang cốp rộng rãi + Nút Xem tất cả ảnh */}
              <div
                onClick={() => setPreviewPhoto(carRearTrunkImg)}
                className="relative rounded-2xl bg-slate-100 border border-slate-200/90 overflow-hidden flex items-center justify-center group cursor-pointer"
              >
                <img
                  src={carRearTrunkImg}
                  alt="Trunk Space"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPhoto(vehicle.image);
                  }}
                  className="absolute bottom-2 right-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-md border border-slate-200 transition-all cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">{t('modal.view_all_photos')}</span>
                </button>
              </div>

            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. HEADER XE + BẢO HIỂM THUÊ XE (LAYOUT 2 CỘT CHUẨN MIOTO) */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
            
            {/* Cột trái: Tên xe, Đánh giá, Địa chỉ, Nút Like/Share, Huy hiệu */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 uppercase tracking-tight">
                  {vehicle.name} {vehicle.year || ''}
                </h1>

                {/* Nút Chia sẻ & Yêu thích */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    title={t('modal.share')}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsLiked(!isLiked);
                      showToast?.(isLiked ? t('modal.unliked') : t('modal.liked'), 'info');
                    }}
                    className={`p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer ${
                      isLiked ? 'text-rose-500 bg-rose-50 border-rose-200' : 'text-slate-600'
                    }`}
                    title={t('modal.favorite')}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Đánh giá sao, số chuyến và địa chỉ */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 font-semibold">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                </span>
                <span>•</span>
                <span>28 trips</span>
                <span>•</span>
                <span className="text-slate-500">Nha Trang City</span>
                {vehicle.plateNumber && (
                  <>
                    <span>•</span>
                    <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">
                      {vehicle.plateNumber}
                    </span>
                  </>
                )}
              </div>

              {/* Tag huy hiệu xanh chuẩn Mioto */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t('modal.tag_no_deposit_bike')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('modal.tag_doorstep')}</span>
                </span>
                {isElectric && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200/80">
                    <Zap className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{t('modal.tag_smart_ev')}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Cột phải: Khối Bảo hiểm thuê xe chuẩn Mioto */}
            <div className="lg:col-span-4">
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-extrabold text-sm">
                  <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
                  <span>{t('modal.insurance_title')}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('modal.insurance_desc')}
                </p>
                <div className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer">
                  <span>{t('modal.insurance_more')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>

          <hr className="border-slate-100" />

          {/* ============================================================ */}
          {/* 3. ĐẶC ĐIỂM & TIỆN NGHI BENTO GRID (#mioto-section-specs) */}
          {/* ============================================================ */}
          <section id="mioto-section-specs" className="space-y-6 scroll-mt-20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">{t('modal.tab_specs')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Thông số kỹ thuật thực tế & trải nghiệm di chuyển tại Nha Trang</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Chuẩn du lịch
              </span>
            </div>

            {/* BENTO GRID: 4 thẻ thông số chuyên sâu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* BENTO CARD 1: Kích thước cốp xe & vali hành lý */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-purple-50/30 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2.5 hover:border-purple-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Không gian cốp & Hành lý</h4>
                      <div className="text-sm font-black text-slate-900">
                        {vehicle.type === 'motorbike' ? 'Cốp xe thể tích ~18-28L' : (vehicle.seats && vehicle.seats >= 7 ? 'Cốp siêu rộng 550L - 1000L' : 'Cốp rộng tiêu chuẩn 420L - 500L')}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100/60 text-purple-800">
                    {vehicle.type === 'motorbike' ? '2 Mũ BH + Balo' : (vehicle.seats && vehicle.seats >= 7 ? '4-5 Vali cỡ lớn' : '2-3 Vali du lịch')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  {vehicle.type === 'motorbike'
                    ? 'Chứa vừa vặn 2 mũ bảo hiểm nửa đầu, áo mưa, túi xách du lịch cá nhân và balo nhỏ vi vu biển.'
                    : (vehicle.seats && vehicle.seats >= 7
                      ? 'Khoang hành lý rộng rãi chứa thoải mái 4-5 vali lớn (size 24-28 inch), xe đẩy em bé hoặc dụng cụ cắm trại cho đại gia đình.'
                      : 'Khoang chứa vừa vặn 2-3 vali ký gửi (size 20-24 inch) cùng túi xách tay hoặc bộ gậy golf, lý tưởng cho gia đình nhỏ.')}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-purple-700 bg-purple-50/60 p-2 rounded-xl border border-purple-100/60">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                  <span>Đã kiểm tra thực tế, sàn cốp lót da 5D sạch sẽ tinh tươm</span>
                </div>
              </div>

              {/* BENTO CARD 2: Mức tiêu hao nhiên liệu / Pin sạc thực tế */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-amber-50/30 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2.5 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                      {isElectric ? <Zap className="w-4 h-4 text-cyan-600" /> : <Fuel className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {isElectric ? 'Quãng đường pin sạc' : 'Mức tiêu hao thực tế'}
                      </h4>
                      <div className="text-sm font-black text-slate-900">
                        {isElectric ? 'Khoảng 350 - 450 km / lần sạc' : (transV.range || '5.5 - 6.8L / 100km')}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isElectric ? 'bg-cyan-100/70 text-cyan-800' : 'bg-amber-100/70 text-amber-800'}`}>
                    {isElectric ? 'VinFast 0 Phụ Phí' : 'Cực kỳ tiết kiệm'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  {isElectric
                    ? 'Di chuyển êm ái, yên tĩnh không mùi xăng. Tự do sạc tại hơn 30+ trạm sạc VinFast phủ rộng từ Sân bay Cam Ranh về Trung tâm Nha Trang.'
                    : `Mức tiêu hao đo đạc thực tế trên cung đường Trần Phú - Bãi Dài: chỉ ~${transV.range || '6.0L/100km'}. Động cơ vận hành bền bỉ và tiết kiệm xăng.`}
                </p>
                <div className={`flex items-center gap-2 text-[11px] p-2 rounded-xl border ${isElectric ? 'text-cyan-800 bg-cyan-50/60 border-cyan-100' : 'text-amber-800 bg-amber-50/60 border-amber-100'}`}>
                  <Gauge className="w-3.5 h-3.5 shrink-0" />
                  <span>{isElectric ? 'Giao xe pin luôn sẵn sàng trên 80%' : 'Bình xăng đầy sẵn sàng, nhận xe là khởi hành ngay'}</span>
                </div>
              </div>

              {/* BENTO CARD 3: Apple CarPlay / Android Auto & Bản đồ Vietmap */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50/50 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2.5 hover:border-sky-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kết nối & Công nghệ</h4>
                      <div className="text-sm font-black text-slate-900">Apple CarPlay & Android Auto</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-100/70 text-sky-800">
                    Không dây mượt mà
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  Kết nối bluetooth & cáp sạc nhanh. Màn hình sắc nét hỗ trợ bản đồ dẫn đường Vietmap Live cảnh báo tốc độ giới hạn và camera phạt nguội toàn quốc.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-sky-800 bg-sky-50/70 p-2 rounded-xl border border-sky-100">
                  <Navigation className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                  <span>Vietmap Live cập nhật liên tục các điểm phạt nguội Cam Ranh & Nha Trang</span>
                </div>
              </div>

              {/* BENTO CARD 4: Hộp số & Vận hành mượt mà */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2.5 hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vận hành & Động cơ</h4>
                      <div className="text-sm font-black text-slate-900">{transV.transmission} • {vehicle.seats ? `${vehicle.seats} chỗ` : '5 chỗ'}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800">
                    Bảo dưỡng định kỳ
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  Hệ thống số chuyển cấp mượt mà, chân ga nhạy, máy lạnh hai vùng thổi mát cực sâu. Đã kiểm tra 12 hạng mục an toàn kỹ thuật trước khi bàn giao.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>Cam kết xe đời mới, lốp xe gai dày bám đường chống trơn trượt</span>
                </div>
              </div>
            </div>

            {/* Tiện nghi đi kèm */}
            <div className="space-y-3 pt-1">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span>{t('modal.amenities_title')}</span>
                <span className="text-[11px] font-normal text-slate-400">({amenitiesList.length} tiện nghi có sẵn trên xe)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {amenitiesList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 text-xs font-semibold text-slate-800 transition-colors"
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CHECKLIST TIỆN ÍCH CHỌN THÊM 1-CHẠM (Add-on Services) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    Tiện ích chọn thêm 1-chạm (Miễn phí & Dịch vụ hỗ trợ)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tích chọn để nhân viên chuẩn bị chu đáo trước khi giao xe</p>
                </div>
                <span className="text-[11px] font-semibold text-sky-700 bg-white px-2.5 py-1 rounded-full border border-sky-200">
                  Tùy chỉnh linh hoạt
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Addon 1: Sân bay Cam Ranh */}
                <div
                  onClick={() => toggleAddon('airportDelivery')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    selectedAddons.airportDelivery
                      ? 'bg-white border-sky-600 ring-2 ring-sky-500/20 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                        <Plane className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        +150.000đ
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900">Giao tại Sân bay Cam Ranh</div>
                    <p className="text-[11px] text-slate-500 leading-normal">Đón trực tiếp tại sảnh ga đến, nhận xe ngay khi hạ cánh không chờ đợi.</p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] font-bold ${
                      selectedAddons.airportDelivery ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300'
                    }`}>
                      {selectedAddons.airportDelivery && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {selectedAddons.airportDelivery ? 'Đã chọn nhận sân bay' : 'Bấm để thêm (+150k)'}
                    </span>
                  </div>
                </div>

                {/* Addon 2: Ghế trẻ em */}
                <div
                  onClick={() => toggleAddon('babySeat')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    selectedAddons.babySeat
                      ? 'bg-white border-sky-600 ring-2 ring-sky-500/20 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                        <Baby className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Miễn phí 0đ
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900">Ghế an toàn trẻ em</div>
                    <p className="text-[11px] text-slate-500 leading-normal">Ghế đệm ISOFIX chuẩn cho bé 1 - 6 tuổi, êm ái và sạch khuẩn.</p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] font-bold ${
                      selectedAddons.babySeat ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300'
                    }`}>
                      {selectedAddons.babySeat && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {selectedAddons.babySeat ? 'Đã chọn ghế trẻ em' : 'Bấm chọn (Miễn phí)'}
                    </span>
                  </div>
                </div>

                {/* Addon 3: Camera hành trình 4K */}
                <div
                  onClick={() => toggleAddon('dashcam4k')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    selectedAddons.dashcam4k
                      ? 'bg-white border-sky-600 ring-2 ring-sky-500/20 shadow-sm'
                      : 'bg-white/80 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Miễn phí 0đ
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900">Camera hành trình 4K</div>
                    <p className="text-[11px] text-slate-500 leading-normal">Ghi hình sắc nét toàn bộ cung đường biển, thẻ nhớ dung lượng lớn.</p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] font-bold ${
                      selectedAddons.dashcam4k ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300'
                    }`}>
                      {selectedAddons.dashcam4k && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {selectedAddons.dashcam4k ? 'Đã kích hoạt camera 4K' : 'Bấm chọn (Miễn phí)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BẢNG TÍNH CHI PHÍ ĐỘNG (Dynamic Price Summary) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    Bảng tính chi phí động & Đặt cọc giữ xe
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Số tiền cọc thanh toán trước để giữ lịch xe trên hệ thống</p>
                </div>

                {/* Bộ tăng giảm số ngày thuê */}
                {durationTab === 'day' && (
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-600 pl-2">Thời gian thuê:</span>
                    <button
                      type="button"
                      onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      disabled={rentalDays <= 1}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-40 flex items-center justify-center cursor-pointer transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-slate-900 px-2 min-w-[50px] text-center">
                      {rentalDays} ngày
                    </span>
                    <button
                      type="button"
                      onClick={() => setRentalDays(rentalDays + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 flex items-center justify-center cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Chi tiết từng mục chi phí */}
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs border border-slate-100">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Đơn giá cơ bản ({activeDays} ngày x {dailyRate.toLocaleString('vi-VN')} đ):</span>
                  <span className="font-bold text-slate-800">{baseRentalFee.toLocaleString('vi-VN')} đ</span>
                </div>
                {addonFees > 0 && (
                  <div className="flex justify-between items-center text-sky-700">
                    <span>Phí giao xe Sân bay Cam Ranh:</span>
                    <span className="font-bold">+{addonFees.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                {(selectedAddons.babySeat || selectedAddons.dashcam4k) && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Tiện ích tặng kèm (Ghế trẻ em / Camera 4K):</span>
                    <span className="font-bold">0 đ (Miễn phí)</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Tổng tiền thuê ước tính:</span>
                  <span className="text-base text-slate-900">{totalEstimatedFee.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Khối phân tách Tiền cọc trước & Tiền thanh toán khi nhận xe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Ô 1: Tiền cọc giữ xe thanh toán trước */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-teal-500/10 border border-sky-200/90 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-sky-800 uppercase tracking-wide flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-sky-600" /> Tiền cọc trước
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-sky-600 text-white">Giữ lịch 100%</span>
                  </div>
                  <div className="text-xl font-black text-sky-700">
                    {depositRequired.toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {vehicle.type === 'motorbike'
                      ? 'Chỉ cần cọc trước 500k cho xe máy, hoàn cọc nhanh gọn khi trả xe.'
                      : 'Chỉ cần cọc trước 1.000.000đ để khóa xe, cam kết có xe đúng giờ.'}
                  </p>
                </div>

                {/* Ô 2: Số tiền còn lại khi nhận xe */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wide">
                      Còn lại khi nhận xe
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Nhận chìa khóa</span>
                  </div>
                  <div className="text-xl font-black text-slate-800">
                    {remainingAmountDue.toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Thanh toán trực tiếp bằng tiền mặt hoặc chuyển khoản QR sau khi kiểm tra xe.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* ============================================================ */}
          {/* CAM KẾT BÀN GIAO XE MINH BẠCH (3 TIÊU CHUẨN GIAO NHẬN) */}
          {/* ============================================================ */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                  Tiêu chuẩn bàn giao xe minh bạch 100%
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy trình 3 bước đồng kiểm tra nghiêm ngặt — Đảm bảo quyền lợi tối đa cho khách hàng
                </p>
              </div>
              <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cam kết 0đ phụ phí ẩn
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Tiêu chuẩn 1: Chụp ảnh & quay video vết xước 360° trước khi bàn giao */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 border border-sky-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2.5 hover:border-sky-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Video className="w-5 h-5 text-sky-600" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Minh bạch 360°
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Chụp ảnh & quay video vết xước 360°
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Nhân viên cùng khách hàng quay video và chụp ảnh chi tiết 4 mặt xe, lốp, gương và nội thất trước khi ký nhận xe. Lưu hồ sơ số gửi ngay qua Zalo/Email, cam kết tuyệt đối không bắt đền vết trầy xước cũ.
                  </p>
                </div>
                <div className="pt-1.5 border-t border-sky-100/80 flex items-center gap-1.5 text-[11px] font-bold text-sky-700">
                  <Check className="w-3.5 h-3.5 text-sky-600" /> Ký biên bản bàn giao điện tử
                </div>
              </div>

              {/* Tiêu chuẩn 2: Bình đầy xăng / Pin 100% khi nhận */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border border-amber-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2.5 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    {isElectric ? <Zap className="w-5 h-5 text-cyan-600" /> : <Fuel className="w-5 h-5 text-amber-600" />}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isElectric ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isElectric ? 'Pin sạc đầy' : 'Đầy bình xăng'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {isElectric ? 'Pin sạc 100% sẵn sàng' : 'Bình đầy xăng 100% khi nhận'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {isElectric
                      ? 'Xe điện VinFast luôn được sạc đầy 100% pin (hoặc tối thiểu 90%) trước giờ hẹn. Hỗ trợ hướng dẫn sạc nhanh tại hơn 30 trạm VinFast dọc bãi biển Nha Trang và Cam Ranh.'
                      : 'Bình nhiên liệu được đổ đầy 100% trước khi giao, đồng hồ vạch xăng rõ ràng. Khách nhận xe có thể khởi hành khám phá Nha Trang ngay mà không cần ghé cây xăng.'}
                  </p>
                </div>
                <div className="pt-1.5 border-t border-amber-100/80 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                  <Check className="w-3.5 h-3.5 text-amber-600" /> Giao nhận đúng mức nhiên liệu
                </div>
              </div>

              {/* Tiêu chuẩn 3: Khử khuẩn nội thất chuẩn y tế */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border border-emerald-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2.5 hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Chuẩn y tế
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Khử khuẩn nội thất chuẩn y tế
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    100% xe được hút bụi sạch sẽ, lau khử khuẩn bằng dung dịch nano bạc chuẩn y tế trên vô lăng, tay nắm cửa, ghế da và xông tinh dầu sả chanh tự nhiên khử sạch mùi hôi trước mỗi chuyến đi.
                  </p>
                </div>
                <div className="pt-1.5 border-t border-emerald-100/80 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Khoang lái sạch bóng, thơm tho
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* ============================================================ */}
          {/* 4. GIẤY TỜ THUÊ XE (#mioto-section-docs) */}
          {/* ============================================================ */}
          <section id="mioto-section-docs" className="space-y-4 scroll-mt-20">
            <div>
              <h2 className="text-lg font-black text-slate-900">{t('modal.docs_title')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thủ tục tinh gọn, linh hoạt — Phân loại rõ ràng theo đối tượng khách hàng
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hình thức 1: Khách Việt Nam (CCCD gắn chip / VNeID Cấp 2) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/30 border border-slate-200/90 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <span className="font-black text-sm text-slate-900 block">
                        Khách hàng Việt Nam
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Áp dụng công dân mang quốc tịch Việt Nam
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-sky-600 text-white shadow-sm shadow-sky-600/20">
                    VNeID Cấp 2
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>1. CCCD gắn chip hoặc Định danh VNeID Cấp 2</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                      Chấp nhận xuất trình thông tin trên ứng dụng <strong>VNeID Mức độ 2</strong> hoặc thẻ CCCD gắn chip gốc. <em>Cửa hàng chỉ đối chiếu và chụp ảnh lưu hồ sơ, hoàn toàn không giữ lại CCCD gốc của khách hàng.</em>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>2. Giấy phép lái xe (GPLX) hợp lệ</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                      Bản gốc GPLX còn thời hạn: Hạng <strong>B1 / B2 trở lên</strong> đối với xe ô tô, hoặc hạng <strong>A1 / A2</strong> đối với xe máy. Chấp nhận GPLX tích hợp trên ứng dụng VNeID.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/70 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cam kết: Trả lại giấy tờ tùy thân ngay sau 5 phút đối chiếu</span>
                </div>
              </div>

              {/* Hình thức 2: Khách Quốc tế (Passport + Bằng lái quốc tế IDP) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/90 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-black text-sm text-slate-900 block">
                        Khách Quốc tế & Việt Kiều
                      </span>
                      <span className="text-[11px] text-slate-500">
                        International Guests & Tourists
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                    Công ước Viên 1968
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>1. Hộ chiếu (Passport) & Thị thực hợp lệ</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                      Hộ chiếu gốc còn hạn trên 6 tháng kèm dấu nhập cảnh hoặc e-Visa Việt Nam còn thời hạn lưu trú hợp pháp.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>2. Bằng lái quốc tế IDP (Công ước Viên 1968)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                      Bằng lái quốc tế IDP được cấp theo <strong>Công ước Viên 1968</strong>, bắt buộc xuất trình kèm theo <strong>Bằng lái quốc gia gốc</strong> còn hiệu lực.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-blue-800 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200/70 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Hỗ trợ nhân viên giao xe giao tiếp tiếng Anh lưu loát</span>
                </div>
              </div>
            </div>

            {/* Tài sản thế chấp (Đặt cọc) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs text-slate-700">
              <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>{t('modal.deposit_title')}</span>
              </div>
              <p className="leading-relaxed">
                {t('modal.deposit_desc')}
              </p>
            </div>

            {/* Lưu ý khách Mỹ, Úc, Nhật, Trung Quốc */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                {t('modal.warning_non_vienna')}
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* ============================================================ */}
          {/* 5. ĐIỀU KHOẢN & PHỤ PHÍ */}
          {/* ============================================================ */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">{t('modal.terms_title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">{t('modal.term_limit_title')}</span>
                <span className="text-slate-600 block">{t('modal.term_limit_desc')}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">{t('modal.term_fuel_title')}</span>
                <span className="text-slate-600 block">{t('modal.term_fuel_desc')}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">{t('modal.term_smoke_title')}</span>
                <span className="text-slate-600 block">{t('modal.term_smoke_desc')}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">{t('modal.term_hours_title')}</span>
                <span className="text-slate-600 block">{t('modal.term_hours_desc')}</span>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* ============================================================ */}
          {/* 6. VỊ TRÍ XE (#mioto-section-location) */}
          {/* ============================================================ */}
          <section id="mioto-section-location" className="space-y-3 scroll-mt-20">
            <h2 className="text-lg font-black text-slate-900">{t('modal.location_title')}</h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">{t('modal.location_showroom_title')}</strong>
                  <span>{t('modal.location_showroom_desc')}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 pt-1 border-t border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">{t('modal.location_free_delivery_title')}</strong>
                  <span>{t('modal.location_free_delivery_desc')}</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* ============================================================ */}
        {/* MIOTO STICKY BOTTOM BAR (ĐƠN GIÁ & NÚT ĐẶT CỌC NGAY - MOBILE ONE-HAND OPTIMIZED) */}
        {/* ============================================================ */}
        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 sm:px-8 py-3 sm:py-3.5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
            
            {/* Cột thông tin cọc & giá: trên mobile bố trí 2 bên dàn đều */}
            <div className="flex items-center justify-between sm:block">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>{durationTab === 'month' ? t('modal.bottom_month_pkg') : 'Tổng tiền cọc giữ xe'}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Hoàn 100%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-sky-700 tracking-tight">
                    {durationTab === 'month' ? formattedPrice : depositRequired.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {durationTab === 'month' ? unitText : 'VNĐ'}
                  </span>
                </div>
              </div>

              {/* Tóm tắt tổng chi phí dự kiến */}
              <div className="text-right sm:text-left text-[11px] font-medium text-slate-500">
                <span className="hidden sm:inline">Tổng chi phí dự kiến: </span>
                <span className="font-bold text-slate-800 sm:font-semibold sm:text-slate-600">
                  {totalEstimatedFee.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-slate-400 block sm:inline sm:ml-1">
                  ({activeDays} ngày{addonFees > 0 ? ' + sân bay' : ''})
                </span>
              </div>
            </div>

            {/* Nút hành động lớn, dễ chạm bằng một tay (Thumb-reach area, height >= 52px) */}
            <button
              onClick={() => onBookNow(vehicle)}
              className="w-full sm:w-auto sm:min-w-[260px] px-8 py-3.5 sm:py-4 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500 hover:from-sky-700 hover:via-cyan-700 hover:to-teal-600 active:scale-[0.98] text-white font-black text-base rounded-2xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer min-h-[52px] touch-manipulation select-none"
            >
              <span>Tiến hành đặt cọc ngay</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* FULLSCREEN PHOTO LIGHTBOX (Khi bấm xem tất cả ảnh) */}
      {/* ============================================================ */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewPhoto}
            alt="Preview"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl drop-shadow-2xl"
          />
        </div>
      )}
    </div>,
    document.body
  );
};
