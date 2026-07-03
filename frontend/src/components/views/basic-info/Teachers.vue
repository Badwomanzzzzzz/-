<template>
  <div class="teachers-container">
    <div class="page-header">
      <h2>教师管理</h2>
    </div>
    
    <div class="teachers-card">
      <div class="card-header">
        <span>教师列表</span>
        <button class="add-button" @click="dialogVisible = true">
          添加教师
        </button>
      </div>
      
      <table class="teachers-table">
        <thead>
          <tr>
            <th>教师ID</th>
            <th>教师姓名</th>
            <th>教师工号</th>
            <th>所属院系</th>
            <th>职称</th>
            <th>电话</th>
            <th>邮箱</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in teachers" :key="teacher.TeacherID">
            <td>{{ teacher.TeacherID }}</td>
            <td>{{ teacher.TeacherName }}</td>
            <td>{{ teacher.TeacherCode }}</td>
            <td>{{ teacher.DepartmentName }}</td>
            <td>{{ teacher.Title }}</td>
            <td>{{ teacher.Phone }}</td>
            <td>{{ teacher.Email }}</td>
            <td>{{ teacher.CreatedAt }}</td>
            <td>
              <button class="edit-button" @click="handleEdit(teacher)">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 添加/编辑教师对话框 -->
    <div class="dialog" v-if="dialogVisible">
      <div class="dialog-overlay" @click="dialogVisible = false"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ dialogType === 'add' ? '添加教师' : '编辑教师' }}</h3>
          <button class="dialog-close" @click="dialogVisible = false">×</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-item">
              <label for="TeacherName">教师姓名</label>
              <input 
                type="text" 
                id="TeacherName" 
                v-model="form.TeacherName" 
                placeholder="请输入教师姓名"
                required
              >
            </div>
            <div class="form-item">
              <label for="TeacherCode">教师工号</label>
              <input 
                type="text" 
                id="TeacherCode" 
                v-model="form.TeacherCode" 
                placeholder="请输入教师工号"
                required
              >
            </div>
            <div class="form-item">
              <label for="DepartmentID">所属院系</label>
              <select 
                id="DepartmentID" 
                v-model="form.DepartmentID" 
                required
              >
                <option value="" disabled>请选择院系</option>
                <option 
                  v-for="department in departments" 
                  :key="department.DepartmentID" 
                  :value="department.DepartmentID"
                >
                  {{ department.DepartmentName }}
                </option>
              </select>
            </div>
            <div class="form-item">
              <label for="Title">职称</label>
              <input 
                type="text" 
                id="Title" 
                v-model="form.Title" 
                placeholder="请输入职称"
              >
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
  TeacherID: '',
  TeacherName: '',
  TeacherCode: '',
  DepartmentID: '',
  Title: '',
  Phone: '',
  Email: ''
});
const teachers = ref([]);
const departments = ref([]);

const rules = {
  TeacherName: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' }
  ],
  TeacherCode: [
    { required: true, message: '请输入教师工号', trigger: 'blur' }
  ],
  DepartmentID: [
    { required: true, message: '请选择所属院系', trigger: 'blur' }
  ]
};

onMounted(() => {
  loadTeachers();
  loadDepartments();
});

const loadTeachers = async () => {
  try {
    const response = await api.get('/basic-info/teachers');
    teachers.value = response;
  } catch (error) {
    alert('获取教师列表失败');
  }
};

const loadDepartments = async () => {
  try {
    const response = await api.get('/basic-info/departments');
    departments.value = response;
  } catch (error) {
    alert('获取院系列表失败');
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
      await api.post('/basic-info/teachers', form.value);
      alert('添加成功');
    } else {
      // 暂时只支持添加，编辑功能待实现
      alert('编辑功能待实现');
    }
    dialogVisible.value = false;
    loadTeachers();
  } catch (error) {
    alert('操作失败');
  }
};
</script>

<style scoped>
.teachers-container {
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

.teachers-card {
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

.teachers-table {
  width: 100%;
  border-collapse: collapse;
}

.teachers-table th,
.teachers-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.teachers-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.teachers-table tr:hover {
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