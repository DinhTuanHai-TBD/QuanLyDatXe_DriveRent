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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Danh sách xe cho thuê tại Nha Trang
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lựa chọn xe máy và ô tô tự lái phù hợp, kiểm tra lịch trống và thanh toán cọc giữ chỗ 20% online
        </p>
      </div>

      {/* Date & Location Bar (Interactive timeline check) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Khoảng thời gian thuê dự kiến</span>
          </span>
          {hasSelectedDates ? (
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Đang áp dụng kiểm tra lịch trống
            </span>
          ) : (
            <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Vui lòng chọn ngày để kiểm tra xe trống
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Thời gian nhận xe:</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Thời gian trả xe:</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Địa điểm nhận xe:</label>
            <select
              value={customerSearchCriteria.pickupLocation}
              onChange={(e) =>
                setCustomerSearchCriteria({
                  ...customerSearchCriteria,
                  pickupLocation: e.target.value
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
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
              className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors cursor-pointer"
            >
              Cập nhật lịch kiểm tra
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Type tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              selectedType === 'all'
                ? 'bg-white text-sky-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({vehicles.length})
          </button>
          <button
            onClick={() => setSelectedType('car')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              selectedType === 'car'
                ? 'bg-white text-sky-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ô tô tự lái ({vehicles.filter((v) => v.type === 'car').length})
          </button>
          <button
            onClick={() => setSelectedType('motorbike')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              selectedType === 'motorbike'
                ? 'bg-white text-sky-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Xe máy ({vehicles.filter((v) => v.type === 'motorbike').length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-56 flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên xe (VD: Vios, Xpander...)"
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        {/* Transmission & Seats */}
        <div className="flex items-center gap-2">
          <select
            value={transmissionFilter}
            onChange={(e) => setTransmissionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
          >
            <option value="all">Hộp số: Tất cả</option>
            <option value="auto">Tự động</option>
            <option value="manual">Số sàn</option>
          </select>

          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
          >
            <option value="default">Sắp xếp giá</option>
            <option value="asc">Giá thấp đến cao</option>
            <option value="desc">Giá cao đến thấp</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
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
            className="px-4 py-2 bg-sky-50 text-sky-700 rounded-lg text-xs font-bold hover:bg-sky-100 transition-colors cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
                !isAvailable
                  ? 'border-slate-300 opacity-80'
                  : 'border-slate-200 hover:border-sky-300'
              }`}
            >
              <div>
                {/* Photo with Availability Badge */}
                <div className="relative aspect-4/3 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-200/40 overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={v.image}
                    alt={v.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top Availability status badge (Requirement!) */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    {!hasSelectedDates ? (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Chọn thời gian để kiểm tra</span>
                      </span>
                    ) : isAvailable ? (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Còn trống trong thời gian đã chọn</span>
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Đã có khách đặt thời gian này</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs">
                      {v.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 truncate">{v.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {v.transmission} · Năm {v.year} · Màu {v.color}
                    </p>
                  </div>

                  {/* Quick specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded-lg text-slate-600">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{v.currentOdometer.toLocaleString('vi-VN')} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span>{v.fuelLevel}/8 vạch</span>
                    </div>
                  </div>

                  {/* Pickup Location notice */}
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{customerSearchCriteria.pickupLocation}</span>
                  </p>

                  {!isAvailable && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[10px] text-rose-700 leading-tight">
                      Xe hiện bận theo lịch đã chọn. Bạn vẫn có thể xem chi tiết hoặc đổi sang giờ khác.
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Buttons */}
              <div className="p-4 pt-0 border-t border-slate-100 mt-2 space-y-3">
                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Giá thuê ngày</span>
                    <span className="text-sm font-extrabold text-sky-700 font-mono">
                      {formatVND(v.dailyPrice)}
                    </span>
                    <span className="text-[11px] text-slate-400">/ngày (24h)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Thuê giờ</span>
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      {formatVND(v.hourlyPrice)}/h
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenDetail(v.id)}
                    className="py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem chi tiết</span>
                  </button>

                  {isAvailable ? (
                    <button
                      onClick={() => handleOpenDetail(v.id)}
                      className="py-2 px-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl text-center shadow-sm shadow-orange-500/20 transition-all cursor-pointer"
                    >
                      Đặt xe này
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenDetail(v.id)}
                      className="py-2 px-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl text-center cursor-not-allowed"
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
