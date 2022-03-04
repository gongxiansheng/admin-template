import SstSplitPane from './src/SstSplitPane'
import SplitPaneResizer from './src/SplitPaneResizer'

/* istanbul ignore next */
SstSplitPane.install = function(Vue) {
    Vue.component(SstSplitPane.name, SstSplitPane)
    Vue.component(SplitPaneResizer.name, SplitPaneResizer)
}

export default SstSplitPane
