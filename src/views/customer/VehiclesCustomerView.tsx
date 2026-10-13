import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  Zap,
  Users,
  Box,
  Building2,
  ChevronDown,
  Sparkles,
  Fuel,
  ShieldCheck
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export const VehiclesCustomerView: React.FC = () => {
  const {
    vehicles,
    setCustomerTab,
    setSelectedCustomerVehicleId,
    customerSearchCriteria,
    setCustomerSearchCriteria,
    checkVehicleAvailability
  } = useApp();

  // Rental duration tabs: 'day' | 'month' | 'year'
  const [durationTab, setDurationTab] = useState<'day' | 'month' | 'year'>('day');

  // Search form fields matching Green Future
  const [selectedCity, setSelectedCity] = useState(customerSearchCriteria.pickupLocation.includes('Hà Nội') ? 'Hà Nội' : 'Hà Nội');
  const [startDateStr, setStartDateStr] = useState('2026-10-14');
  const [startTimeStr, setStartTimeStr] = useState('08:00');
  const [endDateStr, setEndDateStr] = useState('2026-10-15');
  const [endTimeStr, setEndTimeStr] = useState('08:00');

  // Vehicle filters
  const [fuelFilter, setFuelFilter] = useState<'all' | 'electric' | 'gasoline' | 'motorbike'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');

  const fullStartIso = `${startDateStr}T${startTimeStr}:00`;
  const fullEndIso = `${endDateStr}T${endTimeStr}:00`;

  // Filter logic
  let filteredVehicles = vehicles.filter((v) => {
    // Fuel / category filter
    if (fuelFilter === 'electric' && (v.fuelType !== 'electric' || v.type !== 'car')) return false;
    if (fuelFilter === 'gasoline' && (v.fuelType !== 'gasoline' || v.type !== 'car')) return false;
    if (fuelFilter === 'motorbike' && v.type !== 'motorbike') return false;

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = v.name.toLowerCase().includes(term);
      const matchCat = v.category.toLowerCase().includes(term);
      const matchBody = v.bodyType?.toLowerCase().includes(term);
      if (!matchName && !matchCat && !matchBody) return false;
    }

    return true;
  });

  // Sort
  if (priceSort === 'asc') {
    filteredVehicles.sort((a, b) => a.dailyPrice - b.dailyPrice);
  } else if (priceSort === 'desc') {
    filteredVehicles.sort((a, b) => b.dailyPrice - a.dailyPrice);
  }

  const handleApplySearch = () => {
    setCustomerSearchCriteria({
      ...customerSearchCriteria,
      startDate: fullStartIso,
      endDate: fullEndIso,
      pickupLocation: selectedCity
    });
  };

  const handleOpenDetail = (vehicleId: string) => {
    setSelectedCustomerVehicleId(vehicleId);
    setCustomerTab('vehicle_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f8f9fb] min-h-screen pb-16">
      {/* Main Container */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 sm:space-y-8">
        
        {/* Top Booking Widget (Exact layout to Green Future thue-xe-tu-lai) */}
        <div className="space-y-3">
          {/* Tabs: Thuê ngày / Thuê tháng / Thuê năm */}
          <div className="flex items-end gap-3 sm:gap-4 pl-1">
            <button
              onClick={() => setDurationTab('day')}
              className={`px-6 py-2.5 rounded-2xl sm:rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                durationTab === 'day'
                  ? 'bg-[#00c26f] text-white shadow-md shadow-[#00c26f]/25'
                  : 'bg-transparent text-slate-800 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              Thuê ngày
            </button>

            {/* Thuê tháng with badge */}
            <div className="relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 whitespace-nowrap shadow-2xs">
                Đặc quyền
              </span>
              <button
                onClick={() => setDurationTab('month')}
                className={`px-6 py-2.5 rounded-2xl sm:rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                  durationTab === 'month'
                    ? 'bg-[#00c26f] text-white shadow-md shadow-[#00c26f]/25'
                    : 'bg-transparent text-slate-800 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                Thuê tháng
              </button>
            </div>

            {/* Thuê năm with badge */}
            <div className="relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 whitespace-nowrap shadow-2xs">
                Đặc quyền
              </span>
              <button
                onClick={() => setDurationTab('year')}
                className={`px-6 py-2.5 rounded-2xl sm:rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                  durationTab === 'year'
                    ? 'bg-[#00c26f] text-white shadow-md shadow-[#00c26f]/25'
                    : 'bg-transparent text-slate-800 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                Thuê năm
              </button>
            </div>
          </div>

          {/* Search Card Container */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
              
              {/* Field 1: Tỉnh/Thành phố (Col span 3) */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Tỉnh/Thành phố
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl focus-within:border-[#00c26f] focus-within:ring-2 focus-within:ring-[#00c26f]/20 transition-all">
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
                  Ngày nhận xe
                </label>
                <div className="grid grid-cols-12 gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 focus-within:border-[#00c26f] focus-within:ring-2 focus-within:ring-[#00c26f]/20 transition-all">
                  <div className="col-span-7 flex items-center gap-1.5">
                    <input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
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
                  Ngày trả xe
                </label>
                <div className="grid grid-cols-12 gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 focus-within:border-[#00c26f] focus-within:ring-2 focus-within:ring-[#00c26f]/20 transition-all">
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
                  className="w-full h-[42px] bg-[#00c26f] hover:bg-[#00a85d] active:scale-[0.99] text-white font-bold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-[#00c26f]/25 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Tìm kiếm xe</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Secondary Category Filters & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-100 shadow-2xs">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `Tất cả (${vehicles.length})` },
              { id: 'electric', label: `Xe điện VinFast (${vehicles.filter(v => v.fuelType === 'electric').length})` },
              { id: 'gasoline', label: `Ô tô xăng (${vehicles.filter(v => v.fuelType === 'gasoline' && v.type === 'car').length})` },
              { id: 'motorbike', label: `Xe máy (${vehicles.filter(v => v.type === 'motorbike').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFuelFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  fuelFilter === tab.id
                    ? 'bg-[#00c26f] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick search & Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm VF 3, VF 5, Vios..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00c26f] focus:outline-hidden"
              />
            </div>

            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="default">Sắp xếp giá</option>
              <option value="asc">Giá thấp đến cao</option>
              <option value="desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {filteredVehicles.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-slate-800">Không tìm thấy dòng xe phù hợp</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Vui lòng thử chọn bộ lọc khác hoặc đặt lại tiêu chí tìm kiếm.
            </p>
            <button
              onClick={() => {
                setFuelFilter('all');
                setSearchTerm('');
                setPriceSort('default');
              }}
              className="px-5 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Xem tất cả xe
            </button>
          </div>
        )}

        {/* Vehicles Grid (Exact 3-columns layout matching Green Future) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredVehicles.map((v) => {
            const avail = checkVehicleAvailability(v.id, fullStartIso, fullEndIso);
            const isAvailable = avail.available;

            // Formatted price
            const priceFormatted = v.dailyPrice.toLocaleString('vi-VN');

            return (
              <div
                key={v.id}
                onClick={() => handleOpenDetail(v.id)}
                className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer relative"
              >
                <div>
                  {/* Photo area with badges */}
                  <div className="relative h-56 sm:h-60 bg-slate-50/70 overflow-hidden flex items-center justify-center p-3">
                    {/* Top Left Badge: Miễn phí sạc */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/70 flex items-center gap-1 shadow-2xs backdrop-blur-xs">
                        <Zap className="w-3 h-3 text-emerald-500" />
                        <span>{v.badge || 'Miễn phí sạc'}</span>
                      </span>
                    </div>

                    {/* Top Right Badge: Còn xe / Hết xe */}
                    <div className="absolute top-3 right-3 z-10">
                      {isAvailable ? (
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/70 shadow-2xs backdrop-blur-xs">
                          Còn xe
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-rose-50 text-rose-500 border border-rose-100/70 shadow-2xs backdrop-blur-xs">
                          Hết xe
                        </span>
                      )}
                    </div>

                    {/* Car Image */}
                    <img
                      src={v.image}
                      alt={v.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Floating Price Pill (Matching exact Green Future UI overlapping image) */}
                  <div className="relative z-10 flex justify-center -mt-5 mb-2 px-4">
                    <div className="bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 rounded-md px-4 py-1.5 flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">Chỉ từ</span>
                      <span className="text-xl sm:text-2xl font-black text-[#00c26f] tracking-tight">
                        {priceFormatted}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">VNĐ/Ngày</span>
                    </div>
                  </div>

                  {/* Vehicle Name */}
                  <h3 className="text-xl font-bold text-slate-800 text-center px-4 mt-3 mb-4 group-hover:text-[#00c26f] transition-colors truncate">
                    {v.name}
                  </h3>

                  {/* 2x2 Specifications Grid */}
                  <div className="border-t border-slate-100 pt-3.5 px-6 pb-4 grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs text-slate-600">
                    {/* Row 1 Left: Body type */}
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{v.bodyType || v.category}</span>
                    </div>

                    {/* Row 1 Right: Range / Fuel */}
                    <div className="flex items-center gap-2">
                      {v.fuelType === 'electric' ? (
                        <Zap className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <Fuel className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{v.range || '5.8L/100km'}</span>
                    </div>

                    {/* Row 2 Left: Seats */}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{v.seats ? `${v.seats} chỗ` : '5 chỗ'}</span>
                    </div>

                    {/* Row 2 Right: Trunk capacity */}
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{v.luggage || 'Dung tích cốp 285L'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="px-5 pb-5 pt-1">
                  {isAvailable ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(v.id);
                      }}
                      className="w-full bg-[#00c26f] hover:bg-[#00a85d] active:scale-[0.99] text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Thuê ngay</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(v.id);
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Xem chi tiết (Đang bận lịch)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
