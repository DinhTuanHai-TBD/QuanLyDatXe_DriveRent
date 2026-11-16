import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Plane,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  MapPin,
  FileCheck2,
  CalendarCheck,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Video,
  Gauge,
  Wrench,
  FileSignature,
  LifeBuoy
} from 'lucide-react';

import nhaTrangCoastalBay from '../../assets/images/nha_trang_coastal_bay.jpg';

export const GuideCustomerView: React.FC = () => {
  const { settings } = useApp();
  const brandName = settings?.brandTitle || settings?.storeName || 'DriveRent Nha Trang';
  const hotline = settings?.hotline || '0905 888 999';

  // State: FAQ Accordion đa lựa chọn
  const [openFaqs, setOpenFaqs] = useState<number[]>([0, 2]);
  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // 1. QUY TRÌNH 4 BƯỚC THUÊ XE
  const rentalSteps = [
    {
      num: '01',
      title: 'Chọn xe & Cọc 20% Online',
      desc: 'Chọn mẫu xe yêu thích trên hệ thống và chuyển khoản cọc 20% qua VietQR để khóa giữ xe tức thì.',
      timeTag: '1 – 2 Phút',
      icon: CalendarCheck,
      color: 'from-sky-600 to-sky-700'
    },
    {
      num: '02',
      title: 'Xác nhận & Hẹn giờ nhận xe',
      desc: 'Điều phối viên liên hệ qua Zalo xác nhận điểm đón tại Sân bay hoặc Khách sạn theo giờ bay thực tế.',
      timeTag: '24/7 Theo giờ bay',
      icon: Plane,
      color: 'from-blue-600 to-cyan-700'
    },
    {
      num: '03',
      title: 'Kiểm tra & Bàn giao 5 phút',
      desc: 'Hai bên cùng quay video 360° ngoại quan, ký biên bản điện tử và nhận bàn giao chìa khóa xe.',
      timeTag: '5 Phút nhận xe',
      icon: FileCheck2,
      color: 'from-teal-600 to-emerald-700'
    },
    {
      num: '04',
      title: 'Trả xe & Hoàn cọc tức thì',
      desc: 'Kiểm tra xe nhanh tại điểm hẹn và nhận hoàn trả 100% tiền cọc dứt điểm qua chuyển khoản 24/7.',
      timeTag: '3 – 5 Phút hoàn tiền',
      icon: RotateCcw,
      color: 'from-amber-600 to-orange-700'
    }
  ];

  // 2. HƯỚNG DẪN 3 ĐIỂM GIAO NHẬN THỰC TẾ TẠI NHA TRANG
  const pickupLocations = [
    {
      id: 'airport',
      badge: 'SÂN BAY CAM RANH (CXR)',
      title: 'Đón Sảnh Đến Sân Bay 24/7',
      desc: 'Phù hợp nhất cho du khách đáp chuyến bay đến Nha Trang, nhận xe ngay tại cửa ra ga đến.',
      steps: [
        'Cung cấp mã chuyến bay khi đặt xe để điều phối viên theo dõi giờ hạ cánh thực tế.',
        'Khi hạ cánh và lấy hành lý, nhân viên sẽ cầm biển tên đón bạn tại sảnh đến (Cột 3 - 5 Ga Quốc Nội).',
        'Bàn giao xe ngay bãi đỗ xe sân bay đối diện sảnh đến, hỗ trợ chuyển hành lý lên xe.',
        'Phục vụ 24/7 mọi khung giờ, 0đ phụ thu phí giao nhận đêm muộn.'
      ],
      icon: Plane,
      tagColor: 'bg-sky-100 text-sky-800 border-sky-200'
    },
    {
      id: 'hotel',
      badge: 'KHÁCH SẠN / RESORT NHA TRANG',
      title: 'Giao Xe Tận Sảnh Khách Sạn',
      desc: 'Tiện lợi cho du khách đã về nhận phòng khách sạn hoặc nghỉ dưỡng tại các resort ven biển.',
      steps: [
        'Thông báo tên khách sạn và số phòng trước 30 phút so với giờ hẹn nhận xe.',
        'Tài xế giao xe sẽ lái xe đến đỗ trước sảnh lễ tân và gọi điện thoại báo bạn xuống nhận xe.',
        'Hai bên kiểm tra xe và ký biên bản nhận xe trực tiếp ngay tại sảnh khách sạn.',
        'Miễn phí 100% chi phí giao xe tận nơi trong toàn bộ khu vực nội thành Nha Trang.'
      ],
      icon: Building2,
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'showroom',
      badge: 'SHOWROOM TRUNG TÂM',
      title: 'Nhận Trực Tiếp Tại 25 Lê Lợi',
      desc: 'Lựa chọn xem xe thực tế tại Showroom, xuất phát thuận tiện ngay trung tâm thành phố biển.',
      steps: [
        'Địa chỉ: Số 25 Lê Lợi, Phường Xương Huân, TP. Nha Trang (cách bãi biển Trần Phú 300m).',
        'Xe được rửa sạch sẽ, hút bụi thơm tho và kiểm định kỹ thuật sẵn sàng trong gara.',
        'Thời gian làm thủ tục và bàn giao chìa khóa siêu tốc chỉ từ 2 đến 3 phút.',
        'Showroom mở cửa đón tiếp khách liên tục từ 07:00 đến 21:00 tất cả các ngày trong tuần.'
      ],
      icon: MapPin,
      tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
  ];

  // 3. QUY CHUẨN 4 BƯỚC KIỂM TRA XE BÀN GIAO 360°
  const inspectionChecklist = [
    {
      step: '01',
      title: 'Quay video 360° ngoại quan',
      desc: 'Nhân viên cùng khách hàng quay video vòng quanh thân vỏ, cản trước, cản sau, mâm lốp và kính lái để lưu mốc đối chiếu khách quan.',
      icon: Video
    },
    {
      step: '02',
      title: 'Kiểm tra mức nhiên liệu / pin',
      desc: 'Chụp ảnh đồng hồ ODO và vạch xăng/pin tại thời điểm giao xe, đảm bảo nguyên tắc nhận bao nhiêu vạch sẽ trả bấy nhiêu.',
      icon: Gauge
    },
    {
      step: '03',
      title: 'Kiểm tra phụ kiện theo xe',
      desc: 'Xác nhận đầy đủ phụ kiện gồm lốp dự phòng, bộ kích nâng hạ, tam giác phản quang và tập giấy tờ lưu hành xe hợp lệ trong hộc để đồ.',
      icon: Wrench
    },
    {
      step: '04',
      title: 'Ký biên bản điện tử 1 phút',
      desc: 'Ký xác nhận biên bản bàn giao xe trực tiếp trên màn hình điện thoại, nhận chìa khóa và bắt đầu chuyến hành trình an tâm.',
      icon: FileSignature
    }
  ];

  // 4. HƯỚNG DẪN XỬ LÝ SỰ CỐ & CỨU HỘ 24/7
  const incidentSteps = [
    {
      step: '1',
      title: 'Đỗ xe an toàn & Bật đèn cảnh báo',
      desc: 'Từ từ tấp xe vào lề đường bên phải, bật đèn khẩn cấp (hazard) và đặt tam giác phản quang cách đuôi xe tối thiểu 30m.'
    },
    {
      step: '2',
      title: 'Gọi ngay Hotline cứu hộ 24/7',
      desc: `Liên hệ số điện thoại cứu hộ khẩn cấp ${hotline}, cung cấp biển số xe và gửi định vị GPS hiện tại của xe qua Zalo kỹ thuật.`
    },
    {
      step: '3',
      title: 'Đội kỹ thuật hỗ trợ sau 15 – 30 phút',
      desc: 'Kỹ thuật viên lưu động có mặt tận nơi xử lý sự cố tại chỗ (kích bình, vá lốp) hoặc điều động xe tương đương thay thế miễn phí.'
    }
  ];

  // 5. FAQ CÂU HỎI THƯỜNG GẶP VỀ QUY TRÌNH THUÊ XE
  const conciseFaqs = [
    {
      q: 'Hạ cánh chuyến bay đêm muộn tại Sân bay Cam Ranh (sau 22:00) thì nhận xe thế nào?',
      a: 'DriveRent giao xe 24/7 tại ga đến Sân bay Cam Ranh theo giờ bay thực tế của bạn mà không phụ thu phí đêm. Nhân viên sẽ cầm biển tên đón bạn trực tiếp ngay tại cửa sảnh đến.'
    },
    {
      q: 'Nếu chuyến bay bị delay hoặc dời giờ bay thì quy trình giao xe xử lý ra sao?',
      a: 'Bạn chỉ cần nhắn mã chuyến bay, nhân viên điều phối sẽ tự động theo dõi lịch trình máy bay hạ cánh mới để điều chỉnh giờ giao xe tương ứng hoàn toàn miễn phí.'
    },
    {
      q: 'Quy trình kiểm tra xe khi trả xe diễn ra như thế nào?',
      a: 'Khi trả xe, hai bên cùng đối chiếu nhanh tình trạng xe với video 360° đã quay lúc nhận trong vòng 3 phút. Nếu xe nguyên vẹn, hợp đồng được quyết toán dứt điểm ngay.'
    },
    {
      q: 'Tiền cọc được hoàn trả bằng hình thức nào và mất bao lâu?',
      a: 'Ngay khi hoàn tất bàn giao xe, 100% tiền cọc được chuyển khoản hoàn trả tức thì qua VietQR 24/7 (tiền về tài khoản trong 3-5 phút) hoặc nhận tiền mặt tại chỗ theo yêu cầu.'
    },
    {
      q: 'Tôi muốn gia hạn thêm thời gian thuê xe thì cần làm gì?',
      a: 'Bạn chỉ cần gọi điện hoặc nhắn tin Zalo cho tổng đài trước giờ trả xe dự kiến 3 tiếng để nhân viên hỗ trợ gia hạn hợp đồng trực tuyến mà không cần quay lại showroom.'
    },
    {
      q: 'Khi xe gặp sự cố thủng lốp trên đường đèo thì chi phí cứu hộ tính thế nào?',
      a: 'Đội cứu hộ lưu động của DriveRent hỗ trợ hoàn toàn miễn phí công cứu hộ 24/7 trong phạm vi toàn tỉnh Khánh Hòa, đảm bảo chuyến du lịch của bạn không bị gián đoạn.'
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">

        {/* ========================================================================= */}
        {/* SECTION 1: HERO BANNER - GIỚI THIỆU QUY TRÌNH THUÊ XE                     */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl overflow-hidden border border-sky-100 shadow-sm bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900 text-white p-6 sm:p-10 lg:p-12">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url(${nhaTrangCoastalBay})` }}
          />
          <div className="relative z-10 max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Cẩm nang hướng dẫn • {brandName}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Hướng Dẫn Quy Trình Thuê Xe Từ A Đến Z
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
              Chi tiết các bước thực hiện từ khi đặt giữ chỗ online, nhận bàn giao xe tại điểm hẹn, đến khi kết thúc hành trình và nhận hoàn cọc dứt điểm.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: QUY TRÌNH 4 BƯỚC THUÊ XE TỰ LÁI                              */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Quy trình tổng quan
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                4 Bước Thuê Xe Tự Lái Tinh Gọn
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Tổng thời gian hoàn tất: ~11 phút</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {rentalSteps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-sm`}>
                        <IconComp className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-black font-mono px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200">
                        BƯỚC {step.num}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Thời gian:</span>
                    <span className="text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/80">
                      {step.timeTag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: HƯỚNG DẪN GIAO NHẬN TẠI 3 ĐIỂM ĐÓN THỰC TẾ                    */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Điểm giao nhận thực tế
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Hướng Dẫn Đón Nhận Xe Tại Nha Trang
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Phục vụ linh hoạt theo địa điểm thuận tiện nhất cho quý khách
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {pickupLocations.map((loc) => {
              const IconComp = loc.icon;
              return (
                <div
                  key={loc.id}
                  className="rounded-2xl border border-slate-200/90 p-5 sm:p-6 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${loc.tagColor}`}>
                        {loc.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {loc.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {loc.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Các bước nhận xe tại đây:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-600 font-medium">
                        {loc.steps.map((st, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: QUY CHUẨN 4 BƯỚC KIỂM TRA XE BÀN GIAO 360°                    */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Bàn giao minh bạch
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                4 Bước Kiểm Tra Khi Nhận Bàn Giao Xe
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Đảm bảo quyền lợi tuyệt đối cho khách hàng và nhà xe
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {inspectionChecklist.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all duration-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                      <IconComp className="w-5 h-5 text-sky-700" />
                    </div>
                    <span className="text-xs font-mono font-black text-slate-400">
                      #{item.step}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: HƯỚNG DẪN XỬ LÝ SỰ CỐ & CỨU HỘ LƯU ĐỘNG 24/7                 */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-rose-700 uppercase tracking-wider block">
                Hỗ trợ khẩn cấp
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Quy Trình Xử Lý Khi Gặp Sự Cố Trên Đường
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Hotline cứu hộ: {hotline}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {incidentSteps.map((inc) => (
              <div
                key={inc.step}
                className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-rose-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {inc.step}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {inc.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal pl-9">
                  {inc.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-sky-900 font-medium">
              <LifeBuoy className="w-4 h-4 text-sky-700 shrink-0" />
              <span>Đội cứu hộ lưu động của DriveRent túc trực 24/7 trên toàn tuyến Nha Trang – Cam Ranh.</span>
            </div>
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-700 text-white font-bold hover:bg-sky-800 transition-colors shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Gọi cứu hộ {hotline}</span>
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: CÂU HỎI THƯỜNG GẶP VỀ QUY TRÌNH (FAQ)                        */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Giải đáp thắc mắc
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Câu Hỏi Thường Gặp Về Quy Trình Thuê Xe
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Câu trả lời ngắn gọn trực tiếp vào từng thắc mắc
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {conciseFaqs.map((faq, idx) => {
              const isOpen = openFaqs.includes(idx);
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-sky-300 bg-white shadow-xs'
                      : 'border-slate-200/90 bg-slate-50/50 hover:border-sky-200'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(idx)}
                    className="w-full min-h-[52px] p-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 gap-3 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-600 select-none"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                        isOpen ? 'bg-sky-700 text-white' : 'bg-slate-200/80 text-slate-600'
                      }`}>
                        0{idx + 1}
                      </span>
                      <span className="leading-snug">{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-sky-700' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
