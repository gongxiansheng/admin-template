<template>
  <div
    v-loading="loading"
    class="partment-tree"
  >
    <div
      ref="treeWrap"
      class="partment-tree__body"
    >
      <div class="org-tree-container">
        <el-scrollbar ref="scroll">
          <el-tree
            ref="tree"
            class="org-tree-box"
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :default-expand-all="true"
            :auto-expand-parent="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            :render-content="renderContent"
            @node-click="handleClick"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
          />
          <!-- :default-expanded-keys="defaultShowNodes" -->
        </el-scrollbar>
      </div>
    </div>
    <org-edit-dialog
      :visible.sync="showEditDialog"
      :is-edit="isEdit"
      :parent-id="id"
      :edit-org="editOrg"
      @reset="handleReset"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script>
import OrgEditDialog from './OrgEditDialog'
import * as organizationApi from '@/api/modules/organization'
import { isEmpty } from '@/utils'
export default {
    name: 'OrgTree',
    components: { OrgEditDialog },
    props: {
        clearActive: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        departments: {
            type: Array,
            default: () => ({})
        }
    },
    data() {
        return {
            showEditDialog: false,
            editable: false,
            isEdit: false,
            editOrg: null,
            currentId: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            id: '',
            defaultShowNodes: [],
            treeData: []
        }
    },
    watch: {
        clearActive(val) {
            if (val) {
                this.clearHighLight()
            }
        },
        departments: {
            deep: true,
            immediate: true,
            handler(val) {
                if (!isEmpty(val)) {
                    const data = JSON.parse(JSON.stringify(val))
                    this.treeData = data
                    if (!this.currentId) {
                        this.currentId = data[0].id
                    }
                    this.$emit('update-active', this.currentId)
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(this.currentId)
                    })
                }
            }
        }
    },
    methods: {
        // 刷新
        handleRefresh() {
            this.$emit('update-tree')
        },

        // 重置
        handleReset() {
            this.showEditDialog = false
            this.isEdit = false
            this.editOrg = null
        },

        /**
         * 展开节点 回调
         */
        handleNodeExpand(data) {
            if (!this.defaultShowNodes.includes(data.id)) {
                this.defaultShowNodes.push(data.id)
            }
        },

        /**
         * 折叠节点 回调
         */
        handleNodeCollapse(data) {
            if (this.defaultShowNodes.includes(data.id)) {
                const index = this.defaultShowNodes.findIndex(item => item === data.id)
                this.defaultShowNodes.splice(index, 1)
            }
        },

        // 清空高亮
        clearHighLight() {
            try {
                this.$refs.tree.setCurrentNode(this.currentId)
                this.currentId = ''
            } catch {
                this.currentId = ''
            }
        },

        /**
         * 点击节点
         */
        handleClick(data) {
            if (this.currentId !== data.id) {
                this.currentId = data.id
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(this.currentId)
                })
                // 获取数据
                this.$emit('update-active', data.id)
            }
        },

        /**
         * 节点渲染的内容
         */
        renderContent(h, { node, data }) {
            return (
                <span class='org-tree-node'>
                    {
                        (
                            data.name.length > 10
                                ? <el-tooltip content={data.name} open-delay={800}>
                                    <span class='name'>{data.name.substr(0, 10)}...</span>
                                </el-tooltip>
                                : <span class='name'>{data.name}</span>
                        )
                    }
                    {
                        <div class='org-visible'>
                            <span>
                                <el-button size='mini' type='text' class='org-tree-small-btn el-icon-edit' onClick={() => this.edit(node, data)}>
                                </el-button>
                                <el-button size='mini' type='text' class='org-tree-small-btn el-icon-plus' onClick={() => this.append(node, data)}>
                                </el-button>
                                <el-button size='mini' type='text' class='org-tree-small-btn el-icon-delete' onClick={() => this.remove(node, data)}>
                                </el-button>
                            </span>
                        </div>
                    }
                </span>)
        },

        // 格式化名称 去除名称前后空格
        fomatName(name) {
            return name.replace(/^\s+|\s+$/gu, '')
        },
        // 点击输入框 阻止事件冒泡
        stopPropagation(e) {
            e = event || window.event
            e.stopPropagation()
        },

        // 新增节点
        append(node, data, e) {
            e = event || window.event
            e.stopPropagation()
            this.id = data.id
            this.showEditDialog = true
        },

        // 移除节点
        remove(node, data, e) {
            e = event || window.event
            e.stopPropagation()
            this.$confirm('此操作将永久删除该部门节点，请谨慎操作', '重要提示', {
                confirmButtonText: '继续',
                type: 'warning'
            }).then(async() => {
                try {
                    // 发请求
                    const delId = node.data.id
                    await organizationApi.delOrg(delId)
                    this.$message.success('删除成功')
                    this.$emit('update-tree')
                } catch (error) {
                    console.error(error)
                }
            })
                .catch(() => { })
        },

        // 编辑节点
        edit(node, data, e) {
            e = event || window.event
            e.stopPropagation()
            this.editOrg = node.data
            this.isEdit = true
            this.showEditDialog = true
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixins/utils";
  .partment-tree {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    overflow: hidden;
    &__body {
      position: absolute;
      width: 300px;
      top: 0;
      bottom: 0;
      padding-bottom: 10px;
      .org-tree-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        ::v-deep {
          .el-scrollbar__view {
            padding-bottom: 40px;
          }
          .org-tree-btn {
            width: 100px;
            text-align: center;
            margin-left: 50%;
            transform: translateX(-50%);
          }
          span {
            font-size: 14px;
          }
          .el-tree > .el-tree-node > .el-tree-node__content:first-child {
            &::before,
            &::after {
              border: none;
            }
          }
          .org-visible {
            position: absolute;
            right: 0;
            visibility: hidden;
            background: #d2e5f8;
          }
          .org-tree__loading {
            color: #666;
            font-weight: bold;
          }
          .org-tree-node {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
          }
          .org-tree-node > div > span:last-child {
            display: inline-block;
            width: 90px;
            text-align: left;
          }
          .org-tree-node > span:last-child {
            display: inline-block;
            width: 90px;
            text-align: left;
          }
          .el-tree-node .el-tree-node__content {
            height: 40px;

            &:hover .org-visible {
              visibility: visible;
            }
            &::before,
            &::after {
              content: '';
              position: absolute;
              right: auto;
            }
          }
          .el-scrollbar {
            height: 100%;
            .el-scrollbar__wrap {
              overflow-x: hidden;
            }
          }
          .el-tree>.el-tree-node {
            min-width: 100%;
            display:inline-block;
          }
          .el-tree-node__content:hover {
            background: #d2e5f8;
          }
          .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
            background: #d2e5f8;
          }
          .el-tree .el-tree-node {
            position: relative;
          }
          .org-tree-small-btn {
            padding: 3px 6px;
            font-size: 14px;
          }
          .el-button+.el-button {
            margin: 0;
          }
          .el-tree-node__expand-icon.is-leaf {
            color: transparent !important;
          }
          .el-icon-caret-right {
            color: rgb(152, 154, 160);
          }
        }
      }
      .edit-input-wrap {
        margin: 0 10px;
      }
    }
  }
// }
</style>
