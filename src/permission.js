import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { ROLE_TYPE } from './lib'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)

    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            const hasGetUserInfo = store.getters.name
            if (hasGetUserInfo) {
                const roleCode = store.getters.roleCode
                const isSuperAdmin = roleCode.indexOf(ROLE_TYPE.superAdmin) > -1
                if (!isSuperAdmin && ['USER-MANAGE', 'ORG-MANAGE', 'ROLE-MANAGE', 'ROLE-USER-MANAGE'].includes(to.name)) {
                    Message.error('暂无权限访问该页面')
                    NProgress.done()
                    next(false)
                } else {
                    next()
                }
                // next()
            } else {
                try {
                    await store.dispatch('user/getInfo')
                    const roleCode = store.getters.roleCode
                    const isSuperAdmin = roleCode.indexOf(ROLE_TYPE.superAdmin) > -1
                    if (isSuperAdmin) {
                        next()
                    } else {
                        next('/')
                    }
                    // next()
                } catch (error) {
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else if (whiteList.indexOf(to.path) !== -1) {
        next()
    } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
    }
})

router.afterEach(() => {
    NProgress.done()
})
