<template>
  <svg
    :class="$style.plSvg"
    aria-hidden="true"
    @click="clickHandler"
    :style="{
      width: truthWidth,
      height: truthHeight
    }"
    @hover="hoverHandler"
    v-if="update"
  >
    <use :xlink:href="'#' + (tempName || name)" />
  </svg>
</template>

<script>
import { promise } from '@wechatAdminStatic/utils'
export default {
  name: 'PlSvg',
  props: {
    name: {
      type: String,
      require: true,
      default: ''
    },
    fill: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: null
    },
    height: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      // svg id的副本
      tempName: '',
      computedWidth: null,
      computedHeight: null,
      update: true,
      clonedSvg: {}
    }
  },
  computed: {
    truthWidth() {
      if (this.width) {
        return this.width + 'px'
      }
      // 如果没设置宽，默认宽等于高
      if (this.height) {
        return this.height + 'px'
      }
      return null
    },
    truthHeight() {
      if (this.height) {
        return this.height + 'px'
      }
      // 如果没设置高，默认高等于宽
      if (this.width) {
        return this.width + 'px'
      }
      return null
    }
  },
  mounted() {
    this.clean()
  },
  deactivated() {
    this.clean()
  },
  beforeDestroy() {
    this.clean()
  },
  watch: {
    fill: {
      async handler(val) {
        if (val) this.setFill(val)
      },
      immediate: true
    },
    async name(val) {
      if (this.fill && !this.clonedSvg[`${val}_${this._uid}`]) {
        this.setFill(this.fill)
      } else {
        this.tempName = this.tempName.replace(this.tempName.split('_')[0], val)
      }
    }
  },
  methods: {
    clickHandler(e) {
      this.$emit('click', e)
    },
    hoverHandler(e) {
      this.$emit('hover', e)
    },
    async setFill(fill) {
      /**
       * 由于使用的是svg精灵，所以
       * 要使得fill属性生效，必须保证不存在行内fill属性 或者 修改行内fill属性
       * 如果直接修改行内属性，会改变全局所有的svg颜色
       * 所以，先复制一份svg，然后修改这个副本的颜色，使用完之后，再删除这个副本，避免副本越来越多
       */
      // _uid可以作为每个组件唯一的标识，用来作为图标副本的id，再合适不过了
      await promise.timeout(100)
      const uid = this._uid
      const svg = document.querySelector('#' + this.name)
      if (!svg) {
        console.error('svg ' + this.name + ' 不存在')
        return
      }
      this.tempName = `${this.name}_${uid}`
      const clonedSvg = this.clonedSvg[this.tempName] || svg.cloneNode(true)
      svg.parentNode.appendChild(clonedSvg)
      this.svgParent = svg.parentNode
      this.clonedSvg[this.tempName] = clonedSvg
      // 给克隆后的图标填充颜色
      try {
        const fills = clonedSvg.querySelectorAll('[fill]')
        const colors = clonedSvg.querySelectorAll('[color]')
        clonedSvg.setAttribute('id', this.tempName)
        clonedSvg.setAttribute('fill', fill)
        for (const fill of fills) {
          fill.setAttribute('fill', fill)
        }
        for (const color of colors) {
          color.setAttribute('color', fill)
        }
      } catch (e) {
        console.error(e)
      }
    },
    clean() {
      if (this.svgParent) {
        for (const k of Object.keys(this.clonedSvg)) {
          try {
            if (this.clonedSvg[k]) {
              this.svgParent.appendChild(this.clonedSvg[k])
            }
          } catch (e) {}
        }
      }
      this.clonedSvg = {}
    }
  }
}
</script>

<style module lang="scss">
  .pl-svg {
    vertical-align: -2px;
  }
</style>
