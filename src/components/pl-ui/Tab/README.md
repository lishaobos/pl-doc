# Tab

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
        data() {
            return {
            activeId: 1,
            tabs: [
                { id: 1, name: '小猫' },
                { id: 2, name: '小狗' },
                { id: 3, name: '小猪' }
            ]
            }
        },
        template: `<PlTab  :tabs='tabs' :activeId='activeId' />`
    }
</script>
```


#### Checkbox Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|tabs|--|Array|--|[ ]|
|options|--|Object|--|{ name: 'name', id: 'id' }|
|size|--|String|small / middle / large|large|
|activeId|--|String / Number|--|--|
|count|--|Object|--|null|
|color9|--|Boolean|--|false|


#### Checkbox Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|change|切换时|item|
