<template>
  <div class="login-wrapper" @mousemove="handleMouseMove">
    <div class="login-bg">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <!-- 卡通猫 + 书本 -->
    <div class="cat-sidebar">
      <div class="cat-scene" ref="catSceneRef">
        <svg viewBox="0 0 260 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 坐着的书本堆 -->
          <rect x="30" y="260" width="200" height="14" rx="4" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1"/>
          <rect x="45" y="245" width="170" height="17" rx="4" fill="#e0e7ff" stroke="#c7d2fe" stroke-width="1"/>
          <rect x="38" y="232" width="184" height="15" rx="4" fill="#ddd6fe" stroke="#c4b5fd" stroke-width="1"/>

          <!-- 尾巴 -->
          <path
            d="M 195 210 Q 225 185 230 155 Q 235 130 215 115"
            stroke="#f97316"
            stroke-width="8"
            stroke-linecap="round"
            fill="none"
            class="cat-tail"
          >
            <animateTransform
              attributeName="transform" type="rotate" values="-5 195 210;5 195 210;-5 195 210"
              dur="3s" repeatCount="indefinite"
            />
          </path>
          <circle cx="211" cy="112" r="10" fill="#f97316" class="tail-tip">
            <animateTransform
              attributeName="transform" type="rotate" values="-5 195 210;5 195 210;-5 195 210"
              dur="3s" repeatCount="indefinite"
            />
          </circle>

          <!-- 身体 - 橙色猫身 -->
          <ellipse cx="160" cy="210" rx="52" ry="48" fill="#f97316">
            <animateTransform
              attributeName="transform" type="rotate" values="-1 160 210;1 160 210;-1 160 210"
              dur="2.5s" repeatCount="indefinite"
            />
          </ellipse>
          <!-- 肚子白色 -->
          <ellipse cx="160" cy="218" rx="32" ry="30" fill="#fff7ed"/>

          <!-- 前腿 -->
          <rect x="120" y="240" width="18" height="30" rx="9" fill="#f97316"/>
          <rect x="182" y="240" width="18" height="30" rx="9" fill="#f97316"/>
          <!-- 前爪 -->
          <ellipse cx="129" cy="272" rx="12" ry="7" fill="#fff7ed"/>
          <ellipse cx="191" cy="272" rx="12" ry="7" fill="#fff7ed"/>

          <!-- 头部 -->
          <circle cx="160" cy="155" r="48" fill="#f97316">
            <animateTransform
              attributeName="transform" type="rotate" values="-2 160 155;2 160 155;-2 160 155"
              dur="2s" repeatCount="indefinite"
            />
          </circle>
          <!-- 面部白色区域 -->
          <ellipse cx="160" cy="165" rx="30" ry="22" fill="#fff7ed"/>

          <!-- 左耳 -->
          <polygon points="118,120 108,75 138,108" fill="#f97316"/>
          <polygon points="122,118 114,85 136,110" fill="#fed7aa"/>
          <!-- 右耳 -->
          <polygon points="202,120 212,75 182,108" fill="#f97316"/>
          <polygon points="198,118 206,85 184,110" fill="#fed7aa"/>

          <!-- 眼睛 -->
          <g ref="leftEyeGroupRef">
            <ellipse :cx="143 + eyeOffsetX * 2.5" :cy="149 + eyeOffsetY * 2" rx="10" ry="11" fill="white"/>
            <circle :cx="143 + eyeOffsetX * 3.5" :cy="149 + eyeOffsetY * 3" r="6.5" fill="#1e293b"/>
            <circle :cx="145 + eyeOffsetX * 3.5" :cy="147 + eyeOffsetY * 3" r="2.5" fill="white"/>
          </g>
          <g ref="rightEyeGroupRef">
            <ellipse :cx="177 + eyeOffsetX * 2.5" :cy="149 + eyeOffsetY * 2" rx="10" ry="11" fill="white"/>
            <circle :cx="177 + eyeOffsetX * 3.5" :cy="149 + eyeOffsetY * 3" r="6.5" fill="#1e293b"/>
            <circle :cx="179 + eyeOffsetX * 3.5" :cy="147 + eyeOffsetY * 3" r="2.5" fill="white"/>
          </g>

          <!-- 眨眼 -->
          <rect :x="130" :y="148" :width="38" height="0" fill="#f97316" rx="2" opacity="0">
            <animate attributeName="height" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;14;0;0;0;0;0;0;0;0;0;0;0;0;0;0" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;1;0;0;0;0;0;0;0;0;0;0;0;0;0;0" dur="4s" repeatCount="indefinite"/>
          </rect>

          <!-- 鼻子 -->
          <ellipse cx="160" cy="160" rx="4.5" ry="3" fill="#f87171"/>

          <!-- 嘴 -->
          <path d="M 156 164 Q 160 170 164 164" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-linecap="round"/>

          <!-- 胡须左侧 -->
          <line x1="115" y1="156" x2="135" y2="159" stroke="#fed7aa" stroke-width="1.2"/>
          <line x1="114" y1="163" x2="135" y2="163" stroke="#fed7aa" stroke-width="1.2"/>
          <line x1="116" y1="170" x2="136" y2="167" stroke="#fed7aa" stroke-width="1.2"/>
          <!-- 胡须右侧 -->
          <line x1="205" y1="156" x2="185" y2="159" stroke="#fed7aa" stroke-width="1.2"/>
          <line x1="206" y1="163" x2="185" y2="163" stroke="#fed7aa" stroke-width="1.2"/>
          <line x1="204" y1="170" x2="184" y2="167" stroke="#fed7aa" stroke-width="1.2"/>

          <!-- 粉色腮红 -->
          <ellipse :cx="132 + eyeOffsetX" :cy="164 + eyeOffsetY" rx="8" ry="5" fill="#fca5a5" opacity="0.4"/>
          <ellipse :cx="188 + eyeOffsetX" :cy="164 + eyeOffsetY" rx="8" ry="5" fill="#fca5a5" opacity="0.4"/>
        </svg>
        <div class="cat-speech">
          <span class="speech-text">{{ speechText }}</span>
        </div>
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card-glass">
      <div class="login-header">
        <div class="login-logo">
          <div class="logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="url(#logoGrad)"/>
              <path d="M12 14h16M12 20h16M12 26h10" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stop-color="#4a6cf7"/>
                  <stop offset="100%" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">高校教材管理系统</span>
        </div>
        <p class="login-subtitle">{{ isRegister ? '创建您的账号' : '欢迎回来，请登录您的账号' }}</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        class="login-form"
        @submit.prevent
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            :prefix-icon="UserFilled"
            clearable
            class="custom-input"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            clearable
            class="custom-input"
          />
        </el-form-item>

        <transition-group name="slide-fade">
          <template v-if="isRegister">
            <el-form-item key="name" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入姓名"
                :prefix-icon="User"
                clearable
                class="custom-input"
              />
            </el-form-item>
            <el-form-item key="email" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                :prefix-icon="Message"
                clearable
                class="custom-input"
              />
            </el-form-item>
            <el-form-item key="phone" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入电话"
                :prefix-icon="Phone"
                clearable
                class="custom-input"
              />
            </el-form-item>
          </template>
        </transition-group>

        <transition name="fade">
          <el-alert
            v-if="errorMsg"
            :title="errorMsg"
            type="error"
            show-icon
            :closable="true"
            @close="errorMsg = ''"
            class="login-alert"
          />
        </transition>

        <el-form-item class="submit-wrap">
          <el-button
            type="primary"
            :loading="loading"
            class="submit-btn"
            @click="handleSubmit"
          >
            {{ loading ? '' : (isRegister ? '注 册' : '登 录') }}
          </el-button>
        </el-form-item>

        <el-form-item class="toggle-wrap">
          <el-button
            class="toggle-btn"
            text
            @click="toggleMode"
          >
            {{ isRegister ? '已有账号？前往登录' : '没有账号？立即注册' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UserFilled, Lock, User, Message, Phone } from '@element-plus/icons-vue'
import api from '../../services/api'

const router = useRouter()

const isRegister = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const formRef = ref(null)
const catSceneRef = ref(null)

const mouseX = ref(0)
const mouseY = ref(0)
const catCenterX = ref(0)
const catCenterY = ref(0)

const form = reactive({
  username: '',
  password: '',
  name: '',
  email: '',
  phone: ''
})

const eyeOffsetX = computed(() => Math.max(-3, Math.min(3, (mouseX.value - catCenterX.value) / 40)))
const eyeOffsetY = computed(() => Math.max(-2, Math.min(2, (mouseY.value - catCenterY.value) / 50)))

const speechText = computed(() => {
  if (loading.value) return '处理中...'
  if (isRegister.value) return '欢迎新同学！'
  const h = new Date().getHours()
  if (h < 6) return '夜深了，注意休息~'
  if (h < 12) return '早上好！☀️'
  if (h < 14) return '中午好！📚'
  if (h < 18) return '下午好！📖'
  return '晚上好！🌙'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不少于6位', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
}

const toggleMode = () => {
  isRegister.value = !isRegister.value
  errorMsg.value = ''
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch { return }

  loading.value = true
  errorMsg.value = ''

  try {
    if (isRegister.value) {
      await api.post('/auth/register', {
        username: form.username,
        password: form.password,
        name: form.name,
        email: form.email,
        phone: form.phone
      })
      ElMessage.success('注册成功，请登录')
      isRegister.value = false
      form.password = ''
    } else {
      const response = await api.post('/auth/login', {
        username: form.username,
        password: form.password
      })
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      ElMessage.success({ message: '登录成功', duration: 1000 })
      setTimeout(() => router.push('/'), 400)
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || '操作失败'
  } finally {
    loading.value = false
  }
}

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const updateCatPosition = () => {
  if (catSceneRef.value) {
    const rect = catSceneRef.value.getBoundingClientRect()
    catCenterX.value = rect.left + rect.width / 2
    catCenterY.value = rect.top + rect.height / 2
  }
}

let resizeObserver = null

onMounted(() => {
  updateCatPosition()
  resizeObserver = new ResizeObserver(updateCatPosition)
  if (catSceneRef.value) {
    resizeObserver.observe(catSceneRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.login-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  animation: float 20s infinite ease-in-out;
}

.shape-1 { width: 500px; height: 500px; top: -150px; right: -100px; animation-delay: 0s; }
.shape-2 { width: 350px; height: 350px; bottom: -100px; left: -80px; animation-delay: -5s; background: rgba(255, 255, 255, 0.05); }
.shape-3 { width: 200px; height: 200px; top: 50%; left: 10%; animation-delay: -10s; background: rgba(255, 255, 255, 0.06); }
.shape-4 { width: 280px; height: 280px; top: 20%; right: 15%; animation-delay: -15s; background: rgba(255, 255, 255, 0.04); }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-30px) rotate(5deg); }
  50% { transform: translateY(10px) rotate(-3deg); }
  75% { transform: translateY(-20px) rotate(2deg); }
}

/* ==== 卡通猫区域 ==== */
.cat-sidebar {
  position: relative;
  z-index: 1;
  margin-right: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cat-scene {
  position: relative;
  width: 200px;
  height: 290px;
}

.cat-scene svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
}

.cat-speech {
  position: absolute;
  top: 20px;
  right: -10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  padding: 8px 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: speech-float 3s ease-in-out infinite;
  max-width: 140px;
}

.cat-speech::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 24px;
  width: 14px;
  height: 14px;
  background: rgba(255, 255, 255, 0.95);
  transform: rotate(45deg);
}

.speech-text {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

@keyframes speech-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ==== 登录卡片 ==== */
.login-card-glass {
  position: relative;
  z-index: 1;
  width: 440px;
  padding: 48px 40px 36px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-header { text-align: center; margin-bottom: 36px; }

.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.logo-icon { width: 44px; height: 44px; flex-shrink: 0; }
.logo-icon svg { width: 100%; height: 100%; }

.logo-text {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #4a6cf7 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle { color: #94a3b8; font-size: 14px; margin: 0; }

.login-form { margin-top: 8px; }
.login-form :deep(.el-form-item) { margin-bottom: 20px; }
.login-form :deep(.el-form-item__label) { display: none; }

.custom-input :deep(.el-input__wrapper) {
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: none;
  transition: all 0.3s ease;
  padding: 4px 16px;
  height: 48px;
}

.custom-input :deep(.el-input__wrapper:hover) { border-color: #c4b5fd; }

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
  background-color: #fff;
}

.custom-input :deep(.el-input__prefix) { color: #94a3b8; margin-right: 8px; }
.custom-input :deep(.el-input__prefix .el-icon) { font-size: 16px; }

.login-alert { margin-bottom: 16px; border-radius: 12px; }
.submit-wrap { margin-bottom: 12px !important; }

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #4a6cf7 0%, #6366f1 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.35);
}

.submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(74, 108, 247, 0.45); }
.submit-btn:active { transform: translateY(0); }

.toggle-wrap { margin-bottom: 0 !important; }

.toggle-btn { width: 100%; color: #94a3b8; font-size: 13px; transition: color 0.3s; }
.toggle-btn:hover { color: #4a6cf7; }

.slide-fade-enter-active { transition: all 0.4s ease-out; }
.slide-fade-leave-active { transition: all 0.25s ease-in; }
.slide-fade-enter-from { transform: translateY(-10px); opacity: 0; }
.slide-fade-leave-to { transform: translateY(-10px); opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>