<template>
    <div :class="$style.count">
        <button
            :class="$style.subtract"
            @click.stop="subtract"
            :disabled="localCount <= min || loading || disabled"
        />
        <input
            :class="$style.input"
            type="tel"
            :value="localCount"
            :disabled="disabled"
            @change="valueChange"
        >
        <button
            :class="$style.add"
            @click.stop="add"
            :disabled="localCount >= max || loading || disabled"
        />
    </div>
</template>

<script>
export default {
  name: 'Count',
  data() {
    return {
      localCount: 1,
      loading: false
    }
  },
  props: {
    max: {
      type: [Number, String],
      default: Number.MAX_VALUE
    },
    min: {
      type: [Number, String],
      default: 1
    },
    count: {
      type: [Number, String],
      default: 1
    },
    disabled: Boolean
  },
  watch: {
    count: {
      handler(val) {
        this.localCount = val
      },
      immediate: true
    }
  },
  methods: {
    add() {
      let temp = this.localCount
      temp++
      this.emitChange(temp)
    },
    subtract() {
      let temp = this.localCount
      temp--
      this.emitChange(temp)
    },
    valueChange(e) {
      const val = Number.parseInt(e.currentTarget.value)
      if (val && (val <= this.max && val >= this.min)) {
        this.emitChange(val)
      } else {
        e.target.value = this.localCount
      }
    },

    /**
     * 数值改变事件
     * @param count {number} 即将改变的值
     */
    emitChange(count) {
      this.loading = true

      /**
       * 触发change事件，在外部调用回调函数后，再改变localCount，并且可以指定localCount
       * 如果err存在，则不改变当前数值
       */
      this.$emit('change', count, err => {
        if (!err) {
          this.localCount = count
        }
        this.loading = false
      })
    }
  }
}
</script>

<style module lang="scss">
  .count {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 146px;
    line-height: 66px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid #e7e7e7;
    background-color: #f6f6f6;
    overflow: hidden;
    .input {
      flex: 1;
      width: 100%;
      height: 90%;
      font-size: 22px;
      text-align: center;
      z-index: 2;
      color: #000;
      background-color: transparent;
      &:disabled {
        color: #aaa;
      }
    }
    .subtract, .add {
      position: relative;
      width: 40px;
      height: 36px;
      z-index: 2;
      vertical-align: -5px;
      font-weight: bold;
      &:disabled {
        opacity: 0.3;
      }
      &:before {
        position: absolute;
        top: 0;
        left: 50%;
        line-height: 34px;
        transform: translateX(-50%);
        width: 20px;
        font-size: 24px;
      }
    }
    .subtract {
      border-right: 1px solid #e7e7e7;
      background-color: #fff;
      &:before {
        content: '-';
      }
    }
    .add {
      border-left: 1px solid #e7e7e7;
      background-color: #fff;
      &:before {
        content: '+';
      }
    }
  }
</style>
