<template>
  <sst-dialog
    :title="title"
    :visible.sync="visibleDialog"
    width="500px"
    top="10vh"
    :config="{
      confirmLoading: loading,
      showConfirm: true
    }"
    @open="handleOpen"
    @closed="reset"
    @confirm="handleConfirm"
  >
    <sst-form
      ref="form"
      size="small"
      :model="form"
      :column="column"
      label-width="100px"
    />
  </sst-dialog>
</template>

<script>
import { editUser, addUser } from '@/api/modules/user'
import { getOrg } from '@/api/modules/organization'
import { accountStatus } from '@/lib'
import { validTelephone } from '@/utils/validate'
export default {
    name: 'UserManageDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: null
        }
    },
    data() {
        const validPhone = (rule, value, callback) => {
            if (value && !validTelephone(value)) {
                callback(new Error('请输入正确的11位手机号码'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            form: {
                name: '',
                userName: '',
                password: '',
                orgId: '',
                state: 'Disable'
            },
            treeProps: {
                children: 'children',
                label: 'name',
                value: 'id'
            },
            treeData: [],
            accountStatus,
            rules: {
                name: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }],
                tel: [{ required: false, validator: validPhone, trigger: 'blur' }]
            }
        }
    },
    computed: {
        title() {
            return this.isEdit ? '编辑用户' : '新增用户'
        },
        column() {
            return [
                {
                    prop: 'userName',
                    label: '账号',
                    rules: {
                        required: true,
                        message: '账号不能为空',
                        trigger: 'blur'
                    },
                    render: (h, form) => (
                        <el-input
                            vModel_trim={form.userName}
                            placeholder='请输入账号'
                            disabled={this.isEdit}
                            clearable
                        />
                    )
                },
                {
                    prop: 'password',
                    label: '密码',
                    rules: [{
                        required: !this.isEdit,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }, { min: 6, max: 20, message: '密码长度为6至20', trigger: 'blur' }],
                    render: (h, form) => (
                        <el-input
                            type='password'
                            vModel_trim={form.password}
                            placeholder='请输入密码'
                            disabled={this.isEdit}
                            clearable
                        />
                    )
                },
                {
                    prop: 'name',
                    label: '用户姓名',
                    rules: {
                        required: true,
                        message: '用户姓名不能为空',
                        trigger: 'blur'
                    },
                    render: (h, form) => (
                        <el-input
                            vModel_trim={form.name}
                            placeholder='请输入用户姓名'
                            clearable
                        />
                    )
                },
                {
                    prop: 'orgId',
                    label: '部门',
                    render: (h, form) => {
                        const bind = {
                            props: { ...this.treeProps },
                            data: this.treeData,
                            defaultExpandAll: true,
                            checkStrictly: true,
                            renderContent: this.renderContent
                        }
                        return (
                            <el-select-tree
                                style='width:100%'
                                {...{ attrs: bind }}
                                vModel={form.orgId}
                                placeholder='请选择部门'
                                clearable
                            />
                        )
                    }
                }
            ]
        },
        visibleDialog: {
            get() {
                return this.visible
            },
            set(value) {
                this.$emit('update:visible', value)
            }
        }
    },
    created() {
        this.fetchDepartment()
    },
    methods: {
        // 获取部门
        async fetchDepartment() {
            const tree = await getOrg()
            this.treeData = tree
        },
        handleOpen() {
            if (this.isEdit) {
                this.$nextTick(() => {
                    Object.assign(this.form, this.user)
                })
            }
        },
        // 保存
        handleConfirm() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    try {
                        this.loading = true
                        if (this.isEdit) {
                            await editUser({
                                name: this.form.name,
                                orgId: this.form.orgId,
                                tel: this.form.tel,
                                remark: this.form.remark,
                                id: this.user.id
                            })
                            this.$message.success('编辑用户成功')
                        } else {
                            await addUser(this.form)
                            this.$message.success('新增用户成功')
                        }
                        this.$emit('refresh')
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
            this.$emit('reset')
        },
        renderContent(h, { data }) {
            return (
                <span class='org-tree-node el-select-tree__item'>
                    {
                        (
                            data.name.length > 10
                                ? <el-tooltip content={data.name} open-delay={800}>
                                    <span class='name'>{data.name.substr(0, 10)}...</span>
                                </el-tooltip>
                                : <span class='name'>{data.name}</span>
                        )
                    }
                </span>)
        }
    }
}
</script>
