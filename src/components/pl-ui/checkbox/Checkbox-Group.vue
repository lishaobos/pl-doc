<template>
    <div class="pl-checkbox-group">
        <slot />
    </div>
</template>

<script>
export default {
  name: 'PlCheckboxGroup',
  data() {
    return {
      isCheckAll: false
    }
  },
  model: {
    prop: 'group',
    event: 'change'
  },
  props: {
    group: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    group: {
      handler(val) {
        this.$emit('change', val)
      },
      deep: true
    }
  },
  methods: {
    change(checked, data) {
      if (checked) {
        if (!this.group.includes(data)) {
          this.group.push(data)
        }
      } else {
        const index = this.group.indexOf(data)
        if (index !== -1) this.group.splice(index, 1)
      }
    },
    changeAll(flage) {
      const children = this.$children
      for (const c of children) {
        // 有禁用项时，全选时跳过
        if (c.disabled) continue
        c.changed(flage)
      }
      this.isCheckAll = flage
    }
  }
}
</script>

