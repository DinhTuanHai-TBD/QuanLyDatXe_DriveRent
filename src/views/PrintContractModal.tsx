import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { formatVND, formatDate, formatDateTime } from '../utils/formatters';

export const PrintContractModal: React.FC = () => {
  const {
    isPrintContractOpen,
    setIsPrintContractOpen,
    selectedContractId,
    contracts,
    vehicles,
    customers,
    settings
  } = useApp();

  const contract = contracts.find((c) => c.id === selectedContractId);
  if (!isPrintContractOpen || !contract) return null;

  const vehicle = vehicles.find((v) => v.id === contract.vehicleId);
  const customer = customers.find((c) => c.id === contract.customerId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        {/* Top Controls (Hidden on print) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-500">Mẫu in hợp đồng:</span>
            <span className="font-mono font-bold text-sm text-blue-700">{contract.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>In hợp đồng / Lưu PDF</span>
            </button>
            <button
              onClick={() => setIsPrintContractOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Contract Body */}
        <div className="p-8 sm:p-12 text-slate-900 font-sans space-y-6 printable-area bg-white">
          {/* Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
            <p className="text-xs uppercase tracking-widest font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="text-xs font-medium">Độc lập - Tự do - Hạnh phúc</p>
            <div className="pt-4">
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
                HỢP ĐỒNG CHO THUÊ XE TỰ LÁI
              </h2>
              <p className="text-xs text-slate-600">Số hiệu: {contract.id} / HĐTX-{settings.brandTitle}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-2">
            {/* Party A */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900 uppercase">BÊN CHO THUÊ (BÊN A):</p>
              <p><strong>Đơn vị:</strong> {settings.storeName}</p>
              <p><strong>Địa chỉ:</strong> {settings.address}</p>
              <p><strong>Hotline:</strong> {settings.hotline}</p>
              <p><strong>Đại diện:</strong> Ông/Bà {contract.createdBy}</p>
              <p><strong>STK nhận cọc:</strong> {settings.bankAccount} ({settings.bankName})</p>
            </div>

            {/* Party B */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900 uppercase">BÊN THUÊ XE (BÊN B):</p>
              <p><strong>Họ và tên:</strong> {customer?.fullName}</p>
              <p><strong>Số điện thoại:</strong> {customer?.phone}</p>
              <p><strong>Số CCCD:</strong> {customer?.identityNumber}</p>
              <p><strong>Số GPLX:</strong> {customer?.driverLicense}</p>
              <p><strong>Địa chỉ / Lưu trú:</strong> {customer?.address}</p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase text-slate-900 border-b border-slate-200 pb-1">
              ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG & PHƯƠNG TIỆN
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Tên xe:</span>
                <strong>{vehicle?.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Biển số đăng ký:</span>
                <strong className="font-mono text-blue-700">{vehicle?.plateNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Loại xe / Hộp số:</span>
                <span>{vehicle?.category} ({vehicle?.transmission})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Màu sơn / Năm SX:</span>
                <span>{vehicle?.color} ({vehicle?.year})</span>
              </div>
            </div>
          </div>

          {/* Rental Terms & Pricing */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold uppercase text-slate-900 border-b border-slate-200 pb-1">
              ĐIỀU 2: THỜI GIAN, GIÁ THUÊ & TIỀN ĐẶT CỌC
            </h4>
            <div className="space-y-2">
              <p>
                - <strong>Thời gian giao xe:</strong> {formatDateTime(contract.startDate)}
              </p>
              <p>
                - <strong>Thời gian trả xe dự kiến:</strong> {formatDateTime(contract.endDate)}
              </p>
              <p>
                - <strong>Gói tính cước:</strong> {contract.pricingType === 'hourly' ? 'Tính theo giờ' : 'Tính theo ngày (24h/ngày)'} · Số lượng: <strong>{contract.units} {contract.pricingType === 'hourly' ? 'giờ' : 'ngày'}</strong>
              </p>
              <p>
                - <strong>Đơn giá:</strong> {formatVND(contract.rate)} / {contract.pricingType === 'hourly' ? 'giờ' : 'ngày'}
              </p>
              <p>
                - <strong>Tiền thuê dịch vụ:</strong> <span className="font-mono font-bold text-slate-900">{formatVND(contract.totalServiceFee)}</span>
              </p>
              <p>
                - <strong>TIỀN CỌC ĐẢM BẢO HỢP ĐỒNG:</strong> <span className="font-mono font-extrabold text-blue-700">{formatVND(contract.deposit)}</span> <em>(Tiền cọc được giữ riêng biệt và sẽ hoàn trả cho Bên B sau khi nghiệm thu trả xe và quyết toán chi phí)</em>.
              </p>
            </div>
          </div>

          {/* Handover & Condition Checklist if available */}
          {contract.handoverRecord && (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase text-slate-900 border-b border-slate-200 pb-1">
                ĐIỀU 3: HIỆN TRẠNG BÀN GIAO THỰC TẾ
              </h4>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Km xuất phát:</span>
                  <strong className="font-mono">{contract.handoverRecord.odometer.toLocaleString('vi-VN')} km</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Nhiên liệu:</span>
                  <strong>{contract.handoverRecord.fuelLevel}/8 vạch</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Phụ kiện:</span>
                  <span>{contract.handoverRecord.accessories.join(', ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Final Settlement if completed */}
          {contract.finalSettlement && (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold uppercase text-slate-900 border-b border-slate-200 pb-1">
                ĐIỀU 4: BIÊN BẢN QUYẾT TOÁN THANH TOÁN
              </h4>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                <p>
                  - Tổng tiền dịch vụ thực tế: <strong>{formatVND(contract.finalSettlement.totalServiceFee)}</strong>
                </p>
                <p>
                  - Tiền cọc đã hoàn trả cho khách: <strong className="text-emerald-700">{formatVND(contract.finalSettlement.refundAmount)}</strong>
                </p>
                <p>
                  - Phương thức thanh toán: <strong>{contract.finalSettlement.paymentMethod}</strong> · Quyết toán lúc: {formatDateTime(contract.finalSettlement.settledAt)}
                </p>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center pt-8 text-xs">
            <div>
              <p className="font-bold uppercase text-slate-900">ĐẠI DIỆN BÊN CHO THUÊ</p>
              <p className="text-slate-400 text-[11px] mt-0.5">(Ký, ghi rõ họ tên)</p>
              <div className="h-20 flex items-center justify-center font-serif text-blue-800 italic">
                {contract.createdBy}
              </div>
            </div>
            <div>
              <p className="font-bold uppercase text-slate-900">ĐẠI DIỆN BÊN THUÊ XE</p>
              <p className="text-slate-400 text-[11px] mt-0.5">(Ký, ghi rõ họ tên)</p>
              <div className="h-20 flex items-center justify-center font-serif text-slate-700 italic">
                {customer?.fullName}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-end bg-slate-50 no-print">
          <button
            onClick={() => setIsPrintContractOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
