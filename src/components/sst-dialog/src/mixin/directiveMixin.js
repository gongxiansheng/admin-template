export default {
    directives: {
        dialogDragResize: {
            bind(el, binding, vnode) {
                const { position, resize } = binding.value
                // 弹框可拉伸最小宽高
                const minWidth = 400
                const minHeight = 300
                const dialogHeaderEl = el.querySelector('.el-dialog__header')
                const dragDom = el.querySelector('.el-dialog')
                dialogHeaderEl.style.cssText += ';cursor:move;'
                // 下一步为拖拽实现
                if (resize) {
                    dragDom.style.cssText += `;margin:initial;left:${position.left}px;top:${position.top}px;`
                }
                // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
                const getStyle = (function() {
                    if (window.document.currentStyle) {
                        return (dom, attr) => dom.currentStyle[attr]
                    } else {
                        return (dom, attr) => getComputedStyle(dom, false)[attr]
                    }
                })()

                dialogHeaderEl.onmousedown = e => {
                    // 鼠标按下，计算当前元素距离可视区的距离
                    const disX = e.clientX - dialogHeaderEl.offsetLeft
                    const disY = e.clientY - dialogHeaderEl.offsetTop

                    const dragDomWidth = dragDom.offsetWidth
                    const dragDomHeight = dragDom.offsetHeight

                    const screenWidth = document.body.clientWidth
                    const screenHeight = document.body.clientHeight

                    const minDragDomLeft = dragDom.offsetLeft
                    const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

                    const minDragDomTop = dragDom.offsetTop
                    const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

                    // 获取到的值带px 正则匹配替换
                    let styL = getStyle(dragDom, 'left')
                    let styT = getStyle(dragDom, 'top')

                    if (styL.includes('%')) {
                        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
                        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
                    } else {
                        styL = +styL.replace(/\px/g, '')
                        styT = +styT.replace(/\px/g, '')
                    }

                    document.onmousemove = function(e) {
                        // 通过事件委托，计算移动的距离
                        let left = e.clientX - disX
                        let top = e.clientY - disY

                        // 边界处理
                        if (-(left) > minDragDomLeft) {
                            left = -minDragDomLeft
                        } else if (left > maxDragDomLeft) {
                            left = maxDragDomLeft
                        }

                        if (-(top) > minDragDomTop) {
                            top = -minDragDomTop
                        } else if (top > maxDragDomTop) {
                            top = maxDragDomTop
                        }

                        // 移动当前元素
                        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

                        // emit onDrag event
                        vnode.child.$emit('dragDialog')
                    }

                    document.onmouseup = function() {
                        document.onmousemove = null
                        document.onmouseup = null
                    }
                }
                if (!resize) return
                dragDom.onmousemove = function(e) {
                    if (
                        e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 &&
                        e.clientY > dragDom.clientHeight + dragDom.offsetTop - 10
                    ) {
                        dragDom.style.cursor = 'nw-resize'
                    } else {
                        dragDom.style.cursor = 'default'
                        dragDom.onmousedown = null
                    }
                    dragDom.onmousedown = e => {
                        const clientX = e.clientX
                        const clientY = e.clientY
                        const elW = dragDom.clientWidth
                        const elH = dragDom.clientHeight
                        const EloffsetLeft = dragDom.offsetLeft // 弹窗距离窗口左侧距离
                        const EloffsetTop = dragDom.offsetTop // 弹窗距离窗口顶部距离
                        dragDom.style.userSelect = 'none'
                        // 判断点击的位置
                        if (
                            clientX > EloffsetLeft + elW - 10 &&
                            clientY > EloffsetTop + elH - 10
                        ) {
                            document.onmousemove = function(e) {
                                // 移动时禁用默认事件
                                e.preventDefault()
                                // 往左拖拽
                                if (clientX > e.clientX && dragDom.clientWidth > minWidth) {
                                    dragDom.style.width = elW - (clientX - e.clientX) + 'px'
                                }
                                // 往右拖拽
                                if (clientX < e.clientX && dragDom.clientWidth < document.documentElement.clientWidth - EloffsetLeft) {
                                    dragDom.style.width = elW + (e.clientX - clientX) + 'px'
                                }

                                // 往上拖拽
                                if (clientY > e.clientY && dragDom.clientHeight > minHeight) {
                                    dragDom.style.height = elH - (clientY - e.clientY) + 'px'
                                }
                                // 往下拖拽
                                if (clientY < e.clientY && dragDom.clientHeight < document.documentElement.clientHeight - EloffsetTop) {
                                    dragDom.style.height = elH + (e.clientY - clientY) + 'px'
                                }

                                // emit resize event
                                vnode.child.$emit('resizeDialog')
                            }
                            // 拉伸结束
                            document.onmouseup = function() {
                                document.onmousemove = null

                                document.onmouseup = null
                            }
                        }
                    }
                }
            }
        }
    }
}
