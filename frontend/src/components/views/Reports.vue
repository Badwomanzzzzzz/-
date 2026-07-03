<template>
  <div class="reports-container" v-loading="pageLoading">
    <!-- 仪表盘卡片 -->
    <el-row :gutter="20" class="summary-row">
      <el-col :span="6" v-for="stat in statCards" :key="stat.label">
        <div class="report-stat-card" :style="{ '--card-accent': stat.color }">
          <div class="rsc-icon" :style="{ backgroundColor: stat.bg }">
            <el-icon :size="22" :color="stat.color"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="rsc-content">
            <div class="rsc-value">{{ stat.value }}<span class="rsc-unit">{{ stat.unit }}</span></div>
            <div class="rsc-label">{{ stat.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 标签页报表 -->
    <el-card shadow="never" class="report-card">
      <template #header>
        <div class="report-header">
          <span class="report-title">数据统计报表</span>
          <div class="report-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索..."
              :prefix-icon="Search"
              clearable
              size="default"
              style="width: 220px;"
              class="report-search"
            />
            <el-button type="primary" :icon="Download" size="default" @click="exportData">
              导出数据
            </el-button>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="report-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="教材使用统计" name="usage">
          <template #label>
            <span class="tab-label"><el-icon><Document /></el-icon> 教材使用统计</span>
          </template>
          <el-table :data="filteredData" stripe v-loading="loading" empty-text="暂无数据" class="modern-table">
            <el-table-column prop="BookName" label="教材名称" min-width="180" show-overflow-tooltip>
              <template #default="{ row }">
                <span v-html="highlightText(row.BookName)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="ISBN" label="ISBN" width="160" />
            <el-table-column prop="PublisherName" label="出版社" width="150" />
            <el-table-column prop="TypeName" label="类型" width="100" />
            <el-table-column prop="Stock" label="当前库存" width="100" sortable>
              <template #default="{ row }">
                <el-tag :type="row.Stock < 10 ? 'danger' : row.Stock < 30 ? 'warning' : 'success'" effect="light">
                  {{ row.Stock }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="Purchased" label="采购数量" width="100" sortable />
            <el-table-column prop="DistTotal" label="发放数量" width="100" sortable />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="班级领用统计" name="distribution">
          <template #label>
            <span class="tab-label"><el-icon><Van /></el-icon> 班级领用统计</span>
          </template>
          <el-table :data="filteredData" stripe v-loading="loading" empty-text="暂无数据" class="modern-table">
            <el-table-column prop="ClassName" label="班级" width="160">
              <template #default="{ row }">
                <span v-html="highlightText(row.ClassName)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="MajorName" label="专业" width="160" />
            <el-table-column prop="GradeName" label="年级" width="100" />
            <el-table-column prop="TotalDistributed" label="领用总数" width="120" sortable>
              <template #default="{ row }">
                <span class="number-highlight">{{ row.TotalDistributed }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StudentCount" label="学生数" width="100" sortable />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="教材费统计" name="fees">
          <template #label>
            <span class="tab-label"><el-icon><Money /></el-icon> 教材费统计</span>
          </template>
          <el-table :data="filteredData" stripe v-loading="loading" empty-text="暂无数据" class="modern-table">
            <el-table-column prop="SemesterName" label="学期" width="160" />
            <el-table-column prop="TotalAmount" label="总金额" width="130" sortable>
              <template #default="{ row }">
                <span class="number-highlight">¥{{ row.TotalAmount?.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="PaidAmount" label="已缴金额" width="130" sortable>
              <template #default="{ row }">
                <span style="color: #10b981; font-weight: 600;">¥{{ row.PaidAmount?.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="UnpaidAmount" label="未缴金额" width="130" sortable>
              <template #default="{ row }">
                <span style="color: #ef4444; font-weight: 600;">¥{{ row.UnpaidAmount?.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StudentCount" label="学生数" width="100" sortable />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="采购统计" name="purchasing">
          <template #label>
            <span class="tab-label"><el-icon><ShoppingCart /></el-icon> 采购统计</span>
          </template>
          <el-table :data="filteredData" stripe v-loading="loading" empty-text="暂无数据" class="modern-table">
            <el-table-column prop="SupplierName" label="供应商" min-width="160">
              <template #default="{ row }">
                <span v-html="highlightText(row.SupplierName)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="OrderCount" label="采购单数" width="100" sortable />
            <el-table-column prop="TotalAmount" label="总金额" width="130" sortable>
              <template #default="{ row }">
                <span class="number-highlight">¥{{ row.TotalAmount?.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="TotalQuantity" label="总数量" width="100" sortable />
            <el-table-column prop="CompletedCount" label="已完成" width="100" sortable>
              <template #default="{ row }">
                <el-tag :type="row.CompletedCount === row.OrderCount ? 'success' : 'warning'" effect="light" size="small">
                  {{ row.CompletedCount }}/{{ row.OrderCount }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="库存统计" name="inventory">
          <template #label>
            <span class="tab-label"><el-icon><Box /></el-icon> 库存统计</span>
          </template>
          <el-table :data="filteredData" stripe v-loading="loading" empty-text="暂无数据" class="modern-table">
            <el-table-column prop="WarehouseName" label="仓库" width="160">
              <template #default="{ row }">
                <span v-html="highlightText(row.WarehouseName)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="BookCount" label="教材种类" width="120" sortable />
            <el-table-column prop="TotalStock" label="库存总量" width="120" sortable>
              <template #default="{ row }">
                <span class="number-highlight">{{ row.TotalStock }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="LowStockCount" label="低库存预警" width="130" sortable>
              <template #default="{ row }">
                <el-tag v-if="row.LowStockCount > 0" type="danger" effect="light" size="small">
                  {{ row.LowStockCount }} 项
                </el-tag>
                <el-tag v-else type="success" effect="light" size="small">正常</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Van, Money, ShoppingCart, Box, Search, Download } from '@element-plus/icons-vue'
import api from '../../services/api'

const pageLoading = ref(false)
const loading = ref(false)
const activeTab = ref('usage')
const searchKeyword = ref('')
const dashboard = ref({ bookCount: 0, studentCount: 0, inventoryTotal: 0, pendingOrders: 0 })
const tableData = ref([])

const statCards = computed(() => [
  { label: '教材总数', value: dashboard.value.bookCount, unit: '本', icon: Document, color: '#4a6cf7', bg: 'rgba(74,108,247,0.1)' },
  { label: '学生总数', value: dashboard.value.studentCount, unit: '人', icon: Van, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { label: '库存总量', value: dashboard.value.inventoryTotal, unit: '册', icon: Box, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { label: '待处理采购单', value: dashboard.value.pendingOrders, unit: '单', icon: ShoppingCart, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
])

const filteredData = computed(() => {
  if (!searchKeyword.value) return tableData.value
  const keyword = searchKeyword.value.toLowerCase()
  return tableData.value.filter(row => {
    return Object.values(row).some(val =>
      val !== null && val !== undefined && String(val).toLowerCase().includes(keyword)
    )
  })
})

const apiMap = {
  usage: '/reports/usage',
  distribution: '/reports/distribution',
  fees: '/reports/fees',
  purchasing: '/reports/purchasing',
  inventory: '/reports/inventory',
}

const fetchDashboard = async () => {
  try {
    const res = await api.get('/reports/dashboard')
    dashboard.value = res
  } catch (e) { console.error(e) }
}

const fetchTableData = async () => {
  loading.value = true
  try {
    const url = apiMap[activeTab.value]
    if (url) {
      const res = await api.get(url)
      tableData.value = Array.isArray(res) ? res : []
    }
  } catch (e) {
    console.warn('加载数据失败:', e)
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  searchKeyword.value = ''
  fetchTableData()
}

const highlightText = (text) => {
  if (!text || !searchKeyword.value) return text
  const regex = new RegExp(`(${searchKeyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return String(text).replace(regex, '<span class="search-highlight">$1</span>')
}

const exportData = () => {
  if (!tableData.value.length) {
    ElMessage.warning('没有数据可导出')
    return
  }
  const jsonStr = JSON.stringify(tableData.value, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `report_${activeTab.value}_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

onMounted(async () => {
  pageLoading.value = true
  await fetchDashboard()
  await fetchTableData()
  pageLoading.value = false
})
</script>

<style scoped>
.reports-container {
  padding: 0;
}

.summary-row {
  margin-bottom: 20px;
}

.report-stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.report-stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--card-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.report-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.report-stat-card:hover::after {
  transform: scaleX(1);
}

.rsc-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rsc-content {
  flex: 1;
}

.rsc-value {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
}

.rsc-unit {
  font-size: 12px;
  color: #94a3b8;
  margin-left: 4px;
  font-weight: 500;
}

.rsc-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  font-weight: 500;
}

.report-card {
  border-radius: 16px !important;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.report-title {
  font-weight: 600;
  font-size: 15px;
}

.report-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.number-highlight {
  font-weight: 700;
  color: #1e293b;
}

.modern-table {
  border-radius: 12px;
  overflow: hidden;
}
</style>