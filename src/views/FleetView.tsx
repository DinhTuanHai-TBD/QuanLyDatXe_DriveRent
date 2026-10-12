import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle, VehicleType, VehicleStatus } from '../types';
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  Plus,
  Car,
  Bike,
  Gauge,
  Fuel,
  Calendar,
  Wrench,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';
import {
  formatVND,
  formatDate,
  formatDateTime,
  getVehicleStatusBadge,
  getContractStatusBadge
} from '../utils/formatters';

export const FleetView: React.FC = () => {
  const {
    vehicles,
    contracts,
    maintenanceTasks,
    setIsAddVehicleOpen,
    selectedVehicleId,
    setSelectedVehicleId,
    setIsCreateContractOpen,
    checkVehicleAvailability
  } = useApp();

  // Display mode
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'car' | 'motorbike'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | VehicleStatus>('all');

  // Availability Period Filter
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    // Search
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      const matchName = v.name.toLowerCase().includes(term);
      const matchPlate = v.plateNumber.toLowerCase().includes(term);
      const matchCategory = v.category.toLowerCase().includes(term);
      if (!matchName && !matchPlate && !matchCategory) return false;
    }

    // Type
    if (typeFilter !== 'all' && v.type !== typeFilter) return false;

    // Status
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;

    // Date Availability Filter
    if (filterStartDate && filterEndDate) {
      const res = checkVehicleAvailability(v.id, filterStartDate, filterEndDate);
      if (!res.available) return false;
    }

    return true;
  });

  // Selected vehicle for details modal
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const vehicleContracts = contracts.filter((c) => c.vehicleId === selectedVehicleId);
  const vehicleMaintenance = maintenanceTasks.filter((m) => m.vehicleId === selectedVehicleId);

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý đội xe</h2>
          <p className="text-sm text-slate-500">
            Theo dõi hiện trạng, lịch sử lăn bánh và bảo dưỡng xe máy & ô tô tự lái
          </p>
        </div>

        <button
          onClick={() => setIsAddVehicleOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm xe mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo biển số hoặc tên xe (ví dụ: Vios, Vision, 79A-...)"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({vehicles.length})
            </button>
            <button
              onClick={() => setTypeFilter('car')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'car'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ô tô ({vehicles.filter((v) => v.type === 'car').length})
            </button>
            <button
              onClick={() => setTypeFilter('motorbike')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                typeFilter === 'motorbike'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Xe máy ({vehicles.filter((v) => v.type === 'motorbike').length})
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shrink-0 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Sẵn sàng ({vehicles.filter((v) => v.status === 'available').length})</option>
            <option value="rented">Đang cho thuê ({vehicles.filter((v) => v.status === 'rented').length})</option>
            <option value="maintenance">Đang bảo dưỡng ({vehicles.filter((v) => v.status === 'maintenance').length})</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Dạng thẻ trực quan"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Dạng bảng dữ liệu"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date Availability Filter Section */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            Lọc xe khả dụng theo khoảng thời gian:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
            />
            <span>đến</span>
            <input
              type="datetime-local"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
            />
            {(filterStartDate || filterEndDate) && (
              <button
                onClick={() => {
                  setFilterStartDate('');
                  setFilterEndDate('');
                }}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Xóa lọc lịch
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Car className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy xe phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Vui lòng thử điều chỉnh lại bộ lọc biển số, loại xe hoặc bỏ giới hạn thời gian cần tìm.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setStatusFilter('all');
              setFilterStartDate('');
              setFilterEndDate('');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      )}

      {/* Grid Mode */}
      {viewMode === 'grid' && filteredVehicles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map((v) => {
            const badge = getVehicleStatusBadge(v.status);
            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Image & Status Tag */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border shadow-xs ${badge.bg} ${badge.textCol} ${badge.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.text}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono font-bold text-xs shadow-2xs backdrop-blur-xs">
                      {v.plateNumber}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 truncate">{v.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {v.category} · {v.transmission} · Năm {v.year}
                    </p>
                  </div>

                  {/* Specs Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-semibold">{v.currentOdometer.toLocaleString('vi-VN')} km</span>
                    </div>
                    <div className="flex items-center gap-1.5" title={`Nhiên liệu: ${v.fuelLevel}/8 vạch`}>
                      <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 8 }).map((_, idx) => (
                            <span
                              key={idx}
                              className={`w-1 h-2.5 rounded-full transition-colors ${
                                idx < v.fuelLevel
                                  ? v.fuelLevel >= 6
                                    ? 'bg-emerald-500'
                                    : v.fuelLevel >= 3
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-[11px] text-slate-700 ml-0.5">{v.fuelLevel}/8</span>
                      </div>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Giá thuê ngày</span>
                      <span className="text-sm font-black text-slate-900 font-mono">
                        {formatVND(v.dailyPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Thuê giờ</span>
                      <span className="text-xs font-bold text-slate-600 font-mono">
                        {formatVND(v.hourlyPrice)}/h
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVehicleId(v.id)}
                      className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Xem chi tiết</span>
                    </button>
                    {v.status === 'available' && (
                      <button
                        onClick={() => {
                          setSelectedVehicleId(v.id);
                          setIsCreateContractOpen(true);
                        }}
                        className="py-2 px-3 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
                        title="Tạo hợp đồng cho xe này"
                      >
                        Cho thuê
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Mode */}
      {viewMode === 'table' && filteredVehicles.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ảnh & Tên xe</th>
                  <th className="py-3 px-4">Biển số</th>
                  <th className="py-3 px-4">Phân loại</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Odometer</th>
                  <th className="py-3 px-4 text-right">Giá ngày</th>
                  <th className="py-3 px-4 text-right">Giá giờ</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map((v) => {
                  const badge = getVehicleStatusBadge(v.status);
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.image}
                            alt={v.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-9 rounded object-cover border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{v.name}</p>
                            <span className="text-[11px] text-slate-500">Đời {v.year} · {v.transmission}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded text-slate-800">
                          {v.plateNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-slate-600">{v.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${badge.bg} ${badge.textCol} ${badge.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.text}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700 text-xs">
                        {v.currentOdometer.toLocaleString('vi-VN')} km
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sky-700 text-sm">
                        {formatVND(v.dailyPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600 text-xs">
                        {formatVND(v.hourlyPrice)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedVehicleId(v.id)}
                          className="px-2.5 py-1 text-xs font-bold text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal / Drawer */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  {selectedVehicle.plateNumber}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedVehicle.name}</h3>
              </div>
              <button
                onClick={() => setSelectedVehicleId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Top Overview: Photo & Core Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200">
                  <img
                    src={selectedVehicle.image}
                    alt={selectedVehicle.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Trạng thái hiện tại:</span>
                    {(() => {
                      const badge = getVehicleStatusBadge(selectedVehicle.status);
                      return (
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs border ${badge.bg} ${badge.textCol} ${badge.border}`}>
                          {badge.text}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Giá theo ngày:</span>
                      <span className="text-base font-bold text-sky-700 font-mono">
                        {formatVND(selectedVehicle.dailyPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Giá theo giờ:</span>
                      <span className="text-base font-bold text-slate-800 font-mono">
                        {formatVND(selectedVehicle.hourlyPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Số km hiện tại:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {selectedVehicle.currentOdometer.toLocaleString('vi-VN')} km
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Nhiên liệu:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedVehicle.fuelLevel}/8 vạch
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Năm sản xuất:</span>
                      <span className="font-semibold text-slate-800">{selectedVehicle.year} ({selectedVehicle.color})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Hộp số / Vận hành:</span>
                      <span className="font-semibold text-slate-800">{selectedVehicle.transmission}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Hạn đăng kiểm:</span>
                      <span className="font-semibold text-slate-800">{formatDate(selectedVehicle.registrationExpiry)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Hạn bảo hiểm:</span>
                      <span className="font-semibold text-slate-800">{formatDate(selectedVehicle.insuranceExpiry)}</span>
                    </div>
                  </div>

                  {selectedVehicle.features && selectedVehicle.features.length > 0 && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Trang bị:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedVehicle.features.map((feat, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Maintenance Milestones Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  Mốc bảo dưỡng định kỳ
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Bảo dưỡng gần nhất:</span>
                    <span className="font-bold text-slate-800">{formatDate(selectedVehicle.lastMaintenanceDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Km bảo dưỡng trước:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedVehicle.lastMaintenanceKm.toLocaleString('vi-VN')} km
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hạn bảo dưỡng tiếp:</span>
                    <span className="font-bold text-sky-700">{formatDate(selectedVehicle.nextMaintenanceDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mốc km tiếp theo:</span>
                    <span className="font-mono font-bold text-sky-700">
                      {selectedVehicle.nextMaintenanceKm.toLocaleString('vi-VN')} km
                    </span>
                  </div>
                </div>
              </div>

              {/* Contract History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  Lịch sử hợp đồng cho thuê ({vehicleContracts.length})
                </h4>
                {vehicleContracts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">Chưa có hợp đồng nào được tạo cho xe này.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {vehicleContracts.map((c) => {
                      const cBadge = getContractStatusBadge(c.status);
                      return (
                        <div key={c.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{c.id}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${cBadge.bg} ${cBadge.textCol} ${cBadge.border}`}>
                                {cBadge.text}
                              </span>
                            </div>
                            <p className="text-slate-500 mt-0.5">
                              {formatDateTime(c.startDate)} → {formatDateTime(c.endDate)} ({c.units} {c.pricingType === 'hourly' ? 'giờ' : 'ngày'})
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-slate-900 block">
                              {formatVND(c.totalServiceFee)}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Cọc: {formatVND(c.deposit)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Maintenance History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  Lịch sử bảo trì & kỹ thuật ({vehicleMaintenance.length})
                </h4>
                {vehicleMaintenance.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">Chưa có bản ghi bảo trì nào.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {vehicleMaintenance.map((m) => (
                      <div key={m.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <p className="font-bold text-slate-900">{m.title}</p>
                          <p className="text-slate-500 mt-0.5">
                            Kỹ thuật viên: {m.assignedTo} · Ngày hẹn: {formatDate(m.dueDate)}
                          </p>
                          {m.notes && <p className="text-slate-600 text-[11px] mt-0.5 italic">{m.notes}</p>}
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 block">
                            {formatVND(m.cost)}
                          </span>
                          <span className="text-[11px] font-semibold text-amber-700">{m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/80">
              <button
                onClick={() => setSelectedVehicleId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Đóng
              </button>
              {selectedVehicle.status === 'available' && (
                <button
                  onClick={() => {
                    setIsCreateContractOpen(true);
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Tạo hợp đồng cho xe này
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
