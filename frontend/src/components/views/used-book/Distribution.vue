<template>
  <div class="distribution-container">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">旧书发放</span>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无旧书发放记录">
        <el-table-column prop="StudentName" label="学生" width="120" />
        <el-table-column prop="BookName" label="教材" min-width="200" />
        <el-table-column prop="Quantity" label="数量" width="80" align="center" />
        <el-table-column prop="Price" label="价格" width="110" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600">{{ formatPrice(row.Price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="DistributionDate" label="发放日期" width="140" />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          background
          @change="fetchData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../../services/api'

const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const statusType = (status) => {
  const map = { Pending: 'warning', Distributed: 'success' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Pending: '待发放', Distributed: '已发放' }
  return map[status] || status
}

const formatPrice = (val) => {
  if (val == null) return '¥0.00'
  return '¥' + Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/used-book/distribution')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取旧书发放记录失败:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.distribution-container {
  padding: 20px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
}
.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>