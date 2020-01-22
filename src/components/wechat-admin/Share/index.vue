<template>
  <el-dialog
    :visible="show"
    title="分享"
    width="720px"
    @close="close"
    @closed="closed"
  >
    <el-form label-width="150px">
      <el-form-item label="分享链接：">
        <el-input :value="qrcodeText" readonly class="input" />
        <el-button type="primary" v-clipboard:copy="qrcodeText" v-clipboard:success="onCopy" v-clipboard:error="onError" style="width:140px;">
          复制
        </el-button>
      </el-form-item>
      <el-form-item label="活动二维码：">
        <img :src="qrcode" alt="二维码" class="qrcode">
        <br><br>
        用微信扫描二维码，可直接分享给好友<br>
        <a :href="qrcode" :download="`${qrcodeImageName}.png`" class="download">下载二维码</a>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { generateQrcode } from '@wechatAdminStatic/utils'
import qs from 'qs'
export default {
  data() {
    return {
      qrcode: ''
    }
  },
  watch: {
    show: {
      handler(val) {
        if (val) this.generateQrcode()
      },
      immediate: true
    }
  },
  props: {
    qrcodeText: {
      type: String,
      default: '',
      required: true
    },
    qrcodeImageName: {
      type: String,
      default: '二维码'
    },
    // 二维码中心的缩略图
    thumbnail: {
      type: String,
      default: ''
    },
    show: Boolean
  },
  methods: {
    // 生成二维码
    async generateQrcode() {
      const search = qs.parse(this.qrcodeText.split('?')[1])
      const url = this.qrcodeText.split('?')[0]
      search.noCache = Date.now()
      qs.stringify(search)
      this.qrcode = await generateQrcode(200, url + '?' + qs.stringify(search), 0, this.thumbnail, 4)
    },
    // 复制成功
    onCopy(e) {
      this.$success('复制成功')
    },
    // 复制失败
    onError(e) {
      this.$warning('复制失败')
    },
    close() {
      this.$emit('update:show', false)
    },
    closed() {
      this.qrcode = ''
    }
  }
}
</script>

<style scoped>
.input{width:200px;margin-right:20px;}
.qrcode{float:left;margin-right:20px;width:200px;height:200px;}
.download{display:inline-block;width:140px;height:34px;line-height:34px;;border:1px solid #598BF8;color:#598BF8;text-align:center}
</style>
