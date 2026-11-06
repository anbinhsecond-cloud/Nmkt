export interface StudentRecord {
  id: string;
  name: string;
  score: number;
  weakTopics: string[];
  strongTopics: string[];
  attendanceRate: number; // percentage e.g. 96
  learningAttitude: 'Tích cực' | 'Chăm chỉ' | 'Cần tập trung hơn' | 'Nhiệt huyết';
  parentPhone: string;
  parentName: string;
}

export type StudentTier = 'reinforce' | 'standard' | 'advanced';

export interface ClassAnalysisResult {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number; // >= 5.0
  goodRate: number; // >= 8.0
  reinforceTier: StudentRecord[];
  standardTier: StudentRecord[];
  advancedTier: StudentRecord[];
  topWeaknesses: { topic: string; errorPercentage: number }[];
}

export interface HomeworkSet {
  tier: StudentTier;
  tierName: string;
  targetAudience: string;
  estimatedTime: string;
  questionCount: number;
  description: string;
  keySkills: string[];
  sampleQuestions: { id: number; question: string; difficulty: string; hint?: string }[];
}

/**
 * Analyzes classroom performance and categorizes students into 3 pedagogical tiers.
 */
export function analyzeClassPerformance(students: StudentRecord[]): ClassAnalysisResult {
  if (!students || students.length === 0) {
    return {
      totalStudents: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
      goodRate: 0,
      reinforceTier: [],
      standardTier: [],
      advancedTier: [],
      topWeaknesses: []
    };
  }

  const scores = students.map((s) => s.score);
  const totalStudents = students.length;
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  const averageScore = Math.round((sum / totalStudents) * 10) / 10;
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  const passingCount = students.filter((s) => s.score >= 5.0).length;
  const passRate = Math.round((passingCount / totalStudents) * 100);

  const goodCount = students.filter((s) => s.score >= 8.0).length;
  const goodRate = Math.round((goodCount / totalStudents) * 100);

  const reinforceTier = students.filter((s) => s.score < 6.5);
  const standardTier = students.filter((s) => s.score >= 6.5 && s.score < 8.5);
  const advancedTier = students.filter((s) => s.score >= 8.5);

  // Calculate weakness frequencies
  const topicCounts: Record<string, number> = {};
  for (const s of students) {
    for (const t of s.weakTopics) {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    }
  }

  const topWeaknesses = Object.entries(topicCounts)
    .map(([topic, count]) => ({
      topic,
      errorPercentage: Math.round((count / totalStudents) * 100)
    }))
    .sort((a, b) => b.errorPercentage - a.errorPercentage);

  return {
    totalStudents,
    averageScore,
    highestScore,
    lowestScore,
    passRate,
    goodRate,
    reinforceTier,
    standardTier,
    advancedTier,
    topWeaknesses
  };
}

/**
 * Generates tailored homework assignments corresponding to a student's tier and weak area.
 */
export function generateHomeworkForTier(
  tier: StudentTier,
  subject: string = '',
  weakTopic: string = ''
): HomeworkSet {
  const normSubject = (subject + ' ' + weakTopic).toLowerCase();
  const isMathOrIntegral =
    normSubject.includes('toán') ||
    normSubject.includes('tích phân') ||
    normSubject.includes('đạo hàm') ||
    normSubject.includes('nguyên hàm') ||
    normSubject.includes('diện tích') ||
    normSubject.includes('thể tích');

  if (isMathOrIntegral) {
    const focusLabel = weakTopic || 'Tính diện tích & thể tích bằng tích phân';
    switch (tier) {
      case 'reinforce':
        return {
          tier: 'reinforce',
          tierName: 'Nhóm 1: Củng Cố Căn Bản & Tự Tin',
          targetAudience: `Dành cho học sinh cần củng cố lại phần: ${focusLabel}`,
          estimatedTime: '20 - 25 phút',
          questionCount: 8,
          description: 'Bài tập tinh gọn, có kèm bảng tóm tắt công thức vi - tích phân và hướng dẫn từng bước (Step-by-step) để học sinh không bị áp lực.',
          keySkills: ['Nhận biết công thức nguyên hàm cơ bản', 'Thiết lập tích phân diện tích hình phẳng', 'Tránh nhầm lẫn dấu trị tuyệt đối'],
          sampleQuestions: [
            {
              id: 1,
              question: 'Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số y = x² - 4, trục hoành Ox và hai đường thẳng x = 0, x = 2.',
              difficulty: 'Nhận biết',
              hint: 'Áp dụng công thức S = ∫_a^b |f(x)|dx. Vì x² - 4 ≤ 0 trên đoạn [0, 2] nên bỏ dấu giá trị tuyệt đối ta có S = -∫_0^2 (x² - 4)dx.'
            },
            {
              id: 2,
              question: 'Tính thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi đường cong y = √x, trục Ox và các đường thẳng x = 1, x = 4 quanh trục Ox.',
              difficulty: 'Thông hiểu',
              hint: 'Sử dụng công thức V = π ∫_a^b [f(x)]² dx = π ∫_1^4 x dx = π [x²/2]_1^4.'
            },
            {
              id: 3,
              question: 'Tìm họ nguyên hàm F(x) của hàm số f(x) = 3x² - 2x + 1 và xác định F(1) biết F(0) = 2.',
              difficulty: 'Thông hiểu',
              hint: 'Nguyên hàm từng số hạng: F(x) = x³ - x² + x + C. Thay x = 0 được C = 2, từ đó tính F(1).'
            }
          ]
        };

      case 'standard':
        return {
          tier: 'standard',
          tierName: 'Nhóm 2: Luyện Tập Tiêu Chuẩn & Tốc Độ',
          targetAudience: 'Dành cho đa số học sinh rèn phản xạ và giải quyết bài toán giao điểm',
          estimatedTime: '30 - 35 phút',
          questionCount: 12,
          description: 'Tập trung vào bài toán diện tích giữa hai đồ thị giao nhau và thể tích xoay quanh trục tọa độ, rèn kỹ năng vẽ hình và bấm máy Casio kiểm tra.',
          keySkills: ['Tìm hoành độ giao điểm', 'Tích phân diện tích 2 hàm số S = ∫|f(x) - g(x)|dx', 'Tích phân từng phần'],
          sampleQuestions: [
            {
              id: 1,
              question: 'Tính diện tích hình phẳng giới hạn bởi hai parabol y = x² - 2x và y = -x² + 4x.',
              difficulty: 'Vận dụng',
              hint: 'Giải phương trình hoành độ giao điểm: x² - 2x = -x² + 4x ⇔ 2x² - 6x = 0 ⇔ x = 0 hoặc x = 3. Sau đó tính S = ∫_0^3 |2x² - 6x|dx.'
            },
            {
              id: 2,
              question: 'Một chi tiết máy có mặt cắt giới hạn bởi đường cong y = -x² + 4 và trục Ox (đơn vị: mét). Hãy tính thể tích khối tròn xoay khi quay mặt cắt này quanh trục Ox.',
              difficulty: 'Vận dụng',
              hint: 'Hai giao điểm với Ox là x = -2 và x = 2. Thể tích V = π ∫_{-2}^{2} (-x² + 4)² dx.'
            }
          ]
        };

      case 'advanced':
        return {
          tier: 'advanced',
          tierName: 'Nhóm 3: Nâng Cao Tư Duy & Ứng Dụng Thực Tế',
          targetAudience: 'Dành cho học sinh khá giỏi muốn chinh phục điểm 9 - 10 câu phân loại',
          estimatedTime: '40 - 45 phút',
          questionCount: 10,
          description: 'Bài toán mô hình hóa kiến trúc thực tế (vòm cầu parabol, bồn chứa elip) và bài toán tìm tham số m để diện tích đạt cực trị.',
          keySkills: ['Mô hình hóa hình học không gian', 'Ứng dụng tích phân tối ưu hóa diện tích', 'Tư duy liên môn Toán - Kỹ thuật'],
          sampleQuestions: [
            {
              id: 1,
              question: 'Một cổng chào hình parabol có chiều cao 4m và bề rộng chân cổng 6m. Ban tổ chức muốn lắp kính trang trí ở phần trên có diện tích bằng một nửa diện tích toàn cổng. Hãy tính chiều cao của phần lắp kính.',
              difficulty: 'Vận dụng cao',
              hint: 'Chọn hệ trục tọa độ với đỉnh parabol tại (0, 4), phương trình y = 4 - (4/9)x². Tích phân diện tích và giải phương trình diện tích bằng 1/2 tổng diện tích.'
            },
            {
              id: 2,
              question: 'Tìm tất cả các giá trị của tham số m > 0 sao cho diện tích hình phẳng giới hạn bởi parabol y = x² và đường thẳng y = mx bằng 9/2.',
              difficulty: 'Tư duy phân loại',
              hint: 'Phương trình giao điểm x² - mx = 0 có nghiệm x = 0 và x = m. Diện tích S = ∫_0^m (mx - x²)dx = m³/6. Cho m³/6 = 9/2 giải ra m = 3.'
            }
          ]
        };
    }
  }

  // Biology / General Science default
  switch (tier) {
    case 'reinforce':
      return {
        tier: 'reinforce',
        tierName: 'Nhóm 1: Củng Cố Căn Bản & Tự Tin',
        targetAudience: 'Dành cho học sinh cần ôn tập lại khái niệm cốt lõi',
        estimatedTime: '20 - 25 phút',
        questionCount: 8,
        description: 'Bài tập tinh gọn, có kèm bảng tóm tắt công thức và hướng dẫn từng bước (Step-by-step) để học sinh không bị áp lực.',
        keySkills: ['Nhận biết định nghĩa cơ bản', 'Áp dụng công thức 1 bước', 'Tránh bẫy dấu & đơn vị đo lường'],
        sampleQuestions: [
          {
            id: 1,
            question: 'Viết lại phương trình tổng quát của quang hợp và chỉ rõ chất tham gia, sản phẩm tạo thành.',
            difficulty: 'Nhận biết',
            hint: 'Nhớ lại 6 CO2 kết hợp với nước dưới ánh sáng và diệp lục.'
          },
          {
            id: 2,
            question: 'Pha sáng của quang hợp diễn ra tại cấu trúc nào trong lục lạp? Sản phẩm gồm những gì?',
            difficulty: 'Thông hiểu',
            hint: 'Diễn ra tại màng Thylakoid; tạo ra ATP, NADPH và khí Oxy.'
          },
          {
            id: 3,
            question: 'Tại sao khi thiếu ánh sáng, nồng độ O2 do cây thải ra lại giảm dần?',
            difficulty: 'Thông hiểu',
            hint: 'Liên hệ với quá trình quang phân ly nước trong pha sáng.'
          }
        ]
      };

    case 'standard':
      return {
        tier: 'standard',
        tierName: 'Nhóm 2: Luyện Tập Tiêu Chuẩn & Tốc Độ',
        targetAudience: 'Dành cho đa số học sinh rèn phản xạ và giải thích hiện tượng',
        estimatedTime: '30 - 35 phút',
        questionCount: 12,
        description: 'Tập trung vào câu hỏi thông hiểu sâu và vận dụng vừa phải, rèn luyện kỹ năng vẽ sơ đồ và tính toán thực tế.',
        keySkills: ['Giải thích hiện tượng sinh học', 'Phân tích chu trình Calvin', 'Tính hiệu suất năng lượng'],
        sampleQuestions: [
          {
            id: 1,
            question: 'So sánh vai trò của ATP và NADPH trong pha sáng và pha tối của quang hợp.',
            difficulty: 'Vận dụng',
            hint: 'Pha sáng tổng hợp năng lượng; pha tối tiêu thụ năng lượng để khử CO2.'
          },
          {
            id: 2,
            question: 'Một nông dân che bớt ánh sáng cho vườn rau ăn lá vào buổi trưa nắng gắt. Hãy giải thích tác dụng khoa học của hành động này.',
            difficulty: 'Thực tiễn',
            hint: 'Hiện tượng khép lỗ khí và quang hô hấp khi nhiệt độ quá cao.'
          }
        ]
      };

    case 'advanced':
      return {
        tier: 'advanced',
        tierName: 'Nhóm 3: Nâng Cao Tư Duy & Ứng Dụng Thực Tế',
        targetAudience: 'Dành cho học sinh khá giỏi muốn chinh phục điểm 9 - 10',
        estimatedTime: '40 - 45 phút',
        questionCount: 10,
        description: 'Bài toán mở, tích hợp đồ thị quang hợp theo cường độ ánh sáng và nồng độ CO2, phân tích dữ liệu thực nghiệm.',
        keySkills: ['Phân tích biểu đồ thực nghiệm', 'Tối ưu hóa nông nghiệp công nghệ cao', 'Tư duy liên môn Hóa - Sinh'],
        sampleQuestions: [
          {
            id: 1,
            question: 'Dựa vào đồ thị phụ thuộc quang hợp theo điểm bù ánh sáng và điểm bão hòa CO2, hãy đề xuất phương án chiếu sáng đèn LED tối ưu trong nhà kính thông minh.',
            difficulty: 'Vận dụng cao',
            hint: 'Khảo sát bước sóng đỏ (660nm) và xanh (450nm) tác động tới diệp lục a và b.'
          },
          {
            id: 2,
            question: 'Tại sao thực vật C4 và CAM lại có cơ chế cố định CO2 tiến hóa hơn thực vật C3 trong môi trường khô hạn?',
            difficulty: 'Tư duy phân tích',
            hint: 'Cơ chế giải quyết triệt để hiện tượng quang hô hấp của enzyme RuBisCO.'
          }
        ]
      };
  }
}

export type FeedbackTone = 'encouraging' | 'firm' | 'praising';

/**
 * Builds a respectful, pedagogical Vietnamese parent feedback report letter.
 */
export function generateParentReportText(
  student: StudentRecord,
  teacherName: string = 'Thầy Nguyễn Hoàng Nam',
  className: string = 'Lớp 10A2',
  tone: FeedbackTone = 'encouraging'
): string {
  const isHigh = student.score >= 8.0;
  const isModerate = student.score >= 6.5 && student.score < 8.0;

  let salutation = `Kính gửi Quý Phụ huynh em ${student.name},\n`;
  salutation += `Tôi là ${teacherName}, giáo viên phụ trách bộ môn tại ${className}.\n\n`;

  let evaluation = '';
  if (tone === 'praising' || (isHigh && tone !== 'firm')) {
    evaluation += `Về kết quả học tập tháng này, em ${student.name} đã thể hiện xuất sắc với điểm số ${student.score}/10. Em nắm rất chắc các kiến thức cốt lõi như ${student.strongTopics.join(', ')} và luôn có tinh thần học tập ${student.learningAttitude.toLowerCase()}.\n`;
  } else if (tone === 'firm') {
    evaluation += `Trong đợt khảo sát vừa qua, em ${student.name} đạt điểm số ${student.score}/10. Thầy nhận thấy em có tiềm năng và đã làm tốt phần ${student.strongTopics.join(', ')}, tuy nhiên em vẫn còn lúng túng ở phần ${student.weakTopics.join(', ')}. Tinh thần học tập hiện tại là "${student.learningAttitude}".\n`;
  } else {
    // encouraging default
    evaluation += `Thầy xin thông báo kết quả đợt kiểm tra vừa qua của em ${student.name}: Điểm số đạt ${student.score}/10. Em đã rất cố gắng và nắm vững ${student.strongTopics.join(', ')}. Đây là tín hiệu rất đáng khích lệ!\n`;
  }

  let actionPlan = '';
  if (student.weakTopics.length > 0) {
    actionPlan += `\n🎯 Điểm cần chú ý & Kế hoạch đồng hành:\n`;
    actionPlan += `- Thầy đã tạo riêng cho em một đề ôn tập cá nhân hóa ngắn (15-20 phút) để củng cố kỹ năng "${student.weakTopics[0]}".\n`;
    actionPlan += `- Kính mong Quý Phụ huynh nhắc nhở em dành khoảng 15 phút mỗi buổi tối để hoàn thành đề ôn tập này trên đường link thầy đã gửi kèm.\n`;
  } else {
    actionPlan += `\n🎯 Định hướng phát triển:\n- Thầy đã giao thêm các thử thách mở rộng để em tiếp tục bồi dưỡng năng khiếu và rèn luyện tư duy phản biện.\n`;
  }

  let closing = `\nSự đồng hành của gia đình là nguồn động viên quý báu nhất cho sự tiến bộ của em.\nTrân trọng cảm ơn Quý Phụ huynh!\n\n${teacherName} - ${className}`;

  return salutation + evaluation + actionPlan + closing;
}
