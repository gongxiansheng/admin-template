<template>
  <div class="employee">
    <div class="employee__handle">
      <el-button
        :disabled="isRoot"
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
        :disabled="isRoot || !selections.length"
        @click="handleRemove"
      >
        移除
      </el-button>
    </div>
    <div class="employee__table">
      <sst-table
        v-loading="loading"
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
    <add-org-user-dialog
      :id="id"
      :visible.sync="showAddDialog"
      @refresh="fetchEmployeeData"
    />
  </div>
</template>

<script>
import { getUserList } from '@/api/modules/user'
import { removeTreeUser } from '@/api/modules/organization'
import AddOrgUserDialog from './AddOrgUserDialog'
export default {
    name: 'EmployeeTable',
    components: { AddOrgUserDialog },
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
    methods: {
        // parent component call
        getTreeUser(id, isRoot) {
            this.id = id
            this.isRoot = isRoot
            this.fetchEmployeeData()
        },

        async fetchEmployeeData() {
            try {
                this.loading = true
                const query = {
                    pageNumber: this.currentPage,
                    pageSize: this.pageSize,
                    conditions: [
                        {
                            columnName: 'orgId',
                            columnOp: 'eq',
                            value: this.isRoot ? '' : this.id
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
                this.loading = false
            }
        },

        handleSizeChange(size) {
            this.currentPage = 1
            this.pageSize = size
            this.fetchEmployeeData()
        },

        handleChangePage(page) {
            this.currentPage = page
            this.fetchEmployeeData()
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
                const ids = this.selections.map(item => item.id)
                removeTreeUser(ids).then(() => {
                    this.$message.success('移除成功')
                    this.fetchEmployeeData(this.id)
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
    .employee {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        &__table {
            flex: 1 1 0;
        }
    }
</style>
