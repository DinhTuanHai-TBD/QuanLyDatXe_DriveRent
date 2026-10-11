import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Lock, User, ArrowRight, X, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    setAppMode,
    login,
    users,
    currentUser,
    isLoggedIn,
    showToast
  } = useApp();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminLoginModalOpen) return null;

  const handleClose = () => {
    setIsAdminLoginModalOpen(false);
    setErrorMessage('');
  };

  const handleDirectAccess = () => {
    // If already logged in, switch directly to admin mode
    setAppMode('admin');
    setIsAdminLoginModalOpen(false);
    showToast(`Đã chuyển sang Không gian Quản trị viên (${currentUser.name})`, 'info');
  };

  const handleQuickLogin = (demoUsername: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      const ok = login(demoUsername, '123456');
      setIsLoading(false);
      if (ok) {
        setAppMode('admin');
        setIsAdminLoginModalOpen(false);
      }
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      setIsLoading(false);
      if (ok) {
        setAppMode('admin');
        setIsAdminLoginModalOpen(false);
      } else {
        setErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Đăng nhập Trang quản trị</h3>
              <p className="text-[11px] text-slate-500">Dành cho chủ cửa hàng & nhân viên DriveRent</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-blue-900">Phiên làm việc hiện tại: {currentUser.name}</p>
              <p className="text-blue-700 text-[11px]">{currentUser.roleTitle}</p>
            </div>
            <button
              onClick={handleDirectAccess}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 shadow-2xs"
            >
              Mở ngay
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="VD: admin, sales, tech"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập vào Hệ thống quản trị'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Switch */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Tài khoản mẫu thử nghiệm
            </span>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
              Bấm vào để vào ngay
            </span>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs flex items-center justify-between transition-colors"
            >
              <div>
                <p className="font-bold text-slate-900">Chủ cửa hàng (Admin)</p>
                <p className="text-[10px] text-slate-500">Tài khoản: admin · Toàn quyền quản lý & báo cáo</p>
              </div>
              <span className="text-xs font-bold text-blue-600">Đăng nhập</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('sales')}
              className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs flex items-center justify-between transition-colors"
            >
              <div>
                <p className="font-bold text-slate-900">Nhân viên cho thuê (Sales)</p>
                <p className="text-[10px] text-slate-500">Tài khoản: sales · Lập hợp đồng & giao nhận xe</p>
              </div>
              <span className="text-xs font-bold text-blue-600">Đăng nhập</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
