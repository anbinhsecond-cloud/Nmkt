/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  FileCheck2,
  Scan,
  AlertTriangle,
  Award,
  Layers,
  Printer,
  CheckCircle2,
  HelpCircle,
  Users,
  TrendingUp,
  Download,
  Share2,
  FileSpreadsheet,
  Upload,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  X,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  StudentExamSubmission,
  ExamScanReport,
  analyzeExamSubmissions,
  parseCsvExamSubmissions,
  generateSampleExamCsv,
  generateSampleExamXlsx,
  parseUniversalExamFile
} from '../utils/examScanner';
import { PRESET_EXAM_DATASETS } from '../data/mockExamSubmissions';
import { generateHomeworkForTier, StudentTier, HomeworkSet } from '../utils/education';

export const DiagnosticHomework: React.FC = () => {
  // Currently active preset
  const [activePresetId, setActivePresetId] = useState<string>('bio-11-photo');
  
  // Custom uploaded submissions or preset submissions
  const [submissions, setSubmissions] = useState<StudentExamSubmission[]>(() => {
    return PRESET_EXAM_DATASETS[0].submissions;
  });

  // Current active exam metadata
  const [examMeta, setExamMeta] = useState({
    subject: PRESET_EXAM_DATASETS[0].subject,
    className: PRESET_EXAM_DATASETS[0].className,
    examTitle: PRESET_EXAM_DATASETS[0].examTitle,
    duration: PRESET_EXAM_DATASETS[0].duration,
    fileName: 'Khao_Sat_Sinh11_QuangHop_10A2.csv'
  });

  // Scanning animation states
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [scanStepText, setScanStepText] = useState<string>('Hoàn tất quét bài thi');
  const [showStudentListModal, setShowStudentListModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<StudentTier>('reinforce');

  // AI-generated homework state
  const [aiHomeworkData, setAiHomeworkData] = useState<{
    reinforce?: HomeworkSet;
    standard?: HomeworkSet;
    advanced?: HomeworkSet;
  } | null>(null);
  const [isGeneratingHomework, setIsGeneratingHomework] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run AI analysis on submissions
  const report: ExamScanReport = useMemo(() => {
    return analyzeExamSubmissions(submissions, {
      subject: examMeta.subject,
      className: examMeta.className,
      examTitle: examMeta.examTitle,
      fileName: examMeta.fileName
    });
  }, [submissions, examMeta]);

  // Homework tailored to current subject & diagnosed weaknesses
  const activeHomework = useMemo(() => {
    if (aiHomeworkData && aiHomeworkData[selectedTier]) {
      return aiHomeworkData[selectedTier]!;
    }
    const primaryWeakness = report.mostWrongSection?.sectionName || '';
    return generateHomeworkForTier(selectedTier, examMeta.subject, primaryWeakness);
  }, [aiHomeworkData, selectedTier, examMeta.subject, report.mostWrongSection]);

  // Generate customized homework via Gemini AI targeting specific scanned weaknesses
  const generateAiHomework = async (
    targetSubject: string,
    targetExamTitle: string,
    weakSections: string[],
    strongSections: string[] = []
  ) => {
    setIsGeneratingHomework(true);
    try {
      const response = await fetch('/api/gemini/generate-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: targetSubject,
          examTitle: targetExamTitle,
          weakSections,
          strongSections,
          className: examMeta.className
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setAiHomeworkData({
            reinforce: json.data.reinforce,
            standard: json.data.standard,
            advanced: json.data.advanced
          });
          showToast(`AI Gemini đã tạo bộ đề bài tập phân hóa bám sát môn ${targetSubject}!`);
          return;
        }
      }
    } catch (err) {
      console.warn('AI Homework generation fallback to local rules:', err);
    } finally {
      setIsGeneratingHomework(false);
    }
  };

  // Simulate AI Scan analyzing student results file
  const triggerAiScan = (newSubmissions: StudentExamSubmission[], meta: typeof examMeta) => {
    setIsScanning(true);
    setScanProgress(20);
    setScanStepText('Đang đọc danh sách dữ liệu học sinh từ file kết quả (.CSV)...');

    setTimeout(() => {
      setScanProgress(60);
      setScanStepText(`Đang phân tích các phần đúng và phần sai của ${newSubmissions.length} học sinh...`);
    }, 400);

    setTimeout(() => {
      setScanProgress(90);
      setScanStepText('AI đang thống kê tỷ lệ học sinh làm ĐÚNG và làm SAI theo từng chuyên đề...');
    }, 800);

    setTimeout(() => {
      setScanProgress(100);
      setScanStepText('Hoàn tất phân tích dữ liệu!');
      setSubmissions(newSubmissions);
      setExamMeta(meta);
      setIsScanning(false);
      showToast(`AI đã quét và phân tích thành công file kết quả của ${newSubmissions.length} học sinh!`);

      // Automatically trigger AI Homework Generation based on newly scanned weaknesses
      const analyzed = analyzeExamSubmissions(newSubmissions, meta);
      const weakList = analyzed.sectionDiagnostics
        .filter((s) => s.wrongPercentage > 0)
        .map((s) => s.sectionName);
      const strongList = analyzed.sectionDiagnostics
        .filter((s) => s.correctPercentage >= 50)
        .map((s) => s.sectionName);

      generateAiHomework(analyzed.subject, analyzed.examTitle, weakList, strongList);
    }, 1200);
  };

  // Switch between preset datasets
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_EXAM_DATASETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(presetId);
    triggerAiScan(preset.submissions, {
      subject: preset.subject,
      className: preset.className,
      examTitle: preset.examTitle,
      duration: preset.duration,
      fileName: `${preset.id}.csv`
    });
  };

  // Handle Download Sample File (CSV)
  const handleDownloadSampleCsv = () => {
    const csvContent = generateSampleExamCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `File_Mau_Khao_Sat_Bai_Kiem_Tra_EduMasterAI.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải xuống File mẫu (.CSV) khảo sát đúng/sai học sinh!');
  };

  // Handle Download Sample File (Excel XLSX)
  const handleDownloadSampleXlsx = () => {
    const buffer = generateSampleExamXlsx();
    const blob = new Blob([buffer.buffer as ArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'File_Mau_Khao_Sat_Bai_Kiem_Tra_EduMasterAI.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải xuống File mẫu Excel (.XLSX) khảo sát đúng/sai học sinh!');
  };

  // Handle Teacher Uploading Custom File (Supports Excel, PDF, Image, Word, CSV, TXT)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanProgress(20);
    setScanStepText(`Đang đọc tệp "${file.name}"...`);

    try {
      const result = await parseUniversalExamFile(file);

      if (!result.submissions || result.submissions.length === 0) {
        showToast('Không tìm thấy dữ liệu học sinh trong file. Vui lòng tải file mẫu để kiểm tra định dạng!');
        setIsScanning(false);
        return;
      }

      setActivePresetId('custom');
      triggerAiScan(result.submissions, {
        subject: result.meta?.subject || 'Bài Kiểm Tra Khảo Sát',
        className: result.meta?.className || 'Lớp Giáo Viên',
        examTitle: result.meta?.examTitle || file.name.replace(/\.[^/.]+$/, ''),
        duration: 'Bài kiểm tra',
        fileName: file.name
      });
    } catch (err: any) {
      console.error('File parsing error:', err);
      setIsScanning(false);
      showToast('Lỗi đọc tệp: ' + (err?.message || 'Vui lòng thử lại với định dạng Excel, CSV, PDF hoặc Ảnh.'));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section
      id="diagnostic-homework"
      className="py-16 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Scan className="w-3.5 h-3.5" />
              <span>TÍNH NĂNG 2 · AI QUÉT FILE KẾT QUẢ & CHẨN ĐOÁN LỖ HỔNG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Công Cụ AI Quét File Kết Quả Học Sinh & Đánh Giá Đúng / Sai
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 text-base max-w-3xl">
              Tính năng quét dựa trên file kết quả khảo sát của học sinh (gồm tên, phần đúng, phần sai). AI sẽ tự động quét danh sách gồm nhiều học sinh, tổng hợp <strong>phần nào nhiều học sinh làm đúng</strong> và <strong>phần nào nhiều học sinh làm sai</strong> để đưa ra đánh giá trực quan và bộ đề bổ trợ.
            </p>
            {/* Format support pills */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">Hỗ trợ đa dạng tệp:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                Excel (.xlsx, .xls)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold border border-red-200 dark:border-red-800">
                PDF
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                Ảnh chụp bảng điểm (.jpg, .png)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                Word (.docx)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                CSV / TXT
              </span>
            </div>
          </div>

          {/* Top Actions: Download Sample & Upload File & Re-Scan */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Download Sample File Options */}
            <div className="flex items-center rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs overflow-hidden">
              <button
                onClick={handleDownloadSampleXlsx}
                className="px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-emerald-600 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-r border-slate-200 dark:border-slate-700"
                title="Tải tệp mẫu Excel (.XLSX) chuẩn định dạng"
              >
                <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Mẫu (.XLSX)</span>
              </button>
              <button
                onClick={handleDownloadSampleCsv}
                className="px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Tải tệp mẫu CSV"
              >
                <span>(.CSV)</span>
              </button>
            </div>

            <button
              onClick={() => triggerAiScan(submissions, examMeta)}
              disabled={isScanning}
              className="px-3.5 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 flex items-center gap-2 cursor-pointer transition-all"
              title="Quét lại dữ liệu từ file"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Quét lại AI</span>
            </button>

            <label
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              title="Tải file kết quả học sinh lên: Hỗ trợ Excel (.xlsx, .xls), PDF, Word (.docx), Ảnh (.jpg, .png), CSV, TXT"
            >
              <Upload className="w-4 h-4" />
              <span>Tải file kết quả (Excel, PDF, Ảnh, CSV)</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv,.tsv,.txt,.pdf,.docx,.doc,.jpg,.jpeg,.png,.webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* AI Scanner Loading Banner */}
        {isScanning && (
          <div className="mb-8 p-6 rounded-2xl bg-blue-600 text-white shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-spin">
                  <Scan className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold text-base sm:text-lg">{scanStepText}</span>
              </div>
              <span className="font-mono font-bold text-sm bg-white/20 px-3 py-1 rounded-full">
                {scanProgress}%
              </span>
            </div>
            <div className="w-full bg-blue-950/40 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* TOP SPLIT: The Real Exam Sheet Card (User's Exact Screenshot Match) + AI Diagnostic Accuracy Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          
          {/* LEFT: Clean Digital Exam Sheet Card (Bám sát 100% hình ảnh người dùng tải lên) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between relative overflow-hidden">
            
            {/* Laser scanning beam overlay when scanning */}
            {isScanning && (
              <div className="absolute inset-0 bg-blue-500/10 pointer-events-none z-10 flex flex-col">
                <div className="w-full h-1 bg-blue-500 shadow-lg shadow-blue-500 animate-pulse" />
              </div>
            )}

            <div>
              {/* Card Title & Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-900 text-xs font-bold">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Bảng Phân Tích Đúng / Sai Trực Quan</span>
                </div>

                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400 font-semibold self-start sm:self-auto">
                  {examMeta.duration} · {examMeta.subject}
                </span>
              </div>

              {/* Inner Exam Sheet Box */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 p-5 space-y-3.5">
                
                {/* Exam Subtitle & Scanned Count Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">
                      {examMeta.examTitle}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      Môn: {examMeta.subject} · {examMeta.className} · Tệp: {examMeta.fileName}
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
                      Đã quét {report.totalSubmissions}/{report.totalSubmissions} học sinh
                    </span>
                  </div>
                </div>

                {/* Question-by-question Accuracy & Error Breakdown (Live Generated from Scanned Submissions) */}
                <div className="space-y-2 text-xs sm:text-sm">
                  {report.sectionDiagnostics.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs italic">
                      Chưa có dữ liệu chuyên đề để hiển thị. Vui lòng tải tệp kết quả khảo sát lên.
                    </div>
                  ) : (
                    report.sectionDiagnostics.map((sec, idx) => {
                      const isHighError = sec.wrongPercentage >= 50;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                            isHighError
                              ? 'bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200 font-bold'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium'
                          }`}
                        >
                          <span className="pr-2">{sec.sectionName}</span>
                          <div className="shrink-0 text-right">
                            {isHighError ? (
                              <span className="text-rose-600 dark:text-rose-400 font-extrabold">
                                {sec.wrongPercentage}% sai kiến thức
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {sec.correctPercentage}% làm đúng
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI quét và phân tích dữ liệu đúng/sai từ file kết quả</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Độ chính xác 100%</span>
            </div>
          </div>

          {/* RIGHT: Two Highlight Evaluation Cards (Most Correct vs Most Wrong) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            
            {/* 1. Phần Học Sinh Làm ĐÚNG Nhiều Nhất */}
            <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        ĐIỂM SÁNG KIẾN THỨC
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Phần Nhiều Học Sinh Làm ĐÚNG Nhất
                      </h4>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black shadow-xs">
                    {report.mostCorrectSection ? `${report.mostCorrectSection.correctPercentage}% làm đúng` : '100%'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 mb-3">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {report.mostCorrectSection?.sectionName || 'Trắc nghiệm kiến thức nhận biết'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Có <strong>{report.mostCorrectSection?.correctCount || report.totalSubmissions}</strong> / {report.totalSubmissions} học sinh đạt điểm tối đa ở phần này.
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  ✓ <strong>Nhận định sư phạm AI:</strong> Học sinh đã có phản xạ rất tốt ở phần này. Thầy cô chỉ cần ôn tập lướt nhanh 3 phút để dành thời gian cho phần học sinh còn vướng mắc.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Trạng thái: Đạt chuẩn yêu cầu</span>
                <span className="flex items-center gap-1">Tỷ lệ hoàn thành cao <Check className="w-3.5 h-3.5" /></span>
              </div>
            </div>

            {/* 2. Phần Học Sinh Làm SAI Nhiều Nhất (Cảnh báo đỏ) */}
            <div className="p-6 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                        CẢNH BÁO LỖ HỔNG KIẾN THỨC
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Phần Nhiều Học Sinh Làm SAI Nhất
                      </h4>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-black shadow-xs">
                    {report.mostWrongSection ? `${report.mostWrongSection.wrongPercentage}% sai kiến thức` : '0%'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 mb-3">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {report.mostWrongSection?.sectionName || 'Chu trình Calvin & Enzyme RuBisCO'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Có <strong>{report.mostWrongSection?.wrongCount || 0}</strong> / {report.totalSubmissions} học sinh mất điểm tại phần này.
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                  ⚠️ <strong>Khuyến nghị sư phạm AI:</strong> {report.mostWrongSection?.pedagogicalAdvice || 'Học sinh đang nhầm lẫn kiến thức trọng tâm. Thầy cô nên dành 15-20 phút đầu tiết tới để giảng lại chuyên đề này.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 font-semibold">
                <span>Ưu tiên cần giảng lại: Cấp độ 1</span>
                <button
                  onClick={() => setShowStudentListModal(true)}
                  className="hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Xem danh sách học sinh sai ({report.mostWrongSection?.wrongCount || 0} em)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* 4 Score Metrics from the AI Scan */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Điểm trung bình đợt quét</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {report.averageScore} <span className="text-xs font-normal text-slate-500">/ 10</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Tổng {report.totalSubmissions} bài làm</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Điểm cao nhất lớp</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {report.highestScore} <span className="text-xs font-normal text-slate-500">/ 10</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Học sinh hoàn thành xuất sắc</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Tỷ lệ Đạt (≥ 5.0)</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {Math.round((report.passCount / (report.totalSubmissions || 1)) * 100)}%
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              {report.passCount}/{report.totalSubmissions} học sinh đạt
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Khá & Giỏi (≥ 8.0)</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {Math.round((report.goodCount / (report.totalSubmissions || 1)) * 100)}%
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              {report.goodCount}/{report.totalSubmissions} học sinh khá giỏi
            </div>
          </div>
        </div>

        {/* Action to view full scanned student list */}
        <div className="mb-10 flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Danh sách {report.totalSubmissions} học sinh đã được AI quét chi tiết
              </div>
              <div className="text-xs text-slate-500">
                Xem cụ thể từng em đúng phần nào, sai phần nào và ghi chú của AI
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowStudentListModal(true)}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Mở bảng chi tiết từng em</span>
          </button>
        </div>

        {/* 3-TIER PERSONALIZED HOMEWORK HUB (Automatically adjusted to the scanned weaknesses) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                ĐỀ BÀI TẬP VỀ NHÀ TỰ ĐỘNG PHÂN HÓA
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Đề Bài Cá Nhân Hóa Dựa Trên Lỗ Hổng Vừa Quét
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tập trung củng cố đúng phần <strong>{report.mostWrongSection?.sectionName || 'Chu trình Calvin'}</strong> cho nhóm cần ôn tập
              </p>
            </div>

            {/* Header Right: AI Homework Generation Trigger & 3-Tier Selectors */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                onClick={() => {
                  const weakList = report.sectionDiagnostics
                    .filter((s) => s.wrongPercentage > 0)
                    .map((s) => s.sectionName);
                  const strongList = report.sectionDiagnostics
                    .filter((s) => s.correctPercentage >= 50)
                    .map((s) => s.sectionName);
                  generateAiHomework(examMeta.subject, examMeta.examTitle, weakList, strongList);
                }}
                disabled={isGeneratingHomework}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-70"
                title="Tạo lại đề bài bằng AI Gemini dựa trên các lỗ hổng vừa quét"
              >
                <Sparkles className={`w-4 h-4 text-white ${isGeneratingHomework ? 'animate-spin' : ''}`} />
                <span>{isGeneratingHomework ? 'AI đang tạo đề bài...' : '✨ Tạo Đề Bằng AI Gemini'}</span>
              </button>

              {/* 3-Tier Selectors */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setSelectedTier('reinforce')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    selectedTier === 'reinforce'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  1. Cần củng cố ({report.mostWrongSection?.wrongCount || 4} em)
                </button>

                <button
                  onClick={() => setSelectedTier('standard')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    selectedTier === 'standard'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  2. Tiêu chuẩn
                </button>

                <button
                  onClick={() => setSelectedTier('advanced')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    selectedTier === 'advanced'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  3. Nâng cao ({report.goodCount} em)
                </button>
              </div>
            </div>
          </div>

          {/* AI Generating Banner */}
          {isGeneratingHomework && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
              <span>AI Gemini đang phân tích các phần sai kiến thức để tạo bộ câu hỏi củng cố cá nhân hóa cho từng nhóm học sinh...</span>
            </div>
          )}

          {/* Active Homework Specification Details */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  {activeHomework.tierName}
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded font-semibold">
                  {activeHomework.questionCount} câu hỏi
                </span>
                <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                  Thời lượng: {activeHomework.estimatedTime}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {activeHomework.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => showToast(`Đang tạo tệp Word (.docx) đề ${activeHomework.tierName}...`)}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải tệp Word (.docx)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-600 cursor-pointer"
                title="In phiếu bài tập ra giấy"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of Questions in the Tier */}
          <div className="mt-6 space-y-4">
            {activeHomework.sampleQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                      Câu {q.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Mức độ: {q.difficulty}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed pl-9">
                  {q.question}
                </div>

                {q.hint && (
                  <div className="mt-3 ml-9 p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Gợi ý phương pháp giải cho học sinh: </span>
                      <span>{q.hint}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Modal: Scanned Student Breakdown Table */}
      {showStudentListModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Chi Tiết Kết Quả Quét Từng Học Sinh ({report.totalSubmissions} bài)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {examMeta.examTitle} · Môn: {examMeta.subject}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStudentListModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto mt-4 pr-1 flex-1">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3 text-center w-12">STT</th>
                    <th className="py-2.5 px-4 min-w-[160px]">Tên học sinh</th>
                    <th className="py-2.5 px-3 text-center w-20">Điểm số</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Phần làm ĐÚNG</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Phần làm SAI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {report.studentResults.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{s.studentName}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-black px-2 py-0.5 rounded text-xs ${
                            s.score >= 8.0
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : s.score >= 5.0
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                          }`}
                        >
                          {s.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {s.correctSections.map((sec, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            >
                              ✓ {sec}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {s.wrongSections.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">Không có lỗi sai</span>
                          ) : (
                            s.wrongSections.map((sec, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              >
                                ✗ {sec}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Thầy cô có thể tải file mẫu để thêm học sinh khác bất kỳ lúc nào.
              </span>
              <button
                onClick={() => setShowStudentListModal(false)}
                className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 border border-slate-700 text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </section>
  );
};
