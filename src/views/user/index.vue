<template>
  <sst-card class="org-view">
    <div class="user">
      <div class="user__filter">
        <search-bar>
          <template #left>
            <span>
              <el-button
                icon="el-icon-plus"
                size="mini"
                type="primary"
                @click="showUserDialog = true"
              >
                新建用户
              </el-button>
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                :disabled="!selections.length"
                @click="handleDelete"
              >
                批量删除
              </el-button>
            </span>
          </template>
          <template #right>
            <el-input
              v-model="filter.name"
              size="mini"
              style="width: 240px"
              placeholder="用户姓名或账号搜索"
              @keyup.native.enter="handleSearch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              />
            </el-input>
          </template>
        </search-bar>
      </div>
      <div class="user__table">
        <sst-table
          v-loading="loading.list"
          :data="tableData"
          :column="cols"
          pagination
          background
          layout="->, total, sizes, prev, pager, next, jumper"
          :page-sizes="[20, 50, 80, 100]"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          stripe
          @size-change="handleSizeChange"
          @page-change="handleChangePage"
          @selection-change="handleSelectChange"
        />
      </div>
      <user-manage-dialog
        :is-edit="isEdit"
        :user="currentUser"
        :visible.sync="showUserDialog"
        @reset="handleReset"
        @refresh="handleRefresh"
      />
      <reset-pwd-dialog
        :reset-id="resetId"
        :visible.sync="showResetDialog"
      />
    </div>
  </sst-card>
</template>

<script>
import UserManageDialog from './components/UserManageDialog'
import ResetPwdDialog from './components/ResetPwdDialog'
import { getUserList, delUser, updateState, syncJira, syncJiraProjectPerson } from '@/api/modules/user'
import { accountStatus, accountStateMap } from '@/lib'
export default {
    name: 'User',
    components: {
        UserManageDialog,
        ResetPwdDialog
    },
    data() {
        return {
            showUserDialog: false,
            showResetDialog: false,
            searchVal: '',
            loading: {
                list: false,
                unnormal: false,
                undisable: false,
                unlock: false,
                syncJira: false,
                syncJiraProject: false
            },
            isEdit: false,
            currentUser: null,
            currentPage: 1,
            pageSize: 20,
            total: 0,
            filter: {
                state: '',
                name: '',
                userName: ''
            },
            selections: [],
            tableData: [],
            accountStatus,
            accountStateMap,
            resetId: ''
        }
    },
    computed: {
        normalUsers() {
            return this.selections.filter(item => item.state === accountStateMap.normal)
        },
        lockUsers() {
            return this.selections.filter(item => item.state === accountStateMap.locking)
        },
        diableUsers() {
            return this.selections.filter(item => item.state === accountStateMap.disable)
        },
        cols() {
            return [
                {
                    type: 'selection',
                    width: '55'
                },
                {
                    label: '用户姓名',
                    prop: 'name'
                },
                {
                    label: '账号',
                    prop: 'userName'
                },
                {
                    label: '所属部门',
                    prop: 'orgName'
                },
                // {
                //     label: '角色',
                //     prop: 'roles'
                // },
                // {
                //     label: '状态',
                //     prop: 'state',
                //     render: (h, ctx) => {
                //         const stateMapItem = accountStatus.find(item => item.value === ctx.row.state)
                //         return stateMapItem ? <span>{stateMapItem.label}</span> : ''
                //     }
                // },
                {
                    label: '操作',
                    render: (h, ctx) => (
                        <span class='handle'>
                            <el-link type='primary' underline={false} onClick={() => this.handleEdit(ctx.row)}>编辑</el-link>
                            <el-link type='danger' underline={false} onClick={() => this.handleDelete(ctx.row.id)}>删除</el-link>
                            <el-link underline={false} onClick={() => this.handleResetPwd(ctx.row.id)}>重置密码</el-link>
                        </span>
                    )
                }
            ]
        }
    },
    created() {
        this.fetchUserList()
    },
    methods: {
        async fetchUserList() {
            try {
                this.loading.list = true
                const query = {
                    pageNumber: this.currentPage,
                    pageSize: this.pageSize,
                    conditions: [
                        {
                            columnName: 'name',
                            columnOp: 'like',
                            value: this.filter.name
                        },
                        { columnOp: 'or' },
                        {
                            columnName: 'userName',
                            columnOp: 'like',
                            value: this.filter.name
                        }
                    ]
                }
                const res = await getUserList(query)
                this.tableData = res.retList || []
                this.total = res.totalCount
            } catch {
                this.tableData = []
                this.total = 0
            } finally {
                this.loading.list = false
            }
        },

        handleSizeChange(size) {
            this.currentPage = 1
            this.pageSize = size
            this.fetchUserList()
        },

        handleChangePage(page) {
            this.currentPage = page
            this.fetchUserList()
        },
        handleSearch() {
            this.currentPage = 1
            this.fetchUserList()
        },
        // 操作 删除
        handleDelete(id) {
            this.$confirm('此操作将永久删除选中用户?', '谨慎操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const ids = typeof id !== 'object' ? [id] : this.selections.map(item => item.id)
                delUser(ids).then(() => {
                    this.$message.success('用户删除成功')
                    this.fetchUserList()
                })
                    .catch(() => {
                        this.$message.error('用户删除失败')
                    })
            })
        },

        handleSelectChange(selection) {
            this.selections = selection
        },

        // 刷新
        handleRefresh() {
            this.currentPage = 1
            this.fetchUserList()
        },

        // 编辑人员
        handleEdit(row) {
            this.isEdit = true
            this.currentUser = row
            this.showUserDialog = true
        },

        // 重置
        handleReset() {
            this.isEdit = false
            this.currentUser = null
        },

        // 重置密码
        handleResetPwd(id) {
            this.resetId = id
            this.showResetDialog = true
        },

        // 更新状态
        async handleUpdateState(type) {
            let ids = []
            switch (type) {
                case accountStateMap.normal:
                    ids = this.diableUsers.map(item => item.id)
                    break
                case accountStateMap.disable:
                    ids = this.normalUsers.map(item => item.id)
                    break
                case accountStateMap.locking:
                    ids = this.lockUsers.map(item => item.id)
                    break
            }

            try {
                this.loading[`un${type.toLocaleLowerCase()}`] = true
                await updateState({ ids, state: type })
                this.handleRefresh()
            } finally {
                this.loading[`un${type.toLocaleLowerCase()}`] = false
            }
        },

        // 同步jira
        async handleSyncJira() {
            try {
                this.loading.syncJira = true
                await syncJira()
                this.handleRefresh()
            } finally {
                this.loading.syncJira = false
            }
        },

        // 同步jira项目成员
        async syncJiraProject() {
            try {
                this.loading.syncJiraProject = true
                await syncJiraProjectPerson()
                this.handleRefresh()
            } finally {
                this.loading.syncJiraProject = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .sst-card__content{
    height: 100%;
}
.user {
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
