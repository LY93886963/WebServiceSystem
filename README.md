# 海外文物知识服务子系统

## 👀简介

本项目是一个基于 **Flask** 和 **Vue** 开发的 Web 应用，旨在为用户提供文物展示、查询、可视化和个人信息管理等服务。系统通过知识图谱技术展示文物相关数据，支持数据浏览、查询和可视化显示，帮助用户更好地了解和探索文物信息。

## 📦Usage

- 安装

```python
git clone https://github.com/LY93886963/WebServiceSystem.git
conda create -n WebServiceSystem
conda activate WebServiceSystem
```

- 前端

```python
cd frontend
npm install
npm run serve
```

- 后端

```python
cd backend
pip install -r requirements.txt
python app.py
```



## 📌技术栈

- 前端：Vue 3、Axios、Vue Router、Pinia、Element Plus/Ant Design Vue、ECharts/D3.js
- 后端：Flask、Flask-SQLAlchemy、Flask-CORS、Werkzeug、PyPinyin、Neo4j Python Driver 
- 数据库：MySQL 、neo4j

## ⏳功能模块

#### 数据浏览

- **筛选与排序**：支持按照文物类型、年代、博物馆等进行筛选、排序，以便用户快速找到感兴趣的文物
- **文物详情**：每件文物提供详细的信息展示，包括文本内容、图像等，用户可以点击文物图片进行放大查看
-  **相关文物推荐**：在每件文物的页面中，展示与该文物相关的其他文物，相关规则可以是相似主题、同一作者、图像内容相似等

#### 数据查询

- **简单查询**：用户可以通过输入关键字（如文物名称、博物馆名称、文物年代等）进行快速查询
-  **高级查询**：提供对文物多个字段的高级筛选和查询功能，用户可以根据需求进行更精确的文物查找

#### 数据可视化

- **知识图谱展示**：通过力导向图展示文物知识图谱，用户可以从不同角度探索文物之间的关系。参考全历史网站、Neo4j 图数据库等可视化效果。
- **文物时间轴**：按照时间轴展示文物的相关信息，帮助用户了解文物的历史背景和时代沿革

#### 用户个人信息管理

- **用户注册与登录**：支持用户注册、登录、修改密码等基本个人信息管理功能。
-  **收藏与浏览记录**：用户可以收藏感兴趣的文物，系统记录用户的浏览历史，并提供个性化推荐。
