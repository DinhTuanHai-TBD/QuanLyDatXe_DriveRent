import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';
import { VehicleDetailModal } from '../../components/customer/VehicleDetailModal';
import {
  Car,
  Search,
  Building2,
  ChevronDown,
  ArrowRight,
  Zap,
  Users,
  Box,
  Fuel,
  CheckCircle2,
  SearchX,
  RotateCcw,
  Sparkles,
  Bike,
  SlidersHorizontal,
  X,
  Layers,
  CircleDollarSign,
  ShieldCheck,
  Gauge,
  Info,
  Calendar
} from 'lucide-react';

// Component hiển thị ảnh xe với hiệu ứng khung xương (Skeleton loader) và dự phòng khi lỗi mạng
export const VehicleImageWithSkeleton: React.FC<{
  src: string;
  alt: string;
  type?: 'car' | 'motorbike' | string;
  className?: string;
}> = ({ src, alt, type = 'car', className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Skeleton Shimmer khi ảnh đang được tải */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100 animate-pulse flex flex-col items-center justify-center gap-2">
          <Car className="w-9 h-9 text-slate-300 animate-pulse stroke-[1.5]" />
          <div className="w-16 h-2 bg-slate-300/60 rounded-md animate-pulse" />
        </div>
      )}

      {/* Giao diện dự phòng an toàn khi link ảnh lỗi */}
      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2 p-4 text-center select-none">
          <Car className="w-10 h-10 text-slate-400 stroke-[1.5]" />
          <span className="text-xs font-semibold text-slate-500">
            {type === 'motorbike' ? 'Ảnh xe máy DriveRent' : 'Ảnh xe tự lái DriveRent'}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`${className || ''} ${
            loaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        />
      )}
    </div>
  );
};

// Skeleton Card loader giả lập khi chuyển bộ lọc hoặc tải dữ liệu
const VehicleCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between p-4 space-y-4 animate-pulse">
    <div className="h-48 sm:h-52 bg-slate-200/80 rounded-xl relative overflow-hidden flex items-center justify-center">
      <Car className="w-10 h-10 text-slate-300" />
    </div>
    <div className="w-36 h-7 mx-auto bg-slate-200 rounded-md -mt-7 relative z-10" />
    <div className="w-3/4 h-5 mx-auto bg-slate-200 rounded-md" />
    <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
      <div className="h-4 bg-slate-100 rounded" />
      <div className="h-4 bg-slate-100 rounded" />
      <div className="h-4 bg-slate-100 rounded" />
      <div className="h-4 bg-slate-100 rounded" />
    </div>
    <div className="h-11 bg-slate-200 rounded-xl" />
  </div>
);

export const VehiclesCustomerView: React.FC = () => {
  const {
    vehicles,
    setCustomerTab,
    setSelectedCustomerVehicleId,
    customerSearchCriteria,
    setCustomerSearchCriteria,
    checkVehicleAvailability,
    createOnlineBooking,
    translateVehicle,
    t
  } = useApp();

  // State quản lý hiển thị Modal chi tiết xe chuẩn Mioto
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<Vehicle | null>(null);

  // Rental duration tabs: 'day' | 'month'
  const [durationTab, setDurationTab] = useState<'day' | 'month'>('day');

  // Search form fields
  const [selectedCity, setSelectedCity] = useState(
    customerSearchCriteria?.pickupLocation?.includes('Hà Nội') ? 'Hà Nội' : 'Nha Trang'
  );
  const [startDateStr, setStartDateStr] = useState('2026-10-14');
  const [startTimeStr, setStartTimeStr] = useState('08:00');
  const [endDateStr, setEndDateStr] = useState('2026-10-15');
  const [endTimeStr, setEndTimeStr] = useState('08:00');

  // Tính toán giá động theo gói Thuê ngày hoặc Thuê tháng
  const getVehiclePrice = (v: Vehicle) => {
    if (durationTab === 'month') {
      // Giá tháng = monthlyPrice (nếu có) hoặc tự động tính theo gói ưu đãi tháng: dailyPrice * 22 làm tròn đến 100.000đ (~giảm 27-30%)
      const monthly = (v as any).monthlyPrice || Math.round((v.dailyPrice * 22) / 100000) * 100000;
      return {
        amount: monthly,
        formatted: monthly.toLocaleString('vi-VN'),
        unit: t('specs.month_unit'),
        discountBadge: t('duration.month_discount_tag')
      };
    }
    return {
      amount: v.dailyPrice,
      formatted: v.dailyPrice.toLocaleString('vi-VN'),
      unit: t('specs.day_unit'),
      discountBadge: null
    };
  };

  // Tự động cập nhật Form tìm kiếm ngày trả khi chuyển tab Thuê tháng (cộng 30 ngày)
  const handleDurationTabChange = (tab: 'day' | 'month') => {
    setDurationTab(tab);
    const start = new Date(startDateStr);
    if (!isNaN(start.getTime())) {
      if (tab === 'month') {
        start.setDate(start.getDate() + 30);
      } else {
        start.setDate(start.getDate() + 1);
      }
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, '0');
      const dd = String(start.getDate()).padStart(2, '0');
      setEndDateStr(`${yyyy}-${mm}-${dd}`);
    }
  };

  // Tự động giữ khoảng cách 30 ngày khi người dùng đổi ngày nhận trong tab Thuê tháng
  const handleStartDateChange = (newDateStr: string) => {
    setStartDateStr(newDateStr);
    if (durationTab === 'month') {
      const start = new Date(newDateStr);
      if (!isNaN(start.getTime())) {
        start.setDate(start.getDate() + 30);
        const yyyy = start.getFullYear();
        const mm = String(start.getMonth() + 1).padStart(2, '0');
        const dd = String(start.getDate()).padStart(2, '0');
        setEndDateStr(`${yyyy}-${mm}-${dd}`);
      }
    }
  };

  // Vehicle category & Price tier filter types
  type PriceRangeKey = 'all' | 'under500' | '500to1000' | '1000to1800' | 'above1800';

  // Quick Persona filter types (Nhu cầu du lịch Nha Trang)
  type PersonaKey = 'all' | 'family' | 'couple' | 'electric' | 'vinhhy';
  const [selectedPersona, setSelectedPersona] = useState<PersonaKey>('all');

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'electric' | 'car' | 'motorbike'>('all');
  const [priceRange, setPriceRange] = useState<PriceRangeKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');

  // Sticky Filter Bar & Mobile Drawer States
  const [isStickyFilterVisible, setIsStickyFilterVisible] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsStickyFilterVisible(scrollY > 340);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đồng bộ tiêu chí tìm kiếm từ trang chủ (HomeCustomerView) khi người dùng tra cứu & chuyển trang
  useEffect(() => {
    if (customerSearchCriteria) {
      if (customerSearchCriteria.startDate) {
        const [d, t] = customerSearchCriteria.startDate.split('T');
        if (d) setStartDateStr(d);
        if (t) setStartTimeStr(t.slice(0, 5));
      }
      if (customerSearchCriteria.endDate) {
        const [d, t] = customerSearchCriteria.endDate.split('T');
        if (d) setEndDateStr(d);
        if (t) setEndTimeStr(t.slice(0, 5));
      }
      if (customerSearchCriteria.vehicleType) {
        if (customerSearchCriteria.vehicleType === 'car') {
          setSelectedCategory('car');
        } else if (customerSearchCriteria.vehicleType === 'scooter') {
          setSelectedCategory('motorbike');
        } else {
          setSelectedCategory('all');
        }
      }
      if (customerSearchCriteria.pickupLocation) {
        setSelectedCity(
          customerSearchCriteria.pickupLocation.includes('Hà Nội') ? 'Hà Nội' : 'Nha Trang'
        );
      }
    }
  }, [customerSearchCriteria]);

  const fullStartIso = `${startDateStr}T${startTimeStr}:00`;
  const fullEndIso = `${endDateStr}T${endTimeStr}:00`;

  // Helper functions to identify vehicle categories reliably
  const isElectricVehicle = (v: Vehicle) => {
    return (
      v.fuelType === 'electric' ||
      v.name.toLowerCase().includes('vf') ||
      v.name.toLowerCase().includes('vinfast') ||
      v.category.toLowerCase().includes('điện')
    );
  };

  const isGasolineCar = (v: Vehicle) => {
    return v.type === 'car' && !isElectricVehicle(v);
  };

  const isMotorbike = (v: Vehicle) => {
    return v.type === 'motorbike';
  };

  // Check if a vehicle is currently available to rent
  const isVehicleAvailable = (v: Vehicle) => {
    // 1. Exclude vehicles in maintenance
    if (v.status === 'maintenance') return false;
    // 2. Exclude vehicles currently rented
    if (v.status === 'rented') return false;
    // 3. Exclude vehicles with booking schedule conflict
    const avail = checkVehicleAvailability(v.id, fullStartIso, fullEndIso);
    return avail.available;
  };

  // Only take vehicles that are AVAILABLE to rent (User Request 5)
  const availableVehicles = vehicles.filter((v) => isVehicleAvailable(v));

  // Compute counts for available vehicles
  const countAll = availableVehicles.length;
  const countElectric = availableVehicles.filter((v) => isElectricVehicle(v)).length;
  const countCar = availableVehicles.filter((v) => isGasolineCar(v)).length;
  const countMotorbike = availableVehicles.filter((v) => isMotorbike(v)).length;

  // Helper phân loại khoảng giá xe theo ngày hoặc tháng
  const getVehiclePriceTier = (v: Vehicle): PriceRangeKey => {
    const amount = getVehiclePrice(v).amount;
    if (durationTab === 'day') {
      if (amount < 500000) return 'under500';
      if (amount <= 1000000) return '500to1000';
      if (amount <= 1800000) return '1000to1800';
      return 'above1800';
    } else {
      if (amount < 10000000) return 'under500';
      if (amount <= 20000000) return '500to1000';
      if (amount <= 35000000) return '1000to1800';
      return 'above1800';
    }
  };

  // Logic nhận diện nhu cầu du lịch Nha Trang
  const matchPersona = (v: Vehicle, persona: PersonaKey) => {
    if (persona === 'all') return true;
    if (persona === 'family') {
      return v.type === 'car' && (v.seats >= 5 || ['Xpander', 'Carnival', 'Everest', 'VF 8', 'VF 9', 'Vios', 'Accent'].some(n => v.name.includes(n)));
    }
    if (persona === 'couple') {
      const isCompactCar = v.type === 'car' && (v.name.includes('VF 3') || v.name.includes('VF 5') || v.name.includes('Mazda 3'));
      const isTrendyScooter = v.type === 'motorbike' && (v.name.includes('Vision') || v.name.includes('SH') || v.name.includes('Air Blade'));
      return isCompactCar || isTrendyScooter;
    }
    if (persona === 'electric') {
      return isElectricVehicle(v);
    }
    if (persona === 'vinhhy') {
      return v.type === 'motorbike';
    }
    return true;
  };

  const countPersonaAll = availableVehicles.length;
  const countPersonaFamily = availableVehicles.filter(v => matchPersona(v, 'family')).length;
  const countPersonaCouple = availableVehicles.filter(v => matchPersona(v, 'couple')).length;
  const countPersonaElectric = availableVehicles.filter(v => matchPersona(v, 'electric')).length;
  const countPersonaVinhhy = availableVehicles.filter(v => matchPersona(v, 'vinhhy')).length;

  const personaOptions = [
    {
      id: 'all' as PersonaKey,
      label: 'Tất cả nhu cầu',
      shortLabel: 'Tất cả',
      desc: 'Toàn bộ đội xe DriveRent',
      icon: Layers,
      count: countPersonaAll
    },
    {
      id: 'family' as PersonaKey,
      label: 'Gia đình du lịch (4-7 chỗ)',
      shortLabel: 'Gia đình 4-7 chỗ',
      desc: 'Cốp rộng, êm ái, an toàn cao',
      icon: Users,
      count: countPersonaFamily
    },
    {
      id: 'couple' as PersonaKey,
      label: 'Cặp đôi dạo biển',
      shortLabel: 'Cặp đôi dạo biển',
      desc: 'Nhỏ gọn, check-in thời thượng',
      icon: Sparkles,
      count: countPersonaCouple
    },
    {
      id: 'electric' as PersonaKey,
      label: 'Xe điện xanh VinFast',
      shortLabel: 'Xe điện VinFast',
      desc: '0đ xăng, công nghệ hiện đại',
      icon: Zap,
      count: countPersonaElectric
    },
    {
      id: 'vinhhy' as PersonaKey,
      label: 'Xe máy phượt Vĩnh Hy',
      shortLabel: 'Phượt Vĩnh Hy',
      desc: 'Leo dốc khỏe, bền bỉ, tiết kiệm',
      icon: Bike,
      count: countPersonaVinhhy
    }
  ];

  const handleSelectPersona = (personaId: PersonaKey) => {
    if (selectedPersona === personaId && personaId !== 'all') {
      setSelectedPersona('all');
      return;
    }
    setSelectedPersona(personaId);
    if (personaId === 'family' && selectedCategory === 'motorbike') {
      setSelectedCategory('all');
    } else if (personaId === 'vinhhy' && (selectedCategory === 'car' || selectedCategory === 'electric')) {
      setSelectedCategory('all');
    } else if (personaId === 'electric' && selectedCategory === 'motorbike') {
      setSelectedCategory('all');
    }
  };

  // Danh sách xe cơ sở theo danh mục và nhu cầu đã chọn (để tính counter động cho từng khoảng giá)
  const baseCategoryVehicles = availableVehicles.filter((v) => {
    if (selectedPersona !== 'all' && !matchPersona(v, selectedPersona)) return false;
    if (selectedCategory === 'electric' && !isElectricVehicle(v)) return false;
    if (selectedCategory === 'car' && !isGasolineCar(v)) return false;
    if (selectedCategory === 'motorbike' && !isMotorbike(v)) return false;
    return true;
  });

  const countTierAll = baseCategoryVehicles.length;
  const countTierUnder500 = baseCategoryVehicles.filter((v) => getVehiclePriceTier(v) === 'under500').length;
  const countTier500to1000 = baseCategoryVehicles.filter((v) => getVehiclePriceTier(v) === '500to1000').length;
  const countTier1000to1800 = baseCategoryVehicles.filter((v) => getVehiclePriceTier(v) === '1000to1800').length;
  const countTierAbove1800 = baseCategoryVehicles.filter((v) => getVehiclePriceTier(v) === 'above1800').length;

  const priceTierOptions =
    durationTab === 'day'
      ? [
          { id: 'all' as PriceRangeKey, label: t('filter.all_prices'), tag: 'Đa dạng', count: countTierAll },
          { id: 'under500' as PriceRangeKey, label: '< 500k/ngày', tag: 'Tiết kiệm', count: countTierUnder500 },
          { id: '500to1000' as PriceRangeKey, label: '500k - 1tr', tag: 'Phổ thông', count: countTier500to1000 },
          { id: '1000to1800' as PriceRangeKey, label: '1tr - 1.8tr', tag: 'Cao cấp', count: countTier1000to1800 },
          { id: 'above1800' as PriceRangeKey, label: '> 1.8tr', tag: 'Hạng sang / 7 chỗ', count: countTierAbove1800 }
        ]
      : [
          { id: 'all' as PriceRangeKey, label: t('filter.all_prices'), tag: 'Đa dạng', count: countTierAll },
          { id: 'under500' as PriceRangeKey, label: '< 10 triệu', tag: 'Tiết kiệm', count: countTierUnder500 },
          { id: '500to1000' as PriceRangeKey, label: '10 - 20 triệu', tag: 'Phổ thông', count: countTier500to1000 },
          { id: '1000to1800' as PriceRangeKey, label: '20 - 35 triệu', tag: 'Cao cấp', count: countTier1000to1800 },
          { id: 'above1800' as PriceRangeKey, label: '> 35 triệu', tag: 'Hạng sang', count: countTierAbove1800 }
        ];

  // Filter based on selected persona, category, price tier & search term
  let displayVehicles = availableVehicles.filter((v) => {
    if (selectedPersona !== 'all' && !matchPersona(v, selectedPersona)) return false;
    if (selectedCategory === 'electric' && !isElectricVehicle(v)) return false;
    if (selectedCategory === 'car' && !isGasolineCar(v)) return false;
    if (selectedCategory === 'motorbike' && !isMotorbike(v)) return false;

    if (priceRange !== 'all') {
      if (getVehiclePriceTier(v) !== priceRange) return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = v.name.toLowerCase().includes(term);
      const matchCat = v.category.toLowerCase().includes(term);
      const matchBody = v.bodyType?.toLowerCase().includes(term);
      if (!matchName && !matchCat && !matchBody) return false;
    }

    return true;
  });

  // Số lượng bộ lọc đang kích hoạt
  const activeFilterCount =
    (selectedPersona !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (searchTerm.trim() !== '' ? 1 : 0) +
    (priceSort !== 'default' ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const handleResetFilters = () => {
    setSelectedPersona('all');
    setSelectedCategory('all');
    setPriceRange('all');
    setSearchTerm('');
    setPriceSort('default');
  };

  // Sort by price (hỗ trợ cả giá ngày và giá tháng tương ứng theo durationTab)
  if (priceSort === 'asc') {
    displayVehicles.sort((a, b) => getVehiclePrice(a).amount - getVehiclePrice(b).amount);
  } else if (priceSort === 'desc') {
    displayVehicles.sort((a, b) => getVehiclePrice(b).amount - getVehiclePrice(a).amount);
  }

  const handleApplySearch = () => {
    setCustomerSearchCriteria({
      ...customerSearchCriteria,
      startDate: fullStartIso,
      endDate: fullEndIso,
      pickupLocation: selectedCity
    });
  };

  const handleBookNowFromModal = (v: Vehicle) => {
    setSelectedVehicleForModal(null);

    const startIso = fullStartIso;
    const endIso = fullEndIso;

    const startDate = new Date(startIso);
    const endDate = new Date(endIso);
    const diffHours = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)));
    const diffDays = Math.max(1, Math.ceil(diffHours / 24));

    let pricingType: 'daily' | 'hourly' = 'daily';
    let units = diffDays;
    let rate = v.dailyPrice;
    let rentalFee = 0;

    if (durationTab === 'month') {
      const monthlyPrice = (v as any).monthlyPrice || Math.round((v.dailyPrice * 22) / 100000) * 100000;
      rate = monthlyPrice;
      units = Math.max(1, Math.ceil(diffDays / 30));
      rentalFee = rate * units;
    } else {
      rentalFee = rate * units;
    }

    const deliveryFee = 0;
    const totalEstimatedAmount = rentalFee + deliveryFee;
    const bookingDepositRequired = Math.round(totalEstimatedAmount * 0.2); // 20% online deposit
    const remainingAmountDue = totalEstimatedAmount - bookingDepositRequired;
    const securityDepositOnPickup = v.type === 'car' ? 10000000 : 3000000;

    setCustomerSearchCriteria({
      ...customerSearchCriteria,
      startDate: startIso,
      endDate: endIso,
      pickupLocation: selectedCity
    });

    createOnlineBooking({
      vehicleId: v.id,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      pickupLocation: selectedCity,
      startDate: startIso,
      endDate: endIso,
      pricingType,
      units,
      rate,
      rentalFee,
      deliveryFee,
      totalEstimatedAmount,
      bookingDepositRequired,
      bookingDepositPaid: bookingDepositRequired,
      remainingAmountDue,
      securityDepositOnPickup,
      notes: ''
    });
  };

  const handleOpenDetail = (vehicleId: string) => {
    const v = vehicles.find((x) => x.id === vehicleId);
    if (v) {
      setSelectedVehicleForModal(v);
    } else {
      setSelectedCustomerVehicleId(vehicleId);
      setCustomerTab('vehicle_detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#f8f9fb] min-h-screen pb-16 relative">
      {/* Thanh lọc dính (Sticky Filter Bar) trên Mobile / Desktop khi cuộn xuống */}
      <aside
        aria-label="Thanh lọc dính"
        className={`fixed top-[74px] sm:top-[88px] left-0 right-0 z-40 px-3 sm:px-6 transition-all duration-300 pointer-events-none ${
          isStickyFilterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="max-w-[1360px] mx-auto pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-xl border border-sky-200/90 rounded-2xl shadow-[0_10px_30px_-5px_rgba(2,132,199,0.18),0_4px_12px_rgba(0,0,0,0.06)] p-2 sm:p-2.5 flex items-center justify-between gap-2.5">
            
            {/* Trạng thái xe khả dụng với chấm Live Ping */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 shrink-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-xs" />
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                Đang có <span className="text-sky-600 font-black">{displayVehicles.length}</span> xe sẵn sàng
              </span>
            </div>

            {/* Quick persona scroll chips in sticky bar (tablet / desktop) */}
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {personaOptions.slice(1).map((p) => {
                const isActive = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersona(p.id)}
                    className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-sky-700 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <p.icon className="w-3.5 h-3.5" />
                    <span>{p.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Nút Mở rộng bộ lọc nhanh + Nút Đặt lại */}
            <div className="flex items-center gap-2 shrink-0">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                  title="Đặt lại tất cả bộ lọc"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đặt lại</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className={`min-h-[40px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                  isFilterDrawerOpen
                    ? 'bg-slate-900 text-white ring-2 ring-slate-900/20'
                    : hasActiveFilters
                    ? 'bg-sky-700 text-white shadow-sky-800/25 hover:bg-sky-800'
                    : 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isFilterDrawerOpen ? 'Thu gọn' : 'Bộ lọc nhanh'}</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-white text-sky-900 text-[11px] font-black flex items-center justify-center ml-0.5">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFilterDrawerOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>

          {/* Quick Filter Drawer / Dropdown khi bấm vào nút mở rộng trên Sticky Bar */}
          {isFilterDrawerOpen && (
            <div className="mt-2 bg-white/95 backdrop-blur-xl border border-sky-200/90 rounded-3xl shadow-2xl p-4 sm:p-5 space-y-3.5 animate-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
              {/* Header của Drawer */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-sky-600" />
                  <span>Bộ lọc nhanh đang áp dụng</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Persona selection in drawer */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Nhu cầu du lịch:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {personaOptions.map((p) => {
                    const isActive = selectedPersona === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPersona(p.id)}
                        className={`p-2 rounded-xl text-xs font-bold text-left flex items-center justify-between border cursor-pointer ${
                          isActive
                            ? 'bg-sky-700 text-white border-sky-700'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span className="truncate">{p.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price range in drawer */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700">Khoảng giá ({durationTab === 'day' ? 'ngày' : 'tháng'}):</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {priceTierOptions.map((tier) => {
                    const isActive = priceRange === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setPriceRange(tier.id)}
                        className={`p-2 rounded-xl text-xs font-bold text-left flex items-center justify-between border cursor-pointer ${
                          isActive
                            ? 'bg-sky-700 text-white border-sky-700'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span className="truncate">{tier.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Apply / Close button in drawer */}
              <div className="pt-2 flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                  >
                    Đặt lại
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-sky-700 hover:bg-sky-800 shadow-md shadow-sky-800/25 cursor-pointer text-center"
                >
                  Xem {displayVehicles.length} xe khả dụng
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 sm:space-y-8">
        
        {/* Top Booking Widget */}
        <div className="space-y-3">
          
          {/* Hàng chọn thời gian thuê */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <button
                type="button"
                onClick={() => handleDurationTabChange('day')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                  durationTab === 'day'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {t('duration.day')}
              </button>
              <button
                type="button"
                onClick={() => handleDurationTabChange('month')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                  durationTab === 'month'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {t('duration.month')}
              </button>
            </div>

            {durationTab === 'month' && (
              <div className="text-xs font-bold text-sky-800 bg-sky-50 px-3.5 py-2 rounded-2xl border border-sky-200/80 animate-in fade-in flex items-center gap-2">
                <span>🎉</span>
                <span>{t('duration.month_badge')}</span>
              </div>
            )}
          </div>

          {/* Search Card Container */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
              
              {/* Field 1: Tỉnh/Thành phố (Col span 3) */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {t('search.city')}
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-hidden appearance-none cursor-pointer pr-4"
                    >
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Nha Trang">Nha Trang</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Phú Quốc">Phú Quốc</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Field 2: Ngày nhận xe (Col span 3) */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {t('search.pickup_date')}
                </label>
                <div className="grid grid-cols-12 gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                  <div className="col-span-7 flex items-center gap-1.5">
                    <input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                    />
                  </div>
                  <div className="col-span-5 flex items-center gap-1 border-l border-slate-200 pl-2">
                    <select
                      value={startTimeStr}
                      onChange={(e) => setStartTimeStr(e.target.value)}
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                    >
                      {['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '16:00', '18:00', '20:00'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Field 3: Ngày trả xe (Col span 3) */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {t('search.return_date')}
                </label>
                <div className="grid grid-cols-12 gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                  <div className="col-span-7 flex items-center gap-1.5">
                    <input
                      type="date"
                      value={endDateStr}
                      onChange={(e) => setEndDateStr(e.target.value)}
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                    />
                  </div>
                  <div className="col-span-5 flex items-center gap-1 border-l border-slate-200 pl-2">
                    <select
                      value={endTimeStr}
                      onChange={(e) => setEndTimeStr(e.target.value)}
                      className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
                    >
                      {['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '16:00', '18:00', '20:00'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Field 4: Nút Tìm kiếm xe (Col span 3) */}
              <div className="lg:col-span-3">
                <button
                  onClick={handleApplySearch}
                  className="w-full min-h-[44px] bg-sky-700 hover:bg-sky-800 active:scale-[0.99] text-white font-bold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-sky-800/25 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('action.search_cars')}</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Bộ lọc xe thông minh theo Nhu cầu du lịch, Động cơ & Khoảng giá (Chuẩn UI/UX Pro Max & Impeccable) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-3.5 sm:p-5 space-y-4">
          
          {/* Hàng 1: Nhu cầu du lịch Nha Trang (Quick Persona Filter - Gợi ý 1-chạm) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Nhu cầu du lịch Nha Trang (Gợi ý 1-chạm)</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Chạm để lọc nhanh theo lịch trình chuyến đi của bạn
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
              {personaOptions.map((persona) => {
                const IconComponent = persona.icon;
                const isActive = selectedPersona === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => handleSelectPersona(persona.id)}
                    className={`min-h-[66px] p-2.5 sm:p-3 rounded-2xl text-left transition-all flex flex-col justify-between border cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white border-sky-600 shadow-md shadow-sky-600/25 ring-2 ring-sky-500/30'
                        : 'bg-slate-50 hover:bg-sky-50/50 text-slate-800 border-slate-200/90 hover:border-sky-300'
                    }`}
                  >
                    <div className="mb-1">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className={`text-xs font-black leading-tight line-clamp-1 ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}>
                        {persona.label}
                      </div>
                      <div className={`text-[10px] mt-0.5 leading-tight line-clamp-1 ${
                        isActive ? 'text-sky-100' : 'text-slate-500'
                      }`}>
                        {persona.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hàng 2: Loại động cơ & Dòng xe */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
                <span>Loại động cơ & Dòng xe</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Động cơ & phương tiện di chuyển
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 touch-pan-x">
              {[
                { id: 'all', label: t('category.all'), icon: Layers },
                { id: 'electric', label: t('category.electric'), icon: Zap, isElectric: true },
                { id: 'car', label: t('category.car'), icon: Fuel },
                { id: 'motorbike', label: t('category.motorbike'), icon: Bike }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedCategory(tab.id as any)}
                    className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer select-none active:scale-[0.98] ${
                      isActive
                        ? 'bg-sky-700 text-white shadow-sm shadow-sky-800/25 ring-2 ring-sky-700/20'
                        : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/90 hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${tab.isElectric && isActive ? 'text-amber-300' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hàng 3: Bộ lọc Khoảng giá nhanh (Price Tier Chips bo tròn kèm tag trực quan) */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <CircleDollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Khoảng giá ({durationTab === 'day' ? 'theo ngày' : 'gói tháng'})</span>
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Giá minh bạch, 0đ phụ phí ẩn
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 touch-pan-x">
              {priceTierOptions.map((tier) => {
                const isActive = priceRange === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="button"
                    aria-pressed={isActive}
                    onClick={() => setPriceRange(tier.id)}
                    className={`min-h-[46px] px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer select-none active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-700 to-sky-600 text-white shadow-md shadow-sky-800/25 ring-2 ring-sky-700/20'
                        : 'bg-slate-50 hover:bg-white text-slate-700 hover:text-sky-900 border border-slate-200/90 hover:border-sky-300'
                    }`}
                  >
                    <span>{tier.label}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-sky-100/70 text-sky-800'
                      }`}
                    >
                      {tier.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hàng 4: Tìm kiếm nhanh & Sắp xếp giá */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
            {/* Input tìm kiếm */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('filter.search_placeholder', 'Tìm xe VF 3, VF 5, Vios, Vision...')}
                className="w-full min-h-[44px] pl-10 pr-9 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden transition-all text-slate-900 placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label={t('filter.clear_search', 'Xóa tìm kiếm')}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown sắp xếp giá */}
            <div className="sm:w-56 shrink-0">
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
                aria-label={t('filter.sort_price')}
                className="w-full min-h-[44px] text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 focus:bg-white focus:border-sky-500 focus:outline-hidden cursor-pointer transition-all"
              >
                <option value="default">{t('filter.sort_price')}</option>
                <option value="asc">{t('filter.sort_asc')}</option>
                <option value="desc">{t('filter.sort_desc')}</option>
              </select>
            </div>
          </div>

          {/* Hàng 5: Báo cáo trạng thái bộ lọc đang bật & Nút Đặt lại nhanh */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-600 font-medium">
              <span className="font-bold text-slate-700">{t('filter.active_filters', 'Đang lọc:')}</span>
              
              {/* Badge nhu cầu du lịch (Persona) */}
              {selectedPersona !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-bold">
                  {selectedPersona === 'family' && <Users className="w-3 h-3 text-sky-600" />}
                  {selectedPersona === 'couple' && <Sparkles className="w-3 h-3 text-sky-600" />}
                  {selectedPersona === 'electric' && <Zap className="w-3 h-3 text-sky-600" />}
                  {selectedPersona === 'vinhhy' && <Bike className="w-3 h-3 text-sky-600" />}
                  <span>{personaOptions.find(p => p.id === selectedPersona)?.shortLabel}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPersona('all')}
                    className="hover:text-sky-900 ml-0.5 cursor-pointer"
                    aria-label="Xóa bộ lọc nhu cầu"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Badge danh mục */}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
                  {selectedCategory === 'electric' && <Zap className="w-3 h-3 text-sky-600" />}
                  {selectedCategory === 'car' && <Fuel className="w-3 h-3 text-sky-600" />}
                  {selectedCategory === 'motorbike' && <Bike className="w-3 h-3 text-sky-600" />}
                  <span>{selectedCategory === 'electric' ? t('category.electric') : selectedCategory === 'car' ? t('category.car') : t('category.motorbike')}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-sky-900 ml-0.5 cursor-pointer"
                    aria-label="Xóa bộ lọc danh mục"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Badge khoảng giá */}
              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  <span>{priceTierOptions.find(t => t.id === priceRange)?.label}</span>
                  <button
                    type="button"
                    onClick={() => setPriceRange('all')}
                    className="hover:text-emerald-900 ml-0.5 cursor-pointer"
                    aria-label="Xóa bộ lọc khoảng giá"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Badge từ khóa */}
              {searchTerm.trim() !== '' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                  <span>"{searchTerm}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="hover:text-amber-900 ml-0.5 cursor-pointer"
                    aria-label="Xóa bộ lọc từ khóa"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {/* Badge sắp xếp */}
              {priceSort !== 'default' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  <span>{priceSort === 'asc' ? t('filter.sort_asc') : t('filter.sort_desc')}</span>
                  <button
                    type="button"
                    onClick={() => setPriceSort('default')}
                    className="hover:text-indigo-900 ml-0.5 cursor-pointer"
                    aria-label="Xóa bộ lọc sắp xếp"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {!hasActiveFilters && (
                <span className="text-slate-600 font-medium">Mặc định (Tất cả xe)</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                {displayVehicles.length} {t('filter.vehicles_found', 'xe phù hợp')}
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('filter.reset_all', 'Đặt lại')}</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Empty state nếu không có xe khả dụng */}
        {displayVehicles.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm space-y-4 max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 shadow-2xs">
              <SearchX className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl text-slate-900 tracking-tight">
                {t('specs.empty_title', 'Không tìm thấy xe phù hợp tiêu chí')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                {t(
                  'specs.empty_desc',
                  'Không có xe nào khớp với từ khóa tìm kiếm hoặc danh mục đã chọn. Thử đổi tiêu chí tìm kiếm hoặc xem lại tất cả danh mục xe đang sẵn sàng.'
                )}
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="min-h-[44px] px-6 py-3 bg-sky-700 hover:bg-sky-800 active:scale-[0.98] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-sky-800/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('specs.show_all', 'Đặt lại bộ lọc & Xem tất cả xe')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Danh sách xe khả dụng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {displayVehicles.map((v) => {
            const priceInfo = getVehiclePrice(v);
            const transV = translateVehicle(v);

            return (
              <div
                key={v.id}
                onClick={() => setSelectedVehicleForModal(v)}
                className="bg-white rounded-3xl border border-sky-100 hover:border-sky-300 shadow-[0_4px_20px_rgba(2,132,199,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(2,132,199,0.2)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer relative min-w-0"
              >
                <div className="min-w-0">
                  {/* Photo area with skeleton loader & error fallback */}
                  <div
                    onClick={() => setSelectedVehicleForModal(v)}
                    className="relative h-56 sm:h-60 bg-gradient-to-b from-sky-50/50 via-slate-50/80 to-slate-50 overflow-hidden flex items-center justify-center p-4 cursor-pointer"
                  >
                    {/* Top Left Badge: Sẵn sàng giao ngay trong 15p (Emerald) */}
                    <div className="absolute top-3 left-3 z-10 max-w-[55%] truncate">
                      <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black bg-emerald-600 text-white shadow-md shadow-emerald-600/25 flex items-center gap-1.5 backdrop-blur-xs">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                        </span>
                        <span className="truncate">Giao ngay 15p</span>
                      </span>
                    </div>

                    {/* Top Right Badge: Bảo hiểm thân vỏ 100% (Sky-600) */}
                    <div className="absolute top-3 right-3 z-10 max-w-[45%] truncate">
                      <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/95 text-sky-700 border border-sky-200/90 shadow-2xs backdrop-blur-xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">Bảo hiểm 100%</span>
                      </span>
                    </div>

                    {/* Car Image with Skeleton & fallback */}
                    <VehicleImageWithSkeleton
                      src={v.image}
                      alt={v.name}
                      type={v.type}
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.14)] group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge if month duration */}
                    {priceInfo.discountBadge && (
                      <div className="absolute bottom-2 left-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-xs">
                          <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                          <span>{priceInfo.discountBadge}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Name & Category */}
                  <div className="px-5 pt-4 pb-1">
                    <div className="min-w-0">
                      <h3
                        onClick={() => setSelectedVehicleForModal(v)}
                        title={v.name}
                        className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors truncate block cursor-pointer"
                      >
                        {v.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-semibold block mt-0.5 truncate">
                        {transV.category || (v.type === 'motorbike' ? 'Xe máy du lịch' : 'Ô tô du lịch tự lái')}
                      </span>
                    </div>
                  </div>

                  {/* Tái cấu trúc thông số xe dạng lưới 4 icon nhỏ gọn sắc nét */}
                  <div className="px-5 py-2">
                    <div className="bg-slate-50/90 rounded-2xl p-2.5 sm:p-3 border border-slate-200/70 grid grid-cols-2 gap-2 text-xs text-slate-700">
                      
                      {/* Metric 1: Số chỗ ngồi */}
                      <div className="flex items-center gap-2 min-w-0" title={`Số chỗ ngồi: ${v.seats || 5} chỗ`}>
                        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate font-bold text-slate-800 text-[11px] sm:text-xs">
                          {v.type === 'motorbike' ? '2 chỗ' : `${v.seats || 5} chỗ ngồi`}
                        </span>
                      </div>

                      {/* Metric 2: Hộp số tự động / Số sàn */}
                      <div className="flex items-center gap-2 min-w-0" title={`Hộp số: ${transV.transmission || 'Tự động'}`}>
                        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                          <Gauge className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate font-bold text-slate-800 text-[11px] sm:text-xs">
                          {transV.transmission || 'Tự động'}
                        </span>
                      </div>

                      {/* Metric 3: Nhiên liệu / Quãng đường pin */}
                      <div className="flex items-center gap-2 min-w-0" title={`Nhiên liệu / Pin: ${transV.range}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                          isElectricVehicle(v) ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-sky-50 text-sky-700 border-sky-100'
                        }`}>
                          {isElectricVehicle(v) ? <Zap className="w-3.5 h-3.5" /> : <Fuel className="w-3.5 h-3.5" />}
                        </div>
                        <span className="truncate font-bold text-slate-800 text-[11px] sm:text-xs">
                          {transV.range || (isElectricVehicle(v) ? 'Xe điện xanh' : 'Xăng tiết kiệm')}
                        </span>
                      </div>

                      {/* Metric 4: Năm sản xuất */}
                      <div className="flex items-center gap-2 min-w-0" title={`Năm sản xuất: ${v.year || 2024}`}>
                        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate font-bold text-slate-800 text-[11px] sm:text-xs">
                          Đời xe {v.year || 2024}
                        </span>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Khu vực giá & nút bấm: Tách biệt 2 nút chuẩn ngón tay cái */}
                <div className="p-5 pt-2 border-t border-slate-100 mt-2 space-y-3">
                  
                  {/* Hiển thị giá to rõ & Cam kết 0đ phụ phí ẩn */}
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block leading-tight">
                        Giá thuê niêm yết
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                          {priceInfo.formatted}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-sky-700">
                          {priceInfo.unit}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>0đ phụ phí ẩn</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Cam kết minh bạch</span>
                    </div>
                  </div>

                  {/* 2 nút bấm chuẩn ngón tay cái (Touch target >= 44px) */}
                  <div className="flex items-center gap-2.5">
                    {/* Nút 1: Chi tiết (viền mỏng) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVehicleForModal(v);
                      }}
                      className="min-h-[46px] px-4 py-2.5 rounded-2xl border border-sky-200 text-sky-800 hover:text-sky-950 hover:bg-sky-50/80 hover:border-sky-300 active:scale-95 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Info className="w-4 h-4 text-sky-600" />
                      <span>Chi tiết</span>
                    </button>

                    {/* Nút 2: Đặt giữ xe (Gradient xanh biển nổi bật) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNowFromModal(v);
                      }}
                      className="flex-1 min-h-[46px] px-4 py-2.5 bg-gradient-to-r from-sky-600 via-sky-700 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 active:scale-[0.98] text-white font-black rounded-2xl shadow-md shadow-sky-600/25 hover:shadow-lg hover:shadow-sky-600/35 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer group/btn"
                    >
                      <span>Đặt giữ xe</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Mioto-style Vehicle Detail Popup */}
      <VehicleDetailModal
        vehicle={selectedVehicleForModal}
        durationTab={durationTab}
        isOpen={Boolean(selectedVehicleForModal)}
        onClose={() => setSelectedVehicleForModal(null)}
        onBookNow={handleBookNowFromModal}
      />
    </div>
  );
};

