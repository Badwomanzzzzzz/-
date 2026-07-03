<template>
  <div class="reissue-container">
    <h3 class="section-title">补发登记</h3>
    
    <!-- 操作按钮 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="8">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Refresh /></el-icon>
          新增补发
        </el-button>
      </el-col>
    </el-row>
    
    <!-- 补发记录列表 -->
    <el-table
      :data="reissueRecords"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column prop="DistributionID" label="补发ID" width="80" />
      <el-table-column prop="StudentName" label="学生姓名" width="150" />
      <el-table-column prop="BookName" label="教材名称" width="200" />
      <el-table-column prop="ClassName" label="班级" width="120" />
      <el-table-column prop="DistributionDate" label="补发日期" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.DistributionDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="Status" label="状态" width="100" />
      <el-table-column prop="Notes" label="备注" min-width="200" />
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="reissueRecords.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 新增补发对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="新增补发"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="学生" prop="StudentID">
          <el-select v-model="form.StudentID" placeholder="请选择学生">
            <el-option
              v-for="student in students"
              :key="student.StudentID"
              :label="student.StudentName + ' (' + student.ClassName + ')'"
              :value="student.StudentID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教材" prop="BookID">
          <el-select v-model="form.BookID" placeholder="请选择教材">
            <el-option
              v-for="book in books"
              :key="book.BookID"
              :label="book.BookName"
              :value="book.BookID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="补发日期" prop="DistributionDate">
          <el-date-picker
            v-model="form.DistributionDate"
            type="date"
            placeholder="选择补发日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="Notes">
          <el-input
            v-model="form.Notes"
            type="textarea"
            rows="3"
            placeholder="请输入补发原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '../../../services/api';

const currentPage = ref(1);
const pageSize = ref(10);
const reissueRecords = ref([]);
const students = ref([]);
const books = ref([]);
const showAddDialog = ref(false);
const formRef = ref(null);

const form = ref({
  StudentID: '',
  BookID: '',
  DistributionDate: new Date(),
  Status: '已发放',
  IsReissue: true,
  IsProxy: false,
  Notes: ''
});

const rules = {
  StudentID: [{ required: true, message: '请选择学生', trigger: 'blur' }],
  BookID: [{ required: true, message: '请选择教材', trigger: 'blur' }],
  DistributionDate: [{ required: true, message: '请选择补发日期', trigger: 'blur' }],
  Notes: [{ required: true, message: '请输入补发原因', trigger: 'blur' }]
};

// 加载补发记录
const loadReissueRecords = async () => {
  try {
    const response = await api.get('/distribution');
    reissueRecords.value = response.filter(record => record.IsReissue);
  } catch (error) {
    console.error('加载补发记录失败:', error);
  }
};

// 加载学生列表
const loadStudents = async () => {
  try {
    const response = await api.get('/basic-info/students');
    students.value = response;
  } catch (error) {
    console.error('加载学生失败:', error);
  }
};

// 加载教材列表
const loadBooks = async () => {
  try {
    const response = await api.get('/books');
    books.value = response;
  } catch (error) {
    console.error('加载教材失败:', error);
  }
};

// 初始化
onMounted(async () => {
  await loadReissueRecords();
  await loadStudents();
  await loadBooks();
});

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 准备提交的数据，将 Date 对象转换为字符串
        const submitData = {
          ...form.value,
          DistributionDate: form.value.DistributionDate.toISOString()
        };
        
        await api.post('/distribution', submitData);
        ElMessage.success('新增补发成功');
        showAddDialog.value = false;
        // 重置表单
        form.value = {
          StudentID: '',
          BookID: '',
          DistributionDate: new Date(),
          Status: '已发放',
          IsReissue: true,
          IsProxy: false,
          Notes: ''
        };
        await loadReissueRecords();
      } catch (error) {
        console.error('操作失败:', error);
        ElMessage.error('操作失败');
      }
    }
  });
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
};

const handleCurrentChange = (current) => {
  currentPage.value = current;
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};
</script>

<style scoped>
.reissue-container {
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  text-align: right;
}
</style>