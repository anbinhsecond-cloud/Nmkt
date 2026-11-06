import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TeacherVideoTutorial } from './components/TeacherVideoTutorial';
import { ClassroomManager } from './components/ClassroomManager';
import { LectureVisualizer } from './components/LectureVisualizer';
import { DiagnosticHomework } from './components/DiagnosticHomework';
import { ParentReporting } from './components/ParentReporting';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { CheckCircle2, Type } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('edumaster_dark_mode') === 'true';
  });

  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>(() => {
    const saved = localStorage.getItem('edumaster_font_scale');
    if (saved === 'large' || saved === 'xlarge') return saved;
    return 'normal';
  });

  const [fontToast, setFontToast] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Pre-logged in as Thầy Nam for instant rich experience
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('classroom');

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edumaster_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edumaster_dark_mode', 'false');
    }
  }, [darkMode]);

  // Handle Global Root Font Scaling across all rem-based Tailwind typography
  useEffect(() => {
    const root = document.documentElement;
    if (fontScale === 'xlarge') {
      root.style.fontSize = '128%'; // ~20.5px base font
      root.setAttribute('data-font-scale', 'xlarge');
    } else if (fontScale === 'large') {
      root.style.fontSize = '115%'; // ~18.4px base font
      root.setAttribute('data-font-scale', 'large');
    } else {
      root.style.fontSize = '100%'; // 16px standard base font
      root.setAttribute('data-font-scale', 'normal');
    }
    localStorage.setItem('edumaster_font_scale', fontScale);
  }, [fontScale]);

  const handleFontScaleChange = (scale: 'normal' | 'large' | 'xlarge') => {
    setFontScale(scale);
    let message = 'Đã đặt cỡ chữ: Chuẩn (100%)';
    if (scale === 'large') {
      message = 'Đã phóng to cỡ chữ: To rõ (115% - Dễ đọc)';
    } else if (scale === 'xlarge') {
      message = 'Đã phóng to cỡ chữ: Rất to (128% - Tối ưu cho giáo viên)';
    }
    setFontToast(message);
    setTimeout(() => {
      setFontToast(null);
    }, 3000);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleScrollToFeature = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Dynamic Font Size Notification Toast */}
      {fontToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-blue-600 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 border border-blue-400">
          <Type className="w-5 h-5 shrink-0 text-blue-200" />
          <span className="font-bold text-sm">{fontToast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        fontScale={fontScale}
        onChangeFontScale={handleFontScaleChange}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => setIsLoggedIn(false)}
        activeSection={activeSection}
      />

      <main>
        {/* Hero Section */}
        <Hero onExploreFeature={handleScrollToFeature} />

        {/* Video Tutorial For Senior Teachers (Immediately Below Hero) */}
        <TeacherVideoTutorial />

        {/* Classroom Management & Gradebook Table */}
        <ClassroomManager />

        {/* Feature 1: AI Lecture Visualization */}
        <LectureVisualizer />

        {/* Feature 2: AI Diagnostic & Personalized Homework */}
        <DiagnosticHomework />

        {/* Feature 3: Parent Reporting System */}
        <ParentReporting />
      </main>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />

    </div>
  );
}
