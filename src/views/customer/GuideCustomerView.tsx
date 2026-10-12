import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CreditCard,
  Car,
  Bike,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  PhoneCall,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export const GuideCustomerView: React.FC = () => {
  const { setCustomerTab, settings } = useApp();

  const steps = [
    {
      step: 'Bước 1',
      title: 'Chọn xe & Kiểm tra thời gian trống',
      desc: 'Quý khách chọn loại xe máy hoặc ô tô tự lái phù hợp với lịch trình, chọn ngày giờ nhận - trả xe và địa điểm giao nhận (tại văn phòng, sân bay hoặc khách sạn). Hệ thống tự động kiểm tra lịch khả dụng tức thì.'
    },
    {
      step: 'Bước 2',
      title: 'Điền thông tin & Thanh toán cọc giữ chỗ 20%',
      desc: 'Nhập họ tên, số điện thoại và thông tin nhận xe. Tiến hành quét mã VietQR để thanh toán khoản cọc giữ chỗ (20% tiền thuê dự kiến). Khoản này nhằm khóa xe riêng cho quý khách và sẽ được đối trừ 100% vào tiền thuê khi ký hợp đồng.'
    },
    {
      step: 'Bước 3',
      title: 'Nhận mã xác nhận đặt xe (BK-xxxx)',
      desc: 'Ngay sau khi giao dịch thành công, hệ thống gửi biên lai xác nhận và mã đơn đặt xe. Lịch trình này được đồng bộ tức thì vào hệ thống điều phối nội bộ của nhân viên DriveRent để chuẩn bị xe sạch đẹp.'
    },
    {
      step: 'Bước 4',
      title: 'Nhận xe, kiểm tra bàn giao & Ký hợp đồng',
      desc: 'Đúng giờ hẹn, nhân viên đón quý khách tại địa điểm chỉ định. Hai bên cùng chụp ảnh 4 góc xe, ghi nhận đồng hồ ODO và mức xăng. Quý khách xuất trình CCCD & GPLX, thanh toán số tiền thuê còn lại và gửi tiền cọc bảo đảm hợp đồng.'
    },
    {
      step: 'Bước 5',
      title: 'Trả xe & Nhận lại 100% tiền cọc bảo đảm',
      desc: 'Khi kết thúc hành trình, nhân viên kiểm tra tình trạng xe theo biên bản ban đầu. Nếu xe nguyên vẹn, cửa hàng quyết toán dứt điểm và hoàn trả 100% tiền cọc bảo đảm cho quý khách bằng tiền mặt hoặc chuyển khoản ngay tại chỗ.'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header - Dark Glass */}
      <section className="relative overflow-hidden bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 text-white py-16 px-4 sm:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1520px] mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-white/20 backdrop-blur-md text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cẩm nang dành cho khách hàng</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Hướng dẫn quy trình thuê xe từ A - Z
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Mọi thủ tục tại DriveRent đều được tinh gọn, minh bạch và số hóa nhằm tiết kiệm tối đa thời gian quý báu của du khách khi đến Nha Trang.
          </p>
        </div>
      </section>

      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 space-y-12">
        {/* 5-Step Roadmap */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 backdrop-blur-md">
              <span className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">Lộ trình 5 bước đơn giản</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quy trình thuê xe nhanh chóng & bảo đảm
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="group bg-white/75 hover:bg-white/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:-translate-y-1 transition-all duration-300 space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      {item.step}
                    </span>
                    <span className="text-2xl font-black text-slate-200 group-hover:text-emerald-200 font-mono transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Papers & Documents Required */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Motorbike Requirements */}
          <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-7 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Điều kiện thuê xe máy</h3>
                <p className="text-xs text-slate-500">Áp dụng cho xe số, xe ga 110cc - 150cc</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Căn cước công dân hoặc Hộ chiếu (Passport):</strong> Bản gốc còn hạn. Nhân viên đối chiếu thông tin và gửi lại quý khách ngay sau khi ký hợp đồng.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Giấy phép lái xe hạng A1 hoặc A2:</strong> Hợp lệ theo quy định giao thông Việt Nam.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tiền cọc bảo đảm hợp đồng:</strong> 1.000.000 đ/xe máy (hoàn lại 100% bằng tiền mặt hoặc chuyển khoản ngay khi trả xe nguyên vẹn).
                </span>
              </li>
            </ul>
          </div>

          {/* Car Requirements */}
          <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-7 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Điều kiện thuê ô tô tự lái</h3>
                <p className="text-xs text-slate-500">Áp dụng cho Sedan 5 chỗ, Crossover & MPV 7 chỗ</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Căn cước công dân gắn chip hoặc Hộ chiếu:</strong> Người đứng tên hợp đồng phải đủ 20 tuổi trở lên.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Giấy phép lái xe ô tô hạng B1 hoặc B2 trở lên:</strong> Còn thời hạn lưu hành tối thiểu 06 tháng.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tiền cọc bảo đảm hợp đồng:</strong> 5.000.000 đ/ô tô (hoặc xe máy chính chủ có giá trị tương đương; hoàn lại 100% khi thanh lý hợp đồng).
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Financial Separation Distinction Callout - Liquid Glass Emerald */}
        <section className="bg-emerald-50/50 backdrop-blur-2xl border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(16,185,129,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-950">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <h3 className="text-lg sm:text-xl font-extrabold">
              Quy tắc tách bạch minh bạch giữa 2 khoản tiền cọc
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Để đảm bảo quyền lợi tài chính rõ ràng nhất cho khách hàng, DriveRent quy định phân định rạch ròi giữa <strong>Tiền cọc giữ chỗ trực tuyến</strong> và <strong>Tiền cọc bảo đảm hợp đồng</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-200/60 shadow-2xs space-y-2">
              <span className="text-xs font-black text-emerald-700 uppercase">1. Tiền cọc giữ chỗ trực tuyến (20%)</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Là khoản thanh toán ngay trên website khi đặt xe. Khoản này dùng để khóa lịch riêng cho xe. <strong>Được đối trừ 100% vào tiền thuê</strong> khi quý khách nhận xe.
              </p>
              <p className="text-[11px] text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                ✓ Được hoàn lại 100% nếu hủy đơn trước 24 giờ so với giờ hẹn nhận xe.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs font-black text-slate-900 uppercase">2. Tiền cọc bảo đảm hợp đồng (5tr hoặc 1tr)</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Là khoản tiền bảo đảm tài sản được nộp khi ký hợp đồng bàn giao xe thực tế. Khoản này <strong>không bị gộp vào doanh thu tiền thuê</strong> mà được giữ riêng biệt.
              </p>
              <p className="text-[11px] text-emerald-700 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                ✓ Hoàn lại 100% ngay khi quý khách bàn giao lại xe và hoàn tất quyết toán.
              </p>
            </div>
          </div>
        </section>

        {/* Time Calculation Rules & FAQ */}
        <section className="bg-white/75 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-6">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Quy định tính thời gian thuê & Phụ phí minh bạch
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="space-y-2 p-5 bg-slate-100/60 backdrop-blur-md rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Thuê theo ngày (24 giờ)</span>
              </div>
              <p>
                Mỗi ngày thuê được tính trọn vẹn 24 tiếng kể từ thời điểm nhận xe thực tế ghi trên biên bản bàn giao.
              </p>
              <p className="text-[11px] text-slate-500">
                Ví dụ: Nhận xe lúc 09:00 ngày 10/10 thì hạn trả xe là 09:00 ngày 11/10.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-slate-100/60 backdrop-blur-md rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Thuê theo giờ</span>
              </div>
              <p>
                Thời gian thuê làm tròn lên số giờ thực tế, tối thiểu 1 giờ. Nếu vượt quá thời gian đã đặt, hệ thống tính phụ phí theo đơn giá giờ niêm yết.
              </p>
              <p className="text-[11px] text-slate-500">
                Không tự ý chuyển đổi gói ngày/giờ nếu chưa có sự đồng ý của khách hàng.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-slate-100/60 backdrop-blur-md rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>Chính sách hoàn cọc giữ chỗ</span>
              </div>
              <p>
                Quý khách có thể tự hủy đơn đặt xe trên trang "Tra cứu đặt xe". Hủy trước 24 giờ: hoàn 100% tiền cọc giữ chỗ qua chuyển khoản.
              </p>
              <p className="text-[11px] text-slate-500">
                Hủy trong vòng 24 giờ trước giờ hẹn: tính phí hỗ trợ giữ xe theo quy định cửa hàng.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-2">
          <button
            onClick={() => {
              setCustomerTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 text-sm transition-all cursor-pointer"
          >
            Đã hiểu rõ thủ tục · Tìm xe & Đặt ngay
          </button>
        </section>
      </div>
    </div>
  );
};
