import React, { useState } from 'react';
import {
  Sun,
  Moon,
  GraduationCap,
  Sparkles,
  ChevronDown,
  User,
  LogIn,
  Layers,
  FileCheck2,
  Send,
  HelpCircle,
  Menu,
  X,
  Users,
  Play
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  fontScale: 'normal' | 'large' | 'xlarge';
  onChangeFontScale: (scale: 'normal' | 'large' | 'xlarge') => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  fontScale,
  onChangeFontScale,
  isLoggedIn,
  onOpenLogin,
  onLogout,
  activeSection
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              className="flex items-center gap-2.5 text-slate-900 dark:text-white group"
              aria-label="EduMaster AI Trang chủ"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none text-slate-900 dark:text-white">
                  EduMaster <span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Trợ Lý Sư Phạm Số
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-base font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollTo('lecture-visualizer')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === 'lecture'
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              1. Trực quan bài giảng
            </button>
            <button
              onClick={() => scrollTo('diagnostic-homework')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === 'diagnostic'
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              2. Chẩn đoán & Ra đề
            </button>
            <button
              onClick={() => scrollTo('parent-reporting')}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeSection === 'parent'
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              3. Báo cáo phụ huynh
            </button>

            {/* Quick Access Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 whitespace-nowrap"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Truy cập nhanh</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute left-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  role="menu"
                >
                  <button
                    onClick={() => scrollTo('teacher-video-tutorial')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-slate-100 dark:border-slate-750"
                    role="menuitem"
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">Video Hướng Dẫn (3 Phút)</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Dành riêng cho thầy cô lớn tuổi</div>
                    </div>
                  </button>
                  <button
                    onClick={() => scrollTo('classroom-manager')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-slate-100 dark:border-slate-750"
                    role="menuitem"
                  >
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">Sổ Điểm & Quản Lý Lớp</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Nhập điểm TX, GK, CK trực tiếp</div>
                    </div>
                  </button>
                  <button
                    onClick={() => scrollTo('lecture-visualizer')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                    role="menuitem"
                  >
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium">Tạo Sơ Đồ Tư Duy</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Chuyển giáo án thành Mindmap 3D</div>
                    </div>
                  </button>
                  <button
                    onClick={() => scrollTo('diagnostic-homework')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                    role="menuitem"
                  >
                    <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="font-medium">Chấm Điểm & Ra Đề Nhóm</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Phân 3 bậc năng lực tự động</div>
                    </div>
                  </button>
                  <button
                    onClick={() => scrollTo('parent-reporting')}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                    role="menuitem"
                  >
                    <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-medium">Tổng Hợp Số Zalo Phụ Huynh</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Danh bạ & Mẫu nhận xét sư phạm</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Accessibility tools & Login */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Senior Teacher Font Size Control */}
            <div
              className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              title="Điều chỉnh kích thước toàn bộ chữ trên trang"
              role="group"
              aria-label="Cỡ chữ"
            >
              <button
                onClick={() => onChangeFontScale('normal')}
                className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
                  fontScale === 'normal'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-pressed={fontScale === 'normal'}
                title="Cỡ chữ chuẩn (100%)"
              >
                A
              </button>
              <button
                onClick={() => onChangeFontScale('large')}
                className={`px-2.5 py-1 rounded-lg transition-all text-sm font-bold ${
                  fontScale === 'large'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-pressed={fontScale === 'large'}
                title="Cỡ chữ to rõ (115%)"
              >
                A+
              </button>
              <button
                onClick={() => onChangeFontScale('xlarge')}
                className={`px-2.5 py-1 rounded-lg transition-all text-base font-extrabold ${
                  fontScale === 'xlarge'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-pressed={fontScale === 'xlarge'}
                title="Cỡ chữ rất to (128% - Dễ đọc cho giáo viên)"
              >
                A++
              </button>
            </div>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              title={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Teacher Login / Profile (Desktop / Tablet) */}
            <div className="hidden sm:flex items-center">
              {isLoggedIn ? (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                  title="Bấm để đăng xuất"
                >
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Thầy Nam</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden xl:inline">· Thoát</span>
                </button>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
              aria-label="Mở menu tính năng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-3">
            <button
              onClick={() => scrollTo('classroom-manager')}
              className="w-full text-left px-3 py-2 text-base font-bold text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 rounded-lg flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Sổ Điểm & Quản Lý Lớp Học</span>
            </button>
            <button
              onClick={() => scrollTo('lecture-visualizer')}
              className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              1. Trực quan bài giảng (Mindmap & Video)
            </button>
            <button
              onClick={() => scrollTo('diagnostic-homework')}
              className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              2. Chẩn đoán kiểm tra & Bài tập phân hóa
            </button>
            <button
              onClick={() => scrollTo('parent-reporting')}
              className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              3. Tổng hợp danh bạ Zalo & Sổ nhận xét PH
            </button>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 px-3">
              <span className="text-xs font-semibold text-slate-500">Cỡ chữ hiển thị cho thầy cô:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onChangeFontScale('normal')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    fontScale === 'normal'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  A (Chuẩn)
                </button>
                <button
                  onClick={() => onChangeFontScale('large')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    fontScale === 'large'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  A+ (To)
                </button>
                <button
                  onClick={() => onChangeFontScale('xlarge')}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all ${
                    fontScale === 'xlarge'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  A++ (Rất to)
                </button>
              </div>
            </div>

            {/* Mobile login / logout action */}
            <div className="pt-1 px-3">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Tài khoản Thầy Nam (Đăng xuất)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập giáo viên</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
