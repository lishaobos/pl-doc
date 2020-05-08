# Progress

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
        data() {
            return {
            percentage: 10
            }
        },
        methods: {
            add() {
            this.percentage < 100 ? this.percentage++ : ''
            },
            reduce() {
            this.percentage > 0 ? this.percentage-- : ''
            }
        },
        template:
        `<div>
            <div style='margin-bottom: 10px;'>
                <ElButton @click='reduce'>-</Elbutton> 
                <ElButton @click='add'>+</Elbutton>
            </div>
            <PlProgress :percentage='percentage' color='pink'/>
        </div>`
    }
</script>
```


#### Checkbox Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|type|--|String|bar / circle|bar|
|percentage|--|Number|--|0|
|strokeWidth|--|Number|--|12|
|strokeLinecap|--|String|--|round|
|width|--|Number|--|252|
|color|--|String / Array / Function|--|#fff|
|outterColor|--|String|--|#e5e9f2|
|showContent|--|Boolean|--|true|
|format|--|Function|--|percentage => `${percentage}%`|


#### Checkbox Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|click|点击时|--|
