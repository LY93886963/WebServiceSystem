<template>
  <div class="profile-page">
    <h2 class="page-title">个人信息设置</h2>
    
    <div class="profile-container">
      <div class="profile-sidebar">
        <div class="user-avatar">
          <img :src="userInfo.avatar || 'https://via.placeholder.com/150?text=头像'" alt="用户头像">
          <button class="change-avatar-btn">更换头像</button>
        </div>
        
        <div class="sidebar-menu">
          <button 
            class="menu-item" 
            :class="{ active: activeTab === 'basic' }"
            @click="activeTab = 'basic'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>基本信息</span>
          </button>
          
          <button 
            class="menu-item" 
            :class="{ active: activeTab === 'security' }"
            @click="activeTab = 'security'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>安全设置</span>
          </button>
          
          <button 
            class="menu-item" 
            :class="{ active: activeTab === 'favorites' }"
            @click="activeTab = 'favorites'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <span>我的收藏</span>
          </button>
          
          <button 
            class="menu-item" 
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>浏览历史</span>
          </button>
        </div>
      </div>
      
      <div class="profile-content">
        <!-- 基本信息 -->
        <div v-if="activeTab === 'basic'" class="tab-content">
          <h3 class="tab-title">基本信息</h3>
          
          <form class="profile-form" @submit.prevent="updateBasicInfo">
            <div class="form-group">
              <label for="username">用户名</label>
              <input type="text" id="username" v-model="userInfo.username" placeholder="请输入用户名">
            </div>
            
            <div class="form-group">
              <label for="nickname">昵称</label>
              <input type="text" id="nickname" v-model="userInfo.nickname" placeholder="请输入昵称">
            </div>
            
            <div class="form-group">
              <label for="email">邮箱</label>
              <input type="email" id="email" v-model="userInfo.email" placeholder="请输入邮箱">
            </div>
            
            <div class="form-group">
              <label for="bio">个人简介</label>
              <textarea id="bio" v-model="userInfo.bio" placeholder="请输入个人简介" rows="4"></textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="submit-btn">保存更改</button>
            </div>
          </form>
        </div>
        
        <!-- 安全设置 -->
        <div v-if="activeTab === 'security'" class="tab-content">
          <h3 class="tab-title">安全设置</h3>
          
          <form class="profile-form" @submit.prevent="updatePassword">
            <div class="form-group">
              <label for="current-password">当前密码</label>
              <input type="password" id="current-password" v-model="securityInfo.currentPassword" placeholder="请输入当前密码">
            </div>
            
            <div class="form-group">
              <label for="new-password">新密码</label>
              <input type="password" id="new-password" v-model="securityInfo.newPassword" placeholder="请输入新密码">
            </div>
            
            <div class="form-group">
              <label for="confirm-password">确认新密码</label>
              <input type="password" id="confirm-password" v-model="securityInfo.confirmPassword" placeholder="请再次输入新密码">
            </div>
            
            <div class="form-actions">
              <button type="submit" class="submit-btn">更新密码</button>
            </div>
          </form>
        </div>
        
        <!-- 我的收藏 -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <h3 class="tab-title">我的收藏</h3>
          
          <div v-if="loading" class="loading-indicator">
            <div class="spinner"></div>
            <p>加载中...</p>
          </div>
          
          <div v-else-if="favorites.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <p>您还没有收藏任何文物</p>
            <router-link to="/" class="link-btn">去浏览文物</router-link>
          </div>
          
          <div v-else class="favorites-grid">
            <div v-for="item in favorites" :key="item.id" class="favorite-item">
              <router-link :to="`/artifact/${item.id}`">
                <div class="favorite-image">
                  <img :src="item.image_url" :alt="item.name">
                </div>
                <div class="favorite-info">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.dynasty }}</p>
                </div>
              </router-link>
              <button class="remove-btn" @click="removeFromFavorites(item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 浏览历史 -->
        <div v-if="activeTab === 'history'" class="tab-content">
          <h3 class="tab-title">浏览历史</h3>
          
          <div class="tab-actions">
            <button class="action-btn" @click="clearHistory">
              清空历史记录
            </button>
          </div>
          
          <div v-if="loading" class="loading-indicator">
            <div class="spinner"></div>
            <p>加载中...</p>
          </div>
          
          <div v-else-if="history.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <p>暂无浏览历史</p>
            <router-link to="/" class="link-btn">去浏览文物</router-link>
          </div>
          
          <div v-else class="history-list">
            <div v-for="item in history" :key="item.id" class="history-item">
              <div class="history-time">{{ formatDate(item.viewedAt) }}</div>
              <div class="history-content">
                <router-link :to="`/artifact/${item.id}`" class="history-link">
                  <div class="history-image">
                    <img :src="item.image_url" :alt="item.name">
                  </div>
                  <div class="history-info">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.dynasty }} | {{ item.category }}</p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      activeTab: 'basic',
      loading: false,
      userInfo: {
        username: 'user123',
        nickname: '文物爱好者',
        email: 'user@example.com',
        bio: '我是一名文物爱好者，特别喜欢明清瓷器。',
        avatar: 'https://via.placeholder.com/150?text=头像'
      },
      securityInfo: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      favorites: [
        {
          id: 1,
          name: '清乾隆粉彩镂空云龙纹转心瓶',
          dynasty: '明清',
          image_url: 'https://via.placeholder.com/300x300?text=文物1'
        },
        {
          id: 2,
          name: '商代青铜饕餮纹方鼎',
          dynasty: '先秦',
          image_url: 'https://via.placeholder.com/300x300?text=文物2'
        }
      ],
      history: [
        {
          id: 1,
          name: '清乾隆粉彩镂空云龙纹转心瓶',
          dynasty: '明清',
          category: '陶瓷',
          image_url: 'https://via.placeholder.com/300x300?text=文物1',
          viewedAt: new Date(2023, 4, 15, 14, 30)
        },
        {
          id: 3,
          name: '汉代玉蝉',
          dynasty: '秦汉',
          category: '玉器',
          image_url: 'https://via.placeholder.com/300x300?text=文物3',
          viewedAt: new Date(2023, 4, 14, 10, 15)
        }
      ]
    }
  },
  methods: {
    updateBasicInfo() {
      // 在实际应用中，这里应该发送API请求更新用户信息
      alert('基本信息已更新')
    },
    updatePassword() {
      // 验证密码
      if (!this.securityInfo.currentPassword) {
        alert('请输入当前密码')
        return
      }
      
      if (!this.securityInfo.newPassword) {
        alert('请输入新密码')
        return
      }
      
      if (this.securityInfo.newPassword !== this.securityInfo.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      
      // 在实际应用中，这里应该发送API请求更新密码
      alert('密码已更新')
      this.securityInfo = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    removeFromFavorites(id) {
      // 在实际应用中，这里应该发送API请求移除收藏
      this.favorites = this.favorites.filter(item => item.id !== id)
    },
    clearHistory() {
      if (confirm('确定要清空所有浏览历史吗？')) {
        // 在实际应用中，这里应该发送API请求清空历史
        this.history = []
      }
    },
    formatDate(date) {
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: var(--primary-color);
  text-align: center;
}

.profile-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.profile-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.user-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.change-avatar-btn {
  background-color: transparent;
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.change-avatar-btn:hover {
  background-color: var(--accent-color);
  color: white;
}

.sidebar-menu {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  background-color: transparent;
  color: var(--secondary-color);
  text-align: left;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f9f9f9;
  color: var(--primary-color);
}

.menu-item.active {
  background-color: var(--primary-color);
  color: white;
}

.profile-content {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tab-content {
  padding: 2rem;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0 0 2rem 0;
  color: var(--primary-color);
  position: relative;
  padding-bottom: 1rem;
}

.tab-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--accent-color);
}

.profile-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--primary-color);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-color);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(166, 124, 82, 0.1);
}

.form-actions {
  margin-top: 2rem;
}

.submit-btn {
  padding: 0.75rem 2rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #866341;
}

.tab-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  color: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #e5e5e5;
  color: var(--primary-color);
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: var(--secondary-color);
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #ccc;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.link-btn {
  color: var(--accent-color);
  text-decoration: none;
}

.link-btn:hover {
  text-decoration: underline;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.favorite-item {
  position: relative;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.favorite-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.favorite-item a {
  color: inherit;
  text-decoration: none;
}

.favorite-image {
  height: 160px;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-info {
  padding: 1rem;
}

.favorite-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-color);
}

.favorite-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #dc3545;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-btn:hover {
  background-color: white;
  color: #c82333;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-time {
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.history-content {
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}

.history-link {
  display: flex;
  text-decoration: none;
  color: inherit;
}

.history-image {
  width: 120px;
  height: 90px;
  flex-shrink: 0;
}

.history-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-info {
  padding: 1rem;
  flex: 1;
}

.history-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-color);
}

.history-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
  }
  
  .user-avatar {
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .menu-item {
    padding: 0.75rem 1rem;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style> 