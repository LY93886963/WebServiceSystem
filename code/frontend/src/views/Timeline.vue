<script>
export default {
  name: 'Timeline',
  mounted() {
    // 监听窗口大小变化，动态调整iframe高度
    window.addEventListener('resize', this.adjustTimelineHeight);
    this.adjustTimelineHeight();
    
    // 添加页面样式，确保时间轴占据整个可视区域
    this.addFullViewportStyles();
  },
  beforeUnmount() {
    // 组件卸载前移除事件监听器
    window.removeEventListener('resize', this.adjustTimelineHeight);
    
    // 移除添加的样式
    this.removeFullViewportStyles();
  },
  methods: {
    addFullViewportStyles() {
      // 获取根元素和App容器
      const appElement = document.getElementById('app');
      if (appElement) {
        // 保存原始样式以便恢复
        this.originalAppStyles = {
          height: appElement.style.height,
          overflow: appElement.style.overflow,
          width: appElement.style.width,
          maxWidth: appElement.style.maxWidth
        };
        
        // 设置App元素样式以占据整个视口
        appElement.style.height = '100vh';
        appElement.style.width = '100vw';
        appElement.style.maxWidth = '100%';
        appElement.style.overflow = 'hidden';
      }
      
      // 获取父级容器，如果有的话设置其最大宽度为100%
      const parentElements = document.querySelectorAll('.router-view-container, .main-content');
      parentElements.forEach(el => {
        if (el) {
          el.style.maxWidth = '100%';
          el.style.width = '100%';
          el.style.padding = '0';
          el.style.margin = '0';
        }
      });
    },
    
    removeFullViewportStyles() {
      // 恢复App元素的原始样式
      const appElement = document.getElementById('app');
      if (appElement && this.originalAppStyles) {
        appElement.style.height = this.originalAppStyles.height;
        appElement.style.overflow = this.originalAppStyles.overflow;
        appElement.style.width = this.originalAppStyles.width;
        appElement.style.maxWidth = this.originalAppStyles.maxWidth;
      }
      
      // 恢复父级容器的样式
      const parentElements = document.querySelectorAll('.router-view-container, .main-content');
      parentElements.forEach(el => {
        if (el) {
          el.style.maxWidth = '';
          el.style.width = '';
          el.style.padding = '';
          el.style.margin = '';
        }
      });
    },
    
    adjustTimelineHeight() {
      // 获取视口尺寸
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // 计算可用高度，留出页眉和页脚的空间
      const headerHeight = document.querySelector('.timeline-header')?.offsetHeight || 0;
      const footerHeight = document.querySelector('.timeline-footer')?.offsetHeight || 0;
      const availableHeight = viewportHeight - headerHeight - footerHeight - 2; // 2px为边框
      
      // 调整iframe的尺寸，确保居中显示
      const iframe = document.querySelector('.timeline-iframe');
      if (iframe) {
        // 设置高度
        iframe.style.height = `${availableHeight}px`;
        
        // 计算合适的宽度 - 固定宽度而非百分比，调小宽度比例
        const iframeWidth = Math.min(viewportWidth * 0.92, 1400); // 减小宽度比例和最大宽度
        iframe.style.width = `${iframeWidth}px`;
        
        // 使用绝对定位绝对居中
        iframe.style.position = 'absolute';
        iframe.style.left = '50%';
        iframe.style.transform = 'translateX(-50%)';
        iframe.style.margin = '0';
      }
      
      // 调整整个容器的尺寸
      const container = document.querySelector('.timeline-container');
      if (container) {
        container.style.height = `${availableHeight}px`;
        container.style.width = '100%';
      }
      
      // 调整整个时间轴容器的尺寸
      const timelineWrapper = document.querySelector('.artifact-timeline');
      if (timelineWrapper) {
        timelineWrapper.style.height = `${viewportHeight}px`;
      }
      
      // 给iframe添加onload事件，以便在加载完成后进行额外调整
      if (iframe && !iframe.onload) {
        iframe.onload = () => {
          this.adjustTimelineControls();
        };
      }
    },
    
    // 调整时间轴控件，确保导航按钮可见
    adjustTimelineControls() {
      try {
        // 尝试通过iframe访问内部元素并调整样式
        const iframe = document.querySelector('.timeline-iframe');
        if (iframe && iframe.contentWindow) {
          // 添加自定义样式到iframe内部
          const style = iframe.contentDocument.createElement('style');
          style.textContent = `
            .tl-slidenav-next, .tl-slidenav-previous {
              opacity: 1 !important;
              visibility: visible !important;
              width: 40px !important;
              height: 40px !important;
              z-index: 30 !important;
            }
            .tl-slidenav-next .tl-slidenav-icon, .tl-slidenav-previous .tl-slidenav-icon {
              font-size: 32px !important;
              opacity: 0.9 !important;
              color: white !important;
              text-shadow: 0 0 10px black !important;
            }
            .tl-slidenav-next {
              right: 5px !important; /* 减小右侧间距 */
            }
            .tl-slidenav-previous {
              left: 5px !important; /* 减小左侧间距 */
            }
            .tl-timeline {
              width: 100% !important;
              margin: 0 auto !important;
              position: relative !important;
              left: 0 !important;
              right: 0 !important;
            }
            .tl-storyslider {
              left: 0 !important;
              width: 100% !important;
            }
            .tl-menubar {
              z-index: 10 !important;
            }
            .tl-timenav-container-mask, .tl-timenav-container, .tl-timenav {
              width: 100% !important; 
              max-width: none !important;
              left: 0 !important;
              right: 0 !important;
              margin: 0 auto !important;
            }
            /* 修复时间轴内容偏移问题 */
            .tl-timenav-slider-background, 
            .tl-timenav-slider, 
            .tl-timenav-slider-container {
              width: 100% !important;
              left: 0 !important;
              right: 0 !important;
            }
            /* 修复标记位置 */
            .tl-timemarker, .tl-timemarker-content-container {
              margin-left: 0 !important;
              padding-left: 0 !important;
            }
            /* 确保时间轴内容居中 */
            .tl-slider-container-mask {
              text-align: center !important;
            }
            /* 调整宽度，防止右侧内容被截断 */
            .tl-slide, .tl-slide-content-container {
              max-width: 95% !important;
              margin: 0 auto !important;
            }
            /* 确保内容适应宽度 */
            .tl-media {
              max-width: 100% !important;
            }
          `;
          iframe.contentDocument.head.appendChild(style);

          // 尝试找到并重新计算时间轴位置
          setTimeout(() => {
            try {
              if (iframe.contentWindow.timeline) {
                iframe.contentWindow.timeline.updateDisplay();
              }
            } catch(error) {
              console.warn('无法访问时间轴内部方法', error);
            }
          }, 1000);
        }
      } catch (error) {
        console.warn('无法修改iframe内部样式，跨域限制可能在起作用', error);
      }
    }
  }
}
</script>

<template>
  <div class="artifact-timeline">
    <div class="timeline-header">
      <h1>文物历史时间轴</h1>
      <p>探索人类文明的艺术与历史瑰宝</p>
    </div>
    
    <div class="timeline-container">
      <iframe 
        src='https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2:2PACX-1vSQDZuqQcpYudyRjVZtGlJhVJ5nMv96C3O9ohSG1N31KR37iILESAfWkMOakfNG5w9nKt6ZtgIddxOK&font=Default&lang=en&initial_zoom=2&height=650' 
        width='100%' 
        height='650' 
        webkitallowfullscreen 
        mozallowfullscreen 
        allowfullscreen 
        frameborder='0'
        class="timeline-iframe"
      ></iframe>
    </div>
    
    <div class="timeline-footer">
      <p>© 2023 文物时间轴 | 博物馆数字展览</p>
    </div>
  </div>
</template>

<style scoped>
.artifact-timeline {
  width: 100vw; /* 占据整个视口宽度 */
  height: 100vh; /* 占据整个视口高度 */
  background-color: #121212;
  color: #f0f0f0;
  display: flex;
  flex-direction: column;
  font-family: 'Times New Roman', serif; /* 经典优雅的字体 */
  margin: 0;
  padding: 0;
  position: relative; /* 使子元素可以相对于此定位 */
  overflow-x: hidden; /* 防止水平滚动条 */
  text-align: center; /* 帮助居中 */
}

.timeline-header {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #0a0a0a;
  flex-shrink: 0; /* 防止header被压缩 */
  width: 100%; /* 确保横向占满 */
}

.timeline-header h1 {
  font-size: 2rem;
  font-weight: 300;
  margin: 0;
  letter-spacing: 0.1rem;
  color: #ffffff;
}

.timeline-header p {
  font-size: 1rem;
  margin-top: 0.3rem;
  font-style: italic;
  color: #aaaaaa;
}

.timeline-container {
  position: relative;
  width: 100%; /* 确保横向占满 */
  flex-grow: 1; /* 容器占据所有可用空间 */
  overflow: hidden;
  background-color: #000000;
  filter: grayscale(100%); /* 应用黑白滤镜 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-iframe {
  position: absolute; /* 使用绝对定位 */
  height: 100%;
  border: none;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.7);
  transition: all 0.3s ease;
  /* 使iframe绝对居中显示 */
  left: 50%;
  transform: translateX(-50%);
  width: 92%; /* 减小宽度 */
  max-width: 1400px; /* 减小最大宽度 */
}

.timeline-footer {
  padding: 0.4rem;
  text-align: center;
  font-size: 0.85rem;
  background-color: #0a0a0a;
  color: #777777;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0; /* 防止footer被压缩 */
  width: 100%; /* 确保横向占满 */
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-header h1 {
    font-size: 1.7rem;
  }
  
  .timeline-header p {
    font-size: 0.9rem;
  }
  
  .timeline-header {
    padding: 0.6rem;
  }
  
  .timeline-footer {
    padding: 0.4rem;
  }
}

/* 确保在根元素中占满空间 */
:deep(#app), :deep(html), :deep(body) {
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* 覆盖任何可能限制宽度的父级容器 */
:deep(.container), :deep(.row), :deep(.col), :deep(main), :deep(section) {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}
</style>