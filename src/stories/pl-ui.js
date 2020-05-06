import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';


import CheckboxReadme from '@/components/pl-ui/checkbox/README.md'

storiesOf('Pl-UI')
  .addDecorator(withKnobs)
  .add('Checkbox', () => {
    return {
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
  }, {
    readme: {
      content: CheckboxReadme
    }
  })
