<template>
  <div class="financial-container">
    <h3 class="section-title">财务对账</h3>
    
    <!-- 对账表单 -->
    <el-card class="financial-card">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="学期" prop="SemesterID">
          <el-select v-model="form.SemesterID" placeholder="请选择学期">
            <el-option
              v-for="semester in semesters"
              :key="semester.SemesterID"
              :label="semester.SemesterName"
              :value="semester.SemesterID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="ClassID">
          <el-select v-model="form.ClassID" placeholder="请选择班级（可选）">
            <el-option label="全部班级" value="" />
            <el-option
              v-for="classItem in classes"
              :key="classItem.ClassID"
              :label="classItem.ClassName"
              :value="classItem.ClassID"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleReconcile">开始对账</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 对账结果 -->
    <el-card v-if="reconcileResult" class="result-card">
      <template #header>
        <div class="card-header">
          <span>对账结果</span>
          <el-button type="primary" @click="exportReport">导出报表</el-button>
        </div>
      </template>
      <div class="result-content">
        <p>学期：{{ selectedSemester?.SemesterName }}</p>
        <p>班级：{{ selectedClass?.ClassName || '全部班级' }}</p>
        <p>总学生数：{{ reconcileResult.totalStudents }}</p>
        <p>已缴费学生数：{{ reconcileResult.paidStudents }}</p>
        <p>未缴费学生数：{{ reconcileResult.unpaidStudents }}</p>
        <p>总应收费用：¥{{ reconcileResult.totalAmount.toFixed(2) }}</p>
        <p>已收费用：¥{{ reconcileResult.paidAmount.toFixed(2) }}</p>
        <p>未收费用：¥{{ reconcileResult.unpaidAmount.toFixed(2) }}</p>
      </div>
    </el-card>
    
    <!-- 未缴费学生列表 -->
    <el-card v-if="reconcileResult && reconcileResult.unpaidStudents > 0" class="unpaid-card">
      <template #header>
        <div class="card-header">
          <span>未缴费学生列表</span>
        </div>
      </template>
      <el-table
        :data="reconcileResult.unpaidStudentsList"
        style="width: 100%"
        border
      >
        <el-table-column prop="StudentID" label="学生ID" width="80" />
        <el-table-column prop="StudentName" label="学生姓名" width="150" />
        <el-table-column prop="ClassName" label="班级" width="120" />
        <el-table-column prop="Amount" label="应缴金额" width="100">
          <template #default="scope">
            ¥{{ scope.row.Amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="状态" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '../../../services/api';

const form = ref({
  SemesterID: '',
  ClassID: ''
});

const rules = {
  SemesterID: [{ required: true, message: '请选择学期', trigger: 'blur' }]
};

const formRef = ref(null);
const semesters = ref([]);
const classes = ref([]);
const reconcileResult = ref(null);

// 加载学期列表
const loadSemesters = async () => {
  try {
    const response = await api.get('/basic-info/semesters');
    semesters.value = response;
  } catch (error) {
    console.error('加载学期失败:', error);
  }
};

// 加载班级列表
const loadClasses = async () => {
  try {
    const response = await api.get('/basic-info/classes');
    classes.value = response;
  } catch (error) {
    console.error('加载班级失败:', error);
  }
};

// 初始化
onMounted(async () => {
  await loadSemesters();
  await loadClasses();
});

// 计算选中的学期
const selectedSemester = computed(() => {
  return semesters.value.find(semester => semester.SemesterID === form.value.SemesterID);
});

// 计算选中的班级
const selectedClass = computed(() => {
  if (!form.value.ClassID) return null;
  return classes.value.find(classItem => classItem.ClassID === form.value.ClassID);
});

// 处理对账
const handleReconcile = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 这里应该调用对账API
        // 暂时使用模拟数据
        reconcileResult.value = {
          totalStudents: 50,
          paidStudents: 45,
          unpaidStudents: 5,
          totalAmount: 25000,
          paidAmount: 22500,
          unpaidAmount: 2500,
          unpaidStudentsList: [
            {
              StudentID: 1,
              StudentName: '张三',
              ClassName: '计算机1班',
              Amount: 500,
              Status: '待缴费'
            },
            {
              StudentID: 2,
              StudentName: '李四',
              ClassName: '计算机1班',
              Amount: 500,
              Status: '待缴费'
            },
            {
              StudentID: 3,
              StudentName: '王五',
              ClassName: '计算机2班',
              Amount: 500,
              Status: '待缴费'
            },
            {
              StudentID: 4,
              StudentName: '赵六',
              ClassName: '计算机2班',
              Amount: 500,
              Status: '待缴费'
            },
            {
              StudentID: 5,
              StudentName: '钱七',
              ClassName: '计算机3班',
              Amount: 500,
              Status: '待缴费'
            }
          ]
        };
        
        ElMessage.success('对账成功');
      } catch (error) {
        console.error('对账失败:', error);
        ElMessage.error('对账失败');
      }
    }
  });
};

// 导出报表
const exportReport = async () => {
  try {
    // 这里应该调用导出API
    ElMessage.success('报表导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
};
</script>

<style scoped>
.financial-container {
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.financial-card {
  margin-bottom: 20px;
}

.result-card {
  margin-top: 20px;
}

.unpaid-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-content {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.result-content p {
  margin: 10px 0;
  font-size: 16px;
  color: #333;
}
</style>