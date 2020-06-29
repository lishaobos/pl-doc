### :smile: 源代码

```js
<template>
    <div :class="$style.noContent">
        <pl-svg :name="icon" />
        <p
            :class="$style.text"
            v-text="text"
        />
    </div>
</template>

<script>
import PlSvg from '@wechatAdminComponents/Pl-Svg'
export default {
  name: 'NoContent',
  components: {
    PlSvg
  },
  props: {
    text: {
      type: String,
      default: ''
    },

    /*
    * no-content
    * no-content2
    * */
    icon: {
      type: String,
      default: 'icon-no-content'
    }
  }
}
</script>

<style scale module lang="scss">
  .no-content {
    width: 100%;
    margin: 120px 0;
    text-align: center;
    svg {
      width: 450px;
      height: 282px;
    }
    .text {
      margin-top: 30px;
      font-size: 32px;
      color: #999;
    }
  }
</style>
```