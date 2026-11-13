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
  Calculator
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
    carDocDesc: 'Trung Quốc chưa gia nhập Công ước Vienna 1968. Theo quy định Bộ GTVT, bằng lái xe Trung Quốc (kể cả bản dịch công chứng hay bằng IAA 1949 mua qua mạng) đều KHÔNG có giá trị tự lái ô tô tại Việt Nam.',
    bikeDocDesc: 'Đặc quyền du lịch biển: Thuê Xe máy điện thông minh VinFast Feliz/Evo — 100% MIỄN BẰNG LÁI theo luật Việt Nam.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT (Việt Nam chỉ chấp thuận IDP Vienna 1968)',
    specialAdvice: 'Khách Trung Quốc đến Nha Trang rất đông. Để đảm bảo an toàn pháp lý tuyệt đối, quý khách nên chọn gói Thuê xe kèm tài xế riêng hoặc đổi sang Xe máy điện thông minh.',
    keywords: ['trung quoc', 'china', 'chinese', 'cn', 'tq', '中国', '中國', 'taiwan']
  },
  {
    id: 'usa',
    nameVi: 'Mỹ / Hoa Kỳ (United States)',
    nameEn: 'United States (USA)',
    flag: '🇺🇸',
    group: 'special',
    groupBadge: 'GENEVA 1949',
    groupName: 'Quốc gia cần lưu ý (Geneva 1949)',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'CHƯA HỖ TRỢ TỰ LÁI Ô TÔ DO KHÁC CÔNG ƯỚC QUỐC TẾ',
    carDocDesc: 'Mỹ chỉ cấp bằng lái quốc tế IDP theo Công ước Geneva 1949 (thông qua hiệp hội AAA / AATA). Việt Nam hiện tại chỉ công nhận IDP Vienna 1968, do đó bằng AAA hoặc IAA không được tự lái ô tô.',
    bikeDocDesc: 'Khách Mỹ được tự lái Xe máy điện thông minh VinFast — 100% MIỄN BẰNG LÁI theo quy định luật VN đối với xe điện <4kW.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT & Công ước Vienna 1968',
    specialAdvice: 'Khách Mỹ có thể đặt dịch vụ Thuê xe có tài xế bản địa (lịch sự, am hiểu tour, giao tiếp tiếng Anh) hoặc vi vu xe máy điện dạo biển Trần Phú.',
    keywords: ['my', 'hoa ky', 'usa', 'united states', 'america', 'us', 'american']
  },
  {
    id: 'singapore',
    nameVi: 'Singapore (Khối ASEAN)',
    nameEn: 'Singapore (ASEAN)',
    flag: '🇸🇬',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối ASEAN (Miễn IDP)',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định công nhận GPLX ASEAN 1985 (100% Miễn IDP)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái xe Singapore gốc (thẻ nhựa tiếng Anh). ĐƯỢC TỰ LÁI TRỰC TIẾP, hoàn toàn không cần đổi bằng IDP.',
    bikeDocDesc: 'Bằng lái xe máy Singapore gốc (Class 2/2A/2B), HOẶC Xe máy điện VinFast (miễn bằng).',
    legalBasis: 'Hiệp định công nhận Giấy phép lái xe giữa các nước ASEAN (Kuala Lumpur 1985)',
    keywords: ['singapore', 'sing', 'sg', 'asean']
  },
  {
    id: 'malaysia',
    nameVi: 'Malaysia (Khối ASEAN)',
    nameEn: 'Malaysia (ASEAN)',
    flag: '🇲🇾',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối ASEAN (Miễn IDP)',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định công nhận GPLX ASEAN 1985 (100% Miễn IDP)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái xe Malaysia gốc bằng tiếng Anh (Driving License). ĐƯỢC TỰ LÁI TRỰC TIẾP, miễn bằng IDP.',
    bikeDocDesc: 'Bằng lái xe máy Malaysia gốc, hoặc Xe máy điện VinFast miễn bằng.',
    legalBasis: 'Hiệp định ASEAN 1985',
    keywords: ['malaysia', 'ma lay', 'my', 'asean']
  },
  {
    id: 'thailand',
    nameVi: 'Thái Lan (Thailand - ASEAN)',
    nameEn: 'Thailand (ASEAN)',
    flag: '🇹🇭',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối ASEAN (Miễn IDP)',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định công nhận GPLX ASEAN 1985 (100% Miễn IDP)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái xe Thái Lan gốc (thẻ nhựa song ngữ tiếng Anh). Được tự lái trực tiếp tại Việt Nam.',
    bikeDocDesc: 'Bằng lái xe máy Thái Lan gốc hoặc Xe máy điện VinFast.',
    legalBasis: 'Hiệp định ASEAN 1985',
    keywords: ['thai lan', 'thailand', 'thai', 'th', 'asean']
  },
  {
    id: 'australia',
    nameVi: 'Úc (Australia)',
    nameEn: 'Australia',
    flag: '🇦🇺',
    group: 'special',
    groupBadge: 'GENEVA 1949',
    groupName: 'Quốc gia cần lưu ý (Geneva 1949)',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'CHƯA HỖ TRỢ TỰ LÁI Ô TÔ THEO LUẬT GTĐB VIỆT NAM',
    carDocDesc: 'Bằng lái quốc tế do Úc cấp thuộc Công ước Geneva 1949, chưa thuộc Công ước Vienna 1968 mà Việt Nam tham gia.',
    bikeDocDesc: 'Đặc quyền: Thuê Xe máy điện thông minh VinFast — 100% MIỄN BẰNG LÁI.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT',
    specialAdvice: 'Quý khách Úc vui lòng đặt xe kèm tài xế bản địa hoặc vi vu bằng xe máy điện VinFast.',
    keywords: ['uc', 'australia', 'aus', 'au', 'aussie']
  },
  {
    id: 'japan',
    nameVi: 'Nhật Bản (Japan)',
    nameEn: 'Japan',
    flag: '🇯🇵',
    group: 'special',
    groupBadge: 'GENEVA 1949',
    groupName: 'Quốc gia cần lưu ý (Geneva 1949)',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'CHƯA HỖ TRỢ TỰ LÁI Ô TÔ THEO LUẬT GTĐB VIỆT NAM',
    carDocDesc: 'Nhật Bản là thành viên Công ước Geneva 1949, chưa ký kết Công ước Vienna 1968. Khách mang bằng Nhật Bản chưa được tự lái ô tô tại VN.',
    bikeDocDesc: 'Thuê Xe máy điện VinFast Feliz/Evo — 100% MIỄN BẰNG LÁI.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT',
    specialAdvice: 'Quý khách Nhật Bản vui lòng lựa chọn xe có tài xế riêng hoặc trải nghiệm xe máy điện.',
    keywords: ['nhat ban', 'nhat', 'japan', 'jp', 'japanese', '日本']
  },
  {
    id: 'canada',
    nameVi: 'Canada',
    nameEn: 'Canada',
    flag: '🇨🇦',
    group: 'special',
    groupBadge: 'GENEVA 1949',
    groupName: 'Quốc gia cần lưu ý (Geneva 1949)',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'CHƯA HỖ TRỢ TỰ LÁI Ô TÔ THEO LUẬT GTĐB VIỆT NAM',
    carDocDesc: 'Canada cấp bằng lái quốc tế thông qua CAA theo Công ước Geneva 1949. Chưa đủ điều kiện tự lái ô tô tại Việt Nam.',
    bikeDocDesc: 'Thuê Xe máy điện VinFast thông minh — 100% MIỄN BẰNG LÁI.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT',
    specialAdvice: 'Khách Canada vui lòng chọn gói Ô tô có tài xế riêng hoặc thuê Xe máy điện.',
    keywords: ['canada', 'canadian', 'ca']
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
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Cộng hòa Pháp)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái quốc tế IDP Vienna 1968 + Bằng lái xe Pháp gốc (Permis de conduire).',
    bikeDocDesc: 'IDP Hạng A + Bằng gốc, HOẶC Xe máy điện VinFast (miễn bằng 100%).',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['phap', 'france', 'french', 'fr', 'paris']
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
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (CHLB Đức)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái quốc tế IDP Vienna 1968 + Bằng lái xe Đức gốc (Führerschein).',
    bikeDocDesc: 'IDP Hạng A + Bằng gốc, HOẶC Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['duc', 'germany', 'german', 'de', 'deutschland', 'berlin']
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
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Vương Quốc Anh)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng IDP Vienna 1968 (Post Office cấp) + Bằng lái xe UK gốc còn hạn.',
    bikeDocDesc: 'IDP Vienna Hạng A + Bằng gốc, HOẶC Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['anh', 'uk', 'united kingdom', 'great britain', 'england', 'gb', 'british']
  },
  {
    id: 'italy',
    nameVi: 'Ý (Italy)',
    nameEn: 'Italy',
    flag: '🇮🇹',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Ý / Italia)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng IDP Vienna 1968 + Bằng lái xe Ý gốc (Patente di guida).',
    bikeDocDesc: 'IDP Hạng A + Bằng gốc, HOẶC Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['y', 'italy', 'italia', 'italian', 'it', 'roma']
  },
  {
    id: 'spain',
    nameVi: 'Tây Ban Nha (Spain)',
    nameEn: 'Spain',
    flag: '🇪🇸',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Tây Ban Nha)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng IDP Vienna 1968 + Bằng lái xe Tây Ban Nha gốc (Permiso de conducir).',
    bikeDocDesc: 'IDP Hạng A + Bằng gốc, HOẶC Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['tay ban nha', 'spain', 'spanish', 'es', 'madrid']
  },
  {
    id: 'netherlands',
    nameVi: 'Hà Lan (Netherlands)',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Hà Lan)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng IDP Vienna 1968 + Bằng lái xe Hà Lan gốc (Rijbewijs).',
    bikeDocDesc: 'IDP Hạng A + Bằng gốc, HOẶC Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['ha lan', 'netherlands', 'dutch', 'nl', 'holland', 'amsterdam']
  },
  {
    id: 'poland',
    nameVi: 'Ba Lan (Poland)',
    nameEn: 'Poland',
    flag: '🇵🇱',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Ba Lan)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng IDP Vienna 1968 + Bằng lái xe Ba Lan gốc (Prawo jazdy).',
    bikeDocDesc: 'IDP Hạng A + Bằng gốc, HOẶC Xe máy điện VinFast.',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['ba lan', 'poland', 'polish', 'pl', 'warsaw']
  },
  {
    id: 'philippines',
    nameVi: 'Philippines (Khối ASEAN)',
    nameEn: 'Philippines (ASEAN)',
    flag: '🇵🇭',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối ASEAN (Miễn IDP)',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định công nhận GPLX ASEAN 1985 (100% Miễn IDP)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái xe Philippines gốc bằng tiếng Anh. Được tự lái trực tiếp tại Việt Nam.',
    bikeDocDesc: 'Bằng lái xe máy Philippines gốc hoặc Xe máy điện VinFast.',
    legalBasis: 'Hiệp định ASEAN 1985',
    keywords: ['philippines', 'phi lip pin', 'ph', 'asean']
  },
  {
    id: 'indonesia',
    nameVi: 'Indonesia (Khối ASEAN)',
    nameEn: 'Indonesia (ASEAN)',
    flag: '🇮🇩',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối ASEAN (Miễn IDP)',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định công nhận GPLX ASEAN 1985 (100% Miễn IDP)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái xe Indonesia gốc (SIM A) thẻ song ngữ Anh - Indo. Được tự lái trực tiếp tại Việt Nam.',
    bikeDocDesc: 'Bằng lái xe máy Indonesia gốc (SIM C) hoặc Xe máy điện VinFast.',
    legalBasis: 'Hiệp định ASEAN 1985',
    keywords: ['indonesia', 'indo', 'id', 'asean', 'bali']
  },
  {
    id: 'cambodia',
    nameVi: 'Campuchia (Khối ASEAN)',
    nameEn: 'Cambodia (ASEAN)',
    flag: '🇰🇭',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối ASEAN (Miễn IDP)',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định công nhận GPLX ASEAN 1985 (100% Miễn IDP)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái Campuchia thẻ song ngữ tiếng Anh. Được tự lái trực tiếp tại Việt Nam.',
    bikeDocDesc: 'Bằng lái xe máy Campuchia hoặc Xe máy điện VinFast.',
    legalBasis: 'Hiệp định ASEAN 1985',
    keywords: ['campuchia', 'cambodia', 'kh', 'asean']
  },
  {
    id: 'laos',
    nameVi: 'Lào (Khối ASEAN)',
    nameEn: 'Laos (ASEAN)',
    flag: '🇱🇦',
    group: 'asean',
    groupBadge: 'ASEAN 1985',
    groupName: 'Khối ASEAN (Miễn IDP)',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Hiệp định công nhận GPLX ASEAN 1985 (100% Miễn IDP)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái xe Lào thẻ song ngữ Anh - Lào. Được tự lái trực tiếp tại Việt Nam.',
    bikeDocDesc: 'Bằng lái xe máy Lào hoặc Xe máy điện VinFast.',
    legalBasis: 'Hiệp định ASEAN 1985',
    keywords: ['lao', 'laos', 'la', 'asean']
  },
  {
    id: 'eu',
    nameVi: 'Các nước Châu Âu EU khác',
    nameEn: 'Other EU Countries',
    flag: '🇪🇺',
    group: 'intl',
    groupBadge: 'IDP 1968',
    groupName: 'Công ước Vienna 1968',
    canDriveCar: true,
    canDriveBike: true,
    carHeadline: 'Hợp lệ theo Công ước Vienna 1968 (Khối EU)',
    carDocDesc: 'Hộ chiếu (Passport) + Bằng lái quốc tế IDP Vienna 1968 + Bằng lái quốc gia gốc (Áo, Bỉ, Bồ Đào Nha, Hy Lạp, Đan Mạch, Phần Lan...).',
    bikeDocDesc: 'IDP Vienna 1968 Hạng A + Bằng gốc, HOẶC Thuê Xe máy điện VinFast (miễn bằng lái 100%).',
    legalBasis: 'Công ước Vienna 1968 & Thông tư 29/2015/TT-BGTVT',
    keywords: ['eu', 'chau au', 'europe', 'european union']
  },
  {
    id: 'taiwan',
    nameVi: 'Đài Loan (Taiwan)',
    nameEn: 'Taiwan',
    flag: '🇹🇼',
    group: 'special',
    groupBadge: 'CHƯA TỰ LÁI Ô TÔ',
    groupName: 'Quốc gia cần lưu ý',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'CHƯA HỖ TRỢ TỰ LÁI Ô TÔ THEO LUẬT GTĐB VIỆT NAM',
    carDocDesc: 'Bằng lái Đài Loan và bằng quốc tế mua online chưa được công nhận tự lái ô tô tại Việt Nam.',
    bikeDocDesc: 'Thuê Xe máy điện VinFast — 100% MIỄN BẰNG LÁI.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT',
    specialAdvice: 'Quý khách Đài Loan vui lòng chọn dịch vụ Xe có tài xế hoặc Xe máy điện.',
    keywords: ['dai loan', 'taiwan', 'tw', '台灣', '台湾']
  },
  {
    id: 'india',
    nameVi: 'Ấn Độ (India)',
    nameEn: 'India',
    flag: '🇮🇳',
    group: 'special',
    groupBadge: 'GENEVA 1949',
    groupName: 'Quốc gia cần lưu ý (Geneva 1949)',
    canDriveCar: false,
    canDriveBike: true,
    carHeadline: 'CHƯA HỖ TRỢ TỰ LÁI Ô TÔ THEO LUẬT GTĐB VIỆT NAM',
    carDocDesc: 'Bằng quốc tế Ấn Độ phổ biến thuộc Công ước Geneva 1949, chưa hoàn tất áp dụng Vienna 1968 tại Việt Nam.',
    bikeDocDesc: 'Thuê Xe máy điện thông minh VinFast — 100% MIỄN BẰNG LÁI.',
    legalBasis: 'Thông tư 29/2015/TT-BGTVT',
    specialAdvice: 'Du khách Ấn Độ nên đặt gói Xe có tài xế bản địa hoặc thuê xe máy điện dạo biển.',
    keywords: ['an do', 'india', 'indian', 'in']
  }
];

export const POPULAR_QUICK_PILLS = [
  { id: 'korea', label: 'Hàn Quốc 🇰🇷' },
  { id: 'china', label: 'Trung Quốc 🇨🇳 (Lưu ý)' },
  { id: 'russia', label: 'Nga 🇷🇺' },
  { id: 'singapore', label: 'Singapore 🇸🇬 (ASEAN)' },
  { id: 'usa', label: 'Mỹ 🇺🇸 (Lưu ý)' },
  { id: 'japan', label: 'Nhật Bản 🇯🇵' },
  { id: 'australia', label: 'Úc 🇦🇺' },
  { id: 'thailand', label: 'Thái Lan 🇹🇭' },
  { id: 'france', label: 'Pháp 🇫🇷' },
  { id: 'vn', label: 'Việt Nam 🇻🇳' }
];

export const RegulationsCustomerView: React.FC = () => {
  const { setCustomerTab, settings, t } = useApp();
  const brandName = settings?.brandTitle || settings?.storeName || 'Nha Trang Car';
  const hotline = settings?.hotline || '0905 888 999';

  // State: Phương tiện kiểm tra (Ô tô vs Xe máy/Xe điện)
  const [vehicleFilter, setVehicleFilter] = useState<'car' | 'motorbike'>('car');

  // State: Quốc gia được chọn cụ thể (Mặc định: Việt Nam)
  const [selectedCountry, setSelectedCountry] = useState<CountryRule>(COUNTRY_DATABASE[0]);

  // State: Popup Modal danh sách tất cả quốc gia
  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>('');
  const [modalCategory, setModalCategory] = useState<'all' | 'vn' | 'asean' | 'intl' | 'special'>('all');

  // State: Tab chính sách bên phải
  const [activePolicyTab, setActivePolicyTab] = useState<'documents' | 'deposit' | 'insurance' | 'traffic' | 'matrix'>('documents');

  // State: Widget tính nhanh tiền đặt cọc trách nhiệm ở cột trái
  const [calcVehicleTier, setCalcVehicleTier] = useState<'scooter' | 'ev_scooter' | 'sedan' | 'suv'>('sedan');

  // State: FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Khóa cuộn trang khi mở modal và hỗ trợ phím Escape
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

  // Filter các quốc gia hiển thị trong Popup Modal
  const modalFilteredCountries = useMemo(() => {
    let list = COUNTRY_DATABASE;
    if (modalCategory !== 'all') {
      list = list.filter(c => c.group === modalCategory);
    }
    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase().trim();
      list = list.filter(c => 
        c.nameVi.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.keywords.some(k => k.includes(q))
      );
    }
    return list;
  }, [modalCategory, modalSearch]);

  // Dữ liệu tính cọc tự động
  const depositCalcDetails = useMemo(() => {
    switch (calcVehicleTier) {
      case 'scooter':
        return {
          title: 'Xe máy xăng phổ thông',
          sub: 'Vision, AirBlade, Lead, Wave RSX...',
          depositCar: '1.000.000₫ – 2.000.000₫',
          depositTraffic: '0₫ (100% Miễn giữ cọc phạt nguội)',
          refundSpeed: 'Hoàn tức thì 5 phút khi bàn giao',
          alternative: 'Chấp nhận vé máy bay khứ hồi + CCCD đối chiếu (Miễn tiền mặt)'
        };
      case 'ev_scooter':
        return {
          title: 'Xe máy điện VinFast (Eco)',
          sub: 'VinFast Feliz S, Evo 200 (Miễn 100% bằng lái)',
          depositCar: '1.000.000₫',
          depositTraffic: '0₫ (Miễn giữ)',
          refundSpeed: 'Hoàn tức thì 5 phút qua VietQR 24/7',
          alternative: '100% MIỄN CỌC PIN khi đối chiếu CCCD/VNeID Mức 2'
        };
      case 'sedan':
        return {
          title: 'Ô tô Sedan 4 - 5 chỗ tự lái',
          sub: 'Toyota Vios, Hyundai Accent, Mazda 3...',
          depositCar: '5.000.000₫',
          depositTraffic: '2.000.000₫ (Chu kỳ đối soát Cục CSGT)',
          refundSpeed: 'Cọc xe hoàn 5 phút • Cọc phạt nguội tự động sau 15–30 ngày',
          alternative: 'Chấp nhận thế chấp 01 xe máy chính chủ kèm Cavet gốc'
        };
      case 'suv':
        return {
          title: 'Ô tô SUV / MPV 7 chỗ & VinFast VF8',
          sub: 'Mitsubishi Xpander, Ford Everest, Kia Carnival, VF8...',
          depositCar: '10.000.000₫ – 15.000.000₫',
          depositTraffic: '3.000.000₫ (Chu kỳ đối soát Cục CSGT)',
          refundSpeed: 'Cọc xe hoàn 5 phút • Cọc phạt nguội tự động sau 15–30 ngày',
          alternative: 'Chấp nhận thế chấp 01 xe máy tay ga chính chủ'
        };
    }
  }, [calcVehicleTier]);

  const faqs = [
    {
      q: t('reg.faq_q1'),
      a: t('reg.faq_a1')
    },
    {
      q: t('reg.faq_q2'),
      a: t('reg.faq_a2')
    },
    {
      q: t('reg.faq_q3'),
      a: t('reg.faq_a3')
    },
    {
      q: t('reg.faq_q4'),
      a: t('reg.faq_a4')
    }
  ];

  return (
    <div className="space-y-10 sm:space-y-12 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. TRANG BÌA (HERO COVER WIDE PANORAMA 1440PX) */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden w-full min-h-[440px] sm:min-h-[480px] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-b border-sky-200/80"
        style={{
          backgroundImage: `url(${nhaTrangCoastalBay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-sky-50/85 to-white/95 pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-center space-y-6 sm:space-y-8 my-auto">
          
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-balance">
              <span className="text-slate-900 drop-shadow-xs">{t('reg.title')} </span>
              <span className="text-sky-700 drop-shadow-xs font-black">- {t('reg.subtitle')}</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-700 max-w-3xl mx-auto drop-shadow-xs leading-relaxed text-pretty">
              {t('reg.desc')}
            </p>
          </div>

          {/* 3 Thẻ Tóm Tắt Con Số Cam Kết */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto pt-1">
            {/* Thẻ 1: 100% Xe có bảo hiểm thân vỏ */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 group-hover:bg-sky-800 group-hover:text-white transition-all duration-300">
                    <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-sky-900 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                    Vật chất 2 chiều
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-sky-800 tracking-tight tabular-nums">
                    100%
                  </div>
                  <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1 text-balance">
                    Xe có bảo hiểm thân vỏ
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                  Toàn bộ ô tô &amp; xe máy đều được trang bị gói bảo hiểm vật chất 2 chiều và TNDS chính hãng, bảo vệ trọn vẹn mọi hành trình.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-sky-100/80 flex items-center gap-1.5 text-xs font-bold text-sky-800">
                <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                <span>Miễn thường chỉ từ 500k/vụ</span>
              </div>
            </div>

            {/* Thẻ 2: Hoàn cọc chuẩn hẹn */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 group-hover:bg-cyan-800 group-hover:text-white transition-all duration-300">
                    <RotateCcw className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-900 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    Siêu tốc 5 phút
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-cyan-800 tracking-tight">
                    Chuẩn Hẹn
                  </div>
                  <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1 text-balance">
                    Hoàn cọc ngay khi trả xe
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                  Nhận lại 100% tiền cọc hợp đồng trong 5 phút qua VietQR 24/7 hoặc tiền mặt. Cam kết không giữ cọc vô lý, không trễ hẹn.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-sky-100/80 flex items-center gap-1.5 text-xs font-bold text-cyan-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>Biên bản bàn giao số 360&deg;</span>
              </div>
            </div>

            {/* Thẻ 3: Tra cứu phạt nguội công khai qua Cổng CSGT */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 group-hover:bg-sky-800 group-hover:text-white transition-all duration-300">
                    <FileText className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-sky-900 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                    csgt.vn / phatnguoi.vn
                  </span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-sky-900 tracking-tight">
                    Công Khai
                  </div>
                  <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1 text-balance">
                    Tra cứu Cổng Cục CSGT
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                  Dữ liệu đối soát trực tiếp từ Cổng Cục CSGT. Cung cấp hình ảnh &amp; biên lai Kho bạc Nhà nước, tuyệt đối không phạt oan.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-sky-100/80 flex items-center gap-1.5 text-xs font-bold text-sky-800">
                <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                <span>Đối chiếu lộ trình GPS chính xác</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN SPLIT-SCREEN LAYOUT (TỶ LỆ VÀNG 3.5 : 6.5 TRÊN MAX-W 1440PX) */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================================= */}
          {/* CỘT TRÁI (STICKY SIDEBAR CỐ ĐỊNH - 3.5 TỶ LỆ VÀNG / COL-SPAN-4) */}
          {/* ======================================================================= */}
          <aside className="lg:col-span-4 xl:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
            
            {/* WIDGET 1: BỘ LỌC NHANH DANH MỤC ĐIỀU KHOẢN (QUICK POLICY NAVIGATOR) */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                <span className="text-xs font-black uppercase tracking-wider text-sky-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-700" />
                  <span>Danh Mục Điều Khoản</span>
                </span>
                <span className="text-xs font-bold text-slate-600">5 Mục chính</span>
              </div>

              <nav className="space-y-1.5" aria-label="Điều hướng nhanh chính sách">
                {[
                  { id: 'documents' as const, label: 'Giấy tờ & Tra cứu quốc gia', icon: FileCheck, badge: 'Ưu tiên' },
                  { id: 'matrix' as const, label: 'Ma trận quyền lợi & Trách nhiệm', icon: Scale, badge: 'Minh bạch' },
                  { id: 'deposit' as const, label: 'Đặt cọc & Hoàn tiền siêu tốc', icon: CreditCard, badge: '5 phút' },
                  { id: 'insurance' as const, label: 'Bảo hiểm vật chất 2 chiều & Pin', icon: ShieldCheck, badge: '100% xe' },
                  { id: 'traffic' as const, label: 'Tra cứu phạt nguội Cục CSGT', icon: FileText, badge: 'csgt.vn' }
                ].map((item) => {
                  const isActive = activePolicyTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActivePolicyTab(item.id);
                        const targetEl = document.getElementById(`policy-section-${item.id}`);
                        if (targetEl) {
                          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl text-left font-bold text-xs sm:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer group active:scale-[0.99] ${
                        isActive
                          ? 'bg-sky-800 text-white shadow-xs shadow-sky-900/20'
                          : 'text-slate-700 hover:bg-sky-50 hover:text-sky-900 bg-slate-50/70 border border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sky-700'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* WIDGET 2: TÓM TẮT CAM KẾT "3 KHÔNG" AN TÂM (TRUST BADGE CARD) */}
            <div className="bg-gradient-to-br from-sky-50 via-white to-sky-50/70 rounded-3xl border border-sky-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-800 text-white text-xs font-black tracking-wider uppercase shadow-2xs">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Cam Kết "3 KHÔNG" An Tâm</span>
                </div>
                <span className="text-xs font-bold text-sky-900 bg-sky-100 px-2.5 py-0.5 rounded-full">
                  Bảo vệ du khách
                </span>
              </div>

              <div className="divide-y divide-sky-100/90 text-xs sm:text-sm">
                {/* Cam kết 1 */}
                <div className="py-3 space-y-1 first:pt-0">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs sm:text-sm">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-black shrink-0">✕</span>
                    <span>1. KHÔNG giữ CCCD / Hộ chiếu gốc</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7 text-pretty">
                    Nhân viên đối chiếu và chụp ảnh lưu hồ sơ điện tử trong 2 phút. Quý khách giữ lại toàn bộ giấy tờ bản gốc để check-in khách sạn, đi tour đảo.
                  </p>
                </div>

                {/* Cam kết 2 */}
                <div className="py-3 space-y-1">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs sm:text-sm">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-black shrink-0">✕</span>
                    <span>2. KHÔNG phí ẩn &bull; Miễn phí hao mòn cát</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7 text-pretty">
                    Giá niêm yết trọn gói gồm bảo hiểm và 2 mũ bảo hiểm đạt chuẩn. Miễn trừ 100% các vết xước dăm cát biển ngoài vỏ xe.
                  </p>
                </div>

                {/* Cam kết 3 */}
                <div className="py-3 space-y-1 last:pb-0">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs sm:text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black shrink-0">✓</span>
                    <span>3. ĐỔI NGÀY GIỮ CỌC 100%</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7 text-pretty">
                    Thay đổi lịch bay hoặc dời ngày du lịch Nha Trang được bảo lưu 100% tiền cọc giữ chỗ, hỗ trợ chuyển ngày linh hoạt trong 90 ngày.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-bold border-t border-sky-100">
                <span className="flex items-center gap-1.5 text-sky-800">
                  <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
                  <span>Áp dụng toàn bộ hệ thống</span>
                </span>
                <span className="text-sky-900 font-black">Nha Trang Car</span>
              </div>
            </div>

            {/* WIDGET 3: TÍNH NHANH TIỀN ĐẶT CỌC TRÁCH NHIỆM (INTERACTIVE DEPOSIT CALCULATOR) */}
            <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                    <Calculator className="w-4 h-4 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm text-balance">Tính Nhanh Tiền Cọc</h3>
                    <p className="text-xs text-slate-500 font-medium">Chọn dòng xe để xem mức cọc</p>
                  </div>
                </div>
                <span className="text-xs font-black text-sky-900 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  Minh bạch
                </span>
              </div>

              {/* Bộ chọn dòng xe 4 nút */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'scooter' as const, label: 'Xe máy xăng', sub: 'Vision/AirBlade' },
                  { id: 'ev_scooter' as const, label: 'Xe điện VinFast', sub: 'Feliz (Miễn bằng)' },
                  { id: 'sedan' as const, label: 'Sedan 4-5 chỗ', sub: 'Vios/Accent' },
                  { id: 'suv' as const, label: 'SUV/MPV 7 chỗ', sub: 'Xpander/Everest' }
                ].map((tier) => {
                  const isSelected = calcVehicleTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setCalcVehicleTier(tier.id)}
                      className={`min-h-[48px] p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-sky-800 text-white border-sky-700 shadow-xs'
                          : 'bg-slate-50 hover:bg-sky-50/60 text-slate-700 border-slate-200/80'
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{tier.label}</div>
                      <div className={`text-xs truncate mt-0.5 ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                        {tier.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bảng kết quả tiền cọc */}
              <div className="pt-3 border-t border-sky-100 space-y-2.5 text-xs">
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm text-pretty">
                  {depositCalcDetails.title}
                </div>
                <div className="text-xs text-slate-600">
                  {depositCalcDetails.sub}
                </div>

                <div className="pt-2 border-t border-sky-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Tiền cọc nhận xe:</span>
                    <span className="font-black text-sky-900 text-sm">{depositCalcDetails.depositCar}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Cọc phạt nguội CSGT:</span>
                    <span className="font-bold text-slate-900">{depositCalcDetails.depositTraffic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Thời gian hoàn tiền:</span>
                    <span className="font-bold text-sky-800">{depositCalcDetails.refundSpeed}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-sky-100 text-xs text-slate-600 italic">
                  * {depositCalcDetails.alternative}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCustomerTab('vehicles')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-sky-800 hover:bg-sky-900 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs shadow-sky-900/20"
              >
                <span>Xem danh sách xe phù hợp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* WIDGET 4: HOTLINE HỖ TRỢ TRỰC TIẾP */}
            <div className="p-4 rounded-3xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Hỗ trợ quy định 24/7</div>
                  <a href={`tel:${hotline.replace(/\s+/g, '')}`} className="font-black text-white hover:text-sky-300 text-sm truncate block">
                    {hotline}
                  </a>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-300 bg-sky-950 px-2.5 py-1 rounded-full border border-sky-800 shrink-0">
                Gọi ngay
              </span>
            </div>

          </aside>

          {/* ======================================================================= */}
          {/* CỘT PHẢI (WIDE POLICY CONTENT - 6.5 TỶ LỆ VÀNG / COL-SPAN-8) */}
          {/* ======================================================================= */}
          <main className="lg:col-span-8 xl:col-span-8 space-y-8 min-w-0">

            {/* ===================================================================== */}
            {/* PHẦN 1: BẢNG SO SÁNH GIẤY TỜ 2 CỘT RỘNG RÃI (VN VS QUỐC TẾ) + TRA CỨU */}
            {/* ===================================================================== */}
            <section id="policy-section-documents" className="space-y-5 scroll-mt-24">
              
              {/* Header phần giấy tờ */}
              <div className="border-b border-sky-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5 mb-1">
                    <FileCheck className="w-3.5 h-3.5 text-sky-700" />
                    <span>Thủ Tục Nhận Xe 1-Chạm</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-balance">
                    Bảng Đối Chiếu Giấy Tờ Thuê Xe Tự Lái
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed text-pretty">
                    Showroom chỉ chụp ảnh đối chiếu tại chỗ 2 phút &mdash; Tuyệt đối không giữ bản gốc CCCD hoặc Hộ chiếu của quý khách.
                  </p>
                </div>
                <div className="self-start sm:self-auto flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
                    Thông tư 29/2015/TT-BGTVT
                  </span>
                </div>
              </div>

              {/* BẢNG 2 CỘT NGANG RỘNG RÃI (SIDE-BY-SIDE COMPARATIVE CARDS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* CỘT 1: KHÁCH VIỆT NAM & VIỆT KIỀU */}
                <div className="rounded-3xl border border-sky-200/90 bg-gradient-to-b from-sky-50/50 to-white p-5 flex flex-col justify-between space-y-4 shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-sky-200/60">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🇻🇳</span>
                        <div>
                          <h3 className="font-black text-slate-900 text-base text-balance">Khách Việt Nam &amp; Việt kiều</h3>
                          <span className="text-xs text-sky-800 font-bold">Thủ tục nhanh nhất (2 phút)</span>
                        </div>
                      </div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-800 text-white">
                        VN / PET
                      </span>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      {/* Tiêu chí 1: Giấy tờ tùy thân */}
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <Check className="w-4 h-4 text-sky-700 stroke-[3] shrink-0" />
                          <span>1. Giấy tờ tùy thân (Identity)</span>
                        </div>
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed text-pretty">
                          CCCD gắn chip bản gốc <strong>HOẶC</strong> ứng dụng VNeID Mức 2 trên điện thoại (đã tích hợp đầy đủ thông tin cá nhân).
                        </p>
                      </div>

                      {/* Tiêu chí 2: Giấy phép lái xe */}
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <Check className="w-4 h-4 text-sky-700 stroke-[3] shrink-0" />
                          <span>2. Giấy phép lái xe (GPLX)</span>
                        </div>
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed text-pretty">
                          GPLX thẻ PET Hạng B1, B2, B (cho ô tô tự lái) hoặc Hạng A1, A2 (cho xe máy xăng). <em>Riêng xe máy điện VinFast: 100% miễn bằng lái.</em>
                        </p>
                      </div>

                      {/* Tiêu chí 3: Tài sản thế chấp */}
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <Check className="w-4 h-4 text-sky-700 stroke-[3] shrink-0" />
                          <span>3. Thế chấp trách nhiệm linh hoạt</span>
                        </div>
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed text-pretty">
                          Chuyển khoản cọc giữ xe (hoàn 5 phút khi trả xe) <strong>HOẶC</strong> thế chấp 01 xe máy chính chủ kèm Cavet xe gốc.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-sky-800">
                    <span>Cam kết: Không giữ bản gốc CCCD</span>
                    <span className="text-slate-500 font-medium">Bàn giao xe tận nơi</span>
                  </div>
                </div>

                {/* CỘT 2: KHÁCH QUỐC TẾ & KHỐI ASEAN */}
                <div className="rounded-3xl border border-cyan-200/90 bg-gradient-to-b from-cyan-50/40 to-white p-5 flex flex-col justify-between space-y-4 shadow-2xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-cyan-200/60">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🌐</span>
                        <div>
                          <h3 className="font-black text-slate-900 text-base text-balance">Khách Quốc Tế &amp; ASEAN</h3>
                          <span className="text-xs text-cyan-800 font-bold">Công ước Vienna &amp; Hiệp định 1985</span>
                        </div>
                      </div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-cyan-700 text-white">
                        IDP / ASEAN
                      </span>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      {/* Tiêu chí 1: Hộ chiếu */}
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-700 stroke-[3] shrink-0" />
                          <span>1. Hộ chiếu (Passport) còn hạn</span>
                        </div>
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed text-pretty">
                          Hộ chiếu bản gốc còn thời hạn trên 6 tháng kèm dấu thị thực (Visa/Dấu tạm trú) nhập cảnh hợp pháp vào Việt Nam.
                        </p>
                      </div>

                      {/* Tiêu chí 2: Giấy phép lái xe quốc tế */}
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-700 stroke-[3] shrink-0" />
                          <span>2. Bằng lái xe (Driving License)</span>
                        </div>
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed text-pretty">
                          <strong>Khối ASEAN:</strong> Dùng trực tiếp bằng lái gốc tiếng Anh (miễn IDP).<br />
                          <strong>Quốc tế (Hàn, Nga, EU):</strong> IDP Vienna 1968 kèm bằng gốc.<br />
                          <strong>Xe máy điện VinFast:</strong> 100% miễn bằng lái cho mọi du khách.
                        </p>
                      </div>

                      {/* Tiêu chí 3: Hợp đồng song ngữ */}
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-700 stroke-[3] shrink-0" />
                          <span>3. Hợp đồng điện tử song ngữ</span>
                        </div>
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed text-pretty">
                          Ký hợp đồng song ngữ Việt &ndash; Anh minh bạch, thanh toán linh hoạt qua Thẻ Visa/Mastercard, VietQR hoặc USD.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyan-100 flex items-center justify-between text-xs font-bold text-cyan-800">
                    <span>Hỗ trợ nhân viên giao tiếp tiếng Anh</span>
                    <span className="text-slate-500 font-medium">Giao xe tại Sân bay Cam Ranh</span>
                  </div>
                </div>

              </div>

              {/* =================================================================== */}
              {/* THANH TRA CỨU POPUP 1-CHẠM 28+ QUỐC GIA (USER'S PREFERRED OPTION) */}
              {/* =================================================================== */}
              <div className="rounded-3xl border border-sky-200/90 bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                      <Globe className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                        <span>Tra Cứu Chi Tiết Theo Từng Quốc Gia</span>
                        <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 text-xs font-black border border-sky-200">28+ Nước</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 text-pretty">
                        Chọn quốc tịch để xem phản hồi điều kiện lái ô tô &amp; xe máy theo luật giao thông Việt Nam.
                      </p>
                    </div>
                  </div>

                  {/* Nút bấm mở Popup tất cả các nước */}
                  <button
                    type="button"
                    onClick={() => setShowCountryModal(true)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-sky-900 font-bold text-xs border border-sky-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shrink-0"
                  >
                    <Globe className="w-4 h-4 text-sky-700" />
                    <span>Đổi quốc gia khác ({COUNTRY_DATABASE.length} nước)</span>
                    <ChevronDown className="w-4 h-4 text-sky-600" />
                  </button>
                </div>

                {/* Thanh chọn nhanh & Thẻ quốc gia đang được chọn */}
                <div className="pt-3 border-t border-sky-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl shrink-0">{selectedCountry.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-sm sm:text-base truncate">
                          {selectedCountry.nameVi}
                        </span>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${
                            selectedCountry.group === 'special'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : selectedCountry.group === 'asean'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-sky-100 text-sky-900 border border-sky-300'
                          }`}
                        >
                          {selectedCountry.groupBadge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium truncate">
                        {selectedCountry.nameEn} &bull; {selectedCountry.groupName}
                      </div>
                    </div>
                  </div>

                  {/* Switch chọn loại xe muốn thuê */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                    <button
                      type="button"
                      onClick={() => setVehicleFilter('car')}
                      className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        vehicleFilter === 'car'
                          ? 'bg-sky-800 text-white shadow-2xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Ô tô tự lái</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVehicleFilter('motorbike')}
                      className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        vehicleFilter === 'motorbike'
                          ? 'bg-sky-800 text-white shadow-2xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Xe máy / Xe điện</span>
                    </button>
                  </div>
                </div>

                {/* Kết quả phản hồi pháp lý tức thì cho quốc gia đang chọn */}
                <div className="pt-3 border-t border-sky-100 space-y-2">
                  <div className="flex items-center gap-2">
                    {selectedCountry.group === 'special' && vehicleFilter === 'car' ? (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-bold text-xs sm:text-sm text-slate-900 text-balance">
                      {vehicleFilter === 'car' ? selectedCountry.carHeadline : 'Đủ điều kiện nhận xe máy & xe máy điện (Miễn 100% bằng lái đối với xe điện)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6 text-pretty">
                    {vehicleFilter === 'car' ? selectedCountry.carDocDesc : selectedCountry.bikeDocDesc}
                  </p>
                  {selectedCountry.specialAdvice && vehicleFilter === 'car' && (
                    <div className="ml-6 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                      💡 <strong>Gợi ý từ {brandName}:</strong> {selectedCountry.specialAdvice}
                    </div>
                  )}
                </div>

                {/* Quick Pills: Chọn nhanh các quốc gia du lịch hàng đầu Nha Trang */}
                <div className="pt-3 border-t border-sky-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x">
                  <span className="text-xs font-bold text-slate-700 shrink-0 uppercase tracking-wider mr-1">
                    Chọn nhanh:
                  </span>
                  {POPULAR_QUICK_PILLS.map((pill) => {
                    const targetC = COUNTRY_DATABASE.find(c => c.id === pill.id);
                    const isSelected = selectedCountry.id === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => targetC && setSelectedCountry(targetC)}
                        className={`min-h-[32px] px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-sky-800 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-sky-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowCountryModal(true)}
                    className="min-h-[32px] px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-200 transition-all shrink-0 cursor-pointer"
                  >
                    + Xem tất cả ({COUNTRY_DATABASE.length})
                  </button>
                </div>
              </div>

            </section>

            {/* ===================================================================== */}
            {/* PHẦN 2: MA TRẬN SO SÁNH MINH BẠCH TRÁCH NHIỆM (KHÁCH HÀNG VS NHÀ XE) */}
            {/* ===================================================================== */}
            <section id="policy-section-matrix" className="space-y-4 scroll-mt-24">
              <div className="border-b border-sky-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-sky-700" />
                    <span>Quyền Lợi &amp; Trách Nhiệm Rõ Ràng</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-balance">
                    Ma Trận Trách Nhiệm Minh Bạch (Customer vs Store Matrix)
                  </h2>
                </div>
                <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
                  Công bằng 100%
                </span>
              </div>

              {/* Bảng so sánh 2 cột trách nhiệm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Khối Trách nhiệm của Nhà xe Nha Trang Car */}
                <div className="p-5 rounded-3xl bg-sky-50/50 border border-sky-200 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-sky-200">
                    <div className="w-8 h-8 rounded-xl bg-sky-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base text-balance">Trách Nhiệm Của Nha Trang Car</h3>
                      <p className="text-xs text-sky-800 font-semibold">Cam kết chất lượng xe &amp; hoàn cọc</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-sky-700 stroke-[3] shrink-0 mt-0.5" />
                      <span className="text-pretty">Giao đúng dòng xe, đời xe sạch sẽ, lốp và phanh được bảo dưỡng định kỳ trước khi lăn bánh.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-sky-700 stroke-[3] shrink-0 mt-0.5" />
                      <span className="text-pretty">Trang bị 100% bảo hiểm vật chất 2 chiều và bảo hiểm TNDS bắt buộc theo quy định nhà nước.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-sky-700 stroke-[3] shrink-0 mt-0.5" />
                      <span className="text-pretty">Đội cứu hộ lưu động 24/7 có mặt xử lý trong 15&ndash;30 phút tại Nha Trang &amp; hỗ trợ đổi xe tương đương nếu xe gặp lỗi máy.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-sky-700 stroke-[3] shrink-0 mt-0.5" />
                      <span className="text-pretty">Hoàn tiền cọc siêu tốc trong 5 phút qua VietQR 24/7 ngay khi kiểm tra xe xong, không giữ cọc vô lý.</span>
                    </div>
                  </div>
                </div>

                {/* Khối Trách nhiệm của Khách hàng thuê xe */}
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base text-balance">Trách Nhiệm Của Khách Hàng</h3>
                      <p className="text-xs text-slate-600 font-semibold">Lái xe an toàn &amp; giữ gìn vệ sinh</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-slate-700 stroke-[3] shrink-0 mt-0.5" />
                      <span className="text-pretty">Tuân thủ luật giao thông đường bộ Việt Nam (tốc độ, làn đường, biển báo, tuyệt đối không sử dụng rượu bia).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-slate-700 stroke-[3] shrink-0 mt-0.5" />
                      <span className="text-pretty">Chịu trách nhiệm chi trả các lỗi vi phạm phạt nguội nếu camera ghi nhận trong khung giờ thuê xe của mình.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-slate-700 stroke-[3] shrink-0 mt-0.5" />
                      <span className="text-pretty">Giữ gìn vệ sinh nội thất xe cơ bản (không hút thuốc trong xe, không để hải sản tươi sống rò rỉ mùi).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-slate-700 stroke-[3] shrink-0 mt-0.5" />
                      <span className="text-pretty">Trả xe đúng giờ đã hẹn hoặc liên hệ báo trước ít nhất 2 giờ để showroom gia hạn thời gian thuê thuận tiện.</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* ===================================================================== */}
            {/* PHẦN 3: CHI TIẾT CÁC TAB CHÍNH SÁCH (ĐẶT CỌC, BẢO HIỂM, PHẠT NGUỘI) */}
            {/* ===================================================================== */}
            
            {/* TAB: ĐẶT CỌC & HOÀN CỌC MINH BẠCH */}
            <section id="policy-section-deposit" className="space-y-4 scroll-mt-24">
              <div className="border-b border-sky-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 text-balance">
                      Chính Sách Đặt Cọc &amp; Hoàn Cọc Siêu Tốc 5 Phút
                    </h3>
                    <p className="text-xs text-slate-600 text-pretty">
                      Bảng đối chiếu chi tiết tiền đặt cọc theo 3 dòng phương tiện &bull; Hoàn tiền 100% qua VietQR
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  VietQR 24/7
                </span>
              </div>

              {/* Bảng so sánh 3 dòng xe */}
              <div className="overflow-x-auto no-scrollbar border border-sky-100 rounded-3xl bg-white shadow-2xs">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="border-b border-sky-100 bg-sky-50/70 text-xs font-black text-slate-800 uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-[22%]">Dòng Phương Tiện</th>
                      <th className="py-3.5 px-4 w-[26%]">Mức Tiền Cọc Xe</th>
                      <th className="py-3.5 px-4 w-[26%]">Cọc Phạt Nguội</th>
                      <th className="py-3.5 px-4 w-[26%]">Thời Gian Hoàn Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                    <tr className="hover:bg-sky-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <Bike className="w-4 h-4 text-sky-700 shrink-0" />
                        <span>Xe máy xăng</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sky-900">
                        1.000.000₫ – 2.000.000₫
                        <span className="text-xs text-slate-500 font-normal block">Hoặc vé bay khứ hồi</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">0₫ (Miễn giữ)</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sky-800">
                        Ngay khi trả xe (5 phút)
                      </td>
                    </tr>

                    <tr className="hover:bg-sky-50/30 transition-colors bg-sky-50/20">
                      <td className="py-3.5 px-4 font-bold text-cyan-950 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-700 shrink-0" />
                        <span>Xe máy điện VinFast</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-cyan-900">
                        1.000.000₫
                        <span className="text-xs text-cyan-800 font-normal block">100% Miễn cọc Pin</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">0₫ (Miễn giữ)</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-cyan-800">
                        Ngay khi trả xe (5 phút)
                      </td>
                    </tr>

                    <tr className="hover:bg-sky-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <Car className="w-4 h-4 text-sky-700 shrink-0" />
                        <span>Ô tô tự lái 4-7 chỗ</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sky-950">
                        5.000.000₫ – 15.000.000₫
                        <span className="text-xs text-slate-500 font-normal block">Hoặc xe máy chính chủ</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-semibold">2.000.000₫ – 5.000.000₫</span>
                        <span className="text-xs text-slate-500 block">Theo đối soát Cục CSGT</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Cọc xe: 5 phút<br />
                        <span className="text-xs font-normal text-slate-600">Phạt nguội: sau 15–30 ngày</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3 Bước hoàn cọc tinh gọn */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-sky-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    1
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm text-balance">Đồng kiểm video 360° (2 phút)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-pretty">
                    Đối chiếu tình trạng vỏ xe, mức xăng/pin so với clip quay bàn giao ban đầu trên điện thoại.
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-sky-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    2
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm text-balance">Ký biên bản thanh lý số (1 phút)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-pretty">
                    Xác nhận hoàn tất hợp đồng điện tử 1-chạm trên máy tính bảng hoặc tin nhắn Zalo.
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-sky-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    3
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm text-balance">Nhận tiền cọc tức thì (2 phút)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-pretty">
                    Chuyển khoản 24/7 qua VietQR hoặc nhận tiền mặt tại showroom. Không thu phụ phí đối soát.
                  </p>
                </div>
              </div>
            </section>

            {/* TAB: BẢO HIỂM VẬT CHẤT 2 CHIỀU & PIN */}
            <section id="policy-section-insurance" className="space-y-4 scroll-mt-24">
              <div className="border-b border-sky-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 text-balance">
                      Bảo Hiểm Vật Chất 2 Chiều &amp; Bảo Hiểm Pin VinFast
                    </h3>
                    <p className="text-xs text-slate-600 text-pretty">
                      Bảo vệ trọn gói thân vỏ xe, thủy kích, cháy nổ và cụm pin xe điện toàn diện
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Miễn thường từ 500k
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Khối bảo hiểm ô tô */}
                <div className="p-5 rounded-3xl border border-sky-200 bg-white shadow-2xs space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-balance">
                    <Car className="w-4 h-4 text-sky-700" />
                    <span>Gói bảo hiểm thân vỏ ô tô tự lái</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                      <span className="text-pretty">Chi trả 100% chi phí phục hồi thân vỏ khi có va chạm hoặc trầy xước trong chuyến đi.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                      <span className="text-pretty">Bảo hiểm thủy kích ngập nước và tai nạn bất khả kháng theo quy chuẩn Bộ Tài Chính.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                      <span className="text-pretty">Mức miễn thường thấp chỉ từ 500.000₫/vụ, khách hàng không lo phát sinh chi phí lớn.</span>
                    </div>
                  </div>
                </div>

                {/* Khối bảo hiểm Pin VinFast */}
                <div className="p-5 rounded-3xl border border-cyan-200 bg-white shadow-2xs space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-balance">
                    <Zap className="w-4 h-4 text-cyan-700" />
                    <span>Bảo hiểm cụm Pin VinFast chính hãng</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                      <span className="text-pretty">100% các dòng xe điện VF3, VF5, VF8 và xe máy Feliz được bảo hiểm cụm pin cao áp.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                      <span className="text-pretty">Miễn trừ hoàn toàn trách nhiệm kỹ thuật khi sạc pin tại các trụ V-GREEN trên toàn quốc.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                      <span className="text-pretty">Xe cứu hộ lưu động sạc pin khẩn cấp 24/7 khi xe cạn pin dọc cung đường ven biển Nha Trang.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TAB: PHẠT NGUỘI MINH BẠCH QUA CỔNG CSGT */}
            <section id="policy-section-traffic" className="space-y-4 scroll-mt-24">
              <div className="border-b border-sky-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 text-balance">
                      Quy Chuẩn Tra Cứu Phạt Nguội Công Khai Cục CSGT
                    </h3>
                    <p className="text-xs text-slate-600 text-pretty">
                      Đối soát hình ảnh, video và tọa độ vi phạm trực tiếp &bull; Tuyệt đối không phạt oan
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.csgt.vn/tra-cuu-phuong-tien-vi-pham-giao-thong.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all self-start sm:self-auto shrink-0"
                >
                  <span>Cổng tra cứu csgt.vn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-1.5">
                  <div className="text-xs font-bold text-sky-800 uppercase tracking-wider">Bước 1</div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm text-balance">Đối soát GPS &amp; Hợp đồng</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-pretty">
                    Chỉ tính các lỗi camera ghi hình trong thời gian xe lăn bánh theo đúng hợp đồng của khách thuê.
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-1.5">
                  <div className="text-xs font-bold text-sky-800 uppercase tracking-wider">Bước 2</div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm text-balance">Gửi ảnh &amp; Video chính thức</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-pretty">
                    Cung cấp đầy đủ thông báo vi phạm từ Cục CSGT, tọa độ camera và hình ảnh rõ biển số xe.
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-1.5">
                  <div className="text-xs font-bold text-sky-800 uppercase tracking-wider">Bước 3</div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm text-balance">Biên lai Kho bạc điện tử</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-pretty">
                    Khách có thể tự nộp phạt trên Cổng DVC Quốc gia hoặc ủy quyền công ty nộp hộ với biên lai chính thức.
                  </p>
                </div>
              </div>
            </section>

            {/* ===================================================================== */}
            {/* PHẦN 4: FAQ CÂU HỎI THƯỜNG GẶP (ACCORDION 2 CỘT SONG SONG) */}
            {/* ===================================================================== */}
            <section className="space-y-4">
              <div className="border-b border-sky-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 text-balance">
                      {t('reg.faq_header_title')}
                    </h3>
                    <p className="text-xs text-slate-600 text-pretty">
                      {t('reg.faq_header_desc')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  Giải đáp 24/7
                </span>
              </div>

              {/* Lưới Accordion 2 Cột Song Song */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-3xl border border-sky-100 bg-white hover:bg-sky-50/40 transition-colors overflow-hidden shadow-2xs"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full min-h-[52px] p-4 text-left font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <span className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span
                            className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 font-bold transition-colors ${
                              isOpen ? 'bg-sky-800 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="truncate text-pretty">{faq.q}</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-sky-700 transition-transform duration-200 shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed text-pretty border-t border-sky-100/60">
                            {faq.a}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ===================================================================== */}
            {/* PHẦN 5: BANNER TỔNG ĐÀI HỖ TRỢ & XEM XE ĐẶT NGAY */}
            {/* ===================================================================== */}
            <div className="rounded-3xl bg-sky-950 p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-sky-900">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold tracking-wider uppercase text-sky-200 bg-sky-900/80 px-3 py-1 rounded-full border border-sky-700 inline-block">
                  Tổng đài tư vấn thủ tục 24/7
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white text-balance">
                  Bạn cần tư vấn riêng cho đoàn hoặc hành trình dài ngày?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed text-pretty">
                  Đội ngũ tư vấn viên Nha Trang Car luôn sẵn sàng hỗ trợ trực tiếp và giữ xe nhanh qua Hotline hoặc Zalo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto shrink-0">
                <a
                  href={`tel:${hotline.replace(/\s+/g, '')}`}
                  className="min-h-[48px] px-5 py-3 rounded-2xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-sky-700 transition-all select-none active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Hotline: {hotline}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setCustomerTab('vehicles')}
                  className="min-h-[48px] px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-sky-50 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]"
                >
                  <span>Xem danh sách xe &amp; Đặt ngay</span>
                  <ArrowRight className="w-4 h-4 text-sky-700" />
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
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setShowCountryModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-country-title"
        >
          <div
            className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-sky-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-4 bg-gradient-to-r from-sky-50 via-sky-50/60 to-white border-b border-sky-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-800 text-white flex items-center justify-center shadow-xs">
                  <Globe className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 id="modal-country-title" className="font-extrabold text-slate-900 text-base sm:text-lg">
                    {t('reg.select_country_modal_title')}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                    {t('reg.select_country_modal_sub')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCountryModal(false)}
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                title="Đóng cửa sổ"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Filter Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-slate-50/60">
              {/* Ô tìm kiếm nhanh trong popup */}
              <div className="relative">
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                  <Globe className="w-4 h-4 text-sky-700 shrink-0" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder={t('reg.modal_search_placeholder')}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-hidden"
                    autoFocus
                  />
                  {modalSearch && (
                    <button
                      type="button"
                      onClick={() => setModalSearch('')}
                      className="p-1 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
                      title="Xóa tìm kiếm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Các tab phân loại nhanh */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 touch-pan-x">
                {[
                  { id: 'all' as const, label: `${t('reg.filter_all')} (${COUNTRY_DATABASE.length})` },
                  { id: 'vn' as const, label: t('reg.filter_vn') },
                  { id: 'asean' as const, label: t('reg.filter_asean') },
                  { id: 'intl' as const, label: t('reg.filter_intl') },
                  { id: 'special' as const, label: t('reg.filter_special') }
                ].map((tab) => {
                  const isActive = modalCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setModalCategory(tab.id)}
                      className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-800 text-white shadow-xs'
                          : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200/90'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Country List Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[50vh] divide-y divide-slate-100 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
              {modalFilteredCountries.length > 0 ? (
                modalFilteredCountries.map((c) => {
                  const isSelected = selectedCountry.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(c);
                        setShowCountryModal(false);
                      }}
                      className={`w-full min-h-[56px] p-3 rounded-2xl text-left transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] ${
                        isSelected
                          ? 'bg-sky-50/90 border-2 border-sky-600 shadow-xs'
                          : 'hover:bg-sky-50/60 border border-slate-200/80 hover:border-sky-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl sm:text-3xl shrink-0">{c.flag}</span>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-sky-950 truncate">
                            {c.nameVi}
                          </div>
                          <div className="text-xs text-slate-500 font-medium truncate">
                            {c.nameEn}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-full ${
                            c.group === 'special'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : c.group === 'asean'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-sky-100 text-sky-800 border border-sky-300'
                          }`}
                        >
                          {c.groupBadge}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-sky-800 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-2 py-8 text-center space-y-2">
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {t('reg.search_country_empty')}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 text-center sm:text-left">
                <LifeBuoy className="w-4 h-4 text-sky-700 shrink-0" />
                <span className="line-clamp-1">{t('reg.modal_footer_help')}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCountryModal(false)}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
              >
                {t('reg.modal_close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
