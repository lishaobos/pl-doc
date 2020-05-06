<template>
    <div
        role="radiogroup"
        class="radio-group"
    >
        <slot />
    </div>
</template>

<script>
import { ParentMixin } from '../assets/mixins/relation'

export default {
  name: 'RadioGroupComponent',
  mixins: [ParentMixin('RadioGroupComponent')],
  props: {
    value: {
      type: [String, Number],
      default() {
        return null
      }
    },
    disabled: Boolean
  },
  watch: {
    value(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="less">
</style>
