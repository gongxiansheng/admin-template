const getDefaultState = () => ({
    projectTree: [],
    focus: null
})

const state = getDefaultState()

const mutations = {
    RESET_STATE: state => {
        Object.assign(state, getDefaultState())
    },
    STORE_PROJECT: (state, projects) => {
        state.projectTree = projects
    },
    FOCUS_NODE: (state, node) => {
        state.focus = node
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

