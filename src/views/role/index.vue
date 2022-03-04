<template>
  <sst-card>
    <div class="role">
      <div class="role__filter">
        <search-bar>
          <template #left>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="handleAdd"
            >
              新建
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              :disabled="!selections.length"
              @click="handleDelete(true)"
            >
              删除
            </el-button>
          </template>
        </search-bar>
      </div>
      <div class="role__table">
        <sst-table
          v-loading="loading.list"
          :data="tableData"
          :column="cols"
          background
          stripe
          @selection-change="handleSelectChange"
        />
      </div>
    </div>
    <check-auth-dialog
      v-if="showDialog.check"
      :row="checkAuthRow"
      :visible.sync="showDialog.check"
    />

    <role-manage-dialog
      v-if="showDialog.manage"
      :visible.sync="showDialog.manage"
      :is-edit="isEdit"
      :edit-row="editRow"
      :role-types="roleTypes"
      @refresh="fetchList"
    />
  </sst-card>
</template>

<script>
import RoleManageDialog from './components/RoleManageDialog'
import CheckAuthDialog from './components/CheckAuthDialog'
import { getRoleList, getRoleTypeList, delRole } from '@/api/modules/role'
export default {
    name: 'RoleManage',
    components: { RoleManageDialog, CheckAuthDialog },
    data() {
        return {
            loading: {
                list: false,
                export: false
            },
            isEdit: false,
            editRow: null,
            showDialog: {
                manage: false,
                check: false
            },
            currentPage: 1,
            pageSize: 20,
            total: 0,
            checkAuthRow: null,
            selections: [],
            tableData: [],
            roleTypes: []
        }
    },
    computed: {
        cols() {
            return [
                {
                    type: 'selection',
                    width: '55'
                },
                {
                    label: '角色名称',
                    prop: 'roleName'
                },
                {
                    label: '角色类型',
                    prop: 'roleTypeName'
                },
                // {
                //     label: '角色权限',
                //     prop: 'roleAuth',
                //     render: (h, ctx) => {
                //         const auth = ctx.row.auth ? ctx.row.auth.map(item => item.)
                //         <span>{ ctx.row.auth ? ctx.row.auth.join('，') : '-' }</span>
                //     }
                // },
                {
                    label: '创建人',
                    prop: 'createByName'
                },
                {
                    label: '创建时间',
                    prop: 'createTime',
                    render: (h, ctx) => (
                        <span>{ this.$dayjs(ctx.row.createTime).format('YYYY-MM-DD HH:mm:ss') }</span>
                    )
                },
                {
                    label: '操作',
                    render: (h, ctx) => (
                        <span class='handle'>
                            <el-link type='primary' underline={false} onClick={() => this.handleEdit(ctx.row)}>编辑</el-link>
                            <el-link type='danger' underline={false} onClick={() => this.handleDelete(false, ctx.row.id)}>删除</el-link>
                            <el-link type='success' underline={false} onClick={() => this.handleCheckAuth(ctx.row)}>查看权限</el-link>
                            <el-link type='info' underline={false} onClick={() => this.handleManage(ctx.row.id)}>人员管理</el-link>
                        </span>
                    )
                }
            ]
        }
    },
    created() {
        this.fetchRoleTypes()
        this.fetchList()
    },
    methods: {
        async fetchRoleTypes() {
            const res = await getRoleTypeList()
            this.roleTypes = res
        },
        async fetchList() {
            try {
                this.loading.list = true
                const query = { roleName: '' }
                const res = await getRoleList(query)
                this.tableData = res
            } catch {
                this.tableData = []
                this.total = 0
            } finally {
                this.loading.list = false
            }
        },
        handleManage(id) {
            this.$router.push({ name: 'ROLE-USER-MANAGE', params: { id } })
        },
        handleSizeChange(size) {
            this.currentPage = 1
            this.pageSize = size
            this.fetchList()
        },

        handleChangePage(page) {
            this.currentPage = page
            this.fetchList()
        },
        handleSearch() {
            this.currentPage = 1
            this.fetchList()
        },

        handleSelectChange(selection) {
            this.selections = selection
        },

        // 刷新
        handleRefresh() {
            this.currentPage = 1
            this.fetchList()
        },

        handleCheckAuth(row) {
            this.checkAuthRow = row
            this.showDialog.check = true
        },
        // 编辑角色
        handleEdit(row) {
            this.isEdit = true
            this.editRow = row
            this.showDialog.manage = true
        },
        handleAdd() {
            this.isEdit = false
            this.editRow = null
            this.showDialog.manage = true
        },
        handleDelete(isMulti, id) {
            this.$confirm('确定移除选中角色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const roleIds = isMulti ? this.selections.map(item => item.id) : [id]
                delRole({ roleIds }).then(() => {
                    this.$message.success('删除成功')
                    this.handleRefresh()
                })
                    .catch(() => {
                        this.$message.error('删除失败')
                    })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .sst-card__content{
    height: 100%;
}
.role {
    height: 100%;

    &__filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
    }

    &__table {
        height: calc(100% - 40px);
    }
}
</style>
