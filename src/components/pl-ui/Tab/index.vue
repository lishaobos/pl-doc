<template>
    <div :class="['pl-tab' + ` pl-tab__${size}`]">
        <div
            v-for="(item, i) of tabs"
            :key="i"
            class="pl-tab__pane"
            :class="{ active: item[options.id] === currentId,'color9': color9 }"
            @click="handleClick(item)"
        >
            {{ item[options.name] }}
            <slot :name="'tab-pane-' + i" />
        </div>
    </div>
</template>

<script>
export default {
  name: 'PlTab',
  props: {
    tabs: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {
          name: 'name',
          id: 'id'
        }
      }
    },
    size: {
      type: String,
      default: 'large'
    },
    activeId: {
      type: [String, Number],
      default: ''
    },
    count: {
      type: Object,
      default: null
    },
    color9: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentId: null
    }
  },
  watch: {
    activeId() {
      this.currentId = this.activeId
    }
  },
  mounted() {
    this.currentId = this.activeId
  },
  methods: {
    handleClick(item) {
      if (this.currentId !== item[this.options.id]) {
        this.currentId = item[this.options.id]
        this.$emit('change', item)
      }
      this.$emit('update:activeId', this.currentId)
    }
  }
}
</script>

<style lang="less">
.color9 {
    color: #999;
}
.pl-tab {
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #333;
    background-color: #fff;
    &.pl-tab__small {
        font-size: 26px;
        > div {
            padding: 0;
            height: 80px;
            line-height: 80px;
        }
    }
    &.pl-tab__middle {
        font-size: 30px;
        > div {
            padding: 0 30px;
            height: 90px;
            line-height: 90px;
        }
    }
    &.pl-tab__large {
        font-size: 32px;
        > div {
            padding: 0 30px;
            height: 100px;
            line-height: 100px;
        }
    }
    &__pane {
        position: relative;
        &:after {
            position: absolute;
            left: 0;
            bottom: 0;
            height: 3px;
            width: 100%;
            background-color: #f2b036;
        }
        &.active {
            color: #f2b036;
            &:after {
                content: '';
            }
        }
    }
}

</style>
