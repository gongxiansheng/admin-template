// 账号状态
export const accountStatus = [
    { label: '启用', value: 'Normal', key: 'normal' },
    { label: '停用', value: 'Disable', key: 'disable' },
    { label: '锁定', value: 'Locking', key: 'locking' }
]

export const accountStateMap = {}
accountStatus.forEach(item => {
    accountStateMap[item.key] = item.value
})

// 字典状态
export const dictStatus = [
    { label: '启用', value: '2', key: 'normal' },
    { label: '停用', value: '1', key: 'disable' }
]
export const dictStateMap = {}
dictStatus.forEach(item => {
    dictStateMap[item.key] = item.value
})

// 系统备份方式
export const backupTypes = [
    { label: '自动', value: '1' },
    { label: '手动', value: '2' }
]

// 系统备份状态
export const backupStatus = [
    { label: '成功', value: 'success' },
    { label: '失败', value: 'fail' }
]

// 系统错误信息 定义者
export const definerMap = [
    { label: '系统', value: '1', key: 'system' },
    { label: '自定义', value: '2', key: 'custom' }
]
export const definers = {}
definerMap.forEach(item => {
    definers[item.key] = item.value
})

// 系统错误信息 状态
export const errorInfoStatusMap = [
    { label: '停用', value: '1' },
    { label: '启用', value: '2' }
]

// 角色类型
export const ROLE_TYPE = {
    admin: 'admin',
    office: 'officeAdmin',
    common: 'commonUser',
    superAdmin: 'superAdmin',
    readOnly: 'readOnly'
}
