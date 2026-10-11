import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RentalContract, HandoverRecord, ReturnRecord } from '../types';
import {
  X,
  Camera,
  Check,
  AlertCircle,
  Car,
  Fuel,
  Gauge,
  Trash2,
  Upload,
  ArrowRight,
  ShieldAlert,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { formatDateTime, formatDate, formatVND } from '../utils/formatters';

export const HandoverReturnModal: React.FC = () => {
  const {
    isHandoverModalOpen,
    setIsHandoverModalOpen,
    isReturnModalOpen,
    setIsReturnModalOpen,
    activeContractForAction,
    setActiveContractForAction,
    vehicles,
    customers,
    handoverVehicle,
    returnVehicle,
    setIsSettlementModalOpen,
    currentUser,
    showToast
  } = useApp();

  // Handover state
  const [handoverTime, setHandoverTime] = useState<string>(
    new Date().toISOString().substring(0, 16)
  );
  const [handoverOdo, setHandoverOdo] = useState<number>(0);
  const [handoverFuel, setHandoverFuel] = useState<number>(8);
  const [handoverNotes, setHandoverNotes] = useState<string>('Thân vỏ sạch, máy êm, phanh nhạy');
  const [handoverAccessories, setHandoverAccessories] = useState<string[]>([
    'Giấy tờ xe (Cavet + Bảo hiểm)',
    '2 mũ bảo hiểm đạt chuẩn',
    '1 áo mưa DriveRent',
    'Giá đỡ điện thoại'
  ]);
  const [handoverPhotos, setHandoverPhotos] = useState<string[]>([
    '/src/assets/images/car_toyota_vios_1791537588925.jpg'
  ]);

  // Return state
  const [returnTime, setReturnTime] = useState<string>(
    new Date().toISOString().substring(0, 16)
  );
  const [returnOdo, setReturnOdo] = useState<number>(0);
  const [returnFuel, setReturnFuel] = useState<number>(8);
  const [checklist, setChecklist] = useState({
    body: true,
    tires: true,
    lights: true,
    mirrors: true,
    fuel: true,
    accessories: true
  });
  const [damageNotes, setDamageNotes] = useState<string>('');
  const [damageFee, setDamageFee] = useState<number>(0);
  const [returnPhotos, setReturnPhotos] = useState<string[]>([
    '/src/assets/images/car_toyota_vios_1791537588925.jpg'
  ]);
  const [postStatus, setPostStatus] = useState<'available' | 'maintenance'>('available');

  const contract = activeContractForAction;
  if (!contract) return null;

  const vehicle = vehicles.find((v) => v.id === contract.vehicleId);
  const customer = customers.find((c) => c.id === contract.customerId);

  // Initialize handover default odo from vehicle
  React.useEffect(() => {
    if (vehicle && isHandoverModalOpen) {
      setHandoverOdo(vehicle.currentOdometer);
      setHandoverFuel(vehicle.fuelLevel);
      if (vehicle.type === 'car') {
        setHandoverAccessories([
          'Giấy chứng nhận đăng ký xe & Bảo hiểm',
          'Lốp dự phòng & Kích nâng',
          'Bơm lốp điện tử mini',
          'Tẩu sạc nhanh trên ô tô'
        ]);
        setHandoverPhotos([vehicle.image]);
      } else {
        setHandoverAccessories([
          'Giấy tờ xe (Cavet sao y công chứng)',
          '2 mũ bảo hiểm đạt chuẩn',
          '1 áo mưa DriveRent',
          'Giá đỡ kẹp điện thoại'
        ]);
        setHandoverPhotos([vehicle.image]);
      }
    }
  }, [vehicle, isHandoverModalOpen]);

  // Initialize return default odo
  React.useEffect(() => {
    if (contract && isReturnModalOpen) {
      const startOdo = contract.handoverRecord?.odometer || vehicle?.currentOdometer || 0;
      setReturnOdo(startOdo + 120); // sample simulated return odo
      setReturnFuel(vehicle?.fuelLevel || 8);
      if (contract.handoverRecord?.photos) {
        setReturnPhotos([contract.handoverRecord.photos[0] || vehicle?.image || '']);
      }
    }
  }, [contract, vehicle, isReturnModalOpen]);

  // Close modals
  const handleClose = () => {
    setIsHandoverModalOpen(false);
    setIsReturnModalOpen(false);
    setActiveContractForAction(null);
  };

  // Submit Handover
  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (handoverOdo <= 0) {
      showToast('Vui lòng nhập số km lúc bàn giao xe', 'error');
      return;
    }

    const record: HandoverRecord = {
      actualTime: handoverTime,
      odometer: handoverOdo,
      fuelLevel: handoverFuel,
      accessories: handoverAccessories,
      notes: handoverNotes,
      photos: handoverPhotos,
      performedBy: currentUser.name
    };

    const ok = handoverVehicle(contract.id, record);
    if (ok) {
      handleClose();
    }
  };

  // Submit Return
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const startOdo = contract.handoverRecord?.odometer || 0;
    if (returnOdo < startOdo) {
      showToast(`Số km khi nhận xe (${returnOdo}) không được nhỏ hơn lúc giao (${startOdo})!`, 'error');
      return;
    }

    const record: ReturnRecord = {
      actualTime: returnTime,
      odometer: returnOdo,
      fuelLevel: returnFuel,
      checklist,
      damageNotes,
      damageFee,
      photos: returnPhotos,
      postStatus,
      performedBy: currentUser.name
    };

    const ok = returnVehicle(contract.id, record);
    if (ok) {
      handleClose();
      // Ask user to settle immediately
      setIsSettlementModalOpen(true);
      setActiveContractForAction({
        ...contract,
        status: 'pending_settlement',
        returnRecord: record
      });
    }
  };

  const handleAddSampleReturnPhoto = () => {
    setReturnPhotos((prev) => [
      ...prev,
      vehicle?.image || '/src/assets/images/car_toyota_vios_1791537588925.jpg'
    ]);
    showToast('Đã chụp/tải thêm 1 ảnh đối chiếu', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isHandoverModalOpen ? 'Biên bản Bàn giao xe cho khách' : 'Biên bản Nhận trả xe & Kiểm tra hiện trạng'}
            </h3>
            <p className="text-xs text-slate-500">
              Mã HĐ: <strong className="text-blue-700">{contract.id}</strong> · Xe: {vehicle?.name} ({vehicle?.plateNumber})
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HANDOVER FORM */}
        {isHandoverModalOpen && (
          <form onSubmit={handleSubmitHandover} className="p-6 space-y-5">
            {/* Context bar */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-500">Khách hàng:</span>{' '}
                <strong className="text-slate-900">{customer?.fullName}</strong> ({customer?.phone})
              </div>
              <div>
                <span className="text-slate-500">Nhân viên bàn giao:</span>{' '}
                <strong className="text-blue-700">{currentUser.name}</strong>
              </div>
            </div>

            {/* Actual time, odo, fuel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giờ giao thực tế *</label>
                <input
                  type="datetime-local"
                  required
                  value={handoverTime}
                  onChange={(e) => setHandoverTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số km xuất phát (Odo) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={handoverOdo}
                  onChange={(e) => setHandoverOdo(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mức xăng / nhiên liệu</label>
                <select
                  value={handoverFuel}
                  onChange={(e) => setHandoverFuel(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value={8}>8/8 vạch (Đầy bình)</option>
                  <option value={7}>7/8 vạch</option>
                  <option value={6}>6/8 vạch</option>
                  <option value={4}>4/8 vạch (1/2 bình)</option>
                </select>
              </div>
            </div>

            {/* Accessories Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phụ kiện kèm theo khi bàn giao:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {handoverAccessories.map((acc, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">{acc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú hiện trạng thân vỏ, máy móc</label>
              <textarea
                rows={2}
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                placeholder="Ghi nhận các vết xước nhỏ có sẵn trước khi giao..."
                className="w-full text-xs p-3 border border-slate-200 rounded-lg"
              />
            </div>

            {/* Photo Inspection Upload & Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ảnh chụp hiện trạng lúc bàn giao ({handoverPhotos.length})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setHandoverPhotos((prev) => [...prev, vehicle?.image || '']);
                    showToast('Đã chụp thêm 1 góc ảnh kiểm tra', 'info');
                  }}
                  className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>+ Chụp / Tải thêm ảnh</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {handoverPhotos.map((photo, pIdx) => (
                  <div key={pIdx} className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={photo} alt="Giao xe" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setHandoverPhotos((prev) => prev.filter((_, i) => i !== pIdx))}
                      className="absolute top-1 right-1 p-1 rounded bg-rose-600 text-white opacity-90 hover:opacity-100"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow-sm shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác nhận bàn giao xe</span>
              </button>
            </div>
          </form>
        )}

        {/* RETURN FORM */}
        {isReturnModalOpen && (
          <form onSubmit={handleSubmitReturn} className="p-6 space-y-5">
            {/* Context & Mileage Check */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-amber-900 font-semibold">Km lúc giao xe:</span>{' '}
                  <strong className="font-mono text-slate-900">
                    {(contract.handoverRecord?.odometer || vehicle?.currentOdometer || 0).toLocaleString('vi-VN')} km
                  </strong>
                </div>
                <div>
                  <span className="text-amber-900 font-semibold">Giờ giao:</span>{' '}
                  <strong className="text-slate-900">
                    {formatDateTime(contract.handoverRecord?.actualTime || contract.startDate)}
                  </strong>
                </div>
              </div>
              <p className="text-[11px] text-amber-800">
                Lưu ý: Số km khi nhận xe bắt buộc phải lớn hơn hoặc bằng lúc giao xe.
              </p>
            </div>

            {/* Actual time, Return odo, Return Fuel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giờ nhận thực tế *</label>
                <input
                  type="datetime-local"
                  required
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số km nhận trả (Odo) *</label>
                <input
                  type="number"
                  required
                  min={contract.handoverRecord?.odometer || 0}
                  value={returnOdo}
                  onChange={(e) => setReturnOdo(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-blue-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mức xăng hoàn trả</label>
                <select
                  value={returnFuel}
                  onChange={(e) => setReturnFuel(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value={8}>8/8 vạch (Đầy bình)</option>
                  <option value={7}>7/8 vạch</option>
                  <option value={6}>6/8 vạch</option>
                  <option value={4}>4/8 vạch (Hụt 1/2 bình - tính phụ phí)</option>
                </select>
              </div>
            </div>

            {/* Before and After Inspection Comparison Side-by-Side (Requirement!) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Đối chiếu ảnh hiện trạng (Lúc giao vs Lúc nhận)
                </label>
                <button
                  type="button"
                  onClick={handleAddSampleReturnPhoto}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>+ Chụp thêm ảnh lúc nhận</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {/* Before Photo */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Ảnh lúc giao xe ({formatDate(contract.startDate)})
                  </span>
                  <div className="aspect-4/3 rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img
                      src={contract.handoverRecord?.photos[0] || vehicle?.image}
                      alt="Trước"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 truncate">
                    Ghi chú: {contract.handoverRecord?.notes || 'Bình thường'}
                  </p>
                </div>

                {/* After Photo */}
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase block mb-1">
                    Ảnh lúc nhận xe (Hiện tại)
                  </span>
                  <div className="aspect-4/3 rounded-lg overflow-hidden border border-blue-300 bg-white relative">
                    <img
                      src={returnPhotos[0] || vehicle?.image}
                      alt="Sau"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Đối chiếu
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Số ảnh đã chụp: {returnPhotos.length} ảnh
                  </p>
                </div>
              </div>
            </div>

            {/* 6-point Inspection Checklist (Thân xe, lốp, đèn, gương, nhiên liệu, phụ kiện) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Danh sách kiểm tra 6 hạng mục kỹ thuật:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { key: 'body', label: '1. Thân xe / Dàn áo' },
                  { key: 'tires', label: '2. Lốp xe & Mâm' },
                  { key: 'lights', label: '3. Đèn & Xi-nhan' },
                  { key: 'mirrors', label: '4. Gương chiếu hậu' },
                  { key: 'fuel', label: '5. Mức nhiên liệu' },
                  { key: 'accessories', label: '6. Phụ kiện đầy đủ' }
                ].map((item) => {
                  const isChecked = (checklist as any)[item.key];
                  return (
                    <label
                      key={item.key}
                      className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Damage notes & Damage fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi nhận hư hại / phát sinh</label>
                <input
                  type="text"
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  placeholder="VD: Xước cản trước nhẹ, thiếu 1 vạch xăng..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiền phạt hư hại / Phụ phí (đ)</label>
                <input
                  type="number"
                  step="50000"
                  min="0"
                  value={damageFee}
                  onChange={(e) => setDamageFee(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono font-bold text-rose-600"
                />
              </div>
            </div>

            {/* Post-inspection Vehicle Status Transition (Requirement!) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chuyển trạng thái xe sau khi nhận:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-bold transition-all ${
                    postStatus === 'available'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="postStatus"
                    value="available"
                    checked={postStatus === 'available'}
                    onChange={() => setPostStatus('available')}
                    className="text-emerald-600"
                  />
                  <div>
                    <p className="font-bold">Chuyển về "Sẵn sàng"</p>
                    <span className="text-[11px] font-normal text-slate-500">Xe hoàn hảo, có thể cho thuê tiếp</span>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-bold transition-all ${
                    postStatus === 'maintenance'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="postStatus"
                    value="maintenance"
                    checked={postStatus === 'maintenance'}
                    onChange={() => setPostStatus('maintenance')}
                    className="text-amber-600"
                  />
                  <div>
                    <p className="font-bold">Chuyển sang "Đang bảo dưỡng"</p>
                    <span className="text-[11px] font-normal text-slate-500">Cần sửa chữa hoặc dọn kỹ trước khi cho thuê</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow-sm shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Hoàn tất nhận xe & Tiến hành quyết toán</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
