import request from '@/api/request'
import URLS from '../url'

// 获取机构树
export function getOrg() {
    return request({
        url: URLS.org.tree,
        method: 'get'
    })
}

// 新增组织机构
export function addOrg(data) {
    return request({
        url: URLS.org.addOrg,
        method: 'post',
        data
    })
}

// 编辑组织机构
export function editOrg(data) {
    return request({
        url: URLS.org.editOrg,
        method: 'post',
        data
    })
}

/**
 * 删除组织机构
 * @param {string} id 机构ID
 */
export function delOrg(id) {
    return request({
        url: URLS.org.delOrg,
        method: 'get',
        params: { id }
    })
}

/**
 * 获取 员工列表
 * @param {string} id 部门ID
 */
export function getEmployee(id) {
    return request({
        url: URLS.org.employeeList,
        method: 'get',
        data: { id }
    })
}

/**
 * 获取 职务列表
 * @param {string} id 部门ID
 */
export function getJobTypes(id) {
    return request({
        url: URLS.org.jobTypeList,
        method: 'get',
        data: { id }
    })
}

/**
 * 获取 部门列表
 * @param {string} id 部门ID
 */
export function getDepartments(id) {
    return request({
        url: URLS.org.departmentList,
        method: 'get',
        data: { id }
    })
}

/**
 * 移除部门员工
 * @param {arrray} ids
 */
export function removeTreeUser(ids) {
    const formData = new FormData()
    formData.append('ids', ids)
    return request({
        url: URLS.user.remvoeTreeUser,
        method: 'post',
        data: formData
    })
}

/**
 * 添加 部门员工
 * @param {object} data
 */
export function addTreeUser(data) {
    return request({
        url: URLS.user.addTreeUser,
        method: 'post',
        data
    })
}
