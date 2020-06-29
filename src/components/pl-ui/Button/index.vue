<template>
    <button
        :class="{
            'pl-button': true,
            [`pl-button__${type}`]: true,
            [`pl-button__${size}`]: true,
            'round': round,
            'plain': plain,
            'shadow': shadow
        }"
        :style="{ background: backgroundColor }"
        :disabled="disabled || loading"
        @click.stop="handleClick"
    >
        <span>
            <pl-svg
                v-show="loading"
                class="pl-button__loading"
                name="icon-btn-loading"
            />
            <pl-svg
                class="pl-button__prefix-icon"
                v-if="prefixIcon"
                :name="prefixIcon"
            />
            <slot>{{ text }}</slot>
        </span>
    </button>
</template>

<script>
export default {
  name: 'PlButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: Boolean,

    // 是否圆角
    round: Boolean,

    // 是否朴素
    plain: Boolean,
    prefixIcon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    loading: Boolean,
    shadow: Boolean,
    backgroundColor: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>
<style scale lang="scss">
  .pl-button {
    position: relative;
    border: none;
    outline: none;
    text-align: center;
    span {
      display: inline-block;
      vertical-align: bottom;
    }
    &:disabled {
      background-color: #ccc !important;
      color: #fefefe !important;
    }
    /* 有阴影的 */
    &.shadow {
      box-shadow: 0 4px 20px rgba(153, 153, 153, 0.2);
    }
    /* 默认的 */
    &__default {
      background-color: $--font-color_gray3;
      color: #fff;
      &:active {
        background-color: $--font-color_gray3;
      }
      &.plain {
        color: #666;
        background-color: transparent;
        border: 1px solid #666;
      }
    }
    /* 主色调 */
    &__primary {
      background-color: $--primary-color;
      color: #fff;
      &:active {
        background-color: $--primary-color;
      }
      &.plain {
        color: $--primary-color;
        background-color: #FFF8F9;
        border: 1px solid #FE7700;
      }
    }
    /* 警告色 */
    &__warning {
      background-color: $--warning-color;
      color: #fff;
      &:active {
        background-color: $--warning-color-active;
        color: #ccc;
      }
      &.plain {
        color: $--warning-color;
        background-color: $--primary-color;
      }
    }
    /* 红色 */
    &__danger {
      background-color: #D2524C;
      color: #fff;
      &:active {
        background-color: #D2524C;
      }
      &.plain {
        color: #D2524C;
        background-color: transparent;
        border: 1px solid #D2524C;      }
    }
    /* 蓝色 */
    /*&__primary {
      background-color: #12B7F5;
      color: #fff;
      &:active {
        background-color: #12B7F5;
      }
      &.plain {
        color: #12B7F5;
        background-color: transparent;
        border: 1px solid #12B7F5;      }
    }*/
    &__text {
      background-color: transparent;
      font-size: 26px;
      color: $--primary-color;
      padding: 0 !important;
      margin: 0 !important;
    }
    &__mini {
      padding: 0 18px;
      height: 40px;
      font-size: 20px;
      border-radius: 10px;
      &.round {
        border-radius: 20px;
      }
      &.plain {
        border: 1px solid currentColor;
        border-radius: 20px;
      }
      .pl-button__prefix-icon, .pl-button__loading {
        width: 20px;
        height: 20px;
        vertical-align: -1px;
        fill: currentColor;
      }
    }
    /* small */
    &__small {
      padding: 0 10px;
      line-height: 48px;
      font-size: 26px;
      border-radius: 10px;
      &:nth-of-type(n + 1) {
        margin-right: 10px;
      }
      &:nth-last-of-type(1) {
        margin-right: 0;
      }
      &.round {
        border-radius: 25px;
      }
      .pl-button__prefix-icon, .pl-button__loading {
        width: 24px;
        height: 24px;
        vertical-align: -3px;
        fill: currentColor;
      }
    }
    /* middle */
    &__middle {
      padding: 0 22px;
      line-height: 60px;
      font-size: 28px;
      border-radius: 12px;
      &:nth-of-type(n + 1) {
        margin-right: 10px;
      }
      &:nth-last-of-type(1) {
        margin-right: 0;
      }
      &.round {
        border-radius: 31px;
      }
      .pl-button__prefix-icon, .pl-button__loading {
        width: 26px;
        height: 26px;
        fill: currentColor;
      }
    }
    /* large */
    &__large {
      width: 100%;
      height: 80px;
      font-size: 28px;
      border-radius: 20px;
      text-align: center;
      .pl-button__prefix-icon, .pl-button__loading {
        width: 35px;
        height: 35px;
        margin-right: 5px;
        fill: currentColor;
        vertical-align: -7px;
      }
      &.round {
        border-radius: 40px;
      }
    }
    &__squarelarge {
      width: 100%;
      height: 80px;
      font-size: 28px;
      text-align: center;
      .pl-button__prefix-icon, .pl-button__loading {
        width: 35px;
        height: 35px;
        margin-right: 5px;
        fill: currentColor;
        vertical-align: -7px;
      }
      &.round {
        border-radius: 40px;
      }
    }
    /* huge */
    &__huge {
      width: 100%;
      height: 108px;
      font-size: 36px;
      border-radius: 20px;
      text-align: center;
      .pl-button__prefix-icon, .pl-button__loading {
        width: 35px;
        height: 35px;
        margin-right: 5px;
        vertical-align: -5px;
        fill: currentColor;
      }
    }
    /* larger */
    &__larger {
      width: 100%;
      height: 90px;
      font-size: 32px;
      border-radius: 10px;
      text-align: center;
      .pl-button__prefix-icon, .pl-button__loading {
        width: 35px;
        height: 35px;
        margin-right: 5px;
        fill: currentColor;
        vertical-align: -7px;
      }
    }
  }

  .pl-button__loading {
    animation: rotate 1s linear infinite;
  }
  @keyframes rotate {
    from { transform: rotate(0) }
    to { transform: rotate(180deg) }
  }

</style>
