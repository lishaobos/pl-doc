<template>
    <div :class="$style.paidPlayer">
        <pl-svg class="rotate" v-if="checking" name="icon-btn-loading" width="50" fill="#fff" />
        <video
            ref="video"
            v-if="!checking && type === 'video' && src"
            preload
            controls
            controlsList="nodownload"
            x5-video-player-type="h5-page"
            :src="src"
            playsinline=""
            x-webkit-airplay="true"
            @loadedmetadata="videoLoadedmetadata"
            @loadeddata="loadeddata"
            @play="playHandler"
            @playing="playingHandler"
            @timeupdate="timeupdate"
            @ended="ended"
            @pause="pause"
            @error="error"
            :class="{
                [$style.autoHeight]: autoHeight
            }"
            :poster="src + '?x-oss-process=video/snapshot,t_2000,f_jpg,w_0,h_0,m_fast'"
        />
    </div>
</template>

<script>
const setLivePaidData = () => {}
const checkRateOfFlow = () => {}
export default {
  name: 'PaidPlayer',
  data() {
    // 缓存每次加载的时间片段，发送给后端后会被清空
    this.timeFragment = []
    this.lastLoadedTime = 0
    // 总的观看的时长，每隔10s给后端发一次
    this.totalWatchTime = 0
    // timeupdate上一个执行周期的时间
    this.lastWatchTime = 0
    return {
      test: [],
      // 是否正在检查视频可用性
      checking: true,
      // 视频总长
      duration: 0,
      // 视频总大小
      videoSize: 0
    }
  },
  props: {
    // 音频还是视频，默认视频
    type: {
      type: String,
      default: 'video'
    },
    // 视频地址
    src: {
      type: String,
      default: '',
      required: true
    },
    // 视频开始播放的时间
    currentTime: {
      type: Number,
      default: 0
    },
    // 视频大小
    size: {
      type: Number,
      default: 0,
      required: true
    },
    // 视频id
    videoId: {
      type: String,
      default: '',
      required: true
    },
    // 资源名称（课程名称）
    resourceName: {
      type: String,
      default: '',
      required: true
    },
    // 资源所在id（课程id）
    resourceId: {
      type: String,
      default: '0'
    },
    // 定义视频的高度是否自动
    autoHeight: Boolean,
    autoFullScreen: Boolean,
    // 是否要计费
    isPay: Boolean
  },
  watch: {
    src: {
      async handler(src) {
        if (src) {
          try {
            const { result } = await checkRateOfFlow()
            if (!result) {
              this.$alert({
                message: '暂时无法观看',
                viceMessage: '请联系机构管理人员'
              }).finally(() => {
                if (window.history.length > 1) {
                  this.$router.go(-1)
                } else {
                  this.$router.replace({ name: 'Home' })
                }
              })
              return
            }
            this.checking = false
          } catch (e) {
            if (e.name === 'ResponseError') {
              this.$error(JSON.parse(e.message).message)
            }
            console.error(e)
          }
        }
      },
      immediate: true
    },
    currentTime: {
      handler() {
        this.setCurrentTime()
      },
      immediate: true
    }
  },
  deactivated() {
    this.checking = true
    this.timeFragment = []
    this.$emit('update:src', '')
  },
  computed: {
    video() {
      return this.$refs.video
    }
  },
  methods: {
    async setCurrentTime() {
      await this.$nextTick()
      const { video } = this.$refs
      if (video && this.currentTime) {
        video.currentTime = this.currentTime
      }
    },
    videoLoadedmetadata(e) {
      this.duration = e.target.duration
    },
    // TODO: 此方法暂不使用
    // videoProgress (e) {
    //     const video = e.target
    //     const timeRanges = video.buffered
    //     if (!timeRanges.length) return
    //     let loadedTime = 0
    //     for (let i = 0; i < timeRanges.length; i++) {
    //         const duration = timeRanges.end(i) - timeRanges.start(i)
    //         loadedTime += duration
    //     }
    //     this.timeFragment.push(Math.abs(loadedTime - this.lastLoadedTime) || 0)
    //
    //     // console.log(loadedTime, timeRanges.length, this.timeFragment.length)
    //     // console.log(loadedTime, this.lastLoadedTime, this.timeFragment.reduce((a, b) => a + b))
    //     if (this.timeFragment.length) {
    //         const total = this.timeFragment.reduce((a, b) => a + b)
    //
    //         // 加载的时间片段长度超过6秒就发一次请求，着并不意味着请求频率是1次/6秒
    //         // console.log(total, 149)
    //         if (total > 6) {
    //             this.sendFlow(total)
    //         }
    //     }
    //     this.lastLoadedTime = loadedTime
    // },
    async setLivePaidData({ watchTime, dataFlowSize }) {
      if (!this.videoId) return
      if (!this.isPay) return
      const data = {
        id: this.livePaidId || '',
        resourceId: this.resourceId,
        resourceName: this.resourceName,
        videoId: this.videoId,
        videoTime: this.duration,
        watchTime,
        dataFlowSize
      }
      try {
        const { result } = await setLivePaidData(data)
        if (result) this.livePaidId = result
      } catch (e) {
        this.$error(JSON.parse(e.message).message)
      }
    },
    // TODO: 此方法暂不使用
    sendFlow(time) {
      this.setLivePaidData({
        watchTime: Number(time.toFixed(3)),
        dataFlowSize: Number.parseInt(time / this.duration * this.size) || 0
      })
      this.timeFragment = []
    },
    loadeddata(e) {
      this.$emit('loadeddata', e)
    },

    // 在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）。
    playingHandler(e) {
      this.$emit('playing', e)
    },

    // 在媒体回放被暂停后再次开始时触发。即，在一次暂停事件后恢复媒体回放
    playHandler(e) {
      this.duration = e.target.duration
      this.$emit('play', e)
    },
    // 观看的时间发生变化时
    timeupdate(e) {
      const DURATION = e.target.currentTime - this.lastWatchTime
      // 如果两次差值大于10或者小于0，可能是快进/快退了，就不计费
      if (DURATION > 10 || DURATION < 0) {
        this.lastWatchTime = e.target.currentTime
        return
      }
      this.totalWatchTime += DURATION
      this.lastWatchTime = e.target.currentTime
      if (this.totalWatchTime >= 10) {
        this.sendFlow(this.totalWatchTime)
        this.totalWatchTime = 0
      }
    },
    ended(e) {
      this.$emit('ended', e)
    },
    pause(e) {
      this.$emit('pause', e)
    },
    error(e) {
      this.$alert({
        message: '视频加载错误',
        viceMessage: '请联系机构管理人员'
      })
        .finally(() => {
          if (window.history.length > 1) {
            this.$router.go(-1)
          } else {
            this.$router.replace({ name: 'Home' })
          }
        })
      this.$emit('error', e)
    }
  }
}
</script>

<style scale module lang="scss">

.paid-player {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 422px;
    width: 100vw;
    max-width: 100vw;
    margin: 0 !important;
    padding: 0 !important;
    background-color: #000 !important;
    > video {
        height: 422px;
        background-color: #000;
        &.auto-height {
            width: 100vw;
            height: auto;
        }
    }
}

@media screen and (orientation:landscape) {
}

</style>
