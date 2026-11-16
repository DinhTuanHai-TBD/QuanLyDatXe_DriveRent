import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck,
  ShieldCheck,
  HelpCircle,
  Phone,
  Car,
  Bike,
  CreditCard,
  FileText,
  Sparkles,
  ArrowRight,
  Scale,
  ChevronDown,
  Check,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  LifeBuoy,
  Zap,
  RotateCcw,
  ExternalLink,
  Globe,
  X,
  Compass,
  BadgeCheck,
  Calculator,
  AlertTriangle,
  Layers,
  HeartHandshake
} from 'lucide-react';

import nhaTrangCoastalBay from '../../assets/images/nha_trang_coastal_bay.jpg';

export interface CountryRule {
  id: string;
  nameVi: string;
  nameEn: string;
  flag: string;
  group: 'vn' | 'intl' | 'asean' | 'special';
  groupBadge: string;
  groupName: string;
  canDriveCar: boolean;
  canDriveBike: boolean;
  carHeadline: string;
  carDocDesc: string;
  bikeDocDesc: string;
  legalBasis: string;
  specialAdvice?: string;
  keywords: string[];
}

export const COUNTRY_DATABASE: CountryRule[] = [
  {
    id: 'vn',
    nameVi: 'Việt Nam & Việt kiều',
    nameEn: 'Vietnam & Expats',
    flag: '🇻🇳',
    group: 'vn',
    groupBadge: 'VN / PET',
    groupName: 'Trong nước & Việt kiều',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Luật Giao thông Đường bộ Việt Nam',
    carDocDesc: 'CCCD gắn chip / VNeID mức 2 + GPLX hạng B1, B2 hoặc B hợp lệ (hoặc GPLX Việt Nam thẻ PET đổi từ bằng nước ngoài).',
    bikeDocDesc: 'CCCD gắn chip + GPLX hạng A1/A2 (đối với xe xăng), hoặc 100% MIỄN BẰNG LÁI đối với Xe máy điện thông minh VinFast Feliz/Evo.',
    legalBasis: 'Luật Giao thông Đường bộ Việt Nam & Thông tư 12/2017/TT-BGTVT',
    keywords: ['viet nam', 'vietnam', 'vn', 'viet kieu', 'viet', 'ha noi', 'sai gon', 'nha trang']
  },
  {
    id: 'korea',
    nameVi: 'Hàn Quốc (South Korea)',
    nameEn: 'South Korea',
    flag: '🇰🇷',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Hàn Quốc là thành viên)',
    carDocDesc: 'Hộ chiếu (Passport) còn hạn + Bằng lái quốc tế IDP Vienna 1968 (Class B) + Bằng lái gốc Hàn Quốc (National Driver’s License).',
    bikeDocDesc: 'IDP Vienna 1968 Hạng A + Bằng gốc, HOẶC Thuê Xe máy điện VinFast (100% Miễn bằng lái theo luật VN).',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['han quoc', 'korea', 'south korea', 'han', 'kr', '한국', 'korean']
  },
  {
    id: 'russia',
    nameVi: 'Nga (Russia)',
    nameEn: 'Russia',
    flag: '🇷🇺',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Nga là thành viên sáng lập)',
    carDocDesc: 'Hộ chiếu (Passport) còn hạn + Bằng lái quốc tế IDP Vienna 1968 + Bằng lái gốc Liên bang Nga còn thời hạn.',
    bikeDocDesc: 'IDP Vienna 1968 Hạng A + Bằng gốc, HOẶC Thuê Xe máy điện VinFast (100% Miễn bằng lái theo luật VN).',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['nga', 'russia', 'russian', 'ru', 'россия', 'русский']
  },
  {
    id: 'china',
    nameVi: 'Trung Quốc (China)',
    nameEn: 'China',
    flag: '🇨🇳',
    group: 'special',
    groupBadge: 'CHƯA TỰ LÁI Ô TÔ',
    groupName: 'Quốc gia cần lưu ý đặc biệt',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'CHƯA HỖ TRỢ TỰ LÁI Ô TÔ THEO LUẬT GTĐB VIỆT NAM',
    carDocDesc: 'Trung Quốc chưa gia nhập Công ước Vienna 1968. Bằng lái Trung Quốc hoặc bằng IAA chưa có giá trị tự lái ô tô tại VN.',
    bikeDocDesc: 'Đặc quyền du lịch biển: Thuê Xe máy điện thông minh VinFast Feliz/Evo — 100% MIỄN BẰNG LÁI theo luật Việt Nam.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT (Việt Nam chỉ chấp thuận IDP Vienna 1968)',
    specialAdvice: 'Khách Trung Quốc nên chọn gói Thuê xe kèm tài xế riêng hoặc đổi sang Xe máy điện thông minh VinFast để an tâm 100%.',
    keywords: ['trung quoc', 'china', 'chinese', 'cn', 'tq', '中国', '中國', 'taiwan']
  },
  {
    id: 'usa',
    nameVi: 'Mỹ / Hoa Kỳ (United States)',
    nameEn: 'United States (USA)',
    flag: '🇺🇸',
    group: 'special',
    groupBadge: 'IDP 1949 / AAA',
    groupName: 'Quốc gia cần lưu ý đặc biệt',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'LƯU Ý: MỸ THUỘC CÔNG ƯỚC GENEVA 1949 (CHƯA ĐƯỢC CHẤP THUẬN TỰ LÁI Ô TÔ TẠI VN)',
    carDocDesc: 'Bằng quốc tế AAA của Mỹ theo Công ước Geneva 1949. Để tự lái ô tô tại VN, quý khách cần đổi sang bằng PET VN hoặc có IDP Vienna 1968.',
    bikeDocDesc: 'Thuê Xe máy điện VinFast Feliz/Evo (100% Miễn bằng lái) hoặc chọn dịch vụ thuê xe có tài xế.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT & Công ước Vienna 1968',
    specialAdvice: 'Khuyến nghị: Chọn gói thuê ô tô có tài xế riêng hoặc thuê xe máy điện VinFast vi vu nội ô.',
    keywords: ['my', 'hoa ky', 'usa', 'united states', 'america', 'us']
  },
  {
    id: 'australia',
    nameVi: 'Úc (Australia)',
    nameEn: 'Australia',
    flag: '🇦🇺',
    group: 'special',
    groupBadge: 'CẦN ĐỔI BẰNG PET',
    groupName: 'Quốc gia cần lưu ý đặc biệt',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'Úc chưa gia nhập Công ước Vienna 1968',
    carDocDesc: 'Bằng lái xe Úc cần đổi sang bằng lái xe Việt Nam (thẻ PET) tại Sở GTVT nếu lưu trú dài hạn.',
    bikeDocDesc: 'Thuê xe máy điện VinFast thông minh (Miễn bằng lái 100%) hoặc thuê ô tô kèm tài xế riêng.',
    legalBasis: 'Thông tư 12/2017/TT-BGTVT',
    keywords: ['uc', 'australia', 'aus', 'au']
  },
  {
    id: 'thailand',
    nameVi: 'Thái Lan (Thailand)',
    nameEn: 'Thailand',
    flag: '🇹🇭',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối Hiệp định ASEAN 1985',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định Công nhận Giấy phép lái xe khối ASEAN 1985',
    carDocDesc: 'Hộ chiếu + Bằng lái quốc gia Thái Lan dạng thẻ nhựa Smart Card có tiếng Anh song ngữ (Miễn bằng IDP quốc tế).',
    bikeDocDesc: 'Bằng lái xe máy Thái Lan (thẻ nhựa song ngữ tiếng Anh) hoặc Xe máy điện VinFast.',
    legalBasis: 'Hiệp định Kuala Lumpur 1985 & Thông tư 12/2017/TT-BGTVT',
    keywords: ['thai lan', 'thailand', 'thai', 'th']
  },
  {
    id: 'malaysia',
    nameVi: 'Malaysia',
    nameEn: 'Malaysia',
    flag: '🇲🇾',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối Hiệp định ASEAN 1985',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định ASEAN 1985',
    carDocDesc: 'Hộ chiếu + Bằng lái xe Malaysia MyKad / thẻ nhựa có in song ngữ tiếng Anh còn hiệu lực.',
    bikeDocDesc: 'Bằng lái xe máy song ngữ tiếng Anh, hoặc Xe máy điện VinFast.',
    legalBasis: 'Hiệp định Kuala Lumpur 1985',
    keywords: ['malaysia', 'ma lay', 'my']
  }
];

export const POPULAR_QUICK_PILLS = [
  { id: 'vn', label: 'Việt Nam 🇻🇳' },
  { id: 'korea', label: 'Hàn Quốc 🇰🇷' },
  { id: 'russia', label: 'Nga 🇷🇺' },
  { id: 'china', label: 'Trung Quốc 🇨🇳' },
  { id: 'usa', label: 'Hoa Kỳ 🇺🇸' },
  { id: 'thailand', label: 'Thái Lan 🇹🇭' }
];

export const RegulationsCustomerView: React.FC = () => {
  const { setCustomerTab, settings, t } = useApp();
  const brandName = settings?.brandTitle || settings?.storeName || 'Nha Trang Car';
  const hotline = settings?.hotline || '0905 888 999';

  // State: Bộ lọc loại xe
  const [vehicleFilter, setVehicleFilter] = useState<'car' | 'motorbike'>('car');

  // State: Quốc gia đang chọn
  const [selectedCountry, setSelectedCountry] = useState<CountryRule>(COUNTRY_DATABASE[0]);

  // State: Modal chọn quốc gia
  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>('');

  // State: Widget tính nhanh tiền đặt cọc trách nhiệm
  const [calcVehicleTier, setCalcVehicleTier] = useState<'scooter' | 'ev_scooter' | 'sedan' | 'suv'>('sedan');

  // State: Progressive Disclosure Accordions cho 4 điều khoản (mặc định mở điều khoản 1)
  const [openPolicyAccordion, setOpenPolicyAccordion] = useState<number | null>(0);

  // State: FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Khóa cuộn trang khi mở modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCountryModal) {
        setShowCountryModal(false);
      }
    };
    if (showCountryModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCountryModal]);

  const modalFilteredCountries = useMemo(() => {
    const q = modalSearch.toLowerCase().trim();
    if (!q) return COUNTRY_DATABASE;
    return COUNTRY_DATABASE.filter(c =>
      c.nameVi.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.keywords.some(k => k.includes(q))
    );
  }, [modalSearch]);

  const depositCalcDetails = useMemo(() => {
    switch (calcVehicleTier) {
      case 'scooter':
        return {
          title: 'Xe máy xăng phổ thông (Vision, AirBlade, Wave)',
          depositCar: '1.000.000₫ – 2.000.000₫',
          depositTraffic: '0₫ (100% Miễn giữ cọc phạt nguội)',
          refundSpeed: 'Hoàn tức thì 5 phút qua VietQR khi nhận bàn giao',
          alternative: 'Chấp nhận để lại 01 xe máy chính chủ hoặc CCCD đối chiếu'
        };
      case 'ev_scooter':
        return {
          title: 'Xe máy điện VinFast (Feliz S, Evo 200 - Miễn bằng lái)',
          depositCar: '1.000.000₫',
          depositTraffic: '0₫ (Miễn giữ)',
          refundSpeed: 'Hoàn ngay khi kiểm tra xe trong 5 phút',
          alternative: 'Miễn 100% tiền mặt nếu có vé máy bay khứ hồi'
        };
      case 'sedan':
        return {
          title: 'Ô tô 4 – 5 chỗ tự lái (Vios, Accent, Mazda 3, VF5, VF6)',
          depositCar: '5.000.000₫ (hoặc thế chấp 01 xe máy chính chủ)',
          depositTraffic: '1.000.000₫ (Cọc phạt nguội, hoàn sau 15 ngày)',
          refundSpeed: 'Cọc xe hoàn ngay khi trả xe • Cọc phạt nguội đối soát qua tài khoản',
          alternative: 'Chấp nhận thế chấp xe máy có Cavet gốc trị giá trên 15 triệu'
        };
      case 'suv':
        return {
          title: 'Ô tô 7 chỗ & SUV cao cấp (Xpander, Everest, Carnival, VF8, VF9)',
          depositCar: '10.000.000₫ (hoặc thế chấp xe máy tay ga SH / AirBlade)',
          depositTraffic: '2.000.000₫ (Cọc phạt nguội đối soát biên bản)',
          refundSpeed: 'Hoàn trả tự động qua VietQR 24/7',
          alternative: 'Bảo lưu cọc 100% cho các lần thuê sau không mất phí'
        };
    }
  }, [calcVehicleTier]);

  // 4 Điều khoản chính được rút gọn theo Progressive Disclosure (Tóm tắt 1 dòng + Bung chi tiết khi click)
  const policyAccordions = [
    {
      id: 0,
      title: '1. Đặt cọc & Hoàn tiền minh bạch',
      summary: 'Cọc giữ xe chỉ từ 500k – 1tr qua VietQR • Hoàn trả 100% trong 5 phút khi trả xe.',
      icon: CreditCard,
      badge: 'Hoàn 5 phút',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: [
        'Đặt cọc giữ xe online: Chỉ từ 500.000₫ (xe máy) đến 1.000.000₫ (ô tô) để khóa xe trên hệ thống.',
        'Thế chấp khi nhận xe: Xe máy 1 - 2tr hoặc ô tô 5 - 10tr (hoặc để lại 01 xe máy chính chủ).',
        'Hoàn trả siêu tốc: Kiểm tra xe xong, nhân viên hoàn trả 100% tiền cọc qua VietQR 24/7 trong 5 phút.',
        'Chính sách đổi lịch: Miễn phí đổi ngày giữ xe bảo lưu 100% tiền cọc (chỉ cần báo trước 12 tiếng).'
      ]
    },
    {
      id: 1,
      title: '2. Bảo hiểm thân vỏ & Miễn trừ trách nhiệm',
      summary: '100% xe có bảo hiểm vật chất 2 chiều • Miễn trừ trách nhiệm trước các vết xước nhỏ.',
      icon: ShieldCheck,
      badge: 'Bảo hiểm 100%',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      details: [
        'Bảo hiểm vật chất 2 chiều: Toàn bộ đội xe DriveRent đều được mua bảo hiểm thân vỏ chính hãng.',
        'Trầy xước nhỏ thông thường: Khách hàng được miễn trừ bồi thường đối với các vết xước dăm nhẹ dưới 5cm.',
        'Sự cố va chạm lớn: Chi trả theo mức khấu trừ bảo hiểm cố định (500k - 1tr/vụ) theo hợp đồng bảo hiểm nhà nước.',
        'Cứu hộ tai nạn: Đội ngũ kỹ thuật hỗ trợ lập biên bản hiện trường và bố trí xe thay thế tương đương.'
      ]
    },
    {
      id: 2,
      title: '3. Quy định phạt nguội & Tra cứu công khai',
      summary: 'Chỉ giữ cọc trách nhiệm 1 – 2tr • Hoàn trả tự động sau 15 ngày đối soát Cục CSGT.',
      icon: Scale,
      badge: 'Đối soát CSGT',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      details: [
        'Đối soát minh bạch: Tra cứu trực tiếp trên Cổng thông tin Cục CSGT (csgt.vn) theo đúng biển số và khung giờ thuê.',
        'Mức cọc phạt nguội: Xe máy miễn giữ cọc (0đ); Ô tô tự lái giữ 1.000.000₫ – 2.000.000₫ trong 15 ngày.',
        'Hoàn cọc tự động: Sau 15 ngày không có biên bản vi phạm, tiền được hoàn 100% về số tài khoản của khách.',
        'Nếu có vi phạm: DriveRent gửi trích xuất hình ảnh, biên bản phạt nguội và khách hàng chỉ nộp đúng số tiền kho bạc quy định.'
      ]
    },
    {
      id: 3,
      title: '4. Bàn giao phương tiện & Xăng / Pin',
      summary: 'Bình đầy 100% khi nhận xe • Quay video 360° công khai • Miễn phí trễ giờ dưới 1 tiếng.',
      icon: Car,
      badge: 'Minh bạch 360°',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      details: [
        'Mức nhiên liệu: Nhận xe bình đầy 100% xăng/pin thì khi trả xe hoàn trả tương đương (hoặc thanh toán theo giá niêm yết cây xăng).',
        'Quay video 360°: Nhân viên và khách cùng quay video ngoại quan xe trước khi lăn bánh để đảm bảo không tranh cãi khi trả.',
        'Thời gian trả xe: Miễn phí hỗ trợ trễ giờ đến 59 phút; quá từ 1 đến 3 tiếng tính phụ thu theo giờ siêu rẻ (50k - 100k/giờ).',
        'Vệ sinh xe: Rửa xe thông thường miễn phí 100%; chỉ tính phí nếu xe bị bám bùn đất đặc biệt hoặc dính mùi hải sản tươi sống.'
      ]
    }
  ];

  // 4 Câu hỏi FAQ ngắn gọn súc tích (Dưới 2 câu)
  const faqs = [
    {
      q: 'Showroom có giữ bản gốc CCCD hoặc Hộ chiếu của tôi không?',
      a: 'Tuyệt đối KHÔNG. DriveRent chỉ chụp ảnh hoặc quét chip đối chiếu 2 phút rồi gửi trả bản gốc ngay để quý khách check-in khách sạn và lên máy bay.'
    },
    {
      q: 'Nếu chuyến bay đến Sân bay Cam Ranh bị delay thì có bị phạt không?',
      a: '100% Miễn phí phạt delay. Nhân viên theo dõi số hiệu chuyến bay của quý khách và luôn chờ sẵn tại cửa ga đến đúng giờ máy bay hạ cánh.'
    },
    {
      q: 'Tôi không có bằng lái xe quốc tế IDP thì có được thuê xe không?',
      a: 'Quý khách hoàn toàn có thể thuê Xe máy điện VinFast thông minh (Luật VN miễn 100% bằng lái) hoặc chọn dịch vụ Thuê ô tô kèm tài xế riêng.'
    },
    {
      q: 'Tiền đặt cọc giữ xe được hoàn lại bằng hình thức nào và trong bao lâu?',
      a: 'Tiền cọc được hoàn trả 100% qua chuyển khoản VietQR 24/7 chỉ trong vòng 5 phút ngay khi nhân viên nghiệm thu bàn giao xe.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 selection:bg-sky-500 selection:text-white space-y-10 sm:space-y-12">
      
      {/* ========================================================================= */}
      {/* 1. HERO COVER WIDE PANORAMA 1440PX */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden w-full min-h-[420px] sm:min-h-[460px] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-sky-200/80 shadow-xs"
        style={{
          backgroundImage: `url(${nhaTrangCoastalBay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-sky-950/80 to-slate-950/90 pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-center space-y-5 my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-cyan-300 border border-white/20 backdrop-blur-md text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="tracking-wide uppercase font-black">
              QUY ĐỊNH THUÊ XE &amp; CAM KẾT MINH BẠCH
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-md">
              Hợp Đồng Rõ Ràng &bull; Cam Kết &ldquo;3 KHÔNG&rdquo; An Tâm 100%
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-200 max-w-3xl mx-auto drop-shadow-sm leading-relaxed text-pretty">
              Không giữ bản gốc CCCD/Passport &bull; Không chi phí ẩn phát sinh &bull; Không phạt mất cọc khi đổi ngày.
            </p>
          </div>

          {/* 3 Pills Cam Kết Lớn */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-black">
            <div className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1. Không giữ CCCD gốc</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>2. 0đ Phụ phí ẩn</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-md flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3. Đổi ngày giữ cọc 100%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. NỘI DUNG CHÍNH (BỐ CỤC 2 CỘT 3.5 : 6.5 TRÊN KHUNG CHUẨN 1440PX) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================================= */}
          {/* CỘT TRÁI (3.5 / COL-SPAN-4): WIDGET TÍNH CỌC & TỔNG ĐÀI HỖ TRỢ */}
          {/* ======================================================================= */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
            
            {/* WIDGET TÍNH THỬ TIỀN CỌC TRÁCH NHIỆM */}
            <div className="bg-white rounded-3xl border border-sky-200/90 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0">
                    <Calculator className="w-4 h-4 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 tracking-tight">Tính Thử Tiền Cọc</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Minh bạch theo từng phân khúc xe</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Hoàn 5p
                </span>
              </div>

              {/* 4 Tabs chọn loại xe */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'sedan', label: 'Ô tô 4-5 chỗ', sub: 'Vios, Accent, VF5' },
                  { id: 'suv', label: 'Ô tô 7 chỗ', sub: 'Xpander, Carnival' },
                  { id: 'scooter', label: 'Xe máy xăng', sub: 'Vision, AirBlade' },
                  { id: 'ev_scooter', label: 'Xe máy điện', sub: 'VinFast Feliz' }
                ].map((tier) => {
                  const isSelected = calcVehicleTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setCalcVehicleTier(tier.id as any)}
                      className={`min-h-[46px] p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-sky-700 text-white border-sky-700 shadow-2xs font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 font-medium'
                      }`}
                    >
                      <div className="text-xs truncate">{tier.label}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                        {tier.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Kết quả tính tiền cọc */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-sky-100">
                  <span className="text-slate-600 font-medium">Tiền cọc thế chấp:</span>
                  <span className="font-mono font-black text-sky-900 text-sm">{depositCalcDetails.depositCar}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-sky-100">
                  <span className="text-slate-600 font-medium">Cọc phạt nguội:</span>
                  <span className="font-mono font-bold text-slate-800">{depositCalcDetails.depositTraffic}</span>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-slate-500 text-[11px] block">Tốc độ hoàn tiền:</span>
                  <p className="font-bold text-emerald-700 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{depositCalcDetails.refundSpeed}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* HOTLINE SOS HỖ TRỢ PHÁP LÝ & HỢP ĐỒNG 24/7 */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 p-5 sm:p-6 text-white border border-sky-800/80 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-sky-800/80">
                <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                  Tư Vấn Hợp Đồng 24/7
                </span>
                <span className="text-[10px] font-bold text-cyan-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                  Miễn phí
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Cần hỗ trợ xác nhận bằng lái quốc tế hoặc thủ tục thế chấp xe cá nhân? Gọi hotline điều phối:
              </p>

              <a
                href={`tel:${hotline.replace(/\s+/g, '')}`}
                className="w-full min-h-[46px] p-3 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span className="font-mono tracking-wider tabular-nums">{hotline}</span>
              </a>
            </div>

          </aside>

          {/* ======================================================================= */}
          {/* CỘT PHẢI (6.5 / COL-SPAN-8): NỘI DUNG ĐÃ TINH GỌN (DISTILLED) */}
          {/* ======================================================================= */}
          <main className="lg:col-span-8 space-y-8 min-w-0">
            
            {/* =================================================================== */}
            {/* YÊU CẦU 3: 2 CARD ĐỒ HỌA SO SÁNH GIẤY TỜ (VN VS QUỐC TẾ) */}
            {/* =================================================================== */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5 mb-0.5">
                    <FileCheck className="w-4 h-4 text-sky-700" />
                    <span>Hồ Sơ Nhận Chìa Khóa</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Thủ Tục Giấy Tờ Cần Chuẩn Bị
                  </h2>
                </div>
                <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
                  Chỉ đối chiếu 2 phút &bull; 0 giữ bản gốc
                </span>
              </div>

              {/* Lưới 2 Card Đồ Họa Bento (VN vs Quốc Tế) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* CARD 1: KHÁCH VIỆT NAM & VIỆT KIỀU */}
                <div className="rounded-3xl border-2 border-emerald-200/90 bg-gradient-to-b from-emerald-50/40 via-white to-white p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">🇻🇳</span>
                        <div>
                          <h3 className="font-black text-slate-900 text-base">Khách Trong Nước</h3>
                          <span className="text-xs text-emerald-800 font-bold">Việt Nam &bull; Việt kiều</span>
                        </div>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-2xs">
                        2 Phút
                      </span>
                    </div>

                    {/* 3 Tiêu chí ngắn gọn có icon */}
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">CCCD gắn chip hoặc VNeID Mức 2</strong>
                          <span className="text-slate-600">Chỉ quét chip đối chiếu 2 phút, trả lại bản gốc ngay.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">Giấy phép lái xe (GPLX thẻ PET)</strong>
                          <span className="text-slate-600">Hạng B1/B2/B (cho ô tô) hoặc A1/A2 (cho xe máy xăng).</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">Xe máy điện VinFast: Miễn bằng lái</strong>
                          <span className="text-slate-600">100% miễn GPLX theo quy định Luật GTĐB Việt Nam.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                    <span>Thế chấp: 1 - 2tr (hoặc giữ xe máy)</span>
                    <span className="text-slate-500 font-medium">Giao xe tận sảnh</span>
                  </div>
                </div>

                {/* CARD 2: KHÁCH DU LỊCH QUỐC TẾ & ASEAN */}
                <div className="rounded-3xl border-2 border-sky-200/90 bg-gradient-to-b from-sky-50/40 via-white to-white p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">🌐</span>
                        <div>
                          <h3 className="font-black text-slate-900 text-base">Khách Quốc Tế</h3>
                          <span className="text-xs text-sky-800 font-bold">International &bull; ASEAN</span>
                        </div>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-sky-700 text-white shadow-2xs">
                        IDP 1968
                      </span>
                    </div>

                    {/* 3 Tiêu chí ngắn gọn có icon */}
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">Hộ chiếu (Passport) còn hạn</strong>
                          <span className="text-slate-600">Còn hạn trên 6 tháng kèm thị thực/dấu nhập cảnh hợp lệ.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">Bằng quốc tế IDP Vienna 1968</strong>
                          <span className="text-slate-600">Kèm bằng gốc (Khối ASEAN dùng trực tiếp bằng song ngữ).</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Zap className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">Chưa có IDP: Đổi sang xe điện / Có tài xế</strong>
                          <span className="text-slate-600">Thuê xe máy điện VinFast hoặc ô tô có tài xế riêng.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] font-bold text-sky-800">
                    <span>Hợp đồng song ngữ Anh &ndash; Việt</span>
                    <span className="text-slate-500 font-medium">Cọc thẻ Visa/Mastercard</span>
                  </div>
                </div>

              </div>

              {/* Quick Country Selector Bar (Thanh chọn nhanh quốc gia du khách) */}
              <div className="p-4 rounded-2xl bg-white border border-sky-200/90 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Globe className="w-4 h-4 text-sky-700" />
                    <span>Tra cứu nhanh theo quốc tịch du khách:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCountryModal(true)}
                    className="text-xs text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
                  >
                    Xem tất cả ({COUNTRY_DATABASE.length} nước) &rarr;
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {POPULAR_QUICK_PILLS.map((pill) => {
                    const targetC = COUNTRY_DATABASE.find(c => c.id === pill.id);
                    const isSelected = selectedCountry.id === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => targetC && setSelectedCountry(targetC)}
                        className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-sky-700 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-sky-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>

                {/* Kết quả tóm tắt 1 dòng cho quốc gia đang chọn */}
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/70 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{selectedCountry.flag}</span>
                    <div className="truncate">
                      <strong className="text-slate-900">{selectedCountry.nameVi}:</strong>{' '}
                      <span className="text-slate-600">
                        {vehicleFilter === 'car' ? selectedCountry.carHeadline : selectedCountry.bikeDocDesc}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white text-sky-800 border border-sky-200 shrink-0">
                    {selectedCountry.groupBadge}
                  </span>
                </div>
              </div>
            </section>

            {/* =================================================================== */}
            {/* YÊU CẦU 1: BẢNG SO SÁNH TRỰC QUAN "3 KHÔNG" VỚI ICON ✅ / ❌ */}
            {/* =================================================================== */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5 mb-0.5">
                    <Scale className="w-4 h-4 text-sky-700" />
                    <span>Minh Bạch Tuyệt Đối</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Bảng So Sánh &ldquo;3 KHÔNG&rdquo; An Tâm
                  </h2>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                  Chuẩn mực dịch vụ mới
                </span>
              </div>

              {/* Bảng so sánh 2 cột với icon ✅ / ❌ */}
              <div className="bg-white rounded-3xl border border-sky-200/90 shadow-sm overflow-hidden">
                <div className="grid grid-cols-2 bg-gradient-to-r from-slate-100 via-sky-50 to-sky-100/70 p-4 border-b border-sky-200 text-xs font-black uppercase tracking-wider">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <span>❌ Thuê Xe Truyền Thống / Nơi Khác</span>
                  </div>
                  <div className="text-sky-900 flex items-center gap-1.5 pl-3 border-l border-sky-200">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>✅ Tiêu Chuẩn DriveRent Nha Trang</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  
                  {/* Dòng 1: Giữ giấy tờ gốc */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/30 transition-colors">
                    <div className="flex items-start gap-2.5 text-slate-500">
                      <span className="text-base text-rose-500 shrink-0 font-bold">✕</span>
                      <div>
                        <strong className="text-slate-700 block font-bold">Giữ lại CCCD hoặc Hộ chiếu gốc</strong>
                        <span>Rủi ro thất lạc, bất tiện khi nhận phòng khách sạn hoặc làm thủ tục bay.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-800 sm:pl-3 sm:border-l sm:border-slate-100">
                      <span className="text-base text-emerald-600 shrink-0 font-bold">✓</span>
                      <div>
                        <strong className="text-emerald-800 block font-bold">100% KHÔNG giữ giấy tờ gốc</strong>
                        <span>Chỉ quét chip CCCD/VNeID hoặc chụp Passport 2 phút rồi gửi trả khách ngay.</span>
                      </div>
                    </div>
                  </div>

                  {/* Dòng 2: Chi phí ẩn */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/30 transition-colors">
                    <div className="flex items-start gap-2.5 text-slate-500">
                      <span className="text-base text-rose-500 shrink-0 font-bold">✕</span>
                      <div>
                        <strong className="text-slate-700 block font-bold">Phụ thu nhiều khoản chi phí ẩn</strong>
                        <span>Tính thêm tiền rửa xe, phụ phí bảo hiểm, phạt tiền khi chuyến bay delay trễ giờ.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-800 sm:pl-3 sm:border-l sm:border-slate-100">
                      <span className="text-base text-emerald-600 shrink-0 font-bold">✓</span>
                      <div>
                        <strong className="text-emerald-800 block font-bold">100% KHÔNG phụ phí ẩn</strong>
                        <span>Giá thuê trọn gói đã niêm yết trên web; rửa xe thông thường và delay bay miễn phí.</span>
                      </div>
                    </div>
                  </div>

                  {/* Dòng 3: Mất cọc khi đổi ngày */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/30 transition-colors">
                    <div className="flex items-start gap-2.5 text-slate-500">
                      <span className="text-base text-rose-500 shrink-0 font-bold">✕</span>
                      <div>
                        <strong className="text-slate-700 block font-bold">Mất 100% tiền cọc khi đổi lịch</strong>
                        <span>Hủy lịch hoặc dời ngày do thời tiết bị phạt toàn bộ tiền cọc, hoàn tiền om vốn 30 ngày.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-800 sm:pl-3 sm:border-l sm:border-slate-100">
                      <span className="text-base text-emerald-600 shrink-0 font-bold">✓</span>
                      <div>
                        <strong className="text-emerald-800 block font-bold">100% KHÔNG phạt mất cọc</strong>
                        <span>Bảo lưu cọc 100% cho lần thuê sau; hoàn cọc siêu tốc trong 5 phút qua VietQR 24/7.</span>
                      </div>
                    </div>
                  </div>

                  {/* Dòng 4: Bàn giao xe minh bạch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/30 transition-colors">
                    <div className="flex items-start gap-2.5 text-slate-500">
                      <span className="text-base text-rose-500 shrink-0 font-bold">✕</span>
                      <div>
                        <strong className="text-slate-700 block font-bold">Bàn giao qua loa, dễ tranh cãi</strong>
                        <span>Xe cũ, không quay video vết xước, dễ phát sinh tranh chấp đền bù khi trả xe.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-800 sm:pl-3 sm:border-l sm:border-slate-100">
                      <span className="text-base text-emerald-600 shrink-0 font-bold">✓</span>
                      <div>
                        <strong className="text-emerald-800 block font-bold">Quay video 360° công khai &amp; Bình đầy</strong>
                        <span>Đội xe đời mới 2023 - 2025, quay video chi tiết trước mặt khách, bình đầy xăng/pin.</span>
                      </div>
                    </div>
                  </div>

                  {/* Dòng 5: Cứu hộ khẩn cấp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/30 transition-colors">
                    <div className="flex items-start gap-2.5 text-slate-500">
                      <span className="text-base text-rose-500 shrink-0 font-bold">✕</span>
                      <div>
                        <strong className="text-slate-700 block font-bold">Khách tự xử lý sự cố trên đường</strong>
                        <span>Tự gọi thợ ngoài, tự trả chi phí cứu hộ hoặc kéo xe dọc đèo rất tốn kém.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-800 sm:pl-3 sm:border-l sm:border-slate-100">
                      <span className="text-base text-emerald-600 shrink-0 font-bold">✓</span>
                      <div>
                        <strong className="text-emerald-800 block font-bold">Đội cứu hộ 24/7 có mặt trong 20 phút</strong>
                        <span>Miễn phí vá lốp, kích bình, đổi ngay xe tương đương nếu phát sinh lỗi máy.</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* =================================================================== */}
            {/* YÊU CẦU 2: PROGRESSIVE DISCLOSURE - 4 ĐIỀU KHOẢN TÓM TẮT 1 DÒNG */}
            {/* =================================================================== */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5 mb-0.5">
                    <Layers className="w-4 h-4 text-sky-700" />
                    <span>Điều Khoản Chi Tiết</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Chi Tiết Chính Sách (Chạm Để Mở Rộng)
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Chỉ cần đọc dòng tóm tắt &bull; Bung ra khi cần tra cứu
                </span>
              </div>

              {/* Danh sách 4 Policy Accordions */}
              <div className="space-y-3">
                {policyAccordions.map((item) => {
                  const isOpen = openPolicyAccordion === item.id;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-sky-400 shadow-md ring-2 ring-sky-500/15'
                          : 'border-sky-200/90 hover:border-sky-300 shadow-2xs'
                      }`}
                    >
                      {/* Accordion Trigger Header: 1 DÒNG TÓM TẮT RÕ RÀNG */}
                      <button
                        type="button"
                        onClick={() => setOpenPolicyAccordion(isOpen ? null : item.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isOpen ? 'bg-sky-700 text-white shadow-2xs' : 'bg-sky-50 text-sky-700'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate">
                                {item.title}
                              </h3>
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 hidden sm:inline-block ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            </div>

                            {/* DÒNG TÓM TẮT 1 DÒNG (ONE-LINE SUMMARY) */}
                            <p className="text-xs text-slate-600 truncate font-medium">
                              {item.summary}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isOpen ? 'bg-sky-100 text-sky-800 rotate-180' : 'text-slate-400'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {/* Chi tiết ẩn chỉ hiện khi click */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 sm:pl-17 border-t border-sky-100 bg-sky-50/30 space-y-2.5 text-xs text-slate-700 animate-in fade-in duration-200">
                          {item.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* =================================================================== */}
            {/* FAQ 2 CỘT RÚT GỌN (DƯỚI 2 CÂU NGẮN GỌN) */}
            {/* =================================================================== */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="space-y-0.5">
                  <div className="text-xs font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-sky-700" />
                    <span>Giải Đáp Nhanh</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Câu Hỏi Phổ Biến Về Thủ Tục &amp; Cọc
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isOpen ? 'bg-white border-sky-300 shadow-2xs' : 'bg-white border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 flex items-center justify-between gap-2 text-left font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                      >
                        <span className="leading-snug">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-sky-700' : 'text-slate-400'}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-sky-100 bg-sky-50/20">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* BANNER TỔNG ĐÀI HỖ TRỢ & XEM XE ĐẶT NGAY */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-800/80">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-300 bg-sky-900/80 px-3 py-1 rounded-full border border-sky-700 inline-block">
                  ĐẶT XE ONLINE 1-CHẠM
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Đã nắm rõ quy định? Khám phá đội xe ngay hôm nay!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Đội xe 2023 - 2025 sạch đẹp, giao xe tận nơi chỉ sau 15 phút xác nhận.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <a
                  href={`tel:${hotline.replace(/\s+/g, '')}`}
                  className="min-h-[46px] px-5 py-2.5 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-sky-700 transition-all select-none"
                >
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>{hotline}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setCustomerTab('vehicles')}
                  className="min-h-[46px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
                >
                  <span>Xem danh sách xe &bull; Đặt cọc</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </main>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPUP MODAL: DANH SÁCH TẤT CẢ CÁC QUỐC GIA ĐỂ KHÁCH DU LỊCH CHỌN */}
      {/* ========================================================================= */}
      {showCountryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowCountryModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-sky-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-sky-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-white">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-sky-700" />
                <h3 className="font-black text-base sm:text-lg text-slate-900">
                  Chọn Quốc Tịch Du Khách ({COUNTRY_DATABASE.length} Nước)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCountryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search Box */}
            <div className="p-4 border-b border-sky-100 bg-slate-50/50">
              <input
                type="text"
                placeholder="Tìm tên quốc gia (Ví dụ: Hàn Quốc, Nga, China, USA...)"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20"
                autoFocus
              />
            </div>

            {/* Modal Country List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {modalFilteredCountries.map((c) => {
                const isSelected = selectedCountry.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c);
                      setShowCountryModal(false);
                    }}
                    className={`w-full min-h-[48px] p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900">{c.nameVi}</div>
                        <div className="text-[11px] text-slate-500">{c.nameEn}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {c.groupBadge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
