<template>
  <div class="plans-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">征订计划</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">添加计划</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无征订计划">
        <el-table-column prop="SemesterName" label="学期" width="120" />
        <el-table-column prop="ClassName" label="班级" width="150" />
        <el-table-column prop="CourseName" label="课程" width="150" />
        <el-table-column prop="BookName" label="教材" min-width="180" />
        <el-table-column prop="RequiredQuantity" label="必修数量" width="100" align="center" />
        <el-table-column prop="OptionalQuantity" label="选修数量" width="100" align="center" />
        <el-table-column prop="CreatedAt" label="创建时间" width="160" />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该计划？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.PlanID)">
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑计划' : '添加计划'" width="550px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="学期" required>
          <el-select v-model="form.SemesterID" placeholder="请选择学期" filterable style="width: 100%">
            <el-option v-for="s in semesters" :key="s.SemesterID" :label="s.SemesterName" :value="s.SemesterID" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" required>
          <el-select v-model="form.ClassID" placeholder="请选择班级" filterable style="width: 100%">
            <el-option v-for="c in classes" :key="c.ClassID" :label="c.ClassName" :value="c.ClassID" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程" required>
          <el-select v-model="form.CourseID" placeholder="请选择课程" filterable style="width: 100%">
            <el-option v-for="c in courses" :key="c.CourseID" :label="c.CourseName" :value="c.CourseID" />
          </el-select>
        </el-form-item>
        <el-form-item label="教材" required>
          <el-select v-model="form.BookID" placeholder="请选择教材" filterable style="width: 100%">
            <el-option v-for="b in books" :key="b.BookID" :label="b.BookName" :value="b.BookID" />
          </el-select>
        </el-form-item>
        <el-form-item label="必修数量">
          <el-input-number v-model="form.RequiredQuantity" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="选修数量">
          <el-input-number v-model="form.OptionalQuantity" :min="0" style="width: 100%" />
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
const semesters = ref([])
const classes = ref([])
const courses = ref([])
const books = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  PlanID: '',
  SemesterID: '',
  ClassID: '',
  CourseID: '',
  BookID: '',
  RequiredQuantity: 0,
  OptionalQuantity: 0
})

const statusType = (status) => {
  const map = { Active: 'success', Draft: 'warning', Completed: 'info' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Active: '进行中', Draft: '草稿', Completed: '已完成' }
  return map[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/book-selection/plans')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取计划列表失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchSemesters = async () => { try { const res = await api.get('/basic-info/semesters'); semesters.value = res.data || res } catch {} }
const fetchClasses = async () => { try { const res = await api.get('/basic-info/classes'); classes.value = res.data || res } catch {} }
const fetchCourses = async () => { try { const res = await api.get('/basic-info/courses'); courses.value = res.data || res } catch {} }
const fetchBooks = async () => { try { const res = await api.get('/books'); books.value = res.data || res } catch {} }

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { PlanID: '', SemesterID: '', ClassID: '', CourseID: '', BookID: '', RequiredQuantity: 0, OptionalQuantity: 0 })
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
      await api.put(`/book-selection/plans/${form.PlanID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/book-selection/plans', form)
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
    await api.delete(`/book-selection/plans/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchData()
  fetchSemesters()
  fetchClasses()
  fetchCourses()
  fetchBooks()
})
</script>

<style scoped>
.plans-container {
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