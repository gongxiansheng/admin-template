import SstTable from './src/Table'

/* istanbul ignore next */
SstTable.install = function(Vue, option = {}) {
    const defaultOption = {
        colAlign: null,
        colHeaderAlign: null,
        pagerOffset: 0,
        tablePadding: 0,
        colEmptyText: '',
        customClassName: '',
        colShowOverflowTooltip: false
    }
    Vue.prototype.$sstTable = {
        ...defaultOption,
        ...option
    }
    Vue.component(SstTable.name, SstTable)
}

export default SstTable
