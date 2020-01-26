<template>
  <div
    :class="$style.fileSelector"
    @click="clickHandler"
    :style="{
      width: boxWidth + 'px',
      height: boxHeight + 'px',
      marginLeft: marginLeft + 'px',
      borderRadius: borderRadius + 'px'
    }"
  >
    <pl-svg name="icon-icon--shangchuan" width="18" />
    <i v-text="uploadText" />
    <slot />
  </div>
</template>

<script>
import PlSvg from './../../PlSvg'
export default {
  name: 'FileSelector',
  components: { PlSvg },
  methods: {
    clickHandler(e) {
      this.$emit('click', e)
    }
  },
  props: {
    boxWidth: {
      type: Number,
      default: 72
    },
    boxHeight: {
      type: Number,
      default: 72
    },
    listLength: {
      type: Number,
      default: 0
    },
    uploadText: {
      type: String,
      default: '上传图片'
    },
    marginLeft: {
      type: Number,
      default: 20
    },
    borderRadius: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style module lang="scss">
  .file-selector {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 22px;
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    cursor: pointer;
    color: #999;
  }
</style>
