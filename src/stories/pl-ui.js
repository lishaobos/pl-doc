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

import ProgressReadme from '@/components/pl-ui/Progress/README.md'

import TabReadme from '@/components/pl-ui/Tab/README.md'

import PopupReadme from '@/components/pl-ui/Popup/README.md'

import FormReadme from '@/components/pl-ui/Form/README.md'


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
  .add('Progress', () => {
    return {
      data() {
        return {
          percentage: 10
        }
      },
      methods: {
        add() {
          this.percentage < 100 ? this.percentage++ : ''
        },
        reduce() {
          this.percentage > 0 ? this.percentage-- : ''
        }
      },
      template:
      `<div>
        <div style='margin-bottom: 10px;'>
            <ElButton @click='reduce'>-</Elbutton> 
            <ElButton @click='add'>+</Elbutton>
        </div>
        <PlProgress :percentage='percentage' color='pink'/>
      </div>`
    }
  }, {
    readme: {
      content: ProgressReadme
    }
  })
  .add('Tab', () => {
    return {
      data() {
        return {
          activeId: 1,
          tabs: [
            { id: 1, name: '小猫' },
            { id: 2, name: '小狗' },
            { id: 3, name: '小猪' }
          ]
        }
      },
      template: `<PlTab  :tabs='tabs' :activeId='activeId' />`
    }
  }, {
    readme: {
      content: TabReadme
    }
  })
  .add('Popup', () => {
    return {
      data() {
        return {
          show: false
        }
      },
      template:
      `<div>
        <ElButton @click='show = true'>点我</ElButton>
        <pl-popup :show.sync="show" title="活动规则">
            <ul>
                <li>1. 设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖</li>
                <li>2. 活动期间不支持退款，不支持线上发票</li>
                <li>3. 仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠</li>
                <li>4. 结束以活动截止时间为准</li>
            </ul>
        </pl-popup>
      </div>`
    }
  }, {
    readme: {
      content: PopupReadme
    }
  })
  .add('Form', () => {
    return {
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
  }, {
    readme: {
      content: FormReadme
    }
  })
