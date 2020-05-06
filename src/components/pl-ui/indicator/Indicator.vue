<template>
    <div class="pl-indicator">
        <div class="pl-indicator-loading">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="32"
                height="32"
                class="loading-svg"
                style="display: block;"
                fill="#fff"
            >
                <path
                    opacity=".25"
                    d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"
                />
                <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 16 16"
                        to="360 16 16"
                        dur="0.8s"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>
            <span
                class="pl-indicator-loading-text"
                v-text="text"
            />
        </div>
    </div>
</template>

<script>
export default {
  name: 'PlIndicator',
  data() {
    return {
      open: false,
      text: ''
    }
  }
}
</script>

<style lang="less">
.pl-indicator {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 9999;
    .pl-indicator-loading {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100px;
        padding: 20px 16px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, .5);
        > .loading-svg {
            width: 50px;
            height: 50px;
        }
    }
    .pl-indicator-loading-text {
        margin-top: 10px;
        font-size: 28px;
        color: #fff;
    }
}

</style>
