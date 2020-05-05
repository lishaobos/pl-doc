# 编辑图片

<br>

<!-- STORY -->

<br>

## Use Methods

```js
import EditImage from 'components/EditImage.vue';
```


#### Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|show|显示|Boolean|--|--|
|width|裁剪的高度|Number|--|0|
|height|裁剪的高度|Number|--|0|
|url|图片文件地址|String|--|""|
|forced|是否启用强制模式，即便图片大小符合规定大小比例，也必须裁剪（这种情况往往出现在二次编辑的时候）|Boolean|--|--|

#### Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|success|初始化成功|（bolb,url）|

