<template>
  <div class="students-container">
    <div class="page-header">
      <h2>学生管理</h2>
    </div>
    
    <div class="students-card">
      <div class="card-header">
        <span>学生列表</span>
        <button class="add-button" @click="dialogVisible = true">
          添加学生
        </button>
      </div>
      
      <table class="students-table">
        <thead>
          <tr>
            <th>学生ID</th>
            <th>学生姓名</th>
            <th>学号</th>
            <th>班级</th>
            <th>性别</th>
            <th>电话</th>
            <th>邮箱</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.StudentID">
            <td>{{ student.StudentID }}</td>
            <td>{{ student.StudentName }}</td>
            <td>{{ student.StudentCode }}</td>
            <td>{{ student.ClassName }}</td>
            <td>{{ student.Gender }}</td>
            <td>{{ student.Phone }}</td>
            <td>{{ student.Email }}</td>
            <td>{{ student.CreatedAt }}</td>
            <td>
              <button class="edit-button" @click="handleEdit(student)">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 添加/编辑学生对话框 -->
    <div class="dialog" v-if="dialogVisible">
      <div class="dialog-overlay" @click="dialogVisible = false"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ dialogType === 'add' ? '添加学生' : '编辑学生' }}</h3>
          <button class="dialog-close" @click="dialogVisible = false">×</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-item">
              <label for="StudentName">学生姓名</label>
              <input 
                type="text" 
                id="StudentName" 
                v-model="form.StudentName" 
                placeholder="请输入学生姓名"
                required
              >
            </div>
            <div class="form-item">
              <label for="StudentCode">学号</label>
              <input 
                type="text" 
                id="StudentCode" 
                v-model="form.StudentCode" 
                placeholder="请输入学号"
                required
              >
            </div>
            <div class="form-item">
              <label for="ClassID">班级</label>
              <select 
                id="ClassID" 
                v-model="form.ClassID" 
                required
              >
                <option value="" disabled>请选择班级</option>
                <option 
                  v-for="cls in classes" 
                  :key="cls.ClassID" 
                  :value="cls.ClassID"
                >
                  {{ cls.ClassName }}
                </option>
              </select>
            </div>
            <div class="form-item">
              <label for="Gender">性别</label>
              <select 
                id="Gender" 
                v-model="form.Gender"
              >
                <option value="" disabled>请选择性别</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-item">
              <label for="Phone">电话</label>
              <input 
                type="text" 
                id="Phone" 
                v-model="form.Phone" 
                placeholder="请输入电话"
              >
            </div>
            <div class="form-item">
              <label for="Email">邮箱</label>
              <input 
                type="email" 
                id="Email" 
                v-model="form.Email" 
                placeholder="请输入邮箱"
              >
            </div>
          </form>
        </div>
        <div class="dialog-footer">
          <button class="cancel-button" @click="dialogVisible = false">取消</button>
          <button class="submit-button" @click="handleSubmit">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../services/api';

const dialogVisible = ref(false);
const dialogType = ref('add');
const form = ref({
  StudentID: '',
  StudentName: '',
  StudentCode: '',
  ClassID: '',
  Gender: '',
  Phone: '',
  Email: ''
});
const students = ref([]);
const classes = ref([]);

const rules = {
  StudentName: [
    { required: true, message: '请输入学生姓名', trigger: 'blur' }
  ],
  StudentCode: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  ClassID: [
    { required: true, message: '请选择班级', trigger: 'blur' }
  ]
};

onMounted(() => {
  loadStudents();
  loadClasses();
});

const loadStudents = async () => {
  try {
    const response = await api.get('/basic-info/students');
    students.value = response;
  } catch (error) {
    alert('获取学生列表失败');
  }
};

const loadClasses = async () => {
  try {
    const response = await api.get('/basic-info/classes');
    classes.value = response;
  } catch (error) {
    alert('获取班级列表失败');
  }
};

const handleEdit = (row) => {
  form.value = { ...row };
  dialogType.value = 'edit';
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  try {
    if (dialogType.value === 'add') {
      await api.post('/basic-info/students', form.value);
      alert('添加成功');
    } else {
      // 暂时只支持添加，编辑功能待实现
      alert('编辑功能待实现');
    }
    dialogVisible.value = false;
    loadStudents();
  } catch (error) {
    alert('操作失败');
  }
};
</script>

<style scoped>
.students-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.students-card {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.card-header span {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.add-button {
  padding: 8px 16px;
  background-color: #6c757d;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.add-button:hover {
  background-color: #5a6268;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th,
.students-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.students-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.students-table tr:hover {
  background-color: #f8f9fa;
}

.edit-button {
  padding: 4px 8px;
  background-color: #6c757d;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-button:hover {
  background-color: #5a6268;
}

/* 对话框样式 */
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.dialog-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
}

.dialog-body {
  padding: 20px;
}

.form-item {
  margin-bottom: 15px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-item input,
.form-item select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-item input:focus,
.form-item select:focus {
  outline: none;
  border-color: #6c757d;
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.cancel-button,
.submit-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.cancel-button {
  background-color: #6c757d;
  color: #ffffff;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.submit-button {
  background-color: #6c757d;
  color: #ffffff;
}

.submit-button:hover {
  background-color: #5a6268;
}
</style>