<template>
    <div class="pl-list">
        <span
            class="pl-list_title"
            v-text="title"
            :style="{ color: titleColor }"
        />
        <span
            v-if="content"
            class="pl-list_content"
            v-text="content"
            :style="{ color: contentColor }"
        />
        <div
            v-if="!content"
            class="pl-list_content"
        >
            <slot />
        </div>
    </div>
</template>

<script>
export default {
  name: 'PlList',
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    titleColor: {
      type: String,
      default: '#999'
    },
    contentColor: {
      type: String,
      default: '#333'
    }
  }
}
</script>

<style lang="less">
.pl-list {
    display: flex;
    justify-content: left;
    font-size: 24px;
    line-height: 40px;
    &:nth-last-of-type(1) {
        margin-bottom: 0;
    }
    span {
        display: inline-block;
        &:nth-of-type(1) {
            width: max-content;
        }
        &:nth-of-type(2) {
            flex: 1;
            flex-wrap: wrap;
            white-space: pre-wrap;
            word-break: break-all;
        }
    }
}

</style>
