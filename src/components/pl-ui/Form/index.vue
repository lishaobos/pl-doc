<template>
    <form class="pl-form">
        <slot />
    </form>
</template>

<script>
export default {
  name: 'PlForm',
  props: {
    model: {
      type: Object,
      default() {
        return {}
      }
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    align: {
      type: String,
      default: null
    },
    labelWidth: {
      type: [String, Number],
      default: ''
    },
    labelStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  activated() {
  },
  methods: {
    validate() {
      if (this.rules) {
        for (const fields of Object.keys(this.rules)) {
          if (!this.validateByFields(fields)) {
            return false
          }
        }
      }
      return true
    },
    validateByFields(fields, ev) {
      const validateRules = this.rules[fields]
      const val = this.model[fields] || ''
      for (const rule of validateRules) {
        if (ev && rule.trigger !== ev.type) {
          continue
        }
        if (rule.required) {
          if (!val.trim()) {
            this.error = true
            console.warn(`${fields} is required`)
            this.$warning(rule.message)
            return false
          }
        } else if (rule.validator) {
          if (!rule.validator(val)) {
            this.error = true
            this.$warning(rule.message)
            return false
          }
        }
      }
      return true
    }
  }
}
</script>
<style scale lang="scss">
</style>
