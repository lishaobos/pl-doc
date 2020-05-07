<template>
    <div
        :class="{ 'pl-input': true, border, ['pl-input-' + size]: true }"
        @click="handleClick"
    >
        <div
            class="pl-input_prefixicon"
            v-if="prefixIcon"
        >
            <pl-svg
                :class="{ focus }"
                :name="prefixIcon"
                fill="#ccc"
                width="24"
            />
        </div>
        <div
            class="pl-textarea_box"
            v-if="type === 'textarea'"
        >
            <textarea
                class="pl-input-textarea"
                :maxlength="maxlength"
                :value="value"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                :disabled="disabled"
                :readonly="readonly"
                :rows="rows"
                :placeholder="placeholder"
            />
            <span
                class="pl-input__word-count"
                v-if="maxlength > 0"
            >
                <i v-text="length > maxlength ? maxlength : length" />
                /
                <i v-text="maxlength" />
            </span>
        </div>
        <div
            v-else
            class="pl-input_box"
        >
            <input
                :type="type === 'password' ? passwordType : type"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                :value="value"
                :disabled="disabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                :placeholder="placeholder"
                :unselectable="readonly ? 'on' : ''"
                :style="{
                    textAlign: align || formAlign
                }"
            >
            <pl-svg
                v-if="!disabled && type.indexOf('password') === -1"
                v-show="value"
                class="pl-input_clear"
                fill="#ccc"
                name="icon-close2"
                @click="clear"
            />
            <pl-svg
                v-if="type === 'password' && passwordType === 'password'"
                v-show="value"
                class="pl-input_clear"
                name="icon-hidden-key"
                fill="#ccc"
                @click="passwordType = 'show-password'"
            />
            <pl-svg
                v-if="type === 'password' && passwordType === 'show-password'"
                v-show="value"
                class="pl-input_clear"
                name="icon-show-key"
                fill="#ccc"
                @click="passwordType = 'password'"
            />
        </div>
        <div
            class="pl-input_suffixicon"
            v-if="suffixIcon"
        >
            <pl-svg
                :class="{ focus }"
                :name="suffixIcon"
                fill="#ccc"
                width="24"
            />
        </div>
    </div>
</template>

<script>
import { toArray, hasUnicode } from '../assets/js/unicode-to-array'

export default {
  name: 'PlInput',
  model: {
    event: 'input',
    prop: 'value'
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'text'
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    autocomplete: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    maxlength: {
      type: Number,
      default: 0
    },
    minRows: {
      type: Number,
      default: 1
    },
    maxRows: {
      type: Number,
      default: 0
    },
    align: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    readonly: Boolean,
    border: Boolean
  },
  data() {
    return {
      focus: false,
      rows: 0,
      formAlign: null,
      rule: null,
      prop: '',
      error: false,
      passwordType: 'password',
      bfscrolltop: 0,
      isIOS: false,
      getLine: null,
      $form: null,
      $formItem: null
    }
  },
  computed: {

    // 统计包含emoji表情的字长
    length() {
      if (!this.maxlength) return false
      const { value } = this

      // 是否包含emoji表情
      return hasUnicode(value)
        ? toArray(value).length
        : value.length
    }
  },
  watch: {

    // 字数长度达到最大值提醒
    length(value) {
      if (!this.maxlength) return false
      if (value > this.maxlength) {
        this.$emit('alert')
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.rows = this.minRows || 0
      this.bfscrolltop = document.body.scrollTop
      this.$form = this.$parent.$parent
      this.$formItem = this.$parent
      this.rule = this.$formItem.rule
      this.prop = this.$formItem.prop
      this.isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      this.setAlign()
    })
  },
  methods: {
    handleInput(e) {
      const val = e.target.value
      this.$emit('input', val)
      this.trigger(e)
    },
    handleFocus(e) {
      if (this.readonly) {
        /* 防止苹果手机出现‘完成’ */
        e.target.blur()
      } else {
        // if (this.isIOS) document.body.scrollTop = document.body.scrollHeight
        this.$emit('focus', e)
        this.focus = true
        this.trigger(e)
      }
    },
    handleBlur(e) {
      document.body.scrollTop = this.bfscrolltop
      this.$emit('blur', e)
      this.focus = false
      this.trigger(e)
    },
    handleChange(e) {
      this.$emit('change', e)
      this.trigger(e)
    },
    clear() {
      this.$emit('input', '')
      this.$emit('clear')
    },
    setAlign() {
      this.formAlign = this.align || this.$formItem.align || this.$form.align
    },
    trigger(event) {
      if (this.rule) {
        this.error = !this.$form.validateByFields(this.prop, event)
      }
    },
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>
<style lang="less">
.pl-input {
    position: relative;
    display: inline-flex;
    flex: 1;
    width: 100%;
    height: 100%;
    align-items: center;
    background-color: transparent;
    box-sizing: border-box;
    &.border {
        padding: 0 24px;
        height: 100%;
        border: 1px solid #e7e7e7;
        border-radius: 16px;
    }
    &.pl-input-mini {
        min-height: 88px;
    }
    &.pl-input-small {
        min-height: 92px;
        font-size: 28px;
    }
    &.pl-input-middle {
        min-height: 108px;
        font-size: 32px;
    }
    .pl-input_box {
        position: relative;
        flex: 1;
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
        input {
            display: block;
            width: 100%;
            color: #333;
            box-sizing: border-box;
            background-color: transparent !important;
            &::-webkit-input-placeholder {
                font-size: 28px;
                color: #ccc;
            }
            &:disabled {
                background-color: #fff !important;
                color: #999 !important;
                opacity: 1 !important;
            }
            &:read-only {
                -webkit-user-select: none;
                   -moz-user-select: none;
                    -ms-user-select: none;
                        user-select: none;
            }
        }
        .pl-input_clear {
            width: 40px;
            height: 40px;
            padding-right: 20px;
            margin-left: 10px;
        }
    }
    .pl-input_prefixicon,
    .pl-input_suffixicon {
        margin-right: 10px;
        svg {
            width: 36px;
            height: 36px;
            vertical-align: -8px;
            fill: #ccc;
            &.focus {
                fill: #333;
                path {
                    fill: #333;
                }
            }
        }
    }
    .pl-input_suffixicon {
        margin-left: 10px;
        margin-right: 0;
    }
}
.pl-textarea_box {
    position: relative;
    width: 100%;
    padding: 24px;
    margin-left: 10px;
    .pl-input-textarea {
        box-sizing: border-box;
        width: 100%;
        min-height: 100px;
        line-height: 40px;
        font-size: 26px;
        border: none;
        outline: none;
        resize: none;
        background: transparent;
    }
    .pl-input__word-count {
        position: absolute;
        bottom: 0;
        font-size: 20px;
        right: 28px;
        line-height: 32px;
        > i {
            &:nth-of-type(1) {
                color: #666;
            }
            &:nth-of-type(2) {
                color: #999;
            }
        }
    }
}



</style>
