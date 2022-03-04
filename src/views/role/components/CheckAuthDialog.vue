<template>
  <sst-dialog
    :title="title"
    :visible.sync="visibleDialog"
    width="500px"
    top="10vh"
    :config="{
      hideFooter: true
    }"
  >
    <div
      v-loading="loading"
      class="tree"
    >
      <el-scrollbar ref="scroll">
        <el-tree
          ref="tree"
          show-checkbox
          :data="projectData"
          :default-expand-all="true"
          node-key="id"
          :default-checked-keys="defaultCheckedKeys"
          :check-strictly="true"
          :render-content="renderContent"
        />
      </el-scrollbar>
    </div>
  </sst-dialog>
</template>

<script>
import { searchAuth } from '@/api/modules/role'
import { getProjectList } from '@/api/modules/project'
import { generateTree } from '@/utils'
import { ROLE_TYPE } from '@/lib'
export default {
    name: 'CheckAuthDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        row: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            treeProps: {
                children: 'children',
                label: 'name',
                value: 'id'
            },
            projects: [],
            defaultCheckedKeys: []
        }
    },
    computed: {
        title() {
            return `查看权限（${this.row.roleName}）`
        },
        visibleDialog: {
            get() {
                return this.visible
            },
            set(value) {
                this.$emit('update:visible', value)
            }
        },
        isAdmin() {
            return [ROLE_TYPE.admin, ROLE_TYPE.superAdmin].includes(this.row.roleTypeCode)
        },
        projectData() {
            const tree = []
            this.projects.forEach(project => {
                const data = project.catalogs.map(item => ({
                    ...item,
                    parentId: item.parentId ? item.parentId : undefined,
                    label: item.catalogName,
                    disabled: true
                }))
                const children = generateTree(data)
                const root = {
                    label: project.projectName,
                    id: project.id,
                    children: children,
                    disabled: true
                }
                tree.push(root)
            })
            return tree
        }

    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.loading = true
            Promise.all([this.fetchProjectList(), this.fetchAuth()]).then(res => {
                this.projects = res[0]
                if (this.isAdmin) {
                    this.projects.forEach(project => {
                        const data = project.catalogs.map(item => item.id)
                        this.defaultCheckedKeys.push(...data, project.id)
                    })
                } else {
                    this.defaultCheckedKeys = res[1].map(item => item.catalogId)
                }
            })
                .finally(() => {
                    this.loading = false
                })
        },
        async fetchProjectList() {
            try {
                const res = await getProjectList()
                return res
            } catch (error) {
                console.error(error)
            }
        },
        async fetchAuth() {
            try {
                const res = await searchAuth(this.row.id)
                return res
            } catch (error) {
                console.error(error)
            }
        },
        renderContent(h, { data }) {
            return (
                <span class='el-select-tree__item'>
                    {
                        (
                            data.label.length > 10
                                ? <el-tooltip content={data.label} open-delay={800}>
                                    <span class='name'>{data.label.substr(0, 10)}...</span>
                                </el-tooltip>
                                : <span class='name'>{data.label}</span>
                        )
                    }
                </span>)
        }
    }
}
</script>

 <style lang="scss" scoped>
.tree {
    height: 70vh;
    ::v-deep {
        .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
            background-color: #409EFF;
            border-color: #409EFF;
        }
        .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
            border-color:#ffffff
        }
    }
}
</style>
