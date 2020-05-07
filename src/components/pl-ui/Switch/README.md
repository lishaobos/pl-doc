# Checkbox

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
        data() {
            return {
            checked: false
            }
        },
        template: `<PlSwitch :value='checked' @change='checked = $event'  />`
    }
</script>
```


#### Checkbox Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|value|绑定值|Boolean / Number|--|0|
|activeText|--|Boolean / Number|--|null|
|inactiveText|--|Boolean / Number|--|null|


#### Checkbox Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|change|当切换时触发的事件|value|
