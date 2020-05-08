# Form

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
        data() {
            return {
            form: {
                entName: ''
            },
            rules: {
                entName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }]
            }
            }
        },
        methods: {
            submit() {
            if (!this.$refs.form.validate()) return
            alert('提交成功')
            }
        },
        template:
        `<div>
            <pl-form
            label-width="40"
            :model="form"
            :rules="rules"
            ref="form"
            >
                <pl-form-item 
                    border 
                    label='名称' 
                    prop="entName" 
                >
                    <pl-input
                        size="middle"
                        placeholder="单位名称"
                        v-model="form.entName"
                    />
                </pl-form-item>
            </pl-form>
            <pl-button @click='submit'>提交</pl-button>
        </div>`
    }
</script>
```


#### Form Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|model|--|Object|--|{ }|
|rules|--|Object|--|{ }|
|align|--|String|--|null|
|labelWidth|--|String / Number|--|--|
|labelStyle|--|Object|--|{ }|


#### Form-Item Methods

|方法名称|说明|回调参数|
|:---|:---|:---|
|validate|校验|true / false|

#### Form-Item Attributes

|参数|使用说明|类型|可选值|默认值|
|:---|:---|:---|:---|:---|
|label|--|String|--|--|
|labelWidth|--|String / Number|--|max-content|
|labelStyle|自定义lable样式|Object|--|{ }|
|align|--|String|--|--|
|border|--|Boolean|--|false|
|borderColor|--|String|--|#e7e7e7|
|prop|字段名称|String|--|--|
|gapTop|竖直间隔|Number|--|0|


