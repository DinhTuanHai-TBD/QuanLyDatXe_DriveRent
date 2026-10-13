export type VehicleType = 'motorbike' | 'car';

export type VehicleStatus = 'available' | 'rented' | 'maintenance';

export type ContractStatus = 
  | 'draft'               // Nháp
  | 'confirmed'           // Đã xác nhận
  | 'rented'              // Đang thuê
  | 'pending_settlement'  // Chờ quyết toán
  | 'completed'           // Hoàn tất
  | 'cancelled';          // Đã hủy

export type PricingType = 'hourly' | 'daily';

export type UserRole = 'admin' | 'staff' | 'technician';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  phone: string;
  avatar?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  type: VehicleType;
  category: string;
  status: VehicleStatus;
  hourlyPrice: number;
  dailyPrice: number;
  currentOdometer: number; // km
  fuelLevel: number; // out of 8 (e.g. 8/8)
  image: string;
  year: number;
  color: string;
  transmission: string;
  features: string[];
  insuranceExpiry: string;
  registrationExpiry: string;
  lastMaintenanceDate: string;
  lastMaintenanceKm: number;
  nextMaintenanceDate: string;
  bodyType?: string;
  seats?: number;
  range?: string;
  luggage?: string;
  badge?: string;
  fuelType?: 'electric' | 'gasoline';
  notes?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  identityNumber: string; // CCCD
  driverLicense: string;  // GPLX
  address: string;
  city: string;
  rentalCount: number;
  rating: number; // 1-5
  notes?: string;
  idCardFrontImage?: string;
  driverLicenseImage?: string;
}

export interface SurchargeItem {
  id: string;
  reason: string;
  amount: number;
}

export interface HandoverRecord {
  actualTime: string;
  odometer: number;
  fuelLevel: number;
  accessories: string[];
  notes: string;
  photos: string[];
  performedBy: string;
}

export interface ReturnInspectionChecklist {
  body: boolean;       // Thân vỏ / dàn áo
  tires: boolean;      // Lốp xe
  lights: boolean;     // Đèn chiếu sáng / xi nhan
  mirrors: boolean;    // Gương chiếu hậu
  fuel: boolean;       // Mức nhiên liệu
  accessories: boolean;// Phụ kiện (mũ bảo hiểm, áo mưa, giấy tờ xe)
}

export interface ReturnRecord {
  actualTime: string;
  odometer: number;
  fuelLevel: number;
  checklist: ReturnInspectionChecklist;
  damageNotes: string;
  damageFee: number;
  photos: string[];
  postStatus: 'available' | 'maintenance';
  performedBy: string;
}

export interface FinalSettlement {
  actualUnitsBilled: number;
  pricingType: PricingType;
  unitRate: number;
  actualRentalFee: number;
  surchargesTotal: number;
  damageFee: number;
  discount: number;
  totalServiceFee: number; // actualRentalFee + surchargesTotal + damageFee - discount
  amountPaid: number;      // Khoản đã thanh toán trước
  depositHeld: number;     // Tiền cọc đang giữ
  depositDeducted: number; // Phần cọc khấu trừ vào tiền dịch vụ
  additionalDue: number;   // Số tiền khách phải đóng thêm
  refundAmount: number;    // Số tiền hoàn lại cho khách
  settledAt: string;
  settledBy: string;
  paymentMethod: 'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử';
}

export interface RentalContract {
  id: string; // e.g. HD-2026-001
  vehicleId: string;
  customerId: string;
  pricingType: PricingType;
  status: ContractStatus;
  startDate: string; // YYYY-MM-DDTHH:mm
  endDate: string;   // YYYY-MM-DDTHH:mm
  rate: number;
  units: number;
  baseRentalFee: number;
  deposit: number; // Tiền cọc - strictly isolated
  discount: number;
  surcharges: SurchargeItem[];
  totalServiceFee: number;
  amountPaid: number;
  note?: string;
  handoverRecord?: HandoverRecord;
  returnRecord?: ReturnRecord;
  finalSettlement?: FinalSettlement;
  createdAt: string;
  createdBy: string;
}

export type MaintenanceStatus = 'upcoming' | 'overdue' | 'in_progress' | 'completed';

export type BookingStatus =
  | 'pending_payment'       // Chờ thanh toán
  | 'verifying_payment'     // Đang kiểm tra thanh toán
  | 'confirmed'             // Đã xác nhận
  | 'expired'               // Hết hạn (sau 10 phút giữ chỗ)
  | 'cancelled'             // Đã hủy
  | 'refund_pending'        // Chờ hoàn cọc
  | 'refunded';             // Đã hoàn cọc

export interface OnlineBooking {
  id: string; // e.g. BK-2026-8812
  vehicleId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation: string;
  startDate: string; // ISO datetime
  endDate: string;   // ISO datetime
  pricingType: PricingType;
  units: number;
  rate: number;
  rentalFee: number;
  deliveryFee: number;
  totalEstimatedAmount: number;
  bookingDepositRequired: number; // e.g. 20%
  bookingDepositPaid: number;
  remainingAmountDue: number; // to pay upon receiving car
  securityDepositOnPickup: number; // 5tr hoặc 1tr (trình bày riêng)
  status: BookingStatus;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  expiresAt: string; // ISO datetime (10 minutes from creation)
  verifiedAt?: string;
  contractId?: string; // synced contract ID
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string;
  title: string;
  type: 'Bảo dưỡng định kỳ' | 'Sửa chữa hỏng hóc' | 'Thay dầu nhớt & lọc' | 'Thay lốp & má phanh';
  status: MaintenanceStatus;
  dueDate: string;
  dueKm: number;
  cost: number;
  assignedTo: string;
  notes: string;
  result?: string;
  completedAt?: string;
  nextTargetKm?: number;
  nextTargetDate?: string;
}

export interface StoreSettings {
  storeName: string;
  brandTitle: string;
  address: string;
  hotline: string;
  email: string;
  city: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  bufferHours: number; // Giờ kiểm tra/dọn xe giữa 2 lượt
  hourlyOverdueRateCar: number;
  hourlyOverdueRateBike: number;
  maintenanceKmThreshold: number;
  maintenanceDaysThreshold: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  type: 'contract' | 'vehicle' | 'maintenance' | 'payment' | 'system';
}

export type ActiveTab = 
  | 'dashboard' 
  | 'fleet' 
  | 'schedule' 
  | 'contracts' 
  | 'customers' 
  | 'maintenance' 
  | 'finance' 
  | 'settings';

export type CustomerTab =
  | 'home'
  | 'about'
  | 'vehicles'
  | 'vehicle_detail'
  | 'guide'
  | 'lookup'
  | 'contact';

export type AppMode = 'customer' | 'admin';
