import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and large file uploads (PDF, DOCX, base64)
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize Google GenAI client according to AI Studio skill rules
// Must set 'User-Agent': 'aistudio-build'
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to reliably call Gemini with fallback across modern supported models if one encounters temporary spikes
async function callGeminiStructured<T>(params: {
  contents: any;
  systemInstruction?: string;
  responseSchema?: any;
}): Promise<T> {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {
        systemInstruction: params.systemInstruction,
        responseMimeType: 'application/json',
      };
      if (params.responseSchema) {
        config.responseSchema = params.responseSchema;
      }
      if (model === 'gemini-3.8-flash') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });

      const text = response.text?.trim();
      if (text) {
        return JSON.parse(text) as T;
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} attempt encountered:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('Không thể kết nối đến AI Gemini.');
}

// POST /api/gemini/visualize-lecture
// Accepts either raw text or uploaded file base64 (PDF, image, text)
app.post('/api/gemini/visualize-lecture', async (req: Request, res: Response) => {
  try {
    const { text, fileBase64, mimeType, fileName } = req.body;

    if (!text && !fileBase64) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp nội dung bài giảng hoặc tải tệp tài liệu lên.',
      });
    }

    const systemInstruction = `Bạn là một chuyên gia sư phạm hàng đầu và trợ lý giáo dục AI cao cấp (EduMaster AI) theo chương trình Giáo dục Phổ thông 2018 (CT GDPT 2018) của Việt Nam.
Nhiệm vụ của bạn là phân tích sâu sắc, khoa học, chính xác 100% nội dung bài giảng / giáo án hoặc chủ đề bài học được cung cấp.

QUY TẮC PHÂN TÍCH VÀ XÁC ĐỊNH KIẾN THỨC:
1. KHI ĐƯỢC CUNG CẤP TÀI LIỆU HOẶC TỆP ĐÍNH KÈM (PDF/Word/Ảnh/Văn bản dài):
   - Đọc hiểu sâu sắc toàn bộ tài liệu, trích xuất chuẩn xác các định nghĩa, định luật, công thức thực tế trong tài liệu.
   - Tuyệt đối giữ đúng môn học thực tế của tài liệu (Toán học, Vật lý, Hóa học, Sinh học, Ngữ văn, Lịch sử, Địa lý...). Không nhầm lẫn sang môn học khác.
2. KHI ĐƯỢC CUNG CẤP TỪ KHÓA HOẶC TIÊU ĐỀ CHỦ ĐỀ (ví dụ: "TÍCH PHÂN", "Đạo hàm", "Quang hợp", "Chiến dịch Điện Biên Phủ", "Este", "Ba định luật Newton"...):
   - Nhận diện chính xác môn học và khối lớp tương ứng trong chương trình GDPT Việt Nam:
     * Ví dụ "TÍCH PHÂN" hoặc "NGUYÊN HÀM" -> Môn "Toán học", "Lớp 12".
     * Ví dụ "QUANG HỢP" -> Môn "Sinh học", "Lớp 11" (hoặc Lớp 10).
     * Ví dụ "ESTE VÀ LIPIT" -> Môn "Hóa học", "Lớp 12".
     * Ví dụ "BA ĐỊNH LUẬT NEWTON" -> Môn "Vật lý", "Lớp 10".
   - Tự động xây dựng bài học chuyên sâu, đầy đủ định nghĩa, công thức toán học/khoa học chính xác (ví dụ cho Tích phân: định nghĩa tích phân, công thức Newton-Leibniz ∫_a^b f(x)dx = F(b) - F(a), phương pháp đổi biến số, phương pháp tích phân từng phần ∫ u dv = uv - ∫ v du, ứng dụng tính diện tích hình phẳng S = ∫_a^b |f(x)|dx, thể tích khối tròn xoay V = π ∫_a^b [f(x)]² dx).

CÁC TIÊU CHUẨN CẤU TRÚC ĐẦU RA BẮT BUỘC:
1. subject: Tên môn học chuẩn tiếng Việt (Toán học, Vật lý, Hóa học, Sinh học, Lịch sử, Địa lý, Ngữ văn...).
2. grade: Khối lớp (Lớp 10, Lớp 11, Lớp 12, Lớp 9...).
3. title: Tiêu đề bài dạy trang trọng, súc tích, chuẩn quy định sư phạm.
4. summary: Tóm tắt bài giảng chi tiết, ĐẦY ĐỦ THÔNG TIN, TUYỆT ĐỐI KHÔNG ĐỂ TRỐNG HOẶC RỖNG, chia thành 3 phần rõ ràng:
   - 1. Khái Niệm & Luận Điểm Cốt Lõi: Ít nhất 3-4 gạch đầu dòng chi tiết giải thích định nghĩa, bản chất khoa học.
   - 2. Phương Trình / Công Thức / Cơ Chế Trọng Tâm: Ít nhất 3-4 gạch đầu dòng ghi chính xác công thức toán/lý/hóa bằng ký hiệu chuẩn Unicode/toán học, điều kiện áp dụng và ý nghĩa từng biến số.
   - 3. Ý Nghĩa Thực Tiễn & Lưu Ý Sư Phạm: Ít nhất 2-3 gạch đầu dòng liên hệ thực tế, bài toán ứng dụng và lưu ý tránh bẫy sai lầm khi làm bài.
5. mindmap:
   - centralNode: { id, label, description }
   - branches: Đúng 4 nhánh kiến thức logic (màu sắc phân biệt: xanh lá #16a34a, xanh lam #0284c7, tím #8b5cf6, cam #d97706):
     * Nhánh 1 (#16a34a): Khái niệm & Cơ sở lý thuyết
     * Nhánh 2 (#0284c7): Công thức & Cơ chế vận hành
     * Nhánh 3 (#8b5cf6): Phương pháp giải & Quy trình các bước
     * Nhánh 4 (#d97706): Ứng dụng thực tiễn & Bẫy lỗi sai cần tránh
     Mỗi nhánh có 3 đến 4 ý con (children). Mỗi ý con có label, detail (giải thích chi tiết) và formula (công thức toán/lý/hóa chính xác nếu có; KHÔNG dùng công thức chung chung vô nghĩa như A+B->C+D).
6. slides: Đúng 4 slide bài giảng với slideNumber, title, keyPoints (mảng 3 ý chi tiết), visualPrompt (mô tả hình ảnh trực quan sư phạm), teacherCallout (mẹo sư phạm gợi mở cho thầy cô).
7. videoScenes: Đúng 3 phân cảnh kịch bản video với sceneNumber, title, duration, visualAction, voiceoverScript (lời giảng ấm áp, truyền cảm, thu hút của giáo viên).

Toàn bộ nội dung trả về là JSON hợp lệ theo đúng schema. Toàn bộ ngôn ngữ bằng tiếng Việt sư phạm chuẩn mực.`;

    const parts: any[] = [];

    // If PDF or image file is uploaded as base64, pass it natively to Gemini
    if (fileBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: fileBase64,
        },
      });
    }

    // Add prompt instructions
    const promptText = `Dưới đây là tài liệu / chủ đề bài giảng của giáo viên${fileName ? ` (tên tệp: "${fileName}")` : ''}:
${text ? `\n--- NỘI DUNG VĂN BẢN / CHỦ ĐỀ ---\n${text}\n--- HẾT NỘI DUNG ---` : ''}

Hãy phân tích kỹ lưỡng nội dung trên, xác định chuẩn xác môn học và khối lớp, sau đó xuất ra toàn bộ cấu trúc bài giảng trực quan bằng JSON theo đúng schema. Đảm bảo tính chính xác khoa học cao nhất.`;

    // Push the text prompt into parts array
    parts.push({ text: promptText });

    const lectureSchema = {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING, description: 'Tên môn học chính xác, ví dụ: Toán học, Vật lý, Sinh học, Hóa học, Lịch sử, Địa lý...' },
        grade: { type: Type.STRING, description: 'Khối lớp chuẩn xác, ví dụ: Lớp 10, Lớp 11, Lớp 12...' },
        title: { type: Type.STRING, description: 'Tiêu đề bài học ngắn gọn, rõ ràng, chuẩn sư phạm' },
        summary: { type: Type.STRING, description: 'Bản tóm tắt bài giảng có cấu trúc 3 phần chi tiết, đầy đủ, không để trống' },
        mindmap: {
          type: Type.OBJECT,
          properties: {
            centralNode: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['id', 'label', 'description'],
            },
            branches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  color: { type: Type.STRING },
                  description: { type: Type.STRING },
                  children: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        detail: { type: Type.STRING },
                        formula: { type: Type.STRING },
                      },
                      required: ['id', 'label', 'detail'],
                    },
                  },
                },
                required: ['id', 'label', 'color', 'description', 'children'],
              },
            },
          },
          required: ['centralNode', 'branches'],
        },
        slides: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              slideNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              visualPrompt: { type: Type.STRING },
              teacherCallout: { type: Type.STRING },
            },
            required: ['slideNumber', 'title', 'keyPoints', 'visualPrompt', 'teacherCallout'],
          },
        },
        videoScenes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              duration: { type: Type.STRING },
              visualAction: { type: Type.STRING },
              voiceoverScript: { type: Type.STRING },
            },
            required: ['sceneNumber', 'title', 'duration', 'visualAction', 'voiceoverScript'],
          },
        },
      },
      required: ['subject', 'grade', 'title', 'summary', 'mindmap', 'slides', 'videoScenes'],
    };

    const parsedData = await callGeminiStructured<any>({
      contents: { parts },
      systemInstruction,
      responseSchema: lectureSchema,
    });

    // Provide unique runtime ID
    parsedData.id = `lec-gemini-${Date.now()}`;
    parsedData.rawText = text || `Tài liệu tải lên từ tệp: ${fileName || 'GiaoAn'}`;

    return res.json({
      success: true,
      lecture: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/visualize-lecture:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Đã xảy ra lỗi khi gọi AI Gemini để phân tích bài giảng.',
    });
  }
});

// POST /api/gemini/parse-exam-file
// Accepts base64 file (PDF, DOCX, JPG, PNG, WEBP) or text to extract student exam submissions
app.post('/api/gemini/parse-exam-file', async (req: Request, res: Response) => {
  try {
    const { text, fileBase64, mimeType, fileName } = req.body;

    if (!text && !fileBase64) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp nội dung hoặc tệp bảng điểm khảo sát.',
      });
    }

    const systemInstruction = `Bạn là trợ lý AI chuyên gia phân tích dữ liệu kiểm tra học sinh và sư phạm (EduMaster AI).
Nhiệm vụ: Phân tích file kết quả bài kiểm tra, khảo sát, bảng điểm thi cử từ tài liệu bảng tính Excel, CSV hoặc hình ảnh được cung cấp.

QUY TẮC BÓC TÁCH VÀ LÀM SẠCH DỮ LIỆU CHUẨN XÁC:
1. XÁC ĐỊNH MÔN HỌC (subject):
   - Đọc kỹ nội dung các phần/câu hỏi được kiểm tra để suy ra MÔN HỌC CHÍNH XÁC:
     * Ví dụ có "tích phân", "đạo hàm", "hình học", "hàm số", "vectơ", "phương trình" -> Môn "Toán học" (hoặc "Giải tích 12").
     * Ví dụ có "quang hợp", "lục lạp", "calvin", "hô hấp", "di truyền", "adn" -> Môn "Sinh học 11".
     * Ví dụ có "este", "axit", "kim loại", "ancol" -> Môn "Hóa học".
     * Ví dụ có "định luật newton", "điện xoay chiều", "sóng cơ" -> Môn "Vật lý".
   - TUYỆT ĐỐI KHÔNG để môn học là "Bảng Điểm Excel", "Tệp Không Tiêu Đề", "Khảo Sát Đa Định Dạng". Phải là tên môn học thực tế.
2. LOẠI BỎ TRIỆT ĐỂ DÒNG TIÊU ĐỀ VÀ HƯỚNG DẪN:
   - Các dòng tiêu đề cột như "STT", "Tên học sinh", "Điểm số (0-10)", "Các phần làm ĐÚNG (ngăn cách bằng dấu chấm phẩy ;)", "Các phần làm SAI (ngăn cách bằng dấu chấm phẩy ;)", "Ghi chú của giáo viên"... TUYỆT ĐỐI KHÔNG ĐƯỢC COI LÀ TÊN HỌC SINH HOẶC CHỦ ĐỀ BÀI THI.
   - Các dòng rỗng, dòng hướng dẫn mẫu phải được bỏ qua.
3. CHUẨN HÓA TÊN PHẦN/CHUYÊN ĐỀ (correctSections, wrongSections):
   - Tên chuyên đề phải là nội dung kiến thức thực tế (ví dụ: "Tính độ dài bằng tích phân", "Tính diện tích bằng tích phân", "Tính thể tích bằng tích phân", "Chu trình Calvin").
   - Bỏ toàn bộ các cụm từ hướng dẫn như "(ngăn cách bằng dấu chấm phẩy)", "(ngăn cách bằng dấu ;)", "Phần làm đúng:", "Phần làm sai:".
   - Không đưa chuỗi rỗng "" vào mảng.
4. THANG ĐIỂM:
   - Điểm số là số thực từ 0.0 đến 10.0 (nếu thang 100 hãy quy về thang 10).

Toàn bộ phản hồi phải đúng định dạng JSON theo schema đã cho.`;

    const parts: any[] = [];
    if (fileBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType,
          data: fileBase64,
        },
      });
    }

    const promptText = `Dưới đây là tệp kết quả khảo sát / bảng điểm kiểm tra của học sinh${fileName ? ` (tên tệp: "${fileName}")` : ''}:
${text ? `\n--- NỘI DUNG VĂN BẢN / BẢNG TÍNH ---\n${text}\n--- HẾT NỘI DUNG ---` : ''}

Hãy phân tích kỹ bảng kết quả hoặc ảnh chụp bài kiểm tra trên, nhận diện chính xác môn học thực tế, loại bỏ hoàn toàn các dòng tiêu đề/hướng dẫn cột, và trích xuất danh sách học sinh, điểm số, phần đúng, phần sai của từng em theo đúng định dạng JSON Schema.`;

    parts.push({ text: promptText });

    const examSchema = {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING, description: 'Tên môn học chuẩn tiếng Việt (ví dụ: Toán học, Vật lý, Hóa học, Sinh học...)' },
        className: { type: Type.STRING, description: 'Tên lớp học (ví dụ: Lớp 12A, Lớp 10A2...)' },
        examTitle: { type: Type.STRING, description: 'Tiêu đề bài kiểm tra ngắn gọn, chuẩn sư phạm' },
        submissions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              studentName: { type: Type.STRING },
              score: { type: Type.NUMBER },
              correctSections: { type: Type.ARRAY, items: { type: Type.STRING } },
              wrongSections: { type: Type.ARRAY, items: { type: Type.STRING } },
              notes: { type: Type.STRING },
            },
            required: ['studentName', 'score', 'correctSections', 'wrongSections'],
          },
        },
      },
      required: ['subject', 'className', 'examTitle', 'submissions'],
    };

    const parsedData = await callGeminiStructured<any>({
      contents: { parts },
      systemInstruction,
      responseSchema: examSchema,
    });
    if (Array.isArray(parsedData.submissions)) {
      parsedData.submissions = parsedData.submissions.map((sub: any, idx: number) => ({
        ...sub,
        id: `sub-ai-${Date.now()}-${idx + 1}`,
        notes: sub.notes || '',
      }));
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/parse-exam-file:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Đã xảy ra lỗi khi AI phân tích tệp kết quả học sinh.',
    });
  }
});

// POST /api/gemini/generate-homework
// Generates personalized 3-tier homework dynamically based on diagnosed mistakes from the scanned exam
app.post('/api/gemini/generate-homework', async (req: Request, res: Response) => {
  try {
    const { subject, examTitle, weakSections, strongSections, className } = req.body;

    const weakList = Array.isArray(weakSections) && weakSections.length > 0
      ? weakSections.join(', ')
      : 'Kiến thức cốt lõi của bài học';
    const strongList = Array.isArray(strongSections) && strongSections.length > 0
      ? strongSections.join(', ')
      : 'Kiến thức cơ bản';

    const systemInstruction = `Bạn là chuyên gia sư phạm hàng đầu (EduMaster AI) theo chương trình GDPT 2018 Việt Nam.
Nhiệm vụ: Dựa trên kết quả khảo sát bài kiểm tra học sinh, hãy tạo BỘ ĐỀ BÀI TẬP VỀ NHÀ PHÂN HÓA 3 CẤP ĐỘ hoàn toàn chuẩn xác theo môn học và tập trung khắc phục ĐÚNG CÁC LỖ HỔNG / LỖI SAI của học sinh.

QUY TẮC BẮT BUỘC VỀ CHUYÊN MÔN:
1. MÔN HỌC & CHUYÊN ĐỀ PHẢI TUYỆT ĐỐI CHÍNH XÁC:
   - Nếu môn học là Toán học / Tích phân và lỗ hổng là "Tính diện tích bằng tích phân", "Tính thể tích bằng tích phân":
     TẤT CẢ các câu hỏi BẮT BUỘC phải là bài tập TOÁN HỌC TÍCH PHÂN (ví dụ: tính diện tích hình phẳng giới hạn bởi y = f(x), trục hoành, đường cong giao nhau; tính thể tích khối tròn xoay quanh trục Ox). TUYỆT ĐỐI KHÔNG xuất hiện nội dung môn khác như Sinh học quang hợp hay Vật lý!
   - Nếu môn học là Sinh học (ví dụ: Quang hợp): câu hỏi thuộc Sinh học.
   - Nếu môn học là Hóa học: câu hỏi thuộc Hóa học.
   - Nếu môn học là Vật lý: câu hỏi thuộc Vật lý.

2. CẤU TRÚC 3 CẤP ĐỘ PHÂN HÓA:
   - Cấp độ 1: 'reinforce' (Nhóm 1: Củng Cố Căn Bản & Tự Tin)
     * Mục tiêu: Dành cho học sinh làm SAI ở các phần yếu kém (${weakList}).
     * Bài tập tinh gọn, có kèm gợi ý phương pháp giải chi tiết từng bước (Step-by-step), không đánh đố để học sinh lấy lại tự tin.
     * Gồm 3 câu hỏi (mức độ 'Nhận biết' và 'Thông hiểu') có gợi ý phương pháp giải (hint).
   - Cấp độ 2: 'standard' (Nhóm 2: Luyện Tập Tiêu Chuẩn & Tốc Độ)
     * Mục tiêu: Dành cho đa số học sinh rèn luyện kỹ năng và phản xạ bài thi.
     * Gồm 3 câu hỏi (mức độ 'Thông hiểu' và 'Vận dụng') có gợi ý hướng đi.
   - Cấp độ 3: 'advanced' (Nhóm 3: Vận Dụng Sáng Tạo & Nâng Cao)
     * Mục tiêu: Dành cho nhóm học sinh khá giỏi cần thử thách bài toán thực tiễn hoặc phân loại điểm 9-10.
     * Gồm 3 câu hỏi (mức độ 'Vận dụng cao' hoặc 'Thực tiễn') có gợi ý tư duy đột phá.

Toàn bộ câu hỏi phải viết bằng tiếng Việt chuẩn mực, công thức toán/lý/hóa chuẩn Unicode rõ ràng. Phản hồi JSON theo schema.`;

    const promptText = `Thông tin bài kiểm tra vừa quét:
- Môn học: ${subject || 'Toán học'}
- Tiêu đề bài thi: ${examTitle || 'Khảo sát định kỳ'}
- Các chuyên đề/phần nhiều học sinh LÀM SAI NHẤT: ${weakList}
- Các phần học sinh làm tốt: ${strongList}
${className ? `- Lớp: ${className}` : ''}

Hãy tạo bộ bài tập về nhà phân hóa 3 cấp độ (reinforce, standard, advanced) bám sát chính xác môn học và tập trung rèn luyện đúng các lỗi sai trên.`;

    const homeworkSchema = {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        focusWeakness: { type: Type.STRING, description: 'Lỗ hổng kiến thức chính đang tập trung khắc phục' },
        reinforce: {
          type: Type.OBJECT,
          properties: {
            tier: { type: Type.STRING },
            tierName: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            estimatedTime: { type: Type.STRING },
            questionCount: { type: Type.INTEGER },
            description: { type: Type.STRING },
            keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            sampleQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ['id', 'question', 'difficulty', 'hint'],
              },
            },
          },
          required: ['tier', 'tierName', 'targetAudience', 'estimatedTime', 'questionCount', 'description', 'keySkills', 'sampleQuestions'],
        },
        standard: {
          type: Type.OBJECT,
          properties: {
            tier: { type: Type.STRING },
            tierName: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            estimatedTime: { type: Type.STRING },
            questionCount: { type: Type.INTEGER },
            description: { type: Type.STRING },
            keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            sampleQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ['id', 'question', 'difficulty', 'hint'],
              },
            },
          },
          required: ['tier', 'tierName', 'targetAudience', 'estimatedTime', 'questionCount', 'description', 'keySkills', 'sampleQuestions'],
        },
        advanced: {
          type: Type.OBJECT,
          properties: {
            tier: { type: Type.STRING },
            tierName: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            estimatedTime: { type: Type.STRING },
            questionCount: { type: Type.INTEGER },
            description: { type: Type.STRING },
            keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            sampleQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ['id', 'question', 'difficulty', 'hint'],
              },
            },
          },
          required: ['tier', 'tierName', 'targetAudience', 'estimatedTime', 'questionCount', 'description', 'keySkills', 'sampleQuestions'],
        },
      },
      required: ['subject', 'focusWeakness', 'reinforce', 'standard', 'advanced'],
    };

    const generated = await callGeminiStructured<any>({
      contents: { parts: [{ text: promptText }] },
      systemInstruction,
      responseSchema: homeworkSchema,
    });

    return res.json({
      success: true,
      data: generated,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-homework:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Đã xảy ra lỗi khi tạo bài tập phân hóa bằng Gemini AI.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'EduMaster AI Server with Gemini' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Mount Vite dev middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`EduMaster AI full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
