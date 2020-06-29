<template lang="html">
    <div
        v-show="showPopup"
        class="pl-popup"
        :class="{ [`pl-popup__${position}`]: true }"
    >
        <div
            class="pl-popup__mask"
            :class="{ show: showMask }"
            @click="maskClick"
        />
        <div
            class="pl-popup__box"
            :class="{ show: showBox }"
        >
            <div
                v-if="title"
                class="pl-popup__title"
                :style="{
                    textAlign: titleAlign
                }"
            >
                {{ title }}
            </div>
            <slot
                v-else
                name="title"
            />
            <div class="pl-popup__content">
                <slot />
            </div>
            <div
                v-if="!hideCloseIcon"
                class="pl-popup__close-wrapper"
                @click="close"
            >
                <pl-svg
                    class="pl-popup__close"
                    name="icon-close2"
                    fill="#ccc"
                    width="36"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'PlPopup',
  props: {
    position: {
      type: String,
      default: 'bottom'
    },
    title: {
      type: String,
      default: ''
    },
    titleAlign: {
      type: String,
      default: 'center'
    },
    hideCloseIcon: Boolean,
    show: Boolean,
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.lockBody()

          // 显示dialog
          this.showPopup = true

          // 显示mask
          this.showMask = true
          setTimeout(() => {
            this.showBox = true
          }, 200)
        } else {
          this.unlockBody()
          this.showBox = false

          // 隐藏mask
          setTimeout(() => {
            this.showMask = false

            // 隐藏dialog
            setTimeout(() => {
              this.showPopup = false
              this.$emit('update:show', false)
            }, 200)
          }, 300)
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      showPopup: false,
      showMask: false,
      showBox: false
    }
  },
  deactivated() {
    this.close()
    this.unlockBody()
  },
  beforeDestroy() {
    this.close()
    this.unlockBody()
  },
  methods: {
    lockBody() {
      const { body } = document
      this.scrollY = window.scrollY
      body.style.height = '100vh'
      body.style.overflow = 'hidden'
    },
    unlockBody() {
      const { body } = document
      body.style.height = null
      body.style.overflow = null
      window.scrollTo(0, this.scrollY)
    },
    close() {
      this.$emit('update:show', false)
      this.$emit('close')
    },
    maskClick() {
      if (this.closeOnClickModal) {
        this.close()
      }
    }
  }
}
</script>

<style scale lang="scss">
.pl-popup {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2002;

    &__bottom {
        .pl-popup__box {
            bottom: 0;
            transform: translateY(100%);
        }
    }

    &__top {
        .pl-popup__box {
            top: 0;
            border-radius: 0 0 20px 20px;
            transform: translateY(-100%);
        }
    }

    &__mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .65);
        z-index: 1;
        opacity: 0;
        transition: opacity .2s ease-in-out;
        &.show {
            opacity: 1;
        }
    }

    &__box {
        position: absolute;
        left: 0;
        width: 100%;
        background-color: #fff;
        border-radius: 20px 20px 0 0;
        transition: transform .3s ease-in-out;
        z-index: 2;
        overflow: hidden;
        &.show {
            transform: translateY(0);
        }
    }

    &__title {
        box-sizing: border-box;
        padding: 28px;
        font-size: 30px;
        color: #333;
    }

    &__content {
        max-height: 80vh;
        overflow: auto;
    }

    &__close-wrapper {
        position: absolute;
        top: 24px;
        right: 26px;
        > svg {
            width: 46px;
            height: 46px;
        }
    }

    &__close {
        width: 19px;
        height: 19px;
    }
}

</style>
