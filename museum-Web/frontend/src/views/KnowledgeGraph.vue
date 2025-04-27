<template>
  <div class="knowledge-graph">
    <div class="graph-header">
      <h2>文物知识图谱</h2>
      <div class="header-line"></div>
      <p>探索文物之间的历史与文化联系</p>
    </div>

    <div class="graph-controls">
      <div class="control-group">
        <label for="filter-dynasty">朝代筛选</label>
        <select id="filter-dynasty" v-model="filters.dynasty">
          <option value="">全部朝代</option>
          <option value="先秦">先秦</option>
          <option value="秦汉">秦汉</option>
          <option value="三国两晋南北朝">三国两晋南北朝</option>
          <option value="隋唐">隋唐</option>
          <option value="宋元">宋元</option>
          <option value="明清">明清</option>
        </select>
      </div>

      <div class="control-group">
        <label for="relation-type">关系类型</label>
        <select id="relation-type" v-model="filters.relationType">
          <option value="">全部关系</option>
          <option value="same-era">同时期</option>
          <option value="same-location">同产地</option>
          <option value="influence">影响关系</option>
          <option value="technique">工艺传承</option>
        </select>
      </div>

      <div class="control-group search">
        <label for="search-node">搜索文物</label>
        <input type="text" id="search-node" v-model="filters.search" placeholder="输入文物名称...">
      </div>

      <button class="control-btn" @click="resetGraph">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 9"></path><path d="M3 3v6h6"></path></svg>
        重置视图
      </button>
    </div>

    <div class="graph-container" :class="{ 'loading': loading }">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>正在加载知识图谱...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-icon">!</div>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="loadGraphData" class="retry-btn">重试</button>
      </div>
      
      <div v-else-if="selectedNode" class="node-details">
        <div class="node-details-header">
          <h3>{{ selectedNode.name }}</h3>
          <button class="close-btn" @click="closeDetails">×</button>
        </div>
        
        <div class="node-image">
          <img :src="selectedNode.image" :alt="selectedNode.name">
        </div>
        
        <div class="node-info">
          <div class="info-item">
            <span class="info-label">年代:</span>
            <span class="info-value">{{ selectedNode.dynasty }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">类别:</span>
            <span class="info-value">{{ selectedNode.category }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关联文物:</span>
            <span class="info-value">{{ selectedNode.relatedCount }}件</span>
          </div>
        </div>
        
        <div class="node-description">
          <p>{{ selectedNode.description }}</p>
        </div>
        
        <div class="node-actions">
          <router-link :to="`/artifact/${selectedNode.id}`" class="details-btn">
            查看详情
          </router-link>
        </div>
      </div>
      
      <div ref="graphCanvas" class="graph-canvas"></div>
    </div>

    <div class="graph-legend">
      <h3>图例说明</h3>
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-color node-color-pre-qin"></div>
          <span>先秦文物</span>
        </div>
        <div class="legend-item">
          <div class="legend-color node-color-qin-han"></div>
          <span>秦汉文物</span>
        </div>
        <div class="legend-item">
          <div class="legend-color node-color-medieval"></div>
          <span>三国两晋南北朝文物</span>
        </div>
        <div class="legend-item">
          <div class="legend-color node-color-tang"></div>
          <span>隋唐文物</span>
        </div>
        <div class="legend-item">
          <div class="legend-color node-color-song-yuan"></div>
          <span>宋元文物</span>
        </div>
        <div class="legend-item">
          <div class="legend-color node-color-ming-qing"></div>
          <span>明清文物</span>
        </div>
      </div>
      
      <div class="legend-divider"></div>
      
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-line line-same-era"></div>
          <span>同时期关系</span>
        </div>
        <div class="legend-item">
          <div class="legend-line line-same-location"></div>
          <span>同产地关系</span>
        </div>
        <div class="legend-item">
          <div class="legend-line line-influence"></div>
          <span>影响关系</span>
        </div>
        <div class="legend-item">
          <div class="legend-line line-technique"></div>
          <span>工艺传承</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KnowledgeGraph',
  data() {
    return {
      loading: false,
      error: null,
      graphData: null,
      selectedNode: null,
      filters: {
        dynasty: '',
        relationType: '',
        search: ''
      }
    }
  },
  mounted() {
    // 在实际项目中，这里应该加载图数据并初始化可视化库
    // 例如使用D3.js、vis.js或ECharts来渲染知识图谱
    this.initializeGraph()
  },
  methods: {
    async loadGraphData() {
      this.loading = true
      this.error = null
      
      try {
        // 模拟API请求获取图谱数据
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟数据
        this.graphData = {
          nodes: [
            {
              id: 1,
              name: '清乾隆粉彩镂空云龙纹转心瓶',
              dynasty: '明清',
              category: '陶瓷',
              image: 'https://via.placeholder.com/150x200?text=文物1',
              description: '清代乾隆时期的珍贵陶瓷作品，采用粉彩绘制，外层为镂空云龙纹，内有可转动的心瓶。',
              relatedCount: 5
            },
            // 更多节点...
          ],
          edges: [
            {
              source: 1,
              target: 2,
              relation: 'same-era',
              label: '同时期'
            },
            // 更多边...
          ]
        }
        
        this.loading = false
        this.renderGraph()
      } catch (err) {
        console.error('获取知识图谱数据失败:', err)
        this.error = '获取知识图谱数据失败，请检查网络连接并重试'
        this.loading = false
      }
    },
    initializeGraph() {
      // 初始化图谱
      this.loadGraphData()
    },
    renderGraph() {
      // 在实际项目中，这里应该使用图谱可视化库渲染图谱
      // 例如:
      // const graph = new SomeGraphLibrary({
      //   container: this.$refs.graphCanvas,
      //   data: this.graphData,
      //   config: {...}
      // })
      console.log('渲染图谱', this.graphData)
    },
    resetGraph() {
      // 重置图谱视图和筛选条件
      this.filters = {
        dynasty: '',
        relationType: '',
        search: ''
      }
      // 在实际项目中，这里应该重新渲染图谱
    },
    selectNode(node) {
      // 在实际项目中，这个方法会由图谱库的点击事件触发
      this.selectedNode = node
    },
    closeDetails() {
      this.selectedNode = null
    }
  },
  watch: {
    'filters.dynasty'() {
      // 在实际项目中，这里应该根据筛选条件更新图谱
      console.log('朝代筛选变化', this.filters.dynasty)
    },
    'filters.relationType'() {
      // 在实际项目中，这里应该根据筛选条件更新图谱
      console.log('关系类型筛选变化', this.filters.relationType)
    },
    'filters.search'() {
      // 在实际项目中，这里应该根据搜索词高亮或筛选节点
      console.log('搜索条件变化', this.filters.search)
    }
  }
}
</script>

<style scoped>
.knowledge-graph {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.graph-header {
  text-align: center;
  margin-bottom: 2rem;
}

.graph-header h2 {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.header-line {
  width: 60px;
  height: 3px;
  background-color: var(--accent-color);
  margin: 0 auto 1.5rem;
}

.graph-header p {
  font-size: 1.1rem;
  color: var(--secondary-color);
}

.graph-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: white;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.control-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.control-group.search {
  flex-grow: 1;
}

.control-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--primary-color);
  font-size: 0.9rem;
}

.control-group select,
.control-group input {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-color);
}

.control-group select:focus,
.control-group input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(166, 124, 82, 0.1);
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #f0f0f0;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0 1rem;
  color: var(--primary-color);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: auto;
}

.control-btn:hover {
  background-color: #e5e5e5;
}

.graph-container {
  position: relative;
  height: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
}

.loading-overlay {
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

.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
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

.graph-canvas {
  width: 100%;
  height: 100%;
}

.node-details {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 5;
  overflow: hidden;
}

.node-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
}

.node-details-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.node-image {
  width: 100%;
  height: 180px;
}

.node-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.node-info {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.info-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: var(--primary-color);
  width: 80px;
}

.info-value {
  color: var(--secondary-color);
}

.node-description {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--secondary-color);
  font-size: 0.9rem;
  line-height: 1.5;
}

.node-actions {
  padding: 1rem;
  text-align: center;
}

.details-btn {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: var(--accent-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.details-btn:hover {
  background-color: #866341;
}

.graph-legend {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.graph-legend h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  color: var(--primary-color);
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.node-color-pre-qin {
  background-color: #5470c6;
}

.node-color-qin-han {
  background-color: #91cc75;
}

.node-color-medieval {
  background-color: #fac858;
}

.node-color-tang {
  background-color: #ee6666;
}

.node-color-song-yuan {
  background-color: #73c0de;
}

.node-color-ming-qing {
  background-color: #9a60b4;
}

.legend-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 1rem 0;
}

.legend-line {
  width: 30px;
  height: 3px;
}

.line-same-era {
  background-color: #5470c6;
}

.line-same-location {
  background-color: #91cc75;
}

.line-influence {
  background-color: #fac858;
}

.line-technique {
  background-color: #ee6666;
}

@media (max-width: 768px) {
  .graph-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .control-group {
    width: 100%;
  }
  
  .graph-container {
    height: 500px;
  }
  
  .node-details {
    width: calc(100% - 2rem);
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    top: auto;
    max-height: 300px;
    overflow-y: auto;
  }
}
</style> 