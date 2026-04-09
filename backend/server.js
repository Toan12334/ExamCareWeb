import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Phục vụ các file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// 2. Các route API của bạn (giữ nguyên)
app.use('/api/students', studentRoutes); 

// 3. QUAN TRỌNG: Route cuối cùng để xử lý React Router
// Nếu truy cập bất kỳ đường dẫn nào không khớp với API, hãy trả về index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});