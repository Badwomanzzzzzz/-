<template>
  <div class="basic-info-container" v-loading="pageLoading">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Setting /></el-icon>
          <span class="header-title">基础信息管理</span>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane name="departments">
          <template #label>
            <span class="tab-label">
              <el-icon><OfficeBuilding /></el-icon>
              院系管理
            </span>
          </template>
          <div class="tab-content">
            <div class="tab-toolbar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索院系名称或描述"
                clearable
                :prefix-icon="Search"
                class="toolbar-search"
              />
              <el-button type="primary" @click="openAddDialog">
                <el-icon><Plus /></el-icon>
                添加院系
              </el-button>
            </div>
            <el-table :data="filteredData" stripe v-loading="tabLoading" empty-text="暂无数据">
              <el-table-column
                v-for="col in currentTab.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
              />
              <el-table-column label="操作" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要删除吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(row)"
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
            <div class="pagination-wrap">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="majors">
          <template #label>
            <span class="tab-label">
              <el-icon><Reading /></el-icon>
              专业管理
            </span>
          </template>
          <div class="tab-content">
            <div class="tab-toolbar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索专业名称"
                clearable
                :prefix-icon="Search"
                class="toolbar-search"
              />
              <el-button type="primary" @click="openAddDialog">
                <el-icon><Plus /></el-icon>
                添加专业
              </el-button>
            </div>
            <el-table :data="filteredData" stripe v-loading="tabLoading" empty-text="暂无数据">
              <el-table-column
                v-for="col in currentTab.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
              />
              <el-table-column label="操作" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要删除吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(row)"
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
            <div class="pagination-wrap">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="grades">
          <template #label>
            <span class="tab-label">
              <el-icon><School /></el-icon>
              年级管理
            </span>
          </template>
          <div class="tab-content">
            <div class="tab-toolbar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索年级名称"
                clearable
                :prefix-icon="Search"
                class="toolbar-search"
              />
              <el-button type="primary" @click="openAddDialog">
                <el-icon><Plus /></el-icon>
                添加年级
              </el-button>
            </div>
            <el-table :data="filteredData" stripe v-loading="tabLoading" empty-text="暂无数据">
              <el-table-column
                v-for="col in currentTab.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
              />
              <el-table-column label="操作" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要删除吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(row)"
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
            <div class="pagination-wrap">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="classes">
          <template #label>
            <span class="tab-label">
              <el-icon><Grid /></el-icon>
              班级管理
            </span>
          </template>
          <div class="tab-content">
            <div class="tab-toolbar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索班级名称"
                clearable
                :prefix-icon="Search"
                class="toolbar-search"
              />
              <el-button type="primary" @click="openAddDialog">
                <el-icon><Plus /></el-icon>
                添加班级
              </el-button>
            </div>
            <el-table :data="filteredData" stripe v-loading="tabLoading" empty-text="暂无数据">
              <el-table-column
                v-for="col in currentTab.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
              />
              <el-table-column label="操作" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要删除吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(row)"
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
            <div class="pagination-wrap">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="courses">
          <template #label>
            <span class="tab-label">
              <el-icon><Notebook /></el-icon>
              课程管理
            </span>
          </template>
          <div class="tab-content">
            <div class="tab-toolbar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索课程名称"
                clearable
                :prefix-icon="Search"
                class="toolbar-search"
              />
              <el-button type="primary" @click="openAddDialog">
                <el-icon><Plus /></el-icon>
                添加课程
              </el-button>
            </div>
            <el-table :data="filteredData" stripe v-loading="tabLoading" empty-text="暂无数据">
              <el-table-column
                v-for="col in currentTab.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
              />
              <el-table-column label="操作" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要删除吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(row)"
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
            <div class="pagination-wrap">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="teachers">
          <template #label>
            <span class="tab-label">
              <el-icon><Avatar /></el-icon>
              教师管理
            </span>
          </template>
          <div class="tab-content">
            <div class="tab-toolbar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索教师姓名"
                clearable
                :prefix-icon="Search"
                class="toolbar-search"
              />
              <el-button type="primary" @click="openAddDialog">
                <el-icon><Plus /></el-icon>
                添加教师
              </el-button>
            </div>
            <el-table :data="filteredData" stripe v-loading="tabLoading" empty-text="暂无数据">
              <el-table-column
                v-for="col in currentTab.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
              />
              <el-table-column label="操作" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要删除吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(row)"
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
            <div class="pagination-wrap">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="students">
          <template #label>
            <span class="tab-label">
              <el-icon><User /></el-icon>
              学生管理
            </span>
          </template>
          <div class="tab-content">
            <div class="tab-toolbar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索学生姓名或学号"
                clearable
                :prefix-icon="Search"
                class="toolbar-search"
              />
              <el-button type="primary" @click="openAddDialog">
                <el-icon><Plus /></el-icon>
                添加学生
              </el-button>
            </div>
            <el-table :data="filteredData" stripe v-loading="tabLoading" empty-text="暂无数据">
              <el-table-column
                v-for="col in currentTab.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
              />
              <el-table-column label="操作" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要删除吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(row)"
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
            <div class="pagination-wrap">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane name="semesters">
          <template #label>
            <span class="tab-label">
              <el-icon><Calendar /></el-icon>
              学期管理
            </span>
          </template>
          <div class="tab-content">
            <div class="tab-toolbar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索学期名称"
                clearable
                :prefix-icon="Search"
                class="toolbar-search"
              />
              <el-button type="primary" @click="openAddDialog">
                <el-icon><Plus /></el-icon>
                添加学期
              </el-button>
            </div>
            <el-table :data="filteredData" stripe v-loading="tabLoading" empty-text="暂无数据">
              <el-table-column
                v-for="col in currentTab.columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
              />
              <el-table-column label="操作" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="openEditDialog(row)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <el-popconfirm
                    title="确定要删除吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    @confirm="handleDelete(row)"
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
            <div class="pagination-wrap">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                background
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          v-for="field in currentFields"
          :key="field.prop"
          :label="field.label"
          :prop="field.prop"
        >
          <el-input
            v-if="field.type === 'input'"
            v-model="form[field.prop]"
            :placeholder="field.placeholder"
            clearable
          />
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="form[field.prop]"
            :placeholder="field.placeholder"
            :min="0"
            style="width: 100%;"
          />
          <el-select
            v-else-if="field.type === 'select'"
            v-model="form[field.prop]"
            :placeholder="field.placeholder"
            clearable
            style="width: 100%;"
          >
            <el-option
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="form[field.prop]"
            type="date"
            :placeholder="field.placeholder"
            value-format="YYYY-MM-DD"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus, Search, Edit, Delete,
  OfficeBuilding, Reading, School, Grid, Notebook,
  Avatar, User, Calendar, Setting
} from '@element-plus/icons-vue'
import api from '../../services/api'

const activeTab = ref('departments')
const pageLoading = ref(false)
const tabLoading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref('add')
const formRef = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const departments = ref([])
const majors = ref([])
const grades = ref([])
const classes = ref([])
const courses = ref([])
const teachers = ref([])
const students = ref([])
const semesters = ref([])

const departmentColumns = [
  { prop: 'DepartmentID', label: '院系ID', width: 80 },
  { prop: 'DepartmentName', label: '院系名称', minWidth: 160 },
  { prop: 'Description', label: '描述', minWidth: 200 },
  { prop: 'CreatedAt', label: '创建时间', width: 160 }
]
const majorColumns = [
  { prop: 'MajorID', label: '专业ID', width: 80 },
  { prop: 'MajorName', label: '专业名称', minWidth: 160 },
  { prop: 'DepartmentName', label: '所属院系', minWidth: 140 },
  { prop: 'Description', label: '描述', minWidth: 200 }
]
const gradeColumns = [
  { prop: 'GradeID', label: '年级ID', width: 80 },
  { prop: 'GradeName', label: '年级名称', minWidth: 160 },
  { prop: 'Description', label: '描述', minWidth: 200 }
]
const classColumns = [
  { prop: 'ClassID', label: '班级ID', width: 80 },
  { prop: 'ClassName', label: '班级名称', minWidth: 160 },
  { prop: 'MajorName', label: '所属专业', minWidth: 140 },
  { prop: 'GradeName', label: '所属年级', width: 120 }
]
const courseColumns = [
  { prop: 'CourseID', label: '课程ID', width: 80 },
  { prop: 'CourseName', label: '课程名称', minWidth: 160 },
  { prop: 'DepartmentName', label: '开课院系', minWidth: 140 },
  { prop: 'Credits', label: '学分', width: 80 },
  { prop: 'Hours', label: '学时', width: 80 }
]
const teacherColumns = [
  { prop: 'TeacherID', label: '教师ID', width: 80 },
  { prop: 'TeacherName', label: '教师姓名', minWidth: 120 },
  { prop: 'Gender', label: '性别', width: 70 },
  { prop: 'DepartmentName', label: '所属院系', minWidth: 140 },
  { prop: 'Title', label: '职称', width: 120 },
  { prop: 'Phone', label: '电话', width: 140 },
  { prop: 'Email', label: '邮箱', minWidth: 180 }
]
const studentColumns = [
  { prop: 'StudentID', label: '学号', width: 100 },
  { prop: 'StudentName', label: '姓名', minWidth: 120 },
  { prop: 'Gender', label: '性别', width: 70 },
  { prop: 'ClassName', label: '班级', minWidth: 140 },
  { prop: 'MajorName', label: '专业', minWidth: 140 },
  { prop: 'GradeName', label: '年级', width: 100 },
  { prop: 'Phone', label: '电话', width: 140 }
]
const semesterColumns = [
  { prop: 'SemesterID', label: '学期ID', width: 80 },
  { prop: 'SemesterName', label: '学期名称', minWidth: 160 },
  { prop: 'StartDate', label: '开始日期', width: 120 },
  { prop: 'EndDate', label: '结束日期', width: 120 },
  { prop: 'Description', label: '描述', minWidth: 200 }
]

const departmentFields = [
  { prop: 'DepartmentName', label: '院系名称', type: 'input', placeholder: '请输入院系名称' },
  { prop: 'Description', label: '描述', type: 'input', placeholder: '请输入描述' }
]
const majorFields = [
  { prop: 'MajorName', label: '专业名称', type: 'input', placeholder: '请输入专业名称' },
  { prop: 'DepartmentID', label: '所属院系', type: 'select', placeholder: '请选择院系', options: [] },
  { prop: 'Description', label: '描述', type: 'input', placeholder: '请输入描述' }
]
const gradeFields = [
  { prop: 'GradeName', label: '年级名称', type: 'input', placeholder: '请输入年级名称' },
  { prop: 'Description', label: '描述', type: 'input', placeholder: '请输入描述' }
]
const classFields = [
  { prop: 'ClassName', label: '班级名称', type: 'input', placeholder: '请输入班级名称' },
  { prop: 'MajorID', label: '所属专业', type: 'select', placeholder: '请选择专业', options: [] },
  { prop: 'GradeID', label: '所属年级', type: 'select', placeholder: '请选择年级', options: [] }
]
const courseFields = [
  { prop: 'CourseName', label: '课程名称', type: 'input', placeholder: '请输入课程名称' },
  { prop: 'DepartmentID', label: '开课院系', type: 'select', placeholder: '请选择院系', options: [] },
  { prop: 'Credits', label: '学分', type: 'number', placeholder: '请输入学分' },
  { prop: 'Hours', label: '学时', type: 'number', placeholder: '请输入学时' }
]
const teacherFields = [
  { prop: 'TeacherName', label: '教师姓名', type: 'input', placeholder: '请输入教师姓名' },
  { prop: 'Gender', label: '性别', type: 'input', placeholder: '请输入性别' },
  { prop: 'DepartmentID', label: '所属院系', type: 'select', placeholder: '请选择院系', options: [] },
  { prop: 'Title', label: '职称', type: 'input', placeholder: '请输入职称' },
  { prop: 'Phone', label: '电话', type: 'input', placeholder: '请输入电话' },
  { prop: 'Email', label: '邮箱', type: 'input', placeholder: '请输入邮箱' }
]
const studentFields = [
  { prop: 'StudentName', label: '姓名', type: 'input', placeholder: '请输入姓名' },
  { prop: 'Gender', label: '性别', type: 'input', placeholder: '请输入性别' },
  { prop: 'ClassID', label: '班级', type: 'select', placeholder: '请选择班级', options: [] },
  { prop: 'Phone', label: '电话', type: 'input', placeholder: '请输入电话' }
]
const semesterFields = [
  { prop: 'SemesterName', label: '学期名称', type: 'input', placeholder: '请输入学期名称' },
  { prop: 'StartDate', label: '开始日期', type: 'date', placeholder: '请选择开始日期' },
  { prop: 'EndDate', label: '结束日期', type: 'date', placeholder: '请选择结束日期' },
  { prop: 'Description', label: '描述', type: 'input', placeholder: '请输入描述' }
]

const idKeys = {
  departments: 'DepartmentID',
  majors: 'MajorID',
  grades: 'GradeID',
  classes: 'ClassID',
  courses: 'CourseID',
  teachers: 'TeacherID',
  students: 'StudentID',
  semesters: 'SemesterID'
}

const tabs = [
  { name: 'departments', label: '院系管理', columns: departmentColumns, fields: departmentFields },
  { name: 'majors', label: '专业管理', columns: majorColumns, fields: majorFields },
  { name: 'grades', label: '年级管理', columns: gradeColumns, fields: gradeFields },
  { name: 'classes', label: '班级管理', columns: classColumns, fields: classFields },
  { name: 'courses', label: '课程管理', columns: courseColumns, fields: courseFields },
  { name: 'teachers', label: '教师管理', columns: teacherColumns, fields: teacherFields },
  { name: 'students', label: '学生管理', columns: studentColumns, fields: studentFields },
  { name: 'semesters', label: '学期管理', columns: semesterColumns, fields: semesterFields }
]

const currentTab = computed(() => tabs.find(t => t.name === activeTab.value) || tabs[0])

const dataMap = { departments, majors, grades, classes, courses, teachers, students, semesters }

const currentData = computed(() => dataMap[activeTab.value]?.value || [])

const filteredData = computed(() => {
  const data = currentData.value
  if (!searchQuery.value) return data
  const q = searchQuery.value.toLowerCase()
  return data.filter(item => {
    return Object.values(item).some(val => String(val).toLowerCase().includes(q))
  })
})

const currentFields = computed(() => currentTab.value.fields || [])

const form = reactive({})
const rules = reactive({})

const buildRules = () => {
  const r = {}
  currentFields.value.forEach(f => {
    r[f.prop] = [{ required: true, message: `请输入${f.label}`, trigger: 'blur' }]
  })
  return r
}

const openAddDialog = () => {
  dialogType.value = 'add'
  dialogTitle.value = `添加${currentTab.value.label.replace('管理', '')}`
  Object.keys(form).forEach(k => delete form[k])
  currentFields.value.forEach(f => {
    form[f.prop] = f.type === 'number' ? 0 : ''
  })
  Object.keys(rules).forEach(k => delete rules[k])
  Object.assign(rules, buildRules())
  formRef.value?.resetFields()
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  dialogType.value = 'edit'
  dialogTitle.value = `编辑${currentTab.value.label.replace('管理', '')}`
  Object.keys(form).forEach(k => delete form[k])
  currentFields.value.forEach(f => {
    form[f.prop] = row[f.prop] !== undefined ? row[f.prop] : ''
  })
  const idKey = idKeys[activeTab.value]
  form[idKey] = row[idKey]
  Object.keys(rules).forEach(k => delete rules[k])
  Object.assign(rules, buildRules())
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  const idKey = idKeys[activeTab.value]
  const id = row[idKey]
  try {
    await api.delete(`/basic-info/${activeTab.value}/${id}`)
    ElMessage.success('删除成功')
    await loadEntity()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    const entity = activeTab.value
    const idKey = idKeys[entity]
    const payload = {}
    currentFields.value.forEach(f => {
      payload[f.prop] = form[f.prop]
    })

    if (dialogType.value === 'add') {
      await api.post(`/basic-info/${entity}`, payload)
      ElMessage.success('添加成功')
    } else {
      await api.put(`/basic-info/${entity}/${form[idKey]}`, payload)
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    await loadEntity()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const loadEntity = async () => {
  tabLoading.value = true
  try {
    const entity = activeTab.value
    const res = await api.get(`/basic-info/${entity}`)
    if (dataMap[entity]) {
      dataMap[entity].value = Array.isArray(res) ? res : []
    }
  } catch (error) {
    console.error(`加载${activeTab.value}失败:`, error)
  } finally {
    tabLoading.value = false
  }
}

const updateSelectOptions = async () => {
  try {
    const [deptRes, gradesRes, majorsRes, classesRes] = await Promise.all([
      api.get('/basic-info/departments'),
      api.get('/basic-info/grades'),
      api.get('/basic-info/majors'),
      api.get('/basic-info/classes')
    ])
    const deptOpts = (Array.isArray(deptRes) ? deptRes : []).map(d => ({ label: d.DepartmentName, value: d.DepartmentID }))
    const gradeOpts = (Array.isArray(gradesRes) ? gradesRes : []).map(g => ({ label: g.GradeName, value: g.GradeID }))
    const majorOpts = (Array.isArray(majorsRes) ? majorsRes : []).map(m => ({ label: m.MajorName, value: m.MajorID }))
    const classOpts = (Array.isArray(classesRes) ? classesRes : []).map(c => ({ label: c.ClassName, value: c.ClassID }))

    const setOpts = (fields, prop, opts) => {
      const f = fields.find(f => f.prop === prop)
      if (f) f.options = opts
    }
    setOpts(majorFields, 'DepartmentID', deptOpts)
    setOpts(classFields, 'MajorID', majorOpts)
    setOpts(classFields, 'GradeID', gradeOpts)
    setOpts(courseFields, 'DepartmentID', deptOpts)
    setOpts(teacherFields, 'DepartmentID', deptOpts)
    setOpts(studentFields, 'ClassID', classOpts)
  } catch (error) {
    console.error('加载下拉选项失败:', error)
  }
}

const handleTabChange = () => {
  searchQuery.value = ''
  currentPage.value = 1
  loadEntity()
}

onMounted(async () => {
  pageLoading.value = true
  await updateSelectOptions()
  await loadEntity()
  pageLoading.value = false
})
</script>

<style scoped>
.basic-info-container {
  padding: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 20px;
  color: #4a6cf7;
}

.header-title {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
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

.tab-content {
  min-height: 360px;
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

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}
</style>