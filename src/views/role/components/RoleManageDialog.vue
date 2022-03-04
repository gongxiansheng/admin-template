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
import { addRole, editRole, searchAuth } from '@/api/modules/role'
import { getProjectList } from '@/api/modules/project'
import { generateTree } from '@/utils'
import { ROLE_TYPE } from '@/lib'
export default {
    name: 'RoleManageDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        },
        roleTypes: {
            type: Array,
            default: () => []
        },
        editRow: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            form: {
                roleName: '',
                roleTypeId: '',
                roleCatalogs: []
            },
            treeProps: {
                children: 'children',
                label: 'name',
                value: 'id'
            },
            checkRoleCatalogs: [],
            projects: [],
            flatProjects: []
        }
    },
    computed: {
        title() {
            return this.isEdit ? '编辑角色' : '新增角色'
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
                    prop: 'roleName',
                    label: '角色名称',
                    rules: {
                        required: true,
                        message: '角色名称不能为空',
                        trigger: 'blur'
                    },
                    render: (h, form) => (
                        <el-input
                            v-model={form.roleName}
                            placeholder='请输入角色名称'
                            clearable
                        />
                    )
                },
                {
                    prop: 'roleTypeId',
                    label: '角色类型',
                    rules: {
                        required: true,
                        message: '角色类型不能为空',
                        trigger: 'blur'
                    },
                    render: (h, form) => {
                        const options = this.roleTypes.map(item => <el-option label={item.typeName} value={item.id} />)
                        return <el-select style='width:100%' disabled={this.isEdit} v-model={form.roleTypeId} filterable placeholder='请选择角色类型'>{options}</el-select>
                    }
                },
                {
                    prop: 'roleCatalogs',
                    label: '权限配置',
                    show: form => {
                        const role = this.roleTypes.find(item => item.id === form.roleTypeId)
                        return role ? ![ROLE_TYPE.admin, ROLE_TYPE.superAdmin].includes(role.typeCode) : false
                    },
                    render: (h, form) => {
                        const bind = {
                            props: { ...this.treeProps },
                            data: this.projects,
                            checkStrictly: true,
                            showCheckbox: true,
                            filterable: true,
                            collapseTags: true,
                            multiple: true,
                            renderContent: this.renderContent
                        }
                        return (
                            <el-select-tree
                                style='width:100%'
                                {...{ attrs: bind }}
                                vModel={form.roleCatalogs}
                                placeholder='请配置权限'
                                clearable
                            />
                        )
                    }
                }
            ]
        }
    },
    created() {
        this.handleOpen()
    },
    methods: {
        handleOpen() {
            this.fetchProjectList()
            if (this.isEdit) {
                this.fetchAuth()
                this.$nextTick(() => {
                    Object.assign(this.form, this.editRow)
                })
            }
        },
        async fetchAuth() {
            const res = await searchAuth(this.editRow.id)
            this.form.roleCatalogs = res.map(item => item.catalogId)
        },
        handleCheckChange(data, { checkedKeys, checkedNodes }) {
            this.form.roleCatalogs = checkedKeys
        },
        async fetchProjectList() {
            try {
                const res = await getProjectList()
                this.generateTree(res)
            } catch {
                this.projects = []
            }
        },
        generateTree(projects) {
            const tree = []
            projects.forEach(project => {
                const data = project.catalogs.map(item => ({
                    ...item,
                    projectName: project.projectName,
                    parentId: item.parentId ? item.parentId : undefined,
                    name: item.catalogName,
                    isProject: false
                }))
                this.flatProjects.push(...data)
                const children = generateTree(data)
                const root = {
                    projectId: project.id,
                    name: project.projectName,
                    projectName: project.projectName,
                    id: project.id,
                    dataOrder: project.dataOrder,
                    locked: project.locked,
                    isProject: true,
                    children: children
                }
                this.flatProjects.push(root)
                tree.push(root)
            })
            this.projects = tree
        },

        /**
         * 保存
         */
        handleConfirm() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    try {
                        this.loading = true
                        const filter = this.flatProjects.filter(item => this.form.roleCatalogs.includes(item.id))
                        const roleCatalogs = filter.map(item => ({
                            catalogType: item.isProject ? 0 : 1,
                            catalogId: item.id,
                            projectId: item.projectId
                        }))
                        const params = {
                            ...this.form,
                            roleCatalogs
                        }
                        if (this.isEdit) {
                            await editRole(params)
                            this.$message.success('编辑成功')
                        } else {
                            await addRole(params)
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
        },
        renderContent(h, { data }) {
            return (
                <span class='el-select-tree__item'>
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
