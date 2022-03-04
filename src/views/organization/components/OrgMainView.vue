<template>
  <sst-card class="org-view">
    <div class="main">
      <employee-table ref="employee" />
    </div>
  </sst-card>
</template>

<script>
import EmployeeTable from './EmployeeTable'
export default {
    name: 'OrgMainView',
    components: { EmployeeTable }
}
</script>

<style lang="scss" scoped>
    ::v-deep .sst-card__content{
      height: 100%;
      .main {
        height: 100%;
      }
    }
</style>
