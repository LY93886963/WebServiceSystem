<template>
  <div class="about">
    <div class="about-header">
      <h2>关于本项目</h2>
      <div class="about-header-line"></div>
    </div>
    
    <div class="about-content">
      <section class="about-section">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <div class="section-content">
          <h3>项目介绍</h3>
          <p>博物馆文物时间轴项目旨在展示中国历史悠久的文化瑰宝，通过时间轴的形式，让观众能够直观地了解不同历史时期的文物发展脉络。</p>
          <p>本项目采用现代web技术开发，前端使用Vue.js框架，后端采用Flask提供API服务，时间轴展示部分基于TimelineJS工具实现。</p>
        </div>
      </section>
      
      <section class="about-section">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div class="section-content">
          <h3>使用说明</h3>
          <p>您可以在时间轴上浏览各个时期的文物。时间轴支持以下操作：</p>
          <ul class="feature-list">
            <li>
              <span class="feature-dot"></span>
              <div>
                <strong>时间导航</strong>
                <p>左右滑动查看不同时期的文物</p>
              </div>
            </li>
            <li>
              <span class="feature-dot"></span>
              <div>
                <strong>媒体查看</strong>
                <p>点击文物图片查看大图</p>
              </div>
            </li>
            <li>
              <span class="feature-dot"></span>
              <div>
                <strong>详情阅读</strong>
                <p>点击文物标题查看详细介绍</p>
              </div>
            </li>
            <li>
              <span class="feature-dot"></span>
              <div>
                <strong>快速跳转</strong>
                <p>使用底部时间轴快速定位到特定历史时期</p>
              </div>
            </li>
            <li>
              <span class="feature-dot"></span>
              <div>
                <strong>顺序浏览</strong>
                <p>点击左右箭头在相邻文物间导航</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      
      <section class="about-section">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <div class="section-content">
          <h3>数据来源</h3>
          <p>本项目展示的文物数据来自于多家博物馆的公开数据集，包括但不限于：</p>
          <div class="museum-list">
            <div class="museum-item">
              <div class="museum-logo bg-1">故宫</div>
              <span>故宫博物院</span>
            </div>
            <div class="museum-item">
              <div class="museum-logo bg-2">上博</div>
              <span>上海博物馆</span>
            </div>
            <div class="museum-item">
              <div class="museum-logo bg-3">陕历</div>
              <span>陕西历史博物馆</span>
            </div>
            <div class="museum-item">
              <div class="museum-logo bg-4">国博</div>
              <span>中国国家博物馆</span>
            </div>
            <div class="museum-item">
              <div class="museum-logo bg-5">湘博</div>
              <span>湖南省博物馆</span>
            </div>
          </div>
          <p class="museum-thanks">特此感谢以上机构提供的宝贵数据资源。</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
}

.about-header h2 {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: #000;
}

.about-header-line {
  width: 60px;
  height: 3px;
  background-color: var(--accent-color);
  margin: 0 auto;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.about-section {
  display: flex;
  gap: 1.5rem;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.03);
  padding: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.about-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.section-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-content {
  flex: 1;
}

.section-content h3 {
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
  color: #000;
  position: relative;
}

.section-content p {
  color: var(--secondary-color);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.feature-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--accent-color);
  margin-top: 0.4rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.feature-list li div {
  flex: 1;
}

.feature-list li strong {
  display: block;
  font-weight: 500;
  margin-bottom: 0.3rem;
  color: var(--primary-color);
}

.feature-list li p {
  margin: 0;
  font-size: 0.95rem;
}

.museum-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
}

.museum-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: calc(20% - 0.8rem);
}

.museum-logo {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 500;
  margin-bottom: 0.6rem;
  transition: transform 0.3s;
}

.museum-item:hover .museum-logo {
  transform: scale(1.05);
}

.museum-item span {
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.bg-1 { background-color: #9c2b2e; }
.bg-2 { background-color: #1a5a96; }
.bg-3 { background-color: #a76e3a; }
.bg-4 { background-color: #2c7755; }
.bg-5 { background-color: #634d93; }

.museum-thanks {
  font-style: italic;
  text-align: center;
  margin-top: 1.5rem;
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .about-header {
    margin-bottom: 2rem;
  }
  
  .about-header h2 {
    font-size: 1.7rem;
  }
  
  .about-section {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
  }
  
  .section-icon {
    width: 40px;
    height: 40px;
  }
  
  .museum-list {
    justify-content: center;
  }
  
  .museum-item {
    width: calc(33.33% - 0.7rem);
  }
}
</style> 