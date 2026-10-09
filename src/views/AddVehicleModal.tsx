import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VehicleType } from '../types';
import { X, Car, Bike, AlertCircle, Plus } from 'lucide-react';

export const AddVehicleModal: React.FC = () => {
  const { isAddVehicleOpen, setIsAddVehicleOpen, addVehicle, showToast } = useApp();

  const [name, setName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [type, setType] = useState<VehicleType>('car');
  const [category, setCategory] = useState('Sedan 5 chỗ');
  const [dailyPrice, setDailyPrice] = useState<number>(700000);
  const [hourlyPrice, setHourlyPrice] = useState<number>(80000);
  const [currentOdometer, setCurrentOdometer] = useState<number>(10000);
  const [fuelLevel, setFuelLevel] = useState<number>(8);
  const [year, setYear] = useState<number>(2024);
  const [color, setColor] = useState('Trắng');
  const [transmission, setTransmission] = useState('Tự động');
  const [selectedImage, setSelectedImage] = useState('/src/assets/images/car_toyota_vios_1791537588925.jpg');
  const [featuresInput, setFeaturesInput] = useState('Màn hình Android, Camera hành trình, Cảm biến lùi');
  const [insuranceExpiry, setInsuranceExpiry] = useState('2027-12-31');
  const [registrationExpiry, setRegistrationExpiry] = useState('2028-06-30');
  const [error, setError] = useState('');

  if (!isAddVehicleOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Vui lòng nhập tên xe');
      return;
    }
    if (!plateNumber.trim()) {
      setError('Vui lòng nhập biển số xe (ví dụ: 43A-123.45)');
      return;
    }
    if (dailyPrice <= 0 || hourlyPrice <= 0) {
      setError('Giá thuê phải lớn hơn 0 đồng');
      return;
    }
    if (currentOdometer < 0) {
      setError('Số km hiện tại không thể là số âm');
      return;
    }

    const features = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    addVehicle({
      name: name.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      type,
      category,
      status: 'available',
      hourlyPrice,
      dailyPrice,
      currentOdometer,
      fuelLevel,
      image: selectedImage,
      year,
      color,
      transmission,
      features,
      insuranceExpiry,
      registrationExpiry,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      lastMaintenanceKm: currentOdometer,
      nextMaintenanceDate: '2026-12-31',
      nextMaintenanceKm: currentOdometer + (type === 'car' ? 5000 : 3000),
      notes: 'Xe mới thêm vào đội xe'
    });

    setIsAddVehicleOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Thêm phương tiện mới vào đội xe
          </h3>
          <button
            onClick={() => setIsAddVehicleOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Loại phương tiện
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('car');
                  setCategory('Sedan 5 chỗ');
                  setDailyPrice(750000);
                  setHourlyPrice(90000);
                  setSelectedImage('/src/assets/images/car_toyota_vios_1791537588925.jpg');
                }}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  type === 'car'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Ô tô tự lái</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('motorbike');
                  setCategory('Xe tay ga 110cc');
                  setDailyPrice(150000);
                  setHourlyPrice(25000);
                  setSelectedImage('/src/assets/images/scooter_honda_vision_1791537620987.jpg');
                }}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  type === 'motorbike'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Xe máy</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên xe & Phiên bản *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Toyota Vios 1.5G, Honda Vision 2024"
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Biển số đăng ký *</label>
              <input
                type="text"
                required
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="VD: 43A-888.99 hoặc 43K1-123.45"
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phân khúc xe</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                {type === 'car' ? (
                  <>
                    <option value="Sedan 5 chỗ">Sedan 5 chỗ</option>
                    <option value="Hatchback 5 chỗ">Hatchback 5 chỗ</option>
                    <option value="MPV 7 chỗ">MPV 7 chỗ</option>
                    <option value="SUV 7 chỗ gầm cao">SUV 7 chỗ gầm cao</option>
                    <option value="Bán tải 5 chỗ">Bán tải 5 chỗ</option>
                  </>
                ) : (
                  <>
                    <option value="Xe tay ga 110cc">Xe tay ga 110cc</option>
                    <option value="Xe tay ga 125cc-160cc">Xe tay ga 125cc-160cc</option>
                    <option value="Xe số 110cc">Xe số 110cc</option>
                    <option value="Xe côn tay">Xe côn tay</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hộp số / Truyền động</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Tự động">Tự động (AT / CVT)</option>
                <option value="Số sàn">Số sàn (MT)</option>
                <option value="Xe số tròn">Xe số tròn 4 cấp</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giá thuê ngày (đ) *</label>
              <input
                type="number"
                min="10000"
                step="10000"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white font-mono font-bold text-blue-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Giá thuê giờ (đ) *</label>
              <input
                type="number"
                min="5000"
                step="5000"
                value={hourlyPrice}
                onChange={(e) => setHourlyPrice(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Initial Odo & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số km hiện tại (Odo)</label>
              <input
                type="number"
                min="0"
                value={currentOdometer}
                onChange={(e) => setCurrentOdometer(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mức xăng (vạch /8)</label>
              <select
                value={fuelLevel}
                onChange={(e) => setFuelLevel(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value={8}>8/8 vạch (Đầy bình)</option>
                <option value={7}>7/8 vạch</option>
                <option value={6}>6/8 vạch</option>
                <option value={4}>4/8 vạch (Nửa bình)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Năm sản xuất</label>
              <input
                type="number"
                min="2015"
                max="2026"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Trang bị / Tiện nghi (phân cách dấu phẩy)</label>
            <input
              type="text"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="VD: Smartkey, Màn hình Android, Phanh ABS, Cổng sạc..."
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Photo Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hình ảnh đại diện phương tiện</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { url: '/src/assets/images/car_toyota_vios_1791537588925.jpg', label: 'Toyota Vios' },
                { url: '/src/assets/images/car_mitsubishi_xpander_1791537608474.jpg', label: 'Xpander 7 chỗ' },
                { url: '/src/assets/images/scooter_honda_vision_1791537620987.jpg', label: 'Honda Vision' },
                { url: '/src/assets/images/scooter_honda_airblade_1791537634617.jpg', label: 'Air Blade' }
              ].map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 aspect-4/3 relative ${
                    selectedImage === img.url ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] text-center font-bold py-0.5 truncate">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddVehicleOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Lưu xe vào hệ thống
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
