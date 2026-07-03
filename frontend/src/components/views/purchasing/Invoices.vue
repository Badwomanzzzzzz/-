<template>
  <div class="invoices-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">发票管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增发票</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无发票记录">
        <el-table-column prop="InvoiceNumber" label="发票号" width="180" />
        <el-table-column prop="OrderID" label="采购订单号" width="120" />
        <el-table-column prop="InvoiceDate" label="开票日期" width="140" />
        <el-table-column prop="Amount" label="金额" width="130" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600">{{ formatPrice(row.Amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该发票？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.InvoiceID)">
              <template #reference>
                <el-button size="small" type="danger" :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑发票' : '新增发票'" width="520px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="发票号" required>
          <el-input v-model="form.InvoiceNumber" placeholder="请输入发票号" />
        </el-form-item>
        <el-form-item label="采购订单号" required>
          <el-select v-model="form.OrderID" placeholder="请选择采购订单" filterable style="width: 100%">
            <el-option v-for="o in orders" :key="o.OrderID" :label="'订单-' + o.OrderID" :value="o.OrderID" />
          </el-select>
        </el-form-item>
        <el-form-item label="开票日期">
          <el-date-picker v-model="form.InvoiceDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="金额" required>
          <el-input-number v-model="form.Amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.Status" style="width: 100%">
            <el-option label="待支付" value="Pending" />
            <el-option label="已支付" value="Paid" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const orders = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  InvoiceID: '',
  InvoiceNumber: '',
  OrderID: '',
  InvoiceDate: '',
  Amount: 0,
  Status: 'Pending'
})

const statusType = (status) => {
  const map = { Pending: 'warning', Paid: 'success' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Pending: '待支付', Paid: '已支付' }
  return map[status] || status
}

const formatPrice = (val) => {
  if (val == null) return '¥0.00'
  return '¥' + Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/purchasing/invoices')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取发票列表失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchOrders = async () => { try { const res = await api.get('/purchasing/orders'); orders.value = res.data || res } catch {} }

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { InvoiceID: '', InvoiceNumber: '', OrderID: '', InvoiceDate: '', Amount: 0, Status: 'Pending' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/purchasing/invoices/${form.InvoiceID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/purchasing/invoices', form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (id) => {
  try {
    await api.delete(`/purchasing/invoices/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchData()
  fetchOrders()
})
</script>

<style scoped>
.invoices-container {
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>