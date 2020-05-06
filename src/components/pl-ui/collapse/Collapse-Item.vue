<template>
    <div
        class="pl-collapse-item"
        :class="{ 'hairline--top': index }"
    >
        <div
            :aria-expanded="expanded"
            class="pl-collapse-item__title"
            :class="{ 'pl-collapse-item__title--expanded': expanded, 'pl-collapse-item__title--disabled': disabled }"
            @click="onClick"
        >
            <div
                v-if="title"
                class="pl-collapse-item__title-text"
            >
                <span
                    :class="titleClass"
                    :style="titleStyle"
                >
                    {{ title }}
                </span>
                <span
                    v-if="value"
                    :class="valueClass"
                >
                    {{ value }}
                </span>
            </div>
            <slot
                v-else
                name="title"
            />
            <pl-svg
                v-if="!$slots['icon-right'] && !disabled"
                class="pl-collapse-item__icon--right"
                :name="iconRight.name"
                width="24"
                height="24"
                fill="#CCC"
            />
            <slot
                v-else
                name="icon-right"
            />
        </div>
        <div
            class="pl-collapse-item__wrapper"
            :style="{ height: `${contentHeight}px` }"
        >
            <div
                ref="content"
                class="pl-collapse-item__content"
            >
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
import { ChildrenMixin } from '../assets/mixins/relation'
import { isDef } from '../../../assets/js/util'
export default {
  name: 'CollapseItem',
  mixins: [ChildrenMixin('Collapse')],
  props: {
    iconRight: {
      type: Object,
      default() {
        return {
          name: 'icon-right',
          color: '#CCC'
        }
      }
    },
    center: Boolean,
    disabled: Boolean,
    titleStyle: {
      type: Object,
      default: null
    },
    titleClass: {
      type: Object,
      default: null
    },
    valueClass: {
      type: Object,
      default: null
    },
    title: {
      type: [String, Number],
      default: null
    },
    value: {
      type: [String, Number],
      default: null
    },
    name: {
      type: [String, Number],
      default: null
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      contentHeight: 0
    }
  },
  computed: {
    currentName() {
      return isDef(this.name) ? this.name : this.index
    },
    expanded() {
      if (!this.$parent) {
        return null
      }
      const { value } = this.$parent
      return this.$parent.accordion
        ? value === this.currentName
        : value.some(name => name === this.currentName)
    },
    offsetHeight() {
      return this.$refs.content ? this.$refs.content.offsetHeight : 0
    }
  },
  watch: {
    expanded(expanded) {
      this.$nextTick(() => {
        this.contentHeight = expanded ? this.offsetHeight : 0
      })
    }
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return
      }
      const { $parent } = this
      const name = $parent.accordion && this.currentName === $parent.value ? '' : this.currentName
      this.$parent.switch(name, !this.expanded)
    }
  }
}
</script>

<style lang="less">
.pl-collapse-item {
    position: relative;
    &__title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        color: #333;
        font-size: 24px;
        line-height: 40px;
        background-color: #fff;
        &--expanded {
            .pl-collapse-item__icon--right {
                transform: rotate(-90deg);
            }
        }
        &-text {
            flex: 1;
        }
    }
    &__icon--right {
        width: 22px;
        transform: rotate(90deg);
        transition: .3s;
    }
    &__wrapper {
        transform: translate3d(0, 0, 0);
        overflow: hidden;
        transition: height .3s ease-in-out;
    }
    &__content {
        padding: 16px 0 0;
        color: #333;
        font-size: 24px;
        line-height: 28px;
        background-color: #fff;
    }
}


</style>
