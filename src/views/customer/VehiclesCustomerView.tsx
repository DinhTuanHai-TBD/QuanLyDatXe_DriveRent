import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle, VehicleType } from '../../types';
import {
  Car,
  Bike,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  Gauge,
  Fuel,
  Users,
  Sparkles,
  X
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

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>(customerSearchCriteria.vehicleType || 'all');
  const [startDate, setStartDate] = useState(customerSearchCriteria.startDate);
  const [endDate, setEndDate] = useState(customerSearchCriteria.endDate);
  const [transmissionFilter, setTransmissionFilter] = useState('all');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'default'>('default');
  const [seatsFilter, setSeatsFilter] = useState('all');

  const hasSelectedDates = Boolean(startDate && endDate);

  // Apply filters
  let filteredVehicles = vehicles.filter((v) => {
    // Type
    if (selectedType !== 'all' && v.type !== selectedType) return false;

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = v.name.toLowerCase().includes(term);
      const matchCat = v.category.toLowerCase().includes(term);
      if (!matchName && !matchCat) return false;
    }

    // Transmission
    if (transmissionFilter !== 'all') {
      if (transmissionFilter === 'auto' && !v.transmission.includes('Tự động')) return false;
      if (transmissionFilter === 'manual' && !v.transmission.includes('Số sàn') && !v.transmission.includes('số tròn')) return false;
    }

    // Seats filter
    if (seatsFilter !== 'all') {
      if (seatsFilter === '7' && !v.category.includes('7 chỗ')) return false;
      if (seatsFilter === '5' && !v.category.includes('5 chỗ')) return false;
      if (seatsFilter === '2' && v.type !== 'motorbike') return false;
    }

    return true;
  });

  // Sort
  if (priceSort === 'asc') {
    filteredVehicles.sort((a, b) => a.dailyPrice - b.dailyPrice);
  } else if (priceSort === 'desc') {
    filteredVehicles.sort((a, b) => b.dailyPrice - a.dailyPrice);
  }

  const handleApplyDates = () => {
    setCustomerSearchCriteria({
      ...customerSearchCriteria,
      startDate,
      endDate,
      vehicleType: selectedType
    });
  };

  const handleOpenDetail = (vehicleId: string) => {
    setSelectedCustomerVehicleId(vehicleId);
    setCustomerTab('vehicle_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 backdrop-blur-md mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">Đội xe chất lượng cao Nha Trang</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Danh sách xe cho thuê tại Nha Trang
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lựa chọn xe máy và ô tô tự lái phù hợp, kiểm tra lịch trống và thanh toán cọc giữ chỗ 20% online
        </p>
      </div>

      {/* Date & Location Bar (Interactive timeline check) - Liquid Glass */}
      <div className="bg-white/75 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Khoảng thời gian thuê dự kiến</span>
          </span>
          {hasSelectedDates ? (
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
              Đang áp dụng kiểm tra lịch trống
            </span>
          ) : (
            <span className="text-[11px] text-amber-700 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 backdrop-blur-md">
              Vui lòng chọn ngày để kiểm tra xe trống
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1.5">Thời gian nhận xe:</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1.5">Thời gian trả xe:</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1.5">Địa điểm nhận xe:</label>
            <select
              value={customerSearchCriteria.pickupLocation}
              onChange={(e) =>
                setCustomerSearchCriteria({
                  ...customerSearchCriteria,
                  pickupLocation: e.target.value
                })
              }
              className="w-full px-3.5 py-2.5 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
            >
              <option value="Văn phòng DriveRent (25 Lê Lợi, TP. Nha Trang)">Văn phòng 25 Lê Lợi, TP. Nha Trang</option>
              <option value="Sân bay Quốc tế Cam Ranh">Sân bay Quốc tế Cam Ranh</option>
              <option value="Ga đường sắt Nha Trang">Ga đường sắt Nha Trang</option>
              <option value="Khách sạn nội thành Nha Trang">Khách sạn nội thành Nha Trang (Đường Trần Phú / Hùng Vương)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApplyDates}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              Cập nhật lịch kiểm tra
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search controls - Liquid Glass */}
      <div className="bg-white/75 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Type tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 backdrop-blur-md rounded-xl border border-slate-200/50">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'bg-white text-emerald-700 shadow-2xs border border-white/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({vehicles.length})
          </button>
          <button
            onClick={() => setSelectedType('car')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedType === 'car'
                ? 'bg-white text-emerald-700 shadow-2xs border border-white/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ô tô tự lái ({vehicles.filter((v) => v.type === 'car').length})
          </button>
          <button
            onClick={() => setSelectedType('motorbike')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedType === 'motorbike'
                ? 'bg-white text-emerald-700 shadow-2xs border border-white/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Xe máy ({vehicles.filter((v) => v.type === 'motorbike').length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-56 flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên xe (VD: Vios, Xpander...)"
            className="w-full pl-9 pr-3.5 py-2 bg-white/70 border border-slate-200/80 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all shadow-2xs"
          />
        </div>

        {/* Transmission & Seats */}
        <div className="flex items-center gap-2">
          <select
            value={transmissionFilter}
            onChange={(e) => setTransmissionFilter(e.target.value)}
            className="px-3 py-2 bg-white/70 border border-slate-200/80 rounded-xl text-slate-700 font-semibold text-xs shadow-2xs"
          >
            <option value="all">Hộp số: Tất cả</option>
            <option value="auto">Tự động</option>
            <option value="manual">Số sàn</option>
          </select>

          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="px-3 py-2 bg-white/70 border border-slate-200/80 rounded-xl text-slate-700 font-semibold text-xs shadow-2xs"
          >
            <option value="default">Sắp xếp giá</option>
            <option value="asc">Giá thấp đến cao</option>
            <option value="desc">Giá cao đến thấp</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-12 text-center border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-3">
          <Car className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">Không tìm thấy xe phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Vui lòng thử điều chỉnh lại bộ lọc tìm kiếm hoặc xem lại tiêu chí chọn xe.
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSearchTerm('');
              setTransmissionFilter('all');
              setSeatsFilter('all');
            }}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Vehicle Cards Grid - Liquid Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredVehicles.map((v) => {
          // Check availability only if dates are selected
          let isAvailable = true;
          let conflictMsg = '';

          if (hasSelectedDates) {
            const res = checkVehicleAvailability(v.id, startDate, endDate);
            isAvailable = res.available;
            conflictMsg = res.conflictReason || '';
          }

          return (
            <div
              key={v.id}
              className={`group bg-white/75 hover:bg-white/95 backdrop-blur-2xl rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:-translate-y-1 ${
                !isAvailable
                  ? 'border-slate-200/80 opacity-80'
                  : 'border-white/80 hover:border-emerald-500/30'
              }`}
            >
              <div>
                {/* Photo with Availability Badge */}
                <div className="relative aspect-4/3 bg-gradient-to-b from-slate-100/40 via-slate-100/70 to-slate-200/50 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={v.image}
                    alt={v.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top Availability status badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {!hasSelectedDates ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-sm">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Chọn ngày kiểm tra</span>
                      </span>
                    ) : isAvailable ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-md border border-emerald-400/30 shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                        <span>Còn trống</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600/90 text-white backdrop-blur-md border border-rose-400/30 shadow-sm flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-200" />
                        <span>Đã có khách đặt</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/85 text-slate-800 backdrop-blur-md border border-white/80 shadow-2xs">
                      {v.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      {v.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {v.transmission} · Năm {v.year} · Màu {v.color}
                    </p>
                  </div>

                  {/* Quick specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-100/60 p-2.5 rounded-xl border border-slate-200/50 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-[11px] font-semibold">{v.currentOdometer.toLocaleString('vi-VN')} km</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-semibold">{v.fuelLevel}/8 vạch</span>
                    </div>
                  </div>

                  {/* Pickup Location notice */}
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{customerSearchCriteria.pickupLocation}</span>
                  </p>

                  {!isAvailable && (
                    <div className="p-2.5 bg-rose-50/80 border border-rose-200/80 rounded-xl text-[10px] text-rose-700 leading-tight">
                      Xe hiện bận theo lịch đã chọn. Bạn vẫn có thể xem chi tiết hoặc đổi sang giờ khác.
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Buttons */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-1 space-y-3">
                <div className="flex items-baseline justify-between pt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Giá thuê ngày</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {formatVND(v.dailyPrice)}
                    </span>
                    <span className="text-[11px] text-slate-400">/ngày</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Thuê giờ</span>
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      {formatVND(v.hourlyPrice)}/h
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleOpenDetail(v.id)}
                    className="py-2.5 px-2 text-xs font-bold text-slate-700 bg-white/80 hover:bg-white border border-slate-200/80 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Chi tiết</span>
                  </button>

                  {isAvailable ? (
                    <button
                      onClick={() => handleOpenDetail(v.id)}
                      className="py-2.5 px-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl text-center shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Đặt xe ngay</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenDetail(v.id)}
                      className="py-2.5 px-2 text-xs font-bold text-slate-400 bg-slate-100/80 rounded-xl text-center cursor-not-allowed"
                      title="Xe không khả dụng trong khoảng thời gian này"
                    >
                      Bận giờ này
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
