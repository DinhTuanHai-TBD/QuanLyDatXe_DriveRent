import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Bike,
  Calendar,
  Clock,
  MapPin,
  Search,
  CheckCircle2,
  ShieldCheck,
  Fuel,
  ArrowRight,
  HelpCircle,
  Sparkles,
  PhoneCall,
  ChevronDown
} from 'lucide-react';
import { formatVND } from '../../utils/formatters';

export const HomeCustomerView: React.FC = () => {
  const {
    vehicles,
    setCustomerTab,
    setSelectedCustomerVehicleId,
    customerSearchCriteria,
    setCustomerSearchCriteria,
    checkVehicleAvailability
  } = useApp();

  // Local search widget inputs
  const [vehicleType, setVehicleType] = useState(customerSearchCriteria.vehicleType || 'all');
  const [startDate, setStartDate] = useState(customerSearchCriteria.startDate);
  const [endDate, setEndDate] = useState(customerSearchCriteria.endDate);
  const [pickupLocation, setPickupLocation] = useState(customerSearchCriteria.pickupLocation);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerSearchCriteria({
      vehicleType,
      startDate,
      endDate,
      pickupLocation
    });
    setCustomerTab('vehicles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedCustomerVehicleId(vehicleId);
    setCustomerTab('vehicle_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured vehicles (4 vehicles)
  const featuredVehicles = vehicles.slice(0, 4);

  const faqs = [
    {
      q: 'Cần những giấy tờ gì khi đến nhận xe tự lái tại DriveRent?',
      a: 'Quý khách chỉ cần mang theo: (1) Căn cước công dân hoặc Hộ chiếu gốc còn thời hạn; (2) Giấy phép lái xe hợp lệ tương ứng với loại xe thuê (Hạng A1/A2 đối với xe máy, Hạng B1/B2 trở lên đối với ô tô). Nhân viên sẽ đối chiếu và gửi lại giấy tờ cho quý khách ngay khi ký hợp đồng.'
    },
    {
      q: 'Tiền cọc giữ chỗ trực tuyến khác gì với tiền cọc bảo đảm hợp đồng khi nhận xe?',
      a: 'Tiền cọc giữ chỗ trực tuyến (thường là 20% tiền thuê dự kiến) nhằm đảm bảo xe được khóa lịch và giữ riêng cho quý khách trên hệ thống. Khoản này sẽ được đối trừ trực tiếp vào tiền thuê xe. Còn tiền cọc bảo đảm hợp đồng (5.000.000 đ cho ô tô hoặc 1.000.000 đ cho xe máy) sẽ được gửi lại 100% cho quý khách ngay khi bàn giao lại xe nguyên vẹn.'
    },
    {
      q: 'Quy tắc tính thời gian thuê xe tại DriveRent như thế nào?',
      a: 'DriveRent áp dụng quy tắc rõ ràng: Thuê theo ngày tính trọn vẹn 24 giờ kể từ thời điểm nhận xe thực tế (làm tròn lên ngày kế tiếp nếu quá giờ quy định). Thuê theo giờ tính làm tròn lên số giờ thực tế, tối thiểu 1 giờ. Chúng tôi không tự ý hoán đổi giữa các gói để luôn đảm bảo quyền lợi tốt nhất cho khách hàng.'
    },
    {
      q: 'Chính sách hủy đơn đặt xe và hoàn tiền cọc giữ chỗ ra sao?',
      a: 'Nếu kế hoạch chuyến đi thay đổi, quý khách có thể gửi yêu cầu hủy trên trang "Tra cứu đặt xe" hoặc liên hệ hotline. Hủy trước 24 giờ so với giờ nhận xe sẽ được hoàn trả 100% tiền cọc giữ chỗ. Hủy trong vòng 24 giờ sẽ áp dụng phí xử lý giữ xe theo quy chế của cửa hàng.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-900 to-slate-900 text-white pt-14 pb-24 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dịch vụ cho thuê xe uy tín tại TP. Đà Nẵng</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Thuê xe dễ dàng cho hành trình của bạn
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Trải nghiệm vi vu Đà Nẵng, Hội An, Bà Nà Hills và đèo Hải Vân với đội xe máy và ô tô tự lái đời mới, sạch sẽ, máy êm và thủ tục giữ chỗ trực tuyến nhanh chóng.
            </p>
          </div>

          {/* QUICK SEARCH WIDGET CARD */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 text-slate-900 shadow-xl border border-slate-200">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-blue-600" />
                  Tìm & Kiểm tra xe còn trống theo thời gian
                </span>

                {/* Segmented type selector */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setVehicleType('all')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      vehicleType === 'all'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả xe
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('car')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      vehicleType === 'car'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ô tô tự lái
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('motorbike')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      vehicleType === 'motorbike'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Xe máy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Pickup Location */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Địa điểm nhận xe</span>
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 text-xs"
                  >
                    <option value="Văn phòng DriveRent (182 Võ Nguyên Giáp)">
                      Văn phòng DriveRent (182 Võ Nguyên Giáp, Sơn Trà)
                    </option>
                    <option value="Sân bay Quốc tế Đà Nẵng">
                      Sân bay Quốc tế Đà Nẵng (Giao tận cổng ga)
                    </option>
                    <option value="Ga đường sắt Đà Nẵng">Ga đường sắt Đà Nẵng</option>
                    <option value="Khách sạn nội thành Đà Nẵng (Quận Hải Châu / Sơn Trà)">
                      Khách sạn nội thành Đà Nẵng (Quận Hải Châu / Sơn Trà)
                    </option>
                  </select>
                </div>

                {/* Pickup Date Time */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ngày & Giờ nhận xe *</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 text-xs"
                  />
                </div>

                {/* Return Date Time */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ngày & Giờ trả xe *</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 text-xs"
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Tìm xe còn trống</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* QUICK ABOUT INTRO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Về dịch vụ DriveRent Đà Nẵng
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tự do khám phá thành phố biển theo cách của bạn
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              DriveRent là đơn vị cho thuê xe máy và ô tô tự lái tại các cung đường du lịch nổi tiếng miền Trung. Chúng tôi tập trung vào trải nghiệm đặt xe nhanh chóng, minh bạch về giá cả, không phí ẩn và phương tiện luôn được bảo dưỡng định kỳ trước khi bàn giao.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCustomerTab('about')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <span>Xem thêm quy trình kiểm tra xe của chúng tôi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="md:w-1/2 grid grid-cols-2 gap-3 w-full">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Car className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
              <p className="font-extrabold text-sm text-slate-900">Ô tô 5-7 chỗ</p>
              <p className="text-[11px] text-slate-500">Vios, Accent, Xpander MPV</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Bike className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
              <p className="font-extrabold text-sm text-slate-900">Xe máy tay ga & số</p>
              <p className="text-[11px] text-slate-500">Vision, Air Blade, Sirius Fi</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
              <p className="font-extrabold text-sm text-slate-900">Đặt cọc online 20%</p>
              <p className="text-[11px] text-slate-500">Giữ xe chắc chắn 100%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <ShieldCheck className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
              <p className="font-extrabold text-sm text-slate-900">Kiểm tra 6 hạng mục</p>
              <p className="text-[11px] text-slate-500">Chụp ảnh đối chiếu minh bạch</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Phương tiện tiêu biểu
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Danh sách xe nổi bật được yêu thích nhất
            </h2>
          </div>
          <button
            onClick={() => setCustomerTab('vehicles')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <span>Xem tất cả {vehicles.length} xe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredVehicles.map((v) => {
            const availability = checkVehicleAvailability(v.id, startDate, endDate);
            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs">
                        {v.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-extrabold text-base text-slate-900 truncate">{v.name}</h3>
                    <p className="text-xs text-slate-500">
                      {v.transmission} · Đời {v.year} · {v.color}
                    </p>

                    {/* Features badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {v.features.slice(0, 2).map((feat, idx) => (
                        <span key={idx} className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-2 space-y-3">
                  <div className="flex items-baseline justify-between pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Giá thuê ngày</span>
                      <span className="text-sm font-extrabold text-blue-700 font-mono">
                        {formatVND(v.dailyPrice)}/ngày
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatVND(v.hourlyPrice)}/h
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSelectVehicle(v.id)}
                      className="w-full py-2 px-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleSelectVehicle(v.id)}
                      className="w-full py-2 px-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center shadow-2xs"
                    >
                      Đặt xe này
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 CORE SERVICE BENEFITS */}
      <section className="bg-slate-100 py-12 px-4 sm:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Cam kết dịch vụ
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Lợi ích khi lựa chọn thuê xe tại DriveRent
            </h2>
            <p className="text-xs text-slate-600">
              Mọi thủ tục đều rõ ràng, bảo vệ quyền lợi tối đa cho khách hàng du lịch
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Báo giá minh bạch, rõ ràng</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đơn giá niêm yết công khai theo ngày và giờ. Không tự ý phát sinh phụ phí ẩn khi bàn giao xe.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Thông tin xe đầy đủ 100%</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ảnh chụp thực tế, biển số thật, số km hiện tại và hạn đăng kiểm bảo hiểm luôn cập nhật chính xác.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Giao nhận có biên bản đối chiếu</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kiểm tra 6 hạng mục kỹ thuật, chụp ảnh hiện trạng lúc nhận và lúc trả để đối chiếu công bằng.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Hỗ trợ khách hàng 24/7</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đội ngũ kỹ thuật viên luôn sẵn sàng hỗ trợ chỉ đường, hướng dẫn vận hành và cứu hộ khẩn cấp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RENTAL WORKFLOW (5 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Quy trình tiện lợi
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            5 bước thuê xe đơn giản tại DriveRent
          </h2>
          <p className="text-xs text-slate-600">
            Giữ chỗ nhanh chóng trực tuyến, nhận xe tiện lợi ngay tại sân bay hoặc khách sạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Chọn xe & Lịch thuê', desc: 'Chọn mẫu xe máy hoặc ô tô phù hợp với lịch trình du lịch.' },
            { step: '02', title: 'Điền thông tin', desc: 'Nhập họ tên, số điện thoại và địa điểm nhận xe thuận tiện.' },
            { step: '03', title: 'Cọc giữ chỗ online', desc: 'Thanh toán cọc giữ chỗ 20% qua chuyển khoản hoặc ví điện tử.' },
            { step: '04', title: 'Nhận mã xác nhận', desc: 'Hệ thống xác minh và cấp mã đặt xe cùng biên lai tức thì.' },
            { step: '05', title: 'Nhận xe & Ký hợp đồng', desc: 'Mang CCCD/GPLX đến nhận xe, đối chiếu tình trạng và vi vu.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-blue-600 font-black text-xl font-mono">{item.step}</span>
              <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Giải đáp thắc mắc
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Câu hỏi thường gặp của khách hàng
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sẵn sàng cho chuyến du lịch Đà Nẵng tuyệt vời?
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
              Kiểm tra lịch xe còn trống và đặt cọc giữ chỗ ngay hôm nay để nhận xe đúng giờ tại sân bay!
            </p>
          </div>
          <button
            onClick={() => {
              setCustomerTab('vehicles');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-xl shadow-md text-sm shrink-0 transition-all cursor-pointer"
          >
            Xem danh sách xe & Đặt giữ chỗ
          </button>
        </div>
      </section>
    </div>
  );
};
