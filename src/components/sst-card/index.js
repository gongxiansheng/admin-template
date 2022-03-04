import sstCard from './src/Card'

/* istanbul ignore next */
sstCard.install = function(Vue, option = {}) {
    const defaultOption = { shadow: 'always' }

    if ({}.toString.call(option.config) !== '[object Object]') {
        option.config = {}
    }

    Vue.prototype.$sstCard = {
        ...defaultOption,
        ...option
    }
    Vue.component(sstCard.name, sstCard)
}

export default sstCard
