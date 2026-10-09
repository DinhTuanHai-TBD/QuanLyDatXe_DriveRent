import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vehicle, Customer, PricingType, SurchargeItem } from '../types';
import {
  X,
  Check,
  Calendar,
  User,
  FileText,
  CreditCard,
  AlertCircle,
  Car,
  Bike,
  Plus,
  Trash2,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { formatVND, calculateBillableUnits } from '../utils/formatters';

export const CreateContractWizard: React.FC = () => {
  const {
    isCreateContractOpen,
    setIsCreateContractOpen,
    vehicles,
    customers,
    addCustomer,
    createContract,
    checkVehicleAvailability,
    showToast
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Step 1: Vehicle & Duration
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [pricingType, setPricingType] = useState<PricingType>('daily');
  const [startDate, setStartDate] = useState<string>('2026-10-09T09:00');
  const [endDate, setEndDate] = useState<string>('2026-10-11T18:00');
  const [vehicleConflictError, setVehicleConflictError] = useState<string>('');

  // Step 2: Customer
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [custName, setCustName] = useState<string>('');
  const [custPhone, setCustPhone] = useState<string>('');
  const [custIdNumber, setCustIdNumber] = useState<string>('');
  const [custLicense, setCustLicense] = useState<string>('');
  const [custAddress, setCustAddress] = useState<string>('Khách sạn Sơn Trà, Đà Nẵng');

  // Step 3: Documents upload preview
  const [idFrontUploaded, setIdFrontUploaded] = useState<boolean>(true);
  const [licenseUploaded, setLicenseUploaded] = useState<boolean>(true);
  const [documentNotes, setDocumentNotes] = useState<string>('Đã kiểm tra đối chiếu CCCD và bằng lái xe gốc');

  // Step 4: Pricing & Deposit
  const [deposit, setDeposit] = useState<number>(5000000);
  const [discount, setDiscount] = useState<number>(0);
  const [surcharges, setSurcharges] = useState<SurchargeItem[]>([
    { id: 'sur-1', reason: 'Giao xe tận nơi khách sạn', amount: 100000 }
  ]);
  const [surchargeReason, setSurchargeReason] = useState('');
  const [surchargeAmount, setSurchargeAmount] = useState<number>(50000);
  const [initialAmountPaid, setInitialAmountPaid] = useState<number>(0);
  const [contractNote, setContractNote] = useState<string>('Khách du lịch thuê tự lái tham quan TP. Đà Nẵng & Hội An');

  if (!isCreateContractOpen) return null;

  // Selected vehicle obj
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  // Billable calculation
  const { units, durationText } = calculateBillableUnits(startDate, endDate, pricingType);
  const unitRate = selectedVehicle
    ? pricingType === 'hourly'
      ? selectedVehicle.hourlyPrice
      : selectedVehicle.dailyPrice
    : 0;

  const baseRentalFee = units * unitRate;
  const totalSurcharges = surcharges.reduce((sum, s) => sum + s.amount, 0);
  const totalServiceFee = Math.max(0, baseRentalFee + totalSurcharges - discount);

  // Handlers for step navigation
  const handleNextStep1 = () => {
    if (!selectedVehicleId) {
      setVehicleConflictError('Vui lòng chọn xe cần thuê');
      return;
    }
    const availability = checkVehicleAvailability(selectedVehicleId, startDate, endDate);
    if (!availability.available) {
      setVehicleConflictError(availability.conflictReason || 'Xe không khả dụng trong khoảng thời gian này');
      return;
    }
    setVehicleConflictError('');

    // Pre-fill deposit according to vehicle type
    if (selectedVehicle?.type === 'car') {
      setDeposit(5000000);
    } else {
      setDeposit(1000000);
    }

    setStep(2);
  };

  const handleNextStep2 = () => {
    if (isNewCustomer) {
      if (!custName.trim() || !custPhone.trim()) {
        showToast('Vui lòng nhập họ tên và số điện thoại khách hàng', 'error');
        return;
      }
    } else {
      if (!selectedCustomerId) {
        showToast('Vui lòng chọn khách hàng từ danh sách', 'error');
        return;
      }
    }
    setStep(3);
  };

  const handleNextStep3 = () => {
    setStep(4);
  };

  const handleNextStep4 = () => {
    setStep(5);
  };

  const handleAddSurcharge = () => {
    if (!surchargeReason.trim() || surchargeAmount <= 0) return;
    setSurcharges((prev) => [
      ...prev,
      { id: `sur-${Date.now()}`, reason: surchargeReason.trim(), amount: surchargeAmount }
    ]);
    setSurchargeReason('');
    setSurchargeAmount(50000);
  };

  const handleRemoveSurcharge = (id: string) => {
    setSurcharges((prev) => prev.filter((s) => s.id !== id));
  };

  const handleConfirmCreateContract = () => {
    let finalCustId = selectedCustomerId;
    if (isNewCustomer) {
      const created = addCustomer({
        fullName: custName.trim(),
        phone: custPhone.trim(),
        identityNumber: custIdNumber.trim() || 'Chưa cập nhật',
        driverLicense: custLicense.trim() || 'Chưa cập nhật',
        address: custAddress.trim(),
        city: 'Đà Nẵng',
        notes: documentNotes
      });
      finalCustId = created.id;
    }

    const createdContract = createContract({
      vehicleId: selectedVehicleId,
      customerId: finalCustId,
      pricingType,
      status: 'confirmed',
      startDate,
      endDate,
      rate: unitRate,
      units,
      baseRentalFee,
      deposit,
      discount,
      surcharges,
      totalServiceFee,
      amountPaid: initialAmountPaid,
      note: contractNote
    });

    if (createdContract) {
      setIsCreateContractOpen(false);
      // Reset form
      setStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Tạo hợp đồng cho thuê xe mới</h3>
            <p className="text-xs text-slate-500">Quy trình 5 bước xác thực và kiểm tra khả dụng</p>
          </div>
          <button
            onClick={() => setIsCreateContractOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {[
              { num: 1, label: 'Xe & Thời gian' },
              { num: 2, label: 'Khách hàng' },
              { num: 3, label: 'Giấy tờ' },
              { num: 4, label: 'Báo giá & Cọc' },
              { num: 5, label: 'Xác nhận' }
            ].map((s) => {
              const isPast = step > s.num;
              const isCurr = step === s.num;
              return (
                <div key={s.num} className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurr
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${isCurr ? 'text-blue-700' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="p-6 flex-1 space-y-5">
          {/* STEP 1: Select Vehicle & Duration */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Bước 1: Chọn thời gian và phương tiện
              </h4>

              {vehicleConflictError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{vehicleConflictError}</span>
                </div>
              )}

              {/* Package and Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gói tính phí</label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as PricingType)}
                    className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg bg-white text-blue-700"
                  >
                    <option value="daily">Thuê theo ngày (24 giờ/ngày)</option>
                    <option value="hourly">Thuê theo giờ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian nhận xe *</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setVehicleConflictError('');
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian trả xe *</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setVehicleConflictError('');
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium px-1">
                Thời lượng tính: <strong className="text-slate-900 font-mono">{durationText}</strong>
              </div>

              {/* Vehicle Selection List */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chọn xe còn trống trong thời gian trên:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                  {vehicles.map((v) => {
                    const check = checkVehicleAvailability(v.id, startDate, endDate);
                    const isSelected = selectedVehicleId === v.id;
                    const isAvailable = check.available;

                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedVehicleId(v.id);
                            setVehicleConflictError('');
                          }
                        }}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          !isAvailable
                            ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs cursor-pointer ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-blue-300 bg-white cursor-pointer'
                        }`}
                      >
                        <img
                          src={v.image}
                          alt={v.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-xs text-slate-900 truncate">{v.name}</p>
                            <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                              {v.plateNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{v.category}</p>
                          <p className="text-xs font-bold text-blue-700 font-mono mt-0.5">
                            {formatVND(pricingType === 'hourly' ? v.hourlyPrice : v.dailyPrice)}
                            <span className="text-[10px] text-slate-400 font-normal">
                              /{pricingType === 'hourly' ? 'h' : 'ngày'}
                            </span>
                          </p>
                          {!isAvailable && (
                            <p className="text-[10px] text-rose-600 font-medium truncate mt-0.5">
                              {check.conflictReason}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Customer Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Bước 2: Thông tin khách thuê xe
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsNewCustomer(false)}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      !isNewCustomer ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Khách có sẵn
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewCustomer(true)}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      isNewCustomer ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    + Khách hàng mới
                  </button>
                </div>
              </div>

              {!isNewCustomer ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chọn khách hàng từ hệ thống:
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} - {c.phone} ({c.identityNumber})
                      </option>
                    ))}
                  </select>

                  {selectedCustomerId && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      {(() => {
                        const cust = customers.find((c) => c.id === selectedCustomerId);
                        return (
                          <>
                            <p><strong>Họ tên:</strong> {cust?.fullName}</p>
                            <p><strong>Số điện thoại:</strong> {cust?.phone}</p>
                            <p><strong>Số CCCD/Hộ chiếu:</strong> {cust?.identityNumber}</p>
                            <p><strong>Giấy phép lái xe:</strong> {cust?.driverLicense}</p>
                            <p><strong>Địa chỉ / Nơi lưu trú:</strong> {cust?.address}</p>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên khách hàng *</label>
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="VD: Nguyễn Văn An"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                      <input
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="VD: 0905 123 456"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Số CCCD / Hộ chiếu</label>
                      <input
                        type="text"
                        value={custIdNumber}
                        onChange={(e) => setCustIdNumber(e.target.value)}
                        placeholder="VD: 048092004512"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Số GPLX</label>
                      <input
                        type="text"
                        value={custLicense}
                        onChange={(e) => setCustLicense(e.target.value)}
                        placeholder="VD: 480210089211 (Hạng B2/A1)"
                        className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ / Khách sạn lưu trú tại TP. Đà Nẵng</label>
                    <input
                      type="text"
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      placeholder="VD: Khách sạn Mường Thanh, Võ Nguyên Giáp..."
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Documents Upload Illustration */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Bước 3: Ảnh chụp giấy tờ tùy thân & Bằng lái
              </h4>
              <p className="text-xs text-slate-500">
                Để bảo vệ quyền riêng tư, hệ thống sử dụng ảnh mẫu đối chiếu minh họa mô phỏng giấy tờ khách hàng.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Card Box */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Ảnh CCCD / Hộ chiếu (Mặt trước)</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Đã xác thực
                    </span>
                  </div>
                  <div className="aspect-16/9 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center p-3 text-center">
                    <ShieldCheck className="w-8 h-8 text-blue-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800">CĂN CƯỚC CÔNG DÂN</span>
                    <span className="text-[10px] text-slate-500 font-mono">Bản mẫu số hóa bảo mật</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => showToast('Mô phỏng: Đã tải lại ảnh CCCD mới', 'info')}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Tải lại ảnh
                    </button>
                    <span className="text-slate-400">Định dạng JPG/PNG</span>
                  </div>
                </div>

                {/* Driver License Box */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Ảnh Giấy phép lái xe</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Đã xác thực
                    </span>
                  </div>
                  <div className="aspect-16/9 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center p-3 text-center">
                    <Car className="w-8 h-8 text-indigo-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800">GIẤY PHÉP LÁI XE</span>
                    <span className="text-[10px] text-slate-500 font-mono">Bản mẫu số hóa hợp lệ</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => showToast('Mô phỏng: Đã tải lại ảnh GPLX mới', 'info')}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Tải lại ảnh
                    </button>
                    <span className="text-slate-400">Định dạng JPG/PNG</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú đối chiếu giấy tờ</label>
                <input
                  type="text"
                  value={documentNotes}
                  onChange={(e) => setDocumentNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Pricing and Deposit */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Bước 4: Báo giá dịch vụ & Tiền cọc đảm bảo
              </h4>

              {/* Price Calculation Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-600">
                    Tiền thuê xe ({units} {pricingType === 'hourly' ? 'giờ' : 'ngày'} × {formatVND(unitRate)}):
                  </span>
                  <span className="font-mono font-bold text-slate-900">{formatVND(baseRentalFee)}</span>
                </div>

                {/* Surcharges list */}
                {surcharges.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRemoveSurcharge(s.id)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span>{s.reason}</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-800">+{formatVND(s.amount)}</span>
                  </div>
                ))}

                {/* Add surcharge item */}
                <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={surchargeReason}
                    onChange={(e) => setSurchargeReason(e.target.value)}
                    placeholder="Thêm phụ phí (VD: Rửa xe bẩn, Giao xe tận nơi...)"
                    className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                  />
                  <input
                    type="number"
                    step="10000"
                    value={surchargeAmount}
                    onChange={(e) => setSurchargeAmount(Number(e.target.value))}
                    className="w-28 text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddSurcharge}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-md text-xs font-bold text-slate-700"
                  >
                    Thêm
                  </button>
                </div>

                {/* Discount */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-600">Chiết khấu / Giảm giá:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="50000"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-32 text-xs px-2 py-1 bg-white border border-slate-200 rounded-md font-mono text-right"
                    />
                    <span className="text-slate-500">đ</span>
                  </div>
                </div>

                {/* Total Service Fee */}
                <div className="flex items-center justify-between text-sm font-extrabold pt-2 border-t border-slate-300">
                  <span className="text-slate-900">TỔNG TIỀN DỊCH VỤ THUÊ:</span>
                  <span className="font-mono text-blue-700 text-base">{formatVND(totalServiceFee)}</span>
                </div>
              </div>

              {/* Deposit Section (Explicitly separated!) */}
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                      Tiền cọc đảm bảo hợp đồng (Bắt buộc)
                    </span>
                    <span className="text-[11px] text-indigo-700">
                      Khoản tiền cọc này được giữ độc lập, không tính vào doanh thu thuê xe.
                    </span>
                  </div>
                  <span className="text-xs bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                    Tách riêng
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    step="500000"
                    min="0"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-48 text-base font-extrabold font-mono px-3 py-1.5 bg-white border border-indigo-300 rounded-lg text-indigo-800"
                  />
                  <span className="text-xs text-indigo-900 font-semibold">
                    (Gợi ý: Ô tô 5.000.000 đ, Xe máy 1.000.000 đ)
                  </span>
                </div>
              </div>

              {/* Initial Paid Amount */}
              <div className="flex items-center justify-between text-xs bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700">Khách thanh toán trước tiền thuê:</span>
                <input
                  type="number"
                  step="100000"
                  min="0"
                  value={initialAmountPaid}
                  onChange={(e) => setInitialAmountPaid(Number(e.target.value))}
                  className="w-36 text-xs px-2.5 py-1.5 border border-slate-200 rounded-md font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú hợp đồng</label>
                <input
                  type="text"
                  value={contractNote}
                  onChange={(e) => setContractNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Confirmation */}
          {step === 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Bước 5: Kiểm tra và xác nhận lập hợp đồng
              </h4>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Phương tiện:</span>
                    <strong className="text-slate-900 text-sm">{selectedVehicle?.name}</strong>
                    <p className="font-mono text-slate-600 font-bold">{selectedVehicle?.plateNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Khách hàng:</span>
                    <strong className="text-slate-900 text-sm">
                      {isNewCustomer ? custName : customers.find((c) => c.id === selectedCustomerId)?.fullName}
                    </strong>
                    <p className="text-slate-600 font-mono">
                      {isNewCustomer ? custPhone : customers.find((c) => c.id === selectedCustomerId)?.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Thời gian nhận xe:</span>
                    <strong className="text-slate-800">{new Date(startDate).toLocaleString('vi-VN')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Thời gian trả xe:</span>
                    <strong className="text-slate-800">{new Date(endDate).toLocaleString('vi-VN')}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Tiền dịch vụ</span>
                    <span className="text-base font-extrabold text-blue-700 font-mono">
                      {formatVND(totalServiceFee)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">Tiền cọc giữ</span>
                    <span className="text-base font-extrabold text-indigo-800 font-mono">
                      {formatVND(deposit)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Khách trả trước</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {formatVND(initialAmountPaid)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Hợp đồng sau khi tạo sẽ chuyển sang trạng thái <strong>Đã xác nhận</strong> và xe sẽ được giữ chỗ sẵn sàng bàn giao cho khách.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateContractOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={handleNextStep1}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                onClick={handleNextStep2}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                onClick={handleNextStep3}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={handleNextStep4}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <span>Tiếp tục kiểm tra</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {step === 5 && (
              <button
                type="button"
                onClick={handleConfirmCreateContract}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Hoàn tất & Ký hợp đồng</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
