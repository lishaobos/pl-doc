<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        type="animation"
        @after-leave="closed"
    >
        <div
            class="pl-toast"
            v-show="show"
        >
            <pl-svg
                v-if="type === 'error'"
                class="pl-toast-icon"
                name="icon-shibai"
                fill="#fff"
                width="72"
            />
            <pl-svg
                v-if="type === 'success'"
                class="pl-toast-icon"
                name="icon-chenggong"
                fill="#fff"
                width="72"
            />
            <pl-svg
                v-if="type === 'warning'"
                class="pl-toast-icon"
                name="icon-warning"
                fill="#fff"
                width="72"
            />
            <div class="toast-message">
                <p v-text="message" />
                <p class="toast-vice-message" v-text="viceMessage" />
                <slot />
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: 'Toast',
  components: {
  },
  data() {
    return {
      show: false,
      message: '',
      viceMessage: '',
      timer: 0,
      type: ''
    }
  },
  methods: {
    close() {
      this.show = false
    },
    closed() {
      document.body.removeChild(this.$el)
    }
  }
}
</script>

<style lang="less">
.pl-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90vw;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 58px 62px;
    word-break: keep-all;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    text-align: center;
    border-radius: 4px;
    box-sizing: border-box;
    z-index: 9999;
    .toast-message {
        width: max-content;
        max-width: 100%;
        margin-top: 16px;
        font-size: 32px;
        word-break: break-all;
        white-space: pre-wrap;
        .toast-vice-message {
            width: max-content;
            max-width: 100%;
            margin-top: 4px;
            font-size: 24px;
            word-break: break-all;
            white-space: pre-wrap;
        }
    }
}

</style>
