<template>
    <label
        :class="{'pl-form-item': true, border}"
        :style="{
            'margin-top': gapTop / 7.5 + 'vw'
        }"
    >
        <div
            v-if="hasPrefix"
            class="pl-form-item_prefix"
        >
            <slot name="prefix" />
        </div>
        <span
            ref="label"
            class="pl-form-item_label"
            v-text="label"
            :style="{
                width: currentLabelWidth,
                ...parentLabelStyle,
                ...labelStyle,
            }"
        />
        <div
            class="pl-form-item_content"
            :style="{ 'text-align': align || parentAlign }"
        >
            <slot />
        </div>
        <div
            v-if="hasSuffix"
            class="pl-form-item_suffix"
        >
            <slot name="suffix" />
        </div>
    </label>
</template>

<script>
export default {
  name: 'PlFormItem',
  data() {
    return {
      parentAlign: null,
      parentLabelStyle: {},
      rule: null,
      currentLabelWidth: 0
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: [String, Number],
      default: 'max-content'
    },

    // 自定义lable样式
    labelStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    align: {
      type: String,
      default: ''
    },
    border: Boolean,
    borderColor: {
      type: String,
      default: '#e7e7e7'
    },

    // 字段名称
    prop: {
      type: String,
      default: ''
    },

    // 竖直间隔
    gapTop: {
      type: Number,
      default: 0
    }
  },
  created() {
    if (this.$parent.rules) {
      this.rule = this.$parent.rules[this.prop] || null
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    hasPrefix() {
      return this.$slots.hasOwnProperty('prefix')
    },
    hasSuffix() {
      return this.$slots.hasOwnProperty('suffix')
    }
  },
  methods: {
    init() {
      const labelWidth = this.labelWidth === 'max-content' ? Number.parseInt(this.$parent.labelWidth || this.labelWidth) : this.labelWidth
      this.parentLabelStyle = this.$parent.labelStyle
      this.parentAlign = this.$parent.align
      if (labelWidth) {
        this.currentLabelWidth = `${labelWidth / 7.5}vw`
      } else {
        this.currentLabelWidth = 'max-content'
      }
    }
  }
}
</script>

<style scale lang="scss">
.pl-form-item {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #fff;
    &.border {
        border-bottom: 1px solid #e7e7e7;
    }
    &:nth-of-type(1) {
        margin-top: 0 !important;
    }
    &:nth-last-of-type(1):after {
        display: none;
    }
    .pl-form-item_label {
        display: inline-block;
        font-size: 28px;
        font-weight: bold;
    }
    .pl-form-item_content {
        flex: 1;
        display: flex;
        align-items: center;
        height: auto;
    }
}

</style>
