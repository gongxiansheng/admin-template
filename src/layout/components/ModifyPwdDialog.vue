<template>
  <sst-dialog
    title="修改密码"
    :visible.sync="visibleDialog"
    width="500px"
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
      :column="columns"
      :rules="rules"
      label-width="100px"
    />
  </sst-dialog>
</template>

<script>
import { modifyPwd } from '@/api/modules/user'
import { removeToken } from '@/utils/auth'
export default {
    name: 'ModifyPwdDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const validatePassword = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入新密码'))
            } else if (value === this.form.oldPwd) {
                callback(new Error('新密码和原密码相同，请重新输入'))
            } else {
                callback()
            }
        }
        const validateRepeatPwd = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请再输入一次新密码'))
            } else if (value !== this.form.newPwd) {
                callback(new Error('两次密码输入不一致!'))
            } else if (value === this.form.oldPwd) {
                callback(new Error('新密码和原密码相同，请重新输入'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            form: {
                oldPwd: '',
                newPwd: '',
                repeat: ''
            },
            rules: {
                oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
                newPwd: [
                    { required: true, validator: validatePassword, trigger: 'change' },
                    { required: true, validator: validatePassword, trigger: 'blur' }
                ],
                repeat: [
                    { required: true, validator: validateRepeatPwd, trigger: 'change' },
                    { required: true, validator: validateRepeatPwd, trigger: 'blur' }
                ]
            },
            columns: [
                {
                    prop: 'oldPwd',
                    label: '当前密码',
                    render: (h, form) => <el-input type='password' v-model={form.oldPwd} placeholder='请输入当前密码' />
                },
                {
                    prop: 'newPwd',
                    label: '新密码',
                    render: (h, form) => <el-input type='password' v-model={form.newPwd} placeholder='请输入新密码' />
                },
                {
                    prop: 'repeat',
                    label: '确认新密码',
                    render: (h, form) => <el-input type='password' v-model={form.repeat} placeholder='请再次输入新密码' />
                }
            ]
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
                        await modifyPwd({
                            oldPwd: this.form.oldPwd,
                            newPwd: this.form.newPwd
                        })
                        this.$message.success('修改成功,请重新登录')
                        removeToken()
                        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
