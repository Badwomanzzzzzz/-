<template>
  <div class="suppliers-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">供应商管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchKey"
              placeholder="搜索供应商名称"
              clearable
              :prefix-icon="Search"
              style="width: 240px; margin-right: 12px"
              @input="filterData"
            />
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增供应商</el-button>
          </div>
        </div>
      </template>

      <el-table :data="filteredData" v-loading="loading" border stripe empty-text="暂无供应商数据">
        <el-table-column prop="SupplierName" label="供应商名称" min-width="180" />
        <el-table-column prop="ContactPerson" label="联系人" width="120" />
        <el-table-column prop="ContactPhone" label="联系电话" width="140" />
        <el-table-column prop="Address" label="地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="Email" label="邮箱" width="200" />
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该供应商？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(row.SupplierID)">
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑供应商' : '新增供应商'" width="520px" destroy-on-close>
      <el-form :model="form" label-width="90px" label-position="right">
        <el-form-item label="供应商名称" required>
          <el-input v-model="form.SupplierName" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.ContactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.ContactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.Address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.Email" placeholder="请输入邮箱" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const searchKey = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filteredData = computed(() => {
  if (!searchKey.value) return tableData.value
  const q = searchKey.value.toLowerCase()
  return tableData.value.filter(item => item.SupplierName.toLowerCase().includes(q))
})

const form = reactive({
  SupplierID: '',
  SupplierName: '',
  ContactPerson: '',
  ContactPhone: '',
  Address: '',
  Email: ''
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/purchasing/suppliers')
    tableData.value = res.data || res
    total.value = res.total || (res.data ? res.data.length : res.length)
  } catch (e) {
    console.warn('获取供应商列表失败:', e)
  } finally {
    loading.value = false
  }
}

const filterData = () => {}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { SupplierID: '', SupplierName: '', ContactPerson: '', ContactPhone: '', Address: '', Email: '' })
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
      await api.put(`/purchasing/suppliers/${form.SupplierID}`, form)
      ElMessage.success('更新成功')
    } else {
      await api.post('/purchasing/suppliers', form)
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
    await api.delete(`/purchasing/suppliers/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.suppliers-container {
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
.header-actions {
  display: flex;
  align-items: center;
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