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
  async  analyzeExamProcess({ examData }) {
    try {
      const prompt = `
  Bạn là chuyên gia phân tích hành vi làm bài của học sinh.
  
  Hãy phân tích dữ liệu bài làm và viết nhận xét cho giáo viên.
  
  Yêu cầu:
  - Chỉ ra rõ học sinh yếu ở những câu nào
  - Giải thích vì sao yếu (dựa vào dữ liệu như sai, thời gian làm lâu, đổi đáp án...)
  - Đưa ra gợi ý cụ thể cho giáo viên nên hỗ trợ như thế nào ở từng câu
  - Cuối cùng đưa ra nhận xét tổng quan về học sinh
  
  Cách trình bày:
  - Viết rõ ràng, dễ đọc
  - Không dùng JSON
  - Có thể xuống dòng, chia ý
  
  Dữ liệu bài làm:
  ${JSON.stringify(examData, null, 2)}
  `;
  
      const completion = await this.client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "Bạn là chuyên gia phân tích học tập, tập trung giúp giáo viên hiểu học sinh yếu ở đâu và cần dạy gì."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      });
  
      return completion.choices[0].message.content;
  
    } catch (error) {
      console.error("Analyze Exam Process Error:", error);
      throw error;
    }
  }

}




export default new  openAiService
