<template>
    <div
        :class="$style.tabContainer"
        @touchstart="startDrag"
        @mousedown="startDrag"
        @touchmove="onDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @touchend="endDrag"
    >
        <div
            ref="wrapper"
            :class="$style.tabContainerWrapper"
        >
            <slot />
        </div>
    </div>
</template>

<script>
import { once } from './utils'

/**
 * tab-container
 * @desc 面板，搭配 tab-container-item 使用
 * @module components/tab-container
 *
 * @param {number|string} [value] - 当前激活的 tabId
 *
 * @example
 * <tab-container v-model="selected">
 *   <tab-container-item id="1"> 内容A </tab-container-item>
 *   <tab-container-item id="2"> 内容B </tab-container-item>
 *   <tab-container-item id="3"> 内容C </tab-container-item>
 * </tab-container>
 */
export default {
  name: 'TabContainer',
  props: {
    value: {
      type: String,
      default: ''
    },
    swipeable: Boolean
  },
  data() {
    return {
      start: { x: 0, y: 0 },
      swiping: false,
      pageWidth: 0,
      currentTab: this.value,
      wrapper: null,
      currentIndex: null,
      offsetLeft: 0,
      limitWidth: 0
    }
  },
  watch: {
    value(val) {
      this.currentTab = val
    },
    currentTab(val, oldVal) {
      this.$emit('input', val)
      if (!this.swipeable) return

      const lastIndex = this.$children.findIndex(child => child.id === oldVal)
      this.swipeLeaveTransition(lastIndex)
    }
  },
  mounted() {
    if (!this.swipeable) return

    this.wrapper = this.$refs.wrapper
    this.pageWidth = this.wrapper.clientWidth || document.documentElement.clientWidth
    this.limitWidth = this.pageWidth / 4
  },
  methods: {
    swipeLeaveTransition(lastIndex = 0) {
      // 非拖拽
      if (typeof this.currentIndex !== 'number') {
        this.currentIndex = this.$children.findIndex(child => child.id === this.currentTab)
        this.swipeMove(-lastIndex * this.pageWidth)
      }

      setTimeout(() => {
        this.wrapper.classList.add('swipe-transition')
        this.swipeMove(-this.currentIndex * this.pageWidth)

        once(this.wrapper, 'webkitTransitionEnd', _ => {
          this.wrapper.classList.remove('swipe-transition')
          this.wrapper.style.webkitTransform = ''
          this.swiping = false
          this.currentIndex = null
        })
      }, 0)
    },

    swipeMove(offset) {
      this.wrapper.style.webkitTransform = `translate3d(${offset}px, 0, 0)`
      this.swiping = true
    },

    startDrag(evt) {
      if (!this.swipeable) return
      const e = evt.changedTouches ? evt.changedTouches[0] : evt
      this.dragging = true
      this.start.x = e.pageX
      this.start.y = e.pageY
    },

    onDrag(evt) {
      if (!this.dragging) return
      const e = evt.changedTouches ? evt.changedTouches[0] : evt
      const offsetTop = e.pageY - this.start.y
      const offsetLeft = e.pageX - this.start.x
      const y = Math.abs(offsetTop)
      const x = Math.abs(offsetLeft)

      const swiping = !(x < 10 || y > 200 || (x >= 10 && y >= x * 1.73))
      if (!swiping) return
      evt.preventDefault()

      const length = this.$children.length - 1
      const index = this.$children.findIndex(child => child.id === this.currentTab)
      const currentPageOffset = index * this.pageWidth

      // 当前拖动时刻，wrapper的偏移量
      const offset = offsetLeft - currentPageOffset
      const absOffset = Math.abs(offset)

      if (absOffset > length * this.pageWidth || (offset > 0 && offset < this.pageWidth)) {
        // console.log('onDrag', 'absOffset > length * this.pageWidth', absOffset, length, this.pageWidth)
        // console.log('onDrag', 'offset > 0 && offset < this.pageWidth', offset > 0 && offset < this.pageWidth)
        this.swiping = false
        return
      }

      this.offsetLeft = offsetLeft
      this.currentIndex = index
      this.swipeMove(offset)
    },

    endDrag() {
      if (!this.swiping) return
      this.dragging = false
      const direction = this.offsetLeft > 0 ? -1 : 1
      const isChange = Math.abs(this.offsetLeft) > this.limitWidth

      if (isChange) {
        this.currentIndex += direction
        const child = this.$children[this.currentIndex]
        if (child) {
          this.currentTab = child.id
          return
        }
      }

      this.swipeLeaveTransition()
    }
  }
}
</script>

<style lang="less" module>
.tab-container {
    position: relative;
    overflow: hidden;

    &-wrapper {
        display: flex;
        width: 100%;
    }
}

</style>
<style lang="less" scoped>
.swipe-transition {
    transition: transform 150ms ease-in-out;
}

</style>
