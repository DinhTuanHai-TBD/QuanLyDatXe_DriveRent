import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Car, Lock, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, users } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

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
      if (!ok) {
        setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
    }, 300);
  };

  const handleQuickLogin = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword('123456');
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      login(demoUsername, '123456');
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-3">
          <Car className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">DriveRent</h2>
        <p className="mt-1 text-sm text-slate-600 font-medium">
          Hệ thống Quản lý Dịch vụ Cho thuê Xe máy & Ô tô Tự lái
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: admin, sales, tech"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu (tối thiểu 4 ký tự)"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-xs"
            >
              {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Experience / Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tài khoản mẫu thử nghiệm
              </span>
              <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Bản dùng thử
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">Chủ cửa hàng (Admin)</p>
                  <p className="text-[11px] text-slate-500">Tài khoản: admin · Toàn quyền quản trị</p>
                </div>
                <span className="text-xs font-semibold text-blue-600">Chọn</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sales')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">Nhân viên cho thuê (Sales/Staff)</p>
                  <p className="text-[11px] text-slate-500">Tài khoản: sales · Lập hợp đồng, giao nhận xe</p>
                </div>
                <span className="text-xs font-semibold text-blue-600">Chọn</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('tech')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">Kỹ thuật viên bảo trì (Technician)</p>
                  <p className="text-[11px] text-slate-500">Tài khoản: tech · Kiểm tra xe, sửa chữa định kỳ</p>
                </div>
                <span className="text-xs font-semibold text-blue-600">Chọn</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Trải nghiệm ngay không cần nhập</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
