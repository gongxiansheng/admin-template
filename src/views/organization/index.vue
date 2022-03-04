<template>
  <div class="org">
    <div class="org-tree-container">
      <org-tree
        :loading="loading"
        :departments="orgTreeData"
        @update-active="fetchUserList"
        @update-tree="fetchOrgData"
      />
    </div>
    <div class="org-main">
      <org-main-view ref="main" />
    </div>
  </div>
</template>

<script>
import OrgTree from './components/OrgTree'
import OrgMainView from './components/OrgMainView'
import * as organizationApi from '@/api/modules/organization'
export default {
    name: 'Organization',
    components: {
        OrgTree,
        OrgMainView
    },
    data() {
        return {
            loading: false,
            orgTreeData: [],
            root: ''
        }
    },
    created() {
        this.fetchOrgData()
    },
    methods: {
        // 获取 机构组织树
        async fetchOrgData() {
            try {
                this.loading = true
                const res = await organizationApi.getOrg()
                this.orgTreeData = res
                this.root = res[0].id
            } catch (error) {
                console.error(error)
            } finally {
                this.loading = false
            }
        },
        // 获取 userlist
        fetchUserList(id) {
            this.$refs.main.$refs.employee.getTreeUser(id, id === this.root)
        }
    }
}
</script>

<style lang="scss" scoped>
  .org {
    display: flex;
    height: 100%;
    &-tree-container {
      width: 300px;
      height: 100%;
      margin-right: 10px;
    }
    &-main {
      flex: 1 1 0;
      width: calc(100% - 310px);
      height: 100%;
    }
  }
</style>
