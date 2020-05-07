# Input

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
|placeholder|绑定值|String|--|0|
|size|尺寸|String|mini / small / middle|small|
|type|类型|String|textarea / password / text|text|
|prefixIcon|--|String|--|--|
|suffixIcon|--|String|--|--|
|autocomplete|--|String|--|--|
|value|--|String / Number|--|--|
|maxlength|--|Number|--|0|
|minRows|--|Number|--|1|
|maxRows|--|Number|--|0|
|align|--|String|--|--|
|disabled|--|Boolean|--|false|
|readonly|--|Boolean|--|false|
|border|--|Boolean|--|false|


#### Checkbox Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|alert|字数长度达到最大值提醒|--|
|focus|字数长度达到最大值提醒|event|
|blur|字数长度达到最大值提醒|event|
|click|字数长度达到最大值提醒|event|
|clear|字数长度达到最大值提醒|--|
