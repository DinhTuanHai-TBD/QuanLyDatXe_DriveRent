import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBannerSlider } from '../../components/customer/HeroBannerSlider';
import { VehicleImageWithSkeleton } from './VehiclesCustomerView';
import {
  Car,
  Bike,
  Search,
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  QrCode,
  Key,
  FileText,
  ArrowRight,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export const HomeCustomerView: React.FC = () => {
  const { vehicles, setCustomerTab, settings, t, translateVehicle, customerSearchCriteria, setCustomerSearchCriteria } = useApp();

  // Bộ lọc tìm kiếm nhanh gắn tiếp giáp chân trang bìa
  const [selectedVehicleType, setSelectedVehicleType] = useState<'all' | 'car' | 'scooter'>(
    (customerSearchCriteria?.vehicleType as any) || 'all'
  );
  const [startDate, setStartDate] = useState(customerSearchCriteria?.startDate || '2026-10-14T08:00');
  const [endDate, setEndDate] = useState(customerSearchCriteria?.endDate || '2026-10-15T08:00');

  // Trạng thái hiển thị thanh tìm kiếm: Khi ở đầu trang thì ẩn đi, khi kéo xuống mới hiện lên với animation
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsSearchVisible(scrollY > 60);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Accordion FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Đội xe tiêu biểu (lọc hiển thị 4 xe)
  const featuredVehicles = vehicles.slice(0, 4);

  // Trạng thái kiểm tra lỗi nhập ngày giờ (tránh dùng alert gây gián đoạn trải nghiệm)
  const [dateError, setDateError] = useState<string | null>(null);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      setDateError(t('error.invalid_date_range', 'Ngày & Giờ trả xe phải sau ngày & giờ nhận xe ít nhất 1 tiếng!'));
      return;
    }
    setDateError(null);

    setCustomerSearchCriteria({
      startDate,
      endDate,
      pickupLocation: t('home.loc_office', 'Văn phòng Showroom (25 Lê Lợi, TP. Nha Trang)'),
      vehicleType: selectedVehicleType,
    });
    setCustomerTab('vehicles');
  };

  const handleSelectVehicle = (vehicleId: string) => {
    sessionStorage.setItem('selected_vehicle_id', vehicleId);
    setCustomerTab('vehicles');
  };

  const qualityStandards = [
    {
      step: '01',
      title: t('home.std_1_title'),
      desc: t('home.std_1_desc')
    },
    {
      step: '02',
      title: t('home.std_2_title'),
      desc: t('home.std_2_desc')
    },
    {
      step: '03',
      title: t('home.std_3_title'),
      desc: t('home.std_3_desc')
    },
    {
      step: '04',
      title: t('home.std_4_title'),
      desc: t('home.std_4_desc')
    }
  ];

  const faqs = [
    {
      q: t('home.faq_q1'),
      a: t('home.faq_a1')
    },
    {
      q: t('home.faq_q2'),
      a: t('home.faq_a2')
    },
    {
      q: t('home.faq_q3'),
      a: t('home.faq_a3')
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-sky-500 selection:text-white">
      {/* 1. TRANG BÌA VỪA VẶN MÀN HÌNH (100dvh FULL VIEWPORT COVER) */}
      <HeroBannerSlider onExploreClick={() => setCustomerTab('vehicles')} />

      {/* 2. KHUNG TÌM KIẾM NẰM TIẾP GIÁP CHÂN TRANG BÌA (FLOATING ISLAND / GLASSMORPHISM BIỂN NHA TRANG) */}
      <div
        id="home-search-layer"
        className={`max-w-[1440px] mx-auto px-4 sm:px-8 relative z-30 -mt-10 sm:-mt-14 lg:-mt-16 transition-all duration-500 ease-out transform ${
          isSearchVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
            : 'opacity-0 translate-y-8 pointer-events-none scale-[0.98]'
        }`}
      >
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-7 text-slate-900 shadow-[0_24px_60px_-15px_rgba(2,132,199,0.18),0_4px_16px_rgba(0,0,0,0.06)] border border-sky-100/90 transition-all overflow-hidden">
          {/* Top coastal blue aura line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-700" />

          <form onSubmit={handleSearchSubmit} className="space-y-4 sm:space-y-5">
            {/* Header: Title with Live Ping Dot + Segmented Vehicle Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-sky-100/80">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-600 shadow-xs" />
                </span>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                  {t('home.search_title')}
                </h2>
                <span className="text-xs text-sky-700 font-bold hidden md:inline px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200/60">
                  — {t('home.search_subtitle')}
                </span>
              </div>

              {/* Tùy chọn phân loại nhanh chuẩn WCAG: Tất cả / Ô tô / Xe máy */}
              <div className="inline-flex p-1 rounded-2xl bg-sky-50/80 border border-sky-200/80 text-xs font-bold gap-1 self-start sm:self-auto shadow-inner">
                <button
                  type="button"
                  onClick={() => setSelectedVehicleType('all')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedVehicleType === 'all'
                      ? 'bg-gradient-to-r from-sky-700 to-sky-600 text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-sky-800 hover:bg-white/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('filter.all', 'Tất cả xe')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVehicleType('car')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedVehicleType === 'car'
                      ? 'bg-gradient-to-r from-sky-700 to-sky-600 text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-sky-800 hover:bg-white/60'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>{t('filter.car', 'Ô tô tự lái')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVehicleType('scooter')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedVehicleType === 'scooter'
                      ? 'bg-gradient-to-r from-sky-700 to-sky-600 text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-sky-800 hover:bg-white/60'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>{t('filter.scooter', 'Xe máy tiết kiệm')}</span>
                </button>
              </div>
            </div>

            {/* Hiển thị lỗi ngày giờ nếu có */}
            {dateError && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{dateError}</span>
              </div>
            )}

            {/* Main Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-4 items-end">
              {/* Field 1: Pickup Date & Time */}
              <div className="space-y-1.5">
                <label htmlFor="search-pickup-datetime" className="font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer text-xs">
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{t('home.pickup_datetime')}</span>
                </label>
                <input
                  id="search-pickup-datetime"
                  aria-label={t('home.pickup_datetime')}
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (dateError) setDateError(null);
                  }}
                  className="w-full px-3.5 py-3 min-h-[48px] bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-300 focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 rounded-xl focus:outline-hidden font-bold text-slate-900 text-xs shadow-2xs transition-all cursor-pointer"
                />
              </div>

              {/* Field 2: Return Date & Time */}
              <div className="space-y-1.5">
                <label htmlFor="search-return-datetime" className="font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer text-xs">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{t('home.return_datetime')}</span>
                </label>
                <input
                  id="search-return-datetime"
                  aria-label={t('home.return_datetime')}
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (dateError) setDateError(null);
                  }}
                  className="w-full px-3.5 py-3 min-h-[48px] bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-300 focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 rounded-xl focus:outline-hidden font-bold text-slate-900 text-xs shadow-2xs transition-all cursor-pointer"
                />
              </div>

              {/* Field 3: Search CTA Button */}
              <div className="md:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  aria-label={t('home.btn_search')}
                  className="w-full py-3.5 px-6 min-h-[48px] bg-gradient-to-r from-sky-600 via-sky-700 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 active:scale-[0.98] text-white font-black rounded-xl shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide cursor-pointer group"
                >
                  <Search className="w-4 h-4 stroke-[2.5] group-hover:scale-110 transition-transform" />
                  <span>{t('home.btn_search')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* CÁC LAYER NỘI DUNG XUẤT HIỆN KHI KÉO XUỐNG */}
      <div className="space-y-16 sm:space-y-24 pt-16 sm:pt-20 pb-24">

      {/* 3. BỘ SƯU TẬP XE TIÊU BIỂU */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-2 border-sky-100">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {t('home.featured_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Đội xe đời mới 2023 - 2025, khử khuẩn sạch sẽ và bảo dưỡng định kỳ trước từng chuyến lăn bánh
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCustomerTab('vehicles')}
            aria-label={`${t('home.view_all_prefix')} ${vehicles.length} ${t('home.view_all_suffix')}`}
            className="inline-flex items-center gap-2 text-xs font-black text-white bg-slate-900 hover:bg-sky-700 active:scale-95 cursor-pointer px-5 py-3 min-h-[44px] rounded-full shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <span>{t('home.view_all_prefix')} {vehicles.length} {t('home.view_all_suffix')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((v) => {
            const transInfo = translateVehicle(v);
            return (
              <div
                key={v.id}
                onClick={() => handleSelectVehicle(v.id)}
                className="bg-white rounded-3xl border border-sky-200/90 shadow-[0_8px_24px_rgba(2,132,199,0.08)] hover:shadow-[0_20px_40px_rgba(2,132,199,0.18)] hover:border-sky-400 transition-all duration-200 ease-out overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 cursor-pointer min-w-0"
              >
                <div className="min-w-0">
                  <div className="relative aspect-4/3 bg-gradient-to-b from-sky-50/60 to-sky-100/40 border-b border-sky-100 overflow-hidden flex items-center justify-center p-3">
                    <VehicleImageWithSkeleton
                      src={v.image}
                      alt={v.name}
                      type={v.type}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 ease-out relative z-10"
                    />
                    <div className="absolute top-3 left-3 z-20">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white shadow-md border border-slate-700 uppercase tracking-wider">
                        {transInfo.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5 min-w-0">
                    <h3
                      title={v.name}
                      className="font-black text-lg text-slate-900 group-hover:text-sky-600 transition-colors truncate tracking-tight block max-w-full"
                    >
                      {v.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 truncate">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold shrink-0">{transInfo.transmission}</span>
                      <span className="shrink-0">· {t('home.model_year')} {v.year}</span>
                      <span className="truncate">· {v.color}</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5 min-w-0">
                      {v.features.slice(0, 2).map((feat, idx) => (
                        <span key={idx} className="text-xs text-sky-950 bg-sky-50 px-2.5 py-1 rounded-full font-bold border border-sky-200/90 flex items-center gap-1 max-w-full min-w-0" title={feat}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-sky-100/90 mt-2 space-y-3 min-w-0">
                  <div className="flex items-baseline justify-between pt-2.5 min-w-0">
                    <div className="min-w-0">
                      <span className="text-xs text-slate-600 uppercase font-bold tracking-wider block">{t('home.rate_daily')}</span>
                      <span className="text-xl font-black text-sky-700 font-mono tracking-tight tabular-nums block truncate">
                        {formatVND(v.dailyPrice)}
                        <span className="text-xs text-slate-600 font-bold ml-0.5">{t('home.per_day')}</span>
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-600 uppercase font-bold block">{t('home.rate_hourly')}</span>
                      <span className="text-xs text-slate-700 font-mono font-bold tabular-nums">
                        {formatVND(v.hourlyPrice)}{t('home.per_hour')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectVehicle(v.id);
                      }}
                      aria-label={`${t('home.btn_book_car')}: ${v.name}`}
                      className="w-full py-3 px-4 min-h-[44px] text-xs font-black text-white bg-sky-700 hover:bg-sky-800 active:scale-[0.98] focus:outline-hidden focus:ring-4 focus:ring-sky-500/25 rounded-xl text-center shadow-md shadow-sky-800/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t('home.btn_book_car')}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MỤC GIỚI THIỆU & 4 TIÊU CHUẨN (BOLDER COASTAL DESIGN) */}
      <section className="bg-gradient-to-b from-sky-50/70 via-white to-sky-50/40 py-20 px-4 sm:px-8 border-y border-sky-200">
        <div className="max-w-[1440px] mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {t('home.about_title')}
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed font-medium max-w-lg">
                {t('home.about_desc1')}
              </p>
              <p className="text-slate-700 text-sm leading-relaxed font-medium max-w-lg">
                {t('home.about_desc2')}
              </p>

              {/* 3 Thẻ thống kê BOLDER với độ sâu nổi bật */}
              <div className="grid grid-cols-3 gap-4 pt-3">
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-200 text-center shadow-[0_6px_20px_rgba(2,132,199,0.08)] hover:-translate-y-1 hover:border-sky-400 transition-all duration-200">
                  <span className="text-2xl sm:text-3xl font-black text-sky-700 font-mono tracking-tight block drop-shadow-2xs">100%</span>
                  <p className="text-xs font-black text-slate-900 mt-1">{t('home.stat_new_cars')}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">2023 - 2025</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-200 text-center shadow-[0_6px_20px_rgba(2,132,199,0.08)] hover:-translate-y-1 hover:border-sky-400 transition-all duration-200">
                  <span className="text-2xl sm:text-3xl font-black text-sky-700 font-mono tracking-tight block drop-shadow-2xs">24/7</span>
                  <p className="text-xs font-black text-slate-900 mt-1">{t('home.stat_rescue')}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{t('home.stat_rescue_sub')}</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-200 text-center shadow-[0_6px_20px_rgba(2,132,199,0.08)] hover:-translate-y-1 hover:border-sky-400 transition-all duration-200">
                  <span className="text-2xl sm:text-3xl font-black text-sky-700 font-mono tracking-tight block drop-shadow-2xs">0 đ</span>
                  <p className="text-xs font-black text-slate-900 mt-1">{t('home.stat_no_hidden')}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{t('home.stat_no_hidden_sub')}</p>
                </div>
              </div>
            </div>

            {/* 2 Thẻ Đội xe Ô tô & Xe máy BOLDER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-sky-200 shadow-[0_8px_24px_rgba(2,132,199,0.08)] overflow-hidden hover:border-sky-400 hover:shadow-xl transition-all duration-200">
                <div className="bg-sky-700 px-5 py-3.5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-sky-200" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      {t('home.fleet_car_title')}
                    </span>
                  </div>
                  <span className="text-xs font-black bg-white text-sky-900 px-2.5 py-1 rounded-full shadow-2xs">
                    {t('home.fleet_car_badge')}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {t('home.fleet_car_desc')}
                  </p>
                  <div>
                    <span className="inline-block text-xs font-black text-sky-900 bg-sky-100/90 px-4 py-1.5 rounded-full border border-sky-300 shadow-2xs">
                      {t('home.fleet_car_price')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-sky-200 shadow-[0_8px_24px_rgba(2,132,199,0.08)] overflow-hidden hover:border-sky-400 hover:shadow-xl transition-all duration-200">
                <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-sky-900 px-5 py-3.5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-sky-300" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      {t('home.fleet_bike_title')}
                    </span>
                  </div>
                  <span className="text-xs font-black bg-white text-slate-900 px-2.5 py-1 rounded-full shadow-2xs">
                    {t('home.fleet_bike_badge')}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {t('home.fleet_bike_desc')}
                  </p>
                  <div>
                    <span className="inline-block text-xs font-black text-sky-900 bg-sky-100/90 px-4 py-1.5 rounded-full border border-sky-300 shadow-2xs">
                      {t('home.fleet_bike_price')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Tiêu chuẩn bàn giao - BOLDER CARD GRID */}
          <div className="pt-8 border-t-2 border-sky-200/80">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-balance">
                {t('home.std_title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualityStandards.map((std) => (
                <div
                  key={std.step}
                  className="bg-white rounded-2xl border border-sky-200 hover:border-sky-400 shadow-[0_4px_16px_rgba(2,132,199,0.06)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="bg-sky-50/80 px-4 py-3 border-b border-sky-200 flex items-center justify-between">
                    <span className="text-xs font-black text-sky-950 uppercase tracking-wider">{t('home.std_label')}</span>
                    <span className="w-8 h-8 rounded-xl bg-sky-700 text-white font-mono font-black text-xs flex items-center justify-center shadow-md shadow-sky-700/25">
                      {std.step}
                    </span>
                  </div>
                  <div className="p-5 space-y-2.5 flex-1">
                    <h3 className="font-black text-sm text-slate-900 tracking-tight">{std.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{std.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. LỘ TRÌNH THUÊ XE 4 BƯỚC (BENTO GRID TIMELINE) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight text-balance">
            {t('home.steps_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed text-pretty">
            {t('home.steps_desc')}
          </p>
        </div>

        {/* Thanh tiến trình Timeline kết nối trên Desktop */}
        <div className="hidden lg:block relative max-w-4xl mx-auto px-8 pb-3">
          <div className="absolute top-5 left-14 right-14 h-1 bg-sky-200 rounded-full z-0 opacity-70" />
          <div className="relative z-10 grid grid-cols-4 gap-4 text-center">
            {[
              { num: '01', title: t('home.step_1_title') },
              { num: '02', title: t('home.step_2_title') },
              { num: '03', title: t('home.step_3_title') },
              { num: '04', title: t('home.step_4_title') }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-1.5 group cursor-default">
                <span className="w-10 h-10 rounded-full bg-white border-2 border-sky-700 text-sky-800 font-mono font-black text-xs flex items-center justify-center shadow-md shadow-sky-800/20 group-hover:scale-110 group-hover:bg-sky-700 group-hover:text-white transition-all duration-200">
                  {s.num}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate max-w-[160px]">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lưới Bento Box Grid 4 bước - Tối ưu 375px đến 1440px */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Bước 1: Chọn xe */}
          <div className="bg-white rounded-3xl border border-sky-200/90 shadow-[0_8px_24px_rgba(2,132,199,0.06)] hover:shadow-[0_16px_36px_rgba(2,132,199,0.14)] hover:border-sky-400 transition-all duration-300 p-6 flex flex-col justify-between group hover:-translate-y-1.5 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-800/30 group-hover:scale-105 transition-transform duration-200">
                  <Car className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-black font-mono px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                  {t('home.step_prefix')} 01
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-lg text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
                  {t('home.step_1_title')}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium text-pretty">
                  {t('home.step_1_desc')}
                </p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-sky-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-sky-950 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>50+ dòng xe đời mới sẵn sàng</span>
              </div>
              <button
                type="button"
                onClick={() => setCustomerTab('vehicles')}
                className="w-full py-2.5 px-3 min-h-[44px] bg-sky-50 hover:bg-sky-100 text-sky-900 font-black text-xs rounded-xl border border-sky-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Xem xe trực tuyến</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card Bước 2: Đặt cọc 20% */}
          <div className="bg-white rounded-3xl border border-sky-200/90 shadow-[0_8px_24px_rgba(2,132,199,0.06)] hover:shadow-[0_16px_36px_rgba(2,132,199,0.14)] hover:border-sky-400 transition-all duration-300 p-6 flex flex-col justify-between group hover:-translate-y-1.5 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-800/30 group-hover:scale-105 transition-transform duration-200">
                  <QrCode className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-black font-mono px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                  {t('home.step_prefix')} 02
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-lg text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
                  {t('home.step_2_title')}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium text-pretty">
                  {t('home.step_2_desc')}
                </p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-sky-100 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Mã VietQR tự động khớp lệnh</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-sky-950 font-bold bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Khóa lịch xe tức thì trong 10 phút</span>
              </div>
            </div>
          </div>

          {/* Card Bước 3: Nhận xe & Ký hợp đồng */}
          <div className="bg-white rounded-3xl border border-sky-200/90 shadow-[0_8px_24px_rgba(2,132,199,0.06)] hover:shadow-[0_16px_36px_rgba(2,132,199,0.14)] hover:border-sky-400 transition-all duration-300 p-6 flex flex-col justify-between group hover:-translate-y-1.5 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-800/30 group-hover:scale-105 transition-transform duration-200">
                  <Key className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-black font-mono px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                  {t('home.step_prefix')} 03
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-lg text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
                  {t('home.step_3_title')}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium text-pretty">
                  {t('home.step_3_desc')}
                </p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-sky-100 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Giao tận nơi hoặc 25 Lê Lợi</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-sky-950 font-bold bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Không giữ bản gốc CCCD/GPLX</span>
              </div>
            </div>
          </div>

          {/* Card Bước 4: Hoàn trả xe & Nhận cọc 100% */}
          <div className="bg-white rounded-3xl border border-sky-200/90 shadow-[0_8px_24px_rgba(2,132,199,0.06)] hover:shadow-[0_16px_36px_rgba(2,132,199,0.14)] hover:border-sky-400 transition-all duration-300 p-6 flex flex-col justify-between group hover:-translate-y-1.5 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-800/30 group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-black font-mono px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                  {t('home.step_prefix')} 04
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-lg text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">
                  {t('home.step_4_title')}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium text-pretty">
                  {t('home.step_4_desc')}
                </p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-sky-100 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Nghiệm thu 5 phút tại chỗ</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-sky-950 font-bold bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Hoàn 100% tiền cọc tức thì</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('home.faq_title')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('home.faq_desc', 'Giải đáp nhanh các thông tin quan trọng về thủ tục nhận xe và chính sách thuê')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-sky-200 hover:border-sky-400 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-sky-700 cursor-pointer min-h-[44px]"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-sky-700 text-white text-xs flex items-center justify-center shrink-0 font-bold font-mono shadow-xs">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-sky-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-slate-700 leading-relaxed border-t border-sky-100 bg-sky-50/30 pt-4 font-medium max-w-lg">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Banner (Đồng màu xanh biển Nha Trang) */}
        <div className="p-7 sm:p-9 rounded-3xl bg-sky-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-sky-700 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-black text-sky-200 uppercase tracking-wider">{t('home.support_badge')}</span>
            <h3 className="font-black text-xl sm:text-2xl">{t('home.support_title')}</h3>
            <p className="text-xs sm:text-sm text-sky-100 font-medium max-w-xl">{t('home.support_desc')}</p>
          </div>
          <a
            href={`tel:${settings.hotline.replace(/\s+/g, '')}`}
            className="px-6 py-3.5 min-h-[44px] bg-white text-slate-900 hover:bg-sky-50 font-black text-xs rounded-2xl flex items-center gap-2 shrink-0 transition-all shadow-md cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-sky-600" />
            <span>{t('home.btn_call_now')} {settings.hotline}</span>
          </a>
        </div>
      </section>
      </div>
    </div>
  );
};
