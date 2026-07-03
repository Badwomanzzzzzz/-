<template>
  <div class="inbound-container">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">入库登记</span>
      </template>

      <el-form :model="form" label-width="90px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教材" required>
              <el-select v-model="form.BookID" placeholder="请选择教材" filterable style="width: 100%">
                <el-option v-for="b in books" :key="b.BookID" :label="b.BookName" :value="b.BookID" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库" required>
              <el-select v-model="form.WarehouseID" placeholder="请选择仓库" filterable style="width: 100%">
                <el-option v-for="w in warehouses" :key="w.WarehouseID" :label="w.WarehouseName" :value="w.WarehouseID" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库数量" required>
              <el-input-number v-model="form.Quantity" :min="1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库日期">
              <el-date-picker v-model="form.InboundDate" type="date" placeholder="选择日期（默认今天）" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.Notes" type="textarea" :rows="2" placeholder="可选备注信息" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" :icon="Upload" :loading="submitting" @click="handleSubmit">提交入库</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span class="card-title">近期入库记录</span>
          <el-button size="small" :icon="RefreshRight" @click="fetchRecords">刷新</el-button>
        </div>
      </template>

      <el-table :data="records" v-loading="recordsLoading" stripe empty-text="暂无入库记录">
        <el-table-column prop="BookName" label="教材" min-width="180" />
        <el-table-column prop="WarehouseName" label="仓库" width="150" />
        <el-table-column prop="Quantity" label="数量" width="100" align="center" />
        <el-table-column prop="InboundDate" label="入库日期" width="140">
          <template #default="{ row }">
            {{ row.InboundDate ? row.InboundDate.toString().slice(0, 10) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="Notes" label="备注" min-width="150" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Upload, RefreshRight } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage } from 'element-plus'

const books = ref([])
const warehouses = ref([])
const records = ref([])
const recordsLoading = ref(false)
const submitting = ref(false)

const form = reactive({
  BookID: null,
  WarehouseID: null,
  Quantity: 1,
  InboundDate: '',
  Notes: ''
})

const fetchBooks = async () => {
  try { const res = await api.get('/books'); books.value = Array.isArray(res) ? res : [] } catch {}
}

const fetchWarehouses = async () => {
  try { const res = await api.get('/inventory/warehouses'); warehouses.value = Array.isArray(res) ? res : [] } catch {}
}

const fetchRecords = async () => {
  recordsLoading.value = true
  try {
    const res = await api.get('/inventory/inbound')
    records.value = (Array.isArray(res) ? res : []).slice(0, 20)
  } catch {} finally {
    recordsLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.BookID || !form.WarehouseID || !form.Quantity) {
    ElMessage.warning('请填写必要信息')
    return
  }
  submitting.value = true
  try {
    await api.post('/inventory/inbound', {
      BookID: form.BookID,
      WarehouseID: form.WarehouseID,
      Quantity: form.Quantity,
      InboundDate: form.InboundDate || null,
      Notes: form.Notes || ''
    })
    ElMessage.success('入库成功')
    handleReset()
    fetchRecords()
  } catch {
    ElMessage.error('入库失败')
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  form.BookID = null
  form.WarehouseID = null
  form.Quantity = 1
  form.InboundDate = ''
  form.Notes = ''
}

onMounted(() => {
  fetchBooks()
  fetchWarehouses()
  fetchRecords()
})
</script>

<style scoped>
.inbound-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; }
</style>