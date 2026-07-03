<template>
  <div class="classes-container">
    <div class="page-header">
      <h2>班级管理</h2>
    </div>
    
    <div class="classes-card">
      <div class="card-header">
        <span>班级列表</span>
        <button class="add-button" @click="dialogVisible = true">
          添加班级
        </button>
      </div>
      
      <table class="classes-table">
        <thead>
          <tr>
            <th>班级ID</th>
            <th>班级名称</th>
            <th>所属专业</th>
            <th>年级</th>
            <th>学生人数</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clazz in classes" :key="clazz.ClassID">
            <td>{{ clazz.ClassID }}</td>
            <td>{{ clazz.ClassName }}</td>
            <td>{{ clazz.MajorName }}</td>
            <td>{{ clazz.GradeName }}</td>
            <td>{{ clazz.StudentCount }}</td>
            <td>{{ clazz.CreatedAt }}</td>
            <td>
              <button class="edit-button" @click="handleEdit(clazz)">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 添加/编辑班级对话框 -->
    <div class="dialog" v-if="dialogVisible">
      <div class="dialog-overlay" @click="dialogVisible = false"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ dialogType === 'add' ? '添加班级' : '编辑班级' }}</h3>
          <button class="dialog-close" @click="dialogVisible = false">×</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-item">
              <label for="ClassName">班级名称</label>
              <input 
                type="text" 
                id="ClassName" 
                v-model="form.ClassName" 
                placeholder="请输入班级名称"
                required
              >
            </div>
            <div class="form-item">
              <label for="MajorID">所属专业</label>
              <select 
                id="MajorID" 
                v-model="form.MajorID" 
                required
              >
                <option value="" disabled>请选择专业</option>
                <option 
                  v-for="major in majors" 
                  :key="major.MajorID" 
                  :value="major.MajorID"
                >
                  {{ major.MajorName }}
                </option>
              </select>
            </div>
            <div class="form-item">
              <label for="GradeID">年级</label>
              <select 
                id="GradeID" 
                v-model="form.GradeID" 
                required
              >
                <option value="" disabled>请选择年级</option>
                <option 
                  v-for="grade in grades" 
                  :key="grade.GradeID" 
                  :value="grade.GradeID"
                >
                  {{ grade.GradeName }}
                </option>
              </select>
            </div>
            <div class="form-item">
              <label for="StudentCount">学生人数</label>
              <input 
                type="number" 
                id="StudentCount" 
                v-model="form.StudentCount" 
                min="0"
                step="1"
                value="0"
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
  ClassID: '',
  ClassName: '',
  MajorID: '',
  GradeID: '',
  StudentCount: 0
});
const classes = ref([]);
const majors = ref([]);
const grades = ref([]);

const rules = {
  ClassName: [
    { required: true, message: '请输入班级名称', trigger: 'blur' }
  ],
  MajorID: [
    { required: true, message: '请选择所属专业', trigger: 'blur' }
  ],
  GradeID: [
    { required: true, message: '请选择年级', trigger: 'blur' }
  ]
};

onMounted(() => {
  loadClasses();
  loadMajors();
  loadGrades();
});

const loadClasses = async () => {
  try {
    const response = await api.get('/basic-info/classes');
    classes.value = response;
  } catch (error) {
    alert('获取班级列表失败');
  }
};

const loadMajors = async () => {
  try {
    const response = await api.get('/basic-info/majors');
    majors.value = response;
  } catch (error) {
    alert('获取专业列表失败');
  }
};

const loadGrades = async () => {
  try {
    const response = await api.get('/basic-info/grades');
    grades.value = response;
  } catch (error) {
    alert('获取年级列表失败');
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
      await api.post('/basic-info/classes', form.value);
      alert('添加成功');
    } else {
      // 暂时只支持添加，编辑功能待实现
      alert('编辑功能待实现');
    }
    dialogVisible.value = false;
    loadClasses();
  } catch (error) {
    alert('操作失败');
  }
};
</script>

<style scoped>
.classes-container {
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

.classes-card {
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

.classes-table {
  width: 100%;
  border-collapse: collapse;
}

.classes-table th,
.classes-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.classes-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.classes-table tr:hover {
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