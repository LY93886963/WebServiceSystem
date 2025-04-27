<template>
  <div class="timeline-page">
    <div class="intro-section">
      <div class="intro">
        <h2>{{ timelineConfig.title }}</h2>
        <div class="intro-line"></div>
        <p>{{ timelineConfig.description }}</p>
      </div>
    </div>
    
    <div class="timeline-section">
      <div class="timeline-container" :class="{ 'loading': loading }">
        <div class="timeline-loading" v-if="loading">
          <div class="spinner"></div>
          <p>正在加载时间轴...</p>
        </div>
        <div class="timeline-error" v-if="error">
          <div class="error-icon">!</div>
          <h3>加载失败</h3>
          <p>{{ error }}</p>
          <button @click="fetchTimelineConfig" class="retry-btn">重试</button>
        </div>
        <iframe
          v-show="!loading && !error"
          :src="timelineConfig.embed_url"
          width="100%"
          height="650"
          allowfullscreen
          frameborder="0"
        ></iframe>
      </div>
    </div>
    
    <div class="info-section">
      <div class="info-col">
        <div class="timeline-info">
          <div class="info-header">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <h3>关于本时间轴</h3>
          </div>
          <p>本时间轴展示了博物馆珍贵文物的历史发展过程，您可以通过滚动时间轴来浏览不同时期的文物，点击文物了解更多详细信息。</p>
          <p>这些文物按照年代顺序展示，展现了中国文化的悠久历史和深厚底蕴。</p>
        </div>
      </div>
      
      <div class="info-col">
        <div class="timeline-info">
          <div class="info-header">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3>使用指南</h3>
          </div>
          <ul class="info-list">
            <li>左右滑动查看不同时期的文物</li>
            <li>点击文物图片查看大图</li>
            <li>点击底部时间轴可快速跳转至不同时期</li>
            <li>使用左右箭头按钮可浏览相邻文物</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TimelinePage',
  data() {
    return {
      timelineConfig: {
        embed_url: 'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2:2PACX-1vSn1D7R-DPMPyh_8mCPoXM0nTP2UiPFB1g8UUYkZEEREb1OmPp4Cwq6d_9Se7XbM7uVV8f3FSjw1l-F&font=Default&lang=en&initial_zoom=2&height=650',
        title: '博物馆文物时间轴',
        description: '展示博物馆珍贵文物的历史时间线'
      },
      loading: true,
      error: null
    }
  },
  mounted() {
    this.fetchTimelineConfig()
  },
  methods: {
    async fetchTimelineConfig() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/api/timeline/config')
        this.timelineConfig = response.data
        this.loading = false
      } catch (err) {
        console.error('获取时间轴配置失败:', err)
        this.error = '获取时间轴配置失败，请检查网络连接并重试'
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.timeline-page {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 100%;
}

.intro-section {
  position: relative;
  padding: 2rem 0;
}

.intro-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background-color: #f3f3f3;
  z-index: -1;
}

.intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
}

.intro h2 {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1.5rem;
  color: #000;
}

.intro-line {
  width: 60px;
  height: 3px;
  background-color: var(--accent-color);
  margin: 0 auto 1.5rem;
}

.intro p {
  font-size: 1.1rem;
  color: var(--secondary-color);
  line-height: 1.7;
}

.timeline-section {
  padding: 0 1rem;
}

.timeline-container {
  width: 100%;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  min-height: 650px;
}

.timeline-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-color);
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.timeline-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index: 10;
  padding: 2rem;
  text-align: center;
}

.error-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8d7da;
  color: #721c24;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.timeline-error h3 {
  margin-bottom: 1rem;
  color: #721c24;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #866341;
}

.info-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-col {
  flex: 1;
  min-width: 0;
}

.timeline-info {
  background-color: white;
  padding: 1.5rem;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
}

.timeline-info h3 {
  margin: 0;
  font-weight: 500;
  color: #000;
  font-size: 1.3rem;
}

.timeline-info p {
  margin-bottom: 1rem;
  line-height: 1.7;
  color: var(--secondary-color);
}

.timeline-info p:last-child {
  margin-bottom: 0;
}

.info-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.info-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.8rem;
  line-height: 1.6;
  color: var(--secondary-color);
}

.info-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--accent-color);
  font-size: 1.2rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .timeline-page {
    gap: 2rem;
  }
  
  .intro {
    padding: 1.5rem;
  }
  
  .intro h2 {
    font-size: 1.5rem;
  }
  
  .intro p {
    font-size: 1rem;
  }
  
  .info-section {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .timeline-container iframe {
    height: 500px;
  }
}
</style> 