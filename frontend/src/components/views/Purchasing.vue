<template>
  <div class="purchasing-container">
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="供应商管理" name="suppliers" />
        <el-tab-pane label="采购单管理" name="orders" />
        <el-tab-pane label="到货登记" name="receipts" />
        <el-tab-pane label="发票管理" name="invoices" />
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
const activeTab = ref('suppliers')

const handleTabClick = (tab) => {
  router.push(`/purchasing/${tab.props.name}`)
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes('/purchasing/')) {
      const sub = newPath.split('/').pop()
      if (sub) activeTab.value = sub
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.purchasing-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>