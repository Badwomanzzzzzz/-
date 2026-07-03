<template>
  <div class="fee-container">
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="费用记录" name="records" />
        <el-tab-pane label="费用结算" name="settle" />
        <el-tab-pane label="退费管理" name="refund" />
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
  router.push(`/fee/${tab.props.name}`)
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('/fee/')) {
      const sub = newPath.split('/').pop()
      if (sub) activeTab.value = sub
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.fee-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>