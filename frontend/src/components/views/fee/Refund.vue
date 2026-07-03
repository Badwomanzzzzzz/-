<template>
  <div class="refund-container">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">退费管理</span>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无退费记录">
        <el-table-column prop="StudentName" label="学生" width="120" />
        <el-table-column prop="OriginalAmount" label="原金额" width="110" align="right">
          <template #default="{ row }">
            <span>{{ formatPrice(row.OriginalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="RefundAmount" label="退费金额" width="110" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #f56c6c">{{ formatPrice(row.RefundAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Reason" label="原因" min-width="180" show-overflow-tooltip />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              v-if="row.Status === 'Pending'"
              size="small"
              type="primary"
              :icon="Finished"
              @click="handleProcess(row)"
            >
              处理退费
            </el-button>
            <el-tag v-else type="success" size="small">已处理</el-tag>
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

    <el-dialog v-model="processVisible" title="处理退费" width="480px" destroy-on-close>
      <el-form :model="processForm" label-width="90px" label-position="right">
        <el-form-item label="学生">
          <el-input :model-value="processForm.StudentName" disabled />
        </el-form-item>
        <el-form-item label="退费金额" required>
          <el-input-number v-model="processForm.RefundAmount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="processForm.Remark" type="textarea" :rows="2" placeholder="可选备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="processVisible = false">取消</el-button>
          <el-button type="primary" @click="handleProcessSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Finished } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const loading = ref(false)
const processVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const processForm = reactive({
  RefundID: '',
  StudentName: '',
  RefundAmount: 0,
  Remark: ''
})

const statusType = (status) => {
  const map = { Pending: 'warning', Processed: 'success' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Pending: '待处理', Processed: '已处理' }
  return map[status] || status
}

const formatPrice = (val) => {
  if (val == null) return '¥0.00'
  return '¥' + Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/fee/refund')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取退费列表失败:', e)
  } finally {
    loading.value = false
  }
}

const handleProcess = (row) => {
  Object.assign(processForm, {
    RefundID: row.RefundID,
    StudentName: row.StudentName,
    RefundAmount: row.RefundAmount,
    Remark: ''
  })
  processVisible.value = true
}

const handleProcessSubmit = async () => {
  try {
    await api.put(`/fee/refund/${processForm.RefundID}`, {
      RefundAmount: processForm.RefundAmount,
      Status: 'Processed',
      Remark: processForm.Remark
    })
    ElMessage.success('退费处理成功')
    processVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('退费处理失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.refund-container {
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>