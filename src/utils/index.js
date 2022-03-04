/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string')) {
            if ((/^[0-9]+$/.test(time))) {
                // support "1548221490638"
                time = parseInt(time)
            } else {
                // support safari
                // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                time = time.replace(new RegExp(/-/gm), '/')
            }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
        return value.toString().padStart(2, '0')
    })
    return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000
    } else {
        time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
    // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return (
            d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
        )
    }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
    if (!search) {
        return {}
    }
    const obj = {}
    const searchArr = search.split('&')
    searchArr.forEach(v => {
        const index = v.indexOf('=')
        if (index !== -1) {
            const name = v.substring(0, index)
            const val = v.substring(index + 1, v.length)
            obj[name] = val
        }
    })
    return obj
}

export function checkType(data) {
    return Object.prototype.toString.call(data).slice(8, -1)
        .toLowerCase()
}

/**
 * 参数数量为1，判断该参数为空；参数数量大于1，判断这些参数都为空
 * @param  {...any} args
 */
export function isEmpty(...args) {
    return args.every(data => {
        const dataType = checkType(data)
        switch (dataType) {
            case 'array':
                return !data.length
            case 'object':
                return !Object.keys(data).length
            case 'map':
            case 'set':
                return !data.size
            case 'boolean':
            case 'number':
            case 'symbol':
            case 'function':
                return false
            default:
                return !data
        }
    })
}

export const deepClone = source => {
    const targetObj = source.constructor === Array ? [] : {} // 判断复制的目标是数组还是对象
    for (const key in source) {
    // 遍历目标
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (source[key] && typeof source[key] === 'object') {
                // 如果值是对象，就递归一下
                targetObj[key] = source[key].constructor === Array ? [] : {}
                targetObj[key] = deepClone(source[key])
            } else {
                // 如果不是，就直接赋值
                targetObj[key] = source[key]
            }
        }
    }
    return targetObj
}

/**
 * @description 平铺的数组数据 组装成树结构数据
 */
export function generateTree(
    data,
    { idName = 'id', parentIdName = 'parentId', childName = 'children' } = {},
    rootId
) {
    if (!Array.isArray(data)) {
        return data
    }
    const objMap = {}
    const result = []
    for (const item of data) {
        const id = item[idName]
        const parentId = item[parentIdName]
        // 该项已经放入map中
        objMap[id] = !objMap[id] ? item : { ...item, ...objMap[id] }
        const treeItem = objMap[id]
        if (parentId === rootId) {
            result.push(treeItem)
        } else {
            // 若父元素不存在 初始化父元素
            if (!objMap[parentId]) {
                objMap[parentId] = {}
            }
            // 若无该根元素则放入map 中
            if (!objMap[parentId][childName]) {
                objMap[parentId][childName] = []
            }
            objMap[parentId][childName].push(treeItem)
        }
    }
    return result
}

/**
 * @description js触发window resize事件
 */
export function resize() {
    if (document.createEvent) {
        var event = document.createEvent('HTMLEvents')
        event.initEvent('resize', true, true)
        window.dispatchEvent(event)
    } else if (document.createEventObject) {
        window.fireEvent('onresize')
    }
}
