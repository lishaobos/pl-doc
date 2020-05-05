<template lang="html">
    <div class="pl-progress steps--vertical">
        <div class="step__wrapper" v-if="steps.length">
            <div
                v-for="(item, index) of steps"
                :key="index"
                class="hairline step step--vertical"
                :class="{ 'step--finish': index < active, 'step--process' : index === active }"
            >
                <div class="step__title" :style="{ color: index === active ? activeColor : '' }">
                    <div v-text="item.text" />
                    <div class="step__title-desc" v-text="item.desc" />
                </div>
                <div class="step__circle-container">
                    <div
                        class="step__circle"
                        :class="{ 'step__active': index === active }"
                        :style="{ backgroundColor: (index < active + 1) ? activeColor : '' }"
                    />
                </div>
                <div
                    v-if="index !== 0"
                    class="step__line step__line--before"
                    :style="{ backgroundColor: (index < active + 1) ? activeColor : '' }"
                />
                <div
                    v-if="index !== steps.length - 1"
                    class="step__line step__line--after"
                />
                <!-- <div
          v-if="index !== steps.length - 1"
          class="step__line step__line--after"
          :style="{ backgroundColor: (index < active + 1) ? activeColor : '' }"
        /> -->
            </div>
        </div>
        <div class="no-content" v-else>
            没找到您要的信息。。。
        </div>
    </div>
</template>

<script>
export default {
  name: 'PlProgress',
  props: {
    steps: {
      type: Array,
      default() {
        return []
      }
    },
    active: {
      type: [String, Number],
      default: 0
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    activeColor: {
      type: String,
      default: '#F2B036'
    }
  }
}
</script>

<style lang="less">
.pl-progress {
  overflow: hidden;
  background-color: #FFF;

  .step {
    position: relative;
    flex: 1;
    font-size: 28px;
    font-weight: 400;
    color: #333333;
    padding-bottom: 36px;

    &--finish {
      color: #333333;
      .step__title {
        color: #F2B036;
      }
    }
    &--process {
      .step__title {
        color: #F2B036;
      }
    }

    &__title {
      &-desc {
        font-size: 24px;
        font-weight: 400;
        color: #999999;
        line-height: 34px;
        padding-top: 4px;
      }
    }

    &__circle {
      width: 18px;
      height: 18px;
      background-color: #CCCCCC;
      border-radius: 50%;
    }

    &--vertical {
      font-size: 28px;
      line-height: 40px;

      &:first-child {
        &::before {
          position: absolute;
          top: 0;
          left: -15px;
          z-index: 1;
          width: 1px;
          height: 20px;
          background-color: #FFF;
          content: '';
        }
      }

      .step__active,
      .step__circle,
      .step__line {
        position: absolute;
        top: 19px;
        left: -49px;
        z-index: 2;
        transform: translate3d(-50%, -50%, 0);
      }

      .step__active {
        top: 20px;
        font-size: 12px;
        line-height: 1;
        width: 26px;
        height: 26px;
      }
      .step__circle {
        top: 20px;
      }
      .step__line {
        z-index: 1;
        width: 6px;
        height: 50%;
        background-color: #CCCCCC;
        transform: translate3d(-50%, 0, 0);

        &--before {
          top: -41px;
        }
        &--after {
          top: 19px;
        }
      }
    }
  }
}

.no-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  width: 100%;
  text-align: center;
}

.steps--vertical {
  padding-left: 114px;
}
</style>
