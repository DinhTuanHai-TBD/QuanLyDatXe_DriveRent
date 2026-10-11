import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FinalSettlement } from '../types';
import {
  X,
  CreditCard,
  DollarSign,
  Receipt,
  Check,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Printer
} from 'lucide-react';
import {
  formatVND,
  formatDateTime,
  calculateBillableUnits
} from '../utils/formatters';

export const SettlementModal: React.FC = () => {
  const {
    isSettlementModalOpen,
    setIsSettlementModalOpen,
    activeContractForAction,
    setActiveContractForAction,
    vehicles,
    customers,
    settleContract,
    currentUser,
    setIsPrintContractOpen,
    setSelectedContractId
  } = useApp();

  const contract = activeContractForAction;
  if (!contract || !isSettlementModalOpen) return null;

  const vehicle = vehicles.find((v) => v.id === contract.vehicleId);
  const customer = customers.find((c) => c.id === contract.customerId);

  // Determine actual rental start and return times
  const actualStart = contract.handoverRecord?.actualTime || contract.startDate;
  const actualEnd = contract.returnRecord?.actualTime || new Date().toISOString();

  // Strict billing unit rule:
  // - Hourly: ceil to full hours, min 1 hour
  // - Daily: 24h per day from handover, ceil, min 1 day
  // - Never automatically converts between hourly and daily!
  const { units: actualUnitsBilled, durationText, exactHours } = calculateBillableUnits(
    actualStart,
    actualEnd,
    contract.pricingType
  );

  const unitRate = contract.rate;
  const actualRentalFee = actualUnitsBilled * unitRate;

  // Existing surcharges + damage fee from return record
  const damageFee = contract.returnRecord?.damageFee || 0;
  const surchargesTotal = contract.surcharges.reduce((sum, s) => sum + s.amount, 0);
  const discount = contract.discount || 0;

  // Service Fee = actualRentalFee + surchargesTotal + damageFee - discount
  const totalServiceFee = Math.max(0, actualRentalFee + surchargesTotal + damageFee - discount);

  // Deposit is held separately!
  const depositHeld = contract.deposit || 0;
  const amountPaid = contract.amountPaid || 0;

  // Deduction options
  // Remaining service fee due = totalServiceFee - amountPaid
  const remainingServiceDue = totalServiceFee - amountPaid;

  // The operator can choose how much deposit to deduct against the remaining service fee (default: auto-deduct if customer wants)
  const [deductFromDeposit, setDeductFromDeposit] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử'>('Tiền mặt');

  // Math:
  // If remainingServiceDue > 0:
  //   - If deducting from deposit:
  //       depositDeducted = Math.min(depositHeld, remainingServiceDue)
  //       additionalDue = Math.max(0, remainingServiceDue - depositHeld)
  //       refundAmount = Math.max(0, depositHeld - remainingServiceDue)
  //   - If NOT deducting:
  //       depositDeducted = 0
  //       additionalDue = remainingServiceDue
  //       refundAmount = depositHeld (return full deposit)
  // If remainingServiceDue <= 0:
  //   depositDeducted = 0
  //   additionalDue = 0
  //   refundAmount = depositHeld + Math.abs(remainingServiceDue) (if overpaid)

  let depositDeducted = 0;
  let additionalDue = 0;
  let refundAmount = 0;

  if (remainingServiceDue > 0) {
    if (deductFromDeposit) {
      depositDeducted = Math.min(depositHeld, remainingServiceDue);
      additionalDue = Math.max(0, remainingServiceDue - depositHeld);
      refundAmount = Math.max(0, depositHeld - remainingServiceDue);
    } else {
      depositDeducted = 0;
      additionalDue = remainingServiceDue;
      refundAmount = depositHeld;
    }
  } else {
    depositDeducted = 0;
    additionalDue = 0;
    refundAmount = depositHeld + Math.abs(remainingServiceDue);
  }

  const handleClose = () => {
    setIsSettlementModalOpen(false);
    setActiveContractForAction(null);
  };

  const handleConfirmSettlement = () => {
    const finalData: FinalSettlement = {
      actualUnitsBilled,
      pricingType: contract.pricingType,
      unitRate,
      actualRentalFee,
      surchargesTotal,
      damageFee,
      discount,
      totalServiceFee,
      amountPaid,
      depositHeld,
      depositDeducted,
      additionalDue,
      refundAmount,
      settledAt: new Date().toISOString(),
      settledBy: currentUser.name,
      paymentMethod
    };

    const ok = settleContract(contract.id, finalData);
    if (ok) {
      handleClose();
      // Offer printing
      setSelectedContractId(contract.id);
      setIsPrintContractOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-sky-600" />
              Quyết toán hợp đồng & Thanh toán chi phí
            </h3>
            <p className="text-xs text-slate-500">
              Hợp đồng <strong className="text-sky-700">{contract.id}</strong> · Khách: {customer?.fullName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Actual Rental Breakdown (Requirement!) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>1. Chi tiết thời gian thuê thực tế & Đơn giá</span>
              <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Gói {contract.pricingType === 'hourly' ? 'Theo giờ' : 'Theo ngày (24h)'}
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="text-slate-400 block">Thời điểm giao xe thực tế:</span>
                <strong className="text-slate-900">{formatDateTime(actualStart)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Thời điểm nhận xe thực tế:</span>
                <strong className="text-slate-900">{formatDateTime(actualEnd)}</strong>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600">Thời gian thực tế:</span>
                <span className="font-mono font-bold text-slate-800">{exactHours.toFixed(2)} giờ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Số {contract.pricingType === 'hourly' ? 'giờ' : 'ngày'} tính phí (quy tắc làm tròn lên):
                </span>
                <span className="font-mono font-bold text-blue-700">
                  {actualUnitsBilled} {contract.pricingType === 'hourly' ? 'giờ' : 'ngày'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Đơn giá áp dụng:</span>
                <span className="font-mono font-bold text-slate-800">{formatVND(unitRate)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-800">
                  Phép tính tiền thuê ({actualUnitsBilled} × {formatVND(unitRate)}):
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatVND(actualRentalFee)}
                </span>
              </div>
            </div>
          </div>

          {/* Service Fee Calculation (Requirement!) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-1">
              2. Tổng tiền dịch vụ (Thuê + Phụ phí - Giảm giá)
            </h4>

            <div className="flex justify-between text-slate-600">
              <span>Tiền thuê xe tính lại:</span>
              <span className="font-mono font-semibold">{formatVND(actualRentalFee)}</span>
            </div>

            {contract.surcharges.map((s) => (
              <div key={s.id} className="flex justify-between text-slate-600">
                <span>+ Phụ phí: {s.reason}</span>
                <span className="font-mono text-slate-800">+{formatVND(s.amount)}</span>
              </div>
            ))}

            {damageFee > 0 && (
              <div className="flex justify-between text-rose-700 font-medium">
                <span>+ Phạt hư hại / hụt xăng ({contract.returnRecord?.damageNotes || 'Kiểm tra lúc nhận'}):</span>
                <span className="font-mono font-bold">+{formatVND(damageFee)}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>- Chiết khấu / Giảm giá:</span>
                <span className="font-mono font-bold">-{formatVND(discount)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold">
              <span className="text-slate-900">TỔNG TIỀN DỊCH VỤ:</span>
              <span className="font-mono text-blue-700 text-base">{formatVND(totalServiceFee)}</span>
            </div>
          </div>

          {/* Isolated Deposit & Payment Breakdown (Requirement!) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                3. Quản lý Tiền cọc & Quyết toán dòng tiền
              </h4>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded border border-sky-200">
                Tiền cọc tách biệt
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-200">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tiền cọc đang giữ</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  {formatVND(depositHeld)}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tiền thuê đã trả trước</span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">
                  {formatVND(amountPaid)}
                </span>
              </div>
            </div>

            {/* Deduction Option */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="deductCheck"
                checked={deductFromDeposit}
                onChange={(e) => setDeductFromDeposit(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <label htmlFor="deductCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                Tự động khấu trừ phần tiền dịch vụ còn thiếu vào tiền cọc (khách không phải đóng thêm tiền mặt)
              </label>
            </div>

            {/* Final Cashflow Matrix */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Phần cọc được khấu trừ:</span>
                <span className="font-mono font-bold text-slate-900">{formatVND(depositDeducted)}</span>
              </div>

              {additionalDue > 0 ? (
                <div className="flex justify-between items-center text-sm font-extrabold text-orange-600 pt-1 border-t border-slate-100">
                  <span>SỐ TIỀN THU THÊM TỪ KHÁCH:</span>
                  <span className="font-mono text-base font-black">{formatVND(additionalDue)}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-sm font-extrabold text-emerald-600 pt-1 border-t border-slate-100">
                  <span>SỐ TIỀN HOÀN LẠI CHO KHÁCH (TRẢ CỌC):</span>
                  <span className="font-mono text-base font-black">{formatVND(refundAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700">Phương thức thanh toán / hoàn trả:</span>
            <div className="flex items-center gap-2">
              {(['Tiền mặt', 'Chuyển khoản', 'Ví điện tử'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Đóng
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleConfirmSettlement}
              className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl shadow-sm shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận quyết toán & Hoàn tất hợp đồng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
