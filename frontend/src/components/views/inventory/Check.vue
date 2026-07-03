<template>
  <div class="check-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">库存盘点</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增盘点</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe empty-text="暂无盘点记录">
        <el-table-column prop="WarehouseName" label="仓库" width="150" />
        <el-table-column label="盘点日期" width="140">
          <template #default="{ row }">
            {{ row.CheckDate ? row.CheckDate.toString().slice(0, 10) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.CheckStatus === 'Completed' ? 'success' : 'warning'" size="small">
              {{ row.CheckStatus === 'Completed' ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CheckedByName" label="创建人" width="120" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" :icon="View" @click="handleDetail(row)">查看详情</el-button>
            <el-button
              v-if="row.CheckStatus === 'Pending'"
              size="small"
              type="success"
              :icon="CircleCheck"
              @click="handleComplete(row)"
            >
              完成盘点
            </el-button>
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
        />
      </div>
    </el-card>

    <el-dialog v-model="addVisible" title="新增盘点" width="450px" destroy-on-close>
      <el-form :model="addForm" label-width="80px" label-position="right">
        <el-form-item label="仓库" required>
          <el-select v-model="addForm.WarehouseID" placeholder="请选择仓库" filterable style="width: 100%">
            <el-option v-for="w in warehouses" :key="w.WarehouseID" :label="w.WarehouseName" :value="w.WarehouseID" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.Notes" type="textarea" :rows="2" placeholder="可选备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreateCheck">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="盘点详情" width="750px" destroy-on-close>
      <el-table :data="detailData" v-loading="detailLoading" stripe empty-text="暂无盘点明细">
        <el-table-column prop="BookName" label="教材" min-width="180" />
        <el-table-column prop="SystemQuantity" label="系统数量" width="100" align="center" />
        <el-table-column prop="ActualQuantity" label="实际数量" width="140" align="center">
          <template #default="{ row }">
            <el-input-number
              v-if="!detailIsCompleted"
              v-model="row.ActualQuantity"
              :min="0"
              size="small"
              controls-position="right"
            />
            <span v-else>{{ row.ActualQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="差异" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              v-if="row.ActualQuantity !== row.SystemQuantity"
              :type="row.ActualQuantity > row.SystemQuantity ? 'success' : 'danger'"
              size="small"
            >
              {{ row.ActualQuantity > row.SystemQuantity ? '+' : '' }}{{ row.ActualQuantity - row.SystemQuantity }}
            </el-tag>
            <el-tag v-else type="success" size="small">一致</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, View, CircleCheck } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const warehouses = ref([])
const detailData = ref([])
const detailIsCompleted = ref(true)
const loading = ref(false)
const detailLoading = ref(false)
const addVisible = ref(false)
const detailVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const addForm = reactive({ WarehouseID: '', Notes: '' })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await api.get('/inventory/checks')
    tableData.value = Array.isArray(res) ? res : []
    total.value = tableData.value.length
  } catch (e) {
    console.warn('获取盘点列表失败:', e)
  } finally {
    loading.value = false
  }
}

const fetchWarehouses = async () => {
  try {
    const res = await api.get('/inventory/warehouses')
    warehouses.value = Array.isArray(res) ? res : []
  } catch {}
}

const handleAdd = () => {
  addForm.WarehouseID = ''
  addForm.Notes = ''
  addVisible.value = true
}

const handleCreateCheck = async () => {
  if (!addForm.WarehouseID) {
    ElMessage.warning('请选择仓库')
    return
  }
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    await api.post('/inventory/checks', {
      WarehouseID: addForm.WarehouseID,
      CheckedBy: user.UserID || user.id || 1,
      Notes: addForm.Notes || ''
    })
    ElMessage.success('盘点创建成功')
    addVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('创建盘点失败')
  }
}

const handleDetail = async (row) => {
  detailVisible.value = true
  detailIsCompleted.value = row.CheckStatus === 'Completed'
  detailLoading.value = true
  try {
    const res = await api.get(`/inventory/checks/${row.CheckID}`)
    detailData.value = Array.isArray(res?.Items) ? res.Items : (Array.isArray(res) ? res : [])
  } catch (e) {
    console.warn('获取盘点详情失败:', e)
  } finally {
    detailLoading.value = false
  }
}

const handleComplete = async (row) => {
  try {
    await ElMessageBox.confirm('确认完成该盘点？完成后将无法修改。', '完成盘点', {
      confirmButtonText: '确认完成', cancelButtonText: '取消', type: 'success'
    })
    await api.put('/inventory/checks/complete', { CheckID: row.CheckID })
    ElMessage.success('盘点已完成')
    fetchData()
  } catch (e) {
    if (e !== 'cancel' && String(e) !== 'cancel') {
      ElMessage.error('完成盘点失败')
    }
  }
}

onMounted(() => {
  fetchData()
  fetchWarehouses()
})
</script>

<style scoped>
.check-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; }
.pagination-wrapper { margin-top: 16px; display: flex; justify-content: flex-end; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 8px; }
</style>