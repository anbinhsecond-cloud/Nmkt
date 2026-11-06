import React from 'react';
import { ArrowDown, Play, BookOpen, Clock, HeartHandshake } from 'lucide-react';
import cuteRobotImg from '../assets/images/cute_teacher_robot_1792914362664.jpg';

interface HeroProps {
  onExploreFeature: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreFeature }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 py-12 lg:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Split: Left Quote & Description, Right Visual Character/Classroom */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (Left Side): Short Large Motto, 1-Line Description, and Single Action Button */}
          <div className="md:col-span-7 flex flex-col justify-center text-left">
            
            {/* Short Large Motto */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.18] text-balance">
              Dạy học từ trái tim, thảnh thơi cùng trợ lý AI.
            </h1>

            {/* Concise 1-sentence website description */}
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Nền tảng AI đồng hành hỗ trợ thầy cô trực quan hóa bài giảng, chẩn đoán bài kiểm tra và tự động hóa báo cáo phụ huynh.
            </p>

            {/* Action Buttons: "Xem video hướng dẫn" & "Trải nghiệm ngay" */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => onExploreFeature('teacher-video-tutorial')}
                className="px-6 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2.5 cursor-pointer group whitespace-nowrap"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                </div>
                <span>Xem video hướng dẫn (3 phút)</span>
              </button>

              <button
                onClick={() => onExploreFeature('classroom-manager')}
                className="px-6 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer group whitespace-nowrap"
              >
                <span>Trải nghiệm ngay</span>
                <ArrowDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>

          </div>

          {/* Right Column: Only the Lively Animated Robot */}
          <div className="md:col-span-5 flex justify-center md:justify-end relative select-none">
            <div className="relative flex flex-col items-center justify-center w-full max-w-sm">
              
              {/* Soft Ambient Glow Aura behind Robot */}
              <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-sky-400/25 dark:from-blue-600/20 dark:via-indigo-500/15 dark:to-sky-500/20 blur-3xl -z-10 animate-robot-glow pointer-events-none" />

              {/* Animated Robot Graphic Frame */}
              <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center cursor-pointer group">
                <img
                  src={cuteRobotImg}
                  alt="Trợ lý EduBot đội mũ cử nhân và cầm sách giáo án"
                  loading="eager"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/images/robot.jpg';
                  }}
                  className="w-full h-full object-contain drop-shadow-2xl animate-robot-float transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Pulsing Dynamic Ground Shadow */}
              <div className="w-48 sm:w-56 h-4 sm:h-5 rounded-full bg-blue-900/15 dark:bg-black/45 blur-md animate-robot-shadow -mt-4 pointer-events-none" />

            </div>
          </div>

        </div>

        {/* 3-Pillar Capability Strip below Hero Split (Clean icon layout without bulky images) */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div
            onClick={() => onExploreFeature('lecture-visualizer')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">TÍNH NĂNG 1</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Trực Quan Hóa Bài Giảng
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Tải lên giáo án chữ thông thường, AI tự vẽ sơ đồ tư duy tương tác, thẻ tóm tắt và kịch bản video minh họa sinh động.
            </p>
          </div>

          <div
            onClick={() => onExploreFeature('diagnostic-homework')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">TÍNH NĂNG 2</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Chẩn Đoán & Ra Đề Phân Hóa
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Quét kết quả bài kiểm tra, phát hiện đúng lỗ hổng kiến thức từng em và tự động ra 3 mức độ bài tập về nhà phù hợp.
            </p>
          </div>

          <div
            onClick={() => onExploreFeature('parent-reporting')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">TÍNH NĂNG 3</div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Hệ Thống Báo Cáo Phụ Huynh
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Tạo thư nhận xét chuẩn mực sư phạm, gửi kết quả kèm lời dặn dò đồng hành tới phụ huynh qua Zalo, SMS chỉ bằng 1 cú click.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
