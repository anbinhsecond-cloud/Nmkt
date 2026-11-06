import React, { useState } from 'react';
import {
  Printer,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  Phone,
  Check,
  X,
  Copy,
  BookOpen
} from 'lucide-react';
import { MOCK_STUDENTS_CLASS_10A } from '../data/mockData';
import {
  generateParentReportText,
  FeedbackTone,
  StudentRecord
} from '../utils/education';

export const ParentReporting: React.FC = () => {
  const [students] = useState<StudentRecord[]>(MOCK_STUDENTS_CLASS_10A);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord>(MOCK_STUDENTS_CLASS_10A[1]); // Trần Mai Chi
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tone, setTone] = useState<FeedbackTone>('encouraging');
  const [reportLetter, setReportLetter] = useState<string>(() =>
    generateParentReportText(MOCK_STUDENTS_CLASS_10A[1], 'Thầy Nguyễn Hoàng Nam', 'Lớp 10A2', 'encouraging')
  );
  const [activeModal, setActiveModal] = useState<'contacts' | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (s: StudentRecord) => {
    setSelectedStudent(s);
    setReportLetter(
      generateParentReportText(s, 'Thầy Nguyễn Hoàng Nam', 'Lớp 10A2', tone)
    );
  };

  const handleChangeTone = (newTone: FeedbackTone) => {
    setTone(newTone);
    setReportLetter(
      generateParentReportText(selectedStudent, 'Thầy Nguyễn Hoàng Nam', 'Lớp 10A2', newTone)
    );
  };

  const handleCopyAllPhones = () => {
    const phoneList = students.map((s, idx) => `${idx + 1}. ${s.name} - PH: ${s.parentName} - SĐT Zalo: ${s.parentPhone}`).join('\n');
    navigator.clipboard?.writeText(phoneList);
    setActionToast('Đã sao chép toàn bộ danh bạ 36 số Zalo phụ huynh vào bộ nhớ tạm!');
    setTimeout(() => setActionToast(null), 4000);
  };

  return (
    <section id="parent-reporting" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider">
              <span>TÍNH NĂNG 3 · TỔNG HỢP DANH BẠ SỐ ZALO & NHẬN XÉT SƯ PHẠM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Tổng Hợp Danh Bạ Số Zalo Phụ Huynh & Sổ Nhận Xét AI
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-base max-w-3xl">
              Hệ thống tự động tổng hợp đầy đủ số điện thoại Zalo của phụ huynh cả lớp để thầy cô tra cứu và sao chép thuận tiện. Đồng thời AI gợi ý mẫu lời nhận xét chuẩn mực cho từng học sinh để thầy cô sao chép sử dụng nhanh chóng.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setActiveModal('contacts')}
              className="px-4 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Tổng Hợp Danh Bạ Zalo (36 PH)</span>
            </button>
            <button
              onClick={handleCopyAllPhones}
              className="px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sao chép danh sách họ tên và SĐT Zalo"
            >
              <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Sao Chép 36 SĐT</span>
            </button>
          </div>
        </div>

        {/* Action Toast */}
        {actionToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-sm">{actionToast}</span>
            </div>
          </div>
        )}

        {/* 2-Zone Layout: Left Student Roster / Right Report Composer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Student Selector List */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Danh Sách Học Sinh (Lớp 10A2)</span>
              </h3>
              <span className="text-xs text-slate-500">{filteredStudents.length} em</span>
            </div>

            {/* Quick search input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên học sinh..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Student List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudent.id === student.id;
                const isPass = student.score >= 8.0;
                const isNeedReinforce = student.score < 6.5;

                return (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{student.name}</span>
                        {isPass && (
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                            Giỏi
                          </span>
                        )}
                        {isNeedReinforce && (
                          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.2 rounded">
                            Cần ôn
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        PH: {student.parentName} · {student.parentPhone}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-lg font-black tabular-nums ${
                          student.score >= 8
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : student.score < 6.5
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {student.score}đ
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Chuyên cần {student.attendanceRate}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Contact Aggregation Status Badge */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Đã tổng hợp số Zalo phụ huynh</span>
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                36/36 phụ huynh
              </span>
            </div>

          </div>

          {/* Right Panel: AI Report Composer & Quick Dispatch */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            
            {/* Header with Selected Student Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 gap-3">
              <div>
                <span className="text-xs font-bold text-slate-500">BÁO CÁO CÁ NHÂN HÓA DÀNH CHO:</span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Em {selectedStudent.name} (Điểm kiểm tra: {selectedStudent.score}/10)
                </h3>
              </div>

              {/* Tone Switcher */}
              <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => handleChangeTone('encouraging')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    tone === 'encouraging'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Động viên
                </button>
                <button
                  onClick={() => handleChangeTone('firm')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    tone === 'firm'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Nhắc nhở
                </button>
                <button
                  onClick={() => handleChangeTone('praising')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    tone === 'praising'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Khen ngợi
                </button>
              </div>
            </div>

            {/* Editable Teacher Report Letter Box */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="parent-report-editor" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Lời Nhắn AI Tạo Sẵn (Thầy cô có thể tự do chỉnh sửa thêm):</span>
                </label>
                <span className="text-[11px] text-slate-500">Giọng văn sư phạm chuẩn mực</span>
              </div>

              <textarea
                id="parent-report-editor"
                rows={11}
                value={reportLetter}
                onChange={(e) => setReportLetter(e.target.value)}
                className="w-full text-xs sm:text-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed resize-none shadow-xs font-sans"
              />
            </div>

            {/* Parent Contact Details */}
            <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Số điện thoại phụ huynh: <strong className="text-slate-900 dark:text-white font-mono">{selectedStudent.parentPhone}</strong></span>
              </div>
              <div>
                <span>Người nhận: <strong className="text-slate-900 dark:text-white">{selectedStudent.parentName}</strong></span>
              </div>
            </div>

            {/* Contact & Copy Action Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Copy Zalo Phone Button */}
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedStudent.parentPhone);
                    setActionToast(`Đã sao chép số Zalo phụ huynh em ${selectedStudent.name}: ${selectedStudent.parentPhone}`);
                    setTimeout(() => setActionToast(null), 4000);
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  title="Sao chép số Zalo của phụ huynh"
                >
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Sao chép số Zalo ({selectedStudent.parentPhone})</span>
                </button>

                {/* Copy Report Letter Button */}
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(reportLetter);
                    setActionToast(`Đã sao chép mẫu nhận xét em ${selectedStudent.name}! Thầy cô có thể dán vào Zalo.`);
                    setTimeout(() => setActionToast(null), 4000);
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  title="Sao chép toàn bộ văn bản nhận xét"
                >
                  <Copy className="w-4 h-4" />
                  <span>Sao chép mẫu nhận xét</span>
                </button>
              </div>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="In phiếu nhận xét ra giấy"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu điểm</span>
              </button>
            </div>

          </div>

        </div>

        {/* MODAL: TỔNG HỢP DANH BẠ SỐ ZALO PHỤ HUYNH */}
        {activeModal === 'contacts' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Tổng Hợp Danh Bạ Số Zalo Phụ Huynh</h4>
                    <p className="text-xs text-slate-500">Lớp 10A2 · Tổng cộng 36 phụ huynh học sinh</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 overflow-y-auto flex-1 pr-1">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase sticky top-0">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">STT</th>
                      <th className="p-2.5">Học sinh</th>
                      <th className="p-2.5">Phụ huynh</th>
                      <th className="p-2.5">Số điện thoại Zalo</th>
                      <th className="p-2.5 text-right rounded-r-lg">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {students.map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{st.name}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{st.parentName}</td>
                        <td className="p-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">{st.parentPhone}</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(st.parentPhone);
                              setActionToast(`Đã sao chép số Zalo của PH em ${st.name}: ${st.parentPhone}`);
                              setTimeout(() => setActionToast(null), 3000);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/40 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                          >
                            Sao chép
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 flex-wrap gap-2">
                <span className="text-xs text-slate-500 font-medium">Đã tổng hợp 36/36 số Zalo phụ huynh</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allNumbers = students.map((s) => s.parentPhone).join(', ');
                      navigator.clipboard?.writeText(allNumbers);
                      setActionToast('Đã sao chép danh sách 36 số điện thoại Zalo (phân cách dấu phẩy)!');
                      setTimeout(() => setActionToast(null), 4000);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép tất cả SĐT</span>
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
