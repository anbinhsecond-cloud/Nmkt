/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClassroomStudent {
  id: string;
  name: string;
  dob: string; // Format: dd/mm/yyyy or yyyy-mm-dd
  email: string;
  parentPhone: string;
  regularScore1: number | null; // Điểm thường xuyên 1 (TX1)
  regularScore2: number | null; // Điểm thường xuyên 2 (TX2)
  midtermScore: number | null;  // Điểm giữa kì (ĐGK - hệ số 2)
  finalScore: number | null;    // Điểm cuối kì (ĐCK - hệ số 3)
  notes?: string;
}

export type AcademicRank = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Đạt' | 'Cần cố gắng' | 'Chưa đủ điểm';

/**
 * Validates and normalizes an input score between 0 and 10.
 * Returns null if input is empty, null, undefined, or NaN.
 */
export function validateScore(val: number | string | null | undefined): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : parseFloat(val.toString().replace(',', '.'));
  if (isNaN(num)) return null;
  if (num < 0) return 0;
  if (num > 10) return 10;
  return Math.round(num * 10) / 10;
}

/**
 * Computes the weighted average score based on standard Vietnam MOET grading rules:
 * ĐTB = (TX1 * 1 + TX2 * 1 + GK * 2 + CK * 3) / Total_Coefficients
 */
export function calculateAverageScore(student: ClassroomStudent): number | null {
  const scoresWithWeights: { score: number; weight: number }[] = [];

  if (student.regularScore1 !== null && !isNaN(student.regularScore1)) {
    scoresWithWeights.push({ score: student.regularScore1, weight: 1 });
  }
  if (student.regularScore2 !== null && !isNaN(student.regularScore2)) {
    scoresWithWeights.push({ score: student.regularScore2, weight: 1 });
  }
  if (student.midtermScore !== null && !isNaN(student.midtermScore)) {
    scoresWithWeights.push({ score: student.midtermScore, weight: 2 });
  }
  if (student.finalScore !== null && !isNaN(student.finalScore)) {
    scoresWithWeights.push({ score: student.finalScore, weight: 3 });
  }

  if (scoresWithWeights.length === 0) return null;

  const totalWeighted = scoresWithWeights.reduce((sum, item) => sum + item.score * item.weight, 0);
  const totalWeight = scoresWithWeights.reduce((sum, item) => sum + item.weight, 0);

  const avg = totalWeighted / totalWeight;
  return Math.round(avg * 10) / 10;
}

/**
 * Determines academic ranking according to Vietnamese secondary/high school regulations.
 */
export function getAcademicRank(avg: number | null): {
  rank: AcademicRank;
  badgeClass: string;
  textColor: string;
} {
  if (avg === null) {
    return {
      rank: 'Chưa đủ điểm',
      badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700',
      textColor: 'text-slate-500 dark:text-slate-400'
    };
  }

  if (avg >= 9.0) {
    return {
      rank: 'Xuất sắc',
      badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      textColor: 'text-purple-600 dark:text-purple-400'
    };
  }
  if (avg >= 8.0) {
    return {
      rank: 'Giỏi',
      badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    };
  }
  if (avg >= 6.5) {
    return {
      rank: 'Khá',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      textColor: 'text-blue-600 dark:text-blue-400'
    };
  }
  if (avg >= 5.0) {
    return {
      rank: 'Đạt',
      badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      textColor: 'text-amber-600 dark:text-amber-400'
    };
  }

  return {
    rank: 'Cần cố gắng',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700',
    textColor: 'text-rose-600 dark:text-rose-400'
  };
}

export interface ClassroomStatistics {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  excellentCount: number;
  goodCount: number;
  fairCount: number;
  passCount: number;
  needHelpCount: number;
  zaloConnectedCount: number;
}

/**
 * Calculates aggregate stats for the entire class.
 */
export function calculateClassroomStatistics(students: ClassroomStudent[]): ClassroomStatistics {
  if (!students || students.length === 0) {
    return {
      totalStudents: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      excellentCount: 0,
      goodCount: 0,
      fairCount: 0,
      passCount: 0,
      needHelpCount: 0,
      zaloConnectedCount: 0
    };
  }

  const validAverages: number[] = [];
  let excellent = 0;
  let good = 0;
  let fair = 0;
  let pass = 0;
  let needHelp = 0;
  let zaloCount = 0;

  for (const s of students) {
    if (s.parentPhone && s.parentPhone.trim().length >= 9) {
      zaloCount++;
    }

    const avg = calculateAverageScore(s);
    if (avg !== null) {
      validAverages.push(avg);
      if (avg >= 9.0) excellent++;
      else if (avg >= 8.0) good++;
      else if (avg >= 6.5) fair++;
      else if (avg >= 5.0) pass++;
      else needHelp++;
    }
  }

  const avgClass = validAverages.length > 0
    ? Math.round((validAverages.reduce((a, b) => a + b, 0) / validAverages.length) * 10) / 10
    : 0;

  const highest = validAverages.length > 0 ? Math.max(...validAverages) : 0;
  const lowest = validAverages.length > 0 ? Math.min(...validAverages) : 0;

  return {
    totalStudents: students.length,
    averageScore: avgClass,
    highestScore: highest,
    lowestScore: lowest,
    excellentCount: excellent,
    goodCount: good,
    fairCount: fair,
    passCount: pass,
    needHelpCount: needHelp,
    zaloConnectedCount: zaloCount
  };
}

/**
 * Generates CSV string for teacher download, including UTF-8 BOM so Vietnamese characters display properly in Excel.
 */
export function generateClassroomCsv(students: ClassroomStudent[], className: string = 'Lớp 10A2'): string {
  const headers = [
    'STT',
    'Họ và Tên',
    'Ngày Sinh',
    'Email Cá Nhân',
    'SĐT / Zalo Phụ Huynh',
    'Điểm TX 1 (Hệ số 1)',
    'Điểm TX 2 (Hệ số 1)',
    'Điểm Giữa Kì (Hệ số 2)',
    'Điểm Cuối Kì (Hệ số 3)',
    'Điểm TB Môn',
    'Xếp Loại',
    'Ghi Chú'
  ];

  const rows = students.map((s, idx) => {
    const avg = calculateAverageScore(s);
    const rank = getAcademicRank(avg).rank;
    return [
      idx + 1,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.dob}"`,
      `"${s.email}"`,
      `"${s.parentPhone}"`,
      s.regularScore1 ?? '',
      s.regularScore2 ?? '',
      s.midtermScore ?? '',
      s.finalScore ?? '',
      avg ?? '',
      `"${rank}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  // UTF-8 BOM \uFEFF ensures Vietnamese diacritics render perfectly in Microsoft Excel
  return '\uFEFF' + `DANH SÁCH & BẢNG ĐIỂM HỌC SINH - ${className}\n` + headers.join(',') + '\n' + rows.join('\n');
}
