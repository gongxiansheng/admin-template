import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 1000 * 60 * 5,
    validateStatus: function(status) {
        return status >= 200 && status < 500 // Reject only if the status code is greater than or equal to 500
    }
})

// request interceptor
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['sst-auth-token'] = getToken()
        }
        return config
    },
    error => Promise.reject(error)
)

// response interceptor
service.interceptors.response.use(
    response => {
        const { data, status, headers } = response
        if (headers['content-disposition']) {
            return response
        }

        if (status === 401 || data.code === 401) {
            Message({
                message: '登录态失效，请重新登录',
                type: 'error',
                duration: 4 * 1000
            })
            store.dispatch('user/resetToken').then(() => {
                location.reload()
            })
            return Promise.reject(new Error('登录态失效，请重新登录'))
        } else if (data.code === 200) {
            return data.data
        } else {
            Message({
                message: data.msg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(new Error(data.msg || 'Error'))
        }
    },
    error => {
        console.error(error)
        Message({
            message: error.msg || '未知错误',
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
