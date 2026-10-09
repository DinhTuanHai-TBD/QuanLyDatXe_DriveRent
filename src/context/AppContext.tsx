import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle,
  Customer,
  RentalContract,
  MaintenanceTask,
  StoreSettings,
  User,
  ActivityLog,
  ActiveTab,
  HandoverRecord,
  ReturnRecord,
  FinalSettlement
} from '../types';
import {
  initialVehicles,
  initialCustomers,
  initialContracts,
  initialMaintenanceTasks,
  initialStoreSettings,
  initialUsers,
  initialActivityLogs
} from '../data/initialData';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  currentUser: User;
  isLoggedIn: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  vehicles: Vehicle[];
  customers: Customer[];
  contracts: RentalContract[];
  maintenanceTasks: MaintenanceTask[];
  settings: StoreSettings;
  activityLogs: ActivityLog[];
  toasts: ToastNotification[];
  users: User[];

  // Modal & Selection States
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  selectedContractId: string | null;
  setSelectedContractId: (id: string | null) => void;
  isCreateContractOpen: boolean;
  setIsCreateContractOpen: (open: boolean) => void;
  isHandoverModalOpen: boolean;
  setIsHandoverModalOpen: (open: boolean) => void;
  isReturnModalOpen: boolean;
  setIsReturnModalOpen: (open: boolean) => void;
  isSettlementModalOpen: boolean;
  setIsSettlementModalOpen: (open: boolean) => void;
  isPrintContractOpen: boolean;
  setIsPrintContractOpen: (open: boolean) => void;
  isAddVehicleOpen: boolean;
  setIsAddVehicleOpen: (open: boolean) => void;
  isMaintenanceModalOpen: boolean;
  setIsMaintenanceModalOpen: (open: boolean) => void;
  activeContractForAction: RentalContract | null;
  setActiveContractForAction: (contract: RentalContract | null) => void;

  // Actions
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  resetToSampleData: () => void;

  // Vehicle operations
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;

  // Customer operations
  addCustomer: (customer: Omit<Customer, 'id' | 'rentalCount' | 'rating'>) => Customer;

  // Contract operations
  createContract: (contract: Omit<RentalContract, 'id' | 'createdAt' | 'createdBy'>) => RentalContract | null;
  handoverVehicle: (contractId: string, record: HandoverRecord) => boolean;
  returnVehicle: (contractId: string, record: ReturnRecord) => boolean;
  settleContract: (contractId: string, settlement: FinalSettlement) => boolean;
  cancelContract: (contractId: string, reason: string) => boolean;
  extendContract: (contractId: string, newEndDate: string, extraUnits: number, extraFee: number) => boolean;

  // Maintenance operations
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id'>) => MaintenanceTask;
  startMaintenance: (taskId: string) => boolean;
  completeMaintenance: (
    taskId: string,
    result: string,
    cost: number,
    nextKm: number,
    nextDate: string
  ) => boolean;

  // Settings
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Helpers
  checkVehicleAvailability: (
    vehicleId: string,
    startDate: string,
    endDate: string,
    excludeContractId?: string
  ) => { available: boolean; conflictReason?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'driverent_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or defaults
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : initialUsers[0];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}vehicles`);
    return saved ? JSON.parse(saved) : initialVehicles;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}customers`);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [contracts, setContracts] = useState<RentalContract[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}contracts`);
    return saved ? JSON.parse(saved) : initialContracts;
  });

  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}maintenance`);
    return saved ? JSON.parse(saved) : initialMaintenanceTasks;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
    return saved ? JSON.parse(saved) : initialStoreSettings;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}logs`);
    return saved ? JSON.parse(saved) : initialActivityLogs;
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modal states
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isCreateContractOpen, setIsCreateContractOpen] = useState(false);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isPrintContractOpen, setIsPrintContractOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [activeContractForAction, setActiveContractForAction] = useState<RentalContract | null>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}vehicles`, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}customers`, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}contracts`, JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}maintenance`, JSON.stringify(maintenanceTasks));
  }, [maintenanceTasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}logs`, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addLog = (action: string, details: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      actor: currentUser.name,
      details,
      type
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Auth
  const login = (username: string, pass: string): boolean => {
    const matched = initialUsers.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (matched && pass.length >= 4) {
      setCurrentUser(matched);
      setIsLoggedIn(true);
      showToast(`Đăng nhập thành công! Chào mừng ${matched.name}`, 'success');
      addLog('Đăng nhập', `Tài khoản ${matched.name} (${matched.roleTitle}) đã đăng nhập hệ thống`, 'system');
      return true;
    }
    showToast('Tên đăng nhập hoặc mật khẩu không chính xác. Thử lại hoặc dùng tài khoản mẫu.', 'error');
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Đã đăng xuất khỏi phiên làm việc', 'info');
  };

  const switchUser = (userId: string) => {
    const user = initialUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Đã chuyển sang vai trò: ${user.name} (${user.roleTitle})`, 'info');
    }
  };

  const resetToSampleData = () => {
    setVehicles(initialVehicles);
    setCustomers(initialCustomers);
    setContracts(initialContracts);
    setMaintenanceTasks(initialMaintenanceTasks);
    setSettings(initialStoreSettings);
    setActivityLogs(initialActivityLogs);
    showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!', 'success');
  };

  // Vehicle Availability check
  const checkVehicleAvailability = (
    vehicleId: string,
    startDate: string,
    endDate: string,
    excludeContractId?: string
  ): { available: boolean; conflictReason?: string } => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) {
      return { available: false, conflictReason: 'Không tìm thấy xe' };
    }

    if (vehicle.status === 'maintenance') {
      return { available: false, conflictReason: `Xe ${vehicle.name} hiện đang ở trong xưởng bảo dưỡng.` };
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end) || end <= start) {
      return { available: false, conflictReason: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu.' };
    }

    // Check conflict against existing active contracts
    const conflictingContract = contracts.find((c) => {
      if (c.id === excludeContractId) return false;
      if (c.vehicleId !== vehicleId) return false;
      if (c.status === 'cancelled' || c.status === 'completed') return false;

      const cStart = new Date(c.startDate).getTime();
      const cEnd = new Date(c.endDate).getTime();

      // Check overlap
      return (start < cEnd && end > cStart);
    });

    if (conflictingContract) {
      return {
        available: false,
        conflictReason: `Xe đã có lịch thuê trong khoảng này (Hợp đồng ${conflictingContract.id}: ${new Date(conflictingContract.startDate).toLocaleDateString('vi-VN')} - ${new Date(conflictingContract.endDate).toLocaleDateString('vi-VN')})`
      };
    }

    // Check maintenance tasks overlap
    const maintenanceTask = maintenanceTasks.find((m) => {
      if (m.vehicleId !== vehicleId) return false;
      if (m.status === 'completed') return false;
      const dueTime = new Date(m.dueDate).getTime();
      return (start <= dueTime && end >= dueTime);
    });

    if (maintenanceTask) {
      return {
        available: false,
        conflictReason: `Xe có lịch bảo trì định kỳ vào ngày ${new Date(maintenanceTask.dueDate).toLocaleDateString('vi-VN')} (${maintenanceTask.title})`
      };
    }

    return { available: true };
  };

  // Vehicle operations
  const addVehicle = (data: Omit<Vehicle, 'id'>): Vehicle => {
    const id = `V-${String(vehicles.length + 1).padStart(2, '0')}`;
    const newVehicle: Vehicle = { ...data, id };
    setVehicles((prev) => [newVehicle, ...prev]);
    showToast(`Đã thêm xe mới: ${newVehicle.name} (${newVehicle.plateNumber})`, 'success');
    addLog('Thêm xe mới', `Thêm xe ${newVehicle.name} - Biển số ${newVehicle.plateNumber}`, 'vehicle');
    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    showToast('Đã cập nhật thông tin xe thành công', 'success');
    addLog('Cập nhật xe', `Cập nhật thông tin xe mã ${id}`, 'vehicle');
  };

  // Customer operations
  const addCustomer = (data: Omit<Customer, 'id' | 'rentalCount' | 'rating'>): Customer => {
    const id = `CUST-${String(customers.length + 1).padStart(2, '0')}`;
    const newCust: Customer = {
      ...data,
      id,
      rentalCount: 0,
      rating: 5
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Đã thêm hồ sơ khách hàng: ${newCust.fullName}`, 'success');
    addLog('Thêm khách hàng', `Thêm khách hàng mới ${newCust.fullName} (${newCust.phone})`, 'system');
    return newCust;
  };

  // Contract operations
  const createContract = (data: Omit<RentalContract, 'id' | 'createdAt' | 'createdBy'>): RentalContract | null => {
    // Conflict check
    const availability = checkVehicleAvailability(data.vehicleId, data.startDate, data.endDate);
    if (!availability.available) {
      showToast(availability.conflictReason || 'Xe không khả dụng trong khoảng thời gian này!', 'error');
      return null;
    }

    const nextIndex = contracts.length + 1;
    const contractId = `HD-2026-${String(nextIndex).padStart(3, '0')}`;
    const newContract: RentalContract = {
      ...data,
      id: contractId,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name
    };

    setContracts((prev) => [newContract, ...prev]);

    // If created directly in confirmed or rented, update vehicle
    if (newContract.status === 'rented') {
      setVehicles((prev) => prev.map((v) => (v.id === newContract.vehicleId ? { ...v, status: 'rented' } : v)));
    }

    // Update customer rental count
    setCustomers((prev) =>
      prev.map((c) => (c.id === newContract.customerId ? { ...c, rentalCount: c.rentalCount + 1 } : c))
    );

    showToast(`Đã tạo hợp đồng ${contractId} thành công!`, 'success');
    addLog(
      'Tạo hợp đồng',
      `Tạo mới hợp đồng ${contractId} cho xe ${vehicles.find((v) => v.id === data.vehicleId)?.name || data.vehicleId}`,
      'contract'
    );
    return newContract;
  };

  const handoverVehicle = (contractId: string, record: HandoverRecord): boolean => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) {
      showToast('Không tìm thấy hợp đồng', 'error');
      return false;
    }

    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: 'rented',
              handoverRecord: record
            }
          : c
      )
    );

    // Update vehicle status & odometer & fuel
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === contract.vehicleId
          ? {
              ...v,
              status: 'rented',
              currentOdometer: record.odometer,
              fuelLevel: record.fuelLevel
            }
          : v
      )
    );

    showToast(`Bàn giao xe thành công cho hợp đồng ${contractId}! Trạng thái xe: Đang cho thuê`, 'success');
    addLog(
      'Bàn giao xe',
      `Giao xe ${vehicles.find((v) => v.id === contract.vehicleId)?.name} (Odo: ${record.odometer.toLocaleString('vi-VN')} km)`,
      'contract'
    );
    return true;
  };

  const returnVehicle = (contractId: string, record: ReturnRecord): boolean => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) {
      showToast('Không tìm thấy hợp đồng', 'error');
      return false;
    }

    // Check odo constraint
    const startOdo = contract.handoverRecord?.odometer || 0;
    if (record.odometer < startOdo) {
      showToast(`Số km khi nhận xe (${record.odometer}) không được nhỏ hơn lúc giao (${startOdo})!`, 'error');
      return false;
    }

    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: 'pending_settlement',
              returnRecord: record
            }
          : c
      )
    );

    // Update vehicle odo & fuel
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === contract.vehicleId
          ? {
              ...v,
              currentOdometer: record.odometer,
              fuelLevel: record.fuelLevel,
              // Post status is finalized on settlement or inspection
              status: record.postStatus === 'maintenance' ? 'maintenance' : 'available'
            }
          : v
      )
    );

    showToast(`Đã hoàn tất nhận trả xe cho hợp đồng ${contractId}! Chuyển sang Chờ quyết toán`, 'success');
    addLog(
      'Nhận trả xe',
      `Nhận lại xe hợp đồng ${contractId} (Odo mới: ${record.odometer.toLocaleString('vi-VN')} km)`,
      'contract'
    );
    return true;
  };

  const settleContract = (contractId: string, settlement: FinalSettlement): boolean => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) {
      showToast('Không tìm thấy hợp đồng', 'error');
      return false;
    }

    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: 'completed',
              finalSettlement: settlement
            }
          : c
      )
    );

    // Free vehicle back to available if not maintenance
    const postStatus = contract.returnRecord?.postStatus || 'available';
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === contract.vehicleId
          ? {
              ...v,
              status: postStatus === 'maintenance' ? 'maintenance' : 'available'
            }
          : v
      )
    );

    showToast(`Quyết toán hợp đồng ${contractId} thành công! Hợp đồng đã hoàn tất.`, 'success');
    addLog(
      'Quyết toán hợp đồng',
      `Quyết toán ${contractId}: Tiền dịch vụ ${settlement.totalServiceFee.toLocaleString('vi-VN')} đ, Cọc hoàn trả: ${settlement.refundAmount.toLocaleString('vi-VN')} đ`,
      'payment'
    );
    return true;
  };

  const cancelContract = (contractId: string, reason: string): boolean => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) {
      showToast('Không tìm thấy hợp đồng', 'error');
      return false;
    }

    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: 'cancelled',
              note: `${c.note || ''} [Đã hủy: ${reason}]`
            }
          : c
      )
    );

    // If vehicle was held or rented, set back to available
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === contract.vehicleId && v.status === 'rented'
          ? { ...v, status: 'available' }
          : v
      )
    );

    showToast(`Đã hủy hợp đồng ${contractId}!`, 'info');
    addLog('Hủy hợp đồng', `Hủy hợp đồng ${contractId}. Lý do: ${reason}`, 'contract');
    return true;
  };

  const extendContract = (
    contractId: string,
    newEndDate: string,
    extraUnits: number,
    extraFee: number
  ): boolean => {
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) {
      showToast('Không tìm thấy hợp đồng', 'error');
      return false;
    }

    // Check conflict
    const availability = checkVehicleAvailability(contract.vehicleId, contract.endDate, newEndDate, contractId);
    if (!availability.available) {
      showToast(`Không thể gia hạn: ${availability.conflictReason}`, 'error');
      return false;
    }

    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              endDate: newEndDate,
              units: c.units + extraUnits,
              baseRentalFee: c.baseRentalFee + extraFee,
              totalServiceFee: c.totalServiceFee + extraFee
            }
          : c
      )
    );

    showToast(`Đã gia hạn hợp đồng ${contractId} đến ${new Date(newEndDate).toLocaleString('vi-VN')}`, 'success');
    addLog('Gia hạn hợp đồng', `Gia hạn ${contractId} thêm ${extraUnits} đơn vị (Phí thêm: ${extraFee.toLocaleString('vi-VN')} đ)`, 'contract');
    return true;
  };

  // Maintenance operations
  const addMaintenanceTask = (data: Omit<MaintenanceTask, 'id'>): MaintenanceTask => {
    const id = `MAINT-${String(maintenanceTasks.length + 1).padStart(2, '0')}`;
    const newTask: MaintenanceTask = { ...data, id };
    setMaintenanceTasks((prev) => [newTask, ...prev]);
    showToast(`Đã lập lịch bảo trì cho xe ${vehicles.find((v) => v.id === data.vehicleId)?.name}`, 'success');
    addLog('Lập lịch bảo dưỡng', `Lập lịch bảo dưỡng ${newTask.title} cho xe mã ${data.vehicleId}`, 'maintenance');
    return newTask;
  };

  const startMaintenance = (taskId: string): boolean => {
    const task = maintenanceTasks.find((m) => m.id === taskId);
    if (!task) return false;

    const vehicle = vehicles.find((v) => v.id === task.vehicleId);
    if (vehicle?.status === 'rented') {
      showToast(`Xe ${vehicle.name} hiện đang cho khách thuê! Không thể đưa vào bảo dưỡng lúc này.`, 'error');
      return false;
    }

    setMaintenanceTasks((prev) =>
      prev.map((m) => (m.id === taskId ? { ...m, status: 'in_progress' } : m))
    );

    setVehicles((prev) =>
      prev.map((v) => (v.id === task.vehicleId ? { ...v, status: 'maintenance' } : v))
    );

    showToast(`Đã chuyển xe ${vehicle?.name} vào xưởng bảo dưỡng!`, 'info');
    addLog('Bắt đầu bảo dưỡng', `Đưa xe ${vehicle?.name} vào bảo dưỡng (${task.title})`, 'maintenance');
    return true;
  };

  const completeMaintenance = (
    taskId: string,
    result: string,
    cost: number,
    nextKm: number,
    nextDate: string
  ): boolean => {
    const task = maintenanceTasks.find((m) => m.id === taskId);
    if (!task) return false;

    setMaintenanceTasks((prev) =>
      prev.map((m) =>
        m.id === taskId
          ? {
              ...m,
              status: 'completed',
              result,
              cost,
              completedAt: new Date().toISOString(),
              nextTargetKm: nextKm,
              nextTargetDate: nextDate
            }
          : m
      )
    );

    // Update vehicle
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === task.vehicleId
          ? {
              ...v,
              status: 'available',
              lastMaintenanceDate: new Date().toISOString().split('T')[0],
              lastMaintenanceKm: v.currentOdometer,
              nextMaintenanceDate: nextDate,
              nextMaintenanceKm: nextKm
            }
          : v
      )
    );

    showToast(`Bảo dưỡng hoàn thành! Xe đã sẵn sàng phục vụ khách hàng.`, 'success');
    addLog(
      'Hoàn thành bảo dưỡng',
      `Hoàn tất bảo dưỡng xe mã ${task.vehicleId} (Chi phí: ${cost.toLocaleString('vi-VN')} đ)`,
      'maintenance'
    );
    return true;
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Đã lưu cấu hình cửa hàng thành công!', 'success');
    addLog('Cài đặt hệ thống', 'Cập nhật cấu hình cửa hàng & bảng giá', 'system');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        activeTab,
        setActiveTab,
        vehicles,
        customers,
        contracts,
        maintenanceTasks,
        settings,
        activityLogs,
        toasts,
        users: initialUsers,

        selectedVehicleId,
        setSelectedVehicleId,
        selectedContractId,
        setSelectedContractId,
        isCreateContractOpen,
        setIsCreateContractOpen,
        isHandoverModalOpen,
        setIsHandoverModalOpen,
        isReturnModalOpen,
        setIsReturnModalOpen,
        isSettlementModalOpen,
        setIsSettlementModalOpen,
        isPrintContractOpen,
        setIsPrintContractOpen,
        isAddVehicleOpen,
        setIsAddVehicleOpen,
        isMaintenanceModalOpen,
        setIsMaintenanceModalOpen,
        activeContractForAction,
        setActiveContractForAction,

        login,
        logout,
        switchUser,
        showToast,
        removeToast,
        resetToSampleData,

        addVehicle,
        updateVehicle,
        addCustomer,
        createContract,
        handoverVehicle,
        returnVehicle,
        settleContract,
        cancelContract,
        extendContract,
        addMaintenanceTask,
        startMaintenance,
        completeMaintenance,
        updateSettings,
        checkVehicleAvailability
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
