# Files

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
        template:
        `<div>
            <PlFields text='货物1' />
            <PlFields text='货物2' />
            <PlFields text='货物3' />
        </div>`
    }
</script>
```


#### Checkbox Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|icon|--|String|--|--|
|iconType|--|String|--|svg|
|iconColor|--|String|--|--|
|iconGap|图片和文字直接的间隙|Number|--|0|
|iconPosition|--|String|left / right|left|
|text|--|String|--|--|
|titleColor|--|String|--|#2e2e2e|
|rightTextWeight|fontWeight|String|--|normal|
|leftTextWeight|fontWeight|String|--|normal|
|rightText|--|String|--|--|
|rightIcon|--|String|--|icon-right|
|showRightIcon|--|Boolean|--|false|
|route|--|Object|--|null|
|size|尺寸|String|large / middle / small|large|
|canCollapse|支持展开slot|Boolean|--|false|
|iconWidth|--|Number|--|50|
|iconHeight|--|Number|--|50|


#### Checkbox Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|click|点击时|--|
