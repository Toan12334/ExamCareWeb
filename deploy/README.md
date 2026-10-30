# ExamCare VPS

Source tại `/opt/examcare` trên VPS `223.130.11.115`.
Compose project riêng: `examcare`. API: `http://223.130.11.115:3031`.
Không cần áp dụng `nginx.conf` khi dùng cổng 3031 trực tiếp.

## Trạng thái

- Đã build và triển khai thành công ngày 31/10/2026; container `examcare-backend-1` healthy.
- Đã lưu `backend/.env` trên máy và VPS; file trên VPS có quyền `600` và không đưa vào Git.
- Đã xác minh đăng nhập PostgreSQL bằng truy vấn chỉ đọc: `SELECT 1` thành công, public schema có 22 bảng.
- Đã dọn build cache Docker theo yêu cầu người dùng; sau khi deploy còn khoảng 3,6 GB trống.
- Endpoint công khai `/` trả HTTP 200; `/api/topics` đọc Supabase thành công.
- Cloudinary ping thành công; DeepSeek models trả HTTP 200. Chưa thực hiện upload hoặc gọi AI tạo nội dung.
- Các endpoint cũ ở cổng 5000 và 8000 đều trả HTTP 200 sau khi deploy.
- Không thay đổi Nginx, firewall, container hoặc service hiện có.

## Vận hành và cập nhật

Chạy trong `/opt/examcare`:

```sh
docker compose up -d --build
docker compose ps
curl --fail http://127.0.0.1:3031/
docker compose logs --tail=100 backend
```

Container giới hạn 384 MB RAM và 0,5 CPU, tự khởi động lại bằng `unless-stopped`.
Không chạy migration hoặc `prisma db push` lên database hiện có trong lần triển khai này.
Healthcheck `/` chỉ kiểm tra HTTP; kiểm tra thêm API truy vấn database sau mỗi lần cập nhật.
Uploads lưu trong volume riêng của project; không dùng `docker compose down -v` nếu cần giữ dữ liệu.

Frontend HTTPS không thể gọi API HTTP trực tiếp do mixed content. Cần giải pháp HTTPS trước khi nối frontend HTTPS vào API.
