<template>
    <label
        class="pl-radio"
        :style="{
            display: inline ? 'inline-flex' : 'flex',
            width: inline ? null : '100%'
        }"
    >
        <input
            :checked="label === value"
            type="radio"
            :value="value"
            @change="handleChange"
        >
        <span class="pl-radio-inner" />
        <span class="pl-radio-content">
            <slot />
        </span>
    </label>
</template>

<script>
export default {
  name: 'PlRadio',
  model: {
    event: 'change',
    value: 'value'
  },
  props: {
    value: {
      type: [String, Boolean, Number],
      default: ''
    },
    label: {
      type: [String, Boolean, Number],
      default: ''
    },
    inline: {
      type: Boolean
    }
  },
  methods: {
    handleChange(e) {
      this.$emit('change', this.label)
    }
  }
}
</script>

<style lang="less">
  .pl-radio {
    align-items: center;
    margin-right: 30px;
    input {
      width: 0;
      height: 0;
      &:checked {
        + .pl-radio-inner {
          padding: 4px;
          border: 3px solid $--warning-color;
          background-color: $--warning-color;
          background-clip: content-box;
        }
      }
    }
    .pl-radio-content {
      flex: 1;
      font-size: 26px;
    }
  }
  .pl-radio-inner {
    display: inline-block;
    width: 36px;
    height: 36px;
    margin-right: 12px;
    border: 1px solid #999;
    border-radius: 50%;
    box-sizing: border-box;
    vertical-align: -7px;
  }

</style>
