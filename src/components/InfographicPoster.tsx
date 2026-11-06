import React, { useRef, useState } from 'react';
import {
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  Atom,
  BookOpen,
  Compass,
  Cpu,
  GraduationCap,
  Layers,
  Lightbulb,
  Check,
  Loader2
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { LectureSample } from '../data/mockData';

interface InfographicPosterProps {
  lecture: LectureSample;
  zoomLevel?: number;
}

export const InfographicPoster: React.FC<InfographicPosterProps> = ({ lecture, zoomLevel = 1 }) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Subject color accents
  const getSubjectTheme = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('sinh')) {
      return {
        badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
        gradientHeader: 'from-emerald-600 via-teal-600 to-emerald-700',
        hubRing: 'ring-emerald-400/30 border-emerald-400',
        hubBg: 'from-emerald-500/15 via-teal-500/10 to-transparent',
        accentColor: '#10b981',
      };
    }
    if (s.includes('vật lý') || s.includes('vật lí')) {
      return {
        badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
        gradientHeader: 'from-blue-600 via-indigo-600 to-sky-700',
        hubRing: 'ring-blue-400/30 border-blue-400',
        hubBg: 'from-blue-500/15 via-indigo-500/10 to-transparent',
        accentColor: '#2563eb',
      };
    }
    if (s.includes('hóa')) {
      return {
        badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300',
        gradientHeader: 'from-purple-600 via-fuchsia-600 to-indigo-700',
        hubRing: 'ring-purple-400/30 border-purple-400',
        hubBg: 'from-purple-500/15 via-fuchsia-500/10 to-transparent',
        accentColor: '#9333ea',
      };
    }
    if (s.includes('toán')) {
      return {
        badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
        gradientHeader: 'from-amber-600 via-orange-600 to-amber-700',
        hubRing: 'ring-amber-400/30 border-amber-400',
        hubBg: 'from-amber-500/15 via-orange-500/10 to-transparent',
        accentColor: '#d97706',
      };
    }
    if (s.includes('sử') || s.includes('địa') || s.includes('văn')) {
      return {
        badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
        gradientHeader: 'from-rose-600 via-red-600 to-amber-700',
        hubRing: 'ring-rose-400/30 border-rose-400',
        hubBg: 'from-rose-500/15 via-red-500/10 to-transparent',
        accentColor: '#e11d48',
      };
    }
    return {
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
      gradientHeader: 'from-blue-600 via-indigo-600 to-slate-800',
      hubRing: 'ring-blue-400/30 border-blue-400',
      hubBg: 'from-blue-500/15 via-cyan-500/10 to-transparent',
      accentColor: '#2563eb',
    };
  };

  const theme = getSubjectTheme(lecture.subject);

  // Extract key summary points for the bottom takeaway ribbon
  const summaryLines = lecture.summary
    ? lecture.summary
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))
        .slice(0, 3)
        .map((l) => l.replace(/^[-*•\s]+/, ''))
    : [];

  const handleDownloadPng = async () => {
    if (!posterRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2, // Retina high resolution
      });
      const link = document.createElement('a');
      const cleanTitle = lecture.title.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_');
      link.download = `Infographic_${cleanTitle}.png`;
      link.href = dataUrl;
      link.click();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export infographic PNG:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Action Ribbon for Infographic Controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Infographic Số Hóa Bài Giảng:
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {lecture.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Tải ảnh Infographic sắc nét độ phân giải cao"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xuất ảnh PNG...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Đã tải thành công!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Tải ảnh Infographic (PNG)</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 text-xs font-semibold transition-all cursor-pointer"
            title="In áp phích trực tiếp"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Áp Phích</span>
          </button>
        </div>
      </div>

      {/* Main Infographic Poster Canvas (Zoomable & Printable) */}
      <div
        className="w-full flex justify-center overflow-x-auto py-2 transition-transform duration-200 origin-top"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <div
          ref={posterRef}
          id="infographic-poster-node"
          className="w-full max-w-4xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-slate-900 dark:text-slate-100 overflow-hidden relative"
          style={{ minHeight: '750px' }}
        >
          {/* Subtle Decorative Background Geometry */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* 1. Header Banner */}
          <div className="relative border-b-2 border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-xs ${theme.badgeBg}`}>
                  {lecture.subject} · {lecture.grade}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>GDPT 2018</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>EduMaster AI · Infographic Số Hóa</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
              {lecture.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Sơ đồ trực quan hóa bản chất khoa học, cơ chế vận hành và phương trình then chốt phục vụ giảng dạy và ghi nhớ dài hạn.
            </p>
          </div>

          {/* 2. Central Hub Concept Card */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-emerald-50/80 dark:from-slate-800/90 dark:via-slate-850 dark:to-slate-800 border border-blue-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md ring-4 ring-blue-100 dark:ring-blue-900/40">
                <Lightbulb className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                  Khái Niệm Cốt Lõi Trọng Tâm
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  {lecture.mindmap.centralNode.label}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
                  {lecture.mindmap.centralNode.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Số Nhánh Phân Tích</span>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                {lecture.mindmap.branches.length} Trụ Cột Sư Phạm
              </span>
            </div>
          </div>

          {/* 3. Multi-Branch Architectural Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
            {lecture.mindmap.branches.map((branch, bIdx) => (
              <div
                key={branch.id || bIdx}
                className="flex flex-col rounded-2xl p-4.5 bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Branch Accent Top Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: branch.color || '#2563eb' }}
                />

                {/* Branch Header */}
                <div className="flex items-center gap-2.5 mb-2.5 pt-1">
                  <span
                    className="w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: branch.color || '#2563eb' }}
                  >
                    0{bIdx + 1}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {branch.label}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2">
                  {branch.description}
                </p>

                {/* Sub-Concept Item Cards */}
                <div className="space-y-2 mt-auto">
                  {branch.children.map((child, cIdx) => (
                    <div
                      key={child.id || cIdx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 shadow-xs"
                    >
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2
                          className="w-3.5 h-3.5 mt-0.5 shrink-0"
                          style={{ color: branch.color || '#2563eb' }}
                        />
                        <div className="w-full">
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                            {child.label}
                          </span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {child.detail}
                          </p>

                          {/* Formula Callout Badge */}
                          {child.formula && (
                            <div className="mt-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold text-blue-700 dark:text-blue-300 inline-flex items-center gap-1.5">
                              <Atom className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                              <span>{child.formula}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 4. Bottom Pedagogical Guidance & Practical Application */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 mt-auto">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <Compass className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Ghi Nhớ Sư Phạm & Vận Dụng Đời Sống:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              {summaryLines.length > 0 ? (
                summaryLines.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{line}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-1.5 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span className="leading-snug">Nắm vững các định nghĩa và điều kiện tiên quyết của bài học.</span>
                  </div>
                  <div className="flex items-start gap-1.5 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span className="leading-snug">Vận dụng chuẩn xác công thức vào giải quyết bài toán thực tế.</span>
                  </div>
                  <div className="flex items-start gap-1.5 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span className="leading-snug">Tránh nhầm lẫn các đơn vị đo lường và bản chất cơ chế động học.</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 5. Footer Signature Stamp */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>Giáo trình số hóa bởi Trợ lý AI EduMaster · Bộ công cụ sư phạm 4.0</span>
            <span className="font-mono">Tự động khởi tạo theo dữ liệu bài học thực tế</span>
          </div>
        </div>
      </div>
    </div>
  );
};
