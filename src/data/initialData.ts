import { Vehicle, Customer, RentalContract, MaintenanceTask, StoreSettings, User, ActivityLog } from '../types';

export const initialUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    name: 'Nguyễn Văn Minh',
    role: 'admin',
    roleTitle: 'Chủ cửa hàng / Quản lý',
    phone: '0905 123 456'
  },
  {
    id: 'user-2',
    username: 'sales',
    name: 'Trần Thị Thu Thảo',
    role: 'staff',
    roleTitle: 'Nhân viên cho thuê',
    phone: '0905 789 123'
  },
  {
    id: 'user-3',
    username: 'tech',
    name: 'Lê Hoàng Dũng',
    role: 'technician',
    roleTitle: 'Kỹ thuật viên bảo trì',
    phone: '0935 456 789'
  }
];

export const initialStoreSettings: StoreSettings = {
  storeName: 'DriveRent Đà Nẵng - Cho thuê Xe Tự Lái',
  brandTitle: 'DriveRent',
  address: 'Số 182 Đường Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, TP. Đà Nẵng',
  hotline: '0905 888 999',
  email: 'hotro@driverent.vn',
  city: 'Đà Nẵng',
  bankName: 'Ngân hàng TMCP Quân Đội (MB Bank)',
  bankAccount: '0905888999888',
  bankAccountName: 'NGUYEN VAN MINH - DRIVERENT',
  bufferHours: 2, // 2 tiếng dọn xe và kiểm tra
  hourlyOverdueRateCar: 100000,
  hourlyOverdueRateBike: 30000,
  maintenanceKmThreshold: 3000,
  maintenanceDaysThreshold: 90
};

export const initialVehicles: Vehicle[] = [
  // 1. Toyota Vios 1.5G (Car, Available)
  {
    id: 'V-01',
    name: 'Toyota Vios 1.5G',
    plateNumber: '43A-582.19',
    type: 'car',
    category: 'Sedan 5 chỗ',
    status: 'available',
    hourlyPrice: 90000,
    dailyPrice: 750000,
    currentOdometer: 32450,
    fuelLevel: 8,
    image: '/src/assets/images/car_toyota_vios_1791537588925.jpg',
    year: 2023,
    color: 'Trắng ngọc trai',
    transmission: 'Tự động (CVT)',
    features: ['Màn hình Android', 'Camera hành trình', 'Cảm biến lùi', 'Apple CarPlay', 'Điều hòa tự động'],
    insuranceExpiry: '2027-04-15',
    registrationExpiry: '2027-08-20',
    lastMaintenanceDate: '2026-08-10',
    lastMaintenanceKm: 30000,
    nextMaintenanceDate: '2026-11-10',
    nextMaintenanceKm: 35000,
    notes: 'Xe chạy êm ái, bảo dưỡng định kỳ đầy đủ'
  },
  // 2. Mitsubishi Xpander (Car, Rented)
  {
    id: 'V-02',
    name: 'Mitsubishi Xpander',
    plateNumber: '43A-629.41',
    type: 'car',
    category: 'MPV 7 chỗ',
    status: 'rented',
    hourlyPrice: 120000,
    dailyPrice: 950000,
    currentOdometer: 48920,
    fuelLevel: 7,
    image: '/src/assets/images/car_mitsubishi_xpander_1791537608474.jpg',
    year: 2023,
    color: 'Bạc ánh kim',
    transmission: 'Tự động',
    features: ['7 chỗ rộng rãi', 'Cốp để hành lý lớn', 'Camera 360', 'Cruise Control', 'Cửa gió trần'],
    insuranceExpiry: '2027-02-18',
    registrationExpiry: '2027-06-12',
    lastMaintenanceDate: '2026-07-22',
    lastMaintenanceKm: 45000,
    nextMaintenanceDate: '2026-10-22',
    nextMaintenanceKm: 50000,
    notes: 'Gia đình du lịch chuộng thuê nhất'
  },
  // 3. Honda Vision Smartkey (Motorbike, Available)
  {
    id: 'V-03',
    name: 'Honda Vision',
    plateNumber: '43K1-689.24',
    type: 'motorbike',
    category: 'Xe tay ga 110cc',
    status: 'available',
    hourlyPrice: 25000,
    dailyPrice: 150000,
    currentOdometer: 14200,
    fuelLevel: 8,
    image: '/src/assets/images/scooter_honda_vision_1791537620987.jpg',
    year: 2024,
    color: 'Trắng ánh kim',
    transmission: 'Tự động',
    features: ['Khóa Smartkey', 'Cốp rộng', 'Cổng sạc điện thoại USB', 'Phanh Combi Brake', 'Tiết kiệm xăng eSP+'],
    insuranceExpiry: '2027-09-01',
    registrationExpiry: '2029-01-01',
    lastMaintenanceDate: '2026-09-05',
    lastMaintenanceKm: 12500,
    nextMaintenanceDate: '2026-12-05',
    nextMaintenanceKm: 15500,
    notes: 'Xe đời mới 2024 máy cực êm'
  },
  // 4. Honda Air Blade 125 (Motorbike, Rented)
  {
    id: 'V-04',
    name: 'Honda Air Blade',
    plateNumber: '43E1-714.88',
    type: 'motorbike',
    category: 'Xe tay ga 125cc',
    status: 'rented',
    hourlyPrice: 30000,
    dailyPrice: 180000,
    currentOdometer: 21800,
    fuelLevel: 6,
    image: '/src/assets/images/scooter_honda_airblade_1791537634617.jpg',
    year: 2023,
    color: 'Xanh đen nhám',
    transmission: 'Tự động',
    features: ['Khóa Smartkey', 'Đèn LED', 'Phanh đĩa an toàn', 'Đồng hồ LCD thể thao'],
    insuranceExpiry: '2027-03-10',
    registrationExpiry: '2028-11-20',
    lastMaintenanceDate: '2026-08-01',
    lastMaintenanceKm: 20000,
    nextMaintenanceDate: '2026-11-01',
    nextMaintenanceKm: 23000,
    notes: 'Khách thanh niên đi đèo Hải Vân rất thích'
  },
  // 5. Hyundai Accent (Car, Available)
  {
    id: 'V-05',
    name: 'Hyundai Accent 1.4 AT',
    plateNumber: '43A-491.52',
    type: 'car',
    category: 'Sedan 5 chỗ',
    status: 'available',
    hourlyPrice: 90000,
    dailyPrice: 700000,
    currentOdometer: 28400,
    fuelLevel: 8,
    image: '/src/assets/images/car_toyota_vios_1791537588925.jpg',
    year: 2023,
    color: 'Đỏ mận',
    transmission: 'Tự động',
    features: ['Cửa sổ trời', 'Khởi động nút bấm', 'Cảm biến gạt mưa', 'Định vị GPS'],
    insuranceExpiry: '2027-05-30',
    registrationExpiry: '2027-09-18',
    lastMaintenanceDate: '2026-08-15',
    lastMaintenanceKm: 26000,
    nextMaintenanceDate: '2026-11-15',
    nextMaintenanceKm: 30000,
    notes: 'Xe trang bị đầy đủ cam lùi, bảo hiểm thân vỏ 100%'
  },
  // 6. Yamaha Sirius Fi (Motorbike, Maintenance)
  {
    id: 'V-06',
    name: 'Yamaha Sirius Fi',
    plateNumber: '43H1-523.66',
    type: 'motorbike',
    category: 'Xe số 115cc',
    status: 'maintenance',
    hourlyPrice: 20000,
    dailyPrice: 120000,
    currentOdometer: 29850,
    fuelLevel: 5,
    image: '/src/assets/images/scooter_honda_airblade_1791537634617.jpg',
    year: 2022,
    color: 'Đen đỏ',
    transmission: 'Xe số tròn 4 cấp',
    features: ['Phun xăng điện tử Fi', 'Khỏe máy leo đèo', 'Cực tiết kiệm xăng', 'Phanh đĩa trước'],
    insuranceExpiry: '2027-01-12',
    registrationExpiry: '2027-10-05',
    lastMaintenanceDate: '2026-06-20',
    lastMaintenanceKm: 27000,
    nextMaintenanceDate: '2026-09-20', // Quá hạn!
    nextMaintenanceKm: 29500, // Đã quá số km!
    notes: 'Đang bảo dưỡng thay nhông sên dĩa và nhớt Motul'
  },
  // 7. Honda Vision (Motorbike, Rented)
  {
    id: 'V-07',
    name: 'Honda Vision',
    plateNumber: '43K1-825.90',
    type: 'motorbike',
    category: 'Xe tay ga 110cc',
    status: 'rented',
    hourlyPrice: 25000,
    dailyPrice: 150000,
    currentOdometer: 18450,
    fuelLevel: 7,
    image: '/src/assets/images/scooter_honda_vision_1791537620987.jpg',
    year: 2023,
    color: 'Đỏ đô',
    transmission: 'Tự động',
    features: ['Khóa Smartkey', 'Cốp xe lớn', 'Phanh Combi Brake'],
    insuranceExpiry: '2027-07-14',
    registrationExpiry: '2028-10-01',
    lastMaintenanceDate: '2026-07-28',
    lastMaintenanceKm: 16000,
    nextMaintenanceDate: '2026-10-28',
    nextMaintenanceKm: 19000,
    notes: 'Khách người Hàn Quốc đang thuê đi Hội An'
  },
  // 8. Toyota Vios (Car, Available)
  {
    id: 'V-08',
    name: 'Toyota Vios 1.5E',
    plateNumber: '43A-670.33',
    type: 'car',
    category: 'Sedan 5 chỗ',
    status: 'available',
    hourlyPrice: 85000,
    dailyPrice: 700000,
    currentOdometer: 41200,
    fuelLevel: 8,
    image: '/src/assets/images/car_toyota_vios_1791537588925.jpg',
    year: 2022,
    color: 'Bạc',
    transmission: 'Tự động',
    features: ['Bluetooth Audio', 'Camera hành trình', 'Cảm biến lùi'],
    insuranceExpiry: '2027-03-22',
    registrationExpiry: '2027-07-19',
    lastMaintenanceDate: '2026-08-20',
    lastMaintenanceKm: 39000,
    nextMaintenanceDate: '2026-11-20',
    nextMaintenanceKm: 44000,
    notes: 'Xe vừa được dọn nội thất sạch sẽ'
  },
  // 9. Mitsubishi Xpander Cross (Car, Available)
  {
    id: 'V-09',
    name: 'Mitsubishi Xpander Cross',
    plateNumber: '43A-781.05',
    type: 'car',
    category: 'MPV 7 chỗ gầm cao',
    status: 'available',
    hourlyPrice: 130000,
    dailyPrice: 1050000,
    currentOdometer: 22100,
    fuelLevel: 8,
    image: '/src/assets/images/car_mitsubishi_xpander_1791537608474.jpg',
    year: 2024,
    color: 'Cam - Đen hai tông',
    transmission: 'Tự động',
    features: ['Gầm cao 225mm', 'Hệ thống AYC kiểm soát vào cua', 'Màn hình cảm ứng 9 inch', 'Phanh tay điện tử'],
    insuranceExpiry: '2027-11-10',
    registrationExpiry: '2028-04-15',
    lastMaintenanceDate: '2026-08-30',
    lastMaintenanceKm: 20000,
    nextMaintenanceDate: '2026-11-30',
    nextMaintenanceKm: 25000,
    notes: 'Xe mới 2024, thích hợp đi Bà Nà Hills, Hội An'
  },
  // 10. Honda Air Blade 160 (Motorbike, Available)
  {
    id: 'V-10',
    name: 'Honda Air Blade 160',
    plateNumber: '43K1-992.11',
    type: 'motorbike',
    category: 'Xe tay ga 160cc',
    status: 'available',
    hourlyPrice: 35000,
    dailyPrice: 220000,
    currentOdometer: 9800,
    fuelLevel: 8,
    image: '/src/assets/images/scooter_honda_airblade_1791537634617.jpg',
    year: 2024,
    color: 'Xám xi măng',
    transmission: 'Tự động',
    features: ['Động cơ 160cc mạnh mẽ', 'Phanh ABS chống bó cứng', 'Cổng sạc nhanh USB', 'Smartkey'],
    insuranceExpiry: '2027-10-01',
    registrationExpiry: '2029-05-10',
    lastMaintenanceDate: '2026-09-12',
    lastMaintenanceKm: 8500,
    nextMaintenanceDate: '2026-12-12',
    nextMaintenanceKm: 11500,
    notes: 'Xe phân khối 160cc chạy đèo dốc cực bốc'
  },
  // 11. Yamaha Sirius (Motorbike, Available)
  {
    id: 'V-11',
    name: 'Yamaha Sirius',
    plateNumber: '43H1-364.72',
    type: 'motorbike',
    category: 'Xe số 110cc',
    status: 'available',
    hourlyPrice: 20000,
    dailyPrice: 120000,
    currentOdometer: 34100,
    fuelLevel: 8,
    image: '/src/assets/images/scooter_honda_airblade_1791537634617.jpg',
    year: 2022,
    color: 'Trắng đen',
    transmission: 'Xe số',
    features: ['Động cơ bền bỉ', 'Tiết kiệm nhiên liệu', 'Gọn gàng dễ luồn lách phố'],
    insuranceExpiry: '2027-02-14',
    registrationExpiry: '2027-12-08',
    lastMaintenanceDate: '2026-08-05',
    lastMaintenanceKm: 32000,
    nextMaintenanceDate: '2026-11-05',
    nextMaintenanceKm: 35000,
    notes: 'Xe bền, giá thuê mềm nhất đội xe'
  },
  // 12. Hyundai Accent (Car, Maintenance)
  {
    id: 'V-12',
    name: 'Hyundai Accent 1.4 MT',
    plateNumber: '43A-388.94',
    type: 'car',
    category: 'Sedan 5 chỗ',
    status: 'maintenance',
    hourlyPrice: 80000,
    dailyPrice: 650000,
    currentOdometer: 52300,
    fuelLevel: 6,
    image: '/src/assets/images/car_toyota_vios_1791537588925.jpg',
    year: 2022,
    color: 'Trắng',
    transmission: 'Số sàn 6 cấp',
    features: ['Số sàn tiết kiệm', 'Màn hình cảm ứng', 'Camera lùi'],
    insuranceExpiry: '2027-04-02',
    registrationExpiry: '2027-07-25',
    lastMaintenanceDate: '2026-06-15',
    lastMaintenanceKm: 48000,
    nextMaintenanceDate: '2026-09-15', // Quá hạn!
    nextMaintenanceKm: 51000, // Quá km!
    notes: 'Đang thay má phanh và bảo dưỡng hệ thống điều hòa'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'CUST-01',
    fullName: 'Hoàng Anh Tuấn',
    phone: '0912 345 678',
    identityNumber: '048092004512',
    driverLicense: '480210089211 (Hạng B2)',
    address: '15 Kim Mã, Ba Đình, Hà Nội (Du lịch Đà Nẵng)',
    city: 'Hà Nội',
    rentalCount: 4,
    rating: 5,
    notes: 'Khách quen, giữ gìn xe rất kỹ, luôn trả đúng giờ'
  },
  {
    id: 'CUST-02',
    fullName: 'Võ Thị Minh Châu',
    phone: '0988 765 432',
    identityNumber: '079195003418',
    driverLicense: '790180054321 (Hạng A1)',
    address: '240 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    rentalCount: 2,
    rating: 5,
    notes: 'Khách thuê xe máy dạo phố và Hội An'
  },
  {
    id: 'CUST-03',
    fullName: 'Đặng Quốc Huy',
    phone: '0903 555 777',
    identityNumber: '048088001299',
    driverLicense: '480160012398 (Hạng B2)',
    address: '88 Lê Lợi, TP. Huế',
    city: 'Huế',
    rentalCount: 1,
    rating: 4,
    notes: 'Thuê xe đi công tác tại Đà Nẵng'
  },
  {
    id: 'CUST-04',
    fullName: 'Ngô Thanh Hương',
    phone: '0934 999 111',
    identityNumber: '031198007788',
    driverLicense: '310190087654 (Hạng A1)',
    address: '42 Lạch Tray, Ngô Quyền, Hải Phòng',
    city: 'Hải Phòng',
    rentalCount: 3,
    rating: 5,
    notes: 'Du lịch nhóm bạn, hay thuê Vision'
  },
  {
    id: 'CUST-05',
    fullName: 'Bùi Đức Trọng',
    phone: '0977 123 987',
    identityNumber: '048085002233',
    driverLicense: '480170065432 (Hạng C)',
    address: 'Khu công nghiệp Hòa Khánh, Đà Nẵng',
    city: 'Đà Nẵng',
    rentalCount: 6,
    rating: 5,
    notes: 'Khách bản địa thuê xe 7 chỗ đón gia đình đi chơi dịp cuối tuần'
  },
  {
    id: 'CUST-06',
    fullName: 'Phạm Kiều Oanh',
    phone: '0905 444 222',
    identityNumber: '074199008899',
    driverLicense: '740200034567 (Hạng A1)',
    address: '12 Quang Trung, TP. Nha Trang',
    city: 'Khánh Hòa',
    rentalCount: 1,
    rating: 4,
    notes: 'Khách mới thuê lần đầu'
  }
];

export const initialContracts: RentalContract[] = [
  // 1. HD-2026-001 (Đang thuê - Mitsubishi Xpander)
  {
    id: 'HD-2026-001',
    vehicleId: 'V-02',
    customerId: 'CUST-01',
    pricingType: 'daily',
    status: 'rented',
    startDate: '2026-10-08T09:00',
    endDate: '2026-10-11T17:00',
    rate: 950000,
    units: 4,
    baseRentalFee: 3800000,
    deposit: 5000000, // Tiền cọc xe ô tô
    discount: 100000,
    surcharges: [
      { id: 'sur-1', reason: 'Giao xe tại sân bay Đà Nẵng', amount: 150000 }
    ],
    totalServiceFee: 3850000,
    amountPaid: 3850000, // Đã thanh toán trước tiền thuê
    handoverRecord: {
      actualTime: '2026-10-08T09:15',
      odometer: 48920,
      fuelLevel: 7,
      accessories: ['Giấy tờ xe (Cavet công chứng + Bảo hiểm)', 'Lốp dự phòng', 'Bộ kích lốp', 'Thẻ sạc cứu hộ'],
      notes: 'Thân vỏ sạch, có vết xước nhẹ 2cm ở cản trước góc phụ (đã chụp ảnh)',
      photos: ['/src/assets/images/car_mitsubishi_xpander_1791537608474.jpg'],
      performedBy: 'Trần Thị Thu Thảo'
    },
    note: 'Khách gia đình đi Đà Nẵng - Hội An - Bà Nà Hills',
    createdAt: '2026-10-07T14:30',
    createdBy: 'Trần Thị Thu Thảo'
  },
  // 2. HD-2026-002 (Đang thuê - Honda Air Blade)
  {
    id: 'HD-2026-002',
    vehicleId: 'V-04',
    customerId: 'CUST-02',
    pricingType: 'daily',
    status: 'rented',
    startDate: '2026-10-08T10:00',
    endDate: '2026-10-10T12:00',
    rate: 180000,
    units: 2,
    baseRentalFee: 360000,
    deposit: 1000000, // Tiền cọc xe máy
    discount: 0,
    surcharges: [],
    totalServiceFee: 360000,
    amountPaid: 360000,
    handoverRecord: {
      actualTime: '2026-10-08T10:10',
      odometer: 21800,
      fuelLevel: 6,
      accessories: ['2 mũ bảo hiểm đạt chuẩn', '1 áo mưa DriveRent', '1 giá kẹp điện thoại'],
      notes: 'Xe sạch sẽ, máy êm, phanh nhạy',
      photos: ['/src/assets/images/scooter_honda_airblade_1791537634617.jpg'],
      performedBy: 'Trần Thị Thu Thảo'
    },
    note: 'Khách lưu trú tại Khách sạn Mường Thanh Sơn Trà',
    createdAt: '2026-10-08T09:40',
    createdBy: 'Trần Thị Thu Thảo'
  },
  // 3. HD-2026-003 (Đang thuê - Honda Vision)
  {
    id: 'HD-2026-003',
    vehicleId: 'V-07',
    customerId: 'CUST-04',
    pricingType: 'daily',
    status: 'rented',
    startDate: '2026-10-09T08:00',
    endDate: '2026-10-09T20:00', // Sắp đến giờ trả tối nay!
    rate: 150000,
    units: 1,
    baseRentalFee: 150000,
    deposit: 1000000,
    discount: 0,
    surcharges: [],
    totalServiceFee: 150000,
    amountPaid: 150000,
    handoverRecord: {
      actualTime: '2026-10-09T08:15',
      odometer: 18450,
      fuelLevel: 7,
      accessories: ['2 mũ bảo hiểm', '1 áo mưa', '1 giá kẹp điện thoại'],
      notes: 'Giao tại văn phòng 182 Võ Nguyên Giáp',
      photos: ['/src/assets/images/scooter_honda_vision_1791537620987.jpg'],
      performedBy: 'Trần Thị Thu Thảo'
    },
    note: 'Khách hẹn trả tại cửa hàng lúc 20:00 hôm nay',
    createdAt: '2026-10-09T07:45',
    createdBy: 'Trần Thị Thu Thảo'
  },
  // 4. HD-2026-004 (Đã xác nhận - chuẩn bị giao xe hôm nay lúc 14:00)
  {
    id: 'HD-2026-004',
    vehicleId: 'V-01', // Toyota Vios
    customerId: 'CUST-03',
    pricingType: 'daily',
    status: 'confirmed',
    startDate: '2026-10-09T14:00',
    endDate: '2026-10-12T14:00',
    rate: 750000,
    units: 3,
    baseRentalFee: 2250000,
    deposit: 5000000,
    discount: 0,
    surcharges: [
      { id: 'sur-2', reason: 'Giao xe tận nơi Khách sạn Brilliant', amount: 100000 }
    ],
    totalServiceFee: 2350000,
    amountPaid: 500000, // Đã đặt cọc giữ chỗ 500.000 đ
    note: 'Giao xe lúc 14:00 tại Khách sạn Brilliant Bạch Đằng',
    createdAt: '2026-10-08T16:00',
    createdBy: 'Nguyễn Văn Minh'
  },
  // 5. HD-2026-005 (Chờ quyết toán - Khách vừa trả xe có phụ phí rửa xe & phát sinh giờ)
  {
    id: 'HD-2026-005',
    vehicleId: 'V-05', // Hyundai Accent
    customerId: 'CUST-05',
    pricingType: 'daily',
    status: 'pending_settlement',
    startDate: '2026-10-07T08:00',
    endDate: '2026-10-08T18:00',
    rate: 700000,
    units: 2,
    baseRentalFee: 1400000,
    deposit: 5000000,
    discount: 0,
    surcharges: [
      { id: 'sur-3', reason: 'Phụ phí xe đi bùn đất cần rửa khoang máy & gầm', amount: 150000 }
    ],
    totalServiceFee: 1550000,
    amountPaid: 1400000,
    handoverRecord: {
      actualTime: '2026-10-07T08:10',
      odometer: 28050,
      fuelLevel: 8,
      accessories: ['Giấy tờ xe', 'Lốp dự phòng', 'Bơm điện mini'],
      notes: 'Xe mới rửa sạch đẹp',
      photos: ['/src/assets/images/car_toyota_vios_1791537588925.jpg'],
      performedBy: 'Nguyễn Văn Minh'
    },
    returnRecord: {
      actualTime: '2026-10-08T20:30', // Trả trễ 2.5 giờ
      odometer: 28400, // +350 km
      fuelLevel: 8,
      checklist: {
        body: true,
        tires: true,
        lights: true,
        mirrors: true,
        fuel: true,
        accessories: true
      },
      damageNotes: 'Xe bẩn nhiều bùn đất ở hốc bánh xe, không xước móp',
      damageFee: 0,
      photos: ['/src/assets/images/car_toyota_vios_1791537588925.jpg'],
      postStatus: 'available',
      performedBy: 'Nguyễn Văn Minh'
    },
    note: 'Cần quyết toán: phụ phí rửa xe 150.000 đ và 3 giờ quá hạn (300.000 đ)',
    createdAt: '2026-10-06T19:00',
    createdBy: 'Nguyễn Văn Minh'
  },
  // 6. HD-2026-006 (Hoàn tất - Đã quyết toán xong đầy đủ)
  {
    id: 'HD-2026-006',
    vehicleId: 'V-03', // Honda Vision
    customerId: 'CUST-06',
    pricingType: 'hourly',
    status: 'completed',
    startDate: '2026-10-07T08:00',
    endDate: '2026-10-07T14:00',
    rate: 25000,
    units: 6,
    baseRentalFee: 150000,
    deposit: 1000000,
    discount: 0,
    surcharges: [],
    totalServiceFee: 150000,
    amountPaid: 150000,
    handoverRecord: {
      actualTime: '2026-10-07T08:05',
      odometer: 14140,
      fuelLevel: 8,
      accessories: ['2 mũ bảo hiểm', '1 áo mưa'],
      notes: 'Bàn giao tốt',
      photos: ['/src/assets/images/scooter_honda_vision_1791537620987.jpg'],
      performedBy: 'Trần Thị Thu Thảo'
    },
    returnRecord: {
      actualTime: '2026-10-07T14:00',
      odometer: 14200,
      fuelLevel: 8,
      checklist: {
        body: true,
        tires: true,
        lights: true,
        mirrors: true,
        fuel: true,
        accessories: true
      },
      damageNotes: 'Không có hư hại, xe hoàn hảo',
      damageFee: 0,
      photos: ['/src/assets/images/scooter_honda_vision_1791537620987.jpg'],
      postStatus: 'available',
      performedBy: 'Trần Thị Thu Thảo'
    },
    finalSettlement: {
      actualUnitsBilled: 6,
      pricingType: 'hourly',
      unitRate: 25000,
      actualRentalFee: 150000,
      surchargesTotal: 0,
      damageFee: 0,
      discount: 0,
      totalServiceFee: 150000,
      amountPaid: 150000,
      depositHeld: 1000000,
      depositDeducted: 0,
      additionalDue: 0,
      refundAmount: 1000000, // Hoàn lại 100% tiền cọc
      settledAt: '2026-10-07T14:15',
      settledBy: 'Trần Thị Thu Thảo',
      paymentMethod: 'Tiền mặt'
    },
    note: 'Khách thuê theo giờ đi Bán đảo Sơn Trà',
    createdAt: '2026-10-07T07:50',
    createdBy: 'Trần Thị Thu Thảo'
  },
  // 7. HD-2026-007 (Nháp - Khách hỏi thuê 7 chỗ cuối tuần)
  {
    id: 'HD-2026-007',
    vehicleId: 'V-09', // Mitsubishi Xpander Cross
    customerId: 'CUST-05',
    pricingType: 'daily',
    status: 'draft',
    startDate: '2026-10-12T07:00',
    endDate: '2026-10-14T20:00',
    rate: 1050000,
    units: 3,
    baseRentalFee: 3150000,
    deposit: 5000000,
    discount: 150000,
    surcharges: [],
    totalServiceFee: 3000000,
    amountPaid: 0,
    note: 'Báo giá cho anh Trọng đi đám cưới ở Tam Kỳ',
    createdAt: '2026-10-09T01:30',
    createdBy: 'Nguyễn Văn Minh'
  },
  // 8. HD-2026-008 (Đã hủy - Khách đổi lịch máy bay)
  {
    id: 'HD-2026-008',
    vehicleId: 'V-10', // Honda Air Blade 160
    customerId: 'CUST-03',
    pricingType: 'daily',
    status: 'cancelled',
    startDate: '2026-10-06T09:00',
    endDate: '2026-10-08T09:00',
    rate: 220000,
    units: 2,
    baseRentalFee: 440000,
    deposit: 1000000,
    discount: 0,
    surcharges: [],
    totalServiceFee: 440000,
    amountPaid: 0,
    note: 'Khách hủy vì chuyến bay bị dời ngày do thời tiết',
    createdAt: '2026-10-05T11:00',
    createdBy: 'Trần Thị Thu Thảo'
  }
];

export const initialMaintenanceTasks: MaintenanceTask[] = [
  // 1. Xe đang bảo dưỡng (Yamaha Sirius Fi V-06)
  {
    id: 'MAINT-01',
    vehicleId: 'V-06',
    title: 'Thay nhông sên dĩa và thay dầu nhớt định kỳ',
    type: 'Thay dầu nhớt & lọc',
    status: 'in_progress',
    dueDate: '2026-09-20',
    dueKm: 29500,
    cost: 450000,
    assignedTo: 'Lê Hoàng Dũng',
    notes: 'Sên bị chùng nhiều, thay nhớt Motul 3100 Silver và bộ NSD DID chính hãng'
  },
  // 2. Xe đang bảo dưỡng (Hyundai Accent V-12)
  {
    id: 'MAINT-02',
    vehicleId: 'V-12',
    title: 'Bảo dưỡng cấp 50.000 km và thay má phanh trước',
    type: 'Bảo dưỡng định kỳ',
    status: 'in_progress',
    dueDate: '2026-09-15',
    dueKm: 51000,
    cost: 2850000,
    assignedTo: 'Lê Hoàng Dũng',
    notes: 'Bảo dưỡng cấp lớn: Thay dầu máy, lọc dầu, lọc gió động cơ, vệ sinh bugi, thay má phanh trước'
  },
  // 3. Sắp đến hạn bảo dưỡng (Mitsubishi Xpander V-02)
  {
    id: 'MAINT-03',
    vehicleId: 'V-02',
    title: 'Bảo dưỡng định kỳ mốc 50.000 km',
    type: 'Bảo dưỡng định kỳ',
    status: 'upcoming',
    dueDate: '2026-10-22',
    dueKm: 50000,
    cost: 1600000,
    assignedTo: 'Lê Hoàng Dũng',
    notes: 'Xe đang chạy đạt 48.920 km, chuẩn bị bảo dưỡng ngay sau khi lượt thuê này hoàn tất'
  },
  // 4. Đã hoàn thành gần đây (Toyota Vios V-01)
  {
    id: 'MAINT-04',
    vehicleId: 'V-01',
    title: 'Thay nhớt tổng hợp toàn phần và đảo 4 lốp',
    type: 'Thay dầu nhớt & lọc',
    status: 'completed',
    dueDate: '2026-08-10',
    dueKm: 30000,
    cost: 1200000,
    assignedTo: 'Lê Hoàng Dũng',
    notes: 'Thay dầu Castrol Magnatec 5W-30, kiểm tra cân bằng động',
    result: 'Xe hoạt động trơn tru, áp suất lốp 2.3 bar chuẩn',
    completedAt: '2026-08-10T16:00',
    nextTargetKm: 35000,
    nextTargetDate: '2026-11-10'
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-09T08:15',
    action: 'Bàn giao xe',
    actor: 'Trần Thị Thu Thảo',
    details: 'Đã giao xe Honda Vision (43K1-825.90) cho khách Ngô Thanh Hương theo hợp đồng HD-2026-003',
    type: 'contract'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-08T20:30',
    action: 'Nhận trả xe',
    actor: 'Nguyễn Văn Minh',
    details: 'Nhận trả xe Hyundai Accent (43A-491.52) từ anh Bùi Đức Trọng, chuyển sang trạng thái Chờ quyết toán',
    type: 'contract'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-08T10:10',
    action: 'Bàn giao xe',
    actor: 'Trần Thị Thu Thảo',
    details: 'Đã giao xe Honda Air Blade (43E1-714.88) cho khách Võ Thị Minh Châu',
    type: 'contract'
  },
  {
    id: 'log-4',
    timestamp: '2026-10-08T09:15',
    action: 'Bàn giao xe',
    actor: 'Trần Thị Thu Thảo',
    details: 'Đã giao xe Mitsubishi Xpander (43A-629.41) cho anh Hoàng Anh Tuấn tại sân bay Đà Nẵng',
    type: 'contract'
  },
  {
    id: 'log-5',
    timestamp: '2026-10-07T14:15',
    action: 'Quyết toán hợp đồng',
    actor: 'Trần Thị Thu Thảo',
    details: 'Đã hoàn tất quyết toán hợp đồng HD-2026-006, hoàn trả tiền cọc 1.000.000 đ cho khách Phạm Kiều Oanh',
    type: 'payment'
  },
  {
    id: 'log-6',
    timestamp: '2026-10-07T09:00',
    action: 'Bắt đầu bảo dưỡng',
    actor: 'Lê Hoàng Dũng',
    details: 'Đưa xe Yamaha Sirius Fi (43H1-523.66) vào xưởng để thay nhông sên dĩa và thay nhớt',
    type: 'maintenance'
  }
];
