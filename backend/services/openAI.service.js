import OpenAI from "openai";
import dotenv from "dotenv";
// load env
dotenv.config({ path: "../.env" });

class openAiService {
  constructor() {
    this.client = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }

  // method gọi chat
  async analyzeExamProcess({ examData }) {
    try {
      const prompt = `
      Bạn là chuyên gia phân tích hành vi làm bài của học sinh cho giáo viên.
      
      ======================
      QUY TẮC BẮT BUỘC (KHÔNG ĐƯỢC VI PHẠM)
      ======================
      
      1. CHỈ sử dụng field "IsCorrect" để xác định đúng/sai.
      2. TUYỆT ĐỐI KHÔNG được suy luận từ "Score".
      3. "Score" là điểm quy đổi, KHÔNG phải số câu đúng.
      4. Nếu tất cả câu có IsCorrect = true:
         → PHẢI kết luận học sinh làm đúng toàn bộ.
         → KHÔNG được nói học sinh yếu, sai, hổng kiến thức.
      5. KHÔNG được tự suy diễn số câu đúng/sai.
      6. Nếu không có câu sai:
         → KHÔNG được viết phần "câu yếu".
      7. KHÔNG được dùng các từ:
         - mất gốc
         - yếu nghiêm trọng
         - hổng kiến thức
         nếu dữ liệu không chứng minh.
      
      ======================
      CÁCH PHÂN TÍCH
      ======================
      
      - Đúng/sai:
        → dựa vào IsCorrect
      
      - Thời gian:
        → lâu ở câu khó = bình thường
        → lâu ở câu dễ = có thể cần cải thiện
        → nhanh + đúng = tốt
        → KHÔNG được dùng thời gian để kết luận sai
      
      - AnswerChangedCount:
        → >0: có phân vân
        → =0: quyết đoán (không suy diễn tiêu cực)
      
      ======================
      YÊU CẦU ĐẦU RA
      ======================
      
      Viết rõ ràng, dễ đọc, không dùng JSON.
      
      BẮT BUỘC theo format:
      
      1. TÓM TẮT KẾT QUẢ
      - Tổng số câu
      - Số câu đúng (dựa IsCorrect)
      - Số câu sai (dựa IsCorrect)
      - Giải thích rõ: điểm KHÔNG phải số câu đúng
      
      2. ĐÁNH GIÁ CHÍNH XÁC
      - Nếu đúng hết:
        → Phải viết rõ học sinh làm bài rất tốt
      - Nếu có câu sai:
        → Chỉ phân tích các câu có IsCorrect = false
      
      3. PHÂN TÍCH HÀNH VI LÀM BÀI
      - Nêu cụ thể:
        + câu làm nhanh nhất
        + câu lâu nhất
        + câu khó nhưng vẫn làm đúng
      - Nhận xét dựa trên dữ liệu (không chung chung)
      
      4. GỢI Ý CHO GIÁO VIÊN
      - Nếu không có câu sai:
        → chỉ đưa gợi ý nâng cao (tốc độ, chiến lược)
      - Nếu có câu sai:
        → gợi ý đúng theo từng câu sai
      
      5. KẾT LUẬN
      - Ngắn gọn, đúng dữ liệu
      - Không được mâu thuẫn
      
      ======================
      KIỂM TRA TRƯỚC KHI TRẢ LỜI
      ======================
      
      Tự kiểm tra:
      - Có câu nào IsCorrect = true mà mình nói sai không?
      - Số câu đúng/sai có đúng không?
      - Có hiểu nhầm Score không?
      
      Nếu có → sửa lại trước khi trả lời.
      
      ======================
      DỮ LIỆU
      ======================
      
      ${JSON.stringify(examData, null, 2)}
      `;
  
      const completion = await this.client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "Bạn là chuyên gia phân tích học tập. Bạn phải tuyệt đối trung thành với dữ liệu đầu vào, đặc biệt là field IsCorrect. Không được suy diễn trái dữ liệu."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1
      });
  
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Analyze Exam Process Error:", error);
      throw error;
    }
  }

}




export default new  openAiService
