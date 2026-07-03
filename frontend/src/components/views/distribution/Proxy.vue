<template>
  <div class="proxy-container">
    <h3 class="section-title">代领登记</h3>
    
    <!-- 操作按钮 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="8">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><UserFilled /></el-icon>
          新增代领
        </el-button>
      </el-col>
    </el-row>
    
    <!-- 代领记录列表 -->
    <el-table
      :data="proxyRecords"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column prop="DistributionID" label="代领ID" width="80" />
      <el-table-column prop="StudentName" label="学生姓名" width="150" />
      <el-table-column prop="BookName" label="教材名称" width="200" />
      <el-table-column prop="ClassName" label="班级" width="120" />
      <el-table-column prop="DistributionDate" label="代领日期" width="180">
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
        :total="proxyRecords.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 新增代领对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="新增代领"
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
        <el-form-item label="代领日期" prop="DistributionDate">
          <el-date-picker
            v-model="form.DistributionDate"
            type="date"
            placeholder="选择代领日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="代领人" prop="ProxyName">
          <el-input v-model="form.ProxyName" placeholder="请输入代领人姓名" />
        </el-form-item>
        <el-form-item label="备注" prop="Notes">
          <el-input
            v-model="form.Notes"
            type="textarea"
            rows="3"
            placeholder="请输入代领原因"
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
import { UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import api from '../../../services/api';

const currentPage = ref(1);
const pageSize = ref(10);
const proxyRecords = ref([]);
const students = ref([]);
const books = ref([]);
const showAddDialog = ref(false);
const formRef = ref(null);

const form = ref({
  StudentID: '',
  BookID: '',
  DistributionDate: new Date(),
  Status: '已发放',
  IsReissue: false,
  IsProxy: true,
  ProxyName: '',
  Notes: ''
});

const rules = {
  StudentID: [{ required: true, message: '请选择学生', trigger: 'blur' }],
  BookID: [{ required: true, message: '请选择教材', trigger: 'blur' }],
  DistributionDate: [{ required: true, message: '请选择代领日期', trigger: 'blur' }],
  ProxyName: [{ required: true, message: '请输入代领人姓名', trigger: 'blur' }],
  Notes: [{ required: true, message: '请输入代领原因', trigger: 'blur' }]
};

// 加载代领记录
const loadProxyRecords = async () => {
  try {
    const response = await api.get('/distribution');
    proxyRecords.value = response.filter(record => record.IsProxy);
  } catch (error) {
    console.error('加载代领记录失败:', error);
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
  await loadProxyRecords();
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
        ElMessage.success('新增代领成功');
        showAddDialog.value = false;
        // 重置表单
        form.value = {
          StudentID: '',
          BookID: '',
          DistributionDate: new Date(),
          Status: '已发放',
          IsReissue: false,
          IsProxy: true,
          ProxyName: '',
          Notes: ''
        };
        await loadProxyRecords();
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
.proxy-container {
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