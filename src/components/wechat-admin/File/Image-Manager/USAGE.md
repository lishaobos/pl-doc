### :smile: 源代码

```js
<template>
  <div class="pl-image-upload">
    <Draggable
      v-if="showList"
      class="image-list"
      :list="list"
      tag="ul"
      animation="200"
      ghost-class="ghost"
      :disabled="disabledDraggable"
      @start="dragStart"
      @end="dragEnd"
      :style="{
        '--width': boxWidth + 'px',
        '--height': boxHeight + 'px',
        '--grid-count': list.length,
        '--border-radius': borderRadius + 'px'
      }"
    >
      <template v-for="(img, i) of list">
        <li
          class="image-item"
          :key="i"
          v-if="img"
        >
          <div
            class="image-item-content"
            @mouseenter="mouseenter(i)"
            @mouseleave="mouseleave(i)"
          >
            <img
              v-viewer
              v-img-error
              :src="img.indexOf('video/') > -1 ? (img + '?x-oss-process=video/snapshot,t_5000,m_fast') : img"
            >
            <transition name="fade">
              <div class="edit-box" v-show="showCtrl === i">
                <pl-svg class="pointer" name="icon-shanchu1" @click.stop="removeLocal(img)" width="16" fill="#fff" />
                <pl-svg class="pointer" name="icon-icon6" @click.stop="edit(i)" width="16" fill="#fff" />
              </div>
            </transition>
            <pl-svg v-if="img.indexOf('video/') > -1" class="icon-bofang" name="icon-bofang" @click="playVideo(img)" width="26" fill="#fff" />
          </div>
          <div class="image-item-bottom">
            <slot name="image-item-bottom" :$index="i" :$img="img" />
          </div>
        </li>
      </template>

      <ImageSelector
        v-if="(list.length < total || count === 0) && showSelector"
        @click="showSelectImageBox"
        :box-height="boxHeight"
        :box-width="boxWidth"
        :border-radius="borderRadius"
        :list-length="list.length"
        :margin-left="0"
        :upload-text="uploadText"
      />
    </Draggable>
    <input
      @change="fileChange"
      ref="Input"
      type="file"
      :accept="accept"
      style="display: none;"
      :multiple="multiple"
    >
    <!--<ManageBox
      v-show="needEdit"
      :show.sync="showManageBox"
      :max-count="count - list.length"
      :width="needEdit ? width : null"
      :height="needEdit ? height : null"
      :size="size"
      @confirm="manageBoxConfirm"
    />-->
    <EditImage
      :show.sync="showEdit"
      :url.sync="editImgUrl"
      :width="width"
      :height="height"
      :forced.sync="forcedEdit"
      @success="cutSuccess"
      :upload-text="uploadText"
    />

    <el-dialog
      title="上传结果"
      :visible.sync="showUploadBox"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="764px"
      :show-close="false"
      center
    >
      <el-table :data="fileList">
        <el-table-column label="文件" width="60">
          <template v-slot="{row}">
            <pl-svg
              v-if="row.type.indexOf('image/') > -1"
              name="icon-image"
              width="26"
              height="30"
            />
            <pl-svg
              v-if="row.type.indexOf('video/') > -1"
              name="icon-video"
              width="26"
              height="30"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column label="大小" width="200">
          <template v-slot="{row}">
            <span>
              <i v-text="row.current || 0" />
              /<i v-if="row.type.indexOf('video/') > -1" v-text="(row.size / 1024 / 1024).toFixed(2) + 'MB'" />
              <i v-if="row.type.indexOf('image/') > -1" v-text="(row.size / 1024).toFixed(2) + 'KB'" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template v-slot="{row}">
            <span v-if="row.progress < 1 && !row.error" class="loading">上传中...</span>
            <span v-if="row.progress === 1 && !row.error">
              <pl-svg style="vertical-align: -3px;" v-if="row.progress === 1 && !row.error" name="icon-success" width="14" />
              上传成功
            </span>
            <span v-if="row.error">
              <pl-svg style="vertical-align: -3px;" v-if="row.progress === 1 && !row.error" name="icon-shibai" fill="red" width="14" />
              上传失败
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 32px; text-align: center;">
        <el-button @click="cancel" :disabled="uploading">
          取 消
        </el-button>
        <el-button type="primary" @click="confirm" :disabled="uploading">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <transition name="fade">
      <div v-if="showVideo" class="video-box">
        <div class="icon-guanbi">
          <pl-svg name="icon-guanbi" width="30" @click="showVideo = false" fill="#ddd" />
        </div>
        <video controlsList="nodownload" :src="playedVideo" controls />
      </div>
    </transition>
  </div>
</template>

<script>
import { compress, upload, deleteImage, createObjectUrl, breakpointUpload } from '../../../../static/upload-image'
import ImageSelector from '../FileSelector'
import EditImage from '../EditImage'
import Draggable from '../../Draggable'
export default {
  name: 'PlUploadImage',
  components: {
    // ManageBox,
    ImageSelector,
    EditImage,
    Draggable
  },
  data() {
    return {
      Input: null,
      show: false,
      showUploadBox: false,
      showManageBox: false,
      showEdit: false,
      forcedEdit: false,
      uploading: false,
      showVideo: false,
      playedVideo: '',
      localList: [],
      videoList: [],
      fileList: [],
      editImgUrl: '',
      showCtrl: false,
      imageAccept: 'image/jpg, image/jpeg, image/png, image/bmp',
      videoAccept: 'video/mp4, video/webm, video/ogg'
    }
  },
  model: {
    prop: 'list',
    event: 'change'
  },
  props: {
    /*
    * 用来显示已上传的图片，如果你需要此组件内置的图片列表，那么你必须传入此参数
    * 格式：['src1', 'src2']
    * */
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否禁用拖拽
    disabledDraggable: Boolean,
    /*
    * 有时候，你可能并不需要组件内置的图片显示列表，你可能在外部自己维护了一个图片显示的列表
    * 这个时候你需要设置 showList 为 false, 内置的列表将不会显示, 但是，必须调用showSelectBox方法来手动打开图片选择窗口
    * 此时依然支持 needCrop 属性
    * */
    showList: {
      type: Boolean,
      default: true
    },
    // 是否显示选择框
    showSelector: {
      type: Boolean,
      default: true
    },
    // 图片大小 单位 M，这个一般在不需要截图的时候才会使用到
    size: {
      type: Number,
      default: 4
    },
    // 图片数量
    count: {
      type: Number,
      default: 1
    },
    // 视频数量
    videoCount: {
      type: Number,
      default: 0
    },
    // 如果视频+图片的数量大于此值，则以此值为准
    // 为 0 时则不限制总数
    totalCount: {
      type: Number,
      default: 0
    },
    // 视频尺寸 M
    videoSize: {
      type: Number,
      default: 20
    },
    // 是否允许选择图片
    allowVideo: Boolean,
    // 是否需要编辑图片，选中图片后，直接弹出编辑选框
    needEdit: Boolean,
    // 是否支持多传
    multiple: Boolean,
    // 真删或者假删
    deleteTruth: Boolean,
    // 裁剪的宽度
    width: {
      type: Number,
      default: 0
    },
    // 裁剪的高度
    height: {
      type: Number,
      default: 0
    },
    // 选择框的宽
    boxWidth: {
      type: Number,
      default: 72
    },
    // 选择框的高
    boxHeight: {
      type: Number,
      default: 72
    },
    borderRadius: {
      type: Number,
      default: 0
    },
    // 是否隐藏编辑图片按钮
    hideEditBtn: Boolean,
    // 选择框的文本
    uploadText: {
      type: String,
      default: '上传图片'
    },
    // 自定义文件格式验证 params: (reg,message)
    customFileType: {
      type: Object,
      default: null
    }
  },
  computed: {
    accept() {
      return (this.allowVideo && this.videoList.length <= this.videoCount) ? (this.imageAccept + ', ' + this.videoAccept) : this.imageAccept
    },
    // 总共可上传的数量
    total() {
      return this.totalCount || this.count + this.videoCount
    }
  },
  methods: {
    // 显示图片选择窗口
    showSelectImageBox() {
      // if (this.needEdit && this.multiple) {
      //   this.showManageBox = true
      // } else {
      //   let Input = this.$refs.Input
      //   Input.type = 'text'
      //   Input.type = 'file'
      //   Input.click()
      // }
      const Input = this.$refs.Input
      Input.type = 'text'
      Input.type = 'file'
      Input.accept = this.accept
      Input.click()
    },
    async fileChange(e) {
      const files = Array.from(e.target.files)
      // 传出文件信息
      this.$emit('inputChange', files)
      let reg = null
      if (this.allowVideo) {
        reg = new RegExp('jpg|png|jpeg|bmp|mp4|ogg|webm', 'i')
      } else {
        reg = new RegExp('jpg|png|jpeg|bmp', 'i')
      }
      // 可上传的图片总数
      const imageTotalCount = this.count
      // 可上传的视频总数
      const videoTotalCount = this.videoCount
      // 当前选中的图片数量
      const currentImageCount = this.getImageCountByFileList(files)
      // 当前选中的视频数量
      const currentVideoCount = this.getVideoCountByFileList(files)
      // 已上传的图片数量
      const uploadedImageCount = this.getImageCount()
      // 已上传的视频数量
      const uploadedVideoCount = this.getVideoCount()
      if (this.totalCount) {
        if (this.totalCount - uploadedVideoCount - uploadedImageCount - currentImageCount - currentVideoCount < 0) {
          this.$warning(`图片+视频最多上传${this.totalCount}张`)
          return
        }
      }
      if (currentImageCount + uploadedImageCount > imageTotalCount) {
        this.$warning(`只允许上传${imageTotalCount}张图片`)
        return
      }
      if (currentVideoCount + uploadedVideoCount > this.videoCount) {
        this.$warning(`只允许上传${videoTotalCount}个视频`)
        return
      }
      for (const file of files) {
        const res = reg.test(file.type)
        const size = file.size
        // 自定义视频格式
        if (this.customFileType && !this.customFileType.reg.test(file.type)) {
          this.$confirm({
            title: '上传失败',
            message: this.customFileType.message
          })
          return
        }
        if (this.isVideo(file) && size > this.videoSize * 1024 * 1024) {
          this.$confirm({
            title: '上传失败',
            message: `请选择大小为 ${this.videoSize}M 以内的文件`
          })
          return
        }
        if (this.isVideo(file) && !res) {
          this.$confirm({
            title: '上传失败',
            message: '文件格式不对，请选择其他视频试试'
          })
          return
        }
        if (!res) {
          this.$confirm({
            title: '上传失败',
            message: '图片格式不对，仅支持jpg、png、jpeg、bmp格式'
          })
          return
        }
      }
      if (this.needEdit) {
        this.editImgUrl = createObjectUrl(files[0])
        this.showEdit = true
        return
      }
      this.fileList = files
      // 超过一张图片时，显示上传列表
      if (files.length > 1) {
        this.showUploadBox = true
      }
      // 没超过一张图片，但是是视频时也显示上传列表
      if (files.length === 1) {
        if (this.isVideo(files[0])) {
          this.showUploadBox = true
        }
      }
      this.up(files)
    },
    /**
     * 上传
     * @params files {Array} 文件列表
     * @params oldUrl {Number} 要替换的文件
     */
    async up(files, oldUrl) {
      const list = []
      this.uploading = true
      for (let [i, blob] of files.entries()) {
        const isVideo = this.isVideo(blob)
        if (!isVideo) {
          try {
            if (blob.size > this.size * 1024 * 1024) {
              blob = await compress(blob)
            }
            this.$emit('imageChange', blob)
            const { url } = await upload(blob)
            this.$set(this.fileList, i, blob)
            blob.progress = 1
            blob.current = (blob.size / 1024).toFixed(2) + 'KB'
            list.push(url)
          } catch (e) {
            blob.error = true
            this.$set(this.fileList, i, blob)
            continue
          }
        }
        if (isVideo) {
          try {
            const { res } = await breakpointUpload(blob, (progress) => {
              blob.current = (progress * blob.size / 1024 / 1024).toFixed(2) + 'MB'
              blob.progress = progress
              this.$set(this.fileList, i, blob)
            })
            for (const video of res.requestUrls) {
              list.push(video.split('?')[0])
            }
          } catch (e) {
            blob.error = true
            this.$set(this.fileList, i, blob)
          }
        }
      }
      // 重新排序，把视频放在前面
      const videos1 = this.list.filter(item => item.indexOf('video/') > -1)
      const videos2 = list.filter(item => item.indexOf('video/') > -1)
      const images1 = this.list.filter(item => item.indexOf('img/') > -1)
      const images2 = list.filter(item => item.indexOf('img/') > -1)
      this.newList = [...videos2, ...images2]
      if (oldUrl) {
        this.localList = [...videos1, ...videos2, ...images1]
        // 编辑完图片，替换到原来的位置
        const index1 = this.localList.indexOf(oldUrl)
        this.localList.splice(index1, 1, images2[0])
      } else {
        this.localList = [...videos1, ...videos2, ...images1, ...images2]
      }
      // 如果只有一个文件，且不是视频。直接触发change事件
      if (list.length === 1 && !this.isVideo(files[0])) {
        this.$emit('change', this.localList)
      }
      this.uploading = false
    },
    confirm() {
      this.$emit('change', this.localList)
      this.showUploadBox = false
    },
    // 点击取消按钮时，删除已上传的文件
    cancel() {
      this.showUploadBox = false
      // this.$emit('change', this.fileList)
      const key = []
      for (const url of this.newList) {
        key.push(this.getImageKey(url))
      }
      deleteImage(key)
    },
    /* manageBoxConfirm (uploadList) {
      for (let url of uploadList) {
        this.list.push(url)
      }
      this.$emit('change', this.list)
    }, */
    // 删除图片，这里并不是真的删除，只是从本地列表中删除，如果想彻底删除服务器中的图片，需要监听remove事件
    async removeLocal(url) {
      const index = this.list.indexOf(url)
      const removeUrl = this.list.splice(index, 1)[0]
      this.$emit('remove', removeUrl, index)
      this.$emit('change', this.list)

      if (this.deleteTruth) {
        await deleteImage([this.getImageKey(url)])
      }
    },
    // 获取指定图片url的key
    getImageKey(url) {
      if (url.indexOf('img/') > -1) {
        return url.substring(url.indexOf('img/'))
      }
      if (url.indexOf('video/') > -1) {
        return url.substring(url.indexOf('video/'))
      }
    },
    // 截图成功
    cutSuccess(blob, oldUrl) {
      if (oldUrl) {
        this.up([blob], oldUrl)
      } else {
        this.up([blob])
      }
    },
    // replace (index) {
    //   console.log(index)
    // },
    edit(index) {
      this.showEdit = true
      this.forcedEdit = true
      this.editImgUrl = this.list[index]
    },
    dragEnd() {
      // 重新排序，把视频放在前面
      const videos = this.list.filter(item => item.indexOf('video/') > -1)
      const images = this.list.filter(item => item.indexOf('img/') > -1)
      this.$emit('drag-end', [...videos, ...images])
      this.$emit('change', [...videos, ...images])
    },
    dragStart() {
      this.$emit('drag-start', this.list)
    },
    mouseleave() {
      this.showCtrl = -1
    },
    mouseenter(i) {
      this.showCtrl = i
    },
    isVideo(file) {
      return file.type.indexOf('video') > -1
    },
    // 已上传的图片数量
    getImageCount() {
      return this.list.filter(item => item.indexOf('img/') > -1).length
    },
    // 已上传的视频数量
    getVideoCount() {
      return this.list.filter(item => item.indexOf('video/') > -1).length
    },
    // 选中的图片数量
    getImageCountByFileList(fileList) {
      return fileList.filter(item => item.type.indexOf('image/') > -1).length
    },
    // 选中的视频数量
    getVideoCountByFileList(fileList) {
      return fileList.filter(item => item.type.indexOf('video/') > -1).length
    },
    playVideo(src) {
      this.showVideo = true
      this.playedVideo = src
    }
  }
}
</script>

<style scoped lang="scss">
  .error-message {
    position: absolute;
    left: 0;
    bottom: 0;
    color: red;
    line-height: 30px;
  }
  .success {
    position: absolute;
    left: 0;
    bottom: 0;
    color: greenyellow;
    line-height: 30px;
  }
  .pl-image-upload {
    position: relative;
    display: flex;
    .image-list {
      display: grid;
      justify-content: flex-start;
      align-items: start;
      grid-template-columns: repeat(auto-fill, var(--width));
      width: 100%;
      grid-gap: 20px;
      > .image-item {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        font-size: 0 !important;
        &:nth-last-of-type(1) {
          margin-right: 0;
          margin-bottom: 0;
        }
        > .image-item-content {
          position: relative;
          width: var(--width);
          height: var(--height);
          overflow: hidden;
          border-radius: var(--border-radius);
          > img {
            width: var(--width);
            height: var(--height);
            object-fit: cover;
          }
          > .icon-bofang {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
          }
        }
        > .image-item-bottom {
          width: 100%;
          height: max-content;
        }
        .edit-box {
          position: absolute;
          bottom: 0;
          left: 0;
          display: inline-flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 26px;
          padding: 10px 0;
          color: #fff;
          background-color: rgba(0,0,0,0.6) ;
          &:after {
            position: absolute;
            left: 50%;
            content: '';
            width: 1px;
            height: 11px;
            background-color: #eee;
          }
        }
      }
    }
    .pl-image-loading {
      position: absolute;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, .5);
      border-radius: 4px;
      > .el-icon-loading{
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .video-box {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 999;
    > .icon-guanbi {
      position: absolute;
      left: 50%;
      top: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      text-align: center;
      border-radius: 30px;
      background-color: rgba(255, 255, 255, .2);
      transform: translateY(-50%);
      transition: transform .3s ease;
      cursor: pointer;
      > svg {
        /*border-radius: 20px;*/
      }
    }
    &:hover {
      > .icon-guanbi {
        transform: translateY(30%);
      }
    }
  }
  /deep/ .el-dialog__header {
    display: flex;
    justify-content: flex-start;
  }
</style>
```