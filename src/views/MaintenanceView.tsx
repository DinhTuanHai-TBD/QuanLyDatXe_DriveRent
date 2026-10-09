import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaintenanceTask, MaintenanceStatus } from '../types';
import {
  Wrench,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Play,
  Check,
  Calendar,
  Gauge,
  User,
  DollarSign,
  X,
  FileCheck
} from 'lucide-react';
import {
  formatVND,
  formatDate,
  getMaintenanceStatusBadge,
  getVehicleStatusBadge
} from '../utils/formatters';

export const MaintenanceView: React.FC = () => {
  const {
    maintenanceTasks,
    vehicles,
    addMaintenanceTask,
    startMaintenance,
    completeMaintenance,
    currentUser,
    showToast
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | MaintenanceStatus>('all');

  // Schedule modal
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState<MaintenanceTask['type']>('Bảo dưỡng định kỳ');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [dueKm, setDueKm] = useState<number>(35000);
  const [estimatedCost, setEstimatedCost] = useState<number>(1200000);
  const [assignedTo, setAssignedTo] = useState('Lê Hoàng Dũng');
  const [taskNotes, setTaskNotes] = useState('');

  // Complete maintenance modal
  const [completingTask, setCompletingTask] = useState<MaintenanceTask | null>(null);
  const [actualCost, setActualCost] = useState<number>(0);
  const [resultNotes, setResultNotes] = useState('Đã thay mới dầu động cơ và lọc dầu chính hãng, kiểm tra áp suất 4 lốp đạt tiêu chuẩn');
  const [nextTargetKm, setNextTargetKm] = useState<number>(0);
  const [nextTargetDate, setNextTargetDate] = useState('2027-01-15');

  const filteredTasks = maintenanceTasks.filter((t) => {
    if (activeFilter !== 'all' && t.status !== activeFilter) return false;
    return true;
  });

  const handleOpenComplete = (task: MaintenanceTask) => {
    setCompletingTask(task);
    setActualCost(task.cost);
    const v = vehicles.find((veh) => veh.id === task.vehicleId);
    const currKm = v?.currentOdometer || task.dueKm;
    setNextTargetKm(currKm + (v?.type === 'car' ? 5000 : 3000));
    setResultNotes('Kiểm tra toàn diện đạt chuẩn vận hành, phụ tùng thay mới chính hãng.');
  };

  const handleConfirmComplete = () => {
    if (!completingTask) return;
    completeMaintenance(
      completingTask.id,
      resultNotes,
      actualCost,
      nextTargetKm,
      nextTargetDate
    );
    setCompletingTask(null);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedVehicleId) return;

    addMaintenanceTask({
      vehicleId: selectedVehicleId,
      title: title.trim(),
      type: taskType,
      status: 'upcoming',
      dueDate,
      dueKm,
      cost: estimatedCost,
      assignedTo,
      notes: taskNotes
    });

    setIsScheduleOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Bảo dưỡng & Sửa chữa kỹ thuật
          </h2>
          <p className="text-sm text-slate-500">
            Theo dõi hai điều kiện (ngày hoặc số km đạt trước) để bảo dưỡng xe an toàn
          </p>
        </div>

        <button
          onClick={() => setIsScheduleOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-sm text-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Lập lịch bảo trì</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs font-bold">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tất cả ({maintenanceTasks.length})
        </button>
        <button
          onClick={() => setActiveFilter('in_progress')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeFilter === 'in_progress' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đang bảo dưỡng ({maintenanceTasks.filter((t) => t.status === 'in_progress').length})
        </button>
        <button
          onClick={() => setActiveFilter('overdue')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeFilter === 'overdue' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Quá hạn ({maintenanceTasks.filter((t) => t.status === 'overdue').length})
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeFilter === 'upcoming' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sắp đến hạn ({maintenanceTasks.filter((t) => t.status === 'upcoming').length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            activeFilter === 'completed' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đã hoàn thành ({maintenanceTasks.filter((t) => t.status === 'completed').length})
        </button>
      </div>

      {/* Maintenance List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const vehicle = vehicles.find((v) => v.id === task.vehicleId);
          const badge = getMaintenanceStatusBadge(task.status);
          const isVehicleRented = vehicle?.status === 'rented';

          // Condition trigger check: odometer or date, whichever comes first
          const isKmReached = (vehicle?.currentOdometer || 0) >= task.dueKm;
          const isDateReached = new Date(task.dueDate) <= new Date();

          return (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={vehicle?.image}
                      alt={vehicle?.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {vehicle?.plateNumber}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{task.title}</h3>
                      <p className="text-xs text-slate-500">{vehicle?.name}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${badge.bg} ${badge.textCol} ${badge.border}`}
                  >
                    {badge.text}
                  </span>
                </div>

                {/* Triggers Strip */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mốc ngày hạn:</span>
                    <strong className={isDateReached && task.status !== 'completed' ? 'text-rose-600' : 'text-slate-800'}>
                      {formatDate(task.dueDate)} {isDateReached && task.status !== 'completed' && '(Đã đến hạn)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mốc km hạn:</span>
                    <strong className={isKmReached && task.status !== 'completed' ? 'text-rose-600 font-mono' : 'text-slate-800 font-mono'}>
                      {task.dueKm.toLocaleString('vi-VN')} km
                    </strong>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-2 text-xs space-y-1 text-slate-600">
                  <p>
                    <span className="text-slate-400">Hạng mục:</span> <strong>{task.type}</strong> · Phụ trách: <strong>{task.assignedTo}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">Chi phí ước tính:</span>{' '}
                    <strong className="font-mono text-slate-900">{formatVND(task.cost)}</strong>
                  </p>
                  {task.notes && <p className="text-[11px] text-slate-500 italic">Ghi chú: {task.notes}</p>}
                  {task.result && (
                    <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-1.5 rounded mt-1">
                      Kết quả: {task.result}
                    </p>
                  )}
                </div>

                {/* Warning if vehicle is currently rented */}
                {isVehicleRented && task.status === 'upcoming' && (
                  <div className="mt-2 p-2 bg-amber-50 rounded-md border border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Xe đang được khách thuê lưu hành. Sẽ đưa vào bảo dưỡng khi khách trả xe.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                {task.status === 'upcoming' && (
                  <button
                    onClick={() => startMaintenance(task.id)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Bắt đầu bảo dưỡng</span>
                  </button>
                )}

                {task.status === 'in_progress' && (
                  <button
                    onClick={() => handleOpenComplete(task)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Hoàn thành & Bàn giao xe</span>
                  </button>
                )}

                {task.status === 'completed' && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã hoàn tất ({formatDate(task.completedAt)})</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Maintenance Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Lập lịch bảo trì kỹ thuật</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn xe cần lập lịch *</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => {
                    setSelectedVehicleId(e.target.value);
                    const v = vehicles.find((veh) => veh.id === e.target.value);
                    if (v) {
                      setDueKm(v.currentOdometer + (v.type === 'car' ? 5000 : 3000));
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.plateNumber}) - Odo: {v.currentOdometer.toLocaleString('vi-VN')} km
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên công việc / Hạng mục *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Thay dầu nhớt Motul và lọc gió"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mốc ngày đến hạn</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mốc km đến hạn</label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={dueKm}
                    onChange={(e) => setDueKm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chi phí dự kiến (đ)</label>
                  <input
                    type="number"
                    step="50000"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Người phụ trách</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú kỹ thuật</label>
                <input
                  type="text"
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="VD: Kiểm tra thêm má phanh sau"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
                >
                  Lưu lịch bảo trì
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Maintenance Modal */}
      {completingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Xác nhận hoàn thành bảo dưỡng
              </h3>
              <button onClick={() => setCompletingTask(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p>
                Công việc: <strong>{completingTask.title}</strong>
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chi phí thực tế thanh toán (đ) *</label>
                <input
                  type="number"
                  step="50000"
                  value={actualCost}
                  onChange={(e) => setActualCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-blue-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kết quả kiểm tra & nghiệm thu *</label>
                <textarea
                  rows={2}
                  value={resultNotes}
                  onChange={(e) => setResultNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mốc km tiếp theo:</label>
                  <input
                    type="number"
                    step="500"
                    value={nextTargetKm}
                    onChange={(e) => setNextTargetKm(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hạn ngày tiếp theo:</label>
                  <input
                    type="date"
                    value={nextTargetDate}
                    onChange={(e) => setNextTargetDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 text-[11px]">
                Xe sẽ được tự động chuyển về trạng thái <strong>Sẵn sàng</strong> để tiếp tục cho khách thuê.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompletingTask(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmComplete}
                  className="px-4 py-1.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold"
                >
                  Xác nhận hoàn thành
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
