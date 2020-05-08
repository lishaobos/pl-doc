# Popup

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
        data() {
            return {
            show: false
            }
        },
        template:
        `<div>
            <ElButton @click='show = true'>点我</ElButton>
            <pl-popup :show.sync="show" title="活动规则">
                <ul>
                    <li>1. 设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖</li>
                    <li>2. 活动期间不支持退款，不支持线上发票</li>
                    <li>3. 仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠</li>
                    <li>4. 结束以活动截止时间为准</li>
                </ul>
            </pl-popup>
        </div>`
    }
</script>
```


#### Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|position|--|String|--|bottom|
|title|--|String|--|--|
|titleAlign|--|String|--|center|
|hideCloseIcon|--|Boolean|--|false|
|show|--|Boolean|--|false|
|closeOnClickModal|--|Boolean|--|true|


#### Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|close|关闭时|--|
