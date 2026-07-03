<template>
  <div class="books-container" v-loading="pageLoading">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-icon class="header-icon"><Notebook /></el-icon>
            <span class="header-title">教材管理</span>
          </div>
          <div class="header-right">
            <el-input
              v-model="searchQuery"
              placeholder="搜索教材名称或ISBN"
              clearable
              :prefix-icon="Search"
              class="header-search"
              @input="handleSearch"
            />
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              添加教材
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="pagedBooks" v-loading="tableLoading" empty-text="暂无数据">
        <el-table-column prop="BookID" label="ID" width="60" align="center" />
        <el-table-column label="教材名称" min-width="180">
          <template #default="{ row }">
            <span v-html="highlightText(row.BookName, searchQuery)"></span>
          </template>
        </el-table-column>
        <el-table-column label="ISBN" width="150">
          <template #default="{ row }">
            <span v-html="highlightText(row.ISBN, searchQuery)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="Author" label="作者" width="120" />
        <el-table-column prop="PublisherName" label="出版社" min-width="140" />
        <el-table-column prop="TypeName" label="类型" width="100" />
        <el-table-column label="价格" width="100" align="right">
          <template #default="{ row }">
            <span class="price-cell">¥{{ formatPrice(row.Price) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除该教材吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(row.BookID)"
            >
              <template #reference>
                <el-button type="danger" link size="small">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredBooks.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加教材' : '编辑教材'"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="教材名称" prop="BookName">
          <el-input v-model="form.BookName" placeholder="请输入教材名称" clearable />
        </el-form-item>
        <el-form-item label="ISBN" prop="ISBN">
          <el-input v-model="form.ISBN" placeholder="格式：ISBN开头后跟10位数字" clearable />
        </el-form-item>
        <el-form-item label="作者" prop="Author">
          <el-input v-model="form.Author" placeholder="请输入作者" clearable />
        </el-form-item>
        <el-form-item label="出版社" prop="PublisherID">
          <el-select v-model="form.PublisherID" placeholder="请选择出版社" clearable style="width: 100%;">
            <el-option
              v-for="item in publishers"
              :key="item.PublisherID"
              :label="item.PublisherName"
              :value="item.PublisherID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="TypeID">
          <el-select v-model="form.TypeID" placeholder="请选择类型" clearable style="width: 100%;">
            <el-option
              v-for="item in bookTypes"
              :key="item.TypeID"
              :label="item.TypeName"
              :value="item.TypeID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="Price">
          <el-input-number
            v-model="form.Price"
            :min="0"
            :precision="2"
            placeholder="请输入价格"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="版次" prop="Edition">
          <el-input v-model="form.Edition" placeholder="如：第1版" clearable />
        </el-form-item>
        <el-form-item label="适用专业" prop="MajorID">
          <el-select v-model="form.MajorID" placeholder="请选择适用专业" clearable style="width: 100%;">
            <el-option
              v-for="item in majors"
              :key="item.MajorID"
              :label="item.MajorName"
              :value="item.MajorID"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ dialogType === 'add' ? '添加' : '保存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search, Edit, Delete, Notebook } from '@element-plus/icons-vue'
import api from '../../services/api'

const pageLoading = ref(false)
const tableLoading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const books = ref([])
const publishers = ref([])
const bookTypes = ref([])
const majors = ref([])

const form = reactive({
  BookID: null,
  BookName: '',
  ISBN: '',
  Author: '',
  PublisherID: '',
  TypeID: '',
  Price: 0,
  Edition: '',
  MajorID: ''
})

const rules = {
  BookName: [{ required: true, message: '请输入教材名称', trigger: 'blur' }],
  ISBN: [
    { required: true, message: '请输入ISBN', trigger: 'blur' },
    { pattern: /^ISBN\d{10}$/, message: 'ISBN格式错误，应为ISBN开头后跟10位数字', trigger: 'blur' }
  ],
  Author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  PublisherID: [{ required: true, message: '请选择出版社', trigger: 'change' }],
  TypeID: [{ required: true, message: '请选择类型', trigger: 'change' }],
  Price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value
  const q = searchQuery.value.toLowerCase()
  return books.value.filter(book =>
    String(book.BookName).toLowerCase().includes(q) ||
    String(book.ISBN).toLowerCase().includes(q)
  )
})

const pagedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredBooks.value.slice(start, start + pageSize.value)
})

const formatPrice = (price) => {
  const num = Number(price)
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

const highlightText = (text, query) => {
  if (!query || !text) return text
  const str = String(text)
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${q})`, 'gi')
  return str.replace(regex, '<span class="search-highlight">$1</span>')
}

const fetchBooks = async () => {
  tableLoading.value = true
  try {
    const res = await api.get('/books')
    books.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.warn('加载教材列表失败:', error)
  } finally {
    tableLoading.value = false
  }
}

const fetchPublishers = async () => {
  try {
    const res = await api.get('/basic-info/publishers')
    publishers.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('加载出版社失败:', error)
  }
}

const fetchBookTypes = async () => {
  try {
    const res = await api.get('/basic-info/booktypes')
    bookTypes.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('加载教材类型失败:', error)
  }
}

const fetchMajors = async () => {
  try {
    const res = await api.get('/basic-info/majors')
    majors.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('加载专业失败:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.BookID = null
  form.BookName = ''
  form.ISBN = ''
  form.Author = ''
  form.PublisherID = ''
  form.TypeID = ''
  form.Price = 0
  form.Edition = ''
  form.MajorID = ''
  formRef.value?.resetFields()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.BookID = row.BookID
  form.BookName = row.BookName
  form.ISBN = row.ISBN
  form.Author = row.Author
  form.PublisherID = row.PublisherID
  form.TypeID = row.TypeID
  form.Price = row.Price
  form.Edition = row.Edition || ''
  form.MajorID = row.MajorID || ''
  dialogVisible.value = true
}

const handleDelete = async (id) => {
  try {
    await api.delete(`/books/${id}`)
    ElMessage.success('删除成功')
    await fetchBooks()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    const payload = {
      BookName: form.BookName,
      ISBN: form.ISBN,
      Author: form.Author,
      PublisherID: form.PublisherID,
      TypeID: form.TypeID,
      Price: form.Price,
      Edition: form.Edition,
      MajorID: form.MajorID || null
    }
    if (dialogType.value === 'add') {
      await api.post('/books', payload)
      ElMessage.success('添加成功')
    } else {
      await api.put(`/books/${form.BookID}`, payload)
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    await fetchBooks()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  await Promise.all([fetchBooks(), fetchPublishers(), fetchBookTypes(), fetchMajors()])
  pageLoading.value = false
})
</script>

<style scoped>
.books-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 20px;
  color: #4a6cf7;
}

.header-title {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-search {
  width: 260px;
}

.price-cell {
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-weight: 500;
  color: #e74c3c;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}
</style>