### :smile: 源代码

```js
<template>
    <!-- 使用前必须保证滚动容器是window -->
    <div
        :class="$style.loadMore"
        ref="loadMore"
    >
        <div
            :class="{ [$style.pullLoading]: true }"
            ref="pullLoading"
            :style="{ '--top': `${top / 7.5}vw`, '--rotate': `${rotate}deg`}"
        >
            <svg
                :class="{ [$style.pullLoadingIcon]: true, [$style.rotate]: pending}"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="32"
                height="32"
                :fill="top > minPullDis ? '#fe7700' : '#a99d99'"
            >
                <path
                    opacity=".25"
                    d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"
                />
                <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z" />
            </svg>
        </div>
        <div
            :class="$style.loadMoreContainer"
            ref="container"
        >
            <slot
                :list="list"
                :total="total"
                :loading="loading"
            />
            <svg
                :class="{ [$style.bottomLoadingIcon]: true, [$style.btoRotate]: pending }"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                v-if="bottomLoading"
                style="display: block;"
                fill="#fe7700"
            >
                <path
                    opacity=".25"
                    d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"
                />
                <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
                    <!--<animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />-->
                </path>
            </svg>
            <p
                v-if="!isNotShowNoMoreTip && allLoaded && list.length > 0"
                :class="$style.noMore"
            >
                没有更多了~
            </p>
            <div
                :class="$style.noContent"
                v-if="list.length === 0 && !pending"
            >
                <pl-svg
                    v-if="!noIcon && !$slots.icon"
                    :name="icon"
                    width="300"
                    height="200"
                />
                <slot v-else name="icon" />
                <p
                    :class="$style.noContentTip"
                    v-text="noContentTip"
                />
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 节流阀
 * @param fn {Function} 需要包装的事件回调
 * @param delay {Number} 时间间隔的阈值
 * @returns {Function} 包装后的函数
 */
function throttle(fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0; let timer = null

  // 将throttle处理结果当作函数返回
  return function() {
    // 保留调用时的this上下文
    const context = this

    // 保留调用时传入的参数
    const args = arguments

    // 记录本次触发回调的时间
    const now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}
export default {
  name: 'LoadMore',
  data() {
    return {
      options: null,
      total: 0,
      list: [],
      startY: 0,
      // 固定值
      defaultTop: -90,
      // 动态变化的
      top: -90,
      // 正在向下拉动
      pulling: false,
      // loading
      pending: false,
      bottomLoading: false,
      // 已全部加载完毕
      allLoaded: false,
      timer: 0,
      offsetHeight: 0,
      // 记录loading旋转的角度
      rotate: 0,
      scrollHandler: null,
      // 最小触发距离
      minPullDis: 60,
      // 缓存发起的所有请求
      requestBuffer: [],
      // 手指标识符
      identifier: 0
    }
  },
  props: {
    isSearch: {
      type: Boolean,
      default: false
    },
    loading: Boolean,

    // 请求方法
    requestMethods: {
      type: Function,
      required: true
    },

    /*
        * 请求参数
        * 必须包含：current: 页码
        * */
    form: {
      type: Object,
      required: true,
      default() {
        return {
          current: 1
        }
      }
    },
    noContentTip: {
      type: String,
      default: '暂无内容'
    },
    icon: {
      type: String,
      default: 'icon-no-content'
    },

    // 如果函数返回false, 则刷新不会触发，可用来拦截刷新动作
    beforeRefresh: {
      type: Function,
      default: null
    },
    noIcon: Boolean,
    // 不显示‘没有更多了’提示true, 显示false
    isNotShowNoMoreTip: Boolean,
    // 禁止下拉事件
    noPullRefresh: Boolean
  },
  computed: {
    pullLoading() {
      return this.$refs.pullLoading
    },
    container() {
      return this.$refs.container
    },
    empty() {
      return this.list.length === 0
    }
  },
  watch: {
    form: {
      handler() {
        this.options = JSON.parse(JSON.stringify(this.form))
      },
      immediate: true,
      deep: true
    },
    empty(val) {
      this.$emit('listState', val)
    },
    // 更换请求方法的时候
    requestMethods() {
      this.refresh()
    }
  },
  activated() {
    const el = this.$el
    if (!this.noPullRefresh) {
      el.addEventListener('touchstart', this.touchstart, { passive: true })
      el.addEventListener('touchmove', this.touchMove)
      el.addEventListener('touchend', this.touchend, { passive: true })
    }
    if (!this.scrollHandler) {
      // 延迟绑定滚动事件
      // 因为如果其它页面如果滚动过一段距离，当路由切换的时候，会从新滚动到0的位置，会触发一次滚动事件
      setTimeout(() => {
        this.bindScroll()
      }, 200)
    }
  },
  methods: {
    bindScroll() {
      this.$nextTick(() => {
        this.offsetHeight = this.$el.offsetHeight
        // 生成滚动监听器
        this.scrollHandler = throttle(this.infiniteScroll, 200)
        window.addEventListener('scroll', this.scrollHandler, { passive: true })
      })
    },
    getData() {
      return new Promise(async(resolve, reject) => {
        try {
          this.$emit('update:loading', true)
          this.pending = true
          const { result } = await this.requestMethods(this.options)
          if (result.records.length === 0) {
            this.allLoaded = true
          }
          resolve(result.records)
          this.total = result.total
        } catch (e) {
          reject(e)
        } finally {
          this.loaded()
        }
      })
    },
    async loadMore() {
      this.options.current++
      try {
        await this.getData()
      } catch (e) {
        throw e
      }
    },

    // 本次请求完成，设置loading的位置为初始状态，并重新求得列表的高度
    loaded() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.pullLoading.style.transition = 'transform .5s ease-in-out'
          this.$emit('update:loading', false)
          this.top = this.defaultTop
          this.offsetHeight = this.$el.offsetHeight

          // 如果因为一些原因过渡没有被取消，0.6s后强行取消
          setTimeout(() => {
            this.pullLoading.style.transition = null
            this.rotate = 0
            this.pending = false
          }, 600)
        })
      })
    },
    resetState() {
      this.options.current = 1
      this.allLoaded = false
      this.pulling = false
      this.bottomLoading = false
      this.top = 100
      window.scrollTo(0, 0)
    },

    // 刷新
    async refresh() {
      try {
        await this.$nextTick()
        this.resetState()
        this.list = await this.getData()
        this.$emit('refresh', this.list, this.total)
      } catch (e) {
        throw e
      }
    },
    touchstart(e) {
      const touches = Array.from(e.touches)
      if (touches.length > 1) return
      // 记录当前第一根手指的标识符
      this.identifier = touches[0].identifier
      this.startY = e.touches[0].clientY
    },

    // 本次下拉动作结束
    async touchend(e) {
      const touches = Array.from(e.changedTouches)

      // 判断松开的手指是不是第一次按下的手指
      const finger = touches.find(item => item.identifier === this.identifier)
      if (this.pulling && finger) {
        this.startY = 0

        // 重置页码为1
        this.options.current = 1

        // allLoaded 全部加载完成设置为false，以便下次加载更多
        this.allLoaded = false

        // 表示下拉动作结束
        this.pulling = false

        // 为顶部loading设置过渡
        this.pullLoading.style.transition = 'transform linear .5s'

        // 只有在loading完成出现在视野中时，松开才发起请求
        if (this.top > this.minPullDis) {
          // 刷新
          if (this.beforeRefresh && !this.beforeRefresh()) {
            return
          }
          await this.$nextTick()
          this.list = await this.getData()
          this.$emit('refresh', this.list, this.total)
        } else {
          this.loaded()
        }
      }
    },
    touchMove(e) {
      const touches = Array.from(e.touches)
      if (touches.length > 1) return
      const finger = touches.find(item => item.identifier === this.identifier)

      const deltaY = (finger.clientY - this.startY) / 3

      // console.log(deltaY)
      // console.log(finger.clientY - this.startY)
      // console.log(e.touches[0].identifier, this.identifier)
      // console.log(this.pending, this.pulling)
      if (this.pending) return
      if (e.touches.length > 1) return

      // 如果使在顶部，并且是向下拉，禁止默认行为
      if (deltaY >= 0 && window.scrollY === 0) {
        e.stopPropagation()
        e.preventDefault()
        this.pulling = true
      }
      if (this.pulling && this.top <= 100) {
        e.preventDefault()
        e.stopPropagation()
        this.top = this.defaultTop + deltaY
      }
      this.rotate = deltaY
    },
    async infiniteScroll(e, offsetHeight = this.offsetHeight, scrollTop = window.scrollY, clientHeight = window.innerHeight) {
      // console.log(this.offsetHeight, window.scrollY, window.innerHeight, this.pending, this.allLoaded)
      if (offsetHeight === 0) return
      if (offsetHeight - scrollTop - clientHeight <= 0 && !this.pending && !this.allLoaded) {
        this.options.current++
        try {
          this.bottomLoading = true
          const list = await this.getData()
          for (const item of list) {
            this.list.push(item)
          }
          this.$emit('more', this.list, this.total, list)
          this.bottomLoading = false
        } catch (e) {
          this.bottomLoading = false
          throw e
        }
      }
    }
  },
  deactivated() {
    const el = this.$el
    el.removeEventListener('touchstart', this.touchstart)
    el.removeEventListener('touchmove', this.touchMove)
    el.removeEventListener('touchend', this.touchend)
    window.removeEventListener('scroll', this.scrollHandler)
    this.scrollHandler = null
    this.offsetHeight = 0
  },
  beforeDestroy() {
    const el = this.$el
    el.removeEventListener('touchstart', this.touchstart)
    el.removeEventListener('touchmove', this.touchMove)
    el.removeEventListener('touchend', this.touchend)
    window.removeEventListener('scroll', this.scrollHandler)
    this.scrollHandler = null
    this.offsetHeight = 0
  }
}
</script>

<style scale module lang="scss">
.loadMore {
    position: relative;
    overflow: hidden;
}
.pullLoading {
    position: absolute;
    left: 50%;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate3d(-50%, var(--top), 0) rotate(var(--rotate));
    background-color: #fff;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    z-index: 9;
    .pullLoadingIcon {
        width: 50px;
        height: 50px;
        &.rotate {
            animation: rotate .8s infinite linear;
        }
    }
}
.loadMoreContainer {
    min-height: 200px;
    .bottomLoadingIcon {
        margin: 30px auto 30px;
        width: 50px;
        height: 50px;
        &.btoRotate {
            animation: rotate .8s linear infinite;
        }
    }
}
.noMore {
    line-height: 90px;
    font-size: 28px;
    color: #999;
    text-align: center;
}
.noContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
}
.noContentTip {
    margin-top: 20px;
    font-size: 32px;
    color: #999;
}
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

</style>
```