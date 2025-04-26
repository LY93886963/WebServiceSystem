# 博物馆文物时间轴项目

一个基于Vue和Flask的博物馆文物时间轴应用，嵌入TimelineJS展示博物馆文物，整体采用黑白高级风格设计。

## 项目特点

- 使用Vue 3构建的前端界面
- Flask后端提供API服务
- 直接嵌入TimelineJS时间轴
- 黑白高级风格设计
- 响应式布局，适配各种设备
- 简洁易用的界面

## 技术栈

- **前端**：Vue 3、Vue Router、Axios
- **后端**：Flask、Flask-CORS
- **时间轴**：TimelineJS

## 安装与使用

### 环境要求

- Node.js >= 12.x
- Python >= 3.6
- 现代浏览器（Chrome、Firefox、Safari等）

### 后端设置

1. 进入后端目录：

```bash
cd museum-timeline/backend
```

2. 创建并激活虚拟环境（可选但推荐）：

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. 安装依赖：

```bash
pip install -r requirements.txt
```

4. 运行应用：

```bash
python app.py
```

后端服务将在 http://localhost:5000 运行。

### 前端设置

1. 进入前端目录：

```bash
cd museum-timeline/frontend
```

2. 安装依赖：

```bash
npm install
```

3. 开发模式运行：

```bash
npm run serve
```

前端应用将在 http://localhost:8080 运行。

4. 生产环境构建：

```bash
npm run build
```

编译后的文件将生成在 `dist` 目录。

## 项目结构

```
museum-timeline/
├── backend/              # Flask后端
│   ├── app.py            # 主应用文件
│   └── requirements.txt  # Python依赖
├── frontend/             # Vue前端
│   ├── public/           # 静态资源
│   ├── src/              # 源代码
│   │   ├── components/   # Vue组件
│   │   ├── views/        # 页面视图
│   │   ├── router/       # 路由配置
│   │   ├── App.vue       # 主组件
│   │   └── main.js       # 入口文件
│   ├── babel.config.js   # Babel配置
│   ├── package.json      # NPM配置
│   └── vue.config.js     # Vue CLI配置
└── README.md             # 项目说明
```

## 自定义配置

要更改嵌入的时间轴，可以修改 `backend/app.py` 文件中的 `timeline_config` 函数返回的URL。

## 开发者

本项目由[您的名字]开发。

## 许可证

MIT 