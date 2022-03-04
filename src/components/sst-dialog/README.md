## @fe/sst-dialog

### Intro 简介

`@fe/sst-dialog` 是一款对话框组件，基于 `vue` 和 `element-ui` 进行的二次封装。

### Install 安装

- 通过 `npm` 或者 `yarn` 安装项目

> 注意：本项目仅供内部使用，使用前需将 npm 仓库地址设置为 **http://127.0.0.1:8080/repository/npm-group/**

```bash
npm config set registry http://127.0.0.1:8080/repository/npm-group/
npm i @fe/sst-dialog
# 或者
yarn add @fe/sst-dialog
```

- 引用组件，根据需要可全局引入或者局部引入

```javascript
// 组件依赖 vue 和 element-ui

// 全局引入,可配置选项
// >>> main.js
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/libs/theme-chalk/index.css'

import SstDialog from '@fe/sst-dialog'
Vue.use(SstDialog, {
  appendToBody: false,  // Dialog 自身是否插入至 body 元素上
  modalAppendToBody: true,  // 遮罩层是否插入至 body 元素上
  closeOnClickModal: true,  // 是否可以通过点击 modal 关闭 Dialog
  closeOnPressEscape: true,  // 是否可以通过按下 ESC 关闭 Dialog
})

// 局部引入
// >>> Demo.vue
<script>
import SstDialog from '@fe/sst-dialog'
export default {
  components: {
    SstDialog
  }
}
</script>
```

### Options 配置项

配置项内容可在全局引入时设置，或者直接使用 `<sst-dialog {...options} />` ，需注意：直接使用的优先级高于全局配置

|        参数        | 数据类型 | 默认值 |   可选值   |                说明                |
| :----------------: | :------: | :----: | :--------: | :--------------------------------: |
|       width        |  String  | '50%'  |     -      |            Dialog 宽度             |
|    appendToBody    | Boolean  | false  | true/false | Dialog 自身是否插入至 body 元素上  |
| modalAppendToBody  | Boolean  |  true  | true/false |    遮罩层是否插入至 body 元素上    |
| closeOnClickModal  | Boolean  |  true  | true/false | 是否可以通过点击 modal 关闭 Dialog |
| closeOnPressEscape | Boolean  |  true  | true/false |  是否可以通过按下 ESC 关闭 Dialog  |

### Dialog Attributes 对话框属性

仅展示 `config` 配置，其余参数见 [Element Doc Dialog #Dialog Attributes](https://element.eleme.cn/#/zh-CN/component/dialog)

|      参数       | 数据类型 | 是否必须 | 默认值 |      可选值       |         说明         |
| :-------------: | :------: | :------: | :----: | :---------------: | :------------------: |
|   showConfirm   | Boolean  |    否    | false  |    true/false     | 是否展示【确定】按钮 |
|   showCancel    | Boolean  |    否    |  true  |    true/false     | 是否展示【关闭】按钮 |
| confirmLoading  | Boolean  |    否    | false  |    true/false     | 【确定】按钮加载状态 |
| confirmDisabled | Boolean  |    否    | false  |    true/false     | 【确定】按钮禁用状态 |
|   confirmText   |  String  |    否    |  确定  |         -         | 【确定】按钮文字内容 |
|   cancelText    |  String  |    否    |  关闭  |         -         | 【关闭】按钮文字内容 |
|   hideFooter    | Boolean  |    否    | false  |    true/false     | 是否隐藏底部按钮区域 |
|   footerAlign   |  String  |    否    | right  | left/center/right | 底部按钮区域对齐方式 |

### Dialog Events 对话框事件

支持全部 `el-dialog` 方法，仅展示新增事件，其余事件详见 [Element Doc Dialog #Dialog Events](https://element.eleme.cn/#/zh-CN/component/dialog)

| 事件名  |         说明         | 参数 |
| :-----: | :------------------: | :--: |
| confirm | 点击【确定】按钮事件 |  无  |
| cancel  | 点击【关闭】按钮事件 |  无  |

### Usage Example 使用示例

- 所有 `<el-dialog>` 接受的属性和事件， `<sst-dialog>` 都接受
- `<sst-dialog>` 接受一些新属性，见配置清单
- `<sst-dialog>` 中实现了 `<el-dialog>` 的所有 `<slot>`

```javascript
/**
 * jsx使用示例
*/
<sst-dialog
  title='示例弹窗标题'
  config={{
    showConfirm: true,
    confirmText: 'Confirm',
    showCancel: true,
    cancelText: 'Cancel',
    footerAlign: 'center'
  }}
  onConfirm={() => {
    console.log('confirm')
  }}
/>

/**
 * template使用示例
*/
<sst-dialog
  title='示例弹窗标题'
  :config="{
    showConfirm: true,
    confirmText: 'Confirm',
    showCancel: true,
    cancelText: 'Cancel',
    footerAlign: 'center'
  }"
  @confirm="handleConfirm"
/>
```
