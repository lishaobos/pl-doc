<template>
    <div :class="[$style.progress, $style[type]]">
        <div :class="$style.progressBar" v-if="type === 'bar'">
            <div :class="$style.progressBarOuter" :style="{ height: strokeWidth / 7.5 + 'vw', backgroundColor: outterColor }">
                <div :class="$style.progressBarInner" :style="barStyle" />
            </div>
        </div>
        <div :class="$style.progressCircle" :style="{ width: width / 7.5 + 'vw', height: width / 7.5 + 'vw' }" v-if="type === 'circle'">
            <svg viewBox="0 0 100 100">
                <path
                    :class="$style.progressCircleTrack"
                    :d="trackPath"
                    :stroke="outterColor"
                    fill="none"
                    :stroke-width="relativeStrokeWidth"
                    :style="trailPathStyle" />
                <path
                    :class="$style.progressCirclePath"
                    :d="trackPath"
                    :stroke="stroke"
                    fill="none"
                    :stroke-linecap="strokeLinecap"
                    :stroke-width="percentage ? relativeStrokeWidth : 0"
                    :style="circlePathStyle" />
            </svg>
        </div>
        <div
            :class="$style.progressContent"
            v-if="showContent"
            :style="{ fontSize: contentTextSize / 7.5 + 'vw' }"
        >
            <template v-if="!$slots.content">{{ content }}</template>
            <slot name="content" v-else />
        </div>
    </div>
</template>
<script>
export default {
  name: 'PlProgress',
  props: {
    type: {
      type: String,
      default: 'bar',
      validator: val => ['bar', 'circle'].indexOf(val) > -1
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 && val <= 100
    },
    strokeWidth: {
      type: Number,
      default: 12
    },
    strokeLinecap: {
      type: String,
      default: 'round'
    },
    width: {
      type: Number,
      default: 252
    },
    color: {
      type: [String, Array, Function],
      default: '#fff'
    },
    outterColor: {
      type: String,
      default: '#e5e9f2'
    },
    showContent: {
      type: Boolean,
      default: true
    },
    format: {
      type: Function,
      default: percentage => `${percentage}%`
    }
  },
  computed: {
    barStyle() {
      const style = {}
      style.width = `${this.percentage}%`
      style.height = '100%'
      style.backgroundColor = this.getCurrentColor(this.percentage)
      return style
    },
    relativeStrokeWidth() {
      return (this.strokeWidth / this.width * 100).toFixed(1)
    },
    radius() {
      if (this.type === 'circle') {
        return parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10)
      }
      return 0
    },
    trackPath() {
      const { radius } = this
      return `
            M 50 50
            m 0 -${radius}
            a ${radius} ${radius} 0 1 1 0 ${radius * 2}
            a ${radius} ${radius} 0 1 1 0 -${radius * 2}
            `
    },
    perimeter() {
      return 2 * Math.PI * this.radius
    },
    trailPathStyle() {
      return {
        strokeDasharray: `${this.perimeter}px, ${this.perimeter}px`,
        strokeDashoffset: 0
      }
    },
    circlePathStyle() {
      return {
        strokeDasharray: `${this.perimeter * (this.percentage / 100)}px, ${this.perimeter}px`,
        strokeDashoffset: 0,
        transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
      }
    },
    stroke() {
      // if (this.color) {
      return this.getCurrentColor(this.percentage)

      // }
    },
    contentTextSize() {
      return this.type === 'bar'
        ? 12 + this.strokeWidth * 0.4
        : this.width * 0.111111 + 2
    },
    content() {
      if (typeof this.format === 'function') {
        return this.format(this.percentage) || ''
      }
      return `${this.percentage}%`
    }
  },
  methods: {
    getCurrentColor(percentage) {
      if (typeof this.color === 'function') {
        return this.color(percentage)
      } else if (typeof this.color === 'string') {
        return this.color
      }
      return this.getLevelColor(percentage)
    },
    getLevelColor(percentage) {
      const colorArray = this.getColorArray().sort((a, b) => a.percentage - b.percentage)

      for (let i = 0; i < colorArray.length; i++) {
        if (colorArray[i].level > percentage) {
          return colorArray[i].color
        }
      }
      return colorArray[colorArray.length - 1].color
    },
    getColorArray() {
      const colorArray = this.color
      const span = 100 / colorArray.length
      return colorArray.map((color, index) => {
        if (typeof color === 'string') {
          return {
            color,
            level: (index + 1) * span
          }
        }
        return color
      })
    }
  }
}
</script>

<style scale lang="scss" module>
.progress {
    position: relative;
    line-height: 1;
    &-bar {
        flex: 1;
        width: 0;
        box-sizing: border-box;
        &-outer {
            position: relative;
            vertical-align: middle;
            border-radius: 200px;
            overflow: hidden;
        }
        &-inner {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            line-height: 1;
            border-radius: 200px;
            white-space: nowrap;
            transition: width .6s ease;
        }
        &-content {
            flex-shrink: 0;
        }
    }
    &-content {
        display: inline-block;
        vertical-align: middle;
        margin-left: 20px;
        line-height: 1;
        font-size: 28px;
    }
}
.bar {
    display: flex;
    align-items: center;
}
.circle {
    display: inline-block;
    .progress-content {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        text-align: center;
        margin: 0;
        width: 100%;
    }
}
@keyframes progress {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 64px 0;
    }
}


</style>
