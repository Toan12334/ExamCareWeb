import jwt from 'jsonwebtoken';

// Middleware xác thực JWT
const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Lấy token từ chuỗi "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn thông tin người dùng vào request để sử dụng sau
    req.user = decoded;

    // Tiếp tục xử lý
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;