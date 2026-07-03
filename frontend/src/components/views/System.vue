<template>
  <div class="system-container">
    <el-tabs v-model="activeTab" type="border-card" class="system-tabs">
      <el-tab-pane name="users">
        <template #label>
          <span class="tab-label">
            <el-icon><User /></el-icon>
            用户管理
          </span>
        </template>
        <el-card shadow="never" class="tab-card">
          <div class="tab-toolbar">
            <el-input
              v-model="userSearch"
              placeholder="搜索用户名或姓名"
              clearable
              :prefix-icon="Search"
              class="toolbar-search"
            />
            <el-button type="primary" @click="handleAddUser">
              <el-icon><Plus /></el-icon>
              添加用户
            </el-button>
          </div>
          <el-table :data="filteredUsers" v-loading="userLoading" stripe empty-text="暂无数据">
            <el-table-column prop="UserID" label="ID" width="60" align="center" />
            <el-table-column prop="Username" label="用户名" width="120" />
            <el-table-column prop="Name" label="姓名" width="100" />
            <el-table-column prop="Email" label="邮箱" min-width="180" />
            <el-table-column prop="Phone" label="电话" width="130" />
            <el-table-column prop="Roles" label="角色" min-width="120">
              <template #default="{ row }">
                <el-tag
                  v-for="role in parseRoles(row.Roles)"
                  :key="role"
                  size="small"
                  class="role-tag"
                >
                  {{ role }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleEditUser(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-popconfirm
                  title="确定删除该用户?"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="handleDeleteUser(row.UserID)"
                >
                  <template #reference>
                    <el-button type="danger" link size="small">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane name="roles">
        <template #label>
          <span class="tab-label">
            <el-icon><Avatar /></el-icon>
            角色管理
          </span>
        </template>
        <el-card shadow="never" class="tab-card">
          <div class="tab-toolbar">
            <div></div>
            <el-button type="primary" @click="handleAddRole">
              <el-icon><Plus /></el-icon>
              添加角色
            </el-button>
          </div>
          <el-table :data="roles" v-loading="roleLoading" stripe empty-text="暂无数据">
            <el-table-column prop="RoleID" label="ID" width="80" align="center" />
            <el-table-column prop="RoleName" label="角色名称" min-width="160" />
            <el-table-column label="操作" width="280" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleEditRole(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button type="warning" size="small" plain @click="handleManageMenus(row)">
                  <el-icon><Menu /></el-icon>
                  菜单权限
                </el-button>
                <el-popconfirm
                  title="确定删除该角色?"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="handleDeleteRole(row.RoleID)"
                >
                  <template #reference>
                    <el-button type="danger" link size="small">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane name="logs">
        <template #label>
          <span class="tab-label">
            <el-icon><DocumentChecked /></el-icon>
            操作日志
          </span>
        </template>
        <el-card shadow="never" class="tab-card">
          <el-table :data="logs" v-loading="logLoading" stripe max-height="560" empty-text="暂无数据">
            <el-table-column prop="LogID" label="ID" width="70" align="center" />
            <el-table-column prop="UserName" label="操作用户" width="120" />
            <el-table-column prop="OperationType" label="操作类型" width="110">
              <template #default="{ row }">
                <el-tag
                  :type="operationTagType(row.OperationType)"
                  size="small"
                >
                  {{ row.OperationType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="TargetTable" label="目标表" width="130" />
            <el-table-column prop="OperationContent" label="操作内容" min-width="200" show-overflow-tooltip />
            <el-table-column prop="OperationDate" label="操作时间" width="170" />
            <el-table-column prop="IPAddress" label="IP地址" width="130" />
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane name="password">
        <template #label>
          <span class="tab-label">
            <el-icon><Lock /></el-icon>
            修改密码
          </span>
        </template>
        <el-card shadow="never" class="tab-card password-card">
          <div class="password-header">
            <p class="password-tip">请定期更新您的登录密码以确保账户安全</p>
          </div>
          <el-form
            :model="passwordForm"
            label-width="90px"
            class="password-form"
            @submit.prevent="handleChangePassword"
          >
            <el-form-item label="原密码">
              <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword" :loading="pwLoading">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="userDialogVisible"
      :title="userDialogTitle"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.Username" :disabled="isEditUser" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="!isEditUser" label="密码">
          <el-input v-model="userForm.Password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if="isEditUser" label="新密码">
          <el-input v-model="userForm.Password" type="password" show-password placeholder="留空则不修改" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="userForm.Name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.Email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userForm.Phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.RoleIDs" multiple placeholder="请选择角色" style="width: 100%;">
            <el-option v-for="r in roles" :key="r.RoleID" :label="r.RoleName" :value="r.RoleID" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveUser" :loading="userSaving">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="roleDialogVisible"
      :title="roleDialogTitle"
      width="440px"
      :close-on-click-modal="false"
    >
      <el-form :model="roleForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.RoleName" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveRole" :loading="roleSaving">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="menuDialogVisible"
      title="菜单权限设置"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-tree
        ref="menuTreeRef"
        :data="menuTree"
        show-checkbox
        node-key="MenuID"
        :props="{ label: 'MenuName', children: 'children' }"
        :default-checked-keys="checkedMenuIds"
      />
      <template #footer>
        <el-button @click="menuDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveMenus">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus, Search, Edit, Delete,
  User, Avatar, DocumentChecked, Lock, Menu
} from '@element-plus/icons-vue'
import api from '../../services/api'

const activeTab = ref('users')

const users = ref([])
const userSearch = ref('')
const userLoading = ref(false)
const userDialogVisible = ref(false)
const userDialogTitle = ref('')
const isEditUser = ref(false)
const userSaving = ref(false)
const userForm = ref({ Username: '', Password: '', Name: '', Email: '', Phone: '', RoleIDs: [] })
const editingUserId = ref(null)

const roles = ref([])
const roleLoading = ref(false)
const roleDialogVisible = ref(false)
const roleDialogTitle = ref('')
const roleSaving = ref(false)
const roleForm = ref({ RoleName: '' })
const editingRoleId = ref(null)

const logs = ref([])
const logLoading = ref(false)

const passwordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwLoading = ref(false)

const menuDialogVisible = ref(false)
const menuTree = ref([])
const checkedMenuIds = ref([])
const currentRoleId = ref(null)
const menuTreeRef = ref(null)

const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  const q = userSearch.value.toLowerCase()
  return users.value.filter(u =>
    String(u.Username).toLowerCase().includes(q) ||
    String(u.Name).toLowerCase().includes(q)
  )
})

const parseRoles = (rolesData) => {
  if (!rolesData) return []
  if (Array.isArray(rolesData)) return rolesData
  if (typeof rolesData === 'string') {
    try {
      const parsed = JSON.parse(rolesData)
      return Array.isArray(parsed) ? parsed : [rolesData]
    } catch {
      return rolesData.split(/[,;，；]/).map(s => s.trim()).filter(Boolean)
    }
  }
  return [String(rolesData)]
}

const operationTagType = (type) => {
  const map = { '新增': 'success', '修改': 'warning', '删除': 'danger', '查询': 'info' }
  return map[type] || ''
}

const loadUsers = async () => {
  userLoading.value = true
  try {
    const res = await api.get('/system/users')
    users.value = res
  } catch (e) {
    console.warn('加载用户失败:', e)
  } finally {
    userLoading.value = false
  }
}

const loadRoles = async () => {
  roleLoading.value = true
  try {
    const res = await api.get('/system/roles')
    roles.value = res
  } catch (e) {
    console.warn('加载角色失败:', e)
  } finally {
    roleLoading.value = false
  }
}

const loadLogs = async () => {
  logLoading.value = true
  try {
    const res = await api.get('/system/logs')
    logs.value = res
  } catch (e) {
    console.warn('加载日志失败:', e)
  } finally {
    logLoading.value = false
  }
}

const handleAddUser = () => {
  isEditUser.value = false
  userDialogTitle.value = '添加用户'
  userForm.value = { Username: '', Password: '', Name: '', Email: '', Phone: '', RoleIDs: [] }
  editingUserId.value = null
  userDialogVisible.value = true
}

const handleEditUser = async (row) => {
  isEditUser.value = true
  userDialogTitle.value = '编辑用户'
  editingUserId.value = row.UserID
  try {
    const rolesRes = await api.get(`/system/users/${row.UserID}/roles`)
    userForm.value = {
      Username: row.Username,
      Password: '',
      Name: row.Name,
      Email: row.Email || '',
      Phone: row.Phone || '',
      RoleIDs: rolesRes.map(r => r.RoleID)
    }
  } catch (e) {
    userForm.value = {
      Username: row.Username,
      Password: '',
      Name: row.Name,
      Email: row.Email || '',
      Phone: row.Phone || '',
      RoleIDs: []
    }
  }
  userDialogVisible.value = true
}

const handleSaveUser = async () => {
  userSaving.value = true
  try {
    const data = { ...userForm.value }
    if (isEditUser.value && !data.Password) delete data.Password
    if (isEditUser.value) {
      await api.put(`/system/users/${editingUserId.value}`, data)
    } else {
      await api.post('/system/users', data)
    }
    ElMessage.success(isEditUser.value ? '更新成功' : '创建成功')
    userDialogVisible.value = false
    loadUsers()
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    userSaving.value = false
  }
}

const handleDeleteUser = async (id) => {
  try {
    await api.delete(`/system/users/${id}`)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

const handleAddRole = () => {
  roleDialogTitle.value = '添加角色'
  roleForm.value = { RoleName: '' }
  editingRoleId.value = null
  roleDialogVisible.value = true
}

const handleEditRole = (row) => {
  roleDialogTitle.value = '编辑角色'
  roleForm.value = { RoleName: row.RoleName }
  editingRoleId.value = row.RoleID
  roleDialogVisible.value = true
}

const handleSaveRole = async () => {
  roleSaving.value = true
  try {
    if (editingRoleId.value) {
      await api.put(`/system/roles/${editingRoleId.value}`, roleForm.value)
    } else {
      await api.post('/system/roles', roleForm.value)
    }
    ElMessage.success(editingRoleId.value ? '更新成功' : '创建成功')
    roleDialogVisible.value = false
    loadRoles()
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    roleSaving.value = false
  }
}

const handleDeleteRole = async (id) => {
  try {
    await api.delete(`/system/roles/${id}`)
    ElMessage.success('删除成功')
    loadRoles()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

const handleManageMenus = async (row) => {
  currentRoleId.value = row.RoleID
  try {
    const menusRes = await api.get(`/system/roles/${row.RoleID}/menus`)
    const allMenus = await api.get('/system/menus')
    checkedMenuIds.value = menusRes.filter(m => m.CanAccess).map(m => m.MenuID)
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.ParentID === parentId)
        .map(item => ({ ...item, children: buildTree(items, item.MenuID) }))
        .sort((a, b) => a.OrderIndex - b.OrderIndex)
    }
    menuTree.value = buildTree(allMenus)
    menuDialogVisible.value = true
  } catch (e) {
    console.warn('加载菜单失败:', e)
  }
}

const handleSaveMenus = async () => {
  try {
    const checkedKeys = menuTreeRef.value?.getCheckedKeys() || []
    const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || []
    const allChecked = [...checkedKeys, ...halfCheckedKeys]
    await api.put(`/system/roles/${currentRoleId.value}/menus`, { menuIds: allChecked })
    ElMessage.success('权限更新成功')
    menuDialogVisible.value = false
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    return ElMessage.warning('两次密码不一致')
  }
  pwLoading.value = true
  try {
    await api.post('/system/change-password', {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    ElMessage.success('密码修改成功')
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e) {
    ElMessage.error('修改失败')
  } finally {
    pwLoading.value = false
  }
}

onMounted(() => {
  loadUsers()
  loadRoles()
  loadLogs()
})
</script>

<style scoped>
.system-container {
  padding: 0;
}

.system-tabs {
  border-radius: 14px;
  overflow: hidden;
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.tab-label .el-icon {
  font-size: 16px;
}

.tab-card {
  border: none !important;
  box-shadow: none !important;
}

.tab-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.toolbar-search {
  width: 260px;
}

.role-tag {
  margin-right: 4px;
  margin-bottom: 2px;
}

.password-card {
  max-width: 500px;
}

.password-header {
  margin-bottom: 24px;
}

.password-tip {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.5;
}

.password-form {
  max-width: 380px;
}
</style>