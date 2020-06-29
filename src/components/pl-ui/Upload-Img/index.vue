<template>
    <div class="pl-upload-img">
        <ul class="pl-img-list">
            <li
                class="img"
                v-for="(img, i) of images"
                :key="i"
            >
                <img
                    v-imger:uploadList="img"
                    :src="img + '?x-oss-process=style/thum'"
                >
                <div class="remove-btn">
                    <pl-svg
                        class="remove-btn--close"
                        name="icon-close"
                        width="30"
                        fill="#fff"
                        @click="removeImg(i)"
                    />
                </div>
            </li>
            <li v-if="images.length < count || !count">
                <label class="upload-img-box">
                    <pl-svg name="icon-camera" width="50" />
                    <span>上传凭证</span>
                    <span v-if="count > 0">（最多{{ count }}张）</span>
                    <input
                        @change="change"
                        :type="type"
                        accept="image/*"
                        :multiple="multiple"
                        style="display: none;"
                    >
                </label>
            </li>
        </ul>
    </div>
</template>
<script>
// import { upload, compress } from '../../assets/js/upload-image'
const upload = () => {}
const compress = () => {}
export default {
  name: 'PlUploadImg',
  data() {
    return {
      type: 'file',
      ups: [],
      compress: []
    }
  },
  model: {
    event: 'change',
    prop: 'images'
  },
  props: {

    // 图片最大体积,单位M
    size: {
      type: Number,
      default: 4
    },

    // 图片数量
    count: {
      type: Number,
      default: 0
    },
    images: {
      type: Array,
      default() {
        return []
      }
    },
    multiple: Boolean
  },
  created() {
  },
  methods: {
    async change(e) {
      const fileList = Array.from(e.target.files)
      const legitimate = fileList.some(file => !/.jpg|.png|.gif|.jpeg|.bmp/i.test(file.name))
      if (legitimate) {
        this.$error('不允许的图片格式')
        this.refreshInput()
        throw new Error('不允许的图片格式')
      }
      if (this.images.length + fileList.length > this.count) {
        this.refreshInput()
        return this.$warning(`只允许上传${this.count}张图片`)
      }
      try {
        for (const blob of fileList) {
          this.compress.push(compress(blob, this.size))
        }
        this.up()
      } catch (e) {
        throw e
      }
    },
    async up() {
      try {
        this.$indicator.open('正在压缩图片')
        const smallImgs = await Promise.all(this.compress)
        this.$indicator.close()
        for (const img of smallImgs) {
          this.ups.push(upload(img))
        }
        this.$indicator.open('正在上传图片')
        const data = await Promise.all(this.ups)
        const imgs = []
        for (const img of data) {
          this.images.push(img.url)
          imgs.push(img.url)
        }
        this.$emit('success', imgs)
        this.$emit('change', this.images)
      } catch (e) {
        throw e
      } finally {
        this.refreshInput()
        this.$indicator.close()
        this.compress = []
        this.ups = []
      }
    },
    async removeImg(index) {
      try {
        const rm = this.images.splice(index, 1)
        this.$emit('change', this.images)
        this.$emit('remove', index, rm)
      } catch (e) {
        throw e
      }
    },
    refreshInput() {
      this.type = 'text'
      this.$nextTick(() => {
        this.type = 'file'
      })
    }
  }
}
</script>

<style scale lang="scss">

.pl-img-list {
    display: inline-flex;
    flex-wrap: wrap;
    width: 100%;
    .img {
        position: relative;
        margin-right: 20px;
        margin-bottom: 20px;
        box-shadow: 0 5px 30px 0 rgba(0, 0, 0, .2);
        img {
            position: relative;
            width: 184px;
            height: 184px;
            object-fit: cover;
        }
        .remove-btn {
            position: absolute;
            right: -15px;
            top: -15px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;

            &--close {
                width: 14px;
                height: 14px;
                path {
                    fill: #fff;
                }
            }
        }
    }
}
.upload-img-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 184px;
    height: 184px;
    border: 1px dashed #999;
    text-align: center;
    span {
        color: #999;
        font-size: 23px;
    }
    svg {
        width: 40px;
        fill: #999;
    }
}


</style>
