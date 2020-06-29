<template>
    <div
        class="pl-checkbox"
        :style="{
            display: inline ? 'inline-flex' : 'flex',
            marginBottom: gapColumn / 7.5 + 'vw',
            marginRight: gapRow / 7.5 + 'vw'
        }"
    >
        <input
            v-show="false"
            :id="'checkbox' + _uid"
            ref="checkbox"
            type="checkbox"
            :checked="checked || localChecked"
            :disabled="disabled"
            @change="handleChange"
        >
        <slot name="prefix" />
        <label
            :for="'checkbox' + _uid"
            ref="label"
        >
            <span
                :class="{
                    'pl-checkbox-inner': true,
                    'checked': checked || (data && data.checked),
                    border
                }"
            >
                <span
                    v-if="data && disabled"
                    class="pl-checkbox__inner disabled"
                />
                <template v-else>
                    <span
                        v-show="checked || (data && data.checked)"
                        class="pl-checkbox__inner checked"
                    />
                    <span
                        v-show="!(checked || (data && data.checked))"
                        class="pl-checkbox__inner"
                    />
                </template>
            </span>
        </label>

        <slot
            name="suffix"
            :data="data"
        />
    </div>
</template>

<script>
export default {
  name: 'PlCheckbox',
  data() {
    return {
      localChecked: false
    }
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {

    /**
     * 绑定的值
     * 一般用于checkbox-group，将作为已选数据中的一个值
     * 如果绑定了值，则认为有一组待选的值，使用checkbox-group监听整体变化
     */
    data: {
      type: [Object, String, Number],
      default() {
        return null
      }
    },

    // 单独使用时绑定的值
    checked: Boolean,

    // 是否禁用
    disabled: Boolean,

    // 是否以行内元素显示
    inline: Boolean,

    // 半选效果（暂时没有设计）
    indeterminate: Boolean,

    // 纵向间隙
    gapColumn: {
      type: Number,
      default: 0
    },

    // 横向间隙
    gapRow: {
      type: Number,
      default: 0
    },
    border: Boolean,
    canPrefixClick: Boolean
  },
  watch: {
    checked: {
      handler(val) {
        this.localChecked = val
      },
      immediate: true
    },

    /*
    * 数据
    * 可添加属性checked来规定默认选中的项
    * 如果数据时对象且不是数组，且有checked属性，则更加当前的checkd数据来判断选中状态
    * */
    data: {
      handler(val) {
        // TODO 需要优化
        if (val && typeof val === 'object' && !Array.isArray(val) && val.hasOwnProperty('checked')) {
          this.$emit('change', val.checked, val)
          this.$emit('update:checked', val.checked)
          this.changed(val.checked)
        }
      },
      deep: true,

      // 立即改变，此处不应该深度监听
      immediate: true
    }
  },
  computed: {
  },
  methods: {
    handleChange(e) {
      const { checked } = e.currentTarget
      this.changed(checked)
      this.$emit('change', checked, this.data)
      this.$emit('update:checked', checked)
    },
    changed(checked) {
      if (typeof this.$parent.change === 'function') {
        this.$parent.change(checked, this.data)
      }
      if (this.data && typeof this.data === 'object' && !Array.isArray(this.data)) {
        this.data.checked = checked
        this.$set(this.data, 'checked', checked)
      }
    }

    // 选中方法
    // selected () {
    //   if (typeof this.$parent.change === 'function') {
    //     this.$parent.change(true, this.data)
    //   }
    //   // this.localChecked = true
    //   // 调用回调，可使状态回到未选择
    //   // this.$emit('change', true, this.data)
    //   if (this.data && this.data.hasOwnProperty('checked')) {
    //     this.data.checked = true
    //   }
    // },
    // 取消选中方法
    // cancel () {
    //   if (this.$parent.change) {
    //     this.$parent.change(false, this.data)
    //   }
    //   this.localChecked = false
    //   this.$emit('change', false, this.data)
    //   if (this.data && this.data.hasOwnProperty('checked')) {
    //     this.data.checked = false
    //   }
    // }
  }
}
</script>

<style scale lang="scss">
.pl-checkbox {
    align-items: center;
    align-self: center;
    &:nth-last-of-type(1) {
        margin-bottom: 0 !important;
        margin-right: 0 !important;
    }
    > label {
        display: inline-flex;
        align-items: center;
    }
}
.pl-checkbox-inner {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    box-sizing: border-box;
    > .pl-checkbox__inner {
        display: inline-block;
        width: 36px;
        height: 36px;
        border-radius: 18px;
        border: 2px solid #ccc;
        box-sizing: border-box;
        &.checked {
            position: relative;
            background-color: #f2b036;
            border: none;
            &:before {
                position: absolute;
                top: 20px;
                left: 7px;
                content: '';
                width: 10px;
                height: 3px;
                transform: rotate(45deg);
                background-color: #fff;
                border-radius: 2px;
            }
            &:after {
                position: absolute;
                top: 18px;
                left: 12px;
                content: '';
                width: 20px;
                height: 3px;
                transform: rotate(-45deg);
                background-color: #fff;
                border-radius: 2px;
            }
        }
        &.disabled {
            background-color: #ddd;
        }
    }
    > .weixuanzhong1 {
        display: none;
    }
    &.border {
        > .weixuanzhong1 {
            display: inline-block;
        }
    }
}

</style>
