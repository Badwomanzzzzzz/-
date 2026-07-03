<template>
  <div class="semesters-container">
    <div class="page-header">
      <h2>学期管理</h2>
    </div>
    
    <div class="semesters-card">
      <div class="card-header">
        <span>学期列表</span>
        <button class="add-button" @click="dialogVisible = true">
          添加学期
        </button>
      </div>
      
      <table class="semesters-table">
        <thead>
          <tr>
            <th>学期ID</th>
            <th>学期名称</th>
            <th>开始日期</th>
            <th>结束日期</th>
            <th>是否当前学期</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="semester in semesters" :key="semester.SemesterID">
            <td>{{ semester.SemesterID }}</td>
            <td>{{ semester.SemesterName }}</td>
            <td>{{ semester.StartDate }}</td>
            <td>{{ semester.EndDate }}</td>
            <td>
              <span class="status-tag" :class="{ 'current': semester.IsCurrent }">
                {{ semester.IsCurrent ? '是' : '否' }}
              </span>
            </td>
            <td>{{ semester.CreatedAt }}</td>
            <td>
              <button class="edit-button" @click="handleEdit(semester)">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 添加/编辑学期对话框 -->
    <div class="dialog" v-if="dialogVisible">
      <div class="dialog-overlay" @click="dialogVisible = false"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ dialogType === 'add' ? '添加学期' : '编辑学期' }}</h3>
          <button class="dialog-close" @click="dialogVisible = false">×</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-item">
              <label for="SemesterName">学期名称</label>
              <input 
                type="text" 
                id="SemesterName" 
                v-model="form.SemesterName" 
                placeholder="请输入学期名称，如：2024-2025学年第一学期"
                required
              >
            </div>
            <div class="form-item">
              <label for="StartDate">开始日期</label>
              <input 
                type="date" 
                id="StartDate" 
                v-model="form.StartDate"
                required
              >
            </div>
            <div class="form-item">
              <label for="EndDate">结束日期</label>
              <input 
                type="date" 
                id="EndDate" 
                v-model="form.EndDate"
                required
              >
            </div>
            <div class="form-item">
              <label for="IsCurrent">是否当前学期</label>
              <input 
                type="checkbox" 
                id="IsCurrent" 
                v-model="form.IsCurrent"
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
  SemesterID: '',
  SemesterName: '',
  StartDate: '',
  EndDate: '',
  IsCurrent: false
});
const semesters = ref([]);

const rules = {
  SemesterName: [
    { required: true, message: '请输入学期名称', trigger: 'blur' }
  ],
  StartDate: [
    { required: true, message: '请选择开始日期', trigger: 'blur' }
  ],
  EndDate: [
    { required: true, message: '请选择结束日期', trigger: 'blur' }
  ]
};

onMounted(() => {
  loadSemesters();
});

const loadSemesters = async () => {
  try {
    const response = await api.get('/basic-info/semesters');
    semesters.value = response;
  } catch (error) {
    alert('获取学期列表失败');
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
      await api.post('/basic-info/semesters', form.value);
      alert('添加成功');
    } else {
      // 暂时只支持添加，编辑功能待实现
      alert('编辑功能待实现');
    }
    dialogVisible.value = false;
    loadSemesters();
  } catch (error) {
    alert('操作失败');
  }
};
</script>

<style scoped>
.semesters-container {
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

.semesters-card {
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

.semesters-table {
  width: 100%;
  border-collapse: collapse;
}

.semesters-table th,
.semesters-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.semesters-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.semesters-table tr:hover {
  background-color: #f8f9fa;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e9ecef;
  color: #6c757d;
}

.status-tag.current {
  background-color: #d4edda;
  color: #155724;
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

.form-item input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-item input[type="checkbox"] {
  width: auto;
  margin-right: 5px;
}

.form-item input:focus {
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