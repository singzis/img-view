# ImgView — 图片预览工具

Windows 11 资源查看器风格的本地图片预览工具，支持三栏布局、轮播模式和明暗主题。

## 功能特性

- **三栏布局** — 左侧文件夹列表 (260px) | 中间缩略图网格 (自适应) | 右侧原图预览 (200–800px 可拖拽)
- **面包屑导航** — 点击路径任意层级快速跳转，最高回到用户输入的根路径
- **轮播模式** — 全屏幻灯片，支持鼠标点击箭头 / 键盘 ← → / 指示点跳转
- **明暗主题** — 跟随系统 / 浅色 / 深色，持久化到 localStorage
- **本地文件系统** — 输入绝对路径直接读取本地图片，无需导入
- **跨平台路径** — 支持 Unix (`/Users/...`) 和 Windows (`C:\Users\...`) 路径
- **安全校验** — Zod 校验绝对路径，拒绝目录穿越攻击
- **Apple 风格 UI** — 毛玻璃面板，Inter 字体，流畅动画

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 19.x |
| 构建工具 | Vite | 6.x |
| 类型系统 | TypeScript | 5.7 |
| CSS 框架 | Tailwind CSS | 4.x |
| 状态管理 | Zustand | 5.x |
| 后端框架 | Fastify | 5.x |
| 数据校验 | Zod | 3.x |
| 图标库 | Lucide React | latest |
| 测试框架 | Vitest | 3.x |
| 桌面框架 | Electron | 35.x |
| 字体 | Inter (Google Fonts) | — |

> **双模式运行**：支持 Web 端（浏览器访问）和 Electron 桌面端（原生窗口）两种运行方式。

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/singzis/img-view.git
cd img-view

# 安装依赖
npm install

# 启动开发环境（同时启动前端 :5173 + 后端 :3001）
npm run dev

# 运行测试
npm test

# 生产构建（Web 端）
npm run build
```

### Electron 桌面端

```bash
# 启动 Electron 开发模式（自动启动后端 + 前端 + Electron 窗口）
npm run electron:dev

# 打包为桌面应用
npm run electron:build          # 当前平台
npm run electron:build:mac      # macOS → .dmg
npm run electron:build:win      # Windows → .exe
npm run electron:build:linux    # Linux → .AppImage
```

> Electron 模式下，内置 Fastify 服务器自动管理生命周期，无需手动启动。

### 使用方式

1. 打开 `http://localhost:5173`
2. 在左侧顶部输入框中输入图片目录的**绝对路径**，如：
   - macOS/Linux: `/Users/name/Pictures`
   - Windows: `C:\Users\name\Pictures` 或 `C:/Users/name/Pictures`
3. 按 Enter 或点击 Go 按钮
4. 左侧显示子文件夹（含图片数量），中间显示缩略图网格
5. 点击缩略图在右侧查看原图
6. 点击「轮播」进入幻灯片模式

### 键盘快捷键

| 快捷键 | 功能 | 适用场景 |
|--------|------|----------|
| `←` / `→` | 上一张 / 下一张 | 轮播模式 |
| `Escape` | 退出轮播 | 轮播模式 |
| `Enter` | 加载路径 | 路径输入框聚焦时 |

## 项目结构

```
img-view/
├── index.html                    # 入口 HTML
├── package.json
├── vite.config.ts                # Vite + Tailwind + Vitest 配置
├── tsconfig.json                 # TypeScript 配置
├── server/                       # Fastify 后端
│   ├── index.ts                  # 服务入口 (:3001)
│   ├── routes/
│   │   ├── files.ts              # GET /api/files — 列出目录
│   │   └── image.ts              # GET /api/image — 返回图片流
│   ├── utils/
│   │   ├── validation.ts         # Zod 路径校验
│   │   └── image-utils.ts        # 图片过滤工具
│   └── __tests__/
│       └── validation.test.ts    # 35 个路径校验测试
├── src/                          # React 前端
│   ├── main.tsx                  # React 入口
│   ├── App.tsx                   # 根组件 + 主题初始化
│   ├── index.css                 # Tailwind + CSS 变量 + 主题
│   ├── store/
│   │   ├── types.ts              # TypeScript 类型定义
│   │   └── useAppStore.ts        # Zustand 状态管理
│   ├── lib/
│   │   ├── api.ts                # API 客户端
│   │   ├── constants.ts          # 布局常量
│   │   └── utils.ts              # cn() 工具函数
│   ├── hooks/
│   │   ├── useKeyboard.ts        # 键盘事件 Hook
│   │   └── useTheme.ts           # 主题同步 Hook
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Toggle.tsx        # 开关组件
│   │   │   └── ThemeSwitcher.tsx # 主题切换器
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx       # 左侧面板
│   │   │   ├── PathInput.tsx     # 路径输入
│   │   │   ├── Breadcrumb.tsx    # 面包屑导航
│   │   │   └── FolderList.tsx    # 文件夹列表
│   │   ├── gallery/
│   │   │   ├── Gallery.tsx       # 缩略图网格
│   │   │   └── ThumbnailCard.tsx # 缩略图卡片
│   │   ├── preview/
│   │   │   └── Preview.tsx       # 原图预览
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx     # 三栏布局
│   │   │   └── ResizeHandle.tsx  # 拖拽分隔条
│   │   └── carousel/
│   │       ├── Carousel.tsx      # 轮播容器
│   │       └── CarouselControls.tsx # 轮播控件
│   ├── __tests__/                # 前端测试
│   │   ├── store.test.ts         # 12 个 Store 测试
│   │   ├── api.test.ts           # 2 个 API 测试
│   │   └── components/
│   │       └── Toggle.test.tsx   # 3 个组件测试
│   └── test-setup.ts             # 测试环境 Mock
└── docs/
    └── superpowers/
        └── plans/
            └── 2026-06-08-img-view.md  # 实现计划
```

## API 接口

| Method | Path | Query | Response |
|--------|------|-------|----------|
| `GET` | `/api/files` | `?path=/abs/path` | `{ folders: [...], images: [...], totalCount }` |
| `GET` | `/api/image` | `?path=/abs/path/img.jpg` | `image/*` 二进制流 |

- Fastify 监听 `127.0.0.1:3001`（仅本机访问）
- Vite 开发服务器代理 `/api` → Fastify
- 支持 Unix 和 Windows 绝对路径

## 安全

- 路径必须为绝对路径（Zod 校验）
- 拒绝 `..` 目录穿越
- 仅返回图片文件（jpg, jpeg, png, gif, webp, bmp, svg, avif）
- 跳过隐藏文件/文件夹（`.` 开头）
- Fastify 仅绑定 `127.0.0.1`

## 测试

```bash
npm test          # 运行全部测试
npm run test:watch # 监听模式
```

**52 个测试用例：**
- 35 个路径校验测试（Unix / Windows / UNC / 路径穿越 / 图片扩展名）
- 12 个状态管理测试（Store actions / 轮播 / 主题）
- 3 个 Toggle 组件测试
- 2 个 API 客户端测试

## License

MIT
