<template>
  <div class="records-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">发放记录</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增发放记录</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无发放记录">
        <el-table-column prop="StudentName" label="学生" width="120" />
        <el-table-column prop="BookName" label="教材" min-width="200" />
        <el-table-column prop="Quantity" label="数量" width="80" align="center" />
        <el-table-column prop="DistributionDate" label="发放日期" width="140" />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该记录？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.DistributionID)">
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑发放记录' : '新增发放记录'" width="520px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="学生" required>
          <el-select v-model="form.StudentID" placeholder="请选择学生" filterable style="width: 100%">
            <el-option v-for="s in students" :key="s.StudentID" :label="s.StudentName" :value="s.StudentID" />
          </el-select>
        </el-form-item>
        <el-form-item label="教材" required>
          <el-select v-model="form.BookID" placeholder="请选择教材" filterable style="width: 100%">
            <el-option v-for="b in books" :key="b.BookID" :label="b.BookName" :value="b.BookID" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" required>
          <el-input-number v-model="form.Quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="发放日期">
          <el-date-picker v-model="form.DistributionDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.Status" style="width: 100%">
            <el-option label="待发放" value="Pending" />
            <el-option label="已发放" value="Distributed" />
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
const students = ref([])
const books = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  DistributionID: '',
  StudentID: '',
  BookID: '',
  Quantity: 1,
  DistributionDate: '',
  Status: 'Pending'
})

const statusType = (status) => {
  const map = { Pending: 'warning', Distributed: 'success' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Pending: '待发放', Distributed: '已发放' }
  return map[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/distribution/records')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取发放记录失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchStudents = async () => { try { const res = await api.get('/basic-info/students'); students.value = res.data || res } catch {} }
const fetchBooks = async () => { try { const res = await api.get('/books'); books.value = res.data || res } catch {} }

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { DistributionID: '', StudentID: '', BookID: '', Quantity: 1, DistributionDate: '', Status: 'Pending' })
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
      await api.put(`/distribution/records/${form.DistributionID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/distribution/records', form)
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
    await api.delete(`/distribution/records/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchData()
  fetchStudents()
  fetchBooks()
})
</script>

<style scoped>
.records-container {
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