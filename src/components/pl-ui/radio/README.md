# Radio

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
      data() {
        return {
          checked: 1
        }
      },
      template:
      `<div>
            <PlRadio v-model='checked' :label='1'>大象</PlRadio>
            <PlRadio v-model='checked' :label='2'>老鼠</PlRadio>
            <PlRadio v-model='checked' :label='3'>乌龟</PlRadio>
      </div>`
    }
</script>
```

### Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|name|--|String / Number|--|null|
|value|--|String / Number|--|null|
|icon|图标名|String|--|icon-check|
|iconSize|图标尺寸|Number|--|40|
|checkedColor|选中的颜色|String|--|#FE7700|
|labelPosition|label 位置|String|--|--|
|disabled|禁止|Boolean|--|false|
|labelDisabled|禁止|Boolean|--|false|
|border|边框|Boolean|--|false|
|shape|形状|String|--|round|

### Event
|事件名称|说明|参数|
|:---|:---|:---|
|click|点击时|event|

