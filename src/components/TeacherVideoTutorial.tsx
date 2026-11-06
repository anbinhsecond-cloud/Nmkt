/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  BookOpen,
  Users,
  Scan,
  Send,
  Phone,
  Type,
  Sparkles,
  ArrowRight,
  Music,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { CheerfulMusicPlayer } from '../utils/cheerfulAudio';

interface SubtitleStep {
  text: string;
  highlightWords: string[];
}

interface TutorialChapter {
  id: string;
  title: string;
  shortTitle: string;
  timestamp: string;
  startSeconds: number;
  durationSeconds: number;
  icon: React.ElementType;
  color: string;
  subtitleSteps: SubtitleStep[];
  visualScene: {
    badge: string;
    actionHeadline: string;
    demoStep: string;
    screenMockupType: 'font' | 'gradebook' | 'aiscan' | 'zalo';
    keyTips: string[];
  };
  jumpTargetId: string;
}

const CHAPTERS: TutorialChapter[] = [
  {
    id: 'ch-1',
    title: 'Bước 1: Chỉnh cỡ chữ To Rõ (A, A+, A++) để mắt nhìn thoải mái',
    shortTitle: '1. Chỉnh cỡ chữ to',
    timestamp: '00:00 - 00:45',
    startSeconds: 0,
    durationSeconds: 45,
    icon: Type,
    color: 'from-blue-600 to-indigo-600',
    subtitleSteps: [
      {
        text: 'Thầy cô nhìn lên góc trên bên phải màn hình: Có sẵn 3 nút điều chỉnh cỡ chữ A, A+ và A++ chuyên biệt cho mắt người lớn tuổi.',
        highlightWords: ['góc trên bên phải', '3 nút', 'A, A+ và A++']
      },
      {
        text: 'Bấm nút A+ để phóng to chữ 115%. Bấm nút A++ để chữ và bảng điểm phóng to 128% cực kỳ rõ nét, không lo mỏi mắt.',
        highlightWords: ['A+ (115%)', 'A++ (128%)', 'không lo mỏi mắt']
      },
      {
        text: 'Hệ thống tự động lưu cỡ chữ đã chọn. Lần sau thầy cô mở máy, màn hình vẫn giữ nguyên chữ to tiện dụng này.',
        highlightWords: ['tự động lưu', 'giữ nguyên chữ to']
      }
    ],
    visualScene: {
      badge: 'CÔNG CỤ BẢO VỆ MẮT CHO THẦY CÔ LỚN TUỔI',
      actionHeadline: 'Bấm nút A+ hoặc A++ trên góc phải thanh menu',
      demoStep: 'Hệ thống tự động lưu cỡ chữ đã chọn, lần sau mở máy sẽ giữ nguyên cỡ chữ to này.',
      screenMockupType: 'font',
      keyTips: [
        'Nút A: Cỡ chữ chuẩn (100%)',
        'Nút A+: Phóng to 115% - Chữ to rõ, thanh thoát',
        'Nút A++: Phóng to 128% - Tối ưu cho mắt người lớn tuổi, không cần đeo kính lão'
      ]
    },
    jumpTargetId: 'header-font-scale'
  },
  {
    id: 'ch-2',
    title: 'Bước 2: Nhập điểm trực tiếp vào Sổ điểm điện tử & Tính ĐTB tự động',
    shortTitle: '2. Nhập điểm & Tính ĐTB',
    timestamp: '00:45 - 01:30',
    startSeconds: 45,
    durationSeconds: 45,
    icon: Users,
    color: 'from-emerald-600 to-teal-600',
    subtitleSteps: [
      {
        text: 'Ngay phía dưới video là Bảng Sổ Điểm Lớp Học. Thầy cô chỉ cần click chuột vào từng ô điểm Thường xuyên, Giữa kì và Cuối kì.',
        highlightWords: ['Bảng Sổ Điểm', 'click chuột vào từng ô điểm']
      },
      {
        text: 'Nhập điểm số lẻ thoải mái bằng cả dấu chấm hoặc dấu phẩy (ví dụ: 8.5 hoặc 8,5). Hệ thống tự chuẩn hóa tức thì.',
        highlightWords: ['dấu chấm hoặc dấu phẩy', '8.5 hoặc 8,5']
      },
      {
        text: 'Máy tính tự động tính ngay Điểm Trung Bình môn theo đúng Thông tư 22 Bộ GD&ĐT và xếp loại Giỏi, Khá, Xuất sắc.',
        highlightWords: ['tự động tính Điểm Trung Bình', 'Thông tư 22', 'xếp loại']
      }
    ],
    visualScene: {
      badge: 'SỔ ĐIỂM ĐIỆN TỬ THÔNG MINH (THÔNG TƯ 22)',
      actionHeadline: 'Nhấp chuột vào ô số và gõ điểm từ bàn phím',
      demoStep: 'Công thức tự động: (TX1 + TX2 + Giữa kỳ × 2 + Cuối kỳ × 3) chia 7.',
      screenMockupType: 'gradebook',
      keyTips: [
        'Hỗ trợ cả dấu chấm (.) và dấu phẩy (,) khi nhập điểm số lẻ (ví dụ 8.5 hoặc 8,5)',
        'Tự động phân loại: Xuất sắc, Giỏi, Khá, Đạt, Cần cố gắng',
        'Có sẵn nút "Xuất Excel" để thầy cô nộp báo cáo cho Ban Giám Hiệu'
      ]
    },
    jumpTargetId: 'classroom-manager'
  },
  {
    id: 'ch-3',
    title: 'Bước 3: Dùng AI quét file kết quả học sinh - Xem phần nào đúng nhiều, sai nhiều',
    shortTitle: '3. AI Quét file kết quả',
    timestamp: '01:30 - 02:20',
    startSeconds: 90,
    durationSeconds: 50,
    icon: Scan,
    color: 'from-purple-600 to-pink-600',
    subtitleSteps: [
      {
        text: 'Tại phần Chẩn Đoán, thầy cô bấm nút "Tải file mẫu CSV" để có sẵn bảng danh sách học sinh kèm các phần đúng, phần sai.',
        highlightWords: ['Tải file mẫu CSV', 'danh sách học sinh']
      },
      {
        text: 'Thầy cô tải file kết quả đã có của lớp lên: AI lập tức quét và phân tích toàn bộ danh sách học sinh trong vài giây.',
        highlightWords: ['file kết quả của lớp', 'AI lập tức quét và phân tích']
      },
      {
        text: 'Hệ thống tự động tổng hợp phần nào nhiều học sinh làm đúng và phần nào làm sai (>50%) để thầy cô kịp thời giảng lại.',
        highlightWords: ['tổng hợp phần làm đúng', 'làm sai (>50%)']
      }
    ],
    visualScene: {
      badge: 'AI PHÂN TÍCH FILE KẾT QUẢ HỌC SINH TỰ ĐỘNG',
      actionHeadline: 'AI quét dữ liệu từ file kết quả học sinh và phát hiện lỗ hổng kiến thức',
      demoStep: 'Tự động bôi đỏ phần nhiều học sinh làm sai (>50%) và gợi ý số phút cần ôn tập.',
      screenMockupType: 'aiscan',
      keyTips: [
        'Có nút tải sẵn File Mẫu .CSV chuẩn tiếng Việt',
        'Quét trực tiếp từ file kết quả điểm số & đúng/sai của học sinh',
        'Tự động phân loại 3 mức độ bài tập về nhà: Củng cố, Tiêu chuẩn, Nâng cao'
      ]
    },
    jumpTargetId: 'diagnostic-homework'
  },
  {
    id: 'ch-4',
    title: 'Bước 4: Tổng hợp danh bạ số Zalo phụ huynh & Mẫu nhận xét',
    shortTitle: '4. Danh bạ Zalo & Nhận xét',
    timestamp: '02:20 - 03:00',
    startSeconds: 140,
    durationSeconds: 40,
    icon: Phone,
    color: 'from-amber-600 to-orange-600',
    subtitleSteps: [
      {
        text: 'Thầy cô chọn tên học sinh bất kỳ trong danh sách lớp. Hệ thống tự động hiển thị số điện thoại Zalo của phụ huynh.',
        highlightWords: ['chọn tên học sinh', 'số điện thoại Zalo của phụ huynh']
      },
      {
        text: 'AI tự động soạn thảo mẫu nhận xét sư phạm chu đáo theo 3 phong cách: Động viên, Nhắc nhở hoặc Khen ngợi.',
        highlightWords: ['AI tự động soạn thảo', 'Động viên', 'Nhắc nhở', 'Khen ngợi']
      },
      {
        text: 'Thầy cô chỉ cần bấm 1 chạm để sao chép số Zalo hoặc sao chép toàn bộ danh bạ cả lớp để sử dụng khi cần.',
        highlightWords: ['bấm 1 chạm', 'sao chép số Zalo', 'sao chép toàn bộ danh bạ']
      }
    ],
    visualScene: {
      badge: 'TỔNG HỢP DANH BẠ SỐ ZALO PHỤ HUYNH',
      actionHeadline: 'Tổng hợp danh bạ số Zalo & AI soạn sẵn mẫu nhận xét chu đáo',
      demoStep: 'Có sẵn danh bạ 36 phụ huynh, hỗ trợ sao chép nhanh số điện thoại và lời nhận xét.',
      screenMockupType: 'zalo',
      keyTips: [
        'Tổng hợp nhanh chóng toàn bộ danh bạ số Zalo của lớp',
        'Sao chép 1 chạm số điện thoại phụ huynh hoặc toàn bộ lớp',
        'Lời nhận xét sư phạm AI tạo sẵn, dễ dàng sao chép tùy ý'
      ]
    },
    jumpTargetId: 'parent-reporting'
  }
];

export const TeacherVideoTutorial: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.25);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const totalDuration = 180; // 3 minutes = 180 seconds
  const musicPlayerRef = useRef<CheerfulMusicPlayer | null>(null);

  // Initialize Cheerful Background Music Engine
  useEffect(() => {
    const player = new CheerfulMusicPlayer();
    musicPlayerRef.current = player;

    return () => {
      player.destroy();
    };
  }, []);

  // Update current chapter based on currentTime
  useEffect(() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (currentTime >= CHAPTERS[i].startSeconds) {
        if (currentChapterIndex !== i) {
          setCurrentChapterIndex(i);
        }
        break;
      }
    }
  }, [currentTime, currentChapterIndex]);

  // Synchronize background music with play/pause state
  useEffect(() => {
    const player = musicPlayerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying]);

  // Synchronize music volume and mute state
  useEffect(() => {
    const player = musicPlayerRef.current;
    if (!player) return;

    player.setMute(isMusicMuted);
    player.setVolume(musicVolume);
  }, [isMusicMuted, musicVolume]);

  // Playback timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(totalDuration, prev + 1);
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
  };

  const handleSelectChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setCurrentTime(CHAPTERS[index].startSeconds);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleJumpToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeChapter = CHAPTERS[currentChapterIndex];

  // Calculate which subtitle sub-step is currently active (divided in 3 segments within the chapter)
  const chapterElapsed = currentTime - activeChapter.startSeconds;
  const subStepDuration = activeChapter.durationSeconds / activeChapter.subtitleSteps.length;
  const activeSubStepIndex = Math.min(
    activeChapter.subtitleSteps.length - 1,
    Math.max(0, Math.floor(chapterElapsed / subStepDuration))
  );
  const activeSubStep = activeChapter.subtitleSteps[activeSubStepIndex];

  return (
    <section
      id="teacher-video-tutorial"
      className="py-12 bg-linear-to-b from-blue-50/80 via-white to-slate-50 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Senior Teacher Friendly Badge */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xs mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>HƯỚNG DẪN DÀNH CHO QUÝ THẦY CÔ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Video 3 Phút: Hướng Dẫn Sử Dụng Nhanh Từng Tính Năng
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Thầy cô bấm <strong>Xem Video</strong> dưới đây. Video sử dụng <strong>phụ đề chữ lớn, hình ảnh mô phỏng trực quan</strong> cùng <strong>nhạc nền vui tươi</strong> giúp thầy cô theo dõi dễ chịu và nhanh chóng thành thạo.
          </p>
        </div>

        {/* 4 Interactive Chapter Shortcut Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
          {CHAPTERS.map((ch, idx) => {
            const Icon = ch.icon;
            const isSelected = currentChapterIndex === idx;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChapter(idx)}
                className={`p-3 sm:p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-400'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'text-slate-400'
                    }`}
                  >
                    {ch.timestamp.split(' - ')[0]}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                  {ch.shortTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Master Video Player Container (Cinema Screen View) */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
          
          {/* Top Video Header Bar with Cheerful Music Equalizer Indicator */}
          <div className="p-3 sm:p-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="font-extrabold text-xs sm:text-sm truncate">
                {activeChapter.title}
              </span>
            </div>

            {/* Cheerful Background Music & Volume Controls */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Music status & equalizer indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
                <Music className={`w-3.5 h-3.5 ${isPlaying && !isMusicMuted ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                <span className="text-[11px] font-semibold text-slate-300">
                  {isPlaying && !isMusicMuted ? 'Nhạc nền vui tươi 🎶' : 'Nhạc nền tắt'}
                </span>
                {isPlaying && !isMusicMuted && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-3" />
                    <span className="w-1 bg-blue-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
                  </div>
                )}
              </div>

              {/* Mute/Unmute Music Toggle Button */}
              <button
                onClick={() => setIsMusicMuted(!isMusicMuted)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isMusicMuted
                    ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title={isMusicMuted ? 'Bật nhạc nền vui tươi' : 'Tắt tiếng nhạc nền'}
              >
                {isMusicMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[11px]">Bật nhạc</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px]">Nhạc nền</span>
                  </>
                )}
              </button>

              {/* Playback speed toggle */}
              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 0.75 : 1.0)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                title="Tốc độ xem video"
              >
                Tốc độ: {playbackSpeed}x
              </button>

            </div>
          </div>

          {/* Video Stage / Simulated Animated High-Fidelity UI Demonstration */}
          <div className="relative aspect-video w-full max-h-[530px] bg-linear-to-br from-slate-900 via-slate-950 to-blue-950 flex flex-col justify-between p-4 sm:p-7 overflow-hidden">
            
            {/* Background subtle grid pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Stage Top: Badge, Step Indicator & Music Note Animation */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-black uppercase tracking-wider">
                {activeChapter.visualScene.badge}
              </span>

              <div className="flex items-center gap-2">
                {isPlaying && !isMusicMuted && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    🎵 Nhạc nền du dương
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                  Chương {currentChapterIndex + 1} / 4
                </span>
              </div>
            </div>

            {/* Stage Center: Animated Graphic Screen Simulation of the exact feature */}
            <div className="relative z-10 my-auto py-2 flex flex-col items-center text-center max-w-2xl mx-auto w-full">
              
              {/* Feature Screen Mockup Card */}
              <div className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md mb-2 text-left">
                
                {/* Scene 1: Font Scaling Showcase */}
                {activeChapter.visualScene.screenMockupType === 'font' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-blue-400">GIAO DIỆN PHÓNG TO CHỮ CHO THẦY CÔ:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">A (100%)</span>
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-bold ring-2 ring-blue-400">A+ (115%)</span>
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-black animate-pulse">A++ (128%)</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <p className="text-lg sm:text-xl font-bold text-white leading-snug">
                        "Chữ to rõ ràng, các con số điểm số lớn hơn 28% giúp thầy cô đọc bài không bị mỏi mắt."
                      </p>
                    </div>
                  </div>
                )}

                {/* Scene 2: Gradebook Showcase */}
                {activeChapter.visualScene.screenMockupType === 'gradebook' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="font-bold text-emerald-400">BẢNG NHẬP ĐIỂM TRỰC TIẾP LỚP 10A2:</span>
                      <span className="text-slate-400">Nhập số nào tính ngay số đó</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <div className="text-[10px] text-slate-400">TX 1 (HS 1)</div>
                        <div className="text-base font-bold text-blue-400">9.0</div>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <div className="text-[10px] text-slate-400">Giữa kỳ (HS 2)</div>
                        <div className="text-base font-bold text-indigo-400">8.5</div>
                      </div>
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <div className="text-[10px] text-slate-400">Cuối kỳ (HS 3)</div>
                        <div className="text-base font-bold text-purple-400">9.5</div>
                      </div>
                      <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg">
                        <div className="text-[10px] text-amber-400 font-bold">ĐTB Môn</div>
                        <div className="text-lg font-black text-amber-300">9.1 (Xuất sắc)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 3: AI Scanner Showcase */}
                {activeChapter.visualScene.screenMockupType === 'aiscan' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="font-bold text-purple-400">KẾT QUẢ AI QUÉT BÀI KIỂM TRA:</span>
                      <span className="text-emerald-400 font-bold">Đã chấm 36/36 bài</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 rounded bg-slate-800/80 flex items-center justify-between text-slate-200">
                        <span>Phần 1: Trắc nghiệm nhận biết (10 câu)</span>
                        <span className="text-emerald-400 font-bold">96% làm đúng ✓</span>
                      </div>
                      <div className="p-2 rounded bg-rose-950/60 border border-rose-800 flex items-center justify-between text-rose-200 font-bold">
                        <span>Phần 3: Chu trình Calvin & Enzyme RuBisCO</span>
                        <span className="text-rose-400 font-extrabold">58% sai kiến thức ⚠️</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 4: Zalo Contact Aggregation Showcase */}
                {activeChapter.visualScene.screenMockupType === 'zalo' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="font-bold text-amber-400">DANH BẠ SỐ ZALO PHỤ HUYNH (LỚP 10A2):</span>
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">Tổng hợp 36/36</span>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl text-xs text-slate-300 border-l-2 border-blue-500 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Trần Mai Chi · PH: Bác Trần Văn Hưng</div>
                        <div className="text-blue-400 font-mono mt-0.5">SĐT Zalo: 0912.845.123</div>
                      </div>
                      <span className="text-[10px] px-2 py-1 bg-blue-600/30 text-blue-300 rounded font-bold">
                        Đã sao chép
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span className="font-medium text-slate-300">{activeChapter.visualScene.actionHeadline}</span>
                  <button
                    onClick={() => handleJumpToSection(activeChapter.jumpTargetId)}
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem vị trí tính năng</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

            {/* Stage Bottom: High-Contrast Subtitle Box */}
            <div className="relative z-10 w-full">
              <div className="p-4 sm:p-5 rounded-2xl bg-black/90 border border-amber-400/80 backdrop-blur-md shadow-2xl">
                {/* Subtitle Content: Extra large, legible typography with bold highlights */}
                <p className="text-base sm:text-lg md:text-xl font-bold text-amber-200 leading-relaxed drop-shadow-md text-center sm:text-left">
                  {activeSubStep.text}
                </p>
              </div>
            </div>

          </div>

          {/* Video Control Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
            
            {/* Scrubber / Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-400 min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              
              <div
                className="relative flex-1 h-3 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  handleSeek(Math.floor(ratio * totalDuration));
                }}
              >
                {/* Active progress */}
                <div
                  className="h-full bg-linear-to-r from-blue-500 via-amber-400 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>

              <span className="text-xs font-mono font-bold text-slate-400 min-w-[40px]">
                {formatTime(totalDuration)}
              </span>
            </div>

            {/* Bottom Controls Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2.5">
              
              <div className="flex items-center gap-2">
                {/* Big Play / Pause Button */}
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Tạm dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Xem Video</span>
                    </>
                  )}
                </button>

                {/* Rewind 10s */}
                <button
                  onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Lùi lại 10 giây"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                {/* Forward 10s */}
                <button
                  onClick={() => handleSeek(Math.min(totalDuration, currentTime + 10))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Tua tới 10 giây"
                >
                  <FastForward className="w-4 h-4" />
                </button>

                {/* Replay */}
                <button
                  onClick={() => {
                    handleSeek(0);
                    setIsPlaying(true);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Xem lại từ đầu"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Music Volume Slider */}
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Âm lượng nhạc:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMusicMuted ? 0 : musicVolume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setMusicVolume(newVol);
                    if (isMusicMuted && newVol > 0) {
                      setIsMusicMuted(false);
                    }
                  }}
                  className="w-20 sm:w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Action: Jump to active section right away */}
              <button
                onClick={() => handleJumpToSection(activeChapter.jumpTargetId)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <span>Thực hành ngay tính năng này</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

        {/* Quick 4-Step Printable Text Guide (For Senior Teachers who prefer reading) */}
        <div className="mt-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Tóm Tắt 4 Bước Sử Dụng Dành Cho Thầy Cô (Cỡ Chữ Lớn)
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Có thể in ra giấy để bàn làm việc
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHAPTERS.map((ch, idx) => (
              <div
                key={ch.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {ch.visualScene.badge.split(' ')[0]}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                    {ch.shortTitle}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {ch.visualScene.demoStep}
                  </p>
                </div>

                <button
                  onClick={() => handleJumpToSection(ch.jumpTargetId)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer mt-2"
                >
                  <span>Chuyển tới phần này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
