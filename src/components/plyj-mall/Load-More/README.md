# 分页组件

## Use Methods

```js
import LoadMore from 'components/Load-More.vue';
```


#### Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|isSearch|--|Boolean|--|false|
|loading|--|Boolean|--|false|
|requestMethods|请求方法|Function|--|--|
|form|请求参数,必须包含：current: 页码|Object|--|{ current: 1 }|
|noContentTip|--|String|--|暂无内容|
|icon|--|String|--|icon-no-content|
|beforeRefresh|如果函数返回false, 则刷新不会触发，可用来拦截刷新动作|Function|--|null|
|noIcon|--|Boolean|--|false|
|isNotShowNoMoreTip|不显示‘没有更多了’提示true, 显示false|Boolean|--|false|
|noPullRefresh|禁止下拉事件|Boolean|--|false|

#### Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|more|加载更多时| list,total |
|listState|--| -- |
|refresh|更新时| list,total |

