import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Car,
  Bike,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ContactCustomerView: React.FC = () => {
  const { settings, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleInterest, setVehicleInterest] = useState('car');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Vui lòng nhập họ tên và số điện thoại của bạn', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Yêu cầu tư vấn của bạn đã được gửi thành công!', 'success');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kết nối với DriveRent Nha Trang</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Liên hệ & Hỗ trợ khách hàng 24/7
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Đội ngũ tư vấn viên và kỹ thuật viên cứu hộ luôn sẵn sàng hỗ trợ quý khách trên mọi hành trình khám phá thành phố biển Nha Trang, Cam Ranh và các vịnh đảo.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Details & Channels */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Kênh liên hệ trực tiếp
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Chúng tôi luôn sẵn sàng lắng nghe bạn
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Hãy gọi hotline để được giải đáp tức thì hoặc ghé thăm văn phòng giao nhận xe tại số 25 Lê Lợi, TP. Nha Trang.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Văn phòng chính</span>
                <p className="font-bold text-slate-900 text-sm flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </p>
                <p className="text-xs text-slate-500 pl-7">
                  Điểm giao xe trung tâm ngay góc Lê Lợi - gần biển Trần Phú và Chợ Đầm, thuận tiện di chuyển mọi hướng.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Hotline & Cứu hộ khẩn cấp</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-blue-700 font-extrabold text-base">{settings.hotline}</span>
                  <span className="text-xs text-slate-500 font-normal">(Gọi trực tiếp / Zalo 24/7)</span>
                </p>
                <p className="text-xs text-slate-500 pl-7">
                  Hỗ trợ xử lý sự cố thủng lốp, chết máy, quên chìa khóa trong vòng 15 - 25 phút nội thành TP. Nha Trang.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Giờ hoạt động đón khách</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>06:00 - 22:00 tất cả các ngày (Kể cả Thứ 7, Chủ Nhật & Lễ Tết)</span>
                </p>
                <p className="text-xs text-slate-500 pl-7">
                  Khách hạ cánh sân bay ngoài giờ mở cửa vui lòng đặt trước trên web để nhân viên bố trí xe chờ sẵn.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
              <span>
                Cam kết giá thuê niêm yết công khai, không thu phụ phí phát sinh ngoài thỏa thuận hợp đồng.
              </span>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Gửi yêu cầu tư vấn / Thuê xe theo đoàn</h3>
              <p className="text-xs text-slate-500">
                Nhân viên DriveRent sẽ liên hệ lại với bạn qua điện thoại trong vòng 15 phút.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-emerald-900">
                  Cảm ơn bạn đã gửi liên hệ!
                </h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Nhân viên trực tổng đài DriveRent đã nhận được tin nhắn và sẽ gọi lại cho bạn theo số điện thoại <strong>{phone}</strong> ngay.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên của bạn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn An"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại nhận tư vấn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0905 123 456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa chỉ email (Tùy chọn)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Loại xe quý khách quan tâm
                  </label>
                  <select
                    value={vehicleInterest}
                    onChange={(e) => setVehicleInterest(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="car">Ô tô tự lái (Sedan 5 chỗ hoặc 7 chỗ MPV/SUV)</option>
                    <option value="motorbike">Xe máy tay ga / Xe số du lịch</option>
                    <option value="fleet">Thuê theo đoàn đông người / Dài ngày</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nội dung thắc mắc hoặc yêu cầu riêng
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ví dụ: Chúng tôi cần thuê 2 xe 7 chỗ tự lái từ ngày 12/10 đến 15/10 nhận tại Sân bay Cam Ranh..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi tin nhắn yêu cầu hỗ trợ</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Location Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Vị trí văn phòng trên bản đồ
              </h3>
              <p className="text-xs text-slate-500">25 Lê Lợi, Phường Xương Huân, TP. Nha Trang, Khánh Hòa</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-1.5 transition-colors"
            >
              <span>Mở trên Google Maps</span>
            </a>
          </div>

          <div className="h-64 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-200 flex items-center justify-center text-white">
            <div className="absolute inset-0 bg-radial from-blue-950 to-slate-950 opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="relative z-10 text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/50">
                <MapPin className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-black text-lg text-white">Cửa hàng cho thuê xe DriveRent Nha Trang</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Tọa lạc tại 25 Lê Lợi, TP. Nha Trang - cách bờ biển Trần Phú và Chợ Đầm chỉ vài phút. Điểm xuất phát lý tưởng khám phá vịnh Nha Trang, cung đường đèo Lương Sơn và Bãi Dài Cam Ranh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
