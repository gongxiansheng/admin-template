import request from '@/api/request'
import URLS from '../url'

// 获取项目列表
export function getProjectList() {
    return request({
        url: URLS.project.list,
        method: 'get'
    })
}

// 新增项目
export function addProject(data) {
    return request({
        url: URLS.project.add,
        method: 'post',
        data
    })
}

// 编辑项目
export function editProject(data) {
    return request({
        url: URLS.project.edit,
        method: 'post',
        data
    })
}

/**
 * 删除项目
 * @param {string} id 项目ID
 */
export function delProject(id) {
    return request({
        url: URLS.project.del(id),
        method: 'get'
    })
}

/**
 * 冻结项目
 * @param {string} id 项目id/节点id
 */
export function lockProject(id) {
    return request({
        url: URLS.project.lock(id),
        method: 'get'
    })
}

/**
 * 解冻项目
 * @param {string} id 项目id/节点id
 */
export function unlockProject(id) {
    return request({
        url: URLS.project.unlock(id),
        method: 'get'
    })
}

// 新增目录
export function addCatalog(data) {
    return request({
        url: URLS.catalog.add,
        method: 'post',
        data
    })
}

// 编辑目录
export function editCatalog(data) {
    return request({
        url: URLS.catalog.edit,
        method: 'post',
        data
    })
}

/**
 * 删除目录
 * @param {string} projectId 项目ID
 * @param {string} catalogId 目录ID
 */
export function delCatalog(projectId, catalogId) {
    return request({
        url: URLS.catalog.del(projectId, catalogId),
        method: 'get'
    })
}

/**
 * 冻结目录
 * @param {string} projectId 项目ID
 * @param {string} catalogId 目录ID
 */
export function lockCatalog(projectId, catalogId) {
    return request({
        url: URLS.catalog.lock(projectId, catalogId),
        method: 'get'
    })
}

/**
 * 解冻目录
 * @param {string} projectId 项目ID
 * @param {string} catalogId 目录ID
 */
export function unlockCatalog(projectId, catalogId) {
    return request({
        url: URLS.catalog.unlock(projectId, catalogId),
        method: 'get'
    })
}

/**
 * 上传
 */
export function uploadFile(data) {
    return request({
        url: URLS.project.upload,
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
}

/**
 * 下载
 * @param {string} fileId 文件id
 */
export function downloadFile(fileId) {
    return request({
        url: URLS.project.download(fileId),
        method: 'get',
        responseType: 'arraybuffer'
    })
}

/**
 * 删除文件
 * @param {string} fileId 文件id
 */
export function deleteFile(fileId) {
    return request({
        url: URLS.delFile(fileId),
        method: 'get'
    })
}

/**
 * 拷贝目录或项目
 */
export function copyProject(data) {
    return request({
        url: URLS.copyProject,
        method: 'post',
        data
    })
}

/**
 * 拷贝附件
 */
export function copyFile(data) {
    return request({
        url: URLS.copyFile,
        method: 'post',
        data
    })
}

/**
 * 查询附件列表
 */
export function getAttachments(data) {
    return request({
        url: URLS.project.fileList,
        method: 'post',
        data
    })
}

/**
 * 导出
 */
export function exportProject(type, id) {
    return request({
        url: URLS.export(type, id),
        method: 'get',
        responseType: 'blob'
    })
}

/**
 * 汇总
 */
export function sumProject(data) {
    return request({
        url: URLS.project.sum,
        method: 'post',
        data
    })
}

/**
 * 汇总模板
 * @param {string} id 项目id
 */
export function getProjectTemplate(id) {
    return request({
        url: URLS.project.getTemplate(id),
        method: 'get'
    })
}

/**
 * 上传汇总模板
 */
export function postProjectTemplate(data) {
    return request({
        url: URLS.project.postTemplate,
        method: 'post',
        data
    })
}
