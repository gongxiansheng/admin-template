import Cookies from 'js-cookie'
import { resize } from '@/utils'
const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    }
}

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    }
}

const actions = {
    toggleSideBar({ commit }) {
        setTimeout(() => {
            resize()
        }, 400)
        commit('TOGGLE_SIDEBAR')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
