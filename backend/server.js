import express from 'express'; // 1. Import express trước
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // 2. PHẢI CÓ DÒNG NÀY để tạo biến 'app'

// 3. Sau đó mới đến các lệnh sử dụng 'app'
app.use(express.json()); // Cho phép đọc dữ liệu JSON

// 4. Cấu hình thư mục public để chứa React
app.use(express.static(path.join(__dirname, 'public')));

// ... Các route API của bạn (ví dụ app.use('/api', ...)) ...

// 5. Cuối cùng mới là route '*' cho React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});