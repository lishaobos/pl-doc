# 上传组件
<br>

<!-- STORY -->

<br>

## Use Methods

```js
// 注：该组件暂未拥有上传功能，可以参考参数说明及方法，在项目中使用
import ImageManager from 'components/ImageManager.vue';
```


#### Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|value / v-model|绑定值|Array|--|--|
|list|用来显示已上传的图片，如果你需要此组件内置的图片列表，那么你必须传入此参数|Array|--|[ ]|
|disabledDraggable|是否禁用拖拽|Boolean|--|--|
|showList|有时候，你可能并不需要组件内置的图片显示列表，你可能在外部自己维护了一个图片显示的列表，这个时候你需要设置 showList 为 false, 内置的列表将不会显示, 但是，必须调用showSelectBox方法来手动打开图片选择窗口，此时依然支持needCrop 属性|Boolean|--|true|
|showSelector|是否显示选择框|Boolean|--|true|
|size|图片大小 单位 M，这个一般在不需要截图的时候才会使用到|Number|--|4|
|count|图片数量|Number|--|1|
|videoCount|视频数量|Number|--|0|
|totalCount|如果视频+图片的数量大于此值，则以此值为准，为 0 时则不限制总数|Number|--|0|
|videoSize|视频尺寸 M|Number|--|20|
|allowVideo|是否允许选择图片|Boolean|--|--|
|needEdit|是否需要编辑图片，选中图片后，直接弹出编辑选框|Boolean|--|--|
|multiple|是否支持多传|Boolean|--|--|
|deleteTruth|真删或者假删|Boolean|--|--|
|width|裁剪的宽度|Number|--|0|
|height|裁剪的高度|Number|--|0|
|boxWidth|选择框的宽|Number|--|72|
|boxHeight|选择框的高|Number|--|72|
|borderRadius|圆角|Number|--|0|
|hideEditBtn|是否隐藏编辑图片按钮|Boolean|--|--|
|uploadText|选择框的文本|String|--|上传图片|
|customFileType|自定义文件格式验证 params: (reg,message)|Object|--|null|


#### Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|click|点击事件|event|
|inputChange|文件信息|files|
|imageChange|blob文件|blob|
|change|上传文件后点击确定|['fileSrc']|
|drag-start|绑定值|['fileSrc']|
|drag-end|绑定值|['fileSrc']|
|remove|删除文件回调|removeUrl,index|

#### Methods
|方法名|说明|参数|
|:---|:---|:---|
|removeLocal|删除图片，这里并不是真的删除，只是从本地列表中删除，如果想彻底删除服务器中的图片，需要监听remove事件|url|