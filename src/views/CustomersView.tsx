import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  ShieldCheck,
  Lock,
  Eye,
  X,
  FileText,
  Star,
  MapPin,
  Car
} from 'lucide-react';
import { formatVND, formatDate } from '../utils/formatters';

export const CustomersView: React.FC = () => {
  const { customers, contracts, vehicles, currentUser, addCustomer, setSelectedContractId, setActiveTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustId, setSelectedCustId] = useState<string | null>(null);

  // New customer modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [license, setLicense] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Permission check: only admin and staff can view full CCCD/driver license image
  const canViewSensitiveDocs = currentUser.role === 'admin' || currentUser.role === 'staff';

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return c.fullName.toLowerCase().includes(term) || c.phone.includes(term) || c.identityNumber.includes(term);
  });

  const selectedCust = customers.find((c) => c.id === selectedCustId);
  const customerContracts = selectedCust
    ? contracts.filter((c) => c.customerId === selectedCust.id)
    : [];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addCustomer({
      fullName: name.trim(),
      phone: phone.trim(),
      identityNumber: idNumber.trim() || 'Chưa cập nhật',
      driverLicense: license.trim() || 'Chưa cập nhật',
      address: address.trim() || 'Nha Trang',
      city: 'Nha Trang',
      notes
    });

    setIsAddOpen(false);
    setName('');
    setPhone('');
    setIdNumber('');
    setLicense('');
    setAddress('');
    setNotes('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hồ sơ khách hàng</h2>
          <p className="text-sm text-slate-500">
            Quản lý thông tin liên hệ, giấy tờ xác thực và lịch sử thuê xe tại Nha Trang
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-sm text-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên khách hàng hoặc số điện thoại (VD: Tuấn, 0912...)"
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const custRentals = contracts.filter((c) => c.customerId === cust.id);
          return (
            <div
              key={cust.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                      {cust.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{cust.fullName}</h3>
                      <p className="text-xs text-blue-600 font-mono font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {cust.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{cust.rating}.0</span>
                  </div>
                </div>

                <div className="mt-3 text-xs space-y-1 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p className="truncate">
                    <span className="text-slate-400">CCCD:</span>{' '}
                    <strong className="font-mono text-slate-800">
                      {canViewSensitiveDocs ? cust.identityNumber : '••••••••' + cust.identityNumber.slice(-4)}
                    </strong>
                  </p>
                  <p className="truncate">
                    <span className="text-slate-400">GPLX:</span>{' '}
                    <strong className="font-mono text-slate-800">
                      {canViewSensitiveDocs ? cust.driverLicense : 'Đã xác minh (Ẩn)'}
                    </strong>
                  </p>
                  <p className="truncate">
                    <span className="text-slate-400">Nơi ở:</span> {cust.address}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Đã thuê: <strong className="text-blue-700 font-bold">{custRentals.length} lượt</strong>
                </span>
                <button
                  onClick={() => setSelectedCustId(cust.id)}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem hồ sơ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Detail Drawer */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                  {selectedCust.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedCust.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedCust.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Documents (Role controlled!) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Giấy tờ tùy thân & Bằng lái xe
                </h4>
                {!canViewSensitiveDocs && (
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Chỉ người có quyền (Admin / Staff) được xem ảnh gốc
                  </span>
                )}
              </div>

              {canViewSensitiveDocs ? (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700">Mô phỏng CCCD Mặt trước</span>
                    <div className="aspect-16/9 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center p-2 text-center">
                      <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                      <span className="text-[11px] font-mono font-bold">{selectedCust.identityNumber}</span>
                      <span className="text-[10px] text-slate-400">Bản ảnh minh họa hợp lệ</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700">Mô phỏng Giấy phép lái xe</span>
                    <div className="aspect-16/9 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center p-2 text-center">
                      <Car className="w-6 h-6 text-blue-600 mb-1" />
                      <span className="text-[11px] font-mono font-bold">{selectedCust.driverLicense}</span>
                      <span className="text-[10px] text-slate-400">Bản ảnh minh họa hợp lệ</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center space-y-1 text-xs text-slate-500">
                  <Lock className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700">Nội dung ảnh được mã hóa bảo mật</p>
                  <p className="text-[11px]">Tài khoản kỹ thuật viên không có thẩm quyền truy cập ảnh giấy tờ tùy thân của khách.</p>
                </div>
              )}
            </div>

            {/* Rental History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Lịch sử thuê xe ({customerContracts.length})
              </h4>
              {customerContracts.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">Khách hàng chưa có lượt thuê nào hoàn tất.</p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {customerContracts.map((c) => {
                    const veh = vehicles.find((v) => v.id === c.vehicleId);
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedContractId(c.id);
                          setSelectedCustId(null);
                          setActiveTab('contracts');
                        }}
                        className="p-3 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900">{c.id}</strong>
                            <span className="text-slate-600 font-semibold">{veh?.name}</span>
                            <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                              {veh?.plateNumber}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            {formatDate(c.startDate)} → {formatDate(c.endDate)} · {c.status}
                          </p>
                        </div>
                        <span className="font-mono font-bold text-blue-700">
                          {formatVND(c.totalServiceFee)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCustId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Thêm hồ sơ khách hàng mới</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Trần Văn Bình"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0905 678 888"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số CCCD / Hộ chiếu</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="VD: 048092004512"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Số Giấy phép lái xe (GPLX)</label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="VD: 480210089211 (Hạng B2/A1)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nơi cư trú / Khách sạn lưu trú</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="VD: Khách sạn Sheraton, 28 Trần Phú..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
                >
                  Lưu khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
