import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  Car,
  Bike,
  Users,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Mail,
  User,
  PhoneCall,
  ChevronDown,
  Wrench,
  Navigation,
  HelpCircle,
  Zap,
  LocateFixed,
  Building2,
  QrCode,
  Plane,
  Train,
  FileText
} from 'lucide-react';

import nhaTrangCoastalBay from '../../assets/images/nha_trang_coastal_bay.jpg';

export const ContactCustomerView: React.FC = () => {
  const { settings, showToast, t } = useApp();

  const brandName = settings?.brandTitle || settings?.storeName || 'DriveRent Nha Trang';
  const address = settings?.address || '25 Lê Lợi, Phường Xương Huân, TP. Nha Trang, Tỉnh Khánh Hòa';
  const hotline = settings?.hotline || '0905 888 999';
  const email = settings?.email || 'hotro@driverent.vn';

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [vehicleInterest, setVehicleInterest] = useState<'car' | 'motorbike' | 'chauffeur'>('car');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // GPS Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Active Station (Showroom / Cam Ranh Airport / Nha Trang Railway Station)
  const [selectedStation, setSelectedStation] = useState<'showroom' | 'airport' | 'train'>('showroom');

  // FAQ Accordion State (first open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Submitted ticket summary
  const [lastSubmittedInfo, setLastSubmittedInfo] = useState<{
    name: string;
    phone: string;
    category: 'car' | 'motorbike' | 'chauffeur';
    tagLabel?: string;
    gps?: { lat: number; lng: number };
  } | null>(null);

  // 3 Key delivery stations in Nha Trang
  const stations = [
    {
      id: 'showroom' as const,
      name: 'Showroom Trung Tâm Lê Lợi',
      badge: 'Trạm Chính',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      address: '25 Lê Lợi, P. Xương Huân, TP. Nha Trang',
      landmark: 'Góc ngã 4 Lê Lợi - Phan Chu Trinh (Cách Chợ Đầm 300m, Biển Trần Phú 400m)',
      hours: '06:00 - 22:00 hàng ngày',
      icon: Building2,
      mapQuery: '25%20L%C3%AA%20L%E1%BB%A3i%2C%20X%C6%B0%C6%A1ng%20Hu%C3%A2n%2C%20Nha%20Trang%2C%20Kh%C3%A1nh%20H%C3%B2a',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25+L%C3%AA+L%E1%BB%A3i,+X%C6%B0%C6%A1ng+Hu%C3%A2n,+Nha+Trang,+Kh%C3%A1nh+H%C3%B2a',
      coords: '12.2532° N, 109.1947° E'
    },
    {
      id: 'airport' as const,
      name: 'Sân bay Quốc tế Cam Ranh (CXR)',
      badge: 'Giao Sảnh Ga Đến',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      address: 'Cổng Ga Đến Quốc Nội (T1) & Quốc Tế (T2), Sân bay Cam Ranh',
      landmark: 'Nhân viên trực tiếp đón khách tại sảnh đến, kiểm tra và bàn giao xe trong 10 phút',
      hours: 'Phục vụ 24/7 theo số hiệu chuyến bay hạ cánh',
      icon: Plane,
      mapQuery: 'Cam%20Ranh%20International%20Airport%2C%20Khanh%20Hoa',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Cam+Ranh+International+Airport,+Khanh+Hoa',
      coords: '11.9981° N, 109.2193° E'
    },
    {
      id: 'train' as const,
      name: 'Ga Đường Sắt Nha Trang',
      badge: 'Quảng Trường 19/8',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      address: '17 Thái Nguyên, P. Phước Tân, TP. Nha Trang',
      landmark: 'Cổng ga trung tâm, đón khách tàu hỏa Bắc - Nam, giao xe nhanh 10 phút sau khi tàu dừng',
      hours: '06:00 - 22:00 (Linh hoạt theo lịch trình tàu)',
      icon: Train,
      mapQuery: 'Ga%20Nha%20Trang%2C%20Th%C3%A1i%20Nguy%C3%AAn%2C%20Nha%20Trang',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ga+Nha+Trang,+Th%C3%A1i+Nguy%C3%AAn,+Nha+Trang',
      coords: '12.2472° N, 109.1868° E'
    }
  ];

  const activeStationData = stations.find((s) => s.id === selectedStation) || stations[0];

  // Quick dispatch tags
  const quickTags = [
    {
      id: 'sos',
      label: '🆘 Cứu hộ sự cố khẩn cấp',
      category: 'car' as const,
      presetMsg: 'Tôi cần hỗ trợ cứu hộ xe gặp sự cố (thủng lốp / ắc quy / chết máy) tại Nha Trang.'
    },
    {
      id: 'airport',
      label: '✈️ Đón tiễn Sân bay Cam Ranh',
      category: 'car' as const,
      presetMsg: 'Tôi cần hỗ trợ giao xe tại Sân bay Quốc tế Cam Ranh theo mã chuyến bay.'
    },
    {
      id: 'family',
      label: '🚗 Thuê ô tô tự lái du lịch',
      category: 'car' as const,
      presetMsg: 'Tôi cần tư vấn thủ tục và nhận xe ô tô tự lái tại khách sạn nội thành Nha Trang.'
    },
    {
      id: 'bike',
      label: '🛵 Thuê xe máy vi vu nội ô',
      category: 'motorbike' as const,
      presetMsg: 'Tôi muốn tư vấn thuê xe máy / xe máy điện giao tận nơi tại khách sạn.'
    }
  ];

  const handleSelectTag = (tag: typeof quickTags[0]) => {
    if (selectedTag === tag.id) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag.id);
      setVehicleInterest(tag.category);
      if (!message || quickTags.some((q) => q.presetMsg === message)) {
        setMessage(tag.presetMsg);
      }
    }
  };

  // Helper auto-format Vietnamese phone numbers
  const formatPhoneNumber = (val: string) => {
    const raw = val.replace(/[^\d+]/g, '');
    if (raw.startsWith('+84')) {
      const rest = raw.slice(3).replace(/\D/g, '').slice(0, 9);
      if (rest.length <= 3) return `+84 ${rest}`;
      if (rest.length <= 6) return `+84 ${rest.slice(0, 3)} ${rest.slice(3)}`;
      return `+84 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 9)}`;
    }
    const digits = raw.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  };

  // 1-Touch satellite GPS geolocation
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      showToast('Trình duyệt không hỗ trợ định vị GPS trực tiếp.', 'error');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        setGpsLocation({ lat, lng });
        setIsLocating(false);
        showToast(`Đã xác định vị trí vệ tinh: ${lat}, ${lng}`, 'success');

        const gpsNote = `[Tọa độ GPS sự cố: ${lat}, ${lng}]`;
        setMessage((prev) => (prev.includes(gpsNote) ? prev : `${prev ? prev + '\n' : ''}${gpsNote}`));
      },
      () => {
        setIsLocating(false);
        showToast('Chưa thể lấy vị trí. Vui lòng cấp quyền truy cập vị trí trên trình duyệt.', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Vui lòng nhập Họ tên và Số điện thoại liên hệ.', 'error');
      return;
    }

    setLastSubmittedInfo({
      name: fullName,
      phone: phone,
      category: vehicleInterest,
      tagLabel: selectedTag ? quickTags.find((q) => q.id === selectedTag)?.label : undefined,
      gps: gpsLocation || undefined
    });
    setIsSubmitted(true);
    showToast('Đã gửi thông tin! Đội ngũ điều phối sẽ liên hệ lại ngay.', 'success');
  };

  // Concise FAQs under 2 sentences
  const faqs = [
    {
      q: 'Khách hạ cánh đêm sau 22:00 tại Sân bay Cam Ranh có được bàn giao xe không?',
      a: 'Có. Đội ngũ DriveRent trực sảnh 24/7 theo số hiệu chuyến bay thực tế của quý khách mà không tính phụ phí đêm.'
    },
    {
      q: 'Dịch vụ giao nhận xe tận sảnh khách sạn hoặc resort có tính thêm phí không?',
      a: 'Hoàn toàn miễn phí 100% trong phạm vi nội thành Nha Trang cho tất cả các đơn thuê xe từ 1 ngày trở lên.'
    },
    {
      q: 'Nếu xe gặp sự cố thủng lốp hoặc chết máy trên đường thì liên hệ bằng cách nào?',
      a: 'Quý khách hãy gọi ngay Hotline 0905 888 999 hoặc bấm nút gửi GPS trên trang web; đội cứu hộ sẽ có mặt trong 15–20 phút để hỗ trợ miễn phí.'
    },
    {
      q: 'Khách hàng đoàn thể, công tác cần xuất hóa đơn VAT điện tử thì thủ tục ra sao?',
      a: 'Quý khách chỉ cần gửi mã số thuế và thông tin công ty qua Zalo hoặc Email; hóa đơn điện tử hợp lệ sẽ được xuất và gửi trong ngày.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 space-y-10 sm:space-y-12">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO COVER WIDE PANORAMA 1440PX                                */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden w-full min-h-[380px] sm:min-h-[420px] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-b border-sky-200/80 shadow-xs"
        style={{
          backgroundImage: `url(${nhaTrangCoastalBay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-sky-950/85 to-slate-950/90 pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-center space-y-4 my-auto">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-cyan-300 border border-white/20 backdrop-blur-md text-xs font-bold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="tracking-wide uppercase font-black">
              TRUNG TÂM ĐIỀU HÀNH &amp; CỨU HỘ 24/7 &bull; NHA TRANG
            </span>
          </div>

          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-md">
              Kênh Liên Hệ &bull; Điều Phối &amp; Cứu Hộ Giao Thông
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-200 max-w-3xl mx-auto drop-shadow-sm leading-relaxed">
              Tổng đài tiếp nhận yêu cầu giao nhận xe tận nơi, cứu hộ kỹ thuật lưu động và hỗ trợ pháp lý du khách 24/7 toàn tỉnh Khánh Hòa.
            </p>
          </div>

          {/* 3 Quick Commitment Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-black">
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bắt máy sau 3 tiếng chuông</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Cứu hộ nội thành &lt; 20 phút</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 backdrop-blur-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Trực sảnh Sân bay Cam Ranh 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container 1440px chứa các Section độc lập */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10 sm:space-y-12">
        
        {/* ========================================================================= */}
        {/* SECTION 2: ĐƯỜNG DÂY NÓNG & KÊNH KẾT NỐI TRỰC TIẾP                        */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Kênh liên hệ trực tiếp
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Đường Dây Nóng Khẩn Cấp &amp; Hỗ Trợ Đa Kênh
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Phục vụ liên tục 24/7 &bull; Không nghỉ Lễ, Tết
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Tổng đài SOS 24/7 */}
            <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/20 p-5 sm:p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-rose-200/80">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                    </span>
                    <h3 className="font-black text-slate-900 text-base">Tổng Đài Cứu Hộ SOS</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white">
                    24/7 Toàn Tỉnh
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Chuyên tiếp nhận sự cố kỹ thuật dọc đường (thủng lốp, hết bình, chết máy) và hỗ trợ đổi chuyến bay khẩn cấp.
                </p>

                <a
                  href={`tel:${hotline.replace(/\s+/g, '')}`}
                  className="block p-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-center font-black transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-rose-100 uppercase tracking-wider">Bấm gọi tức thì</div>
                  <div className="text-2xl font-mono tracking-tight tabular-nums mt-0.5 flex items-center justify-center gap-2">
                    <PhoneCall className="w-5 h-5 shrink-0" />
                    <span>{hotline}</span>
                  </div>
                </a>
              </div>

              <div className="pt-3 border-t border-rose-200/80 text-[11px] font-bold text-rose-800 flex items-center justify-between">
                <span>Vá vỏ &bull; Kích bình</span>
                <span>Đổi xe lưu động 0đ</span>
              </div>
            </div>

            {/* Card 2: Zalo OA & WhatsApp */}
            <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/20 p-5 sm:p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-sky-200/80">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-sky-700" />
                    <h3 className="font-black text-slate-900 text-base">Zalo &amp; WhatsApp</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-700 text-white">
                    Phản Hồi &lt; 3 Phút
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Kênh gửi ảnh xe thực tế, gửi định vị vị trí gặp sự cố và trao đổi hợp đồng song ngữ cho khách quốc tế.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://zalo.me/${hotline.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Zalo OA</span>
                  </a>

                  <a
                    href={`https://wa.me/${hotline.replace(/\s+/g, '').replace(/^0/, '84')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-sky-200/80 text-[11px] font-bold text-sky-800 flex items-center justify-between">
                <span>Hỗ trợ tiếng Anh &bull; Nga</span>
                <span>Gửi ảnh xe thật 100%</span>
              </div>
            </div>

            {/* Card 3: Khách hàng doanh nghiệp & Hóa đơn VAT */}
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-5 sm:p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-700" />
                    <h3 className="font-black text-slate-900 text-base">Hợp Đồng &amp; VAT</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-white">
                    Doanh Nghiệp
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Chuyên trách hợp đồng thuê xe công tác dài hạn, xe đưa đón chuyên gia và xuất hóa đơn điện tử VAT trong ngày.
                </p>

                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                  <div className="text-slate-500 font-semibold">Email phòng kế toán:</div>
                  <a
                    href={`mailto:${email}`}
                    className="font-bold text-sky-800 hover:underline block truncate"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Xuất hóa đơn trong ngày</span>
                <span>Thanh toán công nợ linh hoạt</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: MẠNG LƯỚI 3 TRẠM BÀN GIAO & BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC       */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Mạng lưới bàn giao xe
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                3 Trạm Bàn Giao Trọng Điểm &amp; Bản Đồ Vị Trí
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Miễn phí giao nhận tại sảnh khách sạn nội ô Nha Trang
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Cột trái (5/12): Danh sách 3 trạm tiếp nhận */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
              {stations.map((st) => {
                const isSelected = selectedStation === st.id;
                const Icon = st.icon;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStation(st.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-sky-50/50 border-sky-500 shadow-xs ring-1 ring-sky-500/20'
                        : 'bg-slate-50/50 hover:bg-white border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 leading-snug">
                            {st.name}
                          </h4>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${st.badgeColor}`}>
                            {st.badge}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                          isSelected ? 'bg-sky-700 text-white' : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {isSelected ? 'Đang chọn' : 'Xem vị trí'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium pl-11">
                      {st.address}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 pl-11">
                      <span className="truncate">{st.landmark}</span>
                      <span className="font-bold text-sky-800 shrink-0 ml-2">{st.hours}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cột phải (7/12): Khung bản đồ Google Maps tương tác */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-100 flex flex-col min-h-[360px] sm:min-h-[420px]">
              
              {/* Map header toolbar */}
              <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0" />
                  <span className="text-xs font-black text-slate-900 truncate">
                    {activeStationData.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 hidden sm:inline-block">
                    {activeStationData.coords}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={activeStationData.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[36px] px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Chỉ đường</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activeStationData.mapQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all border border-slate-200 cursor-pointer"
                    title="Mở Google Maps toàn màn hình"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Iframe Maps */}
              <div className="flex-1 w-full relative">
                <iframe
                  title={`Bản đồ ${activeStationData.name}`}
                  src={`https://maps.google.com/maps?q=${activeStationData.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: BIỂU MẪU TIẾP NHẬN YÊU CẦU & ĐỊNH VỊ CỨU HỘ GPS 1-CHẠM          */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Tiếp nhận yêu cầu 24/7
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Gửi Yêu Cầu Hỗ Trợ Nhanh Hoặc Định Vị Cứu Hộ
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Điều phối viên liên hệ lại trong vòng 3 &ndash; 15 phút
            </span>
          </div>

          {isSubmitted ? (
            /* Confirmation card */
            <div className="p-6 sm:p-10 bg-sky-50/40 border border-sky-200/90 rounded-2xl text-center space-y-5 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                  Tiếp nhận thành công
                </span>
                <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Tổng Đài Đang Điều Phối Xử Lý Yêu Cầu
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Chuyên viên hỗ trợ sẽ gọi lại trực tiếp qua số <strong className="text-sky-800 font-mono font-bold">{lastSubmittedInfo?.phone || phone}</strong>.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Khách hàng:</span>
                  <span className="font-bold text-slate-900">{lastSubmittedInfo?.name || fullName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Số điện thoại:</span>
                  <span className="font-bold text-sky-800 font-mono">{lastSubmittedInfo?.phone || phone}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Nhu cầu:</span>
                  <span className="font-bold text-slate-800">{lastSubmittedInfo?.tagLabel || 'Yêu cầu hỗ trợ'}</span>
                </div>
                {lastSubmittedInfo?.gps && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Tọa độ sự cố:</span>
                    <span className="font-mono font-bold text-rose-700">{lastSubmittedInfo.gps.lat}, {lastSubmittedInfo.gps.lng}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                  setSelectedTag(null);
                  setGpsLocation(null);
                }}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Gửi thêm yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl mx-auto">
              
              {/* Quick Tags Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                    <span>Chọn nhanh nhu cầu phổ biến (1-chạm điền sẵn nội dung):</span>
                  </span>
                  {selectedTag && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTag(null);
                        setMessage('');
                      }}
                      className="text-[11px] text-sky-700 hover:underline font-bold cursor-pointer"
                    >
                      Bỏ chọn
                    </button>
                  )}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickTags.map((tag) => {
                    const isSelected = selectedTag === tag.id;
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleSelectTag(tag)}
                        className={`min-h-[44px] text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                            : 'bg-slate-50/60 text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-300'
                        }`}
                      >
                        <span className="truncate">{tag.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-700" />
                      <span>Họ và tên của bạn:</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A / John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-sky-700" />
                      <span>Số điện thoại liên hệ:</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0905 123 456"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs sm:text-sm font-mono font-medium focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* 1-Touch GPS Geolocation Bar */}
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                    <LocateFixed className="w-4 h-4 text-sky-700" />
                    <span>Dành cho xe gặp sự cố: Gửi tọa độ GPS cứu hộ lưu động</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {gpsLocation
                      ? `Đã định vị thành công: Tọa độ (${gpsLocation.lat}, ${gpsLocation.lng})`
                      : 'Bấm nút để trình duyệt tự gửi vị trí cho đội cứu hộ lưu động có mặt chính xác'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGetGPS}
                  disabled={isLocating}
                  className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-[0.98] ${
                    gpsLocation
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      : 'bg-sky-700 hover:bg-sky-600 text-white shadow-xs'
                  }`}
                >
                  <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>
                    {isLocating
                      ? 'Đang lấy tọa độ...'
                      : gpsLocation
                      ? 'Đã lấy GPS (Lấy lại)'
                      : 'Lấy định vị GPS 1-chạm'}
                  </span>
                </button>
              </div>

              {/* Message text area */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-700" />
                    <span>Nội dung yêu cầu hoặc tình trạng xe:</span>
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Xe ô tô đang ở đèo Lương Sơn bị thủng lốp sau bên phải..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full min-h-[48px] py-3 bg-sky-700 hover:bg-sky-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>Gửi yêu cầu điều phối ngay</span>
              </button>

              <p className="text-[11px] text-center text-slate-500">
                DriveRent cam kết bảo mật thông tin liên hệ và chỉ sử dụng cho mục đích điều phối dịch vụ.
              </p>

            </form>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: GIẢI ĐÁP THẮC MẮC LIÊN HỆ & BÀN GIAO XE                        */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Giải đáp thắc mắc
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Câu Hỏi Phổ Biến Về Giao Nhận &amp; Cứu Hộ
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Giải đáp ngắn gọn trực diện dưới 2 câu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'bg-white border-sky-300 shadow-xs' : 'bg-slate-50/50 border-slate-200/90'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between gap-2 text-left font-bold text-xs sm:text-sm text-slate-900 cursor-pointer select-none"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-sky-700' : 'text-slate-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: KHỐI CAM KẾT TRỰC BAN ĐIỀU PHỐI 24/7                            */}
        {/* ========================================================================= */}
        <section className="rounded-3xl bg-slate-900 p-6 sm:p-10 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400 bg-sky-950 px-3 py-1 rounded-full border border-sky-800 inline-block">
              Trực ban điều phối 24/7
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Đội Ngũ Kỹ Thuật Viên Sẵn Sàng Đồng Hành Cùng Bạn
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Bất kể chuyến bay hạ cánh muộn lúc nửa đêm hay sự cố xe bất ngờ dọc đèo vịnh biển, nhân viên điều phối DriveRent luôn túc trực hỗ trợ tức thì.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="min-h-[48px] px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Gọi ngay: {hotline}</span>
            </a>

            <a
              href={`https://zalo.me/${hotline.replace(/\s+/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>Nhắn tin Zalo</span>
            </a>
          </div>
        </section>

      </div>

    </div>
  );
};
