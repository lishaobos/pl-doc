import Sortable from './Sortable'
import { camelize, insertNode, removeNode, computeIndexes, emit, delegateAndEmit, isTransitionName, isTransition, getComponentAttributes } from './helper'

let draggingElement

const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End']
const eventsToEmit = ['Choose', 'Unchoose', 'Sort', 'Filter', 'Clone']
const readonlyProps = ['Move', ...eventsListened, ...eventsToEmit].map(evtName => 'on' + evtName)

const props = {
  // 为需要拖拽排序的列表数组
  list: {
    type: Array,
    required: true,
    default: null
  },
  // 自定义属性 { on: {}, props: {}, attrs: {} }，合并到原有属性上
  componentData: {
    type: Object,
    default: null
  },
  tag: {
    type: String,
    default: 'div'
  },
  // 拖动时无动画效果
  noTransition: {
    type: Boolean,
    default: false
  },
  // 拖动并复制
  clone: {
    type: Function,
    default(original) {
      return original
    }
  },
  // 绑定一个方法，(event, originalDragEvent) => {...}
  // event中包含 relatedContext: 被替换的元素 , draggedContext: 当前拖动的元素
  move: {
    type: Function,
    default: null
  }
}

const DraggableComponent = {
  name: 'Draggable',
  inheritAttrs: false,
  props,
  data() {
    return {
      isTransitionMode: false
    }
  },
  computed: {
    _list() {
      return this.list
    },
    rootContainer() {
      return this.isTransitionMode ? this.$el.children[0] : this.$el
    }
  },
  watch: {
    _list() {
      this.computeIndexes()
    },
    $attrs: {
      handler(option) {
        this.updateOption(option)
      },
      deep: true
    }
  },
  mounted() {
    // 收集$attrs，$attrs为在外部传入但不包含在props内的属性，可与$listeners搭配使用
    const attrs = Object.keys(this.$attrs).reduce((obj, key) => {
      obj[camelize(key)] = this.$attrs[key]
      return obj
    }, {})

    // 组装option并传入Sortable构造函数，作为实例的option
    const eventsOptions = {}
    eventsListened.forEach(evtName => {
      eventsOptions['on' + evtName] = delegateAndEmit.call(this, evtName)
    })

    eventsToEmit.forEach(evtName => {
      eventsOptions['on' + evtName] = emit.bind(this, evtName)
    })

    eventsOptions['onMove'] = (evt, originalEvent) => this.onDragMove(evt, originalEvent)

    const options = Object.assign({}, attrs, eventsOptions)
    this._sortable = new Sortable(this.rootContainer, options)
    this.computeIndexes()
  },
  render(h) {
    const children = this.$slots.default
    this.isTransitionMode = isTransition(children)
    const attributes = getComponentAttributes(this.$attrs, this.componentData)
    return h(this.tag, attributes, children)
  },
  beforeDestroy() {
    if (this._sortable) this._sortable.destroy()
  },
  methods: {
    spliceList() {
      this.list.splice(...arguments)
    },
    updateList(oldIndex, newIndex) {
      const current = this.list.splice(oldIndex, 1)[0]
      this.list.splice(newIndex, 0, current)
    },
    // 更新sortable实例的option
    updateOption(option) {
      for (const property in option) {
        const value = camelize(property)
        if (readonlyProps.includes(value)) {
          this._sortable.option(value, option[property])
        }
      }
    },
    computeIndexes() {
      this.$nextTick(() => {
        this.visibleIndexes = computeIndexes(this.getChildrenNodes(), this.rootContainer.children, this.isTransitionMode)
      })
    },
    getChildrenNodes() {
      const children = this.$slots.default
      return this.isTransitionMode ? children[0].child.$slots.default : children
    },
    // 找出html元素在list中的索引和相应的值
    getContext(htmlEl) {
      const vnodes = this.getChildrenNodes() || []
      const index = vnodes.map(vnode => vnode.elm).indexOf(htmlEl)
      if (index === -1) {
        // 当前拖动的不是列表中元素
        return null
      }
      const element = this._list[index]
      return { index, element }
    },
    // 找到当前draggable的实例
    getDraggableComponent({ __vue__: vue }) {
      if (!vue || !vue.$options || !isTransitionName(vue.$options._componentTag)) {
        if (!('_list' in vue) && vue.$children.length === 1 && '_list' in vue.$children[0]) {
          return vue.$children[0]
        }
        return vue
      }
      return vue.$parent
    },
    // 找到当前draggable的实例、被替换元素在list中的值
    getRelatedContextFromMoveEvent({ to, related }) {
      const component = this.getDraggableComponent(to)
      if (!component) {
        return { component }
      }
      const list = component._list
      const context = { list, component }
      if (to !== related && list && component.getContext) {
        const vm = component.getContext(related)
        if (vm) {
          return Object.assign(vm, context)
        }
      }
      return context
    },
    resetTransitionData(index) {
      if (!this.noTransition || !this.isTransitionMode) return
      const nodes = this.getChildrenNodes()
      nodes[index].data = null
      const transitionContainer = this.$slots.default[0].componentInstance
      transitionContainer.children = []
      transitionContainer.kept = undefined
    },
    getVMIndex(index) {
      const length = this.visibleIndexes.length
      return index > length - 1 ? length : this.visibleIndexes[index]
    },
    // 被替换元素的位置
    computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0
      }
      const domChildren = [...evt.to.children].filter(el => el.style['display'] !== 'none')
      const currentDOMIndex = domChildren.indexOf(evt.related)
      const currentIndex = relatedContext.component.getVMIndex(currentDOMIndex)
      const isDraggedInList = domChildren.indexOf(draggingElement) !== -1
      return isDraggedInList || !evt.willInsertAfter
        ? currentIndex
        : currentIndex + 1
    },
    // 元素从一个列表拖拽至另一个列表时触发
    onDragAdd(evt) {
      const element = evt.item._underlying_vm_
      if (!element) return

      removeNode(evt.item)
      const newIndex = this.getVMIndex(evt.newIndex)
      this.spliceList(newIndex, 0, element)
      this.computeIndexes()
      const added = { element, newIndex }
      this.$nextTick(() => {
        this.$emit('change', { added })
      })
    },
    // 元素从一个列表移除至另一个列表时触发
    onDragRemove(evt) {
      insertNode(this.rootContainer, evt.item, evt.oldIndex)
      if (evt.pullMode === 'clone') {
        removeNode(evt.clone)
        return
      }
      const oldIndex = this.context.index
      this.spliceList(oldIndex, 1)
      const removed = { element: this.context.element, oldIndex }
      this.resetTransitionData(oldIndex)
      this.$nextTick(() => {
        this.$emit('change', { removed })
      })
    },
    onDragStart(evt) {
      this.context = this.getContext(evt.item) // 当前被拖动的元素在list中对应的位置和值
      evt.item._underlying_vm_ = this.clone(this.context.element)
      draggingElement = evt.item
    },
    // 触发move绑定的方法，并将组装的数据传出
    onDragMove(evt, originalEvent) {
      if (!this.move) return true

      const relatedContext = this.getRelatedContextFromMoveEvent(evt) // 当前draggable实例
      const draggedContext = this.context // 当前被拖动的元素在list中对应的位置和值
      const nextIndex = this.computeFutureIndex(relatedContext, evt)
      Object.assign(draggedContext, { nextIndex })
      const sendEvt = Object.assign({}, evt, {
        relatedContext,
        draggedContext
      })
      return this.move(sendEvt, originalEvent)
    },
    // 拖拽结束后重置dom列表，并排序，更新传入的list
    onDragUpdate(evt) {
      removeNode(evt.item)
      insertNode(evt.from, evt.item, evt.oldIndex)
      const oldIndex = this.context.index
      const newIndex = this.getVMIndex(evt.newIndex)
      this.updateList(oldIndex, newIndex)
      const moved = { element: this.context.element, oldIndex, newIndex }
      this.$nextTick(() => {
        this.$emit('change', { moved })
      })
    },
    onDragEnd() {
      draggingElement = null
      this.computeIndexes()
    }
  }
}

if (typeof window !== 'undefined' && 'Vue' in window) {
  window.Vue.component('Draggable', DraggableComponent)
}

export default DraggableComponent
