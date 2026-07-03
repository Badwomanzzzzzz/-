<template>
  <div class="applications-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">教材选用申请</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">添加申请</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无申请记录">
        <el-table-column prop="TeacherName" label="教师" width="120" />
        <el-table-column prop="CourseName" label="课程" width="150" />
        <el-table-column prop="BookTitle" label="教材" min-width="180" />
        <el-table-column prop="SemesterName" label="学期" width="120" />
        <el-table-column prop="ApplicationDate" label="申请时间" width="160" />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.Status)" size="small">{{ statusLabel(row.Status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ReviewedBy" label="审核人" width="100" />
        <el-table-column prop="ReviewComment" label="审核意见" width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button v-if="row.Status === 'Pending'" size="small" type="warning" :icon="Check" @click="handleReview(row)">审核</el-button>
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该申请？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.ApplicationID)">
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑申请' : '添加申请'" width="550px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="教师" required>
          <el-select v-model="form.TeacherID" placeholder="请选择教师" filterable style="width: 100%">
            <el-option v-for="t in teachers" :key="t.TeacherID" :label="t.TeacherName" :value="t.TeacherID" />
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
        <el-form-item label="学期" required>
          <el-select v-model="form.SemesterID" placeholder="请选择学期" filterable style="width: 100%">
            <el-option v-for="s in semesters" :key="s.SemesterID" :label="s.SemesterName" :value="s.SemesterID" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请理由">
          <el-input v-model="form.Reason" type="textarea" :rows="3" placeholder="请输入申请理由" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewVisible" title="审核申请" width="500px" destroy-on-close>
      <el-form :model="reviewForm" label-width="90px" label-position="right">
        <el-form-item label="申请教师">
          <el-input :model-value="reviewForm.TeacherName" disabled />
        </el-form-item>
        <el-form-item label="申请课程">
          <el-input :model-value="reviewForm.CourseName" disabled />
        </el-form-item>
        <el-form-item label="申请教材">
          <el-input :model-value="reviewForm.BookTitle" disabled />
        </el-form-item>
        <el-form-item label="审核结果" required>
          <el-radio-group v-model="reviewForm.Status">
            <el-radio value="Approved">通过</el-radio>
            <el-radio value="Rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input v-model="reviewForm.ReviewComment" type="textarea" :rows="3" placeholder="请输入审核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="reviewVisible = false">取消</el-button>
          <el-button type="primary" @click="handleReviewSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Delete, Check } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const teachers = ref([])
const courses = ref([])
const books = ref([])
const semesters = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const reviewVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  ApplicationID: '',
  TeacherID: '',
  CourseID: '',
  BookID: '',
  SemesterID: '',
  Reason: ''
})

const reviewForm = reactive({
  ApplicationID: '',
  TeacherName: '',
  CourseName: '',
  BookTitle: '',
  Status: 'Approved',
  ReviewComment: ''
})

const statusType = (status) => {
  const map = { Pending: 'warning', Approved: 'success', Rejected: 'danger' }
  return map[status] || 'info'
}

const statusLabel = (status) => {
  const map = { Pending: '待审核', Approved: '已通过', Rejected: '已拒绝' }
  return map[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/book-selection/applications')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取申请列表失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchTeachers = async () => { try { const res = await api.get('/basic-info/teachers'); teachers.value = res.data || res } catch {} }
const fetchCourses = async () => { try { const res = await api.get('/basic-info/courses'); courses.value = res.data || res } catch {} }
const fetchBooks = async () => { try { const res = await api.get('/books'); books.value = res.data || res } catch {} }
const fetchSemesters = async () => { try { const res = await api.get('/basic-info/semesters'); semesters.value = res.data || res } catch {} }

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { ApplicationID: '', TeacherID: '', CourseID: '', BookID: '', SemesterID: '', Reason: '' })
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
      await api.put(`/book-selection/applications/${form.ApplicationID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/book-selection/applications', form)
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
    await api.delete(`/book-selection/applications/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

const handleReview = (row) => {
  Object.assign(reviewForm, {
    ApplicationID: row.ApplicationID,
    TeacherName: row.TeacherName,
    CourseName: row.CourseName,
    BookTitle: row.BookTitle,
    Status: 'Approved',
    ReviewComment: ''
  })
  reviewVisible.value = true
}

const handleReviewSubmit = async () => {
  try {
    await api.put('/book-selection/applications', reviewForm)
    ElMessage.success('审核成功')
    reviewVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('审核失败')
  }
}

onMounted(() => {
  fetchData()
  fetchTeachers()
  fetchCourses()
  fetchBooks()
  fetchSemesters()
})
</script>

<style scoped>
.applications-container {
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