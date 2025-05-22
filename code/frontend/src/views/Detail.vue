<template>
  <div class="artifact-detail-container">
    <!-- 头部导航 -->
    <div class="header">
      <router-link to="/" class="back-button">
        <img src="@/components/icons/arrow-left.png" class="button-icon" alt="返回" /> 返回
      </router-link>
      <h1>{{ artifact.Title }}</h1>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左半部分 - 图片展示 -->
      <div class="image-section">
        <div class="main-image-container" ref="imageContainer" @mousedown="startImageDrag" @mousemove="doImageDrag"
          @mouseup="endImageDrag" @mouseleave="endImageDrag">
          <el-image :src="artifact.Image === '未知' ? '' : artifact.Image" :alt="artifact.Title" ref="mainImage"
            @wheel.prevent="handleImageZoom" :style="{
              transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
            }">
            <template #error>
              <div class="image-slot">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="thumbnail-overlay" v-if="showThumbnail">
            <div class="thumbnail-container" ref="thumbnailContainer" @mousedown="startThumbnailDrag">
              <img :src="artifact.Image" class="thumbnail" />
              <div class="viewport-frame" :style="{
                width: `${100 / zoomLevel}%`,
                height: `${100 / zoomLevel}%`,
                left: `${viewportPosition.x}%`,
                top: `${viewportPosition.y}%`
              }"></div>
            </div>
          </div>
        </div>

        <!-- 缩放控制按钮 -->
        <div class="zoom-controls">
          <button @click="zoomIn" title="放大">
            <img src="@/components/icons/zoom-in.png" class="button-icon" alt="放大" />
          </button>
          <button @click="zoomOut" title="缩小">
            <img src="@/components/icons/zoom-out.png" class="button-icon" alt="缩小" />
          </button>
          <button @click="resetZoom" title="重置">
            <img src="@/components/icons/refresh.png" class="button-icon" alt="重置" />
          </button>
          <button @click="toggleThumbnail" :title="showThumbnail ? '隐藏缩略图' : '显示缩略图'">
            <img src="@/components/icons/thumbnail.png" class="button-icon" alt="缩略图" />
          </button>
          <button @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
            <img :src="isFullscreen ? require('@/components/icons/fullscreen-exit.png') : require('@/components/icons/fullscreen.png')"
                 class="button-icon" :alt="isFullscreen ? '退出全屏' : '全屏'" />
          </button>
        </div>
      </div>

      <!-- 右半部分 - 文物介绍 -->
      <div class="info-section">
        <div class="info-card">
          <div class="title-row">
            <h2>{{ artifact.Title }}</h2>
            <div class="action-buttons">
              <button @click="toggleLike" class="like-button" :title="isLiked ? '取消点赞' : '点赞'">
                <img :src="isLiked ? require('@/components/icons/heart-filled.png') : require('@/components/icons/heart-outline.png')"
                     class="action-icon" alt="点赞" />
                <span class="action-count">{{ likeCount }}</span>
              </button>
              <button @click="toggleCollect" class="collect-button" :title="isCollected ? '取消收藏' : '收藏'">
                <img :src="isCollected ? require('@/components/icons/star-filled.png') : require('@/components/icons/star-outline.png')"
                     class="action-icon" alt="收藏" />
                <span class="action-count">{{ collectCount }}</span>
              </button>
            </div>
          </div>

          <div class="info-item" v-if="artifact.Artist && artifact.Artist !== '未知'">
            <span class="label">作者:</span>
            <span class="value">{{ artifact.Artist }}</span>
          </div>

          <div class="info-item" v-if="artifact.Period && artifact.Period !== '未知'">
            <span class="label">时期:</span>
            <span class="value">{{ artifact.Period }}</span>
          </div>

          <div class="info-item" v-if="artifact.Museum && artifact.Museum !== '未知'">
            <span class="label">博物馆:</span>
            <span class="value">{{ artifact.Museum }}</span>
          </div>

          <div class="info-item" v-if="artifact.descripe">
            <span class="label">描述:</span>
            <div class="value description">{{ artifact.descripe }}</div>
          </div>

          <div class="info-item" v-if="artifact['Object ID']">
            <span class="label">文物ID:</span>
            <span class="value">{{ artifact['Object ID'] }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 相关文物推荐部分 -->
    <div class="related-section" v-if="relatedArtifacts.length > 0">
      <h2 class="related-title">相关推荐</h2>
      <div class="divider"></div>
      <div class="masonry-grid">
        <div class="masonry-item" v-for="item in relatedArtifacts" :key="item['Object ID']"
          @click="goToDetail(item['Object ID'])">
          <img :src="item.Image" :alt="item.Title" />
          <div class="item-info">
            <div class="item-name">{{ item.Title }}</div>
            <div class="item-period">{{ item.Period || '未知时期' }}</div>
            <div class="item-artist">{{ item.Artist || '未知作者' }}</div>
            <div class="item-museum">{{ item.Museum || '未知博物馆' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-if="loading" class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
</template>

<script>
export default {
  name: 'ArtifactDetail',
  data() {
    return {
      artifact: {
        'Object ID': '',
        Title: '',
        Artist: '',
        Period: '',
        Museum: '',
        descripe: '',
        Image: ''
      },
      relatedArtifacts: [],
      loading: false,
      // 互动状态
      likeCount: 0,
      collectCount: 0,
      isLiked: false,
      isCollected: false,
      // 图片操作状态
      zoomLevel: 1,
      zoomOrigin: { x: 50, y: 50 },
      viewportPosition: { x: 0, y: 0 },
      showThumbnail: true,
      maxZoom: 5,
      minZoom: 0.5,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      dragOffset: { x: 0, y: 0 },
      isThumbnailDragging: false,
      lastThumbnailPosition: { x: 0, y: 0 },
      isFullscreen: false
    };
  },
  created() {
    this.fetchArtifactData();
  },
  methods: {
    async fetchArtifactData() {
      this.loading = true;
      const artifactId = this.$route.query.id;

      try {
        const response = await fetch(`http://localhost:5000/api/artifact/${artifactId}`, {
          credentials: 'include' // 包含cookie以获取登录状态
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '获取文物详情失败');
        }

        const data = await response.json();

        if (data.success) {
          this.artifact = data.artifact || {};
          this.relatedArtifacts = data.related || [];

          // 设置互动状态
          if (data.interaction) {
            this.likeCount = data.interaction.likeCount || 0;
            this.collectCount = data.interaction.collectCount || 0;
            this.isLiked = data.interaction.isLiked || false;
            this.isCollected = data.interaction.isCollected || false;
          }

          // 设置默认图片
          if (!this.artifact.Image) {
            this.artifact.Image = 'https://via.placeholder.com/600x400?text=No+Image';
          }
        } else {
          throw new Error(data.error || '获取数据失败');
        }
      } catch (error) {
        console.error('Error:', error);
        this.$message.error(error.message || '获取文物详情失败');
      } finally {
        this.loading = false;
      }
    },

    async toggleLike() {
      try {
        const response = await fetch('http://localhost:5000/api/likes/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            artifact_id: this.artifact['Object ID']
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          this.isLiked = result.isLiked;
          this.likeCount = result.likeCount;
          this.$message.success(result.message);
        } else if (response.status === 401) {
          this.$message.warning(result.message || '请先登录');
          this.$router.push('/login');
        } else {
          throw new Error(result.message || '操作失败');
        }
      } catch (error) {
        console.error('点赞操作失败:', error);
        this.$message.error(error.message || '点赞操作失败');
      }
    },

    async toggleCollect() {
      try {
        const response = await fetch('http://localhost:5000/api/collection/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            artifact_id: this.artifact['Object ID']
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          this.isCollected = result.isCollected;
          this.collectCount = result.collectCount;
          this.$message.success(result.message);
        } else if (response.status === 401) {
          this.$message.warning(result.message || '请先登录');
          this.$router.push('/login');
        } else {
          throw new Error(result.message || '操作失败');
        }
      } catch (error) {
        console.error('收藏操作失败:', error);
        this.$message.error(error.message || '收藏操作失败');
      }
    },


    startImageDrag(e) {
      if (this.zoomLevel <= 1) return;
      this.isDragging = true;
      this.dragStart = {
        x: e.clientX - this.dragOffset.x,
        y: e.clientY - this.dragOffset.y
      };
      this.$refs.imageContainer.style.cursor = 'grabbing';
    },

    doImageDrag(e) {
      if (!this.isDragging) return;
      this.dragOffset = {
        x: e.clientX - this.dragStart.x,
        y: e.clientY - this.dragStart.y
      };
      this.updateViewportPosition();
    },

    endImageDrag() {
      this.isDragging = false;
      this.$refs.imageContainer.style.cursor = 'grab';
    },

    startThumbnailDrag(e) {
      this.isThumbnailDragging = true;
      this.lastThumbnailPosition = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    },

    doThumbnailDrag(e) {
      if (!this.isThumbnailDragging) return;

      const deltaX = e.clientX - this.lastThumbnailPosition.x;
      const deltaY = e.clientY - this.lastThumbnailPosition.y;

      this.lastThumbnailPosition = { x: e.clientX, y: e.clientY };

      const container = this.$refs.thumbnailContainer;
      const containerRect = container.getBoundingClientRect();

      const moveXPercent = (deltaX / containerRect.width) * 100;
      const moveYPercent = (deltaY / containerRect.height) * 100;

      this.viewportPosition.x = Math.max(0, Math.min(100 - (100 / this.zoomLevel), this.viewportPosition.x + moveXPercent));
      this.viewportPosition.y = Math.max(0, Math.min(100 - (100 / this.zoomLevel), this.viewportPosition.y + moveYPercent));

      this.dragOffset.x = -this.viewportPosition.x * (this.zoomLevel - 1);
      this.dragOffset.y = -this.viewportPosition.y * (this.zoomLevel - 1);
    },

    endThumbnailDrag() {
      this.isThumbnailDragging = false;
    },

    updateViewportPosition() {
      if (this.zoomLevel <= 1) {
        this.viewportPosition = { x: 0, y: 0 };
        return;
      }
      const container = this.$refs.imageContainer;
      const containerRect = container.getBoundingClientRect();
      const viewportX = (-this.dragOffset.x / (this.zoomLevel - 1)) * 100 / containerRect.width;
      const viewportY = (-this.dragOffset.y / (this.zoomLevel - 1)) * 100 / containerRect.height;
      this.viewportPosition = {
        x: Math.max(0, Math.min(100 - (100 / this.zoomLevel), viewportX)),
        y: Math.max(0, Math.min(100 - (100 / this.zoomLevel), viewportY))
      };
    },

    handleImageZoom(e) {
      const container = this.$refs.imageContainer;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left - this.dragOffset.x) / rect.width) * 100;
      const y = ((e.clientY - rect.top - this.dragOffset.y) / rect.height) * 100;
      this.zoomOrigin = { x, y };
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel + delta));
      const ratio = newZoom / this.zoomLevel;
      this.dragOffset = {
        x: (this.dragOffset.x + rect.width * (this.zoomOrigin.x / 100)) * ratio - rect.width * (this.zoomOrigin.x / 100),
        y: (this.dragOffset.y + rect.height * (this.zoomOrigin.y / 100)) * ratio - rect.height * (this.zoomOrigin.y / 100)
      };
      this.zoomLevel = parseFloat(newZoom.toFixed(2));
      this.updateViewportPosition();
    },

    zoomIn() {
      this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + 0.5);
      this.updateViewportPosition();
    },

    zoomOut() {
      this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - 0.5);
      this.updateViewportPosition();
    },

    resetZoom() {
      this.zoomLevel = 1;
      this.dragOffset = { x: 0, y: 0 };
      this.zoomOrigin = { x: 50, y: 50 };
      this.viewportPosition = { x: 0, y: 0 };
    },

    toggleThumbnail() {
      this.showThumbnail = !this.showThumbnail;
    },

    toggleFullscreen() {
      const container = this.$refs.imageContainer;
      if (!this.isFullscreen) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        }
        this.isFullscreen = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isFullscreen = false;
      }
    },

    handleFullscreenChange() {
      this.isFullscreen = document.fullscreenElement !== null;
    },

    goToDetail(id) {
      this.$router.push({ path: '/detail', query: { id } });
    }
  },
  mounted() {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
  }
};
</script>

<style scoped>

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.like-button, .collect-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;
}

.like-button:hover, .collect-button:hover {
  background-color: #f0f0f0;
}

.action-icon {
  width: 24px;
  height: 24px;
}

.action-count {
  margin-left: 5px;
  font-size: 14px;
  color: #666;
}


.artifact-detail-container {
  width: 1200px;
  margin-left: -200px;
  margin: 0 auto;
  padding: 40px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #fff;
}

.header {
  display: flex;
  align-items: center;
  margin-top: 100px;
  margin-left: -200px;
  margin-bottom: 0px;
  padding-bottom: 15px;
  width: 1400px;
  border-bottom: 1px solid #d3d3d3;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.image-slot .el-icon {
  font-size: 30px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  margin-right: 20px;
  margin-left: 0px;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
}

.back-button .button-icon {
  margin-right: 5px;
  width: 16px;
  height: 16px;
}

.back-button:hover {
  color: #666;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  font-family: 'Lora', serif;
}

.main-content {
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
  margin-top: 50px;
  flex-direction: row;
  margin-left: -200px;
}

.image-section {
  flex: 1;
  width: 200px;
  position: relative;
}

.main-image-container {
  position: relative;
  width: 100%;
  height: 559px;
  overflow: hidden;
  background-color: #f5f5f5;
  cursor: grab;
}

.main-image-container.dragging {
  cursor: grabbing;
}

.main-image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.thumbnail-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 5px;
  border: 1px solid #ddd;
  z-index: 10;
}

.thumbnail-container {
  position: relative;
  width: 150px;
  height: 100px;
  overflow: hidden;
  cursor: move;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

.viewport-frame {
  position: absolute;
  border: 2px solid #000;
  pointer-events: none;
  box-sizing: border-box;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  right: -40px;
  width: 90px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zoom-controls button {
  width: 40px;
  height: 40px;
  border: none;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  padding: 0;
}

.zoom-controls button:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.button-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.info-section {
  flex: 1;
  max-width: 500px;
  margin-right: -100px;
  height: 500px;
}

.info-card {
  padding: 0;
}

.info-card h2 {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 24px;
  font-weight: 300;
  font-family: 'Lora', serif;
}

.info-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
}

.info-item .label {
  font-size: 15px;
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.info-item .value {
  color: #333;
  flex: 1;
}

.description {
  white-space: pre-line;
  line-height: 1.6;
}

.related-section {
  margin-top: 60px;
  margin-left: -200px;
  width: 1450px;
  background-color: #fff;
}

.related-title {
  margin-bottom: 10px;
  font-size: 29px;
  font-weight: 750;
  margin-bottom: 10px;
  padding: 10px;
  font-family: 'Lora', serif;
  border-bottom: 1px solid #d3d3d3;
}

.divider {
  height: 0px;
  background-color: #000;
  margin: 20px 0 40px;
}

.masonry-grid {
  columns: 4;
  column-gap: 20px;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
  background: #fff;
  border-bottom: 2px solid #fff;
  border-radius: 4px;
  overflow: hidden;
}

.masonry-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.masonry-item img {
  width: 100%;
  height: auto;
  display: block;
  background-color: #f5f5f5;
}

.item-info {
  padding: 15px;
}

.item-name {
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 16px;
  font-style: italic;
}

.item-artist {
  font-size: 14px;
  margin-bottom: 3px;
}

.item-period,
.item-museum {
  font-size: 14px;
  margin-bottom: 3px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .masonry-grid {
    columns: 2;
  }
}

@media (max-width: 600px) {
  .masonry-grid {
    columns: 1;
  }

  .main-image-container {
    height: 400px;
  }

  .thumbnail-overlay {
    top: 10px;
    right: 10px;
  }

  .thumbnail-container {
    width: 100px;
    height: 70px;
  }
}
</style>