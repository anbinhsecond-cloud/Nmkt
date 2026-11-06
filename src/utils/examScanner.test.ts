/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCsvExamSubmissions,
  analyzeExamSubmissions,
  generateSampleExamCsv,
  generateSampleExamXlsx,
  parseUniversalExamFile,
  cleanSectionName
} from './examScanner';

describe('exam scanner tests', () => {
  it('parses CSV submissions correctly', () => {
    const csv = `Tên học sinh,Điểm,Đúng,Sai
1,Nguyễn Văn A,8.5,"Phần 1: Nhận biết;Phần 2: Thông hiểu","Phần 3: Vận dụng"
2,Trần Thị B,9.0,"Phần 1: Nhận biết;Phần 2: Thông hiểu;Phần 3: Vận dụng",""
3,Lê Văn C,4.0,"Phần 1: Nhận biết","Phần 2: Thông hiểu;Phần 3: Vận dụng"`;

    const parsed = parseCsvExamSubmissions(csv);
    assert.equal(parsed.length, 3);
    assert.equal(parsed[0].studentName, 'Nguyễn Văn A');
    assert.equal(parsed[0].score, 8.5);
    assert.equal(parsed[0].correctSections.length, 2);
    assert.equal(parsed[0].wrongSections.length, 1);
  });

  it('analyzes section correct & wrong percentages accurately', () => {
    const submissions = [
      {
        id: '1',
        studentName: 'Em A',
        score: 9.0,
        correctSections: ['Phần 1', 'Phần 2'],
        wrongSections: []
      },
      {
        id: '2',
        studentName: 'Em B',
        score: 7.0,
        correctSections: ['Phần 1'],
        wrongSections: ['Phần 2']
      },
      {
        id: '3',
        studentName: 'Em C',
        score: 5.0,
        correctSections: ['Phần 1'],
        wrongSections: ['Phần 2']
      },
      {
        id: '4',
        studentName: 'Em D',
        score: 4.0,
        correctSections: [],
        wrongSections: ['Phần 1', 'Phần 2']
      }
    ];

    const report = analyzeExamSubmissions(submissions);
    assert.equal(report.totalSubmissions, 4);
    assert.equal(report.averageScore, 6.3);

    // Phần 1: 3/4 correct = 75%, 1/4 wrong = 25%
    // Phần 2: 1/4 correct = 25%, 3/4 wrong = 75%
    const p1 = report.sectionDiagnostics.find((s) => s.sectionName === 'Phần 1');
    const p2 = report.sectionDiagnostics.find((s) => s.sectionName === 'Phần 2');

    assert.ok(p1);
    assert.ok(p2);
    assert.equal(p1?.correctPercentage, 75);
    assert.equal(p1?.wrongPercentage, 25);
    assert.equal(p2?.correctPercentage, 25);
    assert.equal(p2?.wrongPercentage, 75);
    assert.equal(p2?.status, 'critical');

    assert.equal(report.mostCorrectSection?.sectionName, 'Phần 1');
    assert.equal(report.mostWrongSection?.sectionName, 'Phần 2');
  });

  it('generates sample CSV with UTF-8 BOM', () => {
    const sample = generateSampleExamCsv();
    assert.ok(sample.startsWith('\uFEFF'));
    assert.ok(sample.includes('Nguyễn Hải Nam'));
    assert.ok(sample.includes('Phần 3: Chu trình Calvin & Enzyme RuBisCO'));
  });

  it('generates valid XLSX Excel sample buffer', () => {
    const xlsxBuffer = generateSampleExamXlsx();
    assert.ok(xlsxBuffer instanceof Uint8Array);
    assert.ok(xlsxBuffer.length > 500); // Standard zip/xlsx container is at least a few KB
  });

  it('parses universal exam files for CSV text files', async () => {
    const csvContent = `STT,Tên học sinh,Điểm,Phần đúng,Phần sai
1,Trần Văn An,8.0,"Phần 1: Nhận biết","Phần 2: Vận dụng"`;
    const file = new File([csvContent], 'bang_diem.csv', { type: 'text/csv' });
    const result = await parseUniversalExamFile(file);
    assert.ok(result.submissions.length >= 1);
    assert.equal(result.submissions[0].studentName, 'Trần Văn An');
    assert.equal(result.submissions[0].score, 8.0);
  });

  it('cleanSectionName filters out header text, instructions and empty rows', () => {
    assert.equal(cleanSectionName('Các phần làm ĐÚNG (ngăn cách bằng dấu chấm phẩy ;)'), null);
    assert.equal(cleanSectionName('Các phần làm SAI (ngăn cách bằng dấu chấm phẩy ;)'), null);
    assert.equal(cleanSectionName('STT'), null);
    assert.equal(cleanSectionName('Tên học sinh'), null);
    assert.equal(cleanSectionName('Điểm số (0-10)'), null);
    assert.equal(cleanSectionName('Ghi chú của giáo viên'), null);
    assert.equal(cleanSectionName(''), null);
    assert.equal(cleanSectionName('   '), null);

    assert.equal(cleanSectionName('Tính diện tích bằng tích phân'), 'Tính diện tích bằng tích phân');
    assert.equal(cleanSectionName('Tính thể tích bằng tích phân'), 'Tính thể tích bằng tích phân');
    assert.equal(cleanSectionName('Tính độ dài bằng tích phân'), 'Tính độ dài bằng tích phân');
  });

  it('analyzeExamSubmissions rejects header rows and correctly infers subject', () => {
    const submissions = [
      {
        id: '1',
        studentName: 'Học sinh 1',
        score: 8.0,
        correctSections: ['Tính độ dài bằng tích phân', 'Các phần làm ĐÚNG (ngăn cách bằng dấu chấm phẩy ;)'],
        wrongSections: ['Tính diện tích bằng tích phân', 'Các phần làm SAI (ngăn cách bằng dấu chấm phẩy ;)']
      },
      {
        id: '2',
        studentName: 'Học sinh 2',
        score: 7.0,
        correctSections: ['Tính độ dài bằng tích phân'],
        wrongSections: ['Tính diện tích bằng tích phân', 'Tính thể tích bằng tích phân']
      }
    ];

    const report = analyzeExamSubmissions(submissions);
    // Header text must be discarded!
    assert.equal(report.sectionDiagnostics.some((s) => s.sectionName.includes('ngăn cách')), false);
    assert.equal(report.sectionDiagnostics.some((s) => s.sectionName.includes('ĐÚNG')), false);
    assert.equal(report.sectionDiagnostics.length, 3);
    assert.equal(report.subject, 'Toán học (Giải tích 12)');
  });
});
