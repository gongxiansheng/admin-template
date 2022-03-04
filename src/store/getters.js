const getters = {
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    roleCode: state => state.user.roleCode,
    name: state => state.user.name,
    auth: state => state.user.auth
}
export default getters
