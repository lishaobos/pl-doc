<template lang="html">
    <div
        v-if="isShow"
        class="pl-modal"
    >
        <div
            class="overlay"
            :class="{ show: isOverlayShow }"
            :style="{ zIndex }"
            @click="onClickOverlay"
        />
        <div
            class="pl-modal__content"
            :class="{ show: isModalShow }"
            :style="{ zIndex: zIndex + 1, width, height }"
        >
            <pl-svg
                v-if="!hideCloseButton"
                class="pl-modal__close-btn"
                name="icon-close2"
                fill="#ccc"
                @click="onClose"
            />
            <div
                v-if="title"
                class="pl-modal__title"
                :class="{ 'pl-modal__title--isolated': !message && !$slots['default'] }"
                :style="{ textAlign: titleAlign }"
                v-text="title"
            />
            <div
                v-if="message"
                class="pl-modal__message"
                :class="{ 'pl-modal__message--has-title': title }"
                :style="{ textAlign: messageAlign }"
                v-text="message"
            />
            <slot />
            <div
                v-if="!hideFooter"
                class="pl-modal__footer hairline--top"
            >
                <button
                    v-if="!hideCancelButton"
                    class="pl-modal__button pl-modal__cancel hairline--right"
                    :style="{ color: cancelButtonColor }"
                    v-text="cancelButtonText"
                    @click="onCancel"
                />
                <button
                    v-if="!hideConfirmButton"
                    class="pl-modal__button pl-modal__confirm"
                    :style="{ color: confirmButtonColor }"
                    v-text="confirmButtonText"
                    @click="onConfirm"
                />
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'PlModal',
  props: {
    show: Boolean,
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    titleAlign: {
      type: String,
      default: 'center'
    },
    message: {
      type: String,
      default: ''
    },
    messageAlign: {
      type: String,
      default: 'center'
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    confirmButtonColor: {
      type: String,
      default: '#FE7700'
    },
    cancelButtonColor: {
      type: String,
      default: '#666666'
    },
    hideConfirmButton: Boolean,
    hideCancelButton: Boolean,
    hideCloseButton: Boolean,
    hideFooter: Boolean,

    // 点击浮层是否关闭
    closeOnClickOverlay: Boolean,
    asyncClose: Boolean
  },
  data() {
    return {
      isShow: false,
      isOverlayShow: false,
      isModalShow: false,
      loading: {
        confirm: false,
        cancel: false
      }
    }
  },
  watch: {
    show(value) {
      if (value) {
        this.isShow = value
        setTimeout(() => {
          this.isOverlayShow = true
          this.isModalShow = true
        }, 200)
      } else {
        this.isOverlayShow && this.isModalShow && this.closeModal()
      }
    }
  },
  methods: {
    stopLoading() {
      this.loading.cancel = false
      this.loading.confirm = false
    },
    showModal() {
      this.isShow = true
      setTimeout(() => {
        this.isModalShow = true
        this.isOverlayShow = true
      }, 200)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
      })
    },
    closeModal() {
      this.isModalShow = false
      this.isOverlayShow = false
      setTimeout(() => {
        this.isShow = false
      }, 200)
    },
    handleAction(e, action) {
      if (this.asyncClose) this[`loading.${action}`] = true
      this.onClose(e, action)
    },
    onConfirm(e) {
      this.handleAction(e, 'confirm')
    },
    onCancel(e) {
      this.handleAction(e, 'cancel')
    },
    onClickOverlay() {
      if (!this.closeOnClickOverlay) return
      this.onClose('overlay')
    },
    onClose(e, action) {
      if (!this.asyncClose) {
        this.closeModal()
      }
      this.$emit('close', action)
      this.$emit('update:show', false)

      // 把 modal 实例传递出去
      action && this.$emit(action, { vm: this })
      this.resolve && this.resolve(action)
    }
  }
}
</script>

<style lang="less">
.pl-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;

    .overlay {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .65);
        overflow: hidden;
        opacity: 0;
        transition: opacity .3s ease-in-out;
        &.show {
            opacity: 1;
        }
    }

    &__content {
        position: relative;
        width: 85%;
        overflow: hidden;
        font-size: 32px;
        background-color: #fff;
        border-radius: 20px;
        opacity: 0;
        transition: opacity .3s ease-in-out;
        &.show {
            opacity: 1;
        }
    }

    &__close-btn {
        position: absolute;
        top: 24px;
        right: 24px;
        width: 46px;
        height: 46px;
    }

    &__title {
        padding: 50px 50px 0;
        text-align: center;
        font-size: 36px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: #333;
        line-height: 50px;

        &--isolated {
            padding: 50px;
        }
    }

    &__message {
        padding: 50px;
        line-height: 44px;
        font-size: 34px;
        font-family: PingFang-SC-Regular;
        color: #000;
        -webkit-text-stroke: 1px rgba(151, 151, 151, 1);
                text-stroke: 1px rgba(151, 151, 151, 1);

        &--has-title {
            padding-top: 30px;
        }

        &--left {
            text-align: left;
        }

        &--right {
            text-align: right;
        }
    }

    &__footer {
        display: flex;
    }

    &__button {
        flex: 1;
        height: 100px;
        line-height: 100px;
        font-size: 34px;
    }

    .hairline--top {
        border-top: 2px solid #d3d1d2 !important;
    }

    .hairline--right {
        border-right: 2px solid #d3d1d2 !important;
    }
}

</style>
