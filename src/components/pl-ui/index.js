import './assets/scss/transition.scss'
import './assets/scss/config.scss'
import Button from './Button.vue'
import Input from './Input.vue'
import Tab from './Tab.vue'
import Form from './Form'
import FormItem from './Form-Item'
import Radio from './Radio.vue'
import List from './List.vue'
import UploadImg from './Upload-Img.vue'
import Fields from './Fields.vue'
import Switch from './Switch.vue'
import PlSvg from '@wechatAdminComponents/Pl-Svg'
import MessageBox from './message-box'
import Selector from './Selector.vue'
import Checkbox from './checkbox/Checkbox.vue'
import CheckboxGroup from './checkbox/Checkbox-Group.vue'
import RadioComponent from './radio/Radio.vue'
import RadioGroupComponent from './radio/Radio-Group.vue'
import Popup from './Popup.vue'
import Picker from './picker/Picker.vue'
import Mask from './Mask.vue'

// import CanvasVideo from './Canvas-Video.vue'
import { Timeline, TimelineItem } from './timeline'
import { Indicator } from './indicator'

// import SvgIcon from 'vue-svgicon'
export { Toast } from './toast'
export { Loading } from './loading'
const components = [
  Button,
  Input,
  Tab,
  Form,
  FormItem,
  Radio,
  List,
  UploadImg,
  Fields,
  PlSvg,
  Switch,
  MessageBox,
  Selector,
  Checkbox,
  CheckboxGroup,
  RadioComponent,
  RadioGroupComponent,
  Popup,
  Picker,
  Timeline,
  TimelineItem,
  Mask

  // CanvasVideo
]

/* 定义全局安装方法，即在全局使用Vue.use方法 */
const install = function(Vue, opts = {}) {
  // Vue.use(SvgIcon, {
  //   tagName: 'svgicon'
  // })
  /* 安装所有组件 */
  for (const c of components) {
    if (!c.install) {
      c.install = function(Vue) {
        Vue.component(c.name, c)
      }
    }
    Vue.use(c)
  }

  /* penglai-ui 全局变量 */
  Vue.prototype.$PL = {
    size: opts.size || '',
    zIndex: opts.size || 2000
  }
  Vue.prototype.$indicator = Indicator
}

export default {
  install
}
