# Indicator

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
        methods: {
            alert() {
                this.$alert('Alert')
            },
            confirm() {
                this.$confirm('Confirm')
            },
            propmt() {
                this.$propmt('Propmt')
            }
        },
        template:
        `<div>
            <ElButton @click='alert'>Alert</ElButton>
            <ElButton @click='confirm'>Confirm</ElButton>
            <ElButton @click='propmt'>Propmt</ElButton>
        </div>`
    }
</script>
```

### Options

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|cancelText|取消按钮的文本内容|String|--|--|
|confirmText|确定按钮的文本内容|String|--|--|
|cancelStyle|取消按钮的样式|Object|--|{ }|
|confirmStyle|确定按钮的样式|Object|--|{ }|
|useDangersHtml|渲染html|Boolean|--|false|
|message|正文信息|String|--|--|
|viceMessage|--|String|--|--|
|icon|图标名称|String|--|--|
|type|弹窗类型|String|--|confirm|
|closeOnClickMask|点击浮层是否关闭|Boolean|--|true|

### Event
|事件名称|说明|参数|
|:---|:---|:---|
|cancel|取消时|--|
|confirm|确定时|输入的内容|

