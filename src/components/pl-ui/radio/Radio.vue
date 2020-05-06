<template>
    <div
        role="radio"
        class="radio"
        @click="onClick"
    >
        <div
            class="radio__icon"
            :class="{ ['radio__icon--' + shape]: shape, 'radio__icon--disabled': isDisabled, 'radio__icon--checked': checked, 'radio__icon--border': border }"
            :style="{ fontSize: iconSize / 7.5 + 'vw' }"
            @click="onClickIcon"
        >
            <pl-svg
                v-if="icon && checked"
                :name="icon"
                fill="#FFF"
            />
            <slot
                v-else
                name="icon"
            />
        </div>
        <div
            v-if="$slots.default"
            class="radio__label"
            :class="{ ['radio__label--' + labelPosition]: labelPosition, 'radio__icon--disabled': isDisabled }"
            @click="onClickLabel"
        >
            <slot />
        </div>
    </div>
</template>

<script>
import { ChildrenMixin } from '../assets/mixins/relation'

export default {
  name: 'RadioComponent',
  mixins: [ChildrenMixin('RadioGroupComponent')],
  props: {
    name: {
      type: [String, Number],
      default() {
        return null
      }
    },
    value: {
      type: [String, Number],
      default() {
        return null
      }
    },
    icon: {
      type: String,
      default: 'icon-check'
    },
    iconSize: {
      type: Number,
      default: 40
    },
    checkedColor: {
      type: String,
      default: '#FE7700'
    },
    labelPosition: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    labelDisabled: Boolean,
    border: Boolean,
    shape: {
      type: String,
      default: 'round'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    isDisabled() {
      return (this.parent && this.parent.disabled) || this.disabled
    },
    tabindex() {
      if (this.isDisabled || !this.checked) {
        return -1
      }
      return 0
    },
    currentValue: {
      get() {
        return this.parent ? this.parent.value : this.value
      },
      set(val) {
        (this.parent || this).$emit('input', val)
      }
    },
    checked() {
      return this.currentValue === this.name
    }
  },
  methods: {
    onClickIcon() {
      if (!this.isDisabled) {
        // 触发setter
        this.currentValue = this.name
      }
    },
    onClickLabel() {
      if (!this.isDisabled && !this.labelDisabled) {
        // 触发setter
        this.currentValue = this.name
      }
    },
    onClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="less">
.radio {
    display: flex;
    align-items: center;
    overflow: hidden;
    user-select: none;

    &__icon {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;

        > svg {
            width: 24px;
        }

        &--round {
            border-radius: 50%;
        }

        &--checked {
            background-color: #fe7700;
        }

        &--disabled {
            background-color: #ebedf0;
            border-color: #c8c9cc !important;
        }

        &--border {
            border: 1px solid #fe7700;
        }
    }

    &__label {
        flex: 1;
        margin-left: 24px;
        color: #333;

        &--left {
            float: left;
            margin: 0 24px 0 0;
        }

        &--disabled {
            color: #999;
        }
    }
}


</style>
