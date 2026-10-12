import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Bike,
  ShieldCheck,
  Wrench,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
  Award,
  Users,
  Compass,
  FileText,
  AlertCircle
} from 'lucide-react';

export const AboutCustomerView: React.FC = () => {
  const { settings, setCustomerTab } = useApp();

  const maintenanceStandards = [
    {
      step: '01',
      title: 'Kiểm tra kỹ thuật 12 hạng mục',
      desc: 'Hệ thống phanh ABS, áp suất và gai lốp, dầu nhớt, nước làm mát, đèn chiếu sáng, còi và bình ắc quy được kỹ thuật viên đo kiểm trước mỗi lượt giao xe.'
    },
    {
      step: '02',
      title: 'Vệ sinh khoang lái & diệt khuẩn 100%',
      desc: 'Hút bụi toàn diện, lau bề mặt bằng dung dịch kháng khuẩn chuyên dụng, khử mùi điều hòa và rửa vỏ xe sạch bóng trước khi bàn giao cho quý khách.'
    },
    {
      step: '03',
      title: 'Kiểm kê phụ kiện & giấy tờ hợp lệ',
      desc: 'Trang bị 02 mũ bảo hiểm đạt chuẩn có kính, áo mưa tiện lợi, giá đỡ điện thoại dẫn đường và bản sao công chứng giấy đăng ký xe kèm bảo hiểm bắt buộc.'
    },
    {
      step: '04',
      title: 'Biên bản bàn giao minh bạch 2 chiều',
      desc: 'Chụp ảnh 4 góc thân xe, ghi nhận chính xác chỉ số đồng hồ ODO và vạch xăng. Có chữ ký xác nhận của cả khách hàng và nhân viên giao nhận.'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header - Dark Glass */}
      <section className="relative overflow-hidden bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 text-white py-16 px-4 sm:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1520px] mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-white/20 backdrop-blur-md text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Về doanh nghiệp cho thuê xe DriveRent</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Người bạn đồng hành tin cậy trên mọi cung đường
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            DriveRent là đơn vị chuyên cung cấp dịch vụ cho thuê xe máy du lịch và ô tô tự lái tại thành phố Nha Trang (25 Lê Lợi), phục vụ hàng chục ngàn du khách và chuyên gia mỗi năm.
          </p>
        </div>
      </section>

      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Intro Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 backdrop-blur-md">
              <span className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">Câu chuyện & Tôn chỉ hoạt động</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mang lại trải nghiệm di chuyển tự do, an tâm và minh bạch nhất
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Khởi đầu từ một cửa hàng cho thuê xe nhỏ tại quận Sơn Trà, DriveRent hiểu rằng chiếc xe không chỉ là phương tiện di chuyển, mà là một phần không thể thiếu tạo nên những kỷ niệm đẹp trong kỳ nghỉ của du khách.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Chúng tôi xóa bỏ nỗi lo xe cũ máy yếu, hỏng vặt giữa đèo hoặc chi phí phụ thu mập mờ bằng việc chuẩn hóa 100% đội xe đời mới, hợp đồng số hóa rõ ràng và quy trình cọc giữ chỗ trực tuyến tiện lợi.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)]">
                <span className="text-2xl font-black text-emerald-700 font-mono">100%</span>
                <p className="text-xs font-bold text-slate-800 mt-1">Xe đời mới 2023 - 2025</p>
                <p className="text-[11px] text-slate-500">Bảo dưỡng chính hãng định kỳ</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 backdrop-blur-2xl border border-emerald-500/20 shadow-2xs">
                <span className="text-2xl font-black text-emerald-700 font-mono">24/7</span>
                <p className="text-xs font-bold text-slate-800 mt-1">Cứu hộ & Giao nhận tận nơi</p>
                <p className="text-[11px] text-slate-500">Sân bay, nhà ga, khách sạn</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase - Liquid Glass */}
          <div className="bg-white/75 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-2xl p-4 shadow-2xs border border-slate-200/60 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                  <Car className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Đội ô tô tự lái</h4>
                <p className="text-xs text-slate-500">
                  Sedan 5 chỗ (Vios, Accent, Mazda 3), MPV 7 chỗ (Xpander, Veloz) và SUV gầm cao phục vụ gia đình.
                </p>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 shadow-2xs border border-slate-200/60 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30">
                  <Bike className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Đội xe máy du lịch</h4>
                <p className="text-xs text-slate-500">
                  Xe ga (Vision, Air Blade, Lead) và xe số (Wave Alpha) máy khỏe, tiết kiệm xăng, leo dốc đèo Rù Rì, Hòn Chồng, Bãi Dài êm ái.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <p className="text-xs text-slate-700">
                Khu vực phục vụ chính: Toàn bộ nội thành TP. Nha Trang (25 Lê Lợi), giao nhận miễn phí tại văn phòng và giao tận nơi tại Sân bay Quốc tế Cam Ranh, Ga Nha Trang, các resort Bãi Dài.
              </p>
            </div>
          </div>
        </section>

        {/* Maintenance & Inspection Quality Process */}
        <section className="bg-white/75 backdrop-blur-2xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 backdrop-blur-md">
              <span className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">Tiêu chuẩn kỹ thuật</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quy trình kiểm tra, vệ sinh & bảo dưỡng xe khắt khe
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Mỗi lượt xe trước khi bàn giao đều trải qua quy trình rà soát độc lập bởi kỹ thuật viên phụ trách để đảm bảo an toàn tuyệt đối cho người ngồi trên xe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenanceStandards.map((item) => (
              <div
                key={item.step}
                className="group p-5 rounded-2xl bg-white/70 hover:bg-white/95 backdrop-blur-md border border-white/80 shadow-2xs hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-200 font-mono absolute top-3 right-4 select-none transition-colors">
                  {item.step}
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-sm shadow-emerald-600/30">
                  <Wrench className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors pt-1">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Store Location & Operational Info */}
        <section className="bg-white/75 backdrop-blur-2xl rounded-3xl p-8 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.9)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 backdrop-blur-md mb-2">
                <span className="text-[11px] font-bold text-emerald-700 tracking-wide uppercase">Trụ sở & Điểm tiếp đón</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Thông tin liên hệ và vị trí cửa hàng
              </h3>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-800 text-xs font-semibold backdrop-blur-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Nội dung mẫu minh họa - Có thể điều chỉnh trong Cài đặt</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Địa chỉ văn phòng</span>
                <p className="font-bold text-slate-900 text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </p>
                <p className="text-xs text-slate-500 pl-6">
                  (Cách bãi biển Trần Phú 300m, thuận tiện đón trả xe nhanh chóng)
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Hotline & Hỗ trợ kỹ thuật</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settings.hotline} (Zalo / Gọi trực tiếp 24/7)</span>
                </p>
                <p className="text-xs text-slate-500 pl-6">
                  Email: {settings.email}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Thời gian phục vụ</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>06:00 - 22:00 tất cả các ngày trong tuần</span>
                </p>
                <p className="text-xs text-slate-500 pl-6">
                  (Giao xe đêm theo yêu cầu chuyến bay nếu đặt trước qua hệ thống)
                </p>
              </div>
            </div>

            {/* Interactive Map Mockup - Dark Glass */}
            <div className="lg:col-span-2 bg-slate-950 rounded-2xl overflow-hidden border border-white/20 relative min-h-[280px] flex flex-col justify-between p-6 text-white">
              <div className="absolute inset-0 bg-radial from-emerald-950/40 via-slate-950/80 to-slate-950" />
              {/* Map grid decorative lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:24px_24px]" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-md">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">Bản đồ vị trí cửa hàng DriveRent Nha Trang</span>
                </div>
                <span className="text-[11px] text-slate-400">GPS: 12.2532° N, 109.1947° E</span>
              </div>

              <div className="relative z-10 my-auto text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/50 animate-bounce">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">DriveRent - Trụ sở 25 Lê Lợi, TP. Nha Trang</h4>
                  <p className="text-xs text-slate-300">25 Lê Lợi, Phường Xương Huân, TP. Nha Trang, Khánh Hòa</p>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <span>Cách bãi biển Trần Phú: 2 phút đi bộ</span>
                <span>Cách chợ Đầm: 3 phút di chuyển</span>
                <span>Cách Ga Nha Trang: 6 phút di chuyển</span>
                <span>Cách Sân bay Cam Ranh: 35 phút di chuyển</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-4">
          <button
            onClick={() => {
              setCustomerTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 text-sm transition-all cursor-pointer"
          >
            Khám phá đội xe & Đặt giữ chỗ trực tuyến ngay
          </button>
        </section>
      </div>
    </div>
  );
};
