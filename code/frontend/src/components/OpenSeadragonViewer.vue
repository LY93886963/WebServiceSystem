<template>
  <div class="openseadragon-container" ref="viewerContainer">
    <div v-if="error" class="error-message">
      图片加载失败: {{ error }}
      <button @click="retryLoading">重试</button>
    </div>

  </div>
</template>

<script>
import OpenSeadragon from 'openseadragon'
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'

export default {
  name: 'OpenSeadragonViewer',
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    showControls: {
      type: Boolean,
      default: true
    },
    useProxy: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const viewer = ref(null)
    const viewerContainer = ref(null)
    const isFullscreen = ref(false)
    const error = ref(null)
    const loading = ref(false)

    const getProxiedUrl = (url) => {
      if (!props.useProxy || !url.includes('://')) return url
      return `/api/proxy?url=${encodeURIComponent(url)}`
    }

    const initViewer = () => {
      if (viewer.value) {
        viewer.value.destroy()
      }

      error.value = null
      loading.value = true

      const options = {
        element: viewerContainer.value,
        prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/images/',
        tileSources: getProxiedUrl(props.imageUrl),
        showNavigator: true,
        navigatorPosition: 'TOP_RIGHT',
        gestureSettingsMouse: {
          scrollToZoom: true
        },
        timeout: 30000,
        ajaxWithCredentials: false,
        crossOriginPolicy: 'Anonymous',
        loadTilesWithAjax: true,
        ajaxHeaders: {
          'Accept': 'image/*'
        }
      }

      viewer.value = OpenSeadragon(options)

      viewer.value.addHandler('open', () => {
        loading.value = false
        emit('loaded')
      })

      viewer.value.addHandler('open-failed', (event) => {
        error.value = event.message || '图片加载失败'
        loading.value = false
        emit('error', error.value)
      })
    }

    const retryLoading = () => {
      initViewer()
    }

    const zoomIn = () => {
      if (viewer.value) {
        viewer.value.viewport.zoomBy(1.5)
      }
    }

    const zoomOut = () => {
      if (viewer.value) {
        viewer.value.viewport.zoomBy(0.6667)
      }
    }

    const home = () => {
      if (viewer.value) {
        viewer.value.viewport.goHome()
      }
    }

    const toggleFullscreen = () => {
      if (viewer.value) {
        if (isFullscreen.value) {
          viewer.value.setFullScreen(false)
        } else {
          viewer.value.setFullScreen(true)
        }
        isFullscreen.value = !isFullscreen.value
      }
    }

    onMounted(() => {
      initViewer()
    })

    watch(() => props.imageUrl, () => {
      initViewer()
    })

    onBeforeUnmount(() => {
      if (viewer.value) {
        viewer.value.destroy()
      }
    })

    return {
      viewer,
      viewerContainer,
      isFullscreen,
      error,
      loading,
      zoomIn,
      zoomOut,
      home,
      toggleFullscreen,
      retryLoading
    }
  }
}
</script>

<style scoped>
.openseadragon-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f5f5f5;
}

.osd-toolbar {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  z-index: 1001;
}

.error-message button {
  margin-top: 10px;
  padding: 5px 10px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>