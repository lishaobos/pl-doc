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
                data: [
                    { label: '小狗', value: 'dog' },
                    { label: '小猫', value: 'cat' },
                    { label: '小猪', value: 'pig' }
                ]
            }
        },
        template:
        `<div style='position: relative'>
            <PlSelector :data='data' />
        </div>`
    }
</script>
```


#### Checkbox Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|data|绑定列表|Array({ label: '' })|--|--|
|size|大小|String|--|small|


#### Checkbox Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|change|当选中时触发的事件|item|
