<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <h1>博物馆文物时间轴</h1>
        <nav class="main-nav">
          <router-link to="/" exact>首页</router-link>
          <router-link to="/about">关于</router-link>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="footer">
      <div class="footer-content">
        <p>© {{ new Date().getFullYear() }} 博物馆文物时间轴项目</p>
        <p class="footer-links">
          <a href="#" target="_blank">使用指南</a> | 
          <a href="#" target="_blank">联系我们</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  --primary-color: #222;
  --secondary-color: #555;
  --accent-color: #a67c52;
  --background-color: #f8f8f8;
  --text-color: #333;
  --border-color: #ddd;
  --card-bg-color: #fff;
  --header-height: 70px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Noto Serif SC', serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

a {
  color: var(--accent-color);
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: #866341;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 1.8rem;
  margin: 0;
  display: flex;
  align-items: center;
}

.header h1::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 28px;
  background-color: var(--accent-color);
  margin-right: 15px;
}

.main-nav {
  display: flex;
  gap: 25px;
}

.main-nav a {
  color: #fff;
  font-size: 1rem;
  position: relative;
  padding: 5px 0;
}

.main-nav a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--accent-color);
  transition: width 0.3s;
}

.main-nav a:hover::after,
.main-nav a.router-link-active::after {
  width: 100%;
}

.main-nav a.router-link-active {
  color: var(--accent-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.footer-links a {
  color: #ccc;
  margin-left: 5px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--accent-color);
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    padding: 0.5rem 1rem;
    gap: 0.5rem;
  }
  
  .header {
    height: auto;
    padding: 0.75rem 0;
  }
  
  .header h1 {
    font-size: 1.4rem;
  }
  
  .main-nav {
    gap: 15px;
  }
  
  .main-content {
    padding: 1.5rem 1rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style> 