# 图片选择器

<br>

<!-- STORY -->

<br>

## Use Methods

```js
import ImgCorp from 'components/Img-Corp.vue';
```


#### Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|value|图片包装对象|Object|--|{ }|
|proportion|图片宽高比例|Object|--|{ w: 2, h: 1 }|
|quality|清晰度|Number|--|0.92|
|hasRemove|是否显示移除按钮|Boolean|--|false|
|skipCrop|是否跳过裁剪直接使用|Boolean|--|false|
|config|配置对象|Object|--|{ size: 1200, isSlice: true, path: null }|

#### Config
|参数|说明|
|:---|:---|
|size|图片最大宽度（px）|
|isSlice|文件比例一致时是否需要裁剪，与skipCrop不同|
|path|显示图片时的路径，path参数将直接与图片id拼接(path + id)|

#### Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|change|选择时| file |
|remove|删除时| -- |
|submit|完成时| currentValue |
|cancel|取消时| -- |

