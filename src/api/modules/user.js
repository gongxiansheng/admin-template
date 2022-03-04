import request from '@/api/request'
import URLS from '../url'

/**
 * 登录
 * @param {object} data
 */
export function login(data) {
    return request({
        url: URLS.login,
        method: 'post',
        data
    })
}

/**
 * 获取用户信息
 */
export function getInfo() {
    return request({
        url: URLS.getInfo,
        method: 'get'
    })
}

/**
 * 定时刷新token,保持登录态
 */
export function refreshToken() {
    return request({
        url: URLS.refreshToken,
        method: 'get'
    })
}

/**
 * 登出
 */
export function logout() {
    return request({
        url: URLS.logout,
        method: 'get'
    })
}

// 修改密码
export function modifyPwd(data) {
    return request({
        url: URLS.user.modifyPwd,
        method: 'post',
        data
    })
}

/**
 * 获取用户列表
 * @param {object} data
 */
export function getUserList(data) {
    return request({
        url: URLS.user.list,
        method: 'post',
        data
    })
}

/**
 * 添加用户
 * @param {object} data
 */
export function addUser(data) {
    return request({
        url: URLS.user.add,
        method: 'post',
        data
    })
}

/**
 * 批量删除用户
 * @param {Array} ids
 */
export function delUser(ids) {
    const formData = new FormData()
    formData.append('ids', ids)
    return request({
        url: URLS.user.del,
        method: 'post',
        data: formData
    })
}

/**
 * 编辑用户
 * @param {object} data
 */
export function editUser(data) {
    return request({
        url: URLS.user.edit,
        method: 'post',
        data
    })
}

/**
 * 重置密码
 * @param {object} data
 */
export function resetPwd(data) {
    return request({
        url: URLS.user.resetPwd,
        method: 'post',
        data
    })
}

/**
 * 更新状态
 * @param {object} data
 */
export function updateState(data) {
    return request({
        url: URLS.user.updateState,
        method: 'post',
        data
    })
}
