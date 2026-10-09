import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Store,
  DollarSign,
  Wrench,
  ShieldCheck,
  History,
  Save,
  RotateCcw,
  Check,
  UserCheck
} from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, users, activityLogs, resetToSampleData } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'store' | 'pricing' | 'maintenance' | 'roles' | 'logs'>('store');

  // Form states
  const [storeName, setStoreName] = useState(settings.storeName);
  const [address, setAddress] = useState(settings.address);
  const [hotline, setHotline] = useState(settings.hotline);
  const [email, setEmail] = useState(settings.email);
  const [city, setCity] = useState(settings.city);
  const [bankName, setBankName] = useState(settings.bankName);
  const [bankAccount, setBankAccount] = useState(settings.bankAccount);
  const [bankAccountName, setBankAccountName] = useState(settings.bankAccountName);

  const [bufferHours, setBufferHours] = useState(settings.bufferHours);
  const [hourlyOverdueRateCar, setHourlyOverdueRateCar] = useState(settings.hourlyOverdueRateCar);
  const [hourlyOverdueRateBike, setHourlyOverdueRateBike] = useState(settings.hourlyOverdueRateBike);

  const [maintenanceKmThreshold, setMaintenanceKmThreshold] = useState(settings.maintenanceKmThreshold);
  const [maintenanceDaysThreshold, setMaintenanceDaysThreshold] = useState(settings.maintenanceDaysThreshold);

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      address,
      hotline,
      email,
      city,
      bankName,
      bankAccount,
      bankAccountName
    });
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      bufferHours,
      hourlyOverdueRateCar,
      hourlyOverdueRateBike
    });
  };

  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      maintenanceKmThreshold,
      maintenanceDaysThreshold
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cài đặt hệ thống</h2>
          <p className="text-sm text-slate-500">
            Cấu hình thông tin cửa hàng, quy tắc phụ phí, ngưỡng bảo dưỡng và phân quyền
          </p>
        </div>

        <button
          onClick={resetToSampleData}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-2xs text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
          <span>Đặt lại dữ liệu mẫu gốc</span>
        </button>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('store')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeSubTab === 'store' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Thông tin cửa hàng
        </button>
        <button
          onClick={() => setActiveSubTab('pricing')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeSubTab === 'pricing' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bảng giá & Phụ phí
        </button>
        <button
          onClick={() => setActiveSubTab('maintenance')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeSubTab === 'maintenance' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Ngưỡng nhắc bảo trì
        </button>
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeSubTab === 'roles' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tài khoản & Phân quyền
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeSubTab === 'logs' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Nhật ký thao tác ({activityLogs.length})
        </button>
      </div>

      {/* Subtab 1: Store Information */}
      {activeSubTab === 'store' && (
        <form onSubmit={handleSaveStore} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Hồ sơ cửa hàng dịch vụ cho thuê
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Tên cửa hàng *</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Địa chỉ văn phòng / bãi giữ xe *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hotline liên hệ *</label>
              <input
                type="text"
                required
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Thành phố du lịch</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider pt-3 pb-1 border-b border-slate-100">
            Tài khoản ngân hàng nhận tiền cọc & thanh toán
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngân hàng</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Số tài khoản</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên chủ tài khoản</label>
              <input
                type="text"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs uppercase"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thông tin cửa hàng</span>
            </button>
          </div>
        </form>
      )}

      {/* Subtab 2: Pricing & Policies */}
      {activeSubTab === 'pricing' && (
        <form onSubmit={handleSavePricing} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Quy định cước phí & Giờ đệm
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Thời gian kiểm tra & vệ sinh giữa hai lượt thuê (Giờ đệm):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={bufferHours}
                  onChange={(e) => setBufferHours(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
                <span className="text-slate-500 font-medium">giờ (giúp xe được rửa và kiểm tra trước lượt kế tiếp)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Phí trễ hạn xe ô tô (/giờ):
                </label>
                <input
                  type="number"
                  step="10000"
                  value={hourlyOverdueRateCar}
                  onChange={(e) => setHourlyOverdueRateCar(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold text-blue-700"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Phí trễ hạn xe máy (/giờ):
                </label>
                <input
                  type="number"
                  step="5000"
                  value={hourlyOverdueRateBike}
                  onChange={(e) => setHourlyOverdueRateBike(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold text-blue-700"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Cập nhật bảng giá & quy định</span>
            </button>
          </div>
        </form>
      )}

      {/* Subtab 3: Maintenance Thresholds */}
      {activeSubTab === 'maintenance' && (
        <form onSubmit={handleSaveMaintenance} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Ngưỡng nhắc bảo trì kỹ thuật
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ngưỡng km nhắc thay dầu / bảo dưỡng định kỳ:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="500"
                  value={maintenanceKmThreshold}
                  onChange={(e) => setMaintenanceKmThreshold(Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
                <span className="text-slate-500 font-medium">km (kể từ lần bảo dưỡng gần nhất)</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ngưỡng số ngày nhắc bảo dưỡng định kỳ:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="10"
                  value={maintenanceDaysThreshold}
                  onChange={(e) => setMaintenanceDaysThreshold(Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
                <span className="text-slate-500 font-medium">ngày (điều kiện ngày hoặc km đạt trước)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu cấu hình bảo trì</span>
            </button>
          </div>
        </form>
      )}

      {/* Subtab 4: Accounts and Role Matrix */}
      {activeSubTab === 'roles' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Danh sách tài khoản & Bảng phân quyền nghiệp vụ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {users.map((u) => (
              <div key={u.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{u.name}</h4>
                    <span className="text-[11px] font-semibold text-blue-700">{u.roleTitle}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-slate-600 text-[11px]">
                  <p>• Tên đăng nhập: <strong className="font-mono">{u.username}</strong></p>
                  <p>• Số điện thoại: <strong>{u.phone}</strong></p>
                  <p>
                    • Quyền hạn:{' '}
                    {u.role === 'admin'
                      ? 'Toàn quyền (Quản trị, xem tài chính, xóa sửa, xem CCCD)'
                      : u.role === 'staff'
                      ? 'Tạo hợp đồng, giao nhận xe, quyết toán, xem CCCD'
                      : 'Bảo trì, sửa chữa, xem hiện trạng kỹ thuật xe'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 5: Activity Logs */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Nhật ký hoạt động hệ thống (Audit Trail)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Ghi lại toàn bộ hành động người dùng</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs max-h-96 overflow-y-auto">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="font-semibold text-blue-600">bởi {log.actor}</span>
                  </div>
                  <p className="text-slate-600 text-xs">{log.details}</p>
                </div>
                <span className="font-mono text-slate-400 text-[11px] shrink-0">
                  {formatDateTime(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
