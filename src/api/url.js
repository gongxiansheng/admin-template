export default {
    login: '/user/login',
    logout: '/user/logout',
    getInfo: '/user/getCurrentUserInfo',
    refreshToken: '/user/refreshToken',

    delFile: fileRefId => `/project/file/remove/${fileRefId}`,
    copyProject: '/project/copy',
    copyFile: '/project/file/copy',
    export: (type, id) => `project/export/${type}/${id}`,

    project: {
        list: '/project/list',
        add: '/project/add',
        edit: '/project/rename',
        del: projectId => `/project/delete/${projectId}`,
        lock: projectId => `/project/lock/${projectId}`,
        unlock: projectId => `/project/unlock/${projectId}`,
        upload: '/project/file/upload',
        download: fileId => `/project/file/download/${fileId}`,
        fileList: '/project/files',
        sum: '/project/sumData',
        getTemplate: projectId => `/project/template/${projectId}`,
        postTemplate: '/project/template/'
    },

    catalog: {
        add: '/project/catalog/add',
        edit: '/project/catalog/rename',
        del: (projectId, catalogId) => `/project/catalog/delete/${projectId}/${catalogId}`,
        lock: (projectId, catalogId) => `/project/catalog/lock/${projectId}/${catalogId}`,
        unlock: (projectId, catalogId) => `/project/catalog/unlock/${projectId}/${catalogId}`,
        fileList: (projectId, catalogId) => `/project/catalog/files/${projectId}/${catalogId}`
    },

    user: {
        list: '/user/getUserList',
        add: '/user/register',
        del: '/user/deleteByIds',
        edit: '/user/update',
        modifyPwd: '/user/changePwd',
        resetPwd: '/user/resetPwd',
        remvoeTreeUser: '/user/removeOrg',
        addTreeUser: '/user/updateOrg'
    },

    org: {
        tree: '/org/treeOrg',
        addOrg: '/org/addSystemOrg',
        editOrg: '/org/update',
        delOrg: '/org/deleteById',
        employeeList: '/employee',
        jobTypeList: '/job',
        departmentList: '/department'
    },

    role: {
        types: '/role/type/list',
        list: '/role/list',
        add: '/role/add',
        edit: '/role/update',
        del: '/role/remove',
        auth: roleId => `/role/catalog/list/${roleId}`,
        userList: id => `/role/user/list/${id}`,
        remvoeRoleUser: '/role/user/remove',
        addRoleUser: '/role/user/add'
    }

}
