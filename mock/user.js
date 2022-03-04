
const tokens = {
    admin: {
        token: 'admin-token'
    },
    editor: {
        token: 'editor-token'
    }
}

const users = {
    'admin-token': {
        id: 1,
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

module.exports = [
    // user login
    {
        url: '/login',
        type: 'post',
        response: config => {
            const { userName } = config.body
            const token = tokens[userName]

            // mock error
            if (!token) {
                return {
                    code: 401,
                    message: '账号或密码错误.'
                }
            }

            return {
                code: 200,
                data: token
            }
        }
    },

    // get user info
    {
        url: '/user/getCurrentUserInfo',
        type: 'get',
        response: config => {
            const info = users['admin-token']

            // mock error
            if (!info) {
                return {
                    code: 50008,
                    message: 'Login failed, unable to get user details.'
                }
            }

            return {
                code: 200,
                data: info
            }
        }
    },

    // user logout
    {
        url: '/logout',
        type: 'post',
        response: _ => {
            return {
                code: 200,
                data: 'success'
            }
        }
    }
]
