import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        component: Layout,
        children: [{
            path: '',
            name: 'Index',
            component: () => import('@/views/dashboard'),
            meta: { title: '首页', icon: 'user' }
        }]
    },
    // {
    //     path: '/role',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '',
    //             name: 'ROLE-MANAGE',
    //             component: () => import('@/views/role/index'),
    //             meta: { title: '角色管理', icon: 'role' }
    //         },
    //         {
    //             path: 'user/:id',
    //             name: 'ROLE-USER-MANAGE',
    //             hidden: true,
    //             component: () => import('@/views/roleUser/index'),
    //             meta: { title: '角色人员管理', icon: 'role' }
    //         }
    //     ]
    // },
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router
