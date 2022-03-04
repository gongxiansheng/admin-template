import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import project from './modules/project'
import app from './modules/app'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        project,
        app
    },
    getters
})

export default store
