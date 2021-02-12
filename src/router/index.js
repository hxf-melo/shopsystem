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