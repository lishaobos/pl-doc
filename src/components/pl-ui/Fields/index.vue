<template>
    <div class="pl-fields">
        <div
            :class="'pl-fields_box ' + size"
            @click="handleClick"
        >
            <div class="pl-fields_text">
                <pl-svg
                    :fill="iconColor"
                    v-if="icon && iconPosition === 'left'"
                    :name="icon"
                    :width="iconWidth"
                    :type="iconType"
                    :height="iconHeight"
                    class="pl-fields_icon"
                    :style="{ paddingRight: iconGap / 7.5 + 'vw'}"
                />
                <span
                    v-text="text"
                    :style="{ fontWeight: leftTextWeight, color: titleColor }"
                />
                <pl-svg
                    :fill="iconColor"
                    v-if="icon && iconPosition === 'right'"
                    :name="icon"
                    :type="iconType"
                    :width="iconWidth"
                    :height="iconHeight"
                    class="pl-fields_icon"
                    :style="{ paddingRight: iconGap / 7.5 + 'vw'}"
                />
            </div>
            <div class="pl-fields_right" @click.stop="fieldsRightClick">
                <span
                    v-if="rightText"
                    class="pl-fields_right_text"
                    v-text="rightText"
                    :style="{ fontWeight: rightTextWeight }"
                />
                <pl-svg
                    :fill="iconColor"
                    v-if="route || showRightIcon"
                    :name="rightIcon"
                    width="20"
                    height="20"
                    :type="iconType"
                    :class="{
                        'pl-fields_right_icon': true,
                        'is-collapse': canCollapse && collapse,
                        'no-collapse': canCollapse && !collapse
                    }"
                    :style="{ paddingRight: iconGap / 7.5 + 'vw'}"
                />
                <!--<pl-svg
          v-if="route || showRightIcon"
          :class="{
            'pl-fields_right_icon': true,
            'is-collapse': canCollapse && collapse,
            'no-collapse': canCollapse && !collapse
          }"
          :name="rightIcon"
        />-->
            </div>
        </div>

        <transition name="collapse">
            <div
                v-if="hasSlot"
                v-show="canCollapse ? collapse : true"
            >
                <slot />
            </div>
        </transition>
    </div>
</template>

<script>
export default {
  name: 'PlFields',
  data() {
    return {
      collapse: false
    }
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    iconType: {
      type: String,
      default: 'svg'
    },
    iconColor: {
      type: String,
      default: ''
    },

    // 图片和文字直接的间隙
    iconGap: {
      type: Number,
      default: 0
    },
    iconPosition: {
      type: String,
      default: 'left'
    },
    text: {
      type: String,
      default: ''
    },
    titleColor: {
      type: String,
      default: '#2e2e2e'
    },
    rightTextWeight: {
      type: String,
      default: 'normal'
    },
    leftTextWeight: {
      type: String,
      default: 'normal'
    },
    rightText: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: 'icon-right'
    },
    showRightIcon: Boolean,
    route: {
      type: Object,
      default() {
        return null
      }
    },
    size: {
      type: String,
      default: 'large'
    },

    // 支持展开slot
    canCollapse: Boolean,
    iconWidth: {
      type: Number,
      default: 50
    },
    iconHeight: {
      type: Number,
      default: 50
    }
  },
  computed: {
    hasSlot() {
      return Boolean(this.$slots.default)
    },
    slot() {
      return this.$slots.default[0] ? this.$slots.default[0].elm : {}
    },
    height() {
      return this.slot
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
      if (this.route) {
        this.$router.push(this.route)
      }
    },
    fieldsRightClick() {
      this.$emit('click')
      if (this.route) {
        this.$router.push(this.route)
      }
      if (this.canCollapse) {
        this.collapse = !this.collapse
      }
    }
  }
}
</script>

<style scale lang="scss">
.pl-fields {
    position: relative;
    background-color: #fff;
}
.pl-fields_box {
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e7e7e7;
    &.large {
        height: 100px;
    }
    &.middle {
        height: 88px;
    }
    &.small {
        height: 70px;
    }
}
.pl-fields_text {
    font-size: 28px;
    flex: 1;
}
.pl-fields_icon {
    /*width: 34px;*/
    /*height: 34px;*/
    vertical-align: -14px;
}
.pl-fields_right {
    margin-right: 30px;
    display: flex;
    align-items: center;
    .pl-fields_right_text {
        font-size: 28px;
        color: #999;
    }
    .pl-fields_right_icon {
        margin-top: 2px;
        margin-left: 10px;
        fill: #ccc;
        transform: scaleY(1.2);
        transition: transform .2s linear;
        &.no-collapse {
            transform: rotate(90deg);
        }
        &.is-collapse {
            transform: rotate(-90deg);
        }
    }
}

</style>
