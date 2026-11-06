import { StudentRecord } from '../utils/education';

export interface LectureSample {
  id: string;
  subject: string;
  grade: string;
  title: string;
  summary: string;
  rawText: string;
  mindmap: {
    centralNode: { id: string; label: string; description: string };
    branches: {
      id: string;
      label: string;
      color: string;
      description: string;
      children: { id: string; label: string; detail: string; formula?: string }[];
    }[];
  };
  slides: {
    slideNumber: number;
    title: string;
    keyPoints: string[];
    visualPrompt: string;
    teacherCallout: string;
  }[];
  videoScenes: {
    sceneNumber: number;
    title: string;
    duration: string;
    visualAction: string;
    voiceoverScript: string;
  }[];
}

export const SAMPLE_LECTURES: LectureSample[] = [
  {
    id: 'lec-bio-11',
    subject: 'Sinh học',
    grade: 'Lớp 11',
    title: 'Quang Hợp Ở Thực Vật & Hai Pha Phản Ứng',
    summary: 'Phân tích bản chất pha sáng (tại Thylakoid) và pha tối (chu trình Calvin tại chất nền Stroma), phương trình năng lượng và vai trò với sinh quyển.',
    rawText: `QUANG HỢP Ở THỰC VẬT (BÀI 8 - SINH HỌC 11)
I. KHÁI QUÁT VỀ QUANG HỢP
1. Định nghĩa: Là quá trình biến đổi năng lượng ánh sáng mặt trời thành năng lượng hóa học trong các hợp chất hữu cơ (C6H12O6) từ CO2 và H2O.
2. Phương trình tổng quát: 6CO2 + 12H2O -> C6H12O6 + 6O2 + 6H2O (Điều kiện: Ánh sáng, Diệp lục)

II. HAI PHA CỦA QUANG HỢP
1. Pha sáng (Diễn ra tại màng Thylakoid của lục lạp):
- Hấp thụ năng lượng photon ánh sáng bởi sắc tố diệp lục a, b và carotenoid.
- Quang phân ly nước: 2H2O -> 4H+ + 4e- + O2 (O2 giải phóng vào khí quyển).
- Tổng hợp phân tử mang năng lượng ATP và chất khử NADPH.
2. Pha tối (Chu trình Calvin - Diễn ra tại chất nền Stroma):
- Cố định CO2 nhờ enzyme RuBisCO tạo 3-PGA.
- Khử 3-PGA thành G3P (sử dụng ATP và NADPH từ pha sáng).
- Tái sinh chất nhận CO2 (RuBP) và tổng hợp Glucose.`,
    mindmap: {
      centralNode: {
        id: 'c1',
        label: 'Quang Hợp Ở Thực Vật',
        description: 'Quá trình đồng hóa carbon và tích lũy năng lượng sống cho toàn bộ sinh quyển.'
      },
      branches: [
        {
          id: 'b1',
          label: 'Bản Chất & Phương Trình',
          color: '#16a34a', // emerald
          description: 'Cơ sở hóa học và phương trình chuyển hóa năng lượng mặt trời.',
          children: [
            {
              id: 'c1-1',
              label: 'Phương trình tổng quát',
              detail: '6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O',
              formula: 'ΔG = +2870 kJ/mol'
            },
            {
              id: 'c1-2',
              label: 'Cơ quan quang hợp',
              detail: 'Lá cây với hệ gân lá dẫn nước và khí khổng trao đổi khí.',
              formula: 'Lục lạp (Chloroplast)'
            },
            {
              id: 'c1-3',
              label: 'Hệ sắc tố',
              detail: 'Diệp lục a (hấp thụ cực đại đỏ/xanh), diệp lục b và carôtenôit truyền năng lượng.'
            }
          ]
        },
        {
          id: 'b2',
          label: 'Pha Sáng (Màng Thylakoid)',
          color: '#0284c7', // cyan/blue
          description: 'Pha phụ thuộc ánh sáng, giải phóng O₂ và tích trữ ATP, NADPH.',
          children: [
            {
              id: 'c2-1',
              label: 'Quang phân ly nước',
              detail: 'Nước bị bẻ gãy tạo proton H+, electron và khí oxy tự do.',
              formula: '2 H₂O → 4 H⁺ + 4 e⁻ + O₂↑'
            },
            {
              id: 'c2-2',
              label: 'Chuỗi chuyền electron',
              detail: 'Electron dịch chuyển qua Photosystem II và Photosystem I tạo gradient proton.'
            },
            {
              id: 'c2-3',
              label: 'Sản phẩm pha sáng',
              detail: 'Cung cấp năng lượng ATP và chất khử NADPH cho pha tối tiếp theo.'
            }
          ]
        },
        {
          id: 'b3',
          label: 'Pha Tối (Chu Trình Calvin)',
          color: '#d97706', // amber
          description: 'Pha đồng hóa CO₂ trong chất nền Stroma không cần ánh sáng trực tiếp.',
          children: [
            {
              id: 'c3-1',
              label: 'Giai đoạn 1: Cố định CO₂',
              detail: 'CO₂ kết hợp với RuBP dưới xúc tác của enzyme RuBisCO tạo 3-PGA.'
            },
            {
              id: 'c3-2',
              label: 'Giai đoạn 2: Khử 3-PGA',
              detail: 'Sử dụng ATP và NADPH biến 3-PGA thành đường G3P.'
            },
            {
              id: 'c3-3',
              label: 'Giai đoạn 3: Tái sinh RuBP',
              detail: 'Phần lớn G3P tái sinh chất nhận RuBP để tiếp tục vòng quay chu trình.'
            }
          ]
        },
        {
          id: 'b4',
          label: 'Ý Nghĩa & Ứng Dụng Nông Nghiệp',
          color: '#9333ea', // purple
          description: 'Cơ sở khoa học để tăng năng suất cây trồng và bảo vệ môi trường.',
          children: [
            {
              id: 'c4-1',
              label: 'Cung cấp oxy & chất hữu cơ',
              detail: 'Nguồn sống duy nhất nuôi dưỡng sinh giới và duy trì tầng ozon.'
            },
            {
              id: 'c4-2',
              label: 'Điều hòa ánh sáng & CO₂',
              detail: 'Ứng dụng nhà kính thông minh chiếu sáng bổ sung bằng đèn LED đơn sắc.'
            }
          ]
        }
      ]
    },
    slides: [
      {
        slideNumber: 1,
        title: 'Tổng Quan Quang Hợp & Hệ Sắc Tố',
        keyPoints: [
          'Lá là cơ quan quang hợp chuyên hóa cao độ về hình thái và giải phẫu.',
          'Hạt diệp lục chứa chất nền Stroma và các túi màng dẹp Thylakoid.',
          'Diệp lục a trực tiếp tham gia biến đổi quang năng thành hóa năng.'
        ],
        visualPrompt: 'Cấu trúc 3D cắt lớp lục lạp: Màng kép, chất nền Stroma và các cột Grana xếp lớp.',
        teacherCallout: 'Nhắc học sinh: Phân biệt rõ vị trí diễn ra của 2 pha để không bị nhầm lẫn trong bài kiểm tra.'
      },
      {
        slideNumber: 2,
        title: 'Bí Mật Pha Sáng: Cỗ Máy Sinh Năng Lượng',
        keyPoints: [
          'Vị trí: Màng Thylakoid (nơi có hệ thống sắc tố và enzyme tổng hợp ATP).',
          'Phương trình quang phân ly nước: 2H2O -> 4H+ + 4e- + O2.',
          'Năng lượng ánh sáng được khóa lại trong liên kết cao năng của ATP và NADPH.'
        ],
        visualPrompt: 'Mô hình chuyển động dòng electron qua phức hệ PSII và PSI, bơm ion H+ qua màng.',
        teacherCallout: 'Hỏi mở: Tại sao nếu không có nước thì chuỗi quang phân ly electron sẽ lập tức tê liệt?'
      },
      {
        slideNumber: 3,
        title: 'Pha Tối: Vòng Quay Thần Kỳ Calvin',
        keyPoints: [
          'Vị trí: Chất nền Stroma (không phụ thuộc trực tiếp vào ánh sáng nhưng cần sản phẩm pha sáng).',
          '3 giai đoạn chính: Cố định CO2 -> Khử phân tử -> Tái sinh chất nhận RuBP.',
          'Sản phẩm cuối cùng: Glucose và các hợp chất hữu cơ nuôi sống cây.'
        ],
        visualPrompt: 'Vòng tròn chu trình Calvin với 3 màu biểu diễn 3 giai đoạn và enzyme RuBisCO.',
        teacherCallout: 'Nhấn mạnh: Pha tối vẫn diễn ra ban ngày vì cần ATP và NADPH mới sản sinh từ pha sáng.'
      },
      {
        slideNumber: 4,
        title: 'Ứng Dụng Thực Tiễn: Tăng Năng Suất Cây Trồng',
        keyPoints: [
          'Tăng diện tích lá và mật độ gieo trồng hợp lý để thu nhận tối đa quang năng.',
          'Bón phân hợp lý: Nitơ tham gia cấu tạo phân tử diệp lục, Magie là nhân của diệp lục.',
          'Điều khiển nồng độ CO2 và ánh sáng trong mô hình nông nghiệp công nghệ cao.'
        ],
        visualPrompt: 'Nhà màng công nghệ cao trồng dưa lưới chiếu đèn LED quang phổ tối ưu.',
        teacherCallout: 'Giao nhiệm vụ dự án nhóm: Thiết kế kế hoạch chiếu sáng nhân tạo cho vườn rau mầm tại nhà.'
      }
    ],
    videoScenes: [
      {
        sceneNumber: 1,
        title: 'Mở đầu: Hơi thở của Trái Đất',
        duration: '0:00 - 0:45',
        visualAction: 'Cận cảnh giọt sương trên phiến lá xanh dưới ánh nắng ban mai, chuyển dần vào cấu trúc tế bào lá.',
        voiceoverScript: 'Chào các em! Có bao giờ các em tự hỏi, nguồn thức ăn và oxy nuôi sống hơn 8 tỷ người trên hành tinh này bắt nguồn từ đâu? Câu trả lời nằm ngay trong những phiến lá nhỏ bé...'
      },
      {
        sceneNumber: 2,
        title: 'Thâm nhập lục lạp: Pha sáng bùng nổ',
        duration: '0:45 - 2:10',
        visualAction: 'Camera 3D zoom xuyên qua màng tế bào vào lục lạp, các hạt photon ánh sáng bắn phá vào hạt diệp lục trên màng Thylakoid.',
        voiceoverScript: 'Tại màng Thylakoid, ánh sáng mặt trời kích thích các phân tử diệp lục. Nước bị tách đôi mãnh liệt, giải phóng oxy ra bầu khí quyển và nạp đầy năng lượng cho các phân tử ATP...'
      },
      {
        sceneNumber: 3,
        title: 'Nhà máy đường ngọt: Chu trình Calvin',
        duration: '2:10 - 3:50',
        visualAction: 'Không gian Stroma êm dịu, enzyme RuBisCO đón nhận khí CO2 từ không khí và nhào nặn thành chuỗi đường Glucose.',
        voiceoverScript: 'Bước sang chất nền Stroma, chu trình Calvin bắt đầu quay. Không cần ánh sáng trực tiếp, nhưng với năng lượng đã tích trữ từ pha sáng, CO2 được cố định thành những hạt đường nuôi cây lớn lên mỗi ngày.'
      },
      {
        sceneNumber: 4,
        title: 'Tổng kết & Câu hỏi thử thách',
        duration: '3:50 - 4:30',
        visualAction: 'Sơ đồ tóm tắt hai pha đồng hiện trên màn hình, xuất hiện câu hỏi đố vui tương tác.',
        voiceoverScript: 'Như vậy, quang hợp là sự kết hợp nhịp nhàng giữa pha sáng và pha tối. Hãy cùng thầy làm bài tập nhanh dưới đây để xem ai ghi nhớ bài tốt nhất nhé!'
      }
    ]
  },
  {
    id: 'lec-phy-10',
    subject: 'Vật lý',
    grade: 'Lớp 10',
    title: 'Ba Định Luật Newton & Các Lực Cơ Học',
    summary: 'Nắm vững định luật quán tính (I), phương trình động lực học F = ma (II), tương tác tương hỗ (III) và ứng dụng phân tích lực.',
    rawText: `BA ĐỊNH LUẬT NEWTON VỀ CHUYỂN ĐỘNG (VẬT LÝ 10)
I. ĐỊNH LUẬT I NEWTON (ĐỊNH LUẬT QUÁN TÍNH)
- Nếu một vật không chịu tác dụng của lực nào hoặc chịu tác dụng của các lực có hợp lực bằng không, thì vật đang đứng yên sẽ tiếp tục đứng yên, đang chuyển động sẽ tiếp tục chuyển động thẳng đều.
II. ĐỊNH LUẬT II NEWTON (PHƯƠNG TRÌNH ĐỘNG LỰC HỌC)
- Gia tốc của một vật cùng hướng với lực tác dụng lên vật. Độ lớn của gia tốc tỉ lệ thuận với độ lớn của lực và tỉ lệ nghịch với khối lượng của vật: F = m.a
III. ĐỊNH LUẬT III NEWTON (TƯƠNG TÁC HAI CHIỀU)
- Trong mọi trường hợp, khi vật A tác dụng lên vật B một lực, thì vật B cũng tác dụng lại vật A một lực. Hai lực này là hai lực trực đối: F_AB = - F_BA.`,
    mindmap: {
      centralNode: {
        id: 'cp1',
        label: 'Ba Định Luật Newton',
        description: 'Nền tảng của cơ học cổ điển mô tả mối quan hệ giữa lực và chuyển động.'
      },
      branches: [
        {
          id: 'bp1',
          label: 'Định luật I (Quán tính)',
          color: '#2563eb',
          description: 'Xu hướng bảo toàn trạng thái vận tốc của vật.',
          children: [
            { id: 'cp1-1', label: 'Điều kiện cân bằng', detail: 'Hợp lực ΣF = 0 → gia tốc a = 0' },
            { id: 'cp1-2', label: 'Quán tính', detail: 'Đặc tính giữ nguyên vận tốc cả về hướng và độ lớn' },
            { id: 'cp1-3', label: 'Ứng dụng an toàn', detail: 'Thắt dây an toàn trên ô tô chống va đập khi phanh gấp' }
          ]
        },
        {
          id: 'bp2',
          label: 'Định luật II (F = m.a)',
          color: '#dc2626',
          description: 'Định lượng mối quan hệ giữa lực, khối lượng và gia tốc.',
          children: [
            { id: 'cp2-1', label: 'Công thức vector', detail: 'F = m · a', formula: '1 N = 1 kg·m/s²' },
            { id: 'cp2-2', label: 'Ý nghĩa khối lượng', detail: 'Khối lượng là đại lượng đo mức quán tính của vật' },
            { id: 'cp2-3', label: 'Phân tích lực', detail: 'Phương pháp chiếu lên trục tọa độ Oxy' }
          ]
        },
        {
          id: 'bp3',
          label: 'Định luật III (Hành động & Phản lực)',
          color: '#16a34a',
          description: 'Lực luôn xuất hiện theo từng cặp tương hỗ.',
          children: [
            { id: 'cp3-1', label: 'Cặp lực trực đối', detail: 'Cùng giá, cùng độ lớn, ngược chiều, đặt vào 2 vật khác nhau' },
            { id: 'cp3-2', label: 'Không triệt tiêu nhau', detail: 'Vì điểm đặt nằm trên hai vật thể riêng biệt' },
            { id: 'cp3-3', label: 'Ứng dụng phản lực', detail: 'Tên lửa phụt khí, mái chèo đẩy nước, bước chân trên mặt đất' }
          ]
        }
      ]
    },
    slides: [
      {
        slideNumber: 1,
        title: 'Định Luật I: Bí Ẩn Quán Tính',
        keyPoints: ['Mọi vật có khối lượng đều có quán tính.', 'Vật không tự đổi hướng hay tốc độ nếu không có ngoại lực.', 'Ví dụ đời sống: Người ngả về trước khi xe phanh đột ngột.'],
        visualPrompt: 'Minh họa hành khách trên xe buýt khi xe vào cua và phanh gấp.',
        teacherCallout: 'Hỏi học sinh: Tại sao hành tinh trong vũ trụ vẫn quay mãi mà không cần động cơ đẩy?'
      },
      {
        slideNumber: 2,
        title: 'Định Luật II: Trái Tim Của Động Lực Học',
        keyPoints: ['Gia tốc a = F / m.', 'Cùng một lực tác dụng, vật càng nặng thì gia tốc càng nhỏ.', 'Đơn vị đo lực là Newton (N).'],
        visualPrompt: 'So sánh chiếc xe tải và xe đạp cùng chịu một lực đẩy 100N.',
        teacherCallout: 'Luyện tập kỹ năng vẽ vector gia tốc cùng chiều với hợp lực.'
      }
    ],
    videoScenes: [
      {
        sceneNumber: 1,
        title: 'Newton và quả táo rơi',
        duration: '0:00 - 1:00',
        visualAction: 'Hình ảnh hoạt họa Isaac Newton ngồi dưới gốc cây, phân tích lực kéo của Trái Đất.',
        voiceoverScript: 'Chào các em, cơ học cổ điển đã làm thay đổi cả nền văn minh nhân loại kể từ khi Newton phát biểu 3 định luật kỳ diệu...'
      }
    ]
  },
  {
    id: 'lec-his-8',
    subject: 'Lịch sử',
    grade: 'Lớp 8',
    title: 'Khởi Nghĩa Lam Sơn (1418 - 1427) & Nghệ Thuật Quân Sự',
    summary: 'Diễn biến từ căn cứ Lam Sơn, chiến dịch giải phóng Nghệ An - Tân Bình - Thuận Hóa, đến chiến thắng quyết định Chi Lăng - Xương Giang.',
    rawText: `KHỞI NGHĨA LAM SƠN (1418 - 1427)
1. Bối cảnh: Đất nước dưới ách thống trị tàn bạo của nhà Minh sau khi nhà Hồ thất bại.
2. Lãnh tụ: Lê Lợi xưng Bình Định Vương, Nguyễn Trãi làm mưu sĩ soạn Bình Ngô Sách.
3. Các giai đoạn then chốt:
- Giai đoạn 1 (1418 - 1423): Khó khăn ở vùng núi rừng Thanh Hóa, 3 lần rút lên núi Chí Linh.
- Giai đoạn 2 (1424 - 1426): Kế sách của Nguyễn Chích, tiến vào giải phóng Nghệ An rồi mở rộng ra Tân Bình, Thuận Hóa.
- Giai đoạn 3 (1426 - 1427): Tiến quân ra Bắc, trận Tốt Động - Chúc Động và đỉnh cao Chi Lăng - Xương Giang đánh tan 15 vạn viện binh giặc.
4. Tinh thần nhân đạo: Hội thề Đông Quan, cấp thuyền và ngựa cho quân giặc rút về nước.`,
    mindmap: {
      centralNode: {
        id: 'ch1',
        label: 'Khởi Nghĩa Lam Sơn',
        description: 'Cuộc chiến tranh giải phóng dân tộc vĩ đại thế kỷ XV do Lê Lợi và Nguyễn Trãi lãnh đạo.'
      },
      branches: [
        {
          id: 'bh1',
          label: 'Giai Đoạn Căn Cứ Rừng Núi (1418 - 1423)',
          color: '#b45309',
          description: 'Thời kỳ gian khổ, tôi luyện ý chí nghĩa quân Lam Sơn.',
          children: [
            { id: 'ch1-1', label: 'Hội thề Lũng Nhai', detail: 'Lê Lợi cùng 18 tướng lĩnh kết nghĩa đồng tâm cứu nước.' },
            { id: 'ch1-2', label: 'Ba lần lên núi Chí Linh', detail: 'Nghĩa quân thiếu lương, ăn củ mài, Lê Lai liều mình cứu chúa.' }
          ]
        },
        {
          id: 'bh2',
          label: 'Chuyển Hướng Chiến Lược (1424 - 1425)',
          color: '#047857',
          description: 'Kế sách của Nguyễn Chích giải phóng vùng đất rộng lớn.',
          children: [
            { id: 'ch2-1', label: 'Giải phóng Nghệ An', detail: 'Tạo căn cứ hậu phương vững chắc và bàn đạp chiến lược.' },
            { id: 'ch2-2', label: 'Tiến về phía Nam', detail: 'Giải phóng Tân Bình, Thuận Hóa, thế trận bao vây Đông Quan hình thành.' }
          ]
        },
        {
          id: 'bh3',
          label: 'Chi Lăng - Xương Giang & Hòa Bình (1426 - 1427)',
          color: '#b91c1c',
          description: 'Đánh tan 15 vạn viện binh, kết thúc chiến tranh trong danh dự.',
          children: [
            { id: 'ch3-1', label: 'Tốt Động - Chúc Động', detail: 'Đánh úp tiêu diệt 5 vạn quân của Vương Thông.' },
            { id: 'ch3-2', label: 'Chém Liễu Thăng tại Chi Lăng', detail: 'Chiến thuật nhử địch mai phục hẻm núi hiểm trở.' },
            { id: 'ch3-3', label: 'Hội thề Đông Quan', detail: 'Cấp 500 thuyền và hàng nghìn ngựa cho quân Minh rút an toàn.' }
          ]
        }
      ]
    },
    slides: [
      {
        slideNumber: 1,
        title: 'Bình Định Vương Lê Lợi & Tinh Thần Nghĩa Sĩ',
        keyPoints: ['Hội thề Lũng Nhai năm 1416 đặt nền móng đoàn kết.', 'Tư tưởng "Lấy đại nghĩa để thắng hung tàn, lấy chí nhân để thay cường bạo".'],
        visualPrompt: 'Tái hiện không khí hào hùng tại căn cứ nghĩa quân Lam Sơn.',
        teacherCallout: 'Khắc sâu cho học sinh về lòng yêu nước và tinh thần vượt khó phi thường.'
      }
    ],
    videoScenes: [
      {
        sceneNumber: 1,
        title: 'Hịch Lam Sơn vang vọng',
        duration: '0:00 - 1:15',
        visualAction: 'Cờ lau khởi nghĩa tung bay trên đỉnh núi Lam Sơn trong sương sớm.',
        voiceoverScript: 'Mười năm nếm mật nằm gai, cuộc khởi nghĩa Lam Sơn không chỉ là thiên anh hùng ca mà còn là đỉnh cao của nghệ thuật quân sự Việt Nam...'
      }
    ]
  }
];

export const MOCK_STUDENTS_CLASS_10A: StudentRecord[] = [
  {
    id: 'hs-01',
    name: 'Nguyễn Văn An',
    score: 9.5,
    weakTopics: ['Tối ưu quang phổ đèn LED'],
    strongTopics: ['Pha sáng', 'Chu trình Calvin', 'Quang phân ly nước'],
    attendanceRate: 100,
    learningAttitude: 'Tích cực',
    parentPhone: '0912-345-671',
    parentName: 'Bác Nguyễn Văn Thành'
  },
  {
    id: 'hs-02',
    name: 'Trần Mai Chi',
    score: 8.8,
    weakTopics: ['Cơ chế thích nghi C4/CAM'],
    strongTopics: ['Cấu tạo màng Thylakoid', 'Phương trình tổng quát'],
    attendanceRate: 97,
    learningAttitude: 'Chăm chỉ',
    parentPhone: '0988-123-452',
    parentName: 'Cô Lê Thị Thu Hà'
  },
  {
    id: 'hs-03',
    name: 'Lê Hoàng Nam',
    score: 5.4,
    weakTopics: ['Chu trình Calvin', 'Vai trò của ATP/NADPH'],
    strongTopics: ['Nhận biết lá cây', 'Ý nghĩa quang hợp'],
    attendanceRate: 89,
    learningAttitude: 'Cần tập trung hơn',
    parentPhone: '0903-567-893',
    parentName: 'Chú Lê Văn Toàn'
  },
  {
    id: 'hs-04',
    name: 'Phạm Thuỳ Linh',
    score: 7.8,
    weakTopics: ['Tính số phân tử ATP tiêu hao'],
    strongTopics: ['Khái niệm pha sáng', 'Quang phân ly nước'],
    attendanceRate: 98,
    learningAttitude: 'Chăm chỉ',
    parentPhone: '0977-889-914',
    parentName: 'Cô Phạm Bích Ngọc'
  },
  {
    id: 'hs-05',
    name: 'Vũ Đức Minh',
    score: 4.8,
    weakTopics: ['Phương trình tổng quát', 'Chu trình Calvin', 'Quang phân ly'],
    strongTopics: ['Cơ bản về quang hợp'],
    attendanceRate: 83,
    learningAttitude: 'Cần tập trung hơn',
    parentPhone: '0914-223-345',
    parentName: 'Bác Vũ Đức Thắng'
  },
  {
    id: 'hs-06',
    name: 'Đặng Bảo Ngọc',
    score: 9.0,
    weakTopics: ['Điểm bù ánh sáng'],
    strongTopics: ['Tất cả các pha', 'Phương trình hóa học'],
    attendanceRate: 100,
    learningAttitude: 'Nhiệt huyết',
    parentPhone: '0933-445-566',
    parentName: 'Cô Đặng Kim Oanh'
  },
  {
    id: 'hs-07',
    name: 'Hoàng Quốc Tuấn',
    score: 6.2,
    weakTopics: ['Phân biệt màng Thylakoid và Stroma', 'Vai trò RuBisCO'],
    strongTopics: ['Sản phẩm oxy', 'Khái quát'],
    attendanceRate: 92,
    learningAttitude: 'Chăm chỉ',
    parentPhone: '0945-667-788',
    parentName: 'Chú Hoàng Văn Hùng'
  },
  {
    id: 'hs-08',
    name: 'Bùi Gia Huy',
    score: 7.2,
    weakTopics: ['Biến đổi năng lượng photon'],
    strongTopics: ['Phương trình tổng quát', 'Ý nghĩa'],
    attendanceRate: 95,
    learningAttitude: 'Tích cực',
    parentPhone: '0908-112-233',
    parentName: 'Bác Bùi Quang Huy'
  },
  {
    id: 'hs-09',
    name: 'Ngô Khánh Linh',
    score: 8.5,
    weakTopics: ['Hiệu suất quang hợp thực tế'],
    strongTopics: ['Pha sáng', 'Hệ sắc tố diệp lục'],
    attendanceRate: 99,
    learningAttitude: 'Nhiệt huyết',
    parentPhone: '0981-445-567',
    parentName: 'Cô Ngô Thị Mai Lan'
  },
  {
    id: 'hs-10',
    name: 'Đỗ Tiến Dũng',
    score: 5.8,
    weakTopics: ['Chu trình Calvin', 'Cố định CO2'],
    strongTopics: ['Phương trình cơ bản'],
    attendanceRate: 90,
    learningAttitude: 'Cần tập trung hơn',
    parentPhone: '0972-334-455',
    parentName: 'Chú Đỗ Văn Hải'
  },
  {
    id: 'hs-11',
    name: 'Lý Thanh Hà',
    score: 9.8,
    weakTopics: [],
    strongTopics: ['Thấu suốt toàn bộ chương trình', 'Tư duy liên môn'],
    attendanceRate: 100,
    learningAttitude: 'Nhiệt huyết',
    parentPhone: '0919-887-766',
    parentName: 'Bác Lý Minh Quân'
  },
  {
    id: 'hs-12',
    name: 'Võ Minh Khang',
    score: 7.0,
    weakTopics: ['Quang phân ly nước'],
    strongTopics: ['Chu trình Calvin'],
    attendanceRate: 94,
    learningAttitude: 'Tích cực',
    parentPhone: '0966-221-133',
    parentName: 'Cô Võ Thị Lan Anh'
  }
];
