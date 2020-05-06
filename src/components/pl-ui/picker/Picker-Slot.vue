<template>
    <div
        class="pl-picker-slot"
        :style="{ flex: data.flex }"
        @touchmove.prevent.stop="touchmove"
        @touchend.prevent.stop="touchend"
    >
        <div
            ref="mark"
            class="pl-picker-slot-mark"
            :style="{
                height: activeOffsetHeight + 'px',
                top: activeOffsetTop + 'px'
            }"
        />
        <ul
            ref="list"
            :class="{
                'pl-picker-slot-list': true,
                trasition
            }"
            :style="{
                transform: `translate3D(0, ${translateY}px, 0)`
            }"
            @touchstart.stop="touchstart"
        >
            <li
                v-for="(item, i) of data.values"
                :key="i"
                v-text="valuesKey ? item[valuesKey] : item"
                :style="{
                    textAlign: data.textAlign,
                    lineHeight: i < active ? (activeOffsetTop + 'px') : null,
                    padding: i < active ? 0 : null,
                }"
                :class="{
                    'pl-picker-slot-item': true,
                    'active': active === i
                }"
            />
        </ul>
    </div>
</template>

<script>

// 最大位移距离
let MAX_TRANSLATE_Y = 0

// 最小位移距离
let MIN_TRANSLATE_Y = 0

// 分时距离
let startY = 0

// 初始位置
let startYBase = 0

// 开始滑动的标记
let started = false

// 开始滑动的时间
let startTime = 0

// 分时速度
let speedValue = 0

// 初始速度
let initedSpeed = 0

// 摩擦系数 3%
const COEFFICIENT = 0.03
export default {
  name: 'PlPickerSlot',
  props: {
    data: {
      type: Object,
      default() {
        return {
          values: []
        }
      }
    },
    valuesKey: {
      type: String,
      default: null
    },
    scrolling: {

      // 正在滚动
      type: Boolean
    }
  },
  data() {
    return {
      activeOffsetTop: 0,
      activeOffsetHeight: 0,
      translateY: 0,
      active: 0,

      // 列表是否需要过度动效
      trasition: false
    }
  },
  mounted() {
    // 初始化位移单位高度
    // 选中标记物的坐标
    this.activeOffsetTop = Math.floor(window.innerWidth * 65 / 750)

    // 选中标记物的高度
    this.activeOffsetHeight = Math.floor(window.innerWidth * 75 / 750)
    this.translateY = this.activeOffsetTop
    MAX_TRANSLATE_Y = this.translateY
    MIN_TRANSLATE_Y = -this.activeOffsetTop * (this.data.values.length - 1)
  },
  methods: {
    touchstart(e) {
      if (this.scrolling) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      started = true
      const { clientY } = e.touches[0]
      startY = clientY
      startYBase = clientY
      startTime = Date.now()
      this.$emit('update:scrolling', true)
    },
    touchmove(e) {
      if (!started) return
      e.preventDefault()
      e.stopPropagation()
      const { clientY } = e.touches[0]
      const moved = clientY - startY
      this.setTranslate(moved)
      startY += moved
    },
    touchend(e) {
      if (!started) return
      e.preventDefault()
      e.stopPropagation()
      started = false
      document.removeEventListener('touchmove', this.touchmvoe)
      speedValue = this.speed(e.changedTouches[0].clientY)
      initedSpeed = speedValue
      requestAnimationFrame(this.inertia)
    },

    // y: 运动距离
    setTranslate(y) {
      const { activeOffsetTop } = this

      // 移动速度是手指滑动速度的2/3
      this.translateY += y * 2 / 3

      /*
              * 规律：
              * 位移每减少一个this.translateY，active就增加1
              * this.activeOffsetTop / 2 表示，离活动区域过当前项 1/2 高度时就选中
              **/
      this.active = Number.parseInt((activeOffsetTop - this.translateY + activeOffsetTop / 2) / activeOffsetTop)
    },

    /*
        * 计算手指滑动的速度
        * endY 滑动结束时的坐标
        * return 每15ms运动过的距离（px）,大约为 1 帧
        * */
    speed(endY) {
      const t = Date.now() - startTime
      const s = endY - startYBase
      return s / t * 15
    },

    // 惯性运动函数
    inertia() {
      // 获取方向，负数或正数
      const direction = speedValue / Math.abs(speedValue)
      const { translateY } = this
      this.setTranslate(speedValue)
      speedValue *= 1 - COEFFICIENT

      // 初始速度必须大于10，且，移动距离在最大最小移动距离之间
      if (initedSpeed * direction >= 10 &&
          speedValue * direction >= 1 &&
          translateY <= MAX_TRANSLATE_Y + 50 &&
          translateY >= MIN_TRANSLATE_Y + 10) {
        requestAnimationFrame(this.inertia)
      } else {
        /*
        * 惯性运动结束
        * 规律：
        * active 每递增1，就减少一个 activeOffsetTop
        * */
        this.trasition = true
        if (this.active < 0) {
          this.active = 0
        }
        if (this.active > this.data.values.length - 1) {
          this.active = this.data.values.length - 1
        }
        this.$nextTick(() => {
          this.translateY = (1 - this.active) * this.activeOffsetTop
        })
        setTimeout(() => {
          this.trasition = false
          this.$emit('change', this.data.values[this.active], this.active)
          this.$emit('update:scrolling', false)
        }, 450)
      }
    }
  }
}
</script>

<style lang="less">
.pl-picker-slot {
    position: relative;
}
.pl-picker-slot-list {
    position: relative;
    z-index: 2;
    &.trasition {
        transition: transform .4s ease;
    }
}
.pl-picker-slot-item {
    position: relative;
    font-size: 36px;
    color: #adadad;
    padding: 8px 0;
    transition: font-size .2s linear;
    box-sizing: border-box;
    &.active {
        font-size: 42px;
        color: #333;
        + li {
            font-size: 36px;
            color: #adadad;
            + li {
                font-size: 30px;
                color: #c1c1c1;
                + li {
                    font-size: 24px;
                    color: #d8d8d8;
                    + li {
                        font-size: 18px;
                        color: #ddd;
                    }
                }
            }
        }
    }
}
.pl-picker-slot-mark {
    position: absolute;
    width: 100%;
    z-index: 1;
    &:after,
    &:before {
        position: absolute;
        left: 0;
        width: 100%;
        height: 1px;
        content: '';
        background-color: #f0f0f0;
    }
    &:after {
        bottom: 0;
    }
    &:before {
        top: 0;
    }
}

</style>
