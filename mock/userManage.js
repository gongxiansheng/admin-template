const list = {
    pageSize: 20,
    currentPage: 1,
    totalPage: 2,
    totalCount: 30,
    retList: [
        {
            id: 1,
            name: '龚代成',
            orgId: 1,
            password: '123456',
            remark: 'fsd',
            state: 'Disable',
            tel: '13545797897',
            userName: 'gongdaic',
            'orgName': '研发',
            'lastchPwdDate': '2021-06-15'
        }
    ]
}

module.exports = [
    // user list
    {
        url: '/user/getUserList',
        type: 'post',
        response: () => {
            return {
                code: 200,
                data: list
            }
        }
    },
    {
        url: '/user/register',
        type: 'post',
        response: config => {
            return {
                code: 200,
                msg: '新增用户成功'
            }
        }
    },
    {
        url: '/user/update',
        type: 'post',
        response: config => {
            return {
                code: 200,
                msg: '编辑用户成功'
            }
        }
    },
    {
        url: '/user/deleteByIds',
        type: 'post',
        response: config => {
            return {
                code: 200,
                msg: '删除用户成功'
            }
        }
    },
    {
        url: '/user/changePwd',
        type: 'post',
        response: config => {
            return {
                code: 200,
                msg: '修改密码成功'
            }
        }
    }
]
