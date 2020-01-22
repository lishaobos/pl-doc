<template>
  <div class="date-range" ref="dateRange">
    <span
      class="label"
      v-if="showLabel && startLabel"
      v-text="startLabel"
    />
    <el-date-picker
      style="width: 180px;"
      :key="'start'"
      ref="start"
      :type="type"
      v-model="start"
      :format="format"
      :value-format="format"
      :clearable="clearable"
      :default-value="init[0]"
      @change="startChange"
      :picker-options="{
        disabledDate: startDisabled
      }"
      placeholder="选择开始时间"
      :disabled="disabledStartTime"
      :editable="false"
      @focus="focus"
      :default-time="defaultTime"
    />
    <span
      class="separator"
      v-text="separator"
    />
    <span
      class="label"
      v-if="showLabel && endLabel"
      v-text="endLabel"
    />
    <el-date-picker
      style="width: 180px;"
      :key="'end'"
      ref="end"
      v-model="end"
      :type="type"
      :format="format"
      :value-format="format"
      :clearable="clearable"
      :default-value="init[1]"
      @change="endChange"
      :disabled="disabledEndTime"
      :picker-options="{
        disabledDate: endDisabled
      }"
      :editable="false"
      placeholder="选择结束时间"
      @focus="focus"
      :default-time="defaultTime"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'DateRange',
  data() {
    return {
      start: '',
      end: '',
      dateType: {
        date: 'yyyy-MM-dd',
        datetime: 'yyyy-MM-dd HH:mm:ss'
      },
      momentType: {
        date: 'YYYY-MM-DD',
        datetime: 'YYYY-MM-DD HH:mm:ss'
      },
      defaultTime: moment().format('HH:mm:ss')
    }
  },
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    separator: {
      type: String,
      default: '至'
    },
    startLabel: {
      type: String,
      default: '开始时间'
    },
    endLabel: {
      type: String,
      default: '结束时间'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    disabledStartTime: Boolean,
    disabledEndTime: Boolean,
    clearable: Boolean,
    init: {
      type: Array,
      default() {
        return []
      }
    },
    // 禁用今天以后的日期
    disableAfter: Boolean,
    // 禁用今天以前的日期
    disableBefore: Boolean,
    // 仅支持 datetime or date
    type: {
      type: String,
      default: 'date',
      validator(val) {
        return ['date', 'datetime'].indexOf(val) !== -1
      }
    }
    // defaultTime: {
    //   type: String,
    //   default: moment().format('HH:mm:ss')
    // }
    // 最小开始时间(可解析为日期的数值)
    // minStart: {
    //   type: [Number, String],
    //   default: 0
    // },
    // 最大开始时间(可解析为日期的数值)
    // maxStart: {
    //   type: [Number, String],
    //   default: 0
    // },
    // 最大结束时间(可解析为日期的数值)
    // maxEnd: {
    //   type: [Number, String],
    //   default: 0
    // },
    // 最小结束时间(可解析为日期的数值)
    // minEnd: {
    //   type: [Number, String],
    //   default: 0
    // }
  },
  computed: {
    format() {
      return this.dateType[this.type]
    },
    endTimestamp() {
      if (!this.end) {
        return Number.MAX_SAFE_INTEGER
      }
      if (this.type === 'date') {
        return moment(this.end.substr(0, 10)).valueOf()
      }
      return moment(this.end).valueOf()
    },
    startTimestamp() {
      if (!this.start) {
        return Number.MIN_SAFE_INTEGER
      }
      if (this.type === 'date') {
        return moment(this.start.substr(0, 10)).valueOf()
      }
      return moment(this.start).valueOf()
    }
  },
  watch: {
    init: {
      handler(val) {
        try {
          this.start = val[0] ? moment(val[0]).format(this.momentType[this.type]) : this.start
          this.end = val[1] ? moment(val[1]).format(this.momentType[this.type]) : this.end
        } catch (e) {
          this.start = null
          this.end = null
        } finally {
          this.change()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 仅判断日期，不判断时分秒
    startDisabled(date) {
      const current = date.getTime() + 86399000 // 到当天的23:59:59
      const now = Date.now() - Date.now() % 86400000 + 86399000 - 28800000 // 到当天的23:59:59
      const end = this.endTimestamp - this.endTimestamp % 86400000 + 86399000 - 28800000 // 当前开始时间的的00:00:00
      //  禁用今天之前和结束时间之后
      if (this.disableBefore) {
        return current < now || end < current
      }
      //  禁用今天之后
      if (this.disableAfter) {
        return current > now || end < current
      }
      return false
    },
    // 仅判断日期，不判断时分秒
    endDisabled(date) {
      const current = date.getTime() // 当天的00:00:00
      const now = Date.now() - Date.now() % 86400000 - 28800000 // 到当天的00:00:00
      const start = this.startTimestamp - this.startTimestamp % 86400000 - 28800000 // 当前开始时间的的00:00:00
      //  禁用今天之前和开始时间之前
      if (this.disableBefore) {
        return current < now || current < start
      }
      // 禁用今天之后
      if (this.disableAfter) {
        return current > now
      }
      return false
    },
    startChange(val) {
      if (!val) {
        this.clear()
        return
      }
      if (!this.end) {
        this.$refs.end.focus()
        return
      }
      this.change()
    },
    endChange(val) {
      if (!val) {
        this.clear()
        return
      }
      if (!this.start) {
        this.$refs.start.focus()
        return
      }
      this.change()
    },
    change() {
      let data = null
      if (this.start && this.end) {
        data = this.sort({
          start: this.start,
          end: this.end
        })
      } else {
        data = {
          start: this.start,
          end: this.end
        }
      }
      this.$emit('change', data)
    },
    clear() {
      this.start = null
      this.end = null
      this.$emit('change', {
        start: null,
        end: null
      })
    },
    // 禁用此刻按钮
    async focus(e) {
      this.$emit('focus', e)
      await this.$nextTick()
      const spans = document.querySelectorAll('.el-picker-panel__footer span') || []
      for (const span of spans) {
        if (span.innerText.indexOf('此刻') > -1) {
          span.style.display = 'none'
        }
      }
    },
    // 调整日期顺序, 如果结束时间比开始时间小的话
    sort({ start, end }) {
      if (this.type === 'date') {
        start += ' 00:00:00'
        end += ' 23:59:59'
      }
      const s = moment(start).valueOf()
      const e = moment(end).valueOf()
      const format = this.momentType[this.type]
      if (e < s) {
        const s = moment(end).format(format)
        const e = moment(start).format(format)
        let date
        /**
         * 根据当前格式化类型进行调换
         * date类型需要手动拼接时间
         * datetime本身就有时间，不需要拼接，直接调换即可
         */
        if (this.type === 'date') {
          date = {
            start: s + ' 00:00:00',
            end: e + ' 23:59:59'
          }
        } else {
          date = {
            start: s,
            end: e
          }
        }
        this.start = s
        this.end = e
        return date
      }
      return {
        start,
        end
      }
    }
  }
}
</script>

<style>
  .label {
    font-size: 14px;
    margin: 0 10px 0 0;
  }
  .separator {
    margin: 0 10px;
  }
</style>
