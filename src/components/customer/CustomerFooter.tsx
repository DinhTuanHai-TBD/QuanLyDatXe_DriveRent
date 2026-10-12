import React from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Phone, Mail, MapPin, Clock, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export const CustomerFooter: React.FC = () => {
  const { settings, setCustomerTab, setIsAdminLoginModalOpen } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">DriveRent</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Dịch vụ cho thuê xe máy và ô tô tự lái hàng đầu tại TP. Nha Trang (25 Lê Lợi). Phương tiện đời mới, kiểm tra bảo dưỡng định kỳ nghiêm ngặt, thủ tục nhanh gọn và minh bạch.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Cam kết giao xe đúng hẹn, sạch đẹp 100%</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Điều hướng nhanh</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCustomerTab('home')}
                  className="hover:text-white transition-colors"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCustomerTab('vehicles')}
                  className="hover:text-white transition-colors"
                >
                  Danh sách xe cho thuê
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCustomerTab('guide')}
                  className="hover:text-white transition-colors"
                >
                  Hướng dẫn thuê xe & Thủ tục
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCustomerTab('lookup')}
                  className="hover:text-white transition-colors"
                >
                  Tra cứu đơn đặt xe trực tuyến
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCustomerTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Liên hệ & Địa chỉ
                </button>
              </li>
            </ul>
          </div>

          {/* Policy & Rental Notice */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Chính sách & Quy định</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>• Thuê theo ngày tính trọn chu kỳ 24 giờ.</li>
              <li>• Cọc giữ chỗ trực tuyến đối trừ vào tiền thuê.</li>
              <li>• Hoàn cọc giữ chỗ 100% khi hủy trước 24 giờ.</li>
              <li>• Tiền cọc bảo đảm hoàn lại 100% khi trả xe.</li>
              <li>• Hỗ trợ cứu hộ giao thông 24/7 nội thành Nha Trang.</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Liên hệ cửa hàng</h4>
            <div className="space-y-2 text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-bold text-white">{settings.hotline}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>06:00 - 22:00 (Thứ 2 - Chủ Nhật)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 DriveRent Nha Trang. Bản quyền thuộc về DriveRent. Dữ liệu thử nghiệm minh họa.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-colors flex items-center gap-1 border border-slate-700"
            >
              <Lock className="w-3 h-3 text-blue-400" />
              <span>Chuyển sang Trang quản trị nội bộ</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
