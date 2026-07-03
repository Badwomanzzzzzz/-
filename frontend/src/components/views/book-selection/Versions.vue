<template>
  <div class="versions-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">教材版本管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">添加版本</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe empty-text="暂无版本记录">
        <el-table-column prop="BookName" label="教材" min-width="180" />
        <el-table-column prop="VersionNumber" label="版本号" width="120" />
        <el-table-column prop="PublicationDate" label="出版日期" width="140" />
        <el-table-column prop="IsCurrent" label="当前版本" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.IsCurrent"
              active-text="是"
              inactive-text="否"
              inline-prompt
              @change="(val) => handleToggle(row, 'IsCurrent', val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="IsDisabled" label="启用状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="!row.IsDisabled"
              active-text="启用"
              inactive-text="禁用"
              inline-prompt
              @change="(val) => handleToggle(row, 'IsDisabled', !val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该版本？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.VersionID)">
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑版本' : '添加版本'" width="520px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="教材" required>
          <el-select v-model="form.BookID" placeholder="请选择教材" filterable style="width: 100%">
            <el-option v-for="b in books" :key="b.BookID" :label="b.BookName" :value="b.BookID" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" required>
          <el-input v-model="form.VersionNumber" placeholder="请输入版本号，如 1.0.0" />
        </el-form-item>
        <el-form-item label="出版日期">
          <el-date-picker
            v-model="form.PublicationDate"
            type="date"
            placeholder="选择出版日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
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
const books = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  VersionID: '',
  BookID: '',
  VersionNumber: '',
  PublicationDate: ''
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/book-selection/versions')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取版本列表失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchBooks = async () => {
  try { const res = await api.get('/books'); books.value = res.data || res } catch {}
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { VersionID: '', BookID: '', VersionNumber: '', PublicationDate: '' })
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
      await api.put(`/book-selection/versions/${form.VersionID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/book-selection/versions', form)
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
    await api.delete(`/book-selection/versions/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

const handleToggle = async (row, field, val) => {
  try {
    await api.put(`/book-selection/versions/${row.VersionID}`, { [field]: val })
    row[field] = val
    ElMessage.success('更新成功')
  } catch {
    ElMessage.error('更新失败')
  }
}

onMounted(() => {
  fetchData()
  fetchBooks()
})
</script>

<style scoped>
.versions-container {
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