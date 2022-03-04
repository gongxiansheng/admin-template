<template>
  <sst-dialog
    title="重置密码"
    :visible.sync="visibleDialog"
    width="400px"
    top="10vh"
    :config="{
      confirmLoading: loading,
      showConfirm: true
    }"
    @closed="reset"
    @confirm="handleConfirm"
  >
    <sst-form
      ref="form"
      size="mini"
      :model="form"
      :column="column"
      label-width="100px"
    />
  </sst-dialog>
</template>

<script>
import { resetPwd } from '@/api/modules/user'
export default {
    name: 'ResetPwdDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        resetId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            form: { newPwd: '' }
        }
    },
    computed: {
        visibleDialog: {
            get() {
                return this.visible
            },
            set(value) {
                this.$emit('update:visible', value)
            }
        },
        column() {
            return [
                {
                    prop: 'newPwd',
                    label: '新密码',
                    rules: {
                        required: true,
                        message: '新密码不能为空',
                        trigger: 'blur'
                    },
                    render: (h, form) => (
                        <el-input
                            type='password'
                            v-model__trim={form.newPwd}
                            placeholder='请输入新密码'
                            clearable
                        />
                    )
                }
            ]
        }
    },
    methods: {
        /**
         * 保存
         */
        handleConfirm() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    try {
                        this.loading = true
                        await resetPwd({ ...this.form, id: this.resetId })
                        this.$message.success('重置密码成功')
                        this.visibleDialog = false
                    } finally {
                        this.loading = false
                    }
                } else {
                    return false
                }
            })
        },
        reset() {
            this.$refs.form.resetFields()
        }
    }
}
</script>
