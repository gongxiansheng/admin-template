<template>
  <div class="dashboard">
    <SstSplitPane @paneResizeStop="handleResizeStop">
      <div class="dashboard-left">
        <PartOne />
      </div>
      <SplitPaneResizer class="special" />

      <div class="dashboard-main">
        <PartTwo />
      </div>
    </SstSplitPane>
  </div>
</template>

<script>
import PartOne from './components/part-one.vue'
import PartTwo from './components/part-two.vue'

export default {
    name: 'Dashboard',
    components: {
        PartOne,
        PartTwo
    },

    methods: { handleResizeStop() {} }
}
</script>

<style lang="scss" scoped>
    .dashboard {
        display: flex;
        height: 100%;
        background-color: #fff;
        &-left {
            position: relative;
            width: 300px;
            height: 100%;
            box-shadow: 1px 0px 8px 0 rgba(147, 147, 147, 0.23);
        }
        &-main {
            flex: 1 1 0;
            width: calc(100% - 310px);
            height: 100%;
        }
    }
</style>
