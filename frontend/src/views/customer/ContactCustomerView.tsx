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
  ChevronRight,
  ChevronDown,
  Wrench,
  Search,
  ArrowRight,
  Waves,
  Train,
  Plane,
  Navigation,
  HelpCircle,
  Zap,
  LocateFixed,
  Building2,
  AlertTriangle,
  Copy,
  Check,
  QrCode
} from 'lucide-react';

import nhaTrangCoastalBay from '../../assets/images/nha_trang_coastal_bay.jpg';

export const ContactCustomerView: React.FC = () => {
  const { settings, showToast, t, setCustomerTab } = useApp();

  const brandName = settings?.brandTitle || settings?.storeName || 'Nha Trang Car';
  const address = settings?.address || '25 Lê Lợi, Phường Xương Huân, TP. Nha Trang, Tỉnh Khánh Hòa';
  const hotline = settings?.hotline || '0905 888 999';

  // State form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleInterest, setVehicleInterest] = useState<'car' | 'motorbike' | 'chauffeur'>('car');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // GPS Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Trạm bàn giao đang chọn (Showroom / Sân bay Cam Ranh / Ga Nha Trang)
  const [selectedStation, setSelectedStation] = useState<'showroom' | 'airport' | 'train'>('showroom');

  // FAQ Accordion State (mở FAQ đầu tiên mặc định)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Lưu thông tin vừa gửi để hiển thị tóm tắt phiếu
  const [lastSubmittedInfo, setLastSubmittedInfo] = useState<{
    name: string;
    phone: string;
    category: 'car' | 'motorbike' | 'chauffeur';
    tagLabel?: string;
    gps?: { lat: number; lng: number };
  } | null>(null);

  // Danh sách 3 Trạm bàn giao trọng điểm tại Nha Trang
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

  // Quick Tags chọn nhanh mục đích
  const quickTags = [
    {
      id: 'sos',
      label: '🆘 Cứu hộ khẩn cấp 24/7',
      category: 'car' as const,
      presetMsg: 'Tôi cần hỗ trợ cứu hộ khẩn cấp xe gặp sự cố (thủng lốp / ắc quy / chết máy) tại Nha Trang.'
    },
    {
      id: 'airport',
      label: t('contact.tag_airport', '✈️ Đón tiễn Sân bay Cam Ranh'),
      category: 'car' as const,
      presetMsg: 'Tôi cần hỗ trợ đón/tiễn tại Sân bay Quốc tế Cam Ranh (vui lòng báo giá các dòng xe ô tô 4 - 7 chỗ).'
    },
    {
      id: 'family',
      label: t('contact.tag_family', '🚗 Thuê ô tô tự lái gia đình'),
      category: 'car' as const,
      presetMsg: 'Gia đình tôi cần thuê 1 xe ô tô tự lái (4 - 7 chỗ đời mới) đi lại tại Nha Trang.'
    },
    {
      id: 'pass',
      label: t('contact.tag_pass', '🛵 Xe máy phượt đèo Vĩnh Hy'),
      category: 'motorbike' as const,
      presetMsg: 'Tôi muốn thuê xe máy phượt cung đường đèo Vĩnh Hy / Bình Tiên, ưu tiên xe khỏe, lốp bám đường tốt.'
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

  // 1-Chạm lấy tọa độ GPS của khách hàng đang gặp sự cố
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
      (err) => {
        setIsLocating(false);
        showToast('Chưa thể lấy vị trí. Vui lòng cho phép quyền truy cập vị trí trên trình duyệt.', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast(t('contact.form_name') + ' & ' + t('contact.form_phone'), 'error');
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
    showToast(t('contact.success_title', 'Đã tiếp nhận yêu cầu điều phối!'), 'success');
  };

  const faqs = [
    {
      q: t('contact.faq_q1', 'Khách hạ cánh đêm (sau 22:00) tại Sân bay Cam Ranh có nhận xe được không?'),
      a: t('contact.faq_a1', 'Có, 100% được phục vụ! Đội ngũ điều phối viên của DriveRent túc trực 24/7 tại Cảng hàng không Quốc tế Cam Ranh. Quý khách chỉ cần cung cấp mã chuyến bay khi đặt, nhân viên sẽ kiểm tra giờ hạ cánh thực tế và chờ sẵn tại cửa ga đến.')
    },
    {
      q: t('contact.faq_q2', 'Nhà xe có giao xe tận sảnh khách sạn / resort tại Nha Trang miễn phí không?'),
      a: t('contact.faq_a2', 'Đúng vậy! Với đơn thuê xe từ 1 ngày trở lên, chúng tôi miễn phí 100% phí giao nhận xe tận sảnh khách sạn trên các tuyến đường trung tâm như Trần Phú, Phạm Văn Đồng, Hùng Vương, Nguyễn Thị Minh Khai...')
    },
    {
      q: t('contact.faq_q3', 'Xe đang lưu thông gặp sự cố thủng lốp hoặc chết máy thì xử lý thế nào?'),
      a: t('contact.faq_a3', 'Quý khách vui lòng gọi ngay Hotline 0905 888 999 hoặc bấm nút "Gửi định vị GPS xe sự cố" trên trang web. Đội cứu hộ lưu động sẽ có mặt sau 15–20 phút để vá lốp, kích bình hoặc đổi ngay xe thay thế tương đương hoàn toàn miễn phí.')
    },
    {
      q: t('contact.faq_q4', 'Khách du lịch quốc tế không có bằng lái Việt Nam thì liên hệ qua kênh nào thuận tiện nhất?'),
      a: t('contact.faq_a4', 'Khách quốc tế có thể kết nối trực tiếp qua WhatsApp (+84 905 888 999). Tư vấn viên hỗ trợ tiếng Anh, Nga, Hàn và hướng dẫn chi tiết quy định sử dụng Bằng lái Quốc tế IDP 1968 theo đúng luật giao thông Việt Nam.')
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 selection:bg-sky-500 selection:text-white space-y-10 sm:space-y-12">
      
      {/* ========================================================================= */}
      {/* 1. HERO COVER: COMMAND CENTER TOÀN CẢNH VỊNH BIỂN NHA TRANG */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden w-full min-h-[440px] sm:min-h-[480px] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-sky-200/80 shadow-xs"
        style={{
          backgroundImage: `url(${nhaTrangCoastalBay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-sky-950/75 to-slate-950/85 pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-center space-y-5 my-auto">
          {/* Badge: Live Monitoring Status */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-cyan-300 border border-white/20 backdrop-blur-md text-xs font-bold shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
            <span className="tracking-wide uppercase font-black">{t('contact.hero_badge', 'HỆ THỐNG ĐIỀU PHỐI XE & CỨU HỘ 24/7')}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-md">
              {t('contact.hero_title', 'TRUNG TÂM ĐIỀU HÀNH & CỨU HỘ GIAO THÔNG')}
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-200 max-w-3xl mx-auto drop-shadow-sm leading-relaxed text-pretty">
              {t('contact.hero_desc', 'Đội ngũ tư vấn viên và kỹ thuật viên cứu hộ luôn sẵn sàng hỗ trợ quý khách trên mọi hành trình khám phá Nha Trang, Cam Ranh và các cung đèo vịnh biển.')}
            </p>
          </div>

          {/* Focal Trust Anchor: Hotline SOS Bar */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 rounded-full bg-slate-900/90 text-white shadow-xl shadow-slate-950/40 border border-sky-500/30 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="text-xs sm:text-sm font-bold text-sky-200 tracking-wide uppercase">
                  Hotline SOS cứu hộ &amp; điều phối khẩn cấp:
                </span>
              </div>
              <a
                href={`tel:${hotline.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-base sm:text-lg font-black text-amber-300 hover:text-amber-200 tracking-wider tabular-nums transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{hotline}</span>
              </a>
              <span className="text-xs text-sky-300 hidden md:inline font-medium">
                — Bắt máy sau 3 tiếng chuông &bull; Có mặt sau 15–20 phút
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DẢI SỐ LIỆU "THỜI GIAN PHẢN HỒI CAM KẾT" (4 THẺ NGANG TRÀN RỘNG 1440PX) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: < 20 phút Cứu hộ nội thành */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-sky-100 hover:border-sky-300 shadow-[0_8px_30px_rgba(2,132,199,0.08)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                  <Wrench className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  SOS Siêu Tốc
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-amber-800 tracking-tight font-mono tabular-nums">
                  &lt; 20 phút
                </div>
                <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1 tracking-tight">
                  Cứu hộ khẩn cấp nội thành
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                Đội ngũ kỹ thuật viên lưu động có mặt tức thì hỗ trợ vá lốp, kích bình, xử lý sự cố trong bán kính 10km nội ô TP. Nha Trang.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Miễn phí 100% trong phạm vi nội ô</span>
            </div>
          </div>

          {/* Card 2: < 45 phút Giao xe ngoại thành */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-sky-100 hover:border-sky-300 shadow-[0_8px_30px_rgba(2,132,199,0.08)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 group-hover:bg-sky-700 group-hover:text-white transition-all duration-300">
                  <Car className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  Đúng Giờ Tuyệt Đối
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-sky-800 tracking-tight font-mono tabular-nums">
                  &lt; 45 phút
                </div>
                <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1 tracking-tight">
                  Giao xe ngoại thành &amp; Resort
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                Bàn giao xe tận sảnh các resort ven biển Bãi Dài, Dốc Lết, Cảng du lịch Vĩnh Trường đúng giờ đã thỏa thuận.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-sky-700">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Khử khuẩn &amp; kiểm tra an toàn trước bàn giao</span>
            </div>
          </div>

          {/* Card 3: < 3 phút Bắt máy & Báo giá Zalo */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-sky-100 hover:border-sky-300 shadow-[0_8px_30px_rgba(2,132,199,0.08)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <PhoneCall className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Phản Hồi Tức Thì
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight font-mono tabular-nums">
                  &lt; 3 phút
                </div>
                <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1 tracking-tight">
                  Bắt máy &amp; Báo giá Zalo
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                Tư vấn viên trực 24/7, gửi video/hình ảnh xe thực tế và hợp đồng giữ cọc minh bạch ngay sau 3 tiếng chuông.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Gửi ảnh thật &bull; Báo giá trọn gói 1-chạm</span>
            </div>
          </div>

          {/* Card 4: 0 VNĐ Phụ phí ẩn */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-sky-100 hover:border-sky-300 shadow-[0_8px_30px_rgba(2,132,199,0.08)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  Minh Bạch 100%
                </span>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-indigo-800 tracking-tight font-mono tabular-nums">
                  0 VNĐ
                </div>
                <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1 tracking-tight">
                  Phụ phí ẩn &amp; Hoàn cọc 100%
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                Cam kết không phát sinh bất kỳ khoản phí nào ngoài hợp đồng, hoàn trả 100% tiền đặt cọc giữ xe ngay khi nghiệm thu xe.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-indigo-700">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Chính sách hoàn cọc linh hoạt, uy tín</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LƯỚI BENTO 2 CỘT BẤT ĐỐI XỨNG COMMAND CENTER (5 : 7) MAX-W-[1440PX] */}
      {/* ========================================================================= */}
      <main id="contact-main-content" className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ===================================================================== */}
          {/* CỘT TRÁI (5/12): HOTLINE SOS + QR CODE ZALO + 3 TRẠM BÀN GIAO */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. KHỐI HOTLINE SOS CỨU HỘ KHẨN CẤP 24/7 (COMMAND EMERGENCY CARD) */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 border border-sky-800/80 p-6 sm:p-7 text-white shadow-xl shadow-sky-950/20 relative overflow-hidden space-y-5">
              {/* Subtle tech aura glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                    Cứu hộ khẩn cấp &bull; Trực ban 24/7
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/20">
                  Phản hồi &lt; 30s
                </span>
              </div>

              <div className="space-y-2 relative z-10">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Hotline Hỗ Trợ Kỹ Thuật Toàn Tỉnh
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Gặp sự cố trên đường, cần kích ắc quy, vá bánh xe hoặc tư vấn lịch trình gấp, hãy gọi trực tiếp số máy nóng:
                </p>
              </div>

              {/* Nút bấm gọi lớn 1-chạm */}
              <a
                href={`tel:${hotline.replace(/\s+/g, '')}`}
                className="group relative z-10 block p-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white shadow-lg shadow-sky-600/30 border border-sky-400/40 transition-all duration-200 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <PhoneCall className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-sky-100 uppercase tracking-wide block">
                        Bấm để gọi ngay lập tức
                      </span>
                      <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white block mt-0.5 tabular-nums">
                        {hotline}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/25 text-white whitespace-nowrap shrink-0 border border-white/30 hidden sm:inline-block">
                    Gọi miễn phí
                  </span>
                </div>
              </a>

              {/* 3 Cam kết kỹ thuật khẩn cấp */}
              <div className="pt-2 border-t border-sky-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300 relative z-10">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Vá lốp lưu động</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Kích bình ắc quy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Đổi xe thay thế</span>
                </div>
              </div>
            </div>

            {/* 2. KHỐI QR CODE KẾT NỐI ZALO KỸ THUẬT VIÊN TRỰC TIẾP */}
            <div className="rounded-3xl bg-white border border-sky-200/90 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-sky-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0">
                    <QrCode className="w-5 h-5 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Kết Nối Zalo &amp; WhatsApp Trực Tiếp
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Gửi ảnh xe thực tế &bull; Định vị sự cố &bull; Báo giá trong 3 phút
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Online
                </span>
              </div>

              {/* QR Layout: QR SVG bên trái + Hướng dẫn & nút bên phải */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-sky-50/50 border border-sky-200/80">
                {/* Visual QR Code Mockup (Vector SVG sắc nét, có nút scan) */}
                <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border-2 border-sky-200 shadow-sm flex flex-col items-center justify-center shrink-0 relative group">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                    {/* Corner Position Detection Patterns */}
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="#0369a1" />
                    <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="13" width="12" height="12" rx="1" fill="#0369a1" />

                    <rect x="67" y="5" width="28" height="28" rx="4" fill="#0369a1" />
                    <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                    <rect x="75" y="13" width="12" height="12" rx="1" fill="#0369a1" />

                    <rect x="5" y="67" width="28" height="28" rx="4" fill="#0369a1" />
                    <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                    <rect x="13" y="75" width="12" height="12" rx="1" fill="#0369a1" />

                    {/* Data modules representation */}
                    <rect x="38" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="48" y="14" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="56" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="38" y="24" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="50" y="24" width="6" height="6" rx="1" fill="#0f172a" />

                    <rect x="8" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="18" y="48" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="28" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="8" y="54" width="6" height="6" rx="1" fill="#0f172a" />

                    <rect x="68" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="78" y="48" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="86" y="38" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="68" y="56" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="86" y="56" width="6" height="6" rx="1" fill="#0f172a" />

                    <rect x="38" y="68" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="50" y="76" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="38" y="86" width="6" height="6" rx="1" fill="#0f172a" />
                    <rect x="54" y="86" width="6" height="6" rx="1" fill="#0f172a" />

                    {/* Center Brand Badge */}
                    <circle cx="50" cy="50" r="13" fill="#0284c7" />
                    <text x="50" y="54" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="sans-serif">Zalo</text>
                  </svg>
                  <span className="text-[10px] font-bold text-sky-700 mt-1">Quét Zalo OA</span>
                </div>

                <div className="space-y-3 flex-1 min-w-0">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      Nhắn tin hỗ trợ tức thì
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Quét mã để kết nối trực tiếp chuyên viên kỹ thuật. Nhận ngay hình ảnh xe đang trống và bảng giá ưu đãi theo ngày.
                    </p>
                  </div>

                  {/* 2 Nút Chat Zalo & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href={`https://zalo.me/${hotline.replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat Zalo OA</span>
                    </a>

                    <a
                      href={`https://wa.me/${hotline.replace(/\s+/g, '').replace(/^0/, '84')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DANH SÁCH 3 TRẠM BÀN GIAO TRỌNG ĐIỂM TẠI NHA TRANG */}
            <div className="rounded-3xl bg-white border border-sky-200/90 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="space-y-0.5">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    3 Trạm Bàn Giao Xe Trọng Điểm
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Chọn trạm để xem chi tiết vị trí và chỉ đường trên bản đồ
                  </p>
                </div>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  Giao tận nơi 0đ
                </span>
              </div>

              <div className="space-y-3">
                {stations.map((st) => {
                  const isSelected = selectedStation === st.id;
                  const Icon = st.icon;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStation(st.id)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col gap-2.5 ${
                        isSelected
                          ? 'bg-gradient-to-br from-sky-50 via-white to-sky-50/80 border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                          : 'bg-slate-50/60 hover:bg-white border-slate-200/80 hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-sm text-slate-900 tracking-tight">
                                {st.name}
                              </h4>
                            </div>
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${st.badgeColor}`}>
                              {st.badge}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all shrink-0 ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-2xs'
                              : 'bg-slate-200/70 text-slate-600'
                          }`}
                        >
                          {isSelected ? 'Đang chọn' : 'Xem bản đồ'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed pl-13">
                        📍 {st.address}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 pl-13">
                        <span className="truncate">{st.landmark}</span>
                        <span className="font-bold text-sky-700 shrink-0 ml-2">{st.hours}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* CỘT PHẢI (7/12): BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC + QUICK DISPATCH FORM */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. KHUNG BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC KHỔ LỚN */}
            <div className="rounded-3xl bg-white border border-sky-200/90 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
              
              {/* Header Bar của bản đồ */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Vị trí vệ tinh &bull; {activeStationData.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeStationData.address}
                  </p>
                </div>

                {/* Nút chỉ đường Google Maps trực tiếp */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={activeStationData.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Chỉ đường Maps</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activeStationData.mapQuery}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Selector chuyển nhanh 3 trạm trên thanh bản đồ */}
              <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
                {stations.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStation(st.id)}
                    className={`flex-1 min-h-[38px] px-3 py-1.5 rounded-xl transition-all cursor-pointer truncate ${
                      selectedStation === st.id
                        ? 'bg-white text-sky-700 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st.name.split(' (')[0]}
                  </button>
                ))}
              </div>

              {/* Khung Iframe Google Maps tương tác thực tế */}
              <div className="rounded-2xl overflow-hidden border border-sky-200/90 shadow-inner relative bg-slate-100 h-[360px] sm:h-[400px]">
                <iframe
                  title={`Bản đồ ${activeStationData.name}`}
                  src={`https://maps.google.com/maps?q=${activeStationData.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Map Overlay Pill */}
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md pointer-events-none">
                  <div className="p-3 rounded-xl bg-white/95 backdrop-blur-md border border-sky-200/90 shadow-md text-xs space-y-1 pointer-events-auto">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-black text-slate-900 truncate">
                        📍 {activeStationData.name}
                      </span>
                      <span className="font-mono text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 font-bold shrink-0">
                        {activeStationData.coords}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed truncate">
                      {activeStationData.landmark}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. FORM GỬI YÊU CẦU HỖ TRỢ NHANH & ĐIỀU PHỐI CỨU HỘ */}
            <div className="rounded-3xl bg-white border border-sky-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
              
              {/* Header Form */}
              <div className="bg-gradient-to-r from-sky-100/90 via-sky-50 to-cyan-50/80 p-5 sm:p-7 border-b border-sky-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-sky-800 uppercase tracking-wider block">
                      {t('contact.form_badge', 'TIẾP NHẬN YÊU CẦU ĐIỀU PHỐI 24/7')}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 tracking-tight">
                      Gửi Yêu Cầu Hỗ Trợ Nhanh &amp; Báo Giá
                    </h3>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-sky-800 bg-white/80 px-3 py-1.5 rounded-full border border-sky-200/80 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Gọi lại sau 3 - 15 phút</span>
                </div>
              </div>

              {/* Body Form */}
              <div className="p-6 sm:p-8">
                {isSubmitted ? (
                  /* MÀN HÌNH XÁC NHẬN THÀNH CÔNG */
                  <div className="p-6 sm:p-8 bg-gradient-to-b from-sky-50/90 via-sky-50/40 to-white border border-sky-200/90 rounded-3xl text-center space-y-6">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wide uppercase border border-emerald-200 shadow-2xs">
                        Đã Gửi Thành Công
                      </span>
                      <h4 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                        Tổng đài đã tiếp nhận thông tin của bạn!
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        Tư vấn viên điều phối xe đang chuẩn bị thông tin và sẽ gọi lại số <strong className="text-sky-700 font-mono font-bold">{lastSubmittedInfo?.phone || phone}</strong> trong vòng 3–15 phút.
                      </p>
                    </div>

                    {/* Summary Receipt Box */}
                    <div className="bg-white rounded-2xl border border-sky-200/90 p-4 sm:p-5 text-left space-y-3 shadow-2xs">
                      <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 pb-2.5 border-b border-sky-100">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        <span>Tóm tắt thông tin tiếp nhận</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100">
                          <span className="text-slate-500 block text-[11px] font-semibold">Khách hàng</span>
                          <span className="font-bold text-slate-900 truncate block mt-0.5">{lastSubmittedInfo?.name || fullName}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100">
                          <span className="text-slate-500 block text-[11px] font-semibold">Số điện thoại</span>
                          <span className="font-bold text-sky-700 font-mono block mt-0.5">{lastSubmittedInfo?.phone || phone}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100">
                          <span className="text-slate-500 block text-[11px] font-semibold">Nhu cầu chính</span>
                          <span className="font-bold text-slate-800 block mt-0.5">
                            {lastSubmittedInfo?.tagLabel || 'Yêu cầu tư vấn'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100">
                          <span className="text-slate-500 block text-[11px] font-semibold">Tọa độ GPS định vị</span>
                          <span className="font-bold text-sky-800 font-mono block mt-0.5">
                            {lastSubmittedInfo?.gps ? `${lastSubmittedInfo.gps.lat}, ${lastSubmittedInfo.gps.lng}` : 'Nhập vị trí thủ công'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCustomerTab('vehicles')}
                        className="flex-1 min-h-[44px] px-5 py-3 bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-sm flex items-center justify-center gap-2"
                      >
                        <Car className="w-4 h-4" />
                        <span>Xem danh sách xe &bull; Đặt giữ chỗ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setMessage('');
                          setSelectedTag(null);
                          setGpsLocation(null);
                        }}
                        className="min-h-[44px] px-5 py-3 bg-white hover:bg-sky-50 active:scale-[0.98] text-slate-800 border border-sky-200 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Gửi yêu cầu khác</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Quick Tags Mục Đích */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>Chọn nhanh nhu cầu phổ biến (1-chạm điền sẵn nội dung)</span>
                        </span>
                        {selectedTag && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTag(null);
                              setMessage('');
                            }}
                            className="text-[11px] text-sky-600 hover:text-sky-800 hover:underline font-bold cursor-pointer"
                          >
                            Xóa chọn
                          </button>
                        )}
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quickTags.map((tag) => {
                          const isSelected = selectedTag === tag.id;
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => handleSelectTag(tag)}
                              className={`min-h-[44px] text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 ${
                                isSelected
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                  : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-sky-50/80 hover:border-sky-300'
                              }`}
                            >
                              <span className="truncate">{tag.label}</span>
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Họ và tên & Số điện thoại */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-sky-600" />
                            <span>{t('contact.form_name', 'Họ và tên của bạn')}</span>
                            <span className="text-rose-500 font-bold">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyễn Văn A / John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-sky-600" />
                            <span>{t('contact.form_phone', 'Số điện thoại liên hệ')}</span>
                            <span className="text-rose-500 font-bold">*</span>
                          </span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0905 123 456"
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                          className="w-full px-3.5 py-2.5 min-h-[44px] bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 rounded-xl text-xs sm:text-sm font-mono font-medium focus:outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Phân loại phương tiện quan tâm */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-sky-600" />
                          <span>Loại phương tiện bạn cần</span>
                        </span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setVehicleInterest('car')}
                          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            vehicleInterest === 'car'
                              ? 'bg-sky-600 text-white shadow-xs font-black'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Car className="w-4 h-4 shrink-0" />
                          <span className="truncate">Ô tô tự lái</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVehicleInterest('motorbike')}
                          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            vehicleInterest === 'motorbike'
                              ? 'bg-sky-600 text-white shadow-xs font-black'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Bike className="w-4 h-4 shrink-0" />
                          <span className="truncate">Xe máy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVehicleInterest('chauffeur')}
                          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            vehicleInterest === 'chauffeur'
                              ? 'bg-sky-600 text-white shadow-xs font-black'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Users className="w-4 h-4 shrink-0" />
                          <span className="truncate">Có tài xế</span>
                        </button>
                      </div>
                    </div>

                    {/* NÚT 1-CHẠM GỬI ĐỊNH VỊ GPS VỆ TINH */}
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-sky-950">
                          <LocateFixed className="w-4 h-4 text-sky-700" />
                          <span>Hỗ trợ cứu hộ: Gửi định vị GPS xe sự cố</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {gpsLocation
                            ? `Đã định vị thành công: Tọa độ (${gpsLocation.lat}, ${gpsLocation.lng})`
                            : 'Bấm nút để thiết bị tự gửi vị trí hiện tại cho đội cứu hộ lưu động'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleGetGPS}
                        disabled={isLocating}
                        className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-[0.98] ${
                          gpsLocation
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                        }`}
                      >
                        <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                        <span>
                          {isLocating
                            ? 'Đang dò GPS...'
                            : gpsLocation
                            ? 'Đã lấy tọa độ (Lấy lại)'
                            : 'Gửi định vị GPS 1-chạm'}
                        </span>
                      </button>
                    </div>

                    {/* Lời nhắn / Mô tả yêu cầu */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                          <span>Nội dung yêu cầu hoặc tình trạng xe</span>
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder={t('contact.form_msg_placeholder', 'Ví dụ: Chúng tôi cần thuê 2 xe 7 chỗ tự lái từ ngày 12/10 đến 15/10 nhận tại Sân bay Cam Ranh...')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-600 focus:ring-4 focus:ring-sky-500/15 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden transition-all"
                      />
                    </div>

                    {/* Submit CTA Button (Touch target >= 48px) */}
                    <button
                      type="submit"
                      className="w-full min-h-[48px] py-3.5 bg-gradient-to-r from-sky-600 via-sky-700 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 active:scale-[0.99] text-white font-black rounded-xl shadow-md shadow-sky-600/25 text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t('contact.form_submit', 'Gửi yêu cầu điều phối ngay')}</span>
                    </button>

                    <p className="text-[11px] text-center text-slate-500 pt-1">
                      {t('contact.form_privacy', 'Thông tin của bạn được bảo mật tuyệt đối theo chính sách bảo vệ dữ liệu khách hàng.')}
                    </p>

                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. ACCORDION FAQ 2 CỘT RỘNG MỞ TRÀN ĐẦY MÀN HÌNH (MAX-W-[1440PX]) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-sky-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-sky-100">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
                {t('contact.faq_badge', 'HỎI ĐÁP & HỖ TRỢ NHANH')}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('contact.faq_title', 'Câu Hỏi Thường Gặp Khi Thuê Xe & Cứu Hộ Tại Nha Trang')}
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium max-w-md">
              {t('contact.faq_desc', 'Tổng hợp các thắc mắc phổ biến nhất của du khách về nhận xe sân bay, cứu hộ khẩn cấp và thủ tục đặt cọc.')}
            </p>
          </div>

          {/* Lưới FAQ 2 Cột giúp tận dụng triệt để chiều ngang 1440px */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-sky-50/50 border-sky-300 shadow-xs'
                      : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="min-h-[52px] w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-3 pr-2">
                      <span
                        className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 font-bold font-mono transition-colors ${
                          isOpen ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-sky-700' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 sm:pl-13 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-sky-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FOOTER CTA BANNER TOÀN KHUNG HÌNH (MAX-W-[1440PX]) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-800/80">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold tracking-wider uppercase text-cyan-300 bg-sky-900/80 px-3 py-1 rounded-full border border-sky-700 inline-block">
              {t('contact.footer_cta_badge', 'TRUNG TÂM ĐIỀU PHỐI DRIVE RENT')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {t('contact.footer_cta_title', 'Sẵn sàng khởi hành chuyến đi Nha Trang ngay hôm nay?')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed text-pretty">
              {t('contact.footer_cta_desc', 'Đội ngũ tư vấn viên luôn túc trực hỗ trợ chọn xe phù hợp, bàn giao xe sạch đẹp chỉ sau 15–30 phút xác nhận.')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="min-h-[48px] px-5 py-3 rounded-2xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-sky-700 transition-all select-none active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4 text-amber-300" />
              <span>{hotline}</span>
            </a>

            <button
              type="button"
              onClick={() => setCustomerTab('vehicles')}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
            >
              <span>{t('contact.footer_cta_vehicles', 'Xem danh sách xe & Đặt giữ chỗ')}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

      </main>

    </div>
  );
};
