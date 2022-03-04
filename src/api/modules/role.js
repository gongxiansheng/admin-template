import request from '@/api/request'
import URLS from '../url'

// 获取角色类型
export function getRoleTypeList() {
    return request({
        url: URLS.role.types,
        method: 'post'
    })
}
// 获取角色列表
export function getRoleList(data) {
    return request({
        url: URLS.role.list,
        method: 'post',
        data
    })
}

// 新增角色
export function addRole(data) {
    return request({
        url: URLS.role.add,
        method: 'post',
        data
    })
}

// 编辑角色
export function editRole(data) {
    return request({
        url: URLS.role.edit,
        method: 'post',
        data
    })
}

/**
 * 删除角色
 */
export function delRole(data) {
    return request({
        url: URLS.role.del,
        method: 'post',
        data
    })
}

/**
 * 获取 角色人员列表
 * @param {string} id 角色ID
 */
export function getRoleUserList(id) {
    return request({
        url: URLS.role.userList(id),
        method: 'get'
    })
}

/**
 * 移除 角色人员
 * @param {arrray} ids
 */
export function removeRoleUser(data) {
    return request({
        url: URLS.role.remvoeRoleUser,
        method: 'post',
        data
    })
}

/**
 * 添加 角色人员
 * @param {object} data
 */
export function addRoleUser(data) {
    return request({
        url: URLS.role.addRoleUser,
        method: 'post',
        data
    })
}

/**
 * 查看角色 目录权限
 */
export function searchAuth(roleId) {
    return request({
        url: URLS.role.auth(roleId),
        method: 'get'
    })
}
