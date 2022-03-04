import SstDialog from './src/Dialog'

SstDialog.install = function(Vue, option) {
    const defaultOption = {
        width: '50%',
        appendToBody: false,
        modalAppendToBody: true,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        destroyOnClose: false,
        canResize: false
    }

    if ({}.toString.call(option.config) !== '[object Object]') {
        option.config = {}
    }

    Vue.prototype.$sstDialog = {
        ...defaultOption,
        ...option
    }
    Vue.component(SstDialog.name, SstDialog)
}

export default SstDialog
