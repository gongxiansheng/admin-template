<template>
  <div
    :class="classnames"
    :style="{ cursor, userSelect }"
    @mousedown="onMouseDown"
  >
    <slot />
  </div>
</template>

<script>
const LAYOUT_HORIZONTAL = 'horizontal'
const LAYOUT_VERTICAL = 'vertical'

export default {
    name: 'SstSplitPane',

    props: {
        layout: {
            type: String,
            default: LAYOUT_VERTICAL
        }
    },

    data() {
        return { isResizing: false }
    },

    computed: {
        classnames() {
            return [
                'splitpane',
                'layout-' + this.layout.slice(0, 1),
                this.isResizing ? 'is-resizing' : ''
            ]
        },
        cursor() {
            return this.isResizing
                ? this.layout === LAYOUT_VERTICAL ? 'col-resize' : 'row-resize'
                : ''
        },
        userSelect() {
            return this.isResizing ? 'none' : ''
        }
    },

    methods: {
        onMouseDown({ target: resizer, pageX: initialPageX, pageY: initialPageY }) {
            if (resizer.className && typeof resizer.className === 'string' && resizer.className.match('splitpane-resizer')) {
                const self = this
                const { $el: container, layout } = self

                const pane = resizer.previousElementSibling
                const {
                    offsetWidth: initialPaneWidth,
                    offsetHeight: initialPaneHeight
                } = pane

                const usePercentage = !!(pane.style.width + '').match('%')

                const { addEventListener, removeEventListener } = window

                const resize = (initialSize, offset = 0) => {
                    if (layout === LAYOUT_VERTICAL) {
                        const containerWidth = container.clientWidth
                        const paneWidth = initialSize + offset

                        return (pane.style.width = usePercentage
                            ? paneWidth / containerWidth * 100 + '%'
                            : paneWidth + 'px')
                    }

                    if (layout === LAYOUT_HORIZONTAL) {
                        const containerHeight = container.clientHeight
                        const paneHeight = initialSize + offset

                        return (pane.style.height = usePercentage
                            ? paneHeight / containerHeight * 100 + '%'
                            : paneHeight + 'px')
                    }
                }

                // This adds is-resizing class to container
                self.isResizing = true

                // Resize once to get current computed size
                let size = resize()

                // Trigger paneResizeStart event
                self.$emit('paneResizeStart', pane, resizer, size)

                const onMouseMove = function({ pageX, pageY }) {
                    size = layout === LAYOUT_VERTICAL
                        ? resize(initialPaneWidth, pageX - initialPageX)
                        : resize(initialPaneHeight, pageY - initialPageY)

                    self.$emit('paneResize', pane, resizer, size)
                }

                const onMouseUp = function() {
                    // Run resize one more time to set computed width/height.
                    size = layout === LAYOUT_VERTICAL
                        ? resize(pane.clientWidth)
                        : resize(pane.clientHeight)

                    // This removes is-resizing class to container
                    self.isResizing = false

                    removeEventListener('mousemove', onMouseMove)
                    removeEventListener('mouseup', onMouseUp)

                    self.$emit('paneResizeStop', pane, resizer, size)
                }

                addEventListener('mousemove', onMouseMove)
                addEventListener('mouseup', onMouseUp)
            }
        }
    }
}

</script>

<style lang="scss">
.splitpane {
    display: flex;
    width: 100%;
    height: 100%;
    &.layout-h {
        flex-direction: column;
    }

    &.layout-v {
        flex-direction: row;
    }
}

.splitpane > div {
  position: relative;
  z-index: 1;
}

.splitpane-resizer {
  display: block;
  position: relative;
  z-index: 2;
}

.layout-h > .splitpane-resizer {
  width: 100%;
  height: 5px;
  cursor: row-resize;
}
.layout-h > .splitpane-resizer:before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 3px;
    margin-left: -20px;
    margin-top: -1.5px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}
.layout-h > .splitpane-resizer:hover:before {
    border-color: #999;
}
.layout-v > .splitpane-resizer {
  width: 10px;
  height: 100%;
//   margin-left: -5px;
//   margin-right: 5px;
//   left: 5px;
  cursor: col-resize;
}
</style>
