<template>
    <div
        :class="{ 'pl-selector': true, ['pl-selector-' + size]: true }"
        @click="onOff"
    >
        <span v-text="label" />
        <pl-svg
            name="icon-go-down"
            :class="{ 'pl-selector-open': showSelect }"
        />
        <transition name="fade">
            <ul
                class="pl-selector-picker"
                ref="picker"
                v-show="showSelect"
            >
                <li
                    v-for="(item, i) of data"
                    :key="i"
                    class="pl-selector-picker-item"
                    v-text="item.label"
                    @click="handleChange(item)"
                />
            </ul>
        </transition>
    </div>
</template>

<script>
export default {
  name: 'PlSelector',
  data() {
    return {
      showSelect: false,
      label: ''
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  created() {
    this.label = this.data[0].label
  },
  methods: {
    onOff() {
      this.showSelect = !this.showSelect
    },
    handleChange(item) {
      this.label = item.label
      this.$emit('change', item)
    }
  }
}
</script>

<style scale lang="scss">
.pl-selector {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    overflow: visible;
    span {
        font-size: 32px;
        color: #24253d;
    }
    svg {
        width: 28px;
        height: 28px;
        transition: transform .3s linear;
        &.pl-selector-open {
            transform: rotate(180deg);
        }
    }
    &.pl-selector-small {
        height: 80px;
    }
}
.pl-selector-picker {
    position: absolute;
    top: 110%;
    left: 0;
    width: max-content;
    /*height: 300px;*/
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .1);
    background-color: #fff;
    z-index: 9999;
    overflow: hidden;
}
.pl-selector-picker-item {
    padding: 10px 20px;
    line-height: 40px;
    &:nth-of-type(2n - 1) {
        background-color: #fdfdfd;
    }
}

</style>
