export default [
    {
        'name': '工作表', // 工作表名称
        'color': '', // 工作表颜色
        'index': '0', // 工作表索引
        'status': '1', // 激活状态
        'order': '0', // 工作表的顺序
        'hide': 0, // 是否隐藏
        'row': 36, // 行数
        'column': 18, // 列数
        'config': {
            'merge': {}, // 合并单元格
            'rowlen': {}, // 表格行高
            'columnlen': {}, // 表格列宽
            'rowhidden': {}, // 隐藏行
            'colhidden': {}, // 隐藏列
            'borderInfo': {} // 边框
        },
        'celldata': [], // 初始化使用的单元格数据
        'data': [], // 更新和存储使用的单元格数据
        'scrollLeft': 0, // 左右滚动条位置
        'scrollTop': 315, // 上下滚动条位置
        'luckysheet_select_save': [], // 选中的区域
        'luckysheet_conditionformat_save': {}, // 条件格式
        'calcChain': [], // 公式链
        'isPivotTable': false, // 是否数据透视表
        'pivotTable': {}, // 数据透视表设置
        'filter_select': {}, // 筛选范围
        'filter': null, // 筛选配置
        'luckysheet_alternateformat_save': [], // 交替颜色
        'luckysheet_alternateformat_save_modelCustom': [], // 自定义交替颜色
        'freezen': {}, // 冻结行列
        'chart': [], // 图表配置
        'visibledatarow': [], // 所有行的位置
        'visibledatacolumn': [], // 所有列的位置
        'ch_width': 2322, // 工作表区域的宽度
        'rh_height': 949, // 工作表区域的高度
        'load': '1' // 已加载过此sheet的标识
    }
]
