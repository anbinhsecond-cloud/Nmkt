import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeClassPerformance,
  generateHomeworkForTier,
  generateParentReportText,
  StudentRecord
} from './education';

const mockStudents: StudentRecord[] = [
  {
    id: 's1',
    name: 'Nguyễn Văn An',
    score: 9.2,
    weakTopics: ['Đồ thị quang hợp C4'],
    strongTopics: ['Pha sáng', 'Chu trình Calvin'],
    attendanceRate: 100,
    learningAttitude: 'Tích cực',
    parentPhone: '0912345678',
    parentName: 'Bác Nguyễn Văn Thành'
  },
  {
    id: 's2',
    name: 'Trần Mai Chi',
    score: 7.5,
    weakTopics: ['Quang phân ly nước', 'Cân bằng ATP'],
    strongTopics: ['Cấu tạo lục lạp'],
    attendanceRate: 98,
    learningAttitude: 'Chăm chỉ',
    parentPhone: '0987654321',
    parentName: 'Cô Lê Thu Hà'
  },
  {
    id: 's3',
    name: 'Lê Hoàng Nam',
    score: 5.2,
    weakTopics: ['Quang phân ly nước', 'Phương trình tổng quát'],
    strongTopics: ['Khái niệm cơ bản'],
    attendanceRate: 88,
    learningAttitude: 'Cần tập trung hơn',
    parentPhone: '0901234567',
    parentName: 'Chú Lê Văn Toàn'
  }
];

test('analyzeClassPerformance calculates score distribution and tiers correctly', () => {
  const result = analyzeClassPerformance(mockStudents);

  assert.equal(result.totalStudents, 3);
  assert.equal(result.highestScore, 9.2);
  assert.equal(result.lowestScore, 5.2);
  // (9.2 + 7.5 + 5.2) / 3 = 21.9 / 3 = 7.3
  assert.equal(result.averageScore, 7.3);
  assert.equal(result.passRate, 100);
  assert.equal(result.goodRate, 33); // 1 out of 3 is >= 8.0

  assert.equal(result.reinforceTier.length, 1);
  assert.equal(result.reinforceTier[0].name, 'Lê Hoàng Nam');

  assert.equal(result.standardTier.length, 1);
  assert.equal(result.standardTier[0].name, 'Trần Mai Chi');

  assert.equal(result.advancedTier.length, 1);
  assert.equal(result.advancedTier[0].name, 'Nguyễn Văn An');

  // Most frequent weakness is 'Quang phân ly nước' (2 students out of 3 = 67%)
  assert.equal(result.topWeaknesses[0].topic, 'Quang phân ly nước');
  assert.equal(result.topWeaknesses[0].errorPercentage, 67);
});

test('generateHomeworkForTier returns tailored content and reasonable question count', () => {
  const reinforceHw = generateHomeworkForTier('reinforce', 'Sinh học 11');
  assert.equal(reinforceHw.tier, 'reinforce');
  assert.equal(reinforceHw.questionCount, 8);
  assert.ok(reinforceHw.sampleQuestions[0].hint);

  const advancedHw = generateHomeworkForTier('advanced', 'Sinh học 11');
  assert.equal(advancedHw.tier, 'advanced');
  assert.ok(advancedHw.description.includes('đồ thị'));

  // When subject or weakTopic is Calculus/Integrals, returns math questions instead of biology
  const mathHw = generateHomeworkForTier('reinforce', 'Toán học (Giải tích 12)', 'Tính diện tích bằng tích phân');
  assert.ok(mathHw.targetAudience.includes('Tính diện tích'));
  assert.ok(mathHw.sampleQuestions[0].question.includes('tích phân') || mathHw.sampleQuestions[0].question.includes('diện tích'));
  assert.ok(!mathHw.sampleQuestions[0].question.toLowerCase().includes('quang hợp'));
});

test('generateParentReportText formats respectful message with proper placeholders', () => {
  const text = generateParentReportText(mockStudents[0], 'Thầy Nam', 'Lớp 10A2', 'encouraging');
  assert.ok(text.includes('Kính gửi Quý Phụ huynh em Nguyễn Văn An'));
  assert.ok(text.includes('9.2/10'));
  assert.ok(text.includes('Thầy Nam - Lớp 10A2'));
});
