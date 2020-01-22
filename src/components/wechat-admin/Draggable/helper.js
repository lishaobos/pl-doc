
function log(...msg) {
  console.log(...msg)
}

function cached(fn) {
  const cacheList = Object.create(null)
  return (prop) => {
    const value = cacheList[prop]
    return value || (cacheList[prop] = fn(prop))
  }
}

// 转换成驼峰
const _regex = /-(\w)/g
const camelize = cached(str => str.replace(_regex, (_, c) => (c ? c.toUpperCase() : '')))

function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node)
  }
}

function insertNode(parentNode, node, position) {
  const refNode =
    position === 0
      ? parentNode.children[0]
      : parentNode.children[position - 1].nextSibling
  parentNode.insertBefore(node, refNode)
}

function computeIndexes(slots, children, isTransition) {
  if (!slots) return []
  const elmFromNodes = slots.map(slot => slot.elm)
  const indexes = [...children].map((child, i) => i >= children.length ? elmFromNodes.length : elmFromNodes.indexOf(child))
  return isTransition ? indexes.filter(index => index !== -1) : indexes
}

function emit(evtName, evtData) {
  this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData))
}

function delegateAndEmit(evtName) {
  return (evtData) => {
    this['onDrag' + evtName](evtData) // 事件代理
    emit.call(this, evtName, evtData)
  }
}

function isTransitionName(name) {
  return ['transition-group', 'TransitionGroup'].includes(name)
}

// 是否包含transition
function isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false
  }
  const [{ componentOptions }] = slots
  if (!componentOptions) {
    return false
  }
  return isTransitionName(componentOptions.tag)
}

function _updateAttribute(object, prop, value) {
  if (value === undefined) return object
  object = object || {}
  object[prop] = value
  return object
}

// 合并属性，用于渲染
function getComponentAttributes($attrs, componentData) {
  let attributes = null
  const attrs = Object.keys($attrs)
    .filter(key => key === 'id' || key.startsWith('data-'))
    .reduce((obj, key) => {
      obj[key] = $attrs[key]
      return obj
    }, {})
  attributes = _updateAttribute(attributes, 'attrs', attrs)

  if (!componentData) return attributes
  const { on, props, attrs: componentDataAttrs } = componentData
  Object.assign(attributes.attrs, componentDataAttrs)
  attributes = _updateAttribute(attributes, 'on', on)
  attributes = _updateAttribute(attributes, 'props', props)
  return attributes
}

export { log, camelize, insertNode, removeNode, computeIndexes, emit, delegateAndEmit, isTransitionName, isTransition, getComponentAttributes }
