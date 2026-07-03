<template>
  <router-view v-slot="{ Component }">
    <transition name="route-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Inter', 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f1f5f9;
  color: #334155;
}

#app {
  height: 100%;
}

/* ========== 路由过渡动画 ========== */
.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.route-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.route-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ========== 全局 Element Plus 覆盖 ========== */

/* --- 按钮 --- */
.el-button--primary {
  --el-button-bg-color: #4a6cf7 !important;
  --el-button-border-color: #4a6cf7 !important;
  --el-button-hover-bg-color: #3b5de7 !important;
  --el-button-hover-border-color: #3b5de7 !important;
  --el-button-active-bg-color: #3451d6 !important;
  --el-button-active-border-color: #3451d6 !important;
  border-radius: 10px !important;
  font-weight: 500 !important;
  transition: all 0.25s ease !important;
}

.el-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
}

.el-button--small {
  border-radius: 8px !important;
}

/* --- 卡片 --- */
.el-card {
  border-radius: 14px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  background-color: #ffffff !important;
  overflow: hidden;
}

.el-card__header {
  border-bottom: 1px solid #f1f5f9 !important;
  padding: 18px 24px !important;
  font-weight: 600 !important;
  color: #1e293b !important;
}

.el-card__body {
  padding: 24px !important;
}

/* --- 输入框 --- */
.el-input__wrapper {
  border-radius: 10px !important;
  box-shadow: none !important;
  border: 1.5px solid #e2e8f0 !important;
  background-color: #f8fafc !important;
  transition: all 0.25s ease !important;
}

.el-input__wrapper:hover {
  border-color: #cbd5e1 !important;
}

.el-input__wrapper.is-focus {
  border-color: #4a6cf7 !important;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.08) !important;
  background-color: #fff !important;
}

.el-select .el-input__wrapper {
  border-radius: 10px !important;
}

/* --- 对话框 --- */
.el-dialog {
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden;
}

.el-dialog__header {
  padding: 20px 24px 16px !important;
  border-bottom: 1px solid #f1f5f9 !important;
  font-weight: 600 !important;
  color: #1e293b !important;
}

.el-dialog__body {
  padding: 24px !important;
}

.el-dialog__footer {
  padding: 16px 24px 20px !important;
  border-top: 1px solid #f1f5f9 !important;
}

/* --- 表格 --- */
.el-table {
  border-radius: 12px !important;
  overflow: hidden;
  --el-table-border-color: #f1f5f9 !important;
}

.el-table th.el-table__cell {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  border-bottom: 2px solid #e2e8f0 !important;
}

.el-table .el-table__row:hover > td {
  background-color: #f8fafc !important;
}

.el-table__body tr:last-child td {
  border-bottom: none !important;
}

/* --- 标签(Tabs) --- */
.el-tabs__header {
  margin-bottom: 16px !important;
}

.el-tabs__nav-wrap::after {
  height: 1px !important;
  background-color: #e2e8f0 !important;
}

.el-tabs__item {
  font-weight: 500 !important;
  color: #64748b !important;
  transition: all 0.2s !important;
}

.el-tabs__item:hover {
  color: #4a6cf7 !important;
}

.el-tabs__item.is-active {
  color: #4a6cf7 !important;
  font-weight: 600 !important;
}

.el-tabs__active-bar {
  background-color: #4a6cf7 !important;
  height: 2.5px !important;
  border-radius: 2px !important;
}

/* --- 标签(Tag) --- */
.el-tag {
  border-radius: 6px !important;
  font-weight: 500 !important;
}

/* --- 分页 --- */
.el-pagination {
  --el-pagination-button-bg-color: #f8fafc !important;
}

.el-pagination .el-pager li {
  border-radius: 8px !important;
}

.el-pagination .el-pager li.is-active {
  background-color: #4a6cf7 !important;
  color: #fff !important;
}

/* --- 弹出确认框 --- */
.el-popconfirm__action .el-button--primary {
  margin-left: 8px;
}

/* --- 消息提示 --- */
.el-message {
  border-radius: 12px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

/* --- 滚动条 --- */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 搜索高亮 */
.search-highlight {
  background-color: #dbeafe;
  color: #1d4ed8;
  padding: 2px 5px;
  border-radius: 3px;
  font-weight: 600;
}
</style>