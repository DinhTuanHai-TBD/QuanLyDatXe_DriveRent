import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, RefreshCw, ShieldAlert } from 'lucide-react';

export const TrialBanner: React.FC = () => {
  const { resetToSampleData } = useApp();

  return (
    <div className="bg-blue-50/80 border-b border-blue-100 px-4 py-2 text-xs text-blue-900 flex flex-wrap items-center justify-between gap-2 no-print">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold">
          i
        </span>
        <span className="font-medium">Chế độ trải nghiệm trực tiếp (Trial Mode):</span>
        <span className="text-blue-700 hidden sm:inline">
          Dữ liệu mẫu cửa hàng tại Nha Trang (25 Lê Lợi), các thao tác tạo hợp đồng, giao nhận xe, quyết toán được lưu ngay trên trình duyệt.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={resetToSampleData}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors shadow-2xs"
          title="Khôi phục lại danh sách xe và hợp đồng ban đầu"
        >
          <RefreshCw className="w-3 h-3 text-blue-600" />
          <span>Đặt lại dữ liệu mẫu</span>
        </button>
      </div>
    </div>
  );
};
