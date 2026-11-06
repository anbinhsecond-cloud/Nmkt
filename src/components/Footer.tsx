import React from 'react';
import { GraduationCap, ShieldCheck, Heart, BookOpen, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                EduMaster AI
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Hệ sinh thái công nghệ giáo dục hỗ trợ giáo viên Việt Nam đổi mới phương pháp giảng dạy, trực quan hóa kiến thức phức tạp và cá nhân hóa lộ trình tiến bộ cho từng em học sinh.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Chuẩn hóa theo Chương trình Giáo dục Phổ thông 2018</span>
            </div>
          </div>

          {/* Project Credits */}
          <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide uppercase">
                Developed by Introduction to Hadilao
              </h4>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Leader of Developing and Testing team:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">An Bình</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Leader of Planning and Researching team:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">Thanh Phong</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Members:</span>
                <span className="text-slate-900 dark:text-white font-semibold">
                  Yến Nhi, Phụng Nghi, Thành Trung, Đức Hưng, Gia Phương
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © 2026 EduMaster AI · Đồng hành cùng triệu giáo viên Việt Nam
          </div>
          <div className="flex items-center gap-1">
            <span>Thiết kế vì tình yêu nghề giáo và sự phát triển của thế hệ tương lai</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
