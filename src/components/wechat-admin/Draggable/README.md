# Draggable

<br>

<!-- STORY -->

<br>

## Use Methods

```js
// 注意：有些属性是无法响应的，不用担心
// 该组件基于 sortable.js 库，更多的参数和方法请看官网，地址：http://www.sortablejs.com/options.html
import Draggable from 'components/Draggable.vue';
```

#### Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|list|为需要拖拽排序的列表数组|Array|--|null|
|componentData|自定义属性 { on: {}, props: {}, attrs: {} }，合并到原有属性上|Object|--|null|
|tag|包裹的父元素标签|String|--|div|
|noTransition|是否要过度动画|Boolean|--|--|
|animation|过渡动画时长（单位：毫秒）|String|--|--|
|ghost-class|动画自定义类名|String|--|--|


#### Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|start|拖动开始的时候|--|
|end|拖动结束的时候|--|