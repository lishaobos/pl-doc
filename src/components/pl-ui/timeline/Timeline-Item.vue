<template>
    <li class="pl-timeline-item">
        <div class="pl-timeline-datetime">
            <span
                class="pl-timeline-item-date"
                v-text="date"
            />
            <span
                class="pl-timeline-item-time"
                v-text="time"
            />
        </div>

        <div class="pl-timeline-item-content">
            <slot />
        </div>
    </li>
</template>

<script>
import moment from 'moment'
export default {
  name: 'PlTimelineItem',
  props: {
    timestamp: {
      required: true,
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    date() {
      return moment(this.timestamp).format('MM-DD')
    },
    time() {
      return moment(this.timestamp).format('HH:mm')
    }
  }
}
</script>

<style lang="less">

.pl-timeline-item {
    display: flex;
    padding-bottom: 30px;
    &:nth-of-type(1) {
        > .pl-timeline-datetime {
            color: #333;
        }
        > .pl-timeline-item-content {
            &:before {
                left: 24px;
                top: 10px;
                width: 14px;
                height: 14px;
                background: url('../assets/image/circle-active.png') no-repeat center center;
                background-size: 100%;
            }
        }
    }
    &:nth-last-of-type(1) {
        padding-bottom: 0;
        > .pl-timeline-item-content {
            &:after {
                display: none;
            }
        }
    }
}
.pl-timeline-datetime {
    display: inline-flex;
    flex-direction: column;
    text-align: right;
    color: #999;
    > .pl-timeline-item-date {
        font-size: 22px;
        line-height: 32px;
    }
    > .pl-timeline-item-time {
        font-size: 18px;
        line-height: 26px;
    }
}
.pl-timeline-item-content {
    position: relative;
    flex: 1;
    padding-left: 62px;
    font-size: 22px;
    line-height: 32px;
    color: #999;
    &:before {
        position: absolute;
        content: '';
        left: 26px;
        top: 13px;
        width: 10px;
        height: 10px;
        background: url('../assets/image/circle.png') no-repeat center center;
        background-size: 100%;
        z-index: 2;
    }
    &:after {
        position: absolute;
        content: '';
        left: 30px;
        top: 24px;
        width: 1px;
        height: 130%;
        transform: scaleX(.5);
        border-radius: 7px;
        background-color: #d8d8d8;
        z-index: 1;
    }
}

</style>
