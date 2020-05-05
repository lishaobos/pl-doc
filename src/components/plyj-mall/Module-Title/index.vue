<template>
    <div :class="$style.title + ' ' + $style[size]">
        <h2
            ref="h2"
            v-text="title"
            :class="{ [$style.badge]: badge }"
            :data-badge="badge"
        />
        <div
            :class="$style.right"
            @click="clickHandle"
        >
            <pl-svg
                v-if="prefixIcon"
                :name="prefixIcon"
            />
            <div
                v-if="prefixIcon && tip"
                :class="$style.gap"
            >
                <!-- 间隙 -->
            </div>
            <span
                v-if="tip"
                :class="$style.tip"
                v-text="tip"
            />
            <div
                v-if="suffixIcon && tip"
                :class="$style.gap"
            >
                <!-- 间隙 -->
            </div>
            <pl-svg
                v-if="suffixIcon"
                :name="suffixIcon"
            />
        </div>
    </div>
</template>

<script>
import PlSvg from '@wechatAdminComponents/Pl-Svg'
export default {
  name: 'ModuleTitle',
  components: {
    PlSvg
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    // 右侧前边图标
    prefixIcon: {
      type: String,
      default: ''
    },
    // 右侧后边图标
    suffixIcon: {
      type: String,
      default: ''
    },
    // 图标颜色
    iconColor: {
      type: String,
      default: '#a8a8a8'
    },
    // 右侧文字
    tip: {
      type: String,
      default: ''
    },
    // 右侧跳转路由
    route: {
      type: Object,
      default() {
        return null
      }
    },

    // 标记
    badge: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  mounted() {
  },
  methods: {
    clickHandle() {
      if (this.route) {
        this.$router.push(this.route)
      }
      return false
    }
  }
}
</script>

<style module lang="scss">
  .title {
    display: flex;
    justify-content: space-between;
    line-height: 48px;
    h2 {
      font-weight: bold;
      position: relative;
      &.badge:after {
        position: absolute;
        content: attr(data-badge);
        height: 24px;
        line-height: 26px;
        padding: 0 6px;
        font-size: 12px;
        border-radius: 12px;
        text-align: center;
        color: #fff;
        background-color: #F24724;
      }
    }

    &.mini {
      h2 {
        font-size: 28px;
        line-height: 38px;
      }
    }
    &.small {
      h2 { font-size: 32px; }
    }
    &.middle {
      h2 { font-size: 36px; }
    }
  }
  .right {
    color: #a8a8a8;
    svg {
      width: 22px;
      fill: #ccc;
      vertical-align: -2px;
    }
  }
  .tip {
    font-size: 24px;
  }
  .gap {
    display: inline-block;
    padding: 0 6px;
  }
</style>
