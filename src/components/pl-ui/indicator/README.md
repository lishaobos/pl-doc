# Indicator

<br>

<!-- STORY -->

<br>

### 示例代码

```js
<script>
    export default {
        methods: {
            open() {
                this.$indicator.open('正在压缩图片')
                setTimeout(() => {
                this.$indicator.close()
                }, 1000)
            }
        },
        template:
        `<div>
        <button @click='open'>open</button> 
        </div>`
    }
</script>
```


