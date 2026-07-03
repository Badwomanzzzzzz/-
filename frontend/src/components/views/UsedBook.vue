<template>
  <div class="used-book-container">
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="回收记录" name="records" />
        <el-tab-pane label="旧书发放" name="distribution" />
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
const activeTab = ref('records')

const handleTabClick = (tab) => {
  router.push(`/used-book/${tab.props.name}`)
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('/used-book/')) {
      const sub = newPath.split('/').pop()
      if (sub) activeTab.value = sub
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.used-book-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>