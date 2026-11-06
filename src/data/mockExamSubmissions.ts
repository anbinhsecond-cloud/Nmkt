/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentExamSubmission } from '../utils/examScanner';

export interface ExamDatasetPreset {
  id: string;
  name: string;
  subject: string;
  grade: string;
  className: string;
  examTitle: string;
  duration: string;
  description: string;
  submissions: StudentExamSubmission[];
}

export const PRESET_EXAM_DATASETS: ExamDatasetPreset[] = [
  {
    id: 'bio-11-photo',
    name: 'Sinh học 11: Quang hợp & Hai pha phản ứng',
    subject: 'Sinh học 11',
    grade: 'Lớp 11',
    className: 'Lớp 10A2',
    examTitle: 'Kỳ khảo sát định kỳ tháng 10 - Sinh học 11',
    duration: 'Bài 45 phút',
    description: 'Khảo sát 36 bài thi thực tế về Bản chất quang hợp, Màng Thylakoid, Chu trình Calvin và Thực vật C4/CAM.',
    submissions: [
      {
        id: 's-01',
        studentName: 'Nguyễn Hải Nam',
        score: 8.8,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)', 'Phần 2: Quang phân ly nước & Pha sáng'],
        wrongSections: ['Phần 3: Chu trình Calvin & Enzyme RuBisCO'],
        notes: 'Nắm vững lý thuyết cơ bản, nhầm chất nhận CO2 ban đầu'
      },
      {
        id: 's-02',
        studentName: 'Trần Thị Thu Hà',
        score: 9.6,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)', 'Phần 2: Quang phân ly nước & Pha sáng', 'Phần 3: Chu trình Calvin & Enzyme RuBisCO', 'Phần 4: Cơ chế thích nghi thực vật C4/CAM'],
        wrongSections: [],
        notes: 'Bài làm xuất sắc, nắm trọn vẹn bản chất 2 pha'
      },
      {
        id: 's-03',
        studentName: 'Lê Hoàng Long',
        score: 6.7,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)'],
        wrongSections: ['Phần 2: Quang phân ly nước & Pha sáng', 'Phần 3: Chu trình Calvin & Enzyme RuBisCO'],
        notes: 'Chưa hiểu cơ chế tạo ATP & NADPH ở pha sáng'
      },
      {
        id: 's-04',
        studentName: 'Phạm Minh Khôi',
        score: 4.4,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)'],
        wrongSections: ['Phần 2: Quang phân ly nước & Pha sáng', 'Phần 3: Chu trình Calvin & Enzyme RuBisCO', 'Phần 4: Cơ chế thích nghi thực vật C4/CAM'],
        notes: 'Hổng kiến thức nặng ở chu trình Calvin và phương trình hóa năng'
      },
      {
        id: 's-05',
        studentName: 'Hoàng Bảo Ngọc',
        score: 8.3,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)', 'Phần 2: Quang phân ly nước & Pha sáng'],
        wrongSections: ['Phần 3: Chu trình Calvin & Enzyme RuBisCO'],
        notes: 'Lúng túng ở câu hỏi tính toán hiệu suất photon'
      },
      {
        id: 's-06',
        studentName: 'Vũ Đức Thành',
        score: 6.6,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)', 'Phần 4: Cơ chế thích nghi thực vật C4/CAM'],
        wrongSections: ['Phần 2: Quang phân ly nước & Pha sáng', 'Phần 3: Chu trình Calvin & Enzyme RuBisCO'],
        notes: 'Cần giảng lại chuỗi chuyền electron màng Thylakoid'
      },
      {
        id: 's-07',
        studentName: 'Đặng Ngọc Ánh',
        score: 9.3,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)', 'Phần 2: Quang phân ly nước & Pha sáng', 'Phần 4: Cơ chế thích nghi thực vật C4/CAM'],
        wrongSections: ['Phần 3: Chu trình Calvin & Enzyme RuBisCO'],
        notes: 'Điểm rất cao, chỉ sai 1 câu vận dụng RuBisCO'
      },
      {
        id: 's-08',
        studentName: 'Ngô Quang Huy',
        score: 4.9,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)'],
        wrongSections: ['Phần 2: Quang phân ly nước & Pha sáng', 'Phần 3: Chu trình Calvin & Enzyme RuBisCO'],
        notes: 'Cần kèm cặp thêm bài tập củng cố sau giờ học'
      },
      {
        id: 's-09',
        studentName: 'Bùi Gia Huy',
        score: 7.2,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)', 'Phần 2: Quang phân ly nước & Pha sáng'],
        wrongSections: ['Phần 3: Chu trình Calvin & Enzyme RuBisCO'],
        notes: 'Nhầm sản phẩm cố định CO2 ở thực vật CAM'
      },
      {
        id: 's-10',
        studentName: 'Đỗ Tiến Dũng',
        score: 5.8,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)'],
        wrongSections: ['Phần 2: Quang phân ly nước & Pha sáng', 'Phần 3: Chu trình Calvin & Enzyme RuBisCO'],
        notes: 'Chưa nhớ công thức tổng quát của quang hợp'
      },
      {
        id: 's-11',
        studentName: 'Lý Thanh Hà',
        score: 9.8,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)', 'Phần 2: Quang phân ly nước & Pha sáng', 'Phần 3: Chu trình Calvin & Enzyme RuBisCO', 'Phần 4: Cơ chế thích nghi thực vật C4/CAM'],
        wrongSections: [],
        notes: 'Thủ khoa lớp, giải thích cặn kẽ thí nghiệm thực hành'
      },
      {
        id: 's-12',
        studentName: 'Võ Minh Khang',
        score: 7.0,
        correctSections: ['Phần 1: Trắc nghiệm nhận biết (10 câu)', 'Phần 2: Quang phân ly nước & Pha sáng'],
        wrongSections: ['Phần 3: Chu trình Calvin & Enzyme RuBisCO', 'Phần 4: Cơ chế thích nghi thực vật C4/CAM'],
        notes: 'Cần rèn luyện thêm kỹ năng đọc biểu đồ quang phổ'
      }
    ]
  },
  {
    id: 'phys-10-newton',
    name: 'Vật lý 10: Ba Định Luật Newton & Lực Cơ Học',
    subject: 'Vật lý 10',
    grade: 'Lớp 10',
    className: 'Lớp 10A1',
    examTitle: 'Bài kiểm tra 1 tiết Định Luật II & Lực Ma Sát',
    duration: 'Bài 45 phút',
    description: 'Khảo sát 35 bài thi về Quán tính, Định luật II Newton (F=ma), Lực ma sát và Mặt phẳng nghiêng.',
    submissions: [
      {
        id: 'p-01',
        studentName: 'Nguyễn Tuấn Kiệt',
        score: 8.5,
        correctSections: ['Phần 1: Khái niệm quán tính & Lực (8 câu)', 'Phần 2: Định luật II Newton (F = ma)'],
        wrongSections: ['Phần 3: Phân tích lực trên mặt phẳng nghiêng'],
        notes: 'Chiếu sai góc alpha khi tính gia tốc a'
      },
      {
        id: 'p-02',
        studentName: 'Trịnh Mai Phương',
        score: 9.2,
        correctSections: ['Phần 1: Khái niệm quán tính & Lực (8 câu)', 'Phần 2: Định luật II Newton (F = ma)', 'Phần 3: Lực ma sát trượt và phản lực N'],
        wrongSections: [],
        notes: 'Vẽ giản đồ vector lực chuẩn xác'
      },
      {
        id: 'p-03',
        studentName: 'Đoàn Quốc Bảo',
        score: 4.8,
        correctSections: ['Phần 1: Khái niệm quán tính & Lực (8 câu)'],
        wrongSections: ['Phần 2: Định luật II Newton (F = ma)', 'Phần 3: Lực ma sát trượt và phản lực N', 'Phần 4: Chuyển động trên mặt phẳng nghiêng'],
        notes: 'Nhầm lẫn giữa khối lượng m và trọng lượng P'
      },
      {
        id: 'p-04',
        studentName: 'Vũ Thùy Linh',
        score: 7.0,
        correctSections: ['Phần 1: Khái niệm quán tính & Lực (8 câu)', 'Phần 2: Định luật II Newton (F = ma)'],
        wrongSections: ['Phần 4: Chuyển động trên mặt phẳng nghiêng'],
        notes: 'Quên cộng lực kéo Fk khi vật đi lên'
      }
    ]
  }
];
