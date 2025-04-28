<template>
  <div class="user-container">
    <div class="user-sidebar">
      <div class="user-avatar">
        <img :src="user.avatar || '/images/default-avatar.png'" alt="用户头像">
        <div class="avatar-name">{{ user.username }}</div>
      </div>
      <div class="sidebar-menu">
        <div 
          class="menu-item" 
          v-for="(item, index) in menuItems" 
          :key="index"
          :class="{ active: activeMenu === item.id }"
          @click="activeMenu = item.id"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </div>
      </div>
    </div>
    
    <div class="user-content">
      <!-- 账号信息 -->
      <div v-if="activeMenu === 'account'" class="content-section">
        <h2>账号信息</h2>
        <div class="form-layout">
          <div class="form-group">
            <label>用户名</label>
            <input type="text" v-model="user.username" :disabled="!editing">
          </div>
          <div class="form-group">
            <label>注册时间</label>
            <div class="info-text">{{ user.registerDate }}</div>
          </div>
          <div class="form-group">
            <label>会员状态</label>
            <div class="info-text">{{ user.membershipStatus }}</div>
          </div>
          <div class="action-buttons" v-if="editing">
            <button class="btn-save" @click="saveChanges">保存修改</button>
            <button class="btn-cancel" @click="editing = false">取消</button>
          </div>
          <button v-else class="btn-edit" @click="editing = true">编辑信息</button>
        </div>
      </div>
      
      <!-- 密码修改 -->
      <div v-if="activeMenu === 'password'" class="content-section">
        <h2>修改密码</h2>
        <div class="form-layout">
          <div class="form-group">
            <label>当前密码</label>
            <input type="password" v-model="passwords.current">
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input type="password" v-model="passwords.new">
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <input type="password" v-model="passwords.confirm">
          </div>
          <div class="password-strength" v-if="passwords.new">
            <div class="strength-label">密码强度：</div>
            <div class="strength-meter" :class="passwordStrength"></div>
            <div class="strength-text">{{ passwordStrengthText }}</div>
          </div>
          <button class="btn-save" @click="changePassword">更改密码</button>
        </div>
      </div>
      
      <!-- 邮箱设置 -->
      <div v-if="activeMenu === 'email'" class="content-section">
        <h2>邮箱设置</h2>
        <div class="form-layout">
          <div class="form-group">
            <label>当前邮箱</label>
            <div class="info-text">{{ user.email }}</div>
          </div>
          <div class="form-group">
            <label>新邮箱</label>
            <input type="email" v-model="newEmail">
          </div>
          <button class="btn-save" @click="changeEmail">更改邮箱</button>
        </div>
      </div>
      
      <!-- 通知设置 -->
      <div v-if="activeMenu === 'notifications'" class="content-section">
        <h2>通知设置</h2>
        <div class="form-layout">
          <div class="toggle-group" v-for="(option, index) in notificationOptions" :key="index">
            <div class="toggle-label">{{ option.label }}</div>
            <div class="toggle-switch" :class="{ active: option.enabled }" @click="toggleNotification(index)">
              <div class="toggle-slider"></div>
            </div>
          </div>
          <button class="btn-save" @click="saveNotificationSettings">保存设置</button>
        </div>
      </div>
      
      <!-- 隐私设置 -->
      <div v-if="activeMenu === 'privacy'" class="content-section">
        <h2>隐私设置</h2>
        <div class="form-layout">
          <div class="toggle-group" v-for="(option, index) in privacyOptions" :key="index">
            <div class="toggle-label">{{ option.label }}</div>
            <div class="toggle-switch" :class="{ active: option.enabled }" @click="togglePrivacy(index)">
              <div class="toggle-slider"></div>
            </div>
          </div>
          <button class="btn-save" @click="savePrivacySettings">保存设置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  data() {
    return {
      activeMenu: 'account',
      editing: false,
      user: {
        username: '博物馆爱好者',
        email: 'user@example.com',
        avatar: '',
        registerDate: '2023-01-15',
        membershipStatus: '普通会员'
      },
      passwords: {
        current: '',
        new: '',
        confirm: ''
      },
      newEmail: '',
      menuItems: [
        { id: 'account', label: '账号信息', icon: 'icon-user' },
        { id: 'password', label: '密码修改', icon: 'icon-lock' },
        { id: 'email', label: '邮箱设置', icon: 'icon-mail' },
        { id: 'notifications', label: '通知设置', icon: 'icon-bell' },
        { id: 'privacy', label: '隐私设置', icon: 'icon-shield' }
      ],
      notificationOptions: [
        { label: '接收展览更新通知', enabled: true },
        { label: '接收特别活动通知', enabled: true },
        { label: '接收新藏品通知', enabled: false },
        { label: '接收系统通知', enabled: true }
      ],
      privacyOptions: [
        { label: '允许公开我的收藏集', enabled: false },
        { label: '允许其他用户关注我', enabled: true },
        { label: '显示我的浏览历史', enabled: false }
      ]
    }
  },
  computed: {
    passwordStrength() {
      const password = this.passwords.new;
      if (!password) return '';
      if (password.length < 6) return 'weak';
      if (password.length < 10) return 'medium';
      return 'strong';
    },
    passwordStrengthText() {
      switch(this.passwordStrength) {
        case 'weak': return '弱';
        case 'medium': return '中';
        case 'strong': return '强';
        default: return '';
      }
    }
  },
  methods: {
    saveChanges() {
      // 这里应该发送请求到后端保存用户信息
      alert('用户信息已更新');
      this.editing = false;
    },
    changePassword() {
      if (!this.passwords.current) {
        alert('请输入当前密码');
        return;
      }
      if (!this.passwords.new) {
        alert('请输入新密码');
        return;
      }
      if (this.passwords.new !== this.passwords.confirm) {
        alert('两次输入的新密码不一致');
        return;
      }
      
      // 这里应该发送请求到后端更改密码
      alert('密码已更改');
      this.passwords = { current: '', new: '', confirm: '' };
    },
    changeEmail() {
      if (!this.newEmail) {
        alert('请输入新邮箱');
        return;
      }
      
      // 这里应该发送请求到后端更改邮箱
      this.user.email = this.newEmail;
      this.newEmail = '';
      alert('邮箱已更改');
    },
    toggleNotification(index) {
      this.notificationOptions[index].enabled = !this.notificationOptions[index].enabled;
    },
    togglePrivacy(index) {
      this.privacyOptions[index].enabled = !this.privacyOptions[index].enabled;
    },
    saveNotificationSettings() {
      // 这里应该发送请求到后端保存通知设置
      alert('通知设置已保存');
    },
    savePrivacySettings() {
      // 这里应该发送请求到后端保存隐私设置
      alert('隐私设置已保存');
    }
  }
}
</script>

<style scoped>
.user-container {
  display: flex;
  width: 100%;
  margin: 90px auto 0; /* 增加顶部边距，避免被导航栏遮挡 */
  min-height: calc(100vh - 120px); /* 减小整体高度 */
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

/* 侧边栏样式 - 减小宽度 */
.user-sidebar {
  width: 200px; /* 从220px减小到200px */
  background: #f8f8f8;
  border-right: 1px solid #eee;
  padding: 20px 0; /* 减小内边距 */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px 15px; /* 减小内边距 */
  border-bottom: 1px solid #eee;
  margin-bottom: 15px; /* 减小下边距 */
}

.user-avatar img {
  width: 70px; /* 减小头像尺寸 */
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff; /* 减小边框 */
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.avatar-name {
  font-weight: bold;
  font-size: 15px; /* 减小字体 */
  color: #333;
  text-align: center;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 12px 15px; /* 减小内边距 */
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
  display: flex;
  align-items: center;
  border-left: 3px solid transparent;
  font-size: 14px; /* 减小字体 */
}

.menu-item i {
  margin-right: 12px;
  font-size: 16px;
  width: 18px;
  text-align: center;
}

.menu-item:hover {
  background: #f0f0f0;
  color: #333;
}

.menu-item.active {
  background: #f0f0f0;
  color: #000;
  font-weight: bold;
  border-left-color: #000;
}

/* 内容区域样式 - 增加宽度 */
.user-content {
  flex-grow: 1;
  padding: 20px 40px; /* 增加左右内边距 */
  overflow: auto;
  min-width: 0; /* 防止内容溢出 */
}

.content-section {
  max-width: 2000px; /* 从1000px增加到1200px */
  margin: 0 auto;
  width: 100%; /* 确保充分利用可用空间 */
}

.content-section h2 {
  margin-bottom: 20px; /* 减小下边距 */
  font-weight: 300;
  color: #333;
  font-size: 22px; /* 减小字体 */
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.form-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(800px, 1fr)); /* 从350px增加到400px */
  gap: 30px; /* 略微增加间距 */
  grid-template-columns: repeat(auto-fill, minmax(800px, 1fr)); /* 减小列宽 */
  gap: 25px; /* 减小间距 */
  width: 100%;
}

.form-group {
  margin-bottom: 20px; /* 减小下边距 */
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 6px; /* 减小下边距 */
  color: #666;
  font-size: 13px; /* 减小字体 */
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px; /* 减小内边距 */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px; /* 减小字体 */
  transition: border 0.3s;
}

.form-group input:focus {
  border-color: #000;
  outline: none;
}

.form-group input:disabled {
  background: #f9f9f9;
  cursor: not-allowed;
}

.info-text {
  padding: 8px 0; /* 减小内边距 */
  color: #333;
  font-size: 15px; /* 减小字体 */
}

.action-buttons {
  display: flex;
  gap: 8px; /* 减小间距 */
  margin-top: 15px; /* 减小上边距 */
  grid-column: 1 / -1;
}

.btn-save, .btn-edit, .btn-cancel {
  padding: 8px 15px; /* 减小内边距 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px; /* 减小字体 */
  transition: all 0.3s;
}

.btn-save {
  background: #000;
  color: #fff;
}

.btn-save:hover {
  background: #333;
}

.btn-edit {
  background: #f0f0f0;
  color: #333;
}

.btn-edit:hover {
  background: #e0e0e0;
}

.btn-cancel {
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #f9f9f9;
}

.password-strength {
  margin: 15px 0 25px;
  display: flex;
  align-items: center;
}

.strength-label {
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}

.strength-meter {
  height: 6px;
  width: 100px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.strength-meter:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s;
}

.strength-meter.weak:after {
  width: 30%;
  background: #ff4d4f;
}

.strength-meter.medium:after {
  width: 60%;
  background: #faad14;
}

.strength-meter.strong:after {
  width: 100%;
  background: #52c41a;
}

.strength-text {
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
}

.weak ~ .strength-text {
  color: #ff4d4f;
}

.medium ~ .strength-text {
  color: #faad14;
}

.strong ~ .strength-text {
  color: #52c41a;
}

.toggle-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.toggle-label {
  flex-grow: 1;
  color: #333;
}

.toggle-switch {
  width: 50px;
  height: 26px;
  background: #ddd;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-switch.active {
  background: #000;
}

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: all 0.3s;
}

.toggle-switch.active .toggle-slider {
  left: 27px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-container {
    flex-direction: column;
  }
  
  .user-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding: 20px;
  }
  
  .user-avatar {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 15px;
  }
  
  .user-avatar img {
    margin-right: 15px;
    margin-bottom: 0;
  }
  
  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .menu-item {
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 10px 15px;
  }
  
  .menu-item.active {
    border-left-color: transparent;
    border-bottom-color: #000;
  }
  
  .user-content {
    padding: 20px 15px;
  }
  
  .form-layout {
    grid-template-columns: 1fr;
  }
}
</style>
