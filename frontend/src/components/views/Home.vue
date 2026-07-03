<template>
  <el-container class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="home-header">
      <div class="header-left">
        <div class="brand-badge">
          <svg viewBox="0 0 32 32" fill="none" class="brand-icon">
            <rect width="32" height="32" rx="8" fill="url(#brandGrad)"/>
            <path d="M9 11h14M9 16h14M9 21h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#4a6cf7"/>
                <stop offset="100%" stop-color="#6366f1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="brand-text">高校教材管理系统</span>
      </div>
      <div class="header-right">
        <el-popover
          placement="bottom-end"
          :width="360"
          trigger="click"
          :visible="notifyVisible"
          @show="fetchNotifications"
        >
          <template #reference>
            <el-badge :value="dashboard.pendingOrders" :hidden="dashboard.pendingOrders === 0" class="header-badge">
              <el-button class="header-icon-btn" :icon="Bell" circle @click="notifyVisible = !notifyVisible" />
            </el-badge>
          </template>
          <div class="notify-panel">
            <div class="notify-header">
              <span class="notify-title">待处理通知</span>
              <el-button text size="small" type="primary" @click="router.push('/purchasing'); notifyVisible = false">查看全部</el-button>
            </div>
            <div v-if="notifications.length === 0" class="notify-empty">
              <el-icon :size="40" color="#cbd5e1"><SuccessFilled /></el-icon>
              <p>暂无待处理事项</p>
            </div>
            <div v-else class="notify-list">
              <div
                v-for="item in notifications"
                :key="item.PurchaseOrderID"
                class="notify-item"
                @click="router.push('/purchasing'); notifyVisible = false"
              >
                <div class="notify-dot"></div>
                <div class="notify-body">
                  <div class="notify-text">{{ item.BookTitle || '教材' }} x{{ item.Quantity }}</div>
                  <div class="notify-meta">
                    <span>{{ item.SupplierName }}</span>
                    <span>¥{{ item.TotalAmount }}</span>
                    <span>{{ item.OrderDate?.slice(0, 10) }}</span>
                  </div>
                </div>
                <el-tag size="small" type="warning" effect="plain">待处理</el-tag>
              </div>
            </div>
          </div>
        </el-popover>
        <el-tooltip content="🎮 贪吃蛇" placement="bottom">
          <el-button class="header-icon-btn game-btn" circle @click="showGame = true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/>
              <line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/>
              <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
            </svg>
          </el-button>
        </el-tooltip>
        <el-dropdown trigger="click" popper-class="user-popper">
          <div class="user-avatar-wrap">
            <div class="user-avatar">{{ (userStore.user?.name || userStore.user?.username || 'U').charAt(0) }}</div>
            <span class="user-name">{{ userStore.user?.name || userStore.user?.username }}</span>
            <el-icon class="user-arrow"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                <div class="dropdown-user-info">
                  <div class="dropdown-avatar">{{ (userStore.user?.name || userStore.user?.username || 'U').charAt(0) }}</div>
                  <div>
                    <div class="dropdown-name">{{ userStore.user?.name || userStore.user?.username }}</div>
                    <div class="dropdown-role">{{ userStore.isAdmin ? '管理员' : '普通用户' }}</div>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="body-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '72px' : '240px'" class="home-aside">
        <div class="aside-header" @click="isCollapse = !isCollapse">
          <el-icon :size="20" class="collapse-icon" :class="{ rotated: isCollapse }">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <span v-show="!isCollapse" class="aside-title">导航菜单</span>
        </div>

        <el-scrollbar>
          <el-menu
            :default-active="activeMenu"
            :router="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            class="sidebar-menu"
            background-color="transparent"
            text-color="#94a3b8"
            active-text-color="#ffffff"
          >
            <el-menu-item index="/dashboard">
              <el-icon><HomeFilled /></el-icon>
              <template #title>首页概览</template>
            </el-menu-item>

            <div v-if="userStore.isAdmin" class="menu-group-title" v-show="!isCollapse">基础数据</div>
            <el-menu-item v-if="userStore.isAdmin" index="/basic-info">
              <el-icon><Setting /></el-icon>
              <template #title>基础信息管理</template>
            </el-menu-item>

            <div class="menu-group-title" v-show="!isCollapse">教材业务</div>
            <el-menu-item index="/books">
              <el-icon><Document /></el-icon>
              <template #title>教材管理</template>
            </el-menu-item>
            <el-menu-item index="/book-selection">
              <el-icon><Collection /></el-icon>
              <template #title>教材选用与征订</template>
            </el-menu-item>

            <div v-if="userStore.isAdmin" class="menu-group-title" v-show="!isCollapse">后勤运营</div>
            <el-menu-item v-if="userStore.isAdmin" index="/purchasing">
              <el-icon><ShoppingCart /></el-icon>
              <template #title>采购与供应商</template>
            </el-menu-item>
            <el-menu-item v-if="userStore.isAdmin" index="/inventory">
              <el-icon><Box /></el-icon>
              <template #title>库存管理</template>
            </el-menu-item>
            <el-menu-item v-if="userStore.isAdmin" index="/distribution">
              <el-icon><Van /></el-icon>
              <template #title>发放管理</template>
            </el-menu-item>
            <el-menu-item v-if="userStore.isAdmin" index="/fee">
              <el-icon><Money /></el-icon>
              <template #title>教材费管理</template>
            </el-menu-item>

            <div v-if="userStore.isAdmin" class="menu-group-title" v-show="!isCollapse">系统管理</div>
            <el-menu-item v-if="userStore.isAdmin" index="/reports">
              <el-icon><DataAnalysis /></el-icon>
              <template #title>报表统计</template>
            </el-menu-item>
            <el-menu-item v-if="userStore.isAdmin" index="/system">
              <el-icon><Tools /></el-icon>
              <template #title>系统管理</template>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>

        <div class="aside-footer" v-show="!isCollapse">
          <div class="footer-tip">高校教材管理系统 v1.0</div>
        </div>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="home-main">
        <!-- 欢迎卡片 -->
        <div class="welcome-banner">
          <div class="welcome-text">
            <h1>欢迎回来，{{ userStore.user?.name || userStore.user?.username }}</h1>
            <p>{{ greeting }}, 今天是 {{ today }}，祝您工作愉快！</p>
          </div>
          <div class="welcome-illustration">
            <svg viewBox="0 0 120 80" fill="none">
              <rect x="10" y="20" width="30" height="45" rx="3" fill="#e0e7ff" stroke="#c7d2fe" stroke-width="1"/>
              <rect x="45" y="10" width="30" height="55" rx="3" fill="#c7d2fe" stroke="#a5b4fc" stroke-width="1"/>
              <rect x="80" y="25" width="30" height="40" rx="3" fill="#ddd6fe" stroke="#c4b5fd" stroke-width="1"/>
              <circle cx="25" cy="40" r="6" fill="#a5b4fc" opacity="0.6"/>
              <circle cx="60" cy="35" r="8" fill="#818cf8" opacity="0.6"/>
              <circle cx="95" cy="42" r="5" fill="#a78bfa" opacity="0.6"/>
            </svg>
          </div>
        </div>

        <!-- 统计卡片 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6" v-for="stat in statCards" :key="stat.label">
            <div class="stat-card" :style="{ '--card-accent': stat.color }">
              <div class="stat-icon-box" :style="{ backgroundColor: stat.bg }">
                <el-icon :size="24" :color="stat.color"><component :is="stat.icon" /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">
                  <span class="stat-number">{{ stat.value }}</span>
                  <span class="stat-unit">{{ stat.unit }}</span>
                </div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 子路由内容 -->
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
  <SnakeGame v-model="showGame" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import SnakeGame from './SnakeGame.vue'
import {
  Fold, Expand, HomeFilled, Setting, Document, Collection,
  ShoppingCart, Box, Van, Money, DataAnalysis, Tools,
  Bell, ArrowDown, SwitchButton, User, SuccessFilled
} from '@element-plus/icons-vue'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)
const showGame = ref(false)
const notifyVisible = ref(false)
const notifications = ref([])

const activeMenu = computed(() => {
  const path = route.path
  const segments = path.split('/').filter(Boolean)
  if (segments.length >= 1) {
    const first = '/' + segments[0]
    const valid = ['/dashboard', '/basic-info', '/books', '/book-selection', '/purchasing', '/inventory', '/distribution', '/fee', '/reports', '/system']
    if (valid.includes(first)) return first
  }
  return '/dashboard'
})

const dashboard = ref({ bookCount: 0, studentCount: 0, inventoryTotal: 0, pendingOrders: 0 })

const statCards = computed(() => [
  { label: '教材总数', value: dashboard.value.bookCount, unit: '本', icon: Document, color: '#4a6cf7', bg: 'rgba(74,108,247,0.1)' },
  { label: '学生总数', value: dashboard.value.studentCount, unit: '人', icon: User, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { label: '库存总量', value: dashboard.value.inventoryTotal, unit: '册', icon: Box, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { label: '待处理采购单', value: dashboard.value.pendingOrders, unit: '单', icon: ShoppingCart, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
])

const today = computed(() => {
  const d = new Date()
  const weekMap = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekMap[d.getDay()]}`
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 9) return '早上好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const fetchDashboard = async () => {
  try {
    const res = await api.get('/reports/dashboard')
    dashboard.value = res
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}

const fetchNotifications = async () => {
  try {
    const res = await api.get('/purchasing/orders')
    notifications.value = (Array.isArray(res) ? res : []).filter(o => o.Status === 'Pending')
  } catch (error) {
    console.error('获取通知失败:', error)
  }
}

onMounted(() => {
  fetchDashboard()
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  background: #f1f5f9;
}

/* ========== 顶部导航 ========== */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 24px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-badge {
  width: 34px;
  height: 34px;
}

.brand-icon {
  width: 100%;
  height: 100%;
}

.brand-text {
  font-size: 17px;
  font-weight: 700;
  background: linear-gradient(135deg, #4a6cf7 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-badge {
  margin-right: 4px;
}

.header-icon-btn {
  border: none;
  color: #64748b;
  background: #f1f5f9;
  transition: all 0.2s;
}

.header-icon-btn:hover {
  background: #e2e8f0;
  color: #4a6cf7;
}

.game-btn:hover {
  background: #dbeafe;
  color: #10b981;
}

.notify-panel {
  max-height: 360px;
  overflow-y: auto;
}
.notify-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 8px;
}
.notify-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}
.notify-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  color: #94a3b8;
  font-size: 13px;
  gap: 8px;
}
.notify-list {
  display: flex;
  flex-direction: column;
}
.notify-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.notify-item:hover {
  background: #f1f5f9;
}
.notify-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
}
.notify-body {
  flex: 1;
  min-width: 0;
}
.notify-text {
  font-size: 13px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notify-meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.user-avatar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px 4px 4px;
  border-radius: 24px;
  transition: all 0.2s;
}

.user-avatar-wrap:hover {
  background: #f1f5f9;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7, #6366f1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.user-name {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-arrow {
  color: #94a3b8;
  font-size: 12px;
}

/* ========== 侧边栏 ========== */
.body-container {
  height: calc(100vh - 60px);
  overflow: hidden;
}

.home-aside {
  background: #1e293b;
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.aside-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s;
}

.aside-header:hover {
  background: rgba(255, 255, 255, 0.04);
}

.collapse-icon {
  color: #94a3b8;
  transition: transform 0.28s;
  flex-shrink: 0;
}

.aside-title {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.menu-group-title {
  padding: 16px 20px 6px;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.sidebar-menu {
  border-right: none;
  padding: 4px 8px;
}

.sidebar-menu :deep(.el-menu-item) {
  border-radius: 10px;
  margin-bottom: 2px;
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  transition: all 0.2s;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #e2e8f0 !important;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(74, 108, 247, 0.2), rgba(99, 102, 241, 0.15)) !important;
  color: #ffffff !important;
  position: relative;
}

.sidebar-menu :deep(.el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: linear-gradient(180deg, #4a6cf7, #6366f1);
}

.sidebar-menu :deep(.el-icon) {
  font-size: 18px;
}

.aside-footer {
  padding: 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-tip {
  font-size: 11px;
  color: #475569;
  text-align: center;
}

/* ========== 主内容区 ========== */
.home-main {
  padding: 20px 24px;
  overflow-y: auto;
  background: #f1f5f9;
}

.welcome-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px 30px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.welcome-text h1 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.welcome-text p {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

.welcome-illustration svg {
  width: 140px;
  height: 90px;
}

/* ========== 统计卡片 ========== */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-accent, #4a6cf7);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.stat-card:hover::after {
  transform: scaleX(1);
}

.stat-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.stat-number {
  font-size: 26px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.stat-unit {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

/* ========== 路由过渡 ========== */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

<style>
.user-popper {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.dropdown-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7, #6366f1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.dropdown-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.dropdown-role {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}
</style>