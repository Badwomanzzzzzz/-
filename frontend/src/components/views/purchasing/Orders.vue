<template>
  <div class="orders-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">采购单管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增采购单</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无采购单">
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
        <el-table-column prop="OrderDate" label="下单日期" width="120" />
        <el-table-column prop="ExpectedDate" label="预计到货" width="120" />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="success" :icon="List" @click="handleProgress(row)">进度</el-button>
            <el-popconfirm title="确定删除该采购单？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.OrderID)">
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑采购单' : '新增采购单'" width="580px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="供应商" required>
          <el-select v-model="form.SupplierID" placeholder="请选择供应商" filterable style="width: 100%">
            <el-option v-for="s in suppliers" :key="s.SupplierID" :label="s.SupplierName" :value="s.SupplierID" />
          </el-select>
        </el-form-item>
        <el-form-item label="教材" required>
          <el-select v-model="form.BookID" placeholder="请选择教材" filterable style="width: 100%">
            <el-option v-for="b in books" :key="b.BookID" :label="b.BookName" :value="b.BookID" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="数量" required>
              <el-input-number v-model="form.Quantity" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价" required>
              <el-input-number v-model="form.UnitPrice" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="下单日期">
              <el-date-picker v-model="form.OrderDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计到货">
              <el-date-picker v-model="form.ExpectedDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态">
          <el-select v-model="form.Status" style="width: 100%">
            <el-option label="待处理" value="Pending" />
            <el-option label="已审批" value="Approved" />
            <el-option label="已发货" value="Shipped" />
            <el-option label="已到货" value="Delivered" />
            <el-option label="已完成" value="Completed" />
            <el-option label="已取消" value="Cancelled" />
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

    <el-dialog v-model="progressVisible" title="订单进度追踪" width="650px" destroy-on-close>
      <div v-if="progressLoading" v-loading="progressLoading" style="min-height: 120px" />
      <el-steps v-else :active="progressStep" finish-status="success" align-center process-status="process">
        <el-step title="已提交" description="Pending" />
        <el-step title="已审批" description="Approved" />
        <el-step title="已发货" description="Shipped" />
        <el-step title="已到货" description="Delivered" />
        <el-step title="已完成" description="Completed" />
      </el-steps>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="progressVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Delete, List } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const suppliers = ref([])
const books = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const progressVisible = ref(false)
const progressLoading = ref(false)
const progressStep = ref(0)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  OrderID: '',
  SupplierID: '',
  BookID: '',
  Quantity: 1,
  UnitPrice: 0,
  OrderDate: '',
  ExpectedDate: '',
  Status: 'Pending'
})

const statusType = (status) => {
  const map = { Pending: 'warning', Approved: 'info', Shipped: 'primary', Delivered: 'success', Completed: 'success', Cancelled: 'danger' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Pending: '待处理', Approved: '已审批', Shipped: '已发货', Delivered: '已到货', Completed: '已完成', Cancelled: '已取消' }
  return map[status] || status
}

const statusStepMap = { Pending: 0, Approved: 1, Shipped: 2, Delivered: 3, Completed: 4 }

const formatPrice = (val) => {
  if (val == null) return '¥0.00'
  return '¥' + Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/purchasing/orders')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取采购单列表失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchSuppliers = async () => { try { const res = await api.get('/purchasing/suppliers'); suppliers.value = res.data || res } catch {} }
const fetchBooks = async () => { try { const res = await api.get('/books'); books.value = res.data || res } catch {} }

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { OrderID: '', SupplierID: '', BookID: '', Quantity: 1, UnitPrice: 0, OrderDate: '', ExpectedDate: '', Status: 'Pending' })
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
      await api.put(`/purchasing/orders/${form.OrderID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/purchasing/orders', form)
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
    await api.delete(`/purchasing/orders/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

const handleProgress = async (row) => {
  progressVisible.value = true
  progressLoading.value = true
  try {
    const res = await api.get(`/purchasing/progress/${row.OrderID}`)
    const status = res.Status || res.data?.Status || row.Status
    progressStep.value = statusStepMap[status] || 0
  } catch {
    progressStep.value = statusStepMap[row.Status] || 0
  } finally {
    progressLoading.value = false
  }
}

onMounted(() => {
  fetchData()
  fetchSuppliers()
  fetchBooks()
})
</script>

<style scoped>
.orders-container {
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