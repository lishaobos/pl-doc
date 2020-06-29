<template>
    <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        type="animation"
        @after-leave="closed"
    >
        <div
            :class="{
                'pl-loading': true,
                mask
            }"
            v-show="show"
        >
            <div class="pl-loading-box">
                <svgicon
                    name="penglai-ui/loading"
                    class="pl-loading-icon"
                    color="#fff"
                />
                <div class="pl-loading-message" v-if="message" v-text="message" />
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: 'Loading',
  components: {
  },
  data() {
    return {
      show: false,
      message: ''
    }
  },
  props: {
    mask: Boolean
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

<style scale lang="scss">
.pl-loading {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 10000;
    &.mask {
        background-color: rgba(0, 0, 0, .3);
    }
}
.pl-loading-icon {
    width: 64px;
    animation: rotate 2s linear infinite;
}
.pl-loading-message {
    margin-top: 22px;
    font-size: 28px;
    color: #fff;
}
.pl-loading-box {
    max-width: 80vw;
    padding: 60px;
    text-align: center;
    width: max-content;
    background-color: rgba(0, 0, 0, .6);
}
@keyframes rotate {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}

</style>
