import SstForm from './src/Form'

SstForm.install = function(Vue, option = {}) {
    const defaultOption = {
        emptyText: '',
        formClass: ''
    }
    Vue.prototype.$sstForm = {
        ...defaultOption,
        ...option
    }
    Vue.component(SstForm.name, SstForm)
}

export default SstForm
