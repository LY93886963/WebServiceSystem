<template>
  <header class="museum-header">
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="museum-name">THE CLEVELAND MUSEUM OF ART</div>
      <div class="utility-links">
        <a href="#">Visit</a>
        <a href="#">What's On</a>
        <a href="#">Art</a>
        <a href="#">Donate</a>
        <a href="#">Join/Log in</a>
      </div>
    </div>

    <!-- 主导航栏 -->
    <nav class="main-nav">
      <router-link to="/" class="logo-link">
        <span class="logo-text">文物数字博物馆</span>
      </router-link>

      <div class="search-container" ref="searchContainer">
        <form @submit.prevent="handleSearch">
          <button type="submit" class="search-icon-button">
            <svg class="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search the Collection"
            class="search-input"
            @focus="showSearchPanel = true"
            @blur="setTimeout(() => { showSearchPanel = false }, 200)"
          >
        </form>

        <!-- 搜索扩展面板 -->
        <div class="search-panel" v-show="showSearchPanel">
          <div class="search-categories">
            <h4>Popular</h4>
            <a href="#">Identities</a>
            <a href="#">Highlights</a>
            <a href="#">Open Access</a>
            <a href="#">With Videos</a>
            <a href="#">New Objects</a>
            <a href="#">In 3-D</a>
          </div>
          <div class="advanced-search">
            <a href="#">Advanced Search</a>
          </div>
        </div>
      </div>

      <nav class="category-nav">
        <router-link to="/timeline">时间轴</router-link>
        <router-link to="/knowledge">知识图谱</router-link>
        <router-link to="/exhibitions">特展</router-link>
      </nav>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'MuseumNavBar',
  data() {
    return {
      searchQuery: '',
      showSearchPanel: false
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: '/search',
          query: { q: this.searchQuery }
        })
        this.showSearchPanel = false
      }
    },
    // 新增方法：处理文档点击事件
    handleDocumentClick(event) {
      // 检查点击是否发生在搜索容器内部
      const searchContainer = this.$refs.searchContainer;
      if (searchContainer && !searchContainer.contains(event.target)) {
        this.showSearchPanel = false;
      }
    }
  },
  mounted() {
    // 添加全局点击监听
    document.addEventListener('click', this.handleDocumentClick);
  },
  beforeUnmount() {
    // 组件销毁时移除监听，避免内存泄漏
    document.removeEventListener('click', this.handleDocumentClick);
  }
}
</script>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.museum-header {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.85rem;
}

.museum-name {
  font-weight: bold;
  letter-spacing: 0.05em;
  color: #333;
}

.utility-links a {
  color: #666;
  text-decoration: none;
  margin-left: 1.5rem;
  transition: color 0.3s;
}

.utility-links a:hover {
  color: #000;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-link {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  flex-shrink: 0;
  margin-right: 2rem;
}

.search-container {
  position: relative;
  flex-grow: 1;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s;
}

.search-input:focus {
  border-color: #666;
}

.search-icon-button {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.search-icon {
  width: 20px;
  height: 20px;
  fill: #666;
}

.search-panel {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
}

.search-categories {
  flex: 3;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.search-categories h4 {
  grid-column: 1 / -1;
  margin-bottom: 0.5rem;
  color: #333;
}

.search-categories a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.search-categories a:hover {
  color: #000;
}

.advanced-search {
  flex: 1;
  border-left: 1px solid #eee;
  padding-left: 1.5rem;
}

.advanced-search a {
  color: #0066cc;
  text-decoration: none;
  font-size: 0.9rem;
}

.category-nav {
  display: flex;
  margin-left: 2rem;
}

.category-nav a {
  color: #333;
  text-decoration: none;
  margin-left: 1.5rem;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.category-nav a:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #333;
  transition: width 0.3s;
}

.category-nav a:hover:after,
.category-nav a.router-link-exact-active:after {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-nav {
    flex-wrap: wrap;
    padding-bottom: 0;
  }

  .logo-link {
    order: 1;
    margin-bottom: 1rem;
  }

  .search-container {
    order: 3;
    width: 100%;
    margin: 1rem 0;
  }

  .category-nav {
    order: 2;
    margin-left: auto;
    margin-bottom: 1rem;
  }
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    padding: 0.5rem;
  }

  .museum-name {
    margin-bottom: 0.5rem;
  }

  .utility-links a {
    margin: 0 0.5rem;
  }

  .search-categories {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .category-nav {
    width: 100%;
    justify-content: space-around;
    margin: 0.5rem 0;
  }

  .category-nav a {
    margin: 0;
  }
}
</style>