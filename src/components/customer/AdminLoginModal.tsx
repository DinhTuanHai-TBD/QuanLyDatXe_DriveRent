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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-3xl rounded-3xl max-w-md w-full border border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,1)] p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Đăng nhập Trang quản trị</h3>
              <p className="text-[11px] text-slate-500">Dành cho chủ cửa hàng & nhân viên DriveRent</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md rounded-2xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-emerald-950">Phiên làm việc: {currentUser.name}</p>
              <p className="text-emerald-700 text-[11px]">{currentUser.roleTitle}</p>
            </div>
            <button
              onClick={handleDirectAccess}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Mở ngay
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="VD: admin, sales, tech"
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200/80 rounded-xl bg-white/70 focus:bg-white focus:border-emerald-500 focus:outline-hidden text-xs shadow-2xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200/80 rounded-xl bg-white/70 focus:bg-white focus:border-emerald-500 focus:outline-hidden text-xs shadow-2xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập vào Hệ thống quản trị'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Switch */}
        <div className="pt-3 border-t border-slate-200/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Tài khoản mẫu thử nghiệm
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Bấm vào để vào ngay
            </span>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 bg-white/70 hover:border-emerald-500/40 hover:bg-emerald-50/50 text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs"
            >
              <div>
                <p className="font-bold text-slate-900">Chủ cửa hàng (Admin)</p>
                <p className="text-[10px] text-slate-500">Tài khoản: admin · Toàn quyền quản lý & báo cáo</p>
              </div>
              <span className="text-xs font-bold text-emerald-700">Đăng nhập</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('sales')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200/80 bg-white/70 hover:border-emerald-500/40 hover:bg-emerald-50/50 text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs"
            >
              <div>
                <p className="font-bold text-slate-900">Nhân viên cho thuê (Sales)</p>
                <p className="text-[10px] text-slate-500">Tài khoản: sales · Lập hợp đồng & giao nhận xe</p>
              </div>
              <span className="text-xs font-bold text-emerald-700">Đăng nhập</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
