<template>
  <el-dialog
    ref="dialog"
    v-dialog-drag-resize="resizeConfig"
    :title="title"
    :class="['sst-dialog', mergeConfig.hideFooter && 'is-hide-footer']"
    :visible.sync="showDialog"
    :close-on-click-modal="calcCloseOnClickModal"
    :close-on-press-escape="calcCloseOnPressEscape"
    :append-to-body="calcAppendToBody"
    :modal-append-to-body="calcModalAppendToBody"
    :width="width"
    v-bind="$attrs"
    v-on="$listeners"
    @closed="handleClosed"
    @dragDialog="handleDrag"
    @resizeDialog="handleResize"
  >
    <template #title>
      <slot name="title" />
    </template>
    <template v-if="calcDestroyOnClose ? !hideSlot : true">
      <slot />
    </template>
    <template
      v-if="!mergeConfig.hideFooter"
      #footer
    >
      <div
        class="sst-dialog__footer"
        :class="[`is-align-${mergeConfig.footerAlign}`]"
      >
        <slot name="footer">
          <el-button
            v-if="mergeConfig.showConfirm"
            type="primary"
            size="small"
            :loading="mergeConfig.confirmLoading"
            :disabled="mergeConfig.confirmDisabled"
            @click="$emit('confirm')"
          >
            {{ mergeConfig.confirmText }}
          </el-button>
          <el-button
            v-if="mergeConfig.showCancel"
            type="info"
            size="small"
            @click="handleCancel"
          >
            {{ mergeConfig.cancelText }}
          </el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script>

// SstDialog的默认参数，可通过传入props.config进行覆盖
const DefaultConfig = {
    // 是否显示【确定】按钮
    showConfirm: false,

    // 【确定】按钮文字内容
    confirmText: '确定',

    // 【确定】按钮加载状态
    confirmLoading: false,

    // 【确定】按钮禁用状态
    confirmDisabled: false,

    // 是否展示【关闭】按钮
    showCancel: true,

    // 【关闭】按钮文字内容
    cancelText: '关闭',

    // 是否隐藏底部按钮区域
    hideFooter: false,

    // 底部按钮区域对齐方式
    footerAlign: 'right',

    // 是否可以缩放
    canResize: false
}
import debounce from '../debounce'
import dialogMixin from './mixin/directiveMixin'
export default {
    name: 'SstDialog',
    mixins: [dialogMixin],

    inheritAttrs: false,
    props: {
        visible: {
            type: Boolean,
            default: false,
            required: true
        },
        config: {
            type: Object,
            default: () => ({})
        },
        appendToBody: {
            type: Boolean,
            default: undefined
        },
        modalAppendToBody: {
            type: Boolean,
            default: undefined
        },
        closeOnClickModal: {
            type: Boolean,
            default: undefined
        },
        closeOnPressEscape: {
            type: Boolean,
            default: undefined
        },
        width: {
            type: String,
            default: undefined
        },
        title: {
            type: String,
            default: ''
        },
        destroyOnClose: {
            type: Boolean,
            default: undefined
        }
    },
    data() {
        return {
            initPosition: {
                left: 0,
                top: 0
            },
            hideSlot: false
        }
    },
    computed: {
        resizeConfig() {
            return {
                position: this.initPosition,
                resize: this.mergeConfig.canResize
            }
        },
        mergeConfig() {
            return {
                ...DefaultConfig,
                ...this.$sstDialog.config,
                ...this.config
            }
        },
        showDialog: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        },
        calcWidth() {
            if (this.width !== undefined) {
                return this.width
            }
            return this.$sstDialog.width
        },
        calcAppendToBody() {
            if (this.appendToBody !== undefined) {
                return this.appendToBody
            }
            return this.$sstDialog.appendToBody
        },
        calcCloseOnClickModal() {
            if (this.closeOnClickModal !== undefined) {
                return this.closeOnClickModal
            }
            return this.$sstDialog.closeOnClickModal
        },
        calcCloseOnPressEscape() {
            if (this.closeOnPressEscape !== undefined) {
                return this.closeOnPressEscape
            }
            return this.$sstDialog.closeOnPressEscape
        },
        calcModalAppendToBody() {
            if (this.modalAppendToBody !== undefined) {
                return this.modalAppendToBody
            }
            return this.$sstDialog.modalAppendToBody
        },
        calcDestroyOnClose() {
            if (this.destroyOnClose !== undefined) {
                return this.destroyOnClose
            }
            return this.$sstDialog.destroyOnClose
        }
    },
    watch: {
        showDialog: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.hideSlot = false
                }
            }
        }
    },
    created() {
        this.calcDialogPosition()
    },
    methods: {
        async handleCancel() {
            if (this.$listeners && this.$listeners.cancel) {
                /**
                 * el-dialog before-close 仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效。
                 * 如果你在 footer 具名 slot 里添加了用于关闭 Dialog 的按钮，那么可以在按钮的点击回调函数里加入 before-close 的相关逻辑。
                 * 所以当存在cancel 逻辑时， 把$emit('update:visible', false）逻辑放到cancel 逻辑执行成功后
                 */
                await this.$emit('cancel')
            } else {
                this.$emit('update:visible', false)
            }
        },
        async handleClosed() {
            await this.$emit('closed')
            this.hideSlot = true
        },

        /**
         * 计算弹框位于窗口位置
         */
        calcDialogPosition() {
            let width = this.width || '50%'
            let top = this.$attrs.top || '15vh'
            if (width.includes('%')) {
                width = +document.body.clientWidth * (+width.replace(/%/g, '') / 100)
            } else {
                width = +width.replace(/\px/g, '')
            }
            if (top.includes('vh')) {
                top = +document.body.clientHeight * (+top.replace(/vh/g, '') / 100)
            } else {
                top = +top.replace(/\px/g, '')
            }
            this.initPosition.left = (document.body.clientWidth - width) / 2
            this.initPosition.top = top
        },
        handleDrag() {
            this.$emit('drag-dialog')
        },
        handleResize() {
            debounce(() => {
                this.$emit('resize-dialog')
            }, 800)()
        }
    }
}
</script>

<style lang="scss" scoped>
.sst-dialog {
  &::v-deep {
    .el-dialog__body {
      padding: 20px 20px 0;
    }
    &.is-hide-footer .el-dialog__body {
      padding: 20px;
    }
  }

  &__footer {
    width: 100%;
    display: flex;
    &.is-align-right {
      justify-content: flex-end;
    }
    &.is-align-center {
      justify-content: center;
    }
    &.is-align-left {
      justify-content: flex-start;
    }
  }
}
</style>
