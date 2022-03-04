<template>
  <el-form
    ref="elForm"
    v-bind="$attrs"
    :model="model"
    :class="['sst-form', formClass]"
    :rules="rules"
    :disabled="disabled"
    v-on="$listeners"
  >
    <template v-for="(item, idx) in column">
      <sst-form-item
        v-if="!item.show || item.show(model, model, -1)"
        :key="idx"
        v-bind="$attrs"
        :column="item"
        :empty-words="emptyWords"
        :form="model"
        :root-form="model"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :form-rules="rules"
        :disabled="disabled"
      />
    </template>
  </el-form>
</template>

<script>
import SstFormItem from './FormItem'

export default {
    name: 'SstForm',
    components: { SstFormItem },

    inheritAttrs: false,
    props: {
        column: {
            type: Array,
            default: () => []
        },
        emptyText: {
            type: String,
            default: ''
        },
        model: {
            type: Object,
            default: () => ({})
        },
        labelPosition: {
            type: String,
            default: ''
        },
        labelWidth: {
            type: String,
            default: ''
        },
        rules: {
            type: Object,
            default: () => ({})
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        emptyWords() {
            return this.emptyText || (this.$sstForm && this.$sstForm.emptyText) || ''
        },
        formClass() {
            return this.$sstForm ? this.$sstForm.formClass : ''
        }
    },
    methods: {
        validate(cb) {
            const res = this.$refs.elForm.validate(cb)

            return res
        },
        validateField(props, cb) {
            this.$refs.elForm.validateField(props, cb)
        },
        resetFields() {
            this.$refs.elForm.resetFields()
        },
        clearValidate(props) {
            this.$refs.elForm.clearValidate(props)
        }
    }
}
</script>

<style lang="scss" scoped>
.sst-form.el-form--inline {
  display: flex;
  &::v-deep .sst-form-item__object {
    display: flex;
    padding: 0;
    background-color: transparent;
    border: none;
  }
}
</style>
