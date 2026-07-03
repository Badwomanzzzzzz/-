<template>
  <div class="records-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">费用记录</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增费用记录</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无费用记录">
        <el-table-column prop="StudentName" label="学生" width="120" />
        <el-table-column prop="ClassName" label="班级" width="150" />
        <el-table-column prop="SemesterName" label="学期" width="120" />
        <el-table-column prop="Amount" label="金额" width="120" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600">{{ formatPrice(row.Amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="PaymentStatus" label="缴费状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.PaymentStatus)" size="small">{{ statusLabel(row.PaymentStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="PaymentDate" label="缴费日期" width="140" />
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该记录？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.FeeID)">
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑费用记录' : '新增费用记录'" width="520px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="学生" required>
          <el-select v-model="form.StudentID" placeholder="请选择学生" filterable style="width: 100%">
            <el-option v-for="s in students" :key="s.StudentID" :label="s.StudentName" :value="s.StudentID" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" required>
          <el-select v-model="form.ClassID" placeholder="请选择班级" filterable style="width: 100%">
            <el-option v-for="c in classes" :key="c.ClassID" :label="c.ClassName" :value="c.ClassID" />
          </el-select>
        </el-form-item>
        <el-form-item label="学期" required>
          <el-select v-model="form.SemesterID" placeholder="请选择学期" filterable style="width: 100%">
            <el-option v-for="s in semesters" :key="s.SemesterID" :label="s.SemesterName" :value="s.SemesterID" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" required>
          <el-input-number v-model="form.Amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="缴费状态">
          <el-select v-model="form.PaymentStatus" style="width: 100%">
            <el-option label="已缴费" value="Paid" />
            <el-option label="未缴费" value="Unpaid" />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费日期">
          <el-date-picker v-model="form.PaymentDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
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
const classes = ref([])
const semesters = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  FeeID: '',
  StudentID: '',
  ClassID: '',
  SemesterID: '',
  Amount: 0,
  PaymentStatus: 'Unpaid',
  PaymentDate: ''
})

const statusType = (status) => {
  const map = { Paid: 'success', Unpaid: 'warning' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Paid: '已缴费', Unpaid: '未缴费' }
  return map[status] || status
}

const formatPrice = (val) => {
  if (val == null) return '¥0.00'
  return '¥' + Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/fee')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取费用记录失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchStudents = async () => { try { const res = await api.get('/basic-info/students'); students.value = res.data || res } catch {} }
const fetchClasses = async () => { try { const res = await api.get('/basic-info/classes'); classes.value = res.data || res } catch {} }
const fetchSemesters = async () => { try { const res = await api.get('/basic-info/semesters'); semesters.value = res.data || res } catch {} }

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { FeeID: '', StudentID: '', ClassID: '', SemesterID: '', Amount: 0, PaymentStatus: 'Unpaid', PaymentDate: '' })
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
      await api.put(`/fee/${form.FeeID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/fee', form)
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
    await api.delete(`/fee/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchData()
  fetchStudents()
  fetchClasses()
  fetchSemesters()
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