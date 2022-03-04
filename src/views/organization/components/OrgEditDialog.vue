<template>
  <sst-dialog
    :title="title"
    :visible.sync="visibleDialog"
    width="40%"
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
      size="mini"
      :model="form"
      :column="column"
      label-width="100px"
    />
  </sst-dialog>
</template>

<script>
import { addOrg, editOrg, getUserList } from '@/api/modules/organization'
export default {
    name: 'OrgEditDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        parentId: {
            type: String,
            default: ''
        },
        editOrg: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            form: {
                name: '',
                code: '',
                description: '',
                header: ''
            },
            userList: []
        }
    },
    computed: {
        title() {
            return this.isEdit ? '编辑部门' : '新增部门'
        },
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
                    prop: 'name',
                    label: '部门名称',
                    rules: {
                        required: true,
                        message: '部门名称不能为空',
                        trigger: 'blur'
                    },
                    render: (h, form) => (
                        <el-input
                            v-model={form.name}
                            placeholder='请输入部门名称'
                            clearable
                        />
                    )
                },
                {
                    prop: 'code',
                    label: '部门编码',
                    rules: {
                        required: true,
                        message: '部门编码不能为空',
                        trigger: 'blur'
                    },
                    render: (h, form) => (
                        <el-input
                            v-model={form.code}
                            placeholder='请输入部门编码'
                            clearable
                        />
                    )
                },
                {
                    prop: 'header',
                    label: '部门领导',
                    render: (h, form) => {
                        const options = this.userList.map(item => <el-option label={item.userName} value={item.id} />)
                        return <el-select style='width:100%' v-model={form.header} filterable placeholder='请选择部门领导'>{options}</el-select>
                    }
                },
                {
                    prop: 'description',
                    label: '部门描述',
                    render: (h, form) => (
                        <el-input
                            type='textarea'
                            row={5}
                            v-model={form.description}
                            placeholder='部门描述'
                            clearable
                        />
                    )
                }
            ]
        }
    },
    methods: {
        handleOpen() {
            this.fetchUserList()
            if (this.isEdit) {
                this.$nextTick(() => {
                    Object.assign(this.form, this.editOrg)
                })
            }
        },
        async fetchUserList() {
            try {
                const query = {
                    pageNumber: 1,
                    pageSize: 1000
                }
                const res = await getUserList(query)
                this.userList = res.retList || []
            } catch {
                this.userList = []
            }
        },

        /**
         * 保存
         */
        handleConfirm() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    try {
                        this.loading = true
                        if (this.isEdit) {
                            await editOrg({ ...this.form })
                            this.$message.success('编辑成功')
                        } else {
                            await addOrg({
                                ...this.form,
                                parentId: this.parentId
                            })
                            this.$message.success('新增成功')
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
            this.$emit('reset')
            this.$refs.form.resetFields()
        }
    }
}
</script>
