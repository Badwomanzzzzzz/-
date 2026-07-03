<template>
  <div class="receipts-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">到货登记</span>
          <el-tag type="info" size="small">待收货订单</el-tag>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无待收货的订单">
        <el-table-column prop="OrderID" label="订单号" width="100" />
        <el-table-column prop="SupplierName" label="供应商" width="150" />
        <el-table-column prop="BookName" label="教材" min-width="180" />
        <el-table-column prop="Quantity" label="数量" width="80" align="center" />
        <el-table-column prop="UnitPrice" label="单价" width="110" align="right">
          <template #default="{ row }">
            <span>{{ formatPrice(row.UnitPrice) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="TotalAmount" label="总金额" width="120" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #e6a23c">{{ formatPrice(row.TotalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ExpectedDate" label="预计到货" width="120" />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              v-if="row.Status === 'Shipped' || row.Status === 'Approved'"
              size="small"
              type="primary"
              :icon="Checked"
              @click="handleReceipt(row)"
            >
              到货登记
            </el-button>
            <el-tag v-else-if="row.Status === 'Delivered'" type="success" size="small">已到货</el-tag>
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
import { Checked } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const statusType = (status) => {
  const map = { Pending: 'warning', Approved: 'info', Shipped: 'primary', Delivered: 'success', Completed: 'success', Cancelled: 'danger' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Pending: '待处理', Approved: '已审批', Shipped: '已发货', Delivered: '已到货', Completed: '已完成', Cancelled: '已取消' }
  return map[status] || status
}

const formatPrice = (val) => {
  if (val == null) return '¥0.00'
  return '¥' + Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/purchasing/orders')
    tableData.value = (res.data || res).filter(o => o.Status !== 'Completed' && o.Status !== 'Cancelled')
    total.value = tableData.value.length
  } catch (e) {
    console.warn('获取订单列表失败:', e)
  } finally {
    loading.value = false
  }
}

const handleReceipt = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认将订单 "${row.OrderID}" 标记为已到货？`,
      '到货确认',
      { confirmButtonText: '确认到货', cancelButtonText: '取消', type: 'success' }
    )
    await api.put(`/purchasing/orders/${row.OrderID}`, { Status: 'Delivered' })
    ElMessage.success('到货登记成功')
    fetchData()
  } catch {
    if (String(arguments[0]) !== 'cancel') {
      ElMessage.error('到货登记失败')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.receipts-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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