<template>
  <div class="inventory-container">
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="库存查询" name="query" />
        <el-tab-pane label="入库管理" name="inbound" />
        <el-tab-pane label="出库管理" name="outbound" />
        <el-tab-pane label="库存盘点" name="check" />
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
const activeTab = ref('query')

const handleTabClick = (tab) => {
  router.push(`/inventory/${tab.props.name}`)
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('/inventory/')) {
      const sub = newPath.split('/').pop()
      if (sub) activeTab.value = sub
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.inventory-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>