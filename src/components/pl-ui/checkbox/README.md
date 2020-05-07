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
                checked: false,
                checked1: false,
                checkList: [],
                productList: [
                { checked: false, name: '苹果' },
                { checked: false, name: '樱桃' },
                { checked: false, name: '西瓜' }
                ]
            }
        },
        methods: {
            changeAll(flag) {
                this.$refs.group.changeAll(flag)
            }
        },
        template:
        `<div>
        <h3>单选</h3>
        <PlCheckbox v-model='checked'>
            <template #suffix>
                <span style='margin-left: 10px'>大皮球</span>
            </template>
        </PlCheckbox>
        <br>
        <h3>多选</h3>
        <PlCheckbox v-model='checked1' @change='changeAll'>
            <template #suffix>
                <span style='margin-left: 10px'>全选</span>
            </template>
        </PlCheckbox>
        <PlCheckboxGroup ref='group' v-model='checkList'>
            <PlCheckbox :gapRow='10' v-model='item.checked' :data='item' v-for='(item,index) in productList' :key='index'>
                <template #suffix>
                    <span style='margin-left: 10px'>{{ item.name }}</span>
                </template>
            </PlCheckbox>
        </PlCheckboxGroup>
        </div>`
    }
</script>
```


#### Checkbox Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|v-model|绑定值|Array|--|--|
|data|绑定的值，一般用于checkbox-group，将作为已选数据中的一个值，如果绑定了值，则认为有一组待选的值，使用checkbox-group监听整体变化|Object / String / Number|--|null|
|checked|单独使用时绑定的值|Boolean|--|false|
|disabled|是否禁用|Boolean|--|false|
|inline|是否以行内元素显示|Boolean|--|false|
|indeterminate|半选效果（暂时没有设计）|Boolean|--|false|
|gapColumn|纵向间隙|Number|--|0|
|gapRow|横向间隙|Number|--|0|
|border|边框|Number|--|0|
|canPrefixClick|--|Boolean|--|false|


#### Checkbox Events

|事件名称|说明|回调参数|
|:---|:---|:---|
|change|当绑定值变化时触发的事件| checked，data |


#### CheckboxGroup Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|v-model|绑定值|Array|--|--|


#### CheckboxGroup Methods

|事件名称|说明|参数|
|:---|:---|:---|
|change|当绑定值变化时触发的事件| checked，data |
|changeAll|全选或全不选| checked |

