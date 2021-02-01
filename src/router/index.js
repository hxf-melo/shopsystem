import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('@/components/common/login/Login.vue')

const Home = () =>
    import ('@/views/home/Home')

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: 'Login'
}, {
    path: '/login',
    component: Login
}, {
    path: '/home',
    component: Home
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