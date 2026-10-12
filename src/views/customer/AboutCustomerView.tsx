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
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-16 px-4 sm:px-8">
        <div className="max-w-[1520px] mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Về doanh nghiệp cho thuê xe DriveRent</span>
          </span>

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
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Câu chuyện & Tôn chỉ hoạt động
            </span>
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
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-2xl font-black text-blue-700 font-mono">100%</span>
                <p className="text-xs font-bold text-slate-800 mt-1">Xe đời mới 2023 - 2025</p>
                <p className="text-[11px] text-slate-500">Bảo dưỡng chính hãng định kỳ</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-2xl font-black text-emerald-700 font-mono">24/7</span>
                <p className="text-xs font-bold text-slate-800 mt-1">Cứu hộ & Giao nhận tận nơi</p>
                <p className="text-[11px] text-slate-500">Sân bay, nhà ga, khách sạn</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/60 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Đội ô tô tự lái</h4>
                <p className="text-xs text-slate-500">
                  Sedan 5 chỗ (Vios, Accent, Mazda 3), MPV 7 chỗ (Xpander, Veloz) và SUV gầm cao phục vụ gia đình.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/60 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Bike className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Đội xe máy du lịch</h4>
                <p className="text-xs text-slate-500">
                  Xe ga (Vision, Air Blade, Lead) và xe số (Wave Alpha) máy khỏe, tiết kiệm xăng, leo dốc đèo Rù Rì, Hòn Chồng, Bãi Dài êm ái.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/60 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
              <p className="text-xs text-slate-600">
                Khu vực phục vụ chính: Toàn bộ nội thành TP. Nha Trang (25 Lê Lợi), giao nhận miễn phí tại văn phòng và giao tận nơi tại Sân bay Quốc tế Cam Ranh, Ga Nha Trang, các resort Bãi Dài.
              </p>
            </div>
          </div>
        </section>

        {/* Maintenance & Inspection Quality Process */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Tiêu chuẩn kỹ thuật
            </span>
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
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative overflow-hidden"
              >
                <span className="text-3xl font-black text-blue-200 font-mono absolute top-3 right-4 select-none">
                  {item.step}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                  <Wrench className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 pt-1">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Store Location & Operational Info */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Trụ sở & Điểm tiếp đón
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Thông tin liên hệ và vị trí cửa hàng
              </h3>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Nội dung mẫu minh họa - Có thể điều chỉnh trong Cài đặt</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Địa chỉ văn phòng</span>
                <p className="font-bold text-slate-900 text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </p>
                <p className="text-xs text-slate-500 pl-6">
                  (Cách bãi biển Mỹ Khê 300m, thuận tiện đón trả xe nhanh chóng)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Hotline & Hỗ trợ kỹ thuật</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{settings.hotline} (Zalo / Gọi trực tiếp 24/7)</span>
                </p>
                <p className="text-xs text-slate-500 pl-6">
                  Email: {settings.email}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase">Thời gian phục vụ</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>06:00 - 22:00 tất cả các ngày trong tuần</span>
                </p>
                <p className="text-xs text-slate-500 pl-6">
                  (Giao xe đêm theo yêu cầu chuyến bay nếu đặt trước qua hệ thống)
                </p>
              </div>
            </div>

            {/* Interactive Map Mockup */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 relative min-h-[280px] flex flex-col justify-between p-6 text-white">
              <div className="absolute inset-0 bg-radial from-blue-950/80 to-slate-950 opacity-90" />
              {/* Map grid decorative lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:24px_24px]" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold">Bản đồ vị trí cửa hàng DriveRent Nha Trang</span>
                </div>
                <span className="text-[11px] text-slate-400">GPS: 12.2532° N, 109.1947° E</span>
              </div>

              <div className="relative z-10 my-auto text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/50 animate-bounce">
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
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/20 text-sm transition-all cursor-pointer"
          >
            Khám phá đội xe & Đặt giữ chỗ trực tuyến ngay
          </button>
        </section>
      </div>
    </div>
  );
};
