# 博物馆文物历史时间轴项目

一个基于Vue和Flask的博物馆文物历史时间轴应用，使用Timeline JS展示文物历史，采用黑白高级风格。

## 功能特点

- 前端：基于Vue3的响应式界面
- 后端：Flask提供REST API
- 数据库：MySQL存储博物馆文物数据
- 时间轴展示：使用Timeline JS展示精美的文物历史时间轴
- 功能：
  - 按朝代和出处筛选文物
  - 精美的黑白高级风格
  - 支持图片展示
  - 详细的文物信息描述
  - 链接到文物详情页面

## 技术栈

- 前端：Vue 3、Axios
- 后端：Flask、Flask-SQLAlchemy、Flask-CORS
- 数据库：MySQL (binxifaniya_museum)
- 第三方工具：Timeline JS

## 安装和使用

### 前提条件

- Node.js (v12+)
- Python (v3.7+)
- MySQL数据库

### 后端设置

1. 创建并激活Python虚拟环境（可选但推荐）：

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

2. 安装后端依赖：

```bash
pip install -r requirements.txt
```

3. 设置环境变量：

```bash
# 复制环境变量示例文件
cp backend/.env.example backend/.env

# 然后编辑.env文件，确认数据库连接信息
# DATABASE_URI=mysql+pymysql://cs2202:abcd@123.56.94.39/binxifaniya_museum
```

4. 运行后端服务：

```bash
cd backend
python run.py
```

### 前端设置

1. 安装前端依赖：

```bash
cd frontend
npm install
```

2. 运行开发服务器：

```bash
npm run serve
```

3. 构建生产版本：

```bash
npm run build
```

## 项目结构

```
├── backend/             # 后端Flask应用
│   ├── app/             # 应用代码
│   │   ├── models/      # 数据库模型
│   │   ├── routes/      # API路由
│   │   └── __init__.py  # 应用初始化
│   ├── .env.example     # 环境变量示例
│   └── run.py           # 应用入口点
│
├── frontend/            # 前端Vue应用
│   ├── public/          # 静态文件
│   ├── src/             # 源代码
│   │   ├── assets/      # 资源文件
│   │   ├── components/  # Vue组件
│   │   ├── App.vue      # 主组件
│   │   └── main.js      # 入口点
│   ├── package.json     # 包配置
│   └── vue.config.js    # Vue配置
│
├── requirements.txt     # Python依赖
└── README.md            # 项目文档
```

## 数据库结构

项目使用binxifaniya_museum数据库中的数据，包含以下字段：

- 博物馆博物编号 (artifact_number)
- 文物详细信息 (detailed_info)
- 文物名称 (artifact_name)
- 时间 (time_period)
- 朝代 (dynasty)
- 出处 (provenance)
- 详情页地址 (detail_url)
- 图片url (image_url)

## 许可证

本项目采用MIT许可证。
