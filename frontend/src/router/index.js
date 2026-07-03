import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/views/Login.vue'
import Home from '../components/views/Home.vue'

const Reports = () => import('../components/views/Reports.vue')
const Books = () => import('../components/views/Books.vue')
const BasicInfo = () => import('../components/views/BasicInfo.vue')
const BookSelection = () => import('../components/views/BookSelection.vue')
const Purchasing = () => import('../components/views/Purchasing.vue')
const Inventory = () => import('../components/views/Inventory.vue')
const Distribution = () => import('../components/views/Distribution.vue')
const Fee = () => import('../components/views/Fee.vue')
const UsedBook = () => import('../components/views/UsedBook.vue')
const Orders = () => import('../components/views/Orders.vue')
const System = () => import('../components/views/System.vue')
const UrbanPlanning = () => import('../components/views/UrbanPlanning.vue')

const Applications = () => import('../components/views/book-selection/Applications.vue')
const Plans = () => import('../components/views/book-selection/Plans.vue')
const Versions = () => import('../components/views/book-selection/Versions.vue')
const PSuppliers = () => import('../components/views/purchasing/Suppliers.vue')
const POrders = () => import('../components/views/purchasing/Orders.vue')
const PReceipts = () => import('../components/views/purchasing/Receipts.vue')
const PInvoices = () => import('../components/views/purchasing/Invoices.vue')
const IQuery = () => import('../components/views/inventory/Query.vue')
const IInbound = () => import('../components/views/inventory/Inbound.vue')
const IOutbound = () => import('../components/views/inventory/Outbound.vue')
const ICheck = () => import('../components/views/inventory/Check.vue')
const DRecords = () => import('../components/views/distribution/Records.vue')
const DGenerate = () => import('../components/views/distribution/Generate.vue')
const FRecords = () => import('../components/views/fee/Records.vue')
const FSettle = () => import('../components/views/fee/Settle.vue')
const FRefund = () => import('../components/views/fee/Refund.vue')
const URecords = () => import('../components/views/used-book/Records.vue')
const UDistribution = () => import('../components/views/used-book/Distribution.vue')

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Home,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: Reports, meta: { title: '首页' } },
      { path: 'books', component: Books, meta: { title: '教材管理' } },
      { path: 'basic-info', component: BasicInfo, meta: { title: '基础信息管理', requiresAdmin: true } },
      {
        path: 'book-selection',
        component: BookSelection,
        redirect: '/book-selection/applications',
        children: [
          { path: 'applications', component: Applications, meta: { title: '教材选用申请' } },
          { path: 'plans', component: Plans, meta: { title: '征订计划' } },
          { path: 'versions', component: Versions, meta: { title: '教材版本' } },
        ]
      },
      {
        path: 'purchasing',
        component: Purchasing,
        redirect: '/purchasing/suppliers',
        meta: { requiresAdmin: true },
        children: [
          { path: 'suppliers', component: PSuppliers, meta: { title: '供应商管理' } },
          { path: 'orders', component: POrders, meta: { title: '采购单管理' } },
          { path: 'receipts', component: PReceipts, meta: { title: '到货登记' } },
          { path: 'invoices', component: PInvoices, meta: { title: '发票管理' } },
        ]
      },
      {
        path: 'inventory',
        component: Inventory,
        redirect: '/inventory/query',
        meta: { requiresAdmin: true },
        children: [
          { path: 'query', component: IQuery, meta: { title: '库存查询' } },
          { path: 'inbound', component: IInbound, meta: { title: '入库管理' } },
          { path: 'outbound', component: IOutbound, meta: { title: '出库管理' } },
          { path: 'check', component: ICheck, meta: { title: '库存盘点' } },
        ]
      },
      {
        path: 'distribution',
        component: Distribution,
        redirect: '/distribution/records',
        meta: { requiresAdmin: true },
        children: [
          { path: 'records', component: DRecords, meta: { title: '发放记录' } },
          { path: 'generate', component: DGenerate, meta: { title: '生成清单' } },
        ]
      },
      {
        path: 'fee',
        component: Fee,
        redirect: '/fee/records',
        meta: { requiresAdmin: true },
        children: [
          { path: 'records', component: FRecords, meta: { title: '费用记录' } },
          { path: 'settle', component: FSettle, meta: { title: '费用结算' } },
          { path: 'refund', component: FRefund, meta: { title: '退费管理' } },
        ]
      },
      {
        path: 'used-book',
        component: UsedBook,
        redirect: '/used-book/records',
        children: [
          { path: 'records', component: URecords, meta: { title: '回收记录' } },
          { path: 'distribution', component: UDistribution, meta: { title: '旧书发放' } },
        ]
      },
      { path: 'orders', component: Orders, meta: { title: '订购管理' } },
      { path: 'reports', component: Reports, meta: { title: '报表统计', requiresAdmin: true } },
      { path: 'system', component: System, meta: { title: '系统管理', requiresAdmin: true } },
      { path: 'urban-planning', component: UrbanPlanning, meta: { title: '城市规划展板' } },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.path === '/login') {
    if (token) return next('/')
    return next()
  }

  if (!token) return next('/login')

  if (to.matched.some(r => r.meta.requiresAdmin)) {
    if (user && user.roles && user.roles.includes('管理员')) return next()
    return next('/')
  }

  next()
})

export default router