<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <h2>博物馆文物系统</h2>
        <div class="login-line"></div>
        <p>登录以探索珍贵文物</p>
      </div>
      
      <div class="login-form">
        <div class="form-group" :class="{ 'has-error': errors.username }">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username"
            v-model="form.username"
            placeholder="请输入用户名"
            @input="validateUsername"
          >
          <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
        </div>
        
        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label for="password">密码</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password"
              v-model="form.password"
              placeholder="请输入密码"
              @input="validatePassword"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>
        
        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" v-model="form.remember">
            <span class="checkmark"></span>
            <span>记住我</span>
          </label>
          <a href="#" class="forgot-password">忘记密码?</a>
        </div>
        
        <div class="form-submit">
          <button 
            type="button" 
            class="login-btn" 
            :disabled="loading"
            @click="login"
          >
            <span v-if="loading" class="spinner-small"></span>
            <span v-else>登录</span>
          </button>
        </div>
        
        <div v-if="loginError" class="login-error">
          {{ loginError }}
        </div>
      </div>
      
      <div class="login-footer">
        <p>没有账号? <a href="#">联系管理员</a></p>
      </div>
    </div>
    
    <div class="login-backdrop">
      <div class="backdrop-image"></div>
      <div class="backdrop-overlay"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
        remember: false
      },
      errors: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false,
      loginError: ''
    }
  },
  methods: {
    validateUsername() {
      if (!this.form.username.trim()) {
        this.errors.username = '请输入用户名'
      } else {
        this.errors.username = ''
      }
    },
    validatePassword() {
      if (!this.form.password) {
        this.errors.password = '请输入密码'
      } else if (this.form.password.length < 6) {
        this.errors.password = '密码至少需要6个字符'
      } else {
        this.errors.password = ''
      }
    },
    validate() {
      this.validateUsername()
      this.validatePassword()
      return !this.errors.username && !this.errors.password
    },
    async login() {
      if (!this.validate()) {
        return
      }
      
      this.loading = true
      this.loginError = ''
      
      try {
        // 这里应该是实际的登录API调用
        // const response = await axios.post('/api/login', this.form)
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 模拟成功登录
        localStorage.setItem('isAuthenticated', 'true')
        
        // 检查是否有重定向路径
        const redirectPath = this.$route.query.redirect || '/'
        this.$router.push(redirectPath)
      } catch (error) {
        console.error('登录失败:', error)
        this.loginError = '用户名或密码错误，请重试'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

.login-content {
  width: 450px;
  padding: 4rem 3rem;
  background-color: white;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  text-align: center;
  margin-bottom: 3rem;
}

.login-header h2 {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.login-line {
  width: 60px;
  height: 3px;
  background-color: var(--accent-color);
  margin: 0 auto 1.5rem;
}

.login-header p {
  color: var(--secondary-color);
  font-size: 1.1rem;
}

.login-form {
  margin-bottom: 2rem;
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

.form-group input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-color);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(166, 124, 82, 0.1);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--secondary-color);
}

.form-group.has-error input {
  border-color: #dc3545;
}

.error-text {
  display: block;
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-container {
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--secondary-color);
  display: flex;
  align-items: center;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #f0f0f0;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #e0e0e0;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--accent-color);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-password {
  color: var(--accent-color);
  font-size: 0.9rem;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-submit {
  margin-bottom: 1.5rem;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover:not(:disabled) {
  background-color: #866341;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-small {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  animation: spin 0.8s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-error {
  color: #dc3545;
  background-color: #f8d7da;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  font-size: 0.95rem;
}

.login-footer {
  text-align: center;
  color: var(--secondary-color);
  font-size: 0.95rem;
}

.login-footer a {
  color: var(--accent-color);
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

.login-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.backdrop-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1566096650255-95aeca93dfd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  filter: brightness(0.8);
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column-reverse;
  }
  
  .login-content {
    width: 100%;
    padding: 2rem;
  }
  
  .backdrop-image {
    height: 200px;
    position: relative;
  }
}
</style> 