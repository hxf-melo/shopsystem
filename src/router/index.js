import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('@/components/login/Login.vue')

const Home = () =>
    import ('@/views/home/Home')

const Welcome = () =>
    import ('@/components/welcome/Welcome.vue')

const Users = () =>
    import ('@/views/users/Users')

const Rights = () =>
    import ('@/views/rights/Rights')

const Roles = () =>
    import ('@/views/roles/Roles')

const Cate = () =>
    import ('@/views/goods/Cate')

const Params = () =>
    import ('@/views/goods/Params')

const List = () =>
    import ('@/views/goods/List')

const Add = () =>
    import ('@/views/goods/Add')

const Orders = () =>
    import ('@/views/orders/Orders')

const Report = () =>
    import ('@/views/report/Report')


Vue.use(VueRouter)



const routes = [{
    path: '/',
    redirect: 'Login'
}, {
    path: '/login',
    component: Login
}, {
    path: '/home',
    component: Home,
    children: [{
        path: '',
        redirect: '/welcome'
    }, {
        path: '/welcome',
        component: Welcome
    }, {
        path: '/users',
        component: Users
    }, {
        path: '/rights',
        component: Rights
    }, {
        path: '/roles',
        component: Roles
    }, {
        path: '/categories',
        component: Cate
    }, {
        path: '/params',
        component: Params
    }, {
        path: '/goods',
        component: List
    }, {
        path: '/goods/add',
        component: Add
    }, {
        path: '/orders',
        component: Orders
    }, {
        path: '/reports',
        component: Report
    }]
}]

const router = new VueRouter({
    routes,
    mode: 'history',
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const sessionStorageStr = window.sessionStorage.getItem('token')
    if (!sessionStorageStr) return next('/login')
    next()
})
export default router