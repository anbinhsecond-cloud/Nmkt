/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  RotateCcw,
  Save,
  Trash2,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Filter
} from 'lucide-react';
import {
  ClassroomStudent,
  calculateAverageScore,
  getAcademicRank,
  calculateClassroomStatistics,
  generateClassroomCsv,
  validateScore
} from '../utils/classroom';
import { INITIAL_CLASSROOM_STUDENTS } from '../data/mockClassroom';

interface ClassroomManagerProps {
  onSyncToDiagnostic?: () => void;
  onSyncToParentReport?: () => void;
}

export const ClassroomManager: React.FC<ClassroomManagerProps> = ({
  onSyncToDiagnostic,
  onSyncToParentReport
}) => {
  const [students, setStudents] = useState<ClassroomStudent[]>(() => {
    const saved = localStorage.getItem('edumaster_classroom_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CLASSROOM_STUDENTS;
      }
    }
    return INITIAL_CLASSROOM_STUDENTS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRank, setFilterRank] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Student Form State
  const [newStudent, setNewStudent] = useState<Omit<ClassroomStudent, 'id'>>({
    name: '',
    dob: '',
    email: '',
    parentPhone: '',
    regularScore1: 8.0,
    regularScore2: 8.0,
    midtermScore: 8.0,
    finalScore: 8.5,
    notes: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveToLocalStorage = (updated: ClassroomStudent[]) => {
    setStudents(updated);
    localStorage.setItem('edumaster_classroom_data', JSON.stringify(updated));
  };

  // Inline Score Change
  const handleScoreChange = (
    id: string,
    field: 'regularScore1' | 'regularScore2' | 'midtermScore' | 'finalScore',
    value: string
  ) => {
    const valid = validateScore(value);
    const updated = students.map((s) => {
      if (s.id === id) {
        return { ...s, [field]: valid };
      }
      return s;
    });
    saveToLocalStorage(updated);
  };

  // Inline Info Change (name, dob, email, phone)
  const handleInfoChange = (
    id: string,
    field: 'name' | 'dob' | 'email' | 'parentPhone',
    value: string
  ) => {
    const updated = students.map((s) => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    saveToLocalStorage(updated);
  };

  // Delete student
  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Thầy cô có chắc chắn muốn xóa học sinh "${name}" khỏi danh sách?`)) {
      const updated = students.filter((s) => s.id !== id);
      saveToLocalStorage(updated);
      showToast(`Đã xóa học sinh ${name}`);
    }
  };

  // Reset to initial mock
  const handleResetData = () => {
    if (window.confirm('Khôi phục danh sách học sinh mẫu ban đầu (Lớp 10A2)?')) {
      saveToLocalStorage(INITIAL_CLASSROOM_STUDENTS);
      showToast('Đã khôi phục dữ liệu mẫu ban đầu!');
    }
  };

  // Add new student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim()) {
      alert('Vui lòng nhập họ và tên học sinh!');
      return;
    }

    const created: ClassroomStudent = {
      id: `hs-${Date.now()}`,
      ...newStudent
    };

    const updated = [...students, created];
    saveToLocalStorage(updated);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      dob: '',
      email: '',
      parentPhone: '',
      regularScore1: 8.0,
      regularScore2: 8.0,
      midtermScore: 8.0,
      finalScore: 8.5,
      notes: ''
    });
    showToast(`Đã thêm học sinh ${created.name} vào danh sách!`);
  };

  // Export to CSV
  const handleExportCsv = () => {
    const csvContent = generateClassroomCsv(students, 'Lớp 10A2');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bang_Diem_Lop_10A2_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file bảng điểm Excel (.CSV) thành công!');
  };

  // Class statistics
  const stats = useMemo(() => calculateClassroomStatistics(students), [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentPhone.includes(searchTerm);

      if (!matchSearch) return false;

      if (filterRank === 'all') return true;
      const avg = calculateAverageScore(s);
      const rankInfo = getAcademicRank(avg);

      if (filterRank === 'gioi') return rankInfo.rank === 'Xuất sắc' || rankInfo.rank === 'Giỏi';
      if (filterRank === 'kha') return rankInfo.rank === 'Khá';
      if (filterRank === 'dat') return rankInfo.rank === 'Đạt';
      if (filterRank === 'yeu') return rankInfo.rank === 'Cần cố gắng';

      return true;
    });
  }, [students, searchTerm, filterRank]);

  return (
    <section
      id="classroom-manager"
      className="py-12 lg:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Sổ Điểm Điện Tử & Quản Lý Lớp</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bảng Mẫu Quản Lý Lớp Học & Điểm Số
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
              Thầy cô nhập điểm trực tiếp vào các cột bên dưới (Điểm thường xuyên, Giữa kì, Cuối kì). Hệ thống tự động tính điểm trung bình và phân loại học lực tức thì.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              title="Tải bảng điểm Excel về máy tính"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Xuất Excel</span>
            </button>
            <button
              onClick={handleResetData}
              className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Khôi phục dữ liệu mẫu ban đầu"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Đặt lại mẫu</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sĩ số lớp 10A2</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalStudents} <span className="text-xs font-medium text-slate-500">học sinh</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Điểm TB môn cả lớp</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats.averageScore} <span className="text-xs font-medium text-slate-500">/ 10</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Xếp loại Giỏi & Khá</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats.excellentCount + stats.goodCount + stats.fairCount}
                <span className="text-xs font-medium text-slate-500">
                  {' '}({Math.round(((stats.excellentCount + stats.goodCount + stats.fairCount) / (stats.totalStudents || 1)) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kết nối Zalo Phụ huynh</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stats.zaloConnectedCount}/{stats.totalStudents} <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Sẵn sàng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh, email hoặc SĐT phụ huynh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc học lực:
            </span>
            <select
              value={filterRank}
              onChange={(e) => setFilterRank(e.target.value)}
              className="text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả xếp loại ({students.length})</option>
              <option value="gioi">Xuất sắc / Giỏi ({stats.excellentCount + stats.goodCount})</option>
              <option value="kha">Khá ({stats.fairCount})</option>
              <option value="dat">Đạt ({stats.passCount})</option>
              <option value="yeu">Cần cố gắng ({stats.needHelpCount})</option>
            </select>
          </div>
        </div>

        {/* Master Gradebook Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-12">STT</th>
                <th className="py-3 px-4 min-w-[200px]">Họ và Tên</th>
                <th className="py-3 px-3 min-w-[125px]">Ngày Sinh</th>
                <th className="py-3 px-3 min-w-[220px]">Email Cá Nhân</th>
                <th className="py-3 px-3 min-w-[170px]">SĐT / Zalo PH</th>
                <th className="py-3 px-2 text-center w-20 bg-blue-50/60 dark:bg-blue-950/40 border-l border-r border-blue-100 dark:border-blue-900/60" title="Điểm Thường Xuyên 1 (Hệ số 1)">
                  TX 1 <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-normal">(HS 1)</span>
                </th>
                <th className="py-3 px-2 text-center w-20 bg-blue-50/60 dark:bg-blue-950/40 border-r border-blue-100 dark:border-blue-900/60" title="Điểm Thường Xuyên 2 (Hệ số 1)">
                  TX 2 <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-normal">(HS 1)</span>
                </th>
                <th className="py-3 px-2 text-center w-24 bg-indigo-50/70 dark:bg-indigo-950/40 border-r border-indigo-100 dark:border-indigo-900/60" title="Điểm Giữa Kì (Hệ số 2)">
                  Giữa Kì <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-normal">(HS 2)</span>
                </th>
                <th className="py-3 px-2 text-center w-24 bg-purple-50/70 dark:bg-purple-950/40 border-r border-purple-100 dark:border-purple-900/60" title="Điểm Cuối Kì (Hệ số 3)">
                  Cuối Kì <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-normal">(HS 3)</span>
                </th>
                <th className="py-3 px-3 text-center w-24 bg-amber-50/70 dark:bg-amber-950/40 font-black text-amber-800 dark:text-amber-300">
                  ĐTB Môn
                </th>
                <th className="py-3 px-3 text-center min-w-[110px]">Xếp Loại</th>
                <th className="py-3 px-3 text-center w-14">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    Không tìm thấy học sinh nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const avg = calculateAverageScore(student);
                  const rankInfo = getAcademicRank(avg);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-blue-50/30 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* STT */}
                      <td className="py-3 px-3 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                        {index + 1}
                      </td>

                      {/* Họ và tên (editable) */}
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => handleInfoChange(student.id, 'name', e.target.value)}
                          className="w-full bg-transparent font-bold text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 px-1 py-0.5 rounded transition-all outline-hidden text-sm"
                          placeholder="Họ tên học sinh"
                        />
                      </td>

                      {/* Ngày sinh */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={student.dob}
                          onChange={(e) => handleInfoChange(student.id, 'dob', e.target.value)}
                          className="w-full bg-transparent text-slate-600 dark:text-slate-300 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 px-1 py-0.5 rounded transition-all outline-hidden text-xs sm:text-sm font-mono"
                          placeholder="dd/mm/yyyy"
                        />
                      </td>

                      {/* Email cá nhân */}
                      <td className="py-2.5 px-3">
                        <input
                          type="email"
                          value={student.email}
                          onChange={(e) => handleInfoChange(student.id, 'email', e.target.value)}
                          className="w-full bg-transparent text-slate-600 dark:text-slate-300 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 px-1 py-0.5 rounded transition-all outline-hidden text-xs"
                          placeholder="email@student.edu.vn"
                        />
                      </td>

                      {/* SĐT / Zalo phụ huynh */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={student.parentPhone}
                            onChange={(e) => handleInfoChange(student.id, 'parentPhone', e.target.value)}
                            className="w-full bg-transparent font-medium text-slate-700 dark:text-slate-300 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 px-1 py-0.5 rounded transition-all outline-hidden text-xs font-mono"
                            placeholder="0912.xxx.xxx"
                          />
                          <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold rounded">
                            Zalo
                          </span>
                        </div>
                      </td>

                      {/* TX 1 */}
                      <td className="py-2 px-2 text-center bg-blue-50/30 dark:bg-blue-950/20 border-l border-r border-blue-100 dark:border-blue-900/40">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={student.regularScore1 ?? ''}
                          onChange={(e) => handleScoreChange(student.id, 'regularScore1', e.target.value)}
                          className="w-16 mx-auto text-center font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-1 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm"
                          placeholder="-"
                        />
                      </td>

                      {/* TX 2 */}
                      <td className="py-2 px-2 text-center bg-blue-50/30 dark:bg-blue-950/20 border-r border-blue-100 dark:border-blue-900/40">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={student.regularScore2 ?? ''}
                          onChange={(e) => handleScoreChange(student.id, 'regularScore2', e.target.value)}
                          className="w-16 mx-auto text-center font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-1 focus:ring-2 focus:ring-blue-500 outline-hidden text-sm"
                          placeholder="-"
                        />
                      </td>

                      {/* Giữa Kì (HS 2) */}
                      <td className="py-2 px-2 text-center bg-indigo-50/30 dark:bg-indigo-950/20 border-r border-indigo-100 dark:border-indigo-900/40">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={student.midtermScore ?? ''}
                          onChange={(e) => handleScoreChange(student.id, 'midtermScore', e.target.value)}
                          className="w-16 mx-auto text-center font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg py-1 px-1 focus:ring-2 focus:ring-indigo-500 outline-hidden text-sm"
                          placeholder="-"
                        />
                      </td>

                      {/* Cuối Kì (HS 3) */}
                      <td className="py-2 px-2 text-center bg-purple-50/30 dark:bg-purple-950/20 border-r border-purple-100 dark:border-purple-900/40">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={student.finalScore ?? ''}
                          onChange={(e) => handleScoreChange(student.id, 'finalScore', e.target.value)}
                          className="w-16 mx-auto text-center font-black text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 rounded-lg py-1 px-1 focus:ring-2 focus:ring-purple-500 outline-hidden text-sm"
                          placeholder="-"
                        />
                      </td>

                      {/* ĐTB Môn */}
                      <td className="py-3 px-3 text-center bg-amber-50/40 dark:bg-amber-950/20 font-black text-base text-amber-900 dark:text-amber-200">
                        {avg !== null ? avg.toFixed(1) : '-'}
                      </td>

                      {/* Xếp Loại */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full border ${rankInfo.badgeClass}`}>
                          {rankInfo.rank}
                        </span>
                      </td>

                      {/* Nút Xóa */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Xóa học sinh này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Helpful Teacher Note & Seamless Cross-Feature Actions */}
        <div className="mt-5 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-blue-700 dark:text-blue-400">Cách tính chuẩn của Bộ GD&ĐT:</strong>{' '}
              Điểm TB = <code>(TX1 + TX2 + Giữa Kì × 2 + Cuối Kì × 3) ÷ 7</code>. Dữ liệu được lưu tự động trên trình duyệt của Thầy Cô.
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('diagnostic-homework');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                showToast('Chuyển tới công cụ AI Chẩn đoán bài tập phân hóa');
              }}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>Phân tích bài kiểm tra AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thêm Học Sinh Mới</h3>
                  <p className="text-xs text-slate-500">Nhập thông tin lý lịch và điểm khởi đầu</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="mt-5 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên học sinh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Hoàng"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ngày tháng năm sinh
                  </label>
                  <input
                    type="text"
                    placeholder="15/04/2008"
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    SĐT / Zalo Phụ huynh
                  </label>
                  <input
                    type="text"
                    placeholder="0912.xxx.xxx"
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email cá nhân của học sinh
                </label>
                <input
                  type="email"
                  placeholder="hoang.nguyen@student.edu.vn"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Điểm số khởi đầu (Thầy cô có thể sửa trực tiếp trên bảng sau):
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">TX 1</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newStudent.regularScore1 ?? ''}
                      onChange={(e) => setNewStudent({ ...newStudent, regularScore1: validateScore(e.target.value) })}
                      className="w-full p-2 text-center text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">TX 2</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newStudent.regularScore2 ?? ''}
                      onChange={(e) => setNewStudent({ ...newStudent, regularScore2: validateScore(e.target.value) })}
                      className="w-full p-2 text-center text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Giữa kì</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newStudent.midtermScore ?? ''}
                      onChange={(e) => setNewStudent({ ...newStudent, midtermScore: validateScore(e.target.value) })}
                      className="w-full p-2 text-center text-sm font-bold rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">Cuối kì</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={newStudent.finalScore ?? ''}
                      onChange={(e) => setNewStudent({ ...newStudent, finalScore: validateScore(e.target.value) })}
                      className="w-full p-2 text-center text-sm font-bold rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 border border-slate-700 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};
