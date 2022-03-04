<template>
    <div class="edit-tree">
        <el-scrollbar ref="scroll">
            <el-tree
                ref="tree"
                :data="data"
                :props="defaultProps"
                :node-key="nodeKey"
                :default-expanded-keys="defaultShowNodes"
                :auto-expand-parent="false"
                :highlight-current="true"
                :expand-on-click-node="false"
                :render-content="renderContent"
                :filter-node-method="filterProject"
                @node-click="handleClick"
                @node-expand="handleNodeExpand"
                @node-collapse="handleNodeCollapse"
                @node-contextmenu="handleContextmenu"
            />
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'EditTree',
    props: {
        defaultProps: {
            type: Object,
            default: () => ({
                children: 'children',
                label: 'label'
            })
        },
        data: {
            type: Array,
            default: () => []
        },
        nodeKey: {
            type: String,
            default: 'id'
        }
    }
}
</script>
