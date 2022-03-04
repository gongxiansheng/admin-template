<template>
  <div class="role-user">
    <div class="role-user__handle">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="showAddDialog=true"
      >
        添加
      </el-button>
      <el-button
        type="danger"
        size="mini"
        icon="el-icon-minus"
        :disabled="!selections.length"
        @click="handleRemove"
      >
        移除
      </el-button>
      <el-divider direction="vertical" />
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-d-arrow-left"
        @click="$router.back()"
      >
        返回
      </el-button>
    </div>
    <div class="role-user__table">
      <sst-table
        v-loading="loading"
        :data="tableData"
        :column="cols"
        background
        stripe
        @selection-change="handleSelectChange"
      />
    </div>
    <add-role-user-dialog
      :id="id"
      :visible.sync="showAddDialog"
      @refresh="fetchUserList"
    />
  </div>
</template>

<script>
import { getRoleUserList, removeRoleUser } from '@/api/modules/role'
// import { removeTreeUser } from '@/api/modules/organization'
import AddRoleUserDialog from './components/AddRoleUserDialog'
export default {
    name: 'RoleUserList',
    components: { AddRoleUserDialog },
    data() {
        return {
            showAddDialog: false,
            loading: false,
            currentPage: 1,
            pageSize: 20,
            total: 0,
            selections: [],
            tableData: [],
            id: '',
            isRoot: false
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
                this.loading = true
                const res = await getRoleUserList(this.$route.params.id)
                this.tableData = res
            } catch {
                this.tableData = []
                this.total = 0
            } finally {
                this.loading = false
            }
        },

        handleSelectChange(selection) {
            this.selections = selection
        },

        handleRemove() {
            this.$confirm('确定移除选中员工?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const roleUserIds = this.selections.map(item => item.id)
                removeRoleUser({ roleUserIds }).then(() => {
                    this.$message.success('移除成功')
                    this.fetchUserList(this.id)
                })
                    .catch(() => {
                        this.$message.error('移除失败')
                    })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .role-user {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 10px 20px;
        &__table {
            flex: 1 1 0;
        }
    }
</style>
