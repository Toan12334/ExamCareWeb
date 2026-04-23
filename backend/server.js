import app from "./app.js"

// 1. Render sẽ truyền vào biến process.env.PORT. 
// Nếu chạy dưới local máy bạn (không có biến này), nó sẽ tự động dùng cổng 3000.
const PORT = process.env.PORT || 3000;

// 2. BẮT BUỘC phải thêm '0.0.0.0' để Docker mở kết nối ra bên ngoài
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port: ${PORT}`)
  console.log(`Student API is ready on port ${PORT}`)
})