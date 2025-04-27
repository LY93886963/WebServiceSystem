<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <router-link to="/" class="home-link">返回首页</router-link>
    </div>
    <div class="not-found-image">
      <img src="https://via.placeholder.com/500x400?text=404+文物未找到" alt="404 Not Found">
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  min-height: calc(100vh - var(--header-height) - 100px);
  display: flex;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.not-found-content {
  flex: 1;
  padding-right: 3rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.not-found h1 {
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.not-found p {
  font-size: 1.2rem;
  color: var(--secondary-color);
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: var(--accent-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #866341;
}

.not-found-image {
  flex: 1;
}

.not-found-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .not-found {
    flex-direction: column-reverse;
    text-align: center;
  }
  
  .not-found-content {
    padding-right: 0;
    padding-top: 2rem;
  }
  
  .error-code {
    font-size: 6rem;
  }
  
  .not-found h1 {
    font-size: 2rem;
  }
}
</style> 