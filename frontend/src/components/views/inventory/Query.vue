<template>
  <div class="query-container">
    <el-alert
      v-if="lowStock.length > 0"
      :title="`库存预警：以下 ${lowStock.length} 种教材库存不足`"
      type="warning"
      :closable="false"
      show-icon
      style="margin-bottom: 20px"
    >
      <template #default>
        <div class="alert-books">
          <el-tag
            v-for="b in lowStock"
            :key="b.InventoryID"
            type="danger"
            size="small"
            style="margin-right: 8px; margin-bottom: 4px"
          >
            {{ b.BookName }}（仅剩 {{ b.Quantity }}）
          </el-tag>
        </div>
      </template>
    </el-alert>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">库存查询</span>
          <el-input
            v-model="searchKey"
            placeholder="搜索教材名称"
            clearable
            :prefix-icon="Search"
            style="width: 280px"
          />
        </div>
      </template>

      <el-table :data="filteredData" v-loading="loading" stripe empty-text="暂无库存数据">
        <el-table-column prop="BookName" label="教材" min-width="200" />
        <el-table-column prop="ISBN" label="ISBN" width="160" />
        <el-table-column prop="Quantity" label="库存量" width="100" align="center">
          <template #default="{ row }">
            <span :style="{ color: stockColor(row.Quantity), fontWeight: 'bold', fontSize: '15px' }">{{ row.Quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="WarehouseName" label="仓库" width="150" />
        <el-table-column label="库存状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="stockTagType(row.Quantity)" size="small">{{ stockLabel(row.Quantity) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="View" @click="handleDetail(row)">详情</el-button>
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
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="库存详情" width="500px">
      <el-descriptions :column="2" border v-if="detailRow">
        <el-descriptions-item label="教材名称">{{ detailRow.BookName }}</el-descriptions-item>
        <el-descriptions-item label="ISBN">{{ detailRow.ISBN }}</el-descriptions-item>
        <el-descriptions-item label="库存量">
          <el-tag :type="stockTagType(detailRow.Quantity)" size="small">{{ detailRow.Quantity }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="仓库">{{ detailRow.WarehouseName }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, View } from '@element-plus/icons-vue'
import api from '../../../services/api'

const tableData = ref([])
const lowStock = ref([])
const loading = ref(false)
const searchKey = ref('')
const detailVisible = ref(false)
const detailRow = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filteredData = computed(() => {
  if (!searchKey.value) return tableData.value
  const q = searchKey.value.toLowerCase()
  return tableData.value.filter(item => (item.BookName || '').toLowerCase().includes(q))
})

const stockColor = (qty) => { if (qty < 10) return '#f56c6c'; if (qty < 30) return '#e6a23c'; return '#67c23a' }
const stockTagType = (qty) => { if (qty < 10) return 'danger'; if (qty < 30) return 'warning'; return 'success' }
const stockLabel = (qty) => { if (qty < 10) return '库存紧张'; if (qty < 30) return '库存偏低'; return '库存充足' }

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/inventory/query')
    tableData.value = Array.isArray(res) ? res : []
    total.value = tableData.value.length
  } catch (e) {
    console.warn('获取库存列表失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchLowStock = async () => {
  try {
    const res = await api.get('/inventory/low-stock')
    lowStock.value = Array.isArray(res) ? res : []
  } catch {}
}

const handleDetail = (row) => {
  detailRow.value = row
  detailVisible.value = true
}

onMounted(() => {
  fetchData()
  fetchLowStock()
})
</script>

<style scoped>
.query-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; }
.alert-books { margin-top: 8px; }
.pagination-wrapper { margin-top: 16px; display: flex; justify-content: flex-end; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 8px; }
</style>