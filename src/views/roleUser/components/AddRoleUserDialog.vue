<template>
  <sst-dialog
    title="添加员工"
    :visible.sync="visibleDialog"
    width="40%"
    top="10vh"
    :config="{
      confirmDisabled: !value.length,
      confirmLoading: loading.confirm,
      showConfirm: true
    }"
    @open="handleOpen"
    @closed="reset"
    @confirm="handleConfirm"
  >
    <el-transfer
      v-model="value"
      v-loading="loading.list"
      filterable
      :titles="['From', 'To']"
      filter-placeholder="请输入员工姓名"
      :props="transferProps"
      :data="userList"
      :filter-method="filterMethod"
    />
  </sst-dialog>
</template>

<script>
import { getUserList } from '@/api/modules/user'
import { addRoleUser } from '@/api/modules/role'
export default {
    name: 'AddRoleUserDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: {
                confirm: false,
                list: false
            },
            value: [],
            userList: [],
            transferProps: {
                label: 'name',
                key: 'id'
            },
            filterMethod(query, item) {
                return item.name.indexOf(query) > -1
            }
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
        handleOpen() {
            this.fetchUserList()
        },
        async fetchUserList() {
            try {
                this.loading.list = true
                const query = {
                    pageNumber: 1,
                    pageSize: 1000
                }
                const res = await getUserList(query)
                this.userList = res.retList || []
            } catch {
                this.userList = []
            } finally {
                this.loading.list = false
            }
        },

        /**
         * 保存
         */
        async handleConfirm() {
            if (!this.value.length) return
            try {
                this.loading.confirm = true
                const roleUsers = this.value.map(item => ({
                    roleId: this.$route.params.id,
                    userId: item
                }))
                await addRoleUser({ roleUsers })
                this.$message.success('员工添加成功')
                this.$emit('refresh')
                this.visibleDialog = false
            } finally {
                this.loading.confirm = false
            }
        },

        reset() {
            this.value = []
        }
    }
}
</script>

<style lang="scss" scoped>
    ::v-deep .el-dialog__body {
        display: flex;
        justify-content: center;
        .el-transfer__buttons button{
            padding: 7px 15px;
        }
    }
</style>
