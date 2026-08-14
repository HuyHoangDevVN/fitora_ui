# Fitora UI

## Overview

**Fitora UI** is the frontend of the Fitora social network and technology platform for IT students at Dai Nam University. Built with **React**, **TypeScript**, and **Vite**, it provides a modern, fast, and user-friendly interface that interacts with the Fitora backend microservices architecture via an API Gateway.

---

## System Architecture

Fitora UI communicates with the backend system via an API Gateway, following a microservices approach:

![System Architecture](https://raw.githubusercontent.com/HuyHoangDevVN/fitora_backend/product/image.png)

---

## Features

- **Authentication & Authorization**: Register, login, and role-based access.
- **Profile Management**: View and edit user profiles.
- **Q&A Module**: Post questions, answers, and vote.
- **Document Sharing**: Upload and search for study resources.
- **Discussion Forum**: Community threads (Reddit/StackOverflow style).
- **Real-time Chat**: Message users and groups.
- **Notifications**: Real-time alerts.
- **Powerful Search**: Across posts, users, documents.
- **Responsive Design**: Optimized for all devices.

---

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Ant Design / Material UI (update if different)
- **State Management**: Redux Toolkit / Context API
- **API Communication**: Axios / Fetch API
- **Routing**: React Router
- **Realtime**: Socket.IO / WebSocket (for chat & notifications)
- **Form Handling**: Formik / React Hook Form
- **Linting/Formatting**: ESLint, Prettier
- **Testing**: Jest, React Testing Library
- **Build Tool**: Vite

---

## Project Structure

```
fitora_ui/
├── public/                # Static assets, favicon, index.html
├── src/
│   ├── assets/            # Images, icons, styles
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature modules (auth, chat, qna, docs, etc.)
│   ├── pages/             # Page-level components
│   ├── redux/             # Redux store, slices (if used)
│   ├── routes/            # Route definitions
│   ├── services/          # API services, axios instances
│   ├── utils/             # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HuyHoangDevVN/fitora_ui.git
cd fitora_ui
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and edit as needed:

```env
VITE_API_GATEWAY_URL=http://localhost:5000
# Add other environment variables as needed
```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## Building for Production

```bash
npm run build
# or
yarn build
```
The output will be in the `dist/` directory.

---

## Linting & Formatting

### ESLint configuration

This project uses ESLint with recommended rules for React and TypeScript, and is ready for production extensions.

**For type-aware linting:**
- Configure the top-level `parserOptions` in your ESLint config:
  ```js
  export default tseslint.config({
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })
  ```
- Use `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked` for stricter rules.
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and extend your config:
  ```js
  import react from 'eslint-plugin-react'

  export default tseslint.config({
    settings: { react: { version: '18.3' } },
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
    },
  })
  ```

**Run:**
```bash
npm run lint
npm run format
```

---

## Testing

```bash
npm run test
```

---

## Deployment

- Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.).
- Ensure your backend API Gateway is accessible from your deployed frontend.

---

## Contribution

1. Fork and create a new branch: `feature/your-feature`
2. Make changes and commit with clear messages
3. Push to your branch and submit a pull request

---

## License

MIT License.

---

## Tiếng Việt

### Tổng quan

**Fitora UI** là giao diện người dùng của nền tảng Fitora, xây dựng với React + TypeScript + Vite, kết nối tới backend qua API Gateway.

### Tính năng

- Đăng ký, đăng nhập, phân quyền
- Quản lý hồ sơ cá nhân
- Hỏi đáp, thảo luận
- Chia sẻ tài liệu học tập
- Chat real-time
- Thông báo tức thời
- Tìm kiếm mạnh mẽ
- Giao diện responsive

### Kiến trúc

Frontend giao tiếp với backend qua API Gateway, kiến trúc microservices  
![Sơ đồ kiến trúc](https://raw.githubusercontent.com/HuyHoangDevVN/fitora_backend/product/image.png)

### Công nghệ

- React 18, TypeScript, Vite, Ant Design/Material UI, Redux/Context, Axios, React Router, Socket.IO, ESLint, Prettier, Jest...

### Hướng dẫn sử dụng

- Clone dự án, `npm install`, cấu hình `.env`, `npm run dev`
- Build production: `npm run build`
- Kiểm tra code: `npm run lint`, `npm run test`
- Đóng góp: Fork, tạo branch mới, pull request

### Bản quyền

MIT License.
