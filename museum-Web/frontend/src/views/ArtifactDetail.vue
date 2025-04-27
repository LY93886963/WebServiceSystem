<template>
  <div class="artifact-detail">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>正在加载文物信息...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">!</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <div class="error-actions">
        <button @click="fetchArtifact" class="retry-btn">重试</button>
        <router-link to="/" class="back-btn">返回首页</router-link>
      </div>
    </div>

    <div v-else class="artifact-content">
      <div class="artifact-header">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <router-link to="/">文物展示</router-link>
          <span class="separator">/</span>
          <span class="current">{{ artifact.name }}</span>
        </div>
        
        <div class="artifact-actions">
          <button class="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            收藏
          </button>
          <button class="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
            分享
          </button>
        </div>
      </div>

      <div class="artifact-main">
        <div class="artifact-gallery">
          <div class="main-image">
            <img :src="artifact.image_url" :alt="artifact.name">
            <button class="zoom-btn" @click="openGallery">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
          </div>
          <div class="thumbnail-list">
            <div 
              v-for="(image, index) in artifact.images" 
              :key="index"
              class="thumbnail"
              :class="{ active: index === 0 }"
            >
              <img :src="image" :alt="`${artifact.name} - 图片 ${index + 1}`">
            </div>
          </div>
        </div>

        <div class="artifact-info">
          <h1>{{ artifact.name }}</h1>

          <div class="info-tags">
            <span class="info-tag dynasty">{{ artifact.dynasty }}</span>
            <span class="info-tag category">{{ artifact.category }}</span>
            <span v-if="artifact.national_treasure" class="info-tag treasure">国宝级文物</span>
          </div>

          <div class="info-meta">
            <div class="meta-item">
              <span class="meta-label">年代</span>
              <span class="meta-value">{{ artifact.year }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">出土地点</span>
              <span class="meta-value">{{ artifact.excavation_site || '未知' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">馆藏机构</span>
              <span class="meta-value">{{ artifact.museum }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">尺寸</span>
              <span class="meta-value">{{ artifact.dimensions || '未记录' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">材质</span>
              <span class="meta-value">{{ artifact.material }}</span>
            </div>
          </div>

          <div class="artifact-description">
            <h3>文物简介</h3>
            <div class="description-content">
              <p v-for="(paragraph, index) in artifact.description.split('\n\n')" :key="index">
                {{ paragraph }}
              </p>
            </div>
          </div>

          <div class="artifact-features">
            <h3>艺术特点</h3>
            <ul class="feature-list">
              <li v-for="(feature, index) in artifact.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="artifact-sections">
        <div class="artifact-section">
          <h2>文物背景</h2>
          <div class="section-content">
            <p v-for="(paragraph, index) in artifact.background.split('\n\n')" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>

        <div class="artifact-section">
          <h2>历史意义</h2>
          <div class="section-content">
            <p v-for="(paragraph, index) in artifact.significance.split('\n\n')" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>

      <div class="related-artifacts">
        <h2>相关文物</h2>
        <div class="related-list">
          <div v-for="relatedArtifact in artifact.related" :key="relatedArtifact.id" class="related-item">
            <router-link :to="`/artifact/${relatedArtifact.id}`">
              <div class="related-image">
                <img :src="relatedArtifact.image_url" :alt="relatedArtifact.name">
              </div>
              <div class="related-info">
                <h4>{{ relatedArtifact.name }}</h4>
                <p>{{ relatedArtifact.dynasty }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtifactDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      artifact: {
        id: 1,
        name: '清乾隆粉彩镂空云龙纹转心瓶',
        dynasty: '明清',
        year: '公元1736年-1795年（乾隆年间）',
        category: '陶瓷',
        material: '瓷器、粉彩',
        dimensions: '高26.3厘米，口径6.7厘米',
        museum: '故宫博物院',
        excavation_site: '北京故宫',
        national_treasure: true,
        image_url: 'https://via.placeholder.com/600x800?text=文物图片',
        images: [
          'https://via.placeholder.com/600x800?text=文物图片1',
          'https://via.placeholder.com/600x800?text=文物图片2',
          'https://via.placeholder.com/600x800?text=文物图片3'
        ],
        description: '清代乾隆时期的珍贵陶瓷作品，采用粉彩绘制，外层为镂空云龙纹，内有可转动的心瓶，工艺精湛，体现了清代宫廷瓷器的高超技艺和审美追求。\n\n此瓶由内外两层组成，外层镂空雕刻云龙纹样，内层为素面瓶体，可在外层内自由转动。粉彩绘画细腻华丽，色彩艳丽，龙纹生动威严，云纹流畅自然，展现了清代官窑瓷器的巅峰水平。',
        features: [
          '双层镂空结构，内外两层均可独立存在',
          '外层采用精细镂空雕刻技术，云龙纹生动形象',
          '粉彩绘制细腻，色彩鲜艳饱满',
          '釉面光洁透亮，胎质细腻坚硬',
          '底部有"大清乾隆年制"六字三行篆书款'
        ],
        background: '此件转心瓶创作于清代乾隆年间，是宫廷御用瓷器，代表了清代官窑的最高水平。乾隆皇帝酷爱精巧的艺术品，对瓷器生产极为重视，亲自参与设计和监制，推动了景德镇御窑厂创造出众多技艺精湛的陶瓷珍品。\n\n转心瓶是清代景德镇窑创烧的特殊器型，需要经过复杂的制作工艺，体现了当时陶瓷工艺的卓越成就。这类瓷器不仅是实用器皿，更是皇家威严和审美的象征。',
        significance: '这件转心瓶是清代官窑瓷器中的代表作，其工艺复杂、造型精美，展现了中国陶瓷制作的杰出成就。它不仅具有极高的艺术价值，也是研究清代宫廷文化和陶瓷工艺发展的重要实物资料。\n\n从艺术角度看，此瓶融合了传统纹样与创新技法，展现了中国传统工艺的精湛与创造力。从历史角度看，它反映了乾隆时期国力昌盛、文化繁荣的社会背景，也折射出当时皇室对精致生活的追求。',
        related: [
          {
            id: 2,
            name: '清雍正斗彩花卉纹碗',
            dynasty: '明清',
            image_url: 'https://via.placeholder.com/300x300?text=相关文物1'
          },
          {
            id: 3,
            name: '清康熙五彩龙纹盘',
            dynasty: '明清',
            image_url: 'https://via.placeholder.com/300x300?text=相关文物2'
          },
          {
            id: 4,
            name: '清乾隆青花缠枝莲纹瓶',
            dynasty: '明清',
            image_url: 'https://via.placeholder.com/300x300?text=相关文物3'
          }
        ]
      },
      loading: false,
      error: null
    }
  },
  mounted() {
    // 实际开发中应该从API获取数据
    // this.fetchArtifact()
  },
  methods: {
    async fetchArtifact() {
      this.loading = true
      this.error = null
      
      try {
        // 模拟API请求
        // const response = await axios.get(`/api/artifacts/${this.id}`)
        // this.artifact = response.data
        
        // 模拟数据加载延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.loading = false
      } catch (err) {
        console.error('获取文物详情失败:', err)
        this.error = '获取文物详情失败，请检查网络连接并重试'
        this.loading = false
      }
    },
    openGallery() {
      // 实现图片查看器逻辑
      alert('打开图片查看器功能')
    }
  }
}
</script>

<style scoped>
.artifact-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-color);
  animation: spin 1s infinite linear;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.error-container h3 {
  margin-bottom: 1rem;
  color: #721c24;
}

.error-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.retry-btn,
.back-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.retry-btn {
  background-color: var(--accent-color);
  color: white;
  border: none;
}

.retry-btn:hover {
  background-color: #866341;
}

.back-btn {
  background-color: #f0f0f0;
  color: var(--primary-color);
  border: 1px solid #ddd;
}

.back-btn:hover {
  background-color: #e5e5e5;
}

.artifact-content {
  padding: 2rem 0;
}

.artifact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.breadcrumb a {
  color: var(--accent-color);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  color: #ccc;
}

.current {
  color: var(--secondary-color);
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artifact-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--primary-color);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #f0f0f0;
  border-color: #ccc;
}

.artifact-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.artifact-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  height: 500px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.zoom-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--primary-color);
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.zoom-btn:hover {
  background-color: white;
}

.thumbnail-list {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s, transform 0.3s;
  border: 2px solid transparent;
}

.thumbnail:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.thumbnail.active {
  opacity: 1;
  border-color: var(--accent-color);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artifact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.artifact-info h1 {
  font-size: 1.8rem;
  font-weight: 500;
  margin: 0;
  color: var(--primary-color);
  line-height: 1.3;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.info-tag {
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.dynasty {
  background-color: #f0f0f0;
  color: #444;
}

.category {
  background-color: #e6f0ff;
  color: #0066cc;
}

.treasure {
  background-color: #fff3cd;
  color: #856404;
}

.info-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.85rem;
  color: var(--secondary-color);
}

.meta-value {
  font-weight: 500;
  color: var(--primary-color);
}

.artifact-description,
.artifact-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.artifact-description h3,
.artifact-features h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  color: var(--primary-color);
}

.description-content {
  line-height: 1.7;
  color: var(--secondary-color);
}

.description-content p {
  margin-bottom: 1rem;
}

.description-content p:last-child {
  margin-bottom: 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-list li {
  position: relative;
  padding-left: 1.5rem;
  color: var(--secondary-color);
}

.feature-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--accent-color);
  font-size: 1.2rem;
  line-height: 1;
}

.artifact-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 3rem;
}

.artifact-section {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.artifact-section h2 {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0 0 1.5rem 0;
  color: var(--primary-color);
  position: relative;
  padding-bottom: 1rem;
}

.artifact-section h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--accent-color);
}

.section-content {
  line-height: 1.7;
  color: var(--secondary-color);
}

.section-content p {
  margin-bottom: 1rem;
}

.section-content p:last-child {
  margin-bottom: 0;
}

.related-artifacts {
  margin-bottom: 3rem;
}

.related-artifacts h2 {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0 0 1.5rem 0;
  color: var(--primary-color);
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.related-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.related-item a {
  color: inherit;
  text-decoration: none;
}

.related-image {
  height: 180px;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info {
  padding: 1rem;
}

.related-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-color);
}

.related-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--secondary-color);
}

@media (max-width: 992px) {
  .artifact-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .main-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .artifact-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .info-meta {
    grid-template-columns: 1fr;
  }
  
  .related-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style> 