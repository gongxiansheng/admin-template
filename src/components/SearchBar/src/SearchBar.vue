<template>
  <div
    class="search-bar"
    :style="customStyle"
  >
    <section class="search-bar__left">
      <slot name="left" />
    </section>
    <section class="search-bar__right">
      <slot name="right" />
    </section>
  </div>
</template>

<script>
export default {
    name: 'SearchBar',
    props: {
        customStyle: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>

<style lang="scss" scoped>
  .search-bar {
    width: 100%;
    height: 40px;
    line-height: 40px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 10px;

    ::v-deep .el-form-item {
      margin-bottom: 0 !important;
    }
  }
</style>
