# 日期选择器

<br>

<!-- STORY -->

<br>

## Use Methods

```js
import DateRange from 'components/DateRange.vue';
```


#### Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|size|输入框尺寸|String|arge, small, mini|mini|
|separator|分隔字符|String|—|至|
|startLabel|开始 label|String|—|开始时间|
|endLabel|结束 label|String|—|结束时间|
|showLabel|显示 label|Boolean|—|true|
|disabledStartTime|禁止选择开始时间|Boolean|—|—|
|disabledEndTime|禁止选择结束时间|Boolean|—|—|
|clearable|是否清除|Boolean|—|—|
|init|默认时间|Array|—|[ ]|
|disableBefore|禁用今天以前的日期|Boolean|—|—|
|disableAfter|禁用今天以后的日期|Boolean|—|—|
|type|日期选择框类型|String|date，datetime|date|

#### Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|change|用户确认选定的值时触发|选择的日期值|
|focus|组件获取焦点时触发|组件实例|