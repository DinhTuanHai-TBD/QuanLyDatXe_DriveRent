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
  Sparkles,
  Scale,
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  Zap,
  RotateCcw,
  Globe,
  X,
  BadgeCheck,
  AlertTriangle,
  Layers,
  Fuel,
  Clock,
  ExternalLink,
  Check,
  FileText,
  Info,
  ShieldAlert
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
    groupName: 'Hiệp ước ASEAN 1985',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định Công nhận Bằng lái ASEAN 1985',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái xe Thái Lan dạng thẻ nhựa thông minh có tiếng Anh (Smart Card Driving License).',
    bikeDocDesc: 'Bằng xe máy Thái Lan (thẻ tiếng Anh) hoặc Thuê Xe máy điện VinFast.',
    legalBasis: 'Hiệp định Công nhận GPLX các nước ASEAN (Ký kết 1985 tại Kuala Lumpur)',
    keywords: ['thai lan', 'thailand', 'thai', 'th']
  },
  {
    id: 'malaysia',
    nameVi: 'Malaysia',
    nameEn: 'Malaysia',
    flag: '🇲🇾',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Hiệp ước ASEAN 1985',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định Công nhận Bằng lái ASEAN 1985',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái xe quốc gia Malaysia (có tiếng Anh) còn thời hạn.',
    bikeDocDesc: 'Bằng lái xe máy Malaysia có tiếng Anh hoặc Thuê Xe máy điện VinFast.',
    legalBasis: 'Hiệp định Công nhận GPLX các nước ASEAN',
    keywords: ['malaysia', 'ma lay', 'my']
  },
  {
    id: 'singapore',
    nameVi: 'Singapore',
    nameEn: 'Singapore',
    flag: '🇸🇬',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Hiệp ước ASEAN 1985',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định Công nhận Bằng lái ASEAN 1985',
    carDocDesc: 'Hộ chiếu + Bằng lái xe Singapore (Singapore Driving Licence) còn hiệu lực.',
    bikeDocDesc: 'Bằng lái Class 2B/2A/2 Singapore hoặc Xe máy điện VinFast.',
    legalBasis: 'Hiệp định Công nhận GPLX các nước ASEAN',
    keywords: ['singapore', 'sing', 'sg']
  },
  {
    id: 'germany',
    nameVi: 'Đức (Germany)',
    nameEn: 'Germany',
    flag: '🇩🇪',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Đức là thành viên)',
    carDocDesc: 'Hộ chiếu + Bằng quốc tế IDP Vienna 1968 (Führerschein) + Bằng lái quốc gia Đức.',
    bikeDocDesc: 'IDP Vienna 1968 Hạng A + Bằng gốc, hoặc Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['duc', 'germany', 'deutschland', 'de']
  },
  {
    id: 'france',
    nameVi: 'Pháp (France)',
    nameEn: 'France',
    flag: '🇫🇷',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Pháp là thành viên sáng lập)',
    carDocDesc: 'Hộ chiếu + Bằng quốc tế IDP Vienna 1968 (Permis International) + Bằng lái quốc gia Pháp.',
    bikeDocDesc: 'IDP Vienna 1968 Hạng A + Bằng gốc, hoặc Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['phap', 'france', 'french', 'fr']
  },
  {
    id: 'uk',
    nameVi: 'Vương Quốc Anh (United Kingdom)',
    nameEn: 'United Kingdom (UK)',
    flag: '🇬🇧',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (UK cấp IDP 1968 qua Post Office)',
    carDocDesc: 'Hộ chiếu + Bằng IDP Vienna 1968 (loại 3 năm của Post Office) + Bằng lái UK (DVLA photocard).',
    bikeDocDesc: 'IDP 1968 Hạng A + Bằng UK, hoặc Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['anh', 'vuong quoc anh', 'uk', 'united kingdom', 'britain', 'england', 'gb']
  },
  {
    id: 'japan',
    nameVi: 'Nhật Bản (Japan)',
    nameEn: 'Japan',
    flag: '🇯🇵',
    group: 'special',
    groupBadge: 'IDP 1949',
    groupName: 'Quốc gia cần lưu ý đặc biệt',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'LƯU Ý: NHẬT BẢN THUỘC CÔNG ƯỚC GENEVA 1949 (CHƯA ĐƯỢC CHẤP THUẬN TỰ LÁI Ô TÔ TẠI VN)',
    carDocDesc: 'Bằng quốc tế Nhật Bản cấp theo Công ước Geneva 1949. Để tự lái ô tô tại VN cần đổi sang bằng PET VN hoặc có IDP Vienna 1968.',
    bikeDocDesc: 'Đặc quyền du lịch biển: Thuê Xe máy điện VinFast (100% Miễn bằng lái theo luật VN) hoặc thuê ô tô kèm tài xế.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT',
    specialAdvice: 'Khuyến nghị: Chọn gói thuê ô tô có tài xế riêng hoặc thuê xe máy điện VinFast.',
    keywords: ['nhat ban', 'japan', 'jp', 'nhat', '日本']
  },
  {
    id: 'taiwan',
    nameVi: 'Đài Loan (Taiwan)',
    nameEn: 'Taiwan',
    flag: '🇹🇼',
    group: 'special',
    groupBadge: 'CẦN TÀI XẾ',
    groupName: 'Quốc gia cần lưu ý đặc biệt',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'CHƯA HỖ TRỢ TỰ LÁI Ô TÔ THEO LUẬT GTĐB VIỆT NAM',
    carDocDesc: 'Bằng lái Đài Loan và bằng quốc tế do Đài Loan cấp chưa có giá trị tự lái ô tô tại Việt Nam.',
    bikeDocDesc: 'Thuê Xe máy điện thông minh VinFast Feliz/Evo — 100% MIỄN BẰNG LÁI theo luật Việt Nam.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT',
    specialAdvice: 'Khách Đài Loan nên chọn gói thuê ô tô kèm tài xế hoặc xe máy điện VinFast để an tâm 100%.',
    keywords: ['dai loan', 'taiwan', 'tw', '台湾', '臺灣']
  },
  {
    id: 'canada',
    nameVi: 'Canada',
    nameEn: 'Canada',
    flag: '🇨🇦',
    group: 'special',
    groupBadge: 'IDP 1949 / CAA',
    groupName: 'Quốc gia cần lưu ý đặc biệt',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'LƯU Ý: CANADA THUỘC CÔNG ƯỚC GENEVA 1949 (CHƯA ĐƯỢC CHẤP THUẬN TỰ LÁI Ô TÔ TẠI VN)',
    carDocDesc: 'Bằng quốc tế CAA của Canada theo Công ước Geneva 1949. Để tự lái ô tô tại VN cần đổi sang bằng PET VN hoặc có IDP Vienna 1968.',
    bikeDocDesc: 'Thuê Xe máy điện VinFast Feliz/Evo (100% Miễn bằng lái) hoặc chọn dịch vụ thuê xe có tài xế.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT & Công ước Vienna 1968',
    specialAdvice: 'Khuyến nghị: Chọn gói thuê ô tô kèm tài xế riêng hoặc thuê xe máy điện VinFast.',
    keywords: ['canada', 'can', 'ca']
  }
];

export const POPULAR_QUICK_PILLS = [
  { id: 'vn', label: '🇻🇳 Việt Nam' },
  { id: 'korea', label: '🇰🇷 Hàn Quốc' },
  { id: 'russia', label: '🇷🇺 Nga' },
  { id: 'china', label: '🇨🇳 Trung Quốc' },
  { id: 'usa', label: '🇺🇸 Hoa Kỳ' },
  { id: 'australia', label: '🇦🇺 Úc' },
  { id: 'thailand', label: '🇹🇭 Thái Lan' }
];

export const RegulationsCustomerView: React.FC = () => {
  const { settings, t } = useApp();

  const hotline = settings?.hotline || '0905 888 999';

  // State: Phương tiện chọn trong bộ tra cứu tương tác
  const [selectedVehicleType, setSelectedVehicleType] = useState<'car' | 'scooter' | 'ev_bike'>('car');

  // State: Quốc gia đang chọn
  const [selectedCountry, setSelectedCountry] = useState<CountryRule>(COUNTRY_DATABASE[0]);

  // State: Modal xem tất cả quốc gia
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // State: Progressive Disclosure Accordions cho 4 điều khoản (mặc định mở điều khoản 0)
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

  // Đánh giá điều kiện pháp lý tức thì theo phương tiện và quốc tịch đã chọn
  const legalVerdict = useMemo(() => {
    if (selectedVehicleType === 'ev_bike') {
      return {
        status: 'valid' as const,
        badge: '100% MIỄN BẰNG LÁI',
        badgeColor: 'bg-emerald-600 text-white',
        title: 'Hợp lệ 100% không cần giấy phép lái xe',
        summary: 'Theo Luật Giao thông Đường bộ Việt Nam, xe máy điện có vận tốc dưới 50km/h (VinFast Feliz S / Evo 200) được miễn hoàn toàn bằng lái cho mọi du khách trong và ngoài nước.',
        requirements: [
          'CCCD gắn chip (khách Việt) HOẶC Hộ chiếu / Passport còn hạn (khách quốc tế).',
          'Độ tuổi từ đủ 16 tuổi trở lên.',
          'Đối chiếu scan chụp tại chỗ trong 2 phút — 100% không giữ bản gốc.'
        ],
        solution: null
      };
    }

    if (selectedVehicleType === 'car') {
      if (selectedCountry.id === 'vn') {
        return {
          status: 'valid' as const,
          badge: 'HỢP LỆ THEO LUẬT VN',
          badgeColor: 'bg-emerald-600 text-white',
          title: 'Đủ điều kiện tự lái ô tô 4 – 7 chỗ',
          summary: 'Du khách Việt Nam hoặc Việt kiều có bằng lái PET Việt Nam hợp lệ.',
          requirements: [
            'CCCD gắn chip hoặc VNeID Mức 2 (đối chiếu 2 phút, trả lại ngay).',
            'Giấy phép lái xe ô tô hạng B1, B2 hoặc B còn thời hạn.',
            'Tiền cọc thế chấp 5tr – 10tr (hoặc để lại 01 xe máy chính chủ có Cavet).'
          ],
          solution: null
        };
      }

      if (selectedCountry.canDriveCar) {
        return {
          status: 'valid' as const,
          badge: `HỢP LỆ (${selectedCountry.groupBadge})`,
          badgeColor: 'bg-sky-700 text-white',
          title: `Đủ điều kiện tự lái ô tô theo ${selectedCountry.groupName}`,
          summary: selectedCountry.carHeadline,
          requirements: [
            'Hộ chiếu (Passport) còn hạn trên 6 tháng kèm thị thực/dấu nhập cảnh.',
            selectedCountry.carDocDesc,
            'Tiền cọc thế chấp nhận xe (chấp nhận thẻ tín dụng quốc tế Visa/Mastercard hoặc tiền mặt).'
          ],
          solution: null
        };
      }

      return {
        status: 'caution' as const,
        badge: 'CẦN LƯU Ý PHÁP LÝ',
        badgeColor: 'bg-rose-600 text-white',
        title: `Chưa được tự lái ô tô theo luật GTĐB Việt Nam`,
        summary: selectedCountry.carHeadline,
        requirements: [
          selectedCountry.carDocDesc,
          'Căn cứ pháp lý: ' + selectedCountry.legalBasis
        ],
        solution: selectedCountry.specialAdvice || 'Khuyến nghị chọn gói Thuê xe kèm tài xế riêng hoặc đổi sang Xe máy điện VinFast để an tâm 100%.'
      };
    }

    // motorbike xăng
    if (selectedCountry.id === 'vn') {
      return {
        status: 'valid' as const,
        badge: 'HỢP LỆ GPLX A1 / A2',
        badgeColor: 'bg-emerald-600 text-white',
        title: 'Đủ điều kiện tự lái xe máy xăng phổ thông',
        summary: 'Sử dụng giấy phép lái xe máy phổ thông theo quy định giao thông Việt Nam.',
        requirements: [
          'CCCD gắn chip hoặc VNeID Mức 2 (chụp đối chiếu 2 phút).',
          'GPLX hạng A1 hoặc A2 còn hiệu lực.',
          'Cọc thế chấp nhẹ 1.000.000₫ – 2.000.000₫ (hoặc để lại xe máy cá nhân).'
        ],
        solution: null
      };
    }

    return {
      status: 'valid' as const,
      badge: 'CẦN BẰNG QUỐC TẾ HOẶC ĐỔI XE ĐIỆN',
      badgeColor: 'bg-indigo-700 text-white',
      title: 'Yêu cầu bằng lái xe máy quốc tế hợp lệ',
      summary: selectedCountry.bikeDocDesc,
      requirements: [
        'Hộ chiếu còn hạn + Bằng lái xe máy quốc tế IDP 1968 Hạng A (hoặc bằng ASEAN song ngữ).',
        'Nếu chưa có bằng quốc tế: Đổi ngay sang Xe máy điện VinFast (100% MIỄN BẰNG LÁI).'
      ],
      solution: 'Thuê Xe máy điện thông minh VinFast là lựa chọn số 1 của du khách nước ngoài tại Nha Trang: 0đ bằng lái, êm ái, pin chạy 150km/lần sạc.'
    };
  }, [selectedVehicleType, selectedCountry]);

  // 4 Phân khúc quy định tiền cọc minh bạch
  const depositCategories = [
    {
      id: 'scooter',
      title: 'Xe Máy Xăng Phổ Thông',
      sub: 'Vision, Air Blade, Wave RSX',
      depositHold: '200.000₫ – 500.000₫',
      depositHandover: '1.000.000₫ – 2.000.000₫',
      depositTraffic: '0₫ (100% Miễn cọc phạt nguội)',
      refundTime: 'Hoàn tức thì 5 phút qua VietQR',
      alternative: 'Chấp nhận để lại 01 xe máy chính chủ hoặc CCCD đối chiếu'
    },
    {
      id: 'ev_scooter',
      title: 'Xe Máy Điện VinFast',
      sub: 'Feliz S, Evo 200 (Miễn bằng lái)',
      depositHold: '200.000₫ – 500.000₫',
      depositHandover: '1.000.000₫',
      depositTraffic: '0₫ (Miễn cọc phạt nguội)',
      refundTime: 'Hoàn tiền 5 phút ngay khi nhận xe',
      alternative: 'Miễn 100% tiền mặt nếu có vé máy bay khứ hồi'
    },
    {
      id: 'sedan',
      title: 'Ô Tô 4 – 5 Chỗ Tự Lái',
      sub: 'Vios, Accent, Mazda 3, VF 5',
      depositHold: '500.000₫ – 1.000.000₫',
      depositHandover: '5.000.000₫',
      depositTraffic: '1.000.000₫ (hoàn sau 15 ngày)',
      refundTime: 'Cọc xe hoàn 5 phút • Cọc phạt nguội hoàn qua tài khoản',
      alternative: 'Chấp nhận thế chấp 01 xe máy chính chủ có Cavet gốc'
    },
    {
      id: 'suv',
      title: 'Ô Tô 7 Chỗ & SUV Cao Cấp',
      sub: 'Xpander, Everest, Carnival, VF 8',
      depositHold: '1.000.000₫',
      depositHandover: '10.000.000₫',
      depositTraffic: '2.000.000₫ (đối soát CSGT)',
      refundTime: 'Hoàn trả tự động 100% qua VietQR 24/7',
      alternative: 'Chấp nhận thế chấp xe máy tay ga SH / AirBlade có giá trị'
    }
  ];

  // 4 Điều khoản chính được rút gọn theo Progressive Disclosure
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
        'Thế chấp khi nhận xe: Xe máy 1 - 2tr hoặc ô tô 5 - 10tr (hoặc để lại 01 xe máy chính chủ có Cavet).',
        'Hoàn trả siêu tốc: Sau khi nhân viên nghiệm thu bàn giao xe, hoàn trả 100% tiền cọc qua VietQR 24/7 chỉ trong 5 phút.',
        'Chính sách đổi lịch: Miễn phí đổi ngày giữ xe bảo lưu 100% tiền cọc (chỉ cần báo trước 12 tiếng).'
      ]
    },
    {
      id: 1,
      title: '2. Bảo hiểm thân vỏ & Miễn trừ trách nhiệm',
      summary: '100% xe có bảo hiểm vật chất 2 chiều • Miễn trừ trách nhiệm trước các vết xước dăm nhỏ.',
      icon: ShieldCheck,
      badge: 'Bảo hiểm 100%',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      details: [
        'Bảo hiểm vật chất 2 chiều: Toàn bộ đội xe DriveRent đều được mua bảo hiểm thân vỏ chính hãng toàn diện.',
        'Trầy xước nhỏ thông thường: Khách hàng được miễn trừ bồi thường đối với các vết xước dăm nhẹ dưới 5cm do cát đá dọc đường biển.',
        'Sự cố va chạm lớn: Chi trả theo mức khấu trừ bảo hiểm cố định (500k - 1tr/vụ) theo quy chuẩn hợp đồng bảo hiểm nhà nước.',
        'Cứu hộ tai nạn: Đội ngũ kỹ thuật hỗ trợ lập biên bản hiện trường 24/7 và bố trí xe thay thế tương đương nhanh chóng.'
      ]
    },
    {
      id: 2,
      title: '3. Quy định phạt nguội & Tra cứu công khai',
      summary: 'Chỉ giữ cọc trách nhiệm 1 – 2tr • Hoàn trả tự động sau 15 ngày đối soát Cổng CSGT.vn.',
      icon: Scale,
      badge: 'Đối soát CSGT',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      details: [
        'Đối soát minh bạch: Tra cứu trực tiếp trên Cổng thông tin Cục CSGT (csgt.vn) theo đúng biển số xe và khung giờ thuê trong hợp đồng.',
        'Mức cọc phạt nguội: Xe máy miễn giữ cọc (0đ); Ô tô tự lái giữ 1.000.000₫ – 2.000.000₫ trong 15 ngày.',
        'Hoàn cọc tự động: Sau 15 ngày kể từ ngày trả xe, nếu không có biên bản vi phạm, tiền được hoàn 100% về số tài khoản của khách.',
        'Nếu có vi phạm: DriveRent gửi trích xuất hình ảnh, biên bản phạt nguội chính thức từ CSGT và khách hàng chỉ nộp đúng số tiền kho bạc quy định.'
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
        'Mức nhiên liệu: Nhận xe bình đầy 100% xăng/pin thì khi trả xe hoàn trả tương đương (hoặc thanh toán chênh lệch theo giá niêm yết cây xăng).',
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
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 space-y-10 sm:space-y-12">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO COVER WIDE PANORAMA 1440PX                                */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden w-full min-h-[380px] sm:min-h-[420px] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-b border-sky-200/80 shadow-xs"
        style={{
          backgroundImage: `url(${nhaTrangCoastalBay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-sky-950/85 to-slate-950/90 pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-center space-y-4 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-cyan-300 border border-white/20 backdrop-blur-md text-xs font-bold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="tracking-wide uppercase font-black">
              QUY ĐỊNH THUÊ XE &bull; CAM KẾT HỢP ĐỒNG MINH BẠCH
            </span>
          </div>

          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-md">
              Hợp Đồng Rõ Ràng &bull; Cam Kết &ldquo;3 KHÔNG&rdquo; An Tâm 100%
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-200 max-w-3xl mx-auto drop-shadow-sm leading-relaxed">
              Minh bạch tuyệt đối quyền lợi: Không giữ CCCD/Passport gốc &bull; Không chi phí ẩn phát sinh &bull; Không phạt mất cọc khi đổi ngày.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-black">
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1. Không giữ CCCD gốc</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 backdrop-blur-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>2. 0đ Phụ phí ẩn</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 backdrop-blur-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3. Đổi ngày bảo lưu cọc 100%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container 1440px chứa các Section độc lập */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10 sm:space-y-12">
        
        {/* ========================================================================= */}
        {/* SECTION 2: BỘ TRA CỨU HỒ SƠ PHÁP LÝ TƯƠNG TÁC 2-CHẠM                     */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Hồ sơ pháp lý tương tác
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Bộ Tra Cứu Tự Động Điều Kiện Bằng Lái Xe
              </h2>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
              Chỉ đối chiếu scan tại chỗ trong 2 phút &bull; 100% Không giữ bản gốc
            </span>
          </div>

          {/* Công cụ chọn 2-Chạm: Chọn loại xe & Chọn quốc tịch */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-50 border border-sky-200/90 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              
              {/* Bước 1: Chọn loại phương tiện (5 cols) */}
              <div className="lg:col-span-5 space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-700 text-white text-[11px] flex items-center justify-center font-mono">1</span>
                  <span>Chọn loại phương tiện bạn muốn thuê:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVehicleType('car')}
                    className={`min-h-[44px] p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
                      selectedVehicleType === 'car'
                        ? 'bg-sky-700 text-white shadow-xs font-black ring-2 ring-sky-500/20'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Car className="w-4 h-4 shrink-0" />
                    <span>Ô tô tự lái</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVehicleType('scooter')}
                    className={`min-h-[44px] p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
                      selectedVehicleType === 'scooter'
                        ? 'bg-sky-700 text-white shadow-xs font-black ring-2 ring-sky-500/20'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Bike className="w-4 h-4 shrink-0" />
                    <span>Xe máy xăng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVehicleType('ev_bike')}
                    className={`min-h-[44px] p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center ${
                      selectedVehicleType === 'ev_bike'
                        ? 'bg-emerald-600 text-white shadow-xs font-black ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Zap className="w-4 h-4 shrink-0 text-amber-300" />
                    <span className="truncate">VinFast (0đ bằng)</span>
                  </button>
                </div>
              </div>

              {/* Bước 2: Chọn quốc tịch du khách (7 cols) */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-700 text-white text-[11px] flex items-center justify-center font-mono">2</span>
                    <span>Chọn quốc tịch du khách:</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCountryModal(true)}
                    className="text-xs text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
                  >
                    Xem tất cả ({COUNTRY_DATABASE.length} nước) &rarr;
                  </button>
                </div>

                {/* Quick Pills Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {POPULAR_QUICK_PILLS.map((pill) => {
                    const targetC = COUNTRY_DATABASE.find(c => c.id === pill.id);
                    const isSelected = selectedCountry.id === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => targetC && setSelectedCountry(targetC)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* HỘP KẾT QUẢ ĐÁNH GIÁ PHÁP LÝ TỨC THÌ (VERDICT BOX) */}
            <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
              legalVerdict.status === 'valid'
                ? 'bg-white border-emerald-300/80 shadow-xs'
                : 'bg-white border-rose-300 shadow-xs'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">{selectedCountry.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">
                        {selectedCountry.nameVi} &bull; {legalVerdict.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      {legalVerdict.summary}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shrink-0 self-start sm:self-auto ${legalVerdict.badgeColor}`}>
                  {legalVerdict.badge}
                </span>
              </div>

              {/* Danh sách yêu cầu giấy tờ chi tiết */}
              <div className="pt-3.5 space-y-2 text-xs">
                <span className="font-black text-slate-800 uppercase tracking-wide block">
                  Giấy tờ cần xuất trình khi nhận xe:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {legalVerdict.requirements.map((req, rIdx) => (
                    <div key={rIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed text-slate-700">{req}</span>
                    </div>
                  ))}
                </div>

                {legalVerdict.solution && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Lời khuyên chuyên môn:</strong> {legalVerdict.solution}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 2 Card So Sánh Nhanh: Khách Trong Nước vs Khách Quốc Tế */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Card 1: Khách Trong Nước */}
            <div className="rounded-2xl border-2 border-emerald-200/90 bg-emerald-50/20 p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">🇻🇳</span>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">Khách Trong Nước</h3>
                      <span className="text-xs text-emerald-800 font-bold">Việt Nam &bull; Việt kiều</span>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                    Đối chiếu 2 phút
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">CCCD gắn chip hoặc VNeID Mức 2</strong>
                      <span className="text-slate-600">Nhân viên quét chip đối chiếu 2 phút, gửi trả lại bản gốc ngay tại chỗ.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Giấy phép lái xe (GPLX thẻ PET)</strong>
                      <span className="text-slate-600">Hạng B1, B2 hoặc B (cho ô tô) hoặc A1, A2 (cho xe máy xăng phổ thông).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Xe máy điện VinFast: Miễn bằng lái</strong>
                      <span className="text-slate-600">100% miễn giấy phép lái xe theo Luật Giao thông Đường bộ Việt Nam.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>Thế chấp: 1 - 2tr (hoặc giữ xe máy)</span>
                <span className="text-slate-500 font-medium">Bàn giao tại sảnh</span>
              </div>
            </div>

            {/* Card 2: Khách Quốc Tế */}
            <div className="rounded-2xl border-2 border-sky-200/90 bg-sky-50/20 p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-sky-200/80">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">🌐</span>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">Khách Du Lịch Quốc Tế</h3>
                      <span className="text-xs text-sky-800 font-bold">International &bull; ASEAN</span>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-sky-700 text-white">
                    IDP 1968 / ASEAN
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Hộ chiếu (Passport) còn hạn</strong>
                      <span className="text-slate-600">Thời hạn còn trên 6 tháng kèm thị thực (Visa) hoặc dấu nhập cảnh hợp lệ.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Bằng quốc tế IDP Vienna 1968</strong>
                      <span className="text-slate-600">Xuất trình kèm bằng lái quốc gia (Khối ASEAN dùng trực tiếp bằng song ngữ).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Chưa có IDP: Đổi sang xe điện / Có tài xế</strong>
                      <span className="text-slate-600">Thuê xe máy điện VinFast thông minh hoặc đăng ký gói ô tô kèm tài xế riêng.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-sky-200/80 flex items-center justify-between text-xs font-bold text-sky-800">
                <span>Hợp đồng song ngữ Anh &ndash; Việt</span>
                <span className="text-slate-500 font-medium">Chấp nhận thẻ quốc tế</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: BẢNG SO SÁNH "3 KHÔNG" TRỰC QUAN (CAM KẾT TRÁCH NHIỆM)         */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Cam kết trách nhiệm
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Bảng Đối Chiếu Quyền Lợi &amp; Trách Nhiệm &ldquo;3 KHÔNG&rdquo;
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Chuẩn mực dịch vụ mới tại Nha Trang
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200/90 overflow-hidden">
            <div className="grid grid-cols-2 bg-gradient-to-r from-slate-100 via-sky-50 to-sky-100/70 p-3.5 sm:p-4 border-b border-slate-200 text-xs font-black uppercase tracking-wider">
              <div className="text-slate-600 flex items-center gap-1.5">
                <span>❌ Thuê Xe Truyền Thống / Nơi Khác</span>
              </div>
              <div className="text-sky-900 flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>✅ Tiêu Chuẩn DriveRent Nha Trang</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {/* Dòng 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/20 transition-colors">
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

              {/* Dòng 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/20 transition-colors">
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

              {/* Dòng 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/20 transition-colors">
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

              {/* Dòng 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/20 transition-colors">
                <div className="flex items-start gap-2.5 text-slate-500">
                  <span className="text-base text-rose-500 shrink-0 font-bold">✕</span>
                  <div>
                    <strong className="text-slate-700 block font-bold">Bàn giao qua loa, dễ tranh chấp</strong>
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

              {/* Dòng 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 gap-3 hover:bg-sky-50/20 transition-colors">
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
                    <span>Miễn phí vá lốp, kích bình, đổi ngay xe tương đương nếu phát sinh lỗi kỹ thuật.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: QUY ĐỊNH TIỀN CỌC & TỐC ĐỘ HOÀN TRẢ (CHÍNH SÁCH TIỀN CỌC)      */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Chính sách tiền cọc
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Bảng Định Mức Tiền Cọc &amp; Tốc Độ Hoàn Tiền 100%
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Minh bạch từng phân khúc phương tiện &bull; Hoàn trả 24/7 qua VietQR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {depositCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="pb-2.5 border-b border-slate-200">
                    <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                      {cat.sub}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Cọc giữ xe online:</span>
                      <span className="font-mono font-bold text-slate-800">{cat.depositHold}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Cọc thế chấp nhận xe:</span>
                      <span className="font-mono font-black text-sky-900">{cat.depositHandover}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Cọc phạt nguội:</span>
                      <span className="font-mono font-bold text-slate-700">{cat.depositTraffic}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.refundTime}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    *{cat.alternative}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cam kết hoàn cọc siêu tốc */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Bảo chứng hoàn cọc 100% qua VietQR:</strong>{' '}
                <span>Không giữ cọc vô cớ, không om vốn. Kiểm tra xe hoàn cọc tức thì sau 5 phút.</span>
              </div>
            </div>
            <span className="font-mono font-black text-emerald-800 px-3 py-1 bg-white rounded-lg border border-emerald-200 shrink-0">
              ⚡ TỐC ĐỘ 5 PHÚT
            </span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: CHI TIẾT ĐIỀU KHOẢN HỢP ĐỒNG (PROGRESSIVE DISCLOSURE)           */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Điều khoản hợp đồng chi tiết
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Chính Sách Vận Hành, Bảo Hiểm &amp; Xử Lý Phạt Nguội
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Chỉ cần đọc dòng tóm tắt &bull; Chạm để mở rộng xem chi tiết
            </span>
          </div>

          <div className="space-y-3">
            {policyAccordions.map((item) => {
              const isOpen = openPolicyAccordion === item.id;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-sky-400 bg-white shadow-sm ring-1 ring-sky-500/20'
                      : 'border-slate-200/90 bg-slate-50/40 hover:border-sky-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenPolicyAccordion(isOpen ? null : item.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isOpen ? 'bg-sky-700 text-white shadow-xs' : 'bg-sky-50 text-sky-700'
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

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 sm:pl-16 border-t border-slate-100 bg-sky-50/30 space-y-2.5 text-xs text-slate-700 animate-in fade-in duration-200">
                      {item.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}

                      {item.id === 2 && (
                        <div className="pt-2">
                          <a
                            href="https://csgt.vn/tra-cuu-phuong-tien-vi-pham-giao-thong.html"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline"
                          >
                            <span>Kiểm tra phạt nguội trực tuyến trên cổng CSGT.vn</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: GIẢI ĐÁP PHÁP LÝ THƯỜNG GẶP (FAQ DƯỚI 2 CÂU)                  */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                Giải đáp pháp lý thường gặp
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Câu Hỏi Phổ Biến Về Hồ Sơ, Cọc &amp; Trách Nhiệm
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
        {/* SECTION 7: KHỐI TƯ VẤN HỢP ĐỒNG & HOTLINE PHÁP LÝ                         */}
        {/* ========================================================================= */}
        <section className="rounded-3xl bg-slate-900 p-6 sm:p-10 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-400 bg-sky-950 px-3 py-1 rounded-full border border-sky-800 inline-block">
              Hỗ trợ pháp lý 24/7
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Cần Tư Vấn Hồ Sơ Hoặc Hợp Đồng Doanh Nghiệp?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Đội ngũ điều phối viên DriveRent sẵn sàng kiểm tra bằng lái quốc tế hoặc hỗ trợ thủ tục xuất hóa đơn VAT điện tử cho đoàn công tác.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${hotline.replace(/\s+/g, '')}`}
              className="min-h-[48px] px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline tư vấn: {hotline}</span>
            </a>
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* POPUP MODAL: DANH SÁCH TẤT CẢ QUỐC GIA TRA CỨU HỢP LỆ                   */}
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
