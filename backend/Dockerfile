# Sử dụng Node 20 slim
FROM node:20-slim

# Cài đặt Pandoc và OpenSSL (Prisma thường yêu cầu OpenSSL để hoạt động)
RUN apt-get update && apt-get install -y pandoc openssl && rm -rf /var/lib/apt/lists/*

# Thiết lập thư mục làm việc chính trong container
WORKDIR /app

# Copy TOÀN BỘ dự án (cả frontend và backend) vào container
COPY . .

# Di chuyển vào thư mục backend để thực hiện các lệnh cài đặt
WORKDIR /app/backend

# Chạy lệnh build tuyệt vời mà bạn đã viết trong package.json
# Lệnh này sẽ tự cài npm, tự động lùi ra ngoài build frontend và copy vào public
RUN npm run build

# Generate Prisma Client (Rất quan trọng, nếu thiếu sẽ lỗi crash server)
RUN npx prisma generate

# Khai báo cổng
ENV PORT=10000
EXPOSE 10000

# Khởi chạy server
CMD ["node", "server.js"]