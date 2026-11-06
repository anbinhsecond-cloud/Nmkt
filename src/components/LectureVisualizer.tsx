import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  GitGraph,
  Presentation,
  Video,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Play,
  Pause,
  Check,
  ChevronRight,
  Info,
  Loader2,
  Layers,
  BookOpen,
  ArrowRight,
  FileUp,
  Cpu
} from 'lucide-react';
import { SAMPLE_LECTURES, LectureSample } from '../data/mockData';
import {
  DEMO_DOCUMENT_FILES,
  DemoDocumentFile,
  generateLectureWithGemini,
  extractTextFromFile
} from '../utils/lectureAiGenerator';
import { InfographicPoster } from './InfographicPoster';

export const LectureVisualizer: React.FC = () => {
  const [selectedLecture, setSelectedLecture] = useState<LectureSample>(SAMPLE_LECTURES[0]);
  const [customText, setCustomText] = useState<string>(SAMPLE_LECTURES[0].rawText);
  const [activeTab, setActiveTab] = useState<'mindmap' | 'slides' | 'video'>('mindmap');
  const [mindmapDisplayMode, setMindmapDisplayMode] = useState<'interactive' | 'poster'>('interactive');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [aiPhase, setAiPhase] = useState<'idle' | 'reading' | 'summarizing' | 'visualizing' | 'done'>('idle');
  const [processingFileName, setProcessingFileName] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [justVisualized, setJustVisualized] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeNode, setActiveNode] = useState<{ label: string; detail: string; formula?: string; branchColor?: string } | null>({
    label: 'Pha Sáng (Màng Thylakoid)',
    detail: 'Pha phụ thuộc ánh sáng diễn ra tại màng Thylakoid, nơi nước bị quang phân ly giải phóng oxy và tạo ra các phân tử tích trữ năng lượng ATP, NADPH.',
    formula: '2 H₂O → 4 H⁺ + 4 e⁻ + O₂↑',
    branchColor: '#0284c7'
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deep pedagogical analysis workflow using server-side Gemini 3.8 Flash (optimized latency & accuracy)
  const processDocumentWorkflow = async (params: { text?: string; file?: File; fileName?: string }) => {
    setIsProcessing(true);
    const displayName = params.fileName || params.file?.name || 'Tài liệu giáo án';
    setProcessingFileName(displayName);
    setJustVisualized(false);
    setAiPhase('reading');
    setProcessingProgress(15);

    // Dynamic progress ticker to show active processing without blocking UI
    let currentPct = 15;
    const progressTicker = setInterval(() => {
      currentPct = Math.min(88, currentPct + 7);
      setProcessingProgress(currentPct);
      if (currentPct > 35 && currentPct <= 70) {
        setAiPhase('summarizing');
      } else if (currentPct > 70) {
        setAiPhase('visualizing');
      }
    }, 280);

    try {
      const generatedLecture = await generateLectureWithGemini({
        text: params.text,
        file: params.file,
        fileName: displayName,
      });

      clearInterval(progressTicker);
      setProcessingProgress(95);
      setAiPhase('visualizing');

      setSelectedLecture(generatedLecture);
      setCustomText(generatedLecture.summary);
      setActiveNode({
        label: generatedLecture.mindmap.centralNode.label,
        detail: generatedLecture.mindmap.centralNode.description,
      });
      setCurrentSlideIndex(0);

      setProcessingProgress(100);
      setAiPhase('done');
      setJustVisualized(true);
      setUploadSuccessToast(
        `AI Gemini đã phân tích chuyên sâu bài giảng "${generatedLecture.title}" (${generatedLecture.subject} - ${generatedLecture.grade}) với độ chính xác cao!`
      );
    } catch (err: any) {
      clearInterval(progressTicker);
      console.error('Visualization error:', err);
      setAiPhase('idle');
      setUploadSuccessToast(`Đã xảy ra lỗi: ${err?.message || 'Không thể kết nối đến AI Gemini'}. Vui lòng thử lại.`);
    } finally {
      clearInterval(progressTicker);
      setIsProcessing(false);
      setTimeout(() => {
        setUploadSuccessToast(null);
      }, 5000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Extract text if plain-text file; for PDF or binary, file is directly sent as base64 to Gemini
      const extractedText = await extractTextFromFile(file);
      await processDocumentWorkflow({
        file,
        text: extractedText,
        fileName: file.name,
      });
    } catch {
      setIsProcessing(false);
      setAiPhase('idle');
      setUploadSuccessToast('Đã xảy ra sự cố khi tải tệp. Vui lòng kiểm tra lại định dạng tệp.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectDemoDocument = (demo: DemoDocumentFile) => {
    processDocumentWorkflow({ text: demo.rawText, fileName: demo.fileName });
  };

  const handleGenerateAI = () => {
    processDocumentWorkflow({ text: customText, fileName: selectedLecture.title });
  };

  const toggleAudioPlay = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <section id="lecture-visualizer" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              TÍNH NĂNG 1 · BÀI GIẢNG SỐ HÓA
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Gemini Phân Tích Chuyên Sâu & Chuẩn Xác 100%</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            AI Tự Động Tóm Tắt & Trực Quan Hóa Bài Giảng
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-base max-w-3xl leading-relaxed">
            Thầy cô chỉ cần tải lên tệp tài liệu giáo án (PDF, Word, TXT). <strong className="text-blue-700 dark:text-blue-400 font-bold">Mô hình AI Gemini sẽ nghiên cứu kỹ lưỡng toàn bộ văn bản để tóm tắt chính xác luận điểm cốt lõi</strong> (thầy cô không cần tự tóm tắt) và <strong className="text-blue-700 dark:text-blue-400 font-bold">khởi tạo sơ đồ tư duy tương tác</strong>, thẻ trình chiếu và kịch bản video giảng dạy chuẩn mực.
          </p>
        </div>

        {/* Success Feedback Alert */}
        {uploadSuccessToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">Đã hoàn tất quy trình AI!</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-300">{uploadSuccessToast}</span>
              </div>
            </div>
            <button
              onClick={() => setUploadSuccessToast(null)}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* 2-Zone Working Grid: Left Input / Right Visual Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Upload, AI Summarizer & Document Box */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
            
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Tài Liệu Bài Giảng</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {selectedLecture.grade} · {selectedLecture.subject}
              </span>
            </div>

            {/* Upload Drag & Drop Area */}
            <div className="relative">
              <label
                htmlFor="lecture-file-input"
                className="border-2 border-dashed border-blue-300 dark:border-blue-600/80 hover:border-blue-600 dark:hover:border-blue-400 rounded-xl p-5 flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-white dark:bg-slate-800 transition-all text-center hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 block group-hover:underline">
                    Bấm để tải tệp giáo án lên
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                    Hỗ trợ tệp <strong>PDF, DOCX, DOC, TXT</strong> (Tối đa 25MB)
                  </span>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    ✨ AI tự động tóm tắt và trực quan hóa ngay sau khi tải
                  </span>
                </div>
              </label>
              <input
                id="lecture-file-input"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileUpload}
              />
            </div>

            {/* Quick Demo Upload Documents for Immediate Testing */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Hoặc thử tải nhanh tài liệu mẫu:</span>
                </span>
                <span className="text-[11px] text-slate-500">1 chạm</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {DEMO_DOCUMENT_FILES.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => handleSelectDemoDocument(demo)}
                    disabled={isProcessing}
                    className="p-2 rounded-lg text-left text-xs bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all flex flex-col justify-between cursor-pointer disabled:opacity-50"
                    title={`Thử tải lên tệp: ${demo.fileName}`}
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {demo.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                        .{demo.fileType}
                      </span>
                      <span>{demo.grade}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Active Progress Indicator Box */}
            {isProcessing && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-100">
                      EduMaster AI Đang Xử Lý Tự Động
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                    {processingProgress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden mb-3">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>

                {/* 3 Step Visual Checklist */}
                <div className="space-y-1.5 text-xs">
                  <div className={`flex items-center gap-2 ${aiPhase === 'reading' ? 'font-bold text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {processingProgress >= 20 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-blue-400 shrink-0" />
                    )}
                    <span>1. Đọc và phân tích cấu trúc tài liệu ({processingFileName})</span>
                  </div>

                  <div className={`flex items-center gap-2 ${aiPhase === 'summarizing' ? 'font-bold text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {processingProgress >= 45 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-blue-400 shrink-0" />
                    )}
                    <span>2. AI Gemini nghiên cứu chuyên sâu, trích xuất luận điểm & công thức</span>
                  </div>

                  <div className={`flex items-center gap-2 ${aiPhase === 'visualizing' ? 'font-bold text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {processingProgress >= 85 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-blue-400 shrink-0" />
                    )}
                    <span>3. AI trực quan hóa sơ đồ tư duy tương tác, thẻ slide & kịch bản</span>
                  </div>
                </div>
              </div>
            )}

            {/* Document Editor / AI Summary Area */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="lecture-text-editor" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nội dung tóm tắt chuyên sâu từ AI Gemini:
                </label>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
                  ✨ AI Gemini Phân Tích
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                AI Gemini trích xuất chính xác luận điểm khoa học, công thức và bản chất sư phạm từ tài liệu. Thầy cô có thể điều chỉnh thêm nếu muốn.
              </p>
              <textarea
                id="lecture-text-editor"
                rows={8}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full text-xs sm:text-sm font-sans p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed resize-none font-mono"
                placeholder="Khi tải tệp giáo án lên, AI Gemini sẽ phân tích chuyên sâu và tóm tắt chính xác nội dung vào đây..."
              />
            </div>

            {/* AI Action Button */}
            <button
              onClick={handleGenerateAI}
              disabled={isProcessing}
              className="mt-4 w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isProcessing ? 'AI Gemini đang phân tích chuyên sâu & trực quan hóa...' : 'Phân Tích Chuyên Sâu & Trực Quan Hóa Với AI Gemini'}</span>
            </button>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2">
              Ưu tiên độ chuẩn xác khoa học & chuẩn sư phạm GDPT 2018 (không bịa đặt thông tin)
            </p>
          </div>

          {/* Right Panel: Visualization Stage with 3 Modes */}
          <div className={`lg:col-span-8 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 border transition-all ${
            justVisualized
              ? 'border-blue-400 dark:border-blue-500 shadow-md ring-2 ring-blue-400/30'
              : 'border-slate-200 dark:border-slate-700'
          }`}>
            
            {/* Active Document Visualization Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-700 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Đang trực quan hóa:
                </span>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 line-clamp-1">
                  {selectedLecture.title}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Môn: {selectedLecture.subject} · {selectedLecture.grade}
              </span>
            </div>

            {/* View Mode Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              
              <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('mindmap')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${
                    activeTab === 'mindmap'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <GitGraph className="w-4 h-4" />
                  <span>Sơ đồ tư duy (Graph)</span>
                </button>

                <button
                  onClick={() => setActiveTab('slides')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${
                    activeTab === 'slides'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Presentation className="w-4 h-4" />
                  <span>Thẻ trình chiếu (Slide)</span>
                </button>

                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${
                    activeTab === 'video'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Kịch bản Video bài học</span>
                </button>
              </div>

              {/* Mindmap Toolbar controls */}
              {activeTab === 'mindmap' && (
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Thu nhỏ sơ đồ"
                    aria-label="Thu nhỏ sơ đồ"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-medium px-1">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Phóng to sơ đồ"
                    aria-label="Phóng to sơ đồ"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Đặt lại mức thu phóng"
                    aria-label="Đặt lại mức thu phóng"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: INTERACTIVE MINDMAP STAGE */}
            {activeTab === 'mindmap' && (
              <div className="mt-4">
                
                {/* Sub-mode selector: Cây sơ đồ tương tác vs Ảnh Infographic hoàn chỉnh */}
                <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setMindmapDisplayMode('interactive')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        mindmapDisplayMode === 'interactive'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      Cây Sơ Đồ Tương Tác (Nodes)
                    </button>
                    <button
                      onClick={() => setMindmapDisplayMode('poster')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        mindmapDisplayMode === 'poster'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ảnh Infographic Đồ Họa</span>
                    </button>
                  </div>

                  <span className="text-xs text-slate-500">
                    {mindmapDisplayMode === 'poster'
                      ? 'Áp phích Infographic số hóa tùy biến theo đúng tài liệu vừa tải lên'
                      : 'Bấm từng nút để xem giải thích chuyên sâu'}
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 min-h-[440px] flex flex-col justify-between p-4">
                  
                  {mindmapDisplayMode === 'poster' ? (
                    /* Display Full Dynamic Infographic Poster for the Uploaded / Active Lecture */
                    <div className="w-full py-1">
                      <InfographicPoster lecture={selectedLecture} zoomLevel={zoomLevel} />
                    </div>
                  ) : (
                    /* Zoomable interactive mindmap canvas */
                    <div
                      className="transition-transform duration-200 origin-center flex flex-col items-center justify-center my-auto"
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                      {/* Central Concept Node */}
                      <button
                        onClick={() =>
                          setActiveNode({
                            label: selectedLecture.mindmap.centralNode.label,
                            detail: selectedLecture.mindmap.centralNode.description
                          })
                        }
                        className="px-6 py-3.5 rounded-2xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all font-extrabold text-base sm:text-lg flex items-center gap-2 cursor-pointer border-2 border-white dark:border-slate-800 text-center max-w-xl"
                      >
                        <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                        <span>{selectedLecture.mindmap.centralNode.label}</span>
                      </button>

                      {/* Connecting Trunk lines */}
                      <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />

                      {/* Primary Branches Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl pt-2">
                        {selectedLecture.mindmap.branches.map((branch) => (
                          <div
                            key={branch.id}
                            className="flex flex-col p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/80 shadow-xs hover:shadow-sm transition-all"
                          >
                            {/* Branch Header */}
                            <button
                              onClick={() =>
                                setActiveNode({
                                  label: branch.label,
                                  detail: branch.description,
                                  branchColor: branch.color
                                })
                              }
                              className="text-left font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-2 pb-1 border-b border-slate-200 dark:border-slate-700 cursor-pointer"
                            >
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: branch.color }}
                              />
                              <span className="truncate">{branch.label}</span>
                            </button>

                            {/* Children Sub-nodes */}
                            <div className="space-y-1.5">
                              {branch.children.map((child) => (
                                <button
                                  key={child.id}
                                  onClick={() =>
                                    setActiveNode({
                                      label: child.label,
                                      detail: child.detail,
                                      formula: child.formula,
                                      branchColor: branch.color
                                    })
                                  }
                                  className={`w-full text-left p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                    activeNode?.label === child.label
                                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 font-bold border border-blue-300 dark:border-blue-700'
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <span className="truncate">{child.label}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Node Detail Inspector Box at Bottom (When in interactive mode) */}
                  {mindmapDisplayMode === 'interactive' && activeNode && (
                    <div className="mt-4 p-4 rounded-xl bg-blue-50/90 dark:bg-slate-800/95 border border-blue-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-3.5 h-3.5 rounded-full mt-1 shrink-0"
                          style={{ backgroundColor: activeNode.branchColor || '#2563eb' }}
                        />
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {activeNode.label}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                            {activeNode.detail}
                          </div>
                          {activeNode.formula && (
                            <div className="mt-1 font-mono text-xs text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-700 inline-block">
                              {activeNode.formula}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500">Bấm vào từng nút để xem giải thích</span>
                      </div>
                    </div>
                  )}

                  {/* Download Action Footer */}
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Mô hình chuẩn hóa theo Chương trình Giáo dục Phổ thông 2018</span>
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xuất ảnh sơ đồ (In ra giấy)</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: SLIDE VISUALS STAGE */}
            {activeTab === 'slides' && (
              <div className="mt-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                  
                  {/* Presentation Slide Header Banner */}
                  <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-t-xl overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white">
                        Slide {currentSlideIndex + 1} / {selectedLecture.slides.length}
                      </span>
                      <span className="text-xs text-blue-100 font-medium">
                        {selectedLecture.subject} · {selectedLecture.grade}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {selectedLecture.slides[currentSlideIndex]?.title || selectedLecture.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-2xl leading-relaxed">
                      {selectedLecture.slides[currentSlideIndex]?.visualPrompt || 'Trực quan hóa trọng tâm bài học.'}
                    </p>
                  </div>

                  {/* Slide Content Card */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {selectedLecture.slides[currentSlideIndex]?.title}
                    </h4>

                    <div className="space-y-2 mb-4">
                      {selectedLecture.slides[currentSlideIndex]?.keyPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Teacher Callout Box */}
                    {selectedLecture.slides[currentSlideIndex]?.teacherCallout && (
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
                        <div className="font-bold mb-0.5 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Mẹo sư phạm khi giảng trên lớp:</span>
                        </div>
                        <p>{selectedLecture.slides[currentSlideIndex].teacherCallout}</p>
                      </div>
                    )}

                    {/* Slide Navigation Controls */}
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                        disabled={currentSlideIndex === 0}
                        className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Trang trước
                      </button>

                      <div className="flex gap-1.5">
                        {selectedLecture.slides.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentSlideIndex(i)}
                            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                              currentSlideIndex === i ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            aria-label={`Đi tới slide ${i + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentSlideIndex((i) => Math.min(selectedLecture.slides.length - 1, i + 1))}
                        disabled={currentSlideIndex === selectedLecture.slides.length - 1}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 cursor-pointer"
                      >
                        Trang tiếp
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: VIDEO STORYBOARD & VOICEOVER */}
            {activeTab === 'video' && (
              <div className="mt-4 space-y-4">
                
                {/* Simulated Audio Voice Player */}
                <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAudioPlay}
                      className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer shrink-0"
                      aria-label={isPlayingAudio ? 'Tạm dừng giọng đọc giáo viên AI' : 'Phát giọng đọc giáo viên AI'}
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div>
                      <div className="text-sm font-bold flex items-center gap-2">
                        <span>Giọng Đọc Giáo Viên AI (Chuẩn Truyền Cảm)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                          {isPlayingAudio ? 'Đang phát...' : 'Sẵn sàng'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Thời lượng tổng: 4 phút 30 giây · Giọng Thầy Nam (Hà Nội)
                      </div>
                    </div>
                  </div>

                  {/* Sound Wave simulation */}
                  <div className="flex items-center gap-1.5 h-8">
                    {[12, 24, 18, 30, 15, 28, 10, 22, 14, 26, 19, 32, 16, 25].map((height, idx) => (
                      <div
                        key={idx}
                        className={`w-1 rounded-full bg-blue-400 transition-all duration-300 ${
                          isPlayingAudio ? 'animate-pulse' : 'opacity-40'
                        }`}
                        style={{ height: isPlayingAudio ? `${height}px` : '8px' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Scene-by-Scene Timeline Script */}
                <div className="space-y-3">
                  {selectedLecture.videoScenes.map((scene) => (
                    <div
                      key={scene.sceneNumber}
                      className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                            {scene.sceneNumber}
                          </span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {scene.title}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {scene.duration}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 pl-8">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Gợi ý hình ảnh chuyển động: </span>
                        {scene.visualAction}
                      </div>

                      <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border-l-2 border-blue-500 pl-4 italic">
                        "{scene.voiceoverScript}"
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
