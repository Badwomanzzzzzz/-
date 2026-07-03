<template>
  <div class="settle-container">
    <el-card shadow="never">
      <template #header>
        <span class="card-title">费用结算</span>
      </template>

      <el-form :model="form" label-width="80px" label-position="right">
        <el-row :gutter="16" align="middle">
          <el-col :span="8">
            <el-form-item label="选择学期">
              <el-select v-model="form.SemesterID" placeholder="请选择学期" filterable style="width: 100%">
                <el-option v-for="s in semesters" :key="s.SemesterID" :label="s.SemesterName" :value="s.SemesterID" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" :icon="Finished" :loading="settling" @click="handleSettle">按学期结算</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 20px" v-if="result">
      <template #header>
        <span class="card-title">结算结果</span>
      </template>
      <el-descriptions :column="3" border size="large">
        <el-descriptions-item label="学期">
          <el-tag type="primary">{{ result.SemesterName }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="学生总数">{{ result.TotalStudents }}</el-descriptions-item>
        <el-descriptions-item label="已缴费人数">
          <span style="color: #67c23a; font-weight: 600">{{ result.PaidStudents }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="应收总额">
          <span style="font-weight: 600; color: #409eff">{{ formatPrice(result.TotalAmount) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="已收总额">
          <span style="font-weight: 600; color: #67c23a">{{ formatPrice(result.PaidAmount) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="未收总额">
          <span style="font-weight: 600; color: #f56c6c">{{ formatPrice(result.UnpaidAmount) }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Finished } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { ElMessage } from 'element-plus'

const semesters = ref([])
const settling = ref(false)
const result = ref(null)

const form = reactive({
  SemesterID: ''
})

const formatPrice = (val) => {
  if (val == null) return '¥0.00'
  return '¥' + Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchSemesters = async () => { try { const res = await api.get('/basic-info/semesters'); semesters.value = res.data || res } catch {} }

const handleSettle = async () => {
  if (!form.SemesterID) {
    ElMessage.warning('请选择学期')
    return
  }
  settling.value = true
  try {
    const res = await api.post('/fee/settle', { SemesterID: form.SemesterID })
    result.value = res.data || res
    ElMessage.success('结算完成')
  } catch {
    ElMessage.error('结算失败')
  } finally {
    settling.value = false
  }
}

fetchSemesters()
</script>

<style scoped>
.settle-container {
  padding: 20px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
}
</style>