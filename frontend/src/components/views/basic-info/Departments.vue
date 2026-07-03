<template>
  <div class="departments-container">
    <div class="page-header">
      <h2>院系管理</h2>
    </div>
    
    <div class="departments-card">
      <div class="card-header">
        <span>院系列表</span>
        <button class="add-button" @click="dialogVisible = true">
          添加院系
        </button>
      </div>
      
      <table class="departments-table">
        <thead>
          <tr>
            <th>院系ID</th>
            <th>院系名称</th>
            <th>描述</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="department in departments" :key="department.DepartmentID">
            <td>{{ department.DepartmentID }}</td>
            <td>{{ department.DepartmentName }}</td>
            <td>{{ department.Description }}</td>
            <td>{{ department.CreatedAt }}</td>
            <td>
              <button class="edit-button" @click="handleEdit(department)">编辑</button>
              <button class="delete-button" @click="handleDelete(department.DepartmentID)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 添加/编辑院系对话框 -->
    <div class="dialog" v-if="dialogVisible">
      <div class="dialog-overlay" @click="dialogVisible = false"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ dialogType === 'add' ? '添加院系' : '编辑院系' }}</h3>
          <button class="dialog-close" @click="dialogVisible = false">×</button>
        </div>
        <div class="dialog-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-item">
              <label for="DepartmentName">院系名称</label>
              <input 
                type="text" 
                id="DepartmentName" 
                v-model="form.DepartmentName" 
                placeholder="请输入院系名称"
                required
              >
            </div>
            <div class="form-item">
              <label for="Description">描述</label>
              <textarea 
                id="Description" 
                v-model="form.Description" 
                placeholder="请输入院系描述"
                rows="3"
              ></textarea>
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
  DepartmentID: '',
  DepartmentName: '',
  Description: ''
});
const departments = ref([]);

const rules = {
  DepartmentName: [
    { required: true, message: '请输入院系名称', trigger: 'blur' }
  ]
};

onMounted(() => {
  loadDepartments();
});

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

const handleDelete = async (id) => {
  if (confirm('确定要删除这个院系吗？')) {
    try {
      await api.delete(`/basic-info/departments/${id}`);
      alert('删除成功');
      loadDepartments();
    } catch (error) {
      alert('删除失败');
    }
  }
};

const handleSubmit = async () => {
  try {
    if (dialogType.value === 'add') {
      await api.post('/basic-info/departments', form.value);
      alert('添加成功');
    } else {
      await api.put(`/basic-info/departments/${form.value.DepartmentID}`, form.value);
      alert('编辑成功');
    }
    dialogVisible.value = false;
    loadDepartments();
  } catch (error) {
    alert('操作失败');
  }
};
</script>

<style scoped>
.departments-container {
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

.departments-card {
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

.departments-table {
  width: 100%;
  border-collapse: collapse;
}

.departments-table th,
.departments-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.departments-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.departments-table tr:hover {
  background-color: #f8f9fa;
}

.edit-button,
.delete-button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
}

.edit-button {
  background-color: #6c757d;
  color: #ffffff;
}

.edit-button:hover {
  background-color: #5a6268;
}

.delete-button {
  background-color: #dc3545;
  color: #ffffff;
}

.delete-button:hover {
  background-color: #c82333;
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
.form-item textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-item input:focus,
.form-item textarea:focus {
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