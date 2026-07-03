<template>
  <div class="orders-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">订单管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增订单</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无订单记录">
        <el-table-column prop="BookName" label="教材" min-width="200" />
        <el-table-column prop="Quantity" label="数量" width="100" align="center" />
        <el-table-column prop="OrderDate" label="订购日期" width="140" />
        <el-table-column prop="ExpectedArrival" label="预计到货" width="140" />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该订单？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.OrderID)">
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑订单' : '新增订单'" width="520px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="教材" required>
          <el-select v-model="form.BookID" placeholder="请选择教材" filterable style="width: 100%">
            <el-option v-for="b in books" :key="b.BookID" :label="b.BookName" :value="b.BookID" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" required>
          <el-input-number v-model="form.Quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="订购日期">
          <el-date-picker v-model="form.OrderDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="预计到货">
          <el-date-picker v-model="form.ExpectedArrival" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
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
import api from '../../services/api'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const books = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  OrderID: '',
  BookID: '',
  Quantity: 1,
  OrderDate: '',
  ExpectedArrival: ''
})

const statusType = (status) => {
  const map = { Pending: 'warning', Shipped: 'primary', Delivered: 'success', Cancelled: 'danger' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Pending: '待处理', Shipped: '已发货', Delivered: '已到货', Cancelled: '已取消' }
  return map[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/orders', { params: { page: currentPage.value, pageSize: pageSize.value } })
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取订单列表失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchBooks = async () => {
  try {
    const res = await api.get('/books')
    books.value = res.data || res
  } catch (e) {
    console.warn('获取教材列表失败:', e)
  }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { OrderID: '', BookID: '', Quantity: 1, OrderDate: '', ExpectedArrival: '' })
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
      await api.put(`/orders/${form.OrderID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/orders', form)
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
    await api.delete(`/orders/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchData()
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