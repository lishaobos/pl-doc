import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';


import RadioReadme from '@/components/pl-ui/radio/README.md'

import CheckboxReadme from '@/components/pl-ui/checkbox/README.md'

import SwitchReadme from '@/components/pl-ui/Switch/README.md'

import SelectorReadme from '@/components/pl-ui/Selector/README.md'

import InputReadme from '@/components/pl-ui/Input/README.md'

import IndicatorReadme from '@/components/pl-ui/indicator/README.md'

import MessageBoxReadme from '@/components/pl-ui/message-box/README.md'

import TimelineReadme from '@/components/pl-ui/timeline/README.md'

import FieldsReadme from '@/components/pl-ui/Fields/README.md'

import ListReadme from '@/components/pl-ui/List/README.md'

storiesOf('Pl-UI')
  .addDecorator(withKnobs)
  .add('Button', () => {
    return {
      template: `<pl-button>按钮</pl-button>`
    }
  })
  .add('Radio', () => {
    return {
      data() {
        return {
          checked: 1
        }
      },
      template:
      `<div>
            <PlRadio v-model='checked' :label='1'>大象</PlRadio>
            <PlRadio v-model='checked' :label='2'>老鼠</PlRadio>
            <PlRadio v-model='checked' :label='3'>乌龟</PlRadio>
      </div>`
    }
  }, {
    readme: {
      content: RadioReadme
    }
  })
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
  .add('Switch', () => {
    return {
      data() {
        return {
          checked: false
        }
      },
      template: `<PlSwitch :value='checked' @change='checked = $event'  />`
    }
  }, {
    readme: {
      content: SwitchReadme
    }
  })
  .add('Input', () => {
    return {
      data() {
        return {
          value: ''
        }
      },
      template: `<PlInput style='width: 400px' v-model='value' />`
    }
  }, {
    readme: InputReadme
  })
  .add('Selector', () => {
    return {
      data() {
        return {
          data: [
            { label: '小狗', value: 'dog' },
            { label: '小猫', value: 'cat' },
            { label: '小猪', value: 'pig' }
          ]
        }
      },
      template:
      `<div style='position: relative'>
        <PlSelector :data='data' />
      </div>`
    }
  }, {
    readme: {
      content: SelectorReadme
    }
  })
  .add('Indicator', () => {
    return {
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
        <ElButton @click='open'>open</ElButton> 
      </div>`
    }
  }, {
    readme: {
      content: IndicatorReadme
    }
  })
  .add('Message-Box', () => {
    return {
      methods: {
        alert() {
          this.$alert('Alert')
        },
        confirm() {
          this.$confirm('Confirm')
        },
        propmt() {
          this.$propmt('Propmt')
        }
      },
      template:
      `<div>
          <ElButton @click='alert'>Alert</ElButton>
          <ElButton @click='confirm'>Confirm</ElButton>
          <ElButton @click='propmt'>Propmt</ElButton>
      </div>`
    }
  }, {
    readme: {
      content: MessageBoxReadme
    }
  })
  .add('Toast', () => {
    return {
      methods: {
        error() {
          this.$error('Error')
        },
        success() {
          this.$success('Success')
        },
        warning() {
          this.$warning('Warning')
        }
      },
      template:
      `<div>
        <el-button @click='error'>Error</el-button>
        <el-button @click='success'>Success</el-button>
        <el-button @click='warning'>Warning</el-button>
      </div>`
    }
  })
  .add('Timeline', () => {
    return {
      template:
      `<PlTimeline>
        <PlTimelineItem :timestamp='1588814944278'> 吃饭 </PlTimelineItem>
        <PlTimelineItem :timestamp='1588836944278'> 玩耍 </PlTimelineItem>
        <PlTimelineItem :timestamp='1588856944278'> 睡觉 </PlTimelineItem>
      </PlTimeline>`
    }
  }, {
    readme: {
      content: TimelineReadme
    }
  })
  .add('Fields', () => {
    return {
      template:
      `<div>
        <PlFields text='货物1' />
        <PlFields text='货物2' >我是内容</PlFields>
        <PlFields text='货物3' />
      </div>`
    }
  }, {
    readme: {
      content: FieldsReadme
    }
  })
  .add('List', () => {
    return {
      template:
      `<div>
        <pl-list
            title="主攻方向："
            title-color="#838383"
            content-color="#a5a5a5"
            content="少儿奥数"
        />
        <pl-list
            title="个人经历："
            title-color="#838383"
            content-color="#a5a5a5"
            content="西北工业大学软件工程硕士"
        />
      </div>`
    }
  }, {
    readme: {
      content: ListReadme
    }
  })
