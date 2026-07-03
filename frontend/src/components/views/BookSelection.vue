<template>
  <div class="book-selection-container">
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="教材选用申请" name="applications" />
        <el-tab-pane label="征订计划" name="plans" />
        <el-tab-pane label="教材版本" name="versions" />
      </el-tabs>
      <router-view />
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref('applications')

const handleTabClick = (tab) => {
  router.push(`/book-selection/${tab.props.name}`)
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('/book-selection/')) {
      const sub = newPath.split('/').pop()
      if (sub) activeTab.value = sub
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.book-selection-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>