### :smile: 源代码

```js
<template>
  <el-dialog
    :visible="visible"
    class="edit-image"
    :close-on-click-modal="false"
    :append-to-body="true"
    :show-close="false"
    width="46%"
  >
    <div slot="title" class="title">
      编辑图片
      <pl-svg class="icon-guanbi" name="icon-guanbi" width="18" @click="cancel" />
    </div>

    <div class="edit-box">
      <div class="img-box" :style="{ width: boxWidth + 'px' }">
        <canvas
          class="main-canvas"
          ref="mainCanvas"
          :width="canvasWidth"
          :height="canvasHeight"
          :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
        />
        <div class="scale">
          <button
            class="scale-btn shrink"
            @click="enlargeClick"
            :disabled="scale <= minScale"
          >
            <pl-svg :key="1" name="icon-jian" width="16" :fill="scale <= minScale ? '#e6e6e6' : '#9e9e9e'" />
          </button>
          <input
            type="range"
            :min="minScale"
            :max="maxScale"
            step="0.001"
            class="range"
            v-model.number="scale"
          >
          <button
            class="scale-btn enlarge"
            @click="shrinkClick"
            :disabled="scale >=maxScale"
          >
            <pl-svg :key="2" name="icon-jia" width="16" :fill="scale >= maxScale ? '#e6e6e6' : '#9e9e9e'" />
          </button>
        </div>

        <div
          :class="{
            'cutting-box': true
          }"
          :style="{
            width: cutWidth + 'px',
            height: cutHeight + 'px',
            borderLeftWidth: borderHorizontalWidth + 'px',
            borderRightWidth: borderHorizontalWidth + 'px',
            borderTopWidth: borderVerticalWidth + 'px',
            borderBottomWidth: borderVerticalWidth + 'px'
          }"
          @mousedown="mousedown"
        >
          <i class="size">{{ width }} x {{ height }}</i>
        </div>
      </div>
      <div class="edit-ctrl">
        <div class="title">
          基础编辑
        </div>
        <ul class="ctrl-list">
          <li class="icon icon-xuanzhuan">
            <pl-svg width="24" name="icon-xuanzhuan" @click="clockwise" />
          </li>
          <li class="icon icon-zuoyou">
            <pl-svg width="24" name="icon-zuoyou" @click="horizontalAlignReversal" />
          </li>
          <li class="icon icon-shangxia">
            <pl-svg width="24" name="icon-shangxia" @click="verticalAlignReversal" />
          </li>
        </ul>
      </div>
    </div>

    <div class="buttons">
      <button class="cancel" @click.prevent="cancel">
        取消
      </button>
      <button class="confirm" @click.prevent="confirm">
        确认
      </button>
    </div>
  </el-dialog>
</template>

<script>
import { compress } from './../../../../static/upload-image'
import PlSvg from './../../PlSvg'
let mainCtx = null
// 临时canvas
let tempCanvas = null
// 临时CTX
let tempCtx = null
// 原图及其宽高
let img = null
let width = null
let height = null
// 移动各种位置记录
let startX = 0
let startY = 0
// 上一次移动结束时的位置
let lastX = 0
let lastY = 0
// 缩放比例
let scale = 1
/*
* 裁剪盒子缩放比例
* 实际当中，要裁剪的图片大小可能会比组件的裁剪框还要大，此时，就要缩放，以便更好的显示
* 所以，显示大小，并不代表实际裁剪大小，实际裁剪大小根据这个比例去计算
* */
let cutBoxScale = 1
// canvas和图片盒子的大小比例
const RATIO = 10
// 旋转次数
let rotateCount = 0
export default {
  name: 'EditImage',
  components: { PlSvg },
  data() {
    return {
      // 裁剪框的大小
      boxWidth: 395,
      boxHeight: 395,
      // canvas分辨率
      canvasWidth: 395 * RATIO,
      canvasHeight: 395 * RATIO,
      // 缩小的比例
      scale: 1,
      minScale: 0, // 最小缩小比例
      maxScale: 0, // 最小缩小比例
      // 裁剪盒子的大小（非阴影区）
      cutWidth: 0,
      cutHeight: 0,
      visible: false
    }
  },
  props: {
    show: Boolean,
    // 裁剪的宽度
    width: {
      type: Number,
      default: 0,
      required: true
    },
    // 裁剪的高度
    height: {
      type: Number,
      default: 0,
      required: true
    },
    url: {
      type: String,
      default: ''
    },
    // 是否启用强制模式，即便图片大小符合规定大小比例，也必须裁剪
    // 这种情况往往出现在二次编辑的时候
    forced: Boolean
  },
  computed: {
    mainCanvas() {
      return this.$refs.mainCanvas
    },
    borderHorizontalWidth() {
      return (this.canvasWidth / RATIO - this.cutWidth) / 2
    },
    borderVerticalWidth() {
      return (this.canvasHeight / RATIO - this.cutHeight) / 2
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.init()
      } else {
        this.resetOffset()
        tempCanvas = null
        tempCtx = null
        scale = 1
        // cutBoxScale = 1
        rotateCount = 0
        this.visible = false
        this.$emit('update:forced', false)
      }
    },
    scale(val) {
      scale = val
      // this.scaleMethod()
      this.setCenterX()
      this.setCenterY()
      this.translateImage()
    }
  },
  methods: {
    // 初始化
    async init() {
      // 加载要裁剪的图片
      img = await this.loadImg(this.url)
      const { naturalWidth, naturalHeight } = img
      // 要裁剪的图片长宽比等于规定长宽比, 且不强制裁剪，则不裁剪，仅仅只是压缩至理想大小
      if (naturalWidth / naturalHeight === this.width / this.height && !this.forced) {
        const blob = await compress(img, 'blob', this.width < 750 ? this.width * 2 : this.width)
        this.$emit('success', blob, this.url)
        this.close()
        return
      }
      this.visible = true
      await this.$nextTick()
      // 保存canvasContext
      mainCtx = this.$refs.mainCanvas.getContext('2d')
      // 保存带裁剪图片的宽高
      width = img.width
      height = img.height
      // 计算裁剪盒子的大小
      // 由于裁剪框的显示大小，并是不是其真正要裁剪的大小
      // 因此，需要计算书裁剪框大小和规定裁剪的大小之间的换算比例
      const maxWidth = Math.max(this.width, this.height)
      // 即，裁剪框的宽 / 图片的长边，（使用图片的长边，可以计算出缩放的最小比例）
      // 换算比例乘以 3 / 4 是为了非阴影区域的大小刚好显示合适
      cutBoxScale = (this.boxWidth) / maxWidth * (3 / 4)
      // 使用得到的换算比例，可以进一步计算出裁剪盒子非阴影区域的大小
      this.cutWidth = this.width * cutBoxScale
      this.cutHeight = this.height * cutBoxScale
      // 创建一个零时的canvas, 用于承载图片，方便各种对图片的形变
      // 这个canvas和图片的大小一致
      tempCanvas = document.createElement('canvas')
      tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = width
      tempCanvas.height = height
      tempCtx.drawImage(img, 0, 0, width, height)
      // 计算图片相对于整个裁剪框的缩放比例
      this.setScale()
      // 水平居中
      this.setCenterX()
      // 垂直居中
      this.setCenterY()
      // 绘制上面的临时canvas到画布中
      this.translateImage()
    },
    // 加载图片
    loadImg(url) {
      const img = new Image()
      if (~url.indexOf('blob:')) {
        img.src = url
      } else {
        img.src = url + '?t=' + Date.now()
        img.crossOrigin = ''
      }
      return new Promise(resolve => {
        img.onload = () => {
          resolve(img)
        }
      })
    },
    // 计算最小/最大缩放比例
    setScale() {
      // 图片的长边
      // let imageMaxBorder = Math.max(width, height)/**/
      // console.log(imageMaxBorder)
      // let cutBoxMaxBorder = Math.max(this.cutWidth, this.cutHeight)
      if (rotateCount % 2 === 0) {
        scale = this.minScale = this.scale = this.cutWidth * RATIO / width
      } else {
        scale = this.minScale = this.scale = this.cutWidth * RATIO / height
      }
      this.maxScale = scale * 6
      this.translateImage()
    },
    // 绘制图片
    translateImage() {
      mainCtx.save()
      mainCtx.translate(lastX * scale, lastY * scale)
      mainCtx.clearRect(-lastX * scale, -lastY * scale, this.canvasWidth, this.canvasHeight)
      mainCtx.drawImage(tempCanvas, 0, 0, tempCanvas.width * scale, tempCanvas.height * scale)
      mainCtx.restore()
    },
    mousedown(e) {
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', this.mousemove)
      document.addEventListener('mouseup', this.mouseup)
      const { pageX, pageY } = e
      startX = pageX
      startY = pageY
    },
    mousemove(e) {
      const { pageX, pageY } = e
      const deltaX = pageX - startX
      const deltaY = pageY - startY
      const width = tempCanvas.width
      const height = tempCanvas.height
      const horizontalLeft = this.borderHorizontalWidth * RATIO / scale // 水平界限
      // let horizontalRight = -(width * scale - this.cutWidth * RATIO - horizontalLeft * scale) / scale // 水平界限
      const horizontalRight = -(width - this.cutWidth * RATIO / scale - horizontalLeft) // 水平界限(上边注释的简写)
      // 左边界判断
      if (deltaX > 0 && lastX !== horizontalLeft) {
        if (lastX < horizontalLeft) {
          lastX += deltaX
        } else {
          lastX = horizontalLeft
        }
      }
      // 右边界判断
      if (deltaX < 0 && lastX !== horizontalRight) {
        if (lastX > horizontalRight) {
          lastX += deltaX
        } else {
          lastX = horizontalRight
        }
      }
      // 上下边界判断
      const verticalTop = this.borderVerticalWidth * RATIO / scale // 竖直界限
      // let verticalBottom = -(height * scale - this.cutHeight * RATIO - verticalTop * scale) / scale // 竖直界限
      const verticalBottom = -(height - this.cutHeight * RATIO / scale - verticalTop) // (上边代码的简写形式)
      /*
        图片正好处于上下边界之间，此时可以随意拖动
        (新版，图片高度不会小于裁剪框高度),不必作此判断
        if (lastY * scale >= verticalTop && lastY * scale <= verticalBottom) {
          lastY += deltaY
        }
      */
      // 上边界判断
      if (deltaY > 0 && lastY !== deltaY) {
        if (lastY < verticalTop) {
          lastY += deltaY
        } else {
          // 随着scale的变化，有某一个状态下，图片的高度将正好等于裁剪框的高度，当这种情况发生时，verticalBottom - verticalTop === 0
          // 因此，可以以此判断图片的可视高度是否大于裁剪框的可视高度
          // 下同
          lastY = verticalBottom - verticalTop >= 0 ? verticalBottom : verticalTop
        }
      }
      // 下边界判断
      if (deltaY < 0 && lastY !== deltaY) {
        if (lastY > verticalBottom) {
          lastY += deltaY
        } else {
          lastY = verticalBottom - verticalTop >= 0 ? verticalTop : verticalBottom
        }
      }
      this.translateImage()
      startX = pageX
      startY = pageY
    },
    mouseup() {
      document.body.style.userSelect = null
      document.removeEventListener('mousemove', this.mousemove)
      document.removeEventListener('mouseup', this.mouseup)
    },
    // 逆时针旋转
    anticlockwise() {
      rotateCount++
      this.rotate()
    },
    // 顺时针旋转
    clockwise() {
      rotateCount--
      this.rotate()
    },
    rotate() {
      const width = tempCanvas.width
      const height = tempCanvas.height
      this.setScale()
      // 此操作会清空画布
      tempCanvas.width = height
      tempCanvas.height = width
      // 旋转前先将canvas原点移动到图片中心位置
      tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
      // 每次旋转90度
      tempCtx.rotate(-Math.PI / 2 * rotateCount)
      if (rotateCount % 2 === 0) {
        tempCtx.drawImage(img, -tempCanvas.width / 2, -tempCanvas.height / 2)
      } else {
        tempCtx.drawImage(img, -tempCanvas.height / 2, -tempCanvas.width / 2)
      }
      this.setCenterX()
      this.setCenterY()
      this.translateImage()
    },
    // 水平居中
    horizontalAlignCenter() {
      this.setCenterX()
      this.translateImage()
    },
    // 垂直居中
    verticalAlignCenter() {
      this.setCenterY()
      this.translateImage()
    },
    // 水平翻转
    horizontalAlignReversal() {
      this.resetOffset()
      reversal(-1, 1)
      this.setCenterX()
      this.setCenterY()
      this.translateImage()
    },
    // 垂直翻转
    verticalAlignReversal() {
      this.resetOffset()
      reversal(1, -1)
      this.setCenterX()
      this.setCenterY()
      this.translateImage()
    },
    setCenterX() {
      lastX = (this.canvasWidth - tempCanvas.width * scale) / 2 / scale
    },
    setCenterY() {
      lastY = (this.canvasHeight - tempCanvas.height * scale) / 2 / scale
    },
    // 重置canvas
    resetCanvas() {
      mainCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    },
    // 重置临时canvas
    resetTempCanvas() {
      tempCtx.clearRect(0, 0, width, height)
      tempCtx.clearRect(0, 0, height, width)
    },
    // 重置位移
    resetOffset() {
      startX = 0
      startY = 0
      lastX = 0
      lastY = 0
    },
    close() {
      this.$emit('update:show', false)
      this.$emit('update:url', '')
    },
    async cancel() {
      this.close()
    },
    // 截图
    confirm() {
      const cutCanvas = document.createElement('canvas')
      let { mainCanvas, borderHorizontalWidth, borderVerticalWidth, cutWidth, cutHeight, width, height } = this
      let cutCtx = null
      // 考虑到手机的像素密度，应该让图片的尺寸大一点
      if (width < 750) {
        width *= 2
        height *= 2
      }
      cutCanvas.width = width
      cutCanvas.height = height
      cutCtx = cutCanvas.getContext('2d')
      const sx = borderHorizontalWidth * RATIO
      const sy = borderVerticalWidth * RATIO
      const sw = cutWidth * RATIO
      const sh = cutHeight * RATIO
      cutCtx.drawImage(mainCanvas, sx, sy, sw, sh, 0, 0, width, height)
      cutCanvas.toBlob(blob => {
        this.$emit('success', blob, this.url)
        this.close()
      }, 'image/jpeg', 0.9)
    },
    shrinkClick() {
      this.scale += 0.01
    },
    enlargeClick() {
      this.scale -= 0.01
    }
  }
}

/**
 * 翻转图片
 * @param scaleX
 * @param scaleY
 */
function reversal(scaleX, scaleY) {
  const cvs = document.createElement('canvas')
  cvs.width = tempCanvas.width
  cvs.height = tempCanvas.height
  const ctx = cvs.getContext('2d')
  if (scaleX === 1 && scaleY === -1) ctx.translate(0, cvs.height)
  if (scaleX === -1 && scaleY === 1) ctx.translate(cvs.width, 0)
  ctx.scale(scaleX, scaleY)
  ctx.drawImage(tempCanvas, 0, 0)
  tempCanvas = cvs
  tempCtx = ctx
}
</script>

<style scoped lang="scss">
  .edit-image {
    user-select: none;
  }
  .title {
    position: relative;
    padding: 20px;
    font-size: 12px;
    flex: 1;
  }
  .edit-box {
    display: flex;
    overflow-x: auto;
    padding: 0 20px 20px 20px;
  }
  .img-box {
    position: relative;
    margin-right: 30px;
  }
  .main-canvas {
    background-color: #ebebeb;
  }
  .cutting-box {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
    border-color: rgba(0, 0, 0, .8);
    border-style: solid;
    box-sizing: content-box;
    overflow: visible;
    cursor: grab;
    > .size {
      position: absolute;
      top: -20px;
      left: 0;
      width: max-content;
      color: #fff;
      word-break: keep-all;
    }
  }
  .buttons {
    padding: 0 32px 10px 32px;
    line-height: 70px;
    border-top: 1px solid #e7e7e7;
    > button {
      width: 80px;
      margin-right: 10px;
      line-height: 30px;
      font-size: 12px;
      background-color: #fff;
      border: 1px solid #ccc;
      cursor: pointer;
      &.confirm {
        color: #598BF8;
        border-color: currentColor;
      }
    }
  }
  .icon-guanbi {
    position: absolute;
    right: 12px;
    top: 12px;
    cursor: pointer;
  }
  .scale {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 13px;
    padding: 1px;
  }
  .range {
    width: 100%;
    -webkit-appearance: none; /*去除默认样式*/
    background-color: #ccc;
    height: 2px;
    padding: 0;
    border: none;
    outline: none;
    margin: 0 2px;
    &:disabled {
      &::-webkit-slider-thumb {
        cursor: not-allowed;
      }
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;/*去除默认样式*/
      cursor: pointer;
      top: 0;
      height: 10px;
      width: 10px;
      transform: translateY(0px);
      background: #666;
      border-radius: 10px;
    }
  }
  .scale-btn {
    background: transparent;
    border: none;
    font-size: 16px;
    font-weight: bold;
    color: #9e9e9e;
    &:disabled {
      color: #e6e6e6;
      cursor: not-allowed;
    }
  }
  .edit-ctrl {
    .title {
      padding: 0;
      font-size: 12px;
      color: #666;
      margin-bottom: 7px;
    }
  }
  .ctrl-list {
    display: flex;
    > .icon {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 50px;
      margin-right: 5px;
      cursor: pointer;
      color: #333;
      font-size: 12px;
      background-color: #f4f4f4;
      overflow: visible;
      &.icon-xuanzhuan:after {
        content: '旋转';
      }
      &.icon-shangxia:after {
        content: '上下对称';
      }
      &.icon-zuoyou:after {
        content: '左右对称';
      }
    }
  }
</style>
```