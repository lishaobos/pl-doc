<template>
    <div
        class="pl-picker"
        v-if="showPicker"
        @touchmove="touchmove"
    >
        <transition name="fade">
            <div
                class="pl-picker-mask"
                v-show="showMask"
            />
        </transition>
        <transition name="picker-translate">
            <div
                class="pl-picker-box"
                v-show="showBox"
            >
                <div class="pl-picker-box__toolbar">
                    <button
                        class="pl-picker-box__cancel"
                        :disabled="scrolling"
                        @click="close"
                    >
                        取消
                    </button>
                    <button
                        class="pl-picker-box__confirm"
                        :disabled="scrolling"
                        @click="confirm"
                    >
                        确定
                    </button>
                </div>

                <div class="pl-picker-content">
                    <picker-slot
                        v-for="(item, i) of slots"
                        :key="i"
                        :data="item"
                        :scrolling.sync="scrolling"
                        :values-key="valuesKey"
                        @change="(val, index) => { slotChange(val, index, i) }"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import PickerSlot from './Picker-Slot.vue'
export default {
  name: 'PlPicker',
  components: {
    PickerSlot
  },
  data() {
    return {
      showMask: false,
      showBox: false,
      showPicker: false,
      scrolling: false,
      selected: []
    }
  },
  props: {

    /*
    * [{
    *   flex number
    *   values array 要展示的数据源，元素可以是字符串，可以是对象，是对象时，必须指定valuesKey
    *   textAlign string
    * }]
    * */
    slots: {
      type: Array,
      default() {
        return []
      }
    },
    valuesKey: {
      type: String,
      default: null
    },
    show: {
      type: Boolean
    }
  },
  watch: {
    show(val) {
      if (!val) {
        this.close()
        document.documentElement.style.overflow = null
      } else {
        document.documentElement.style.overflow = 'hidden'
        this.showPicker = true
        this.$nextTick(() => {
          this.showMask = true
          setTimeout(() => {
            this.showBox = true
            this.init()
          }, 200)
        })
      }
    }
  },
  methods: {
    init() {
      for (const slot of this.slots) {
        this.selected.push(slot.values[0])
      }
    },
    close() {
      this.showBox = false
      setTimeout(() => {
        this.showMask = false
        this.$emit('update:show', false)
        setTimeout(() => {
          this.showPicker = false
          this.selected = []
          this.$emit('close')
        }, 200)
      }, 200)
    },
    slotChange(val, index, slotIndex) {
      this.selected[slotIndex] = val
    },
    confirm() {
      this.$emit('confirm', this.selected)
      this.close()
    },
    touchmove(e) {
      e.preventDefault()
    }
  }
}
</script>
<style lang="less">
.pl-picker {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: transparent;
}
.pl-picker-mask {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);
    overflow: hidden;
    z-index: 1;
}
.pl-picker-box {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 482px;
    border-radius: 20px 20px 0 0;
    background-color: #fff;
    z-index: 2;
    &__toolbar {
        padding: 0 32px;
        height: 90px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
        > button {
            border: none;
            background: none;
            font-size: 30px;
        }
    }
    &__cancel {
        color: #999;
        &:disabled {
            opacity: .5;
        }
    }
    &__confirm {
        color: #fe7700;
    }
}
.pl-picker-content {
    display: flex;
    height: 295px;
    overflow: hidden;
}

</style>
