import { login, getInfo, refreshToken } from '@/api/modules/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

let timer = null

const getDefaultState = () => ({
    token: getToken(),
    name: '',
    avatar: '',
    userId: '',
    roleCode: '',
    auth: []
})

const state = getDefaultState()

const mutations = {
    RESET_STATE: state => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USER: (state, user) => {
        state.name = user.name
        state.userId = user.id
        state.roleCode = user.roleTypes
        state.auth = user.catalogs
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ userName: username, password }).then(response => {
                commit('SET_TOKEN', response.token)
                setToken(response.token)
                resolve()
            })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // get user info
    getInfo({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                if (!response) {
                    return reject('Verification failed, please Login again.')
                }
                dispatch('refreshToken')
                commit('SET_USER', response)
                resolve(response)
            })
                .catch(error => {
                    reject(error)
                })
        })
    },
    // 刷新token
    refreshToken({ commit }) {
        if (timer) {
            clearInterval(timer)
        }
        timer = setInterval(() => {
            refreshToken().then(res => {
                commit('SET_TOKEN', res)
                setToken(res)
            })
        }, 50 * 60 * 1000)
    },
    // user logout
    logout({ commit }) {
        return new Promise(resolve => {
            removeToken()
            resetRouter()
            commit('RESET_STATE')
            resolve()
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken()
            commit('RESET_STATE')
            resolve()
        })
    },

    // back login
    backLogin({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ userName: username, password }).then(response => {
                commit('SET_TOKEN', response.token)
                setToken(response.token)
                resolve()
            })
                .catch(error => {
                    reject(error)
                })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

