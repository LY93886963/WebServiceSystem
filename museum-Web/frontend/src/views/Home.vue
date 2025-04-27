<template>
  <div class="home">
    <div class="home-header">
      <h2>博物馆文物展览</h2>
      <div class="header-line"></div>
      <p>探索中华文明的瑰宝</p>
    </div>

    <div class="artifact-filters">
      <div class="filter-group">
        <label for="dynasty">朝代</label>
        <select id="dynasty" v-model="filters.dynasty">
          <option value="">全部朝代</option>
          <option value="先秦">先秦</option>
          <option value="秦汉">秦汉</option>
          <option value="三国两晋南北朝">三国两晋南北朝</option>
          <option value="隋唐">隋唐</option>
          <option value="宋元">宋元</option>
          <option value="明清">明清</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="category">类别</label>
        <select id="category" v-model="filters.category">
          <option value="">全部类别</option>
          <option value="陶瓷">陶瓷</option>
          <option value="青铜器">青铜器</option>
          <option value="玉器">玉器</option>
          <option value="书画">书画</option>
          <option value="金银器">金银器</option>
          <option value="其他">其他</option>
        </select>
      </div>
      <div class="filter-group search">
        <label for="search">搜索</label>
        <input type="text" id="search" v-model="filters.search" placeholder="输入关键词搜索...">
      </div>
    </div>

    <div class="artifacts-section">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>正在加载文物数据...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <div class="error-icon">!</div>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="fetchArtifacts" class="retry-btn">重试</button>
      </div>

      <div v-else-if="filteredArtifacts.length === 0" class="no-results">
        <p>未找到符合条件的文物</p>
      </div>

      <div v-else class="artifacts-grid">
        <div v-for="artifact in filteredArtifacts" :key="artifact.id" class="artifact-card">
          <router-link :to="'/artifact/' + artifact.id">
            <div class="artifact-image">
              <img :src="artifact.image_url" :alt="artifact.name">
              <div class="artifact-overlay">
                <span>查看详情</span>
              </div>
            </div>
            <div class="artifact-info">
              <h3>{{ artifact.name }}</h3>
              <div class="artifact-meta">
                <span class="dynasty">{{ artifact.dynasty }}</span>
                <span class="category">{{ artifact.category }}</span>
              </div>
              <p class="artifact-desc">{{ artifact.short_description }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div class="explore-more">
      <h3>探索更多</h3>
      <div class="explore-cards">
        <router-link to="/timeline" class="explore-card">
          <div class="explore-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </div>
          <h4>时间轴</h4>
          <p>按时间顺序浏览文物</p>
        </router-link>
        <router-link to="/knowledge-graph" class="explore-card">
          <div class="explore-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </div>
          <h4>知识图谱</h4>
          <p>探索文物之间的关联</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      artifacts: [
        { 
          id: 1, 
          name: '清乾隆粉彩镂空云龙纹转心瓶', 
          dynasty: '明清', 
          category: '陶瓷', 
          image_url: 'https://via.placeholder.com/300x400?text=文物图片',
          short_description: '清乾隆时期精美的粉彩瓷器，外层镂空云龙纹，内有转心装置，工艺精湛。'
        },
        { 
          id: 2, 
          name: '商代青铜饕餮纹方鼎', 
          dynasty: '先秦', 
          category: '青铜器', 
          image_url: 'https://via.placeholder.com/300x400?text=文物图片',
          short_description: '商代青铜礼器，四足方形，器身饰有饕餮纹，是商代青铜铸造工艺的代表作。'
        },
        { 
          id: 3, 
          name: '汉代玉蝉', 
          dynasty: '秦汉', 
          category: '玉器', 
          image_url: 'https://via.placeholder.com/300x400?text=文物图片',
          short_description: '汉代墓葬用玉，象征灵魂不朽与永生，常见于汉代贵族墓葬中。'
        },
        { 
          id: 4, 
          name: '唐三彩马', 
          dynasty: '隋唐', 
          category: '陶瓷', 
          image_url: 'https://via.placeholder.com/300x400?text=文物图片',
          short_description: '唐代三彩釉陶马，色彩艳丽，形象生动，反映了唐代人们对马的喜爱和崇拜。'
        },
        { 
          id: 5, 
          name: '宋代钧窑天青釉碗', 
          dynasty: '宋元', 
          category: '陶瓷', 
          image_url: 'https://via.placeholder.com/300x400?text=文物图片',
          short_description: '北宋钧窑天青釉碗，釉色如天青色，具有窑变效果，是宋代五大名窑之一的代表作。'
        },
        { 
          id: 6, 
          name: '明《簪花仕女图》', 
          dynasty: '明清', 
          category: '书画', 
          image_url: 'https://via.placeholder.com/300x400?text=文物图片',
          short_description: '明代仕女画作品，描绘了宫廷贵族女子的优雅生活，笔法细腻，色彩艳丽。'
        }
      ],
      filters: {
        dynasty: '',
        category: '',
        search: ''
      },
      loading: false,
      error: null
    }
  },
  computed: {
    filteredArtifacts() {
      return this.artifacts.filter(artifact => {
        // 朝代筛选
        if (this.filters.dynasty && artifact.dynasty !== this.filters.dynasty) {
          return false
        }
        
        // 类别筛选
        if (this.filters.category && artifact.category !== this.filters.category) {
          return false
        }
        
        // 搜索筛选
        if (this.filters.search) {
          const searchTerm = this.filters.search.toLowerCase()
          return (
            artifact.name.toLowerCase().includes(searchTerm) ||
            artifact.dynasty.toLowerCase().includes(searchTerm) ||
            artifact.category.toLowerCase().includes(searchTerm) ||
            artifact.short_description.toLowerCase().includes(searchTerm)
          )
        }
        
        return true
      })
    }
  },
  mounted() {
    // 模拟数据加载
    // this.fetchArtifacts()
  },
  methods: {
    async fetchArtifacts() {
      this.loading = true
      this.error = null
      
      try {
        // 这里应该是从API获取数据
        // const response = await axios.get('/api/artifacts')
        // this.artifacts = response.data
        
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.loading = false
      } catch (err) {
        console.error('获取文物数据失败:', err)
        this.error = '获取文物数据失败，请检查网络连接并重试'
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 3rem;
}

.home-header h2 {
  font-size: 2.2rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: #000;
}

.header-line {
  width: 60px;
  height: 3px;
  background-color: var(--accent-color);
  margin: 0 auto 1.5rem;
}

.home-header p {
  font-size: 1.2rem;
  color: var(--secondary-color);
}

.artifact-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.filter-group.search {
  flex-grow: 1;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--primary-color);
}

.filter-group select,
.filter-group input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text-color);
  background-color: #fff;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(166, 124, 82, 0.1);
}

.artifacts-section {
  margin-bottom: 4rem;
  min-height: 400px;
}

.artifacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.artifact-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.artifact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.artifact-image {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.artifact-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.artifact-card:hover .artifact-image img {
  transform: scale(1.05);
}

.artifact-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.artifact-card:hover .artifact-overlay {
  opacity: 1;
}

.artifact-info {
  padding: 1.5rem;
}

.artifact-info h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--primary-color);
}

.artifact-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.artifact-meta span {
  font-size: 0.85rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.dynasty {
  background-color: #f0f0f0;
  color: #444;
}

.category {
  background-color: #e6f0ff;
  color: #0066cc;
}

.artifact-desc {
  margin: 0;
  font-size: 0.95rem;
  color: var(--secondary-color);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.loading-container,
.error-container,
.no-results {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
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

.explore-more {
  background-color: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.explore-more h3 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: #000;
}

.explore-cards {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.explore-card {
  flex: 1;
  max-width: 300px;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.explore-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.explore-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.25rem;
}

.explore-card h4 {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
}

.explore-card p {
  margin: 0;
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .artifact-filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .explore-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .explore-card {
    width: 100%;
  }
}
</style> 