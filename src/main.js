import Vue from 'vue'
import 'normalize.css/normalize.css'
import './assets/font-awesome/css/font-awesome.min.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'
import Avatar from '@/components/Avatar'

import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@/permission'
import SearchBar from '@/components/SearchBar'
import SstTable from '@/components/sst-table'
import SstForm from '@/components/sst-form'
import SstDialog from '@/components/sst-dialog'
import SstCard from '@/components/sst-card'
import SstSplitPane from '@/components/sst-splitpane'

import ElSelectTree from 'el-select-tree'
Vue.use(ElSelectTree)

import * as dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import Contextmenu from 'vue-contextmenujs'
Vue.use(Contextmenu)

Vue.use(SearchBar)
Vue.use(SstSplitPane)
Vue.use(SstForm, { emptyText: '-' })
Vue.use(SstCard)
Vue.use(SstTable, {
    colAlign: 'center',
    colHeaderAlign: 'center',
    colEmptyText: '-',
    pagerOffset: 10
})
Vue.use(SstDialog, {
    appendToBody: true,
    closeOnClickModal: false
})
Vue.use(Avatar)
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$eventbus = new Vue()
// eslint-disable-next-line vue/require-name-property
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
