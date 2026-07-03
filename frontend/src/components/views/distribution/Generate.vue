<template>
  <div class="generate-container">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">生成发放清单</span>
      </template>

      <el-form :model="form" label-width="90px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学期" required>
              <el-select v-model="form.SemesterID" placeholder="请选择学期" filterable style="width: 100%">
                <el-option v-for="s in semesters" :key="s.SemesterID" :label="s.SemesterName" :value="s.SemesterID" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" required>
              <el-select v-model="form.ClassID" placeholder="请选择班级" filterable style="width: 100%">
                <el-option v-for="c in classes" :key="c.ClassID" :label="c.ClassName" :value="c.ClassID" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程" required>
              <el-select v-model="form.CourseID" placeholder="请选择课程" filterable style="width: 100%">
                <el-option v-for="c in courses" :key="c.CourseID" :label="c.CourseName" :value="c.CourseID" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教材" required>
              <el-select v-model="form.BookID" placeholder="请选择教材" filterable style="width: 100%">
                <el-option v-for="b in books" :key="b.BookID" :label="b.BookName" :value="b.BookID" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" :icon="Finished" :loading="generating" @click="handleGenerate">生成清单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card v-if="listItems && listItems.length > 0" shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span class="card-title">清单内容（共 {{ listItems.length }} 人）</span>
          <el-button type="success" :icon="Finished" @click="handleConfirmDistribute">确认全部发放</el-button>
        </div>
      </template>

      <el-table :data="listItems" stripe empty-text="暂无数据">
        <el-table-column prop="StudentName" label="学生姓名" width="120" />
        <el-table-column prop="BookName" label="教材" min-width="200" />
        <el-table-column label="发放状态" width="120" align="center">
          <template #default>
            <el-tag type="warning" size="small">待发放</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Finished } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage } from 'element-plus'

const semesters = ref([])
const classes = ref([])
const courses = ref([])
const books = ref([])
const generating = ref(false)
const listItems = ref(null)
const currentListId = ref(null)

const form = reactive({
  SemesterID: '',
  ClassID: '',
  CourseID: '',
  BookID: ''
})

const fetchDropdowns = async () => {
  try {
    const [sem, cls, crs, bks] = await Promise.all([
      api.get('/basic-info/semesters'),
      api.get('/basic-info/classes'),
      api.get('/basic-info/courses'),
      api.get('/books')
    ])
    semesters.value = Array.isArray(sem) ? sem : []
    classes.value = Array.isArray(cls) ? cls : []
    courses.value = Array.isArray(crs) ? crs : []
    books.value = Array.isArray(bks) ? bks : []
  } catch {}
}

const handleGenerate = async () => {
  if (!form.SemesterID || !form.ClassID || !form.CourseID || !form.BookID) {
    ElMessage.warning('请填写所有必要信息')
    return
  }
  generating.value = true
  try {
    const res = await api.post('/distribution/generate-list', { ...form, CreatedBy: 1 })
    listItems.value = res.items || []
    currentListId.value = res.ListID
    ElMessage.success('清单生成成功')
  } catch {
    ElMessage.error('生成清单失败')
  } finally {
    generating.value = false
  }
}

const handleConfirmDistribute = async () => {
  if (!listItems.value || listItems.value.length === 0) return
  try {
    for (const item of listItems.value) {
      await api.post('/distribution/records', {
        ListID: currentListId.value,
        StudentID: item.StudentID,
        BookID: item.BookID,
        Quantity: 1,
        RecipientName: item.StudentName,
        Status: 'Completed'
      })
    }
    ElMessage.success(`成功发放 ${listItems.value.length} 本教材`)
    listItems.value = null
    currentListId.value = null
  } catch {
    ElMessage.error('批量发放失败，请检查库存是否充足')
  }
}

onMounted(fetchDropdowns)
</script>

<style scoped>
.generate-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; }
</style>