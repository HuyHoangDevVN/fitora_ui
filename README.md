# Fitora UI — Bài tập lớn học phần Các hệ thống phân tán

Frontend của Fitora là ứng dụng web TypeScript/React dùng Vite. Ứng dụng gọi backend qua API Gateway, quản lý trạng thái phía client bằng Redux Toolkit/React Query và kết nối realtime với SignalR cho chat/thông báo.

> Ghi chú repository: remote Git của thư mục này là `fitora_ui`, nhưng checkout cục bộ hiện tên `fitora-web`. Không đổi tên thư mục trong quá trình cập nhật tài liệu.

## Thông tin học phần

| Nội dung             | Thông tin                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Học phần             | Các hệ thống phân tán                                                                        |
| Đề tài               | Thiết kế và phát triển không gian học tập trên nền tảng Web và kiến trúc Microservice        |
| Giảng viên hướng dẫn | TS. Kim Ngọc Bách                                                                            |
| Mã lớp               | M25CQHT02-B                                                                                  |
| Nhóm                 | 02                                                                                           |
| Thành viên           | Nguyễn Ngọc Anh - B25CHHT077; Nguyễn Thế Huy Hoàng - B25CHHT097; Mekdala Nounou - B25CHHT124 |
| Năm thực hiện        | 2026                                                                                         |

Tài liệu báo cáo hiện nằm tại [reports/BaiTapLon_Nhom_2_M25CQHT02-B.docx](reports/BaiTapLon_Nhom_2_M25CQHT02-B.docx). Yêu cầu học phần nhắc tới thư mục `report/`, nhưng repository frontend thực tế đang dùng `reports/`.

## Vai trò trong hệ thống phân tán

Frontend là client duy nhất cho người dùng cuối và quản trị viên. Ứng dụng không gọi trực tiếp từng microservice, mà dùng biến môi trường `VITE_API_URL` trỏ tới API Gateway.

```mermaid
flowchart LR
    Browser[Trình duyệt] --> React[React SPA / Vite]
    React --> Axios[Axios repository]
    Axios --> Gateway[API Gateway]
    React -. SignalR .-> ChatHub[/chat]
    React -. SignalR .-> NotiHub[/noti]
    Gateway --> Services[Auth, User, Interact, Chat, Notification]
```

## Chức năng đã xác minh từ mã nguồn

| Nhóm chức năng                                    | Bằng chứng trong repo                                                                                          |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Đăng nhập, đăng ký, refresh token                 | `src/features/auth`, `src/components/Auth`, `src/api/authApi.ts`, `src/api/axiosClient.ts`                     |
| Feed bài viết, trending, explore, saved, tìm kiếm | `src/pages/Home.tsx`, `Trending.tsx`, `Explore.tsx`, `Saved.tsx`, `PostSearch.tsx`, `src/api/postApi.ts`       |
| Bài viết, bình luận, vote/save/report             | `src/components/posts`, `src/features/posts`, `src/features/comments`, `src/components/common/ReportModal.tsx` |
| Nhóm học tập                                      | `src/pages/Group.tsx`, `src/features/groups`, `src/api/groupApi.ts`                                            |
| Bạn bè/theo dõi                                   | `src/pages/FriendRequestPage.tsx`, `src/components/friend`, `src/api/userApi.ts`                               |
| Chat realtime                                     | `src/features/chat/Chat.tsx`, `src/api/chatApi.ts`, `src/context/SignalRContext.tsx`                           |
| Thông báo realtime                                | `src/components/header/NotificationDropdown.tsx`, `src/context/SignalRContext.tsx`                             |
| Trang quản trị                                    | `src/features/admin`, route `/admin/*`                                                                         |
| Bảo vệ route                                      | `src/routes/PrivateRoute.tsx`, `src/routes/index.tsx`                                                          |

## Công nghệ

| Nhóm       | Thư viện/công cụ                                                    |
| ---------- | ------------------------------------------------------------------- |
| Runtime UI | React 18, TypeScript, Vite 6                                        |
| Routing    | `react-router-dom`                                                  |
| State/data | Redux Toolkit, React Redux, React Query                             |
| HTTP       | Axios, cookie credential                                            |
| Realtime   | `@microsoft/signalr`                                                |
| UI         | Ant Design, Tailwind CSS, React Icons, ApexCharts/Ant Design Charts |
| Tooling    | ESLint, TypeScript build mode                                       |

## Cấu trúc chính

| Đường dẫn        | Nội dung                                            |
| ---------------- | --------------------------------------------------- |
| `src/api`        | Repository Axios và API client theo miền nghiệp vụ  |
| `src/routes`     | Khai báo route, lazy components, private route      |
| `src/context`    | Theme, sidebar, SignalR context                     |
| `src/features`   | Auth, chat, group, post, comment, category, admin   |
| `src/components` | UI dùng lại cho layout, post, friend, admin, header |
| `src/pages`      | Trang chính của người dùng                          |
| `public`         | Asset public và `web.config` cho IIS                |
| `reports`        | Báo cáo học phần                                    |

## Biến môi trường

Ứng dụng đọc API Gateway từ `VITE_API_URL` trong `src/api/repository.ts`.

| File               | Giá trị mặc định đã thấy                         |
| ------------------ | ------------------------------------------------ |
| `.env.development` | `VITE_API_URL=http://localhost:4469`             |
| `.env.production`  | `VITE_API_URL=https://fitora-api.aiotlab.edu.vn` |
| `.env.local`       | File rỗng, có thể dùng cho cấu hình máy cá nhân  |

Không đặt token, mật khẩu hoặc private endpoint vào file commit lên Git.

## Cài đặt

Repository có cả `package-lock.json` và `yarn.lock`. Workflow deploy đang dùng Yarn, nhưng script trong `package.json` chạy được với npm hoặc yarn. Nên thống nhất một package manager cho nhóm; nếu không có yêu cầu khác, dùng npm theo lock file:

```powershell
npm install
```

Hoặc dùng Yarn theo workflow:

```powershell
yarn install
```

## Chạy cục bộ

Đảm bảo backend API Gateway đang chạy tại `http://localhost:4469`, sau đó:

```powershell
npm run dev
```

Ứng dụng Vite mặc định chạy tại:

```text
http://localhost:5173
```

## Build, lint và preview

Các script đã khai báo trong `package.json`:

```powershell
npm run build
npm run lint
npm run preview
```

`npm run build` thực hiện `tsc -b && vite build`, vì vậy lỗi TypeScript sẽ làm build thất bại trước khi Vite đóng gói.

Kết quả rà soát ngày 2026-07-15: `npm run lint` chạy xong với 47 cảnh báo và không có lỗi. `npm run build` chưa pass do TypeScript báo nhiều lỗi `TS6305` liên quan các file `.d.ts` trong `dist/app` được include cùng `src`. Cần làm sạch/chỉnh cấu hình build trước khi ghi nhận build thành công.

## Realtime

`SignalRContext` tạo hai kết nối:

| Kết nối      | Endpoint qua Gateway   | Sự kiện chính                                                            |
| ------------ | ---------------------- | ------------------------------------------------------------------------ |
| Chat         | `${VITE_API_URL}/chat` | `ReceiveMessage`, `JoinConversation`, `LeaveConversation`, `SendMessage` |
| Notification | `${VITE_API_URL}/noti` | `ReceiveNotification`, `AllNotificationsRead`                            |

Transport được cấu hình với WebSockets và Server-Sent Events, kèm `withCredentials: true` để gửi cookie xác thực.

## Triển khai

Workflow `.github/workflows/deploy.yml` chạy khi push nhánh `staging`. Pipeline:

1. Cài `cloudflared`.
2. Thiết lập SSH bằng GitHub Secrets.
3. Chạy `yarn install && yarn build`.
4. Nén thư mục `dist`.
5. Copy lên máy chủ Windows/IIS và giải nén vào site đích.

Các secret như `SSH_HOST`, `SSH_PRIVATE_KEY`, `IIS_SITE_NAME`, `IIS_TARGET_PATH` phải cấu hình trong GitHub Actions, không ghi vào repository.

## Kiểm thử

Chưa thấy test runner hoặc test file tự động trong repository frontend. Phạm vi kiểm tra hiện có:

```powershell
npm run build
npm run lint
```

Nếu bổ sung test sau này, cần cập nhật `package.json` và README với lệnh kiểm thử cụ thể.

## Liên kết repository

| Repository       | Vai trò                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| `fitora_ui`      | Frontend TypeScript/React; workspace hiện checkout dưới thư mục `fitora-web` |
| `fitora_backend` | Backend C#/.NET, API Gateway và microservices                                |

## Giới hạn tài liệu hóa

README này chỉ ghi các chức năng và cơ chế đã đối chiếu từ mã nguồn, cấu hình, workflow hoặc báo cáo. Các cơ chế như circuit breaker, dead-letter queue, distributed tracing, service discovery, Kubernetes, Saga, CQRS/Event Sourcing chưa được trình bày như tính năng đã triển khai vì chưa có bằng chứng tương ứng trong repository frontend.
