<template>
  <div class="distribution-container">
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="发放记录" name="records" />
        <el-tab-pane label="生成清单" name="generate" />
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
  router.push(`/distribution/${tab.props.name}`)
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('/distribution/')) {
      const sub = newPath.split('/').pop()
      if (sub) activeTab.value = sub
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.distribution-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>