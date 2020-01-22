import { storiesOf } from '@storybook/vue';
import { withKnobs, text, select, boolean, array, radios, object, color, number } from '@storybook/addon-knobs';

// 日期选择器
import DateRange from '@wechatAdminComponents/DateRange';
import DateRangeReadme from '@wechatAdminComponents/DateRange/README.md';
import DateRangeCode from '@wechatAdminComponents/DateRange/USAGE.md';

// draggable 拖动
import Draggable from '@wechatAdminComponents/Draggable'
import DraggableReadme from '@wechatAdminComponents/Draggable/README.md';

// icon 图标
import PlSvg from '@wechatAdminComponents/PlSvg'
import PlSvgReadme from '@wechatAdminComponents/PlSvg/README.md';
import PlSvgCode from '@wechatAdminComponents/PlSvg/USAGE.md';

// 分享
import Share from '@wechatAdminComponents/Share'
import ShareReadme from '@wechatAdminComponents/Share/README.md';
import ShareCode from '@wechatAdminComponents/Share/USAGE.md';

// 编辑图片
import EditImage from '@wechatAdminComponents/File/EditImage'
import EditImageReadme from '@wechatAdminComponents/File/EditImage/README.md';
import EditImageCode from '@wechatAdminComponents/File/EditImage/USAGE.md';

// 文件选择
import FileSelector from '@wechatAdminComponents/File/FileSelector'
import FileSelectorReadme from '@wechatAdminComponents/File/FileSelector/README.md';
import FileSelectorCode from '@wechatAdminComponents/File/FileSelector/USAGE.md';

// 上传组件
import ImageManager from '@wechatAdminComponents/File/ImageManager'
import ImageManagerReadme from '@wechatAdminComponents/File/ImageManager/README.md';
import ImageManagerCode from '@wechatAdminComponents/File/ImageManager/USAGE.md';

storiesOf('WechatAdmin')
//   // 全局公用
//   .addParameters({
//     readme: {
//     //   codeTheme: 'duotone-sea',
//       content: DateRangeReadme,
//       sidebar: DateRangeCode
//     }
//   })
  .addDecorator(withKnobs)
  // 日期选择器
  .add('Date-Range', () => {
    return {
      components: {
        DateRange
      },
      props: {
        size: {
          default: select('size', {
            large: 'large',
            small: 'small',
            mini: 'mini'
          })
        },
        startLabel: {
          default: text('startLabel', '开始时间')
        },
        endLabel: {
          default: text('endLabel', '结束时间')
        },
        showLabel: {
          default: boolean('showLabel', true)
        },
        separator: {
          default: text('separator', '至')
        },
        disabledStartTime: {
          default: boolean('disabledStartTime')
        },
        disabledEndTime: {
          default: boolean('disabledEndTime')
        },
        clearable: {
          default: boolean('clearable', false)
        },
        init: {
          default: array('init', [], ',')
        },
        disableBefore: {
          default: boolean('disableBefore', false)
        },
        disableAfter: {
          default: boolean('disableAfter', false)
        },
        type: {
          default: radios('type', {
            date: 'date',
            datetime: 'datetime'
          }, 'date')
        }
      },
      template:
      `<DateRange 
        :separator='separator' 
        :size='size'
        :startLabel='startLabel'
        :endLabel='endLabel'
        :showLabel='showLabel'
        :disabledStartTime='disabledStartTime'
        :disabledEndTime='disabledEndTime'
        :clearable='clearable'
        :init='init'
        :disableAfter='disableAfter'
        :disableBefore='disableBefore'
        :type='type'
       />`
    };
  }, {
    readme: {
      content: DateRangeReadme,
      sidebar: DateRangeCode
    }
  })
  // draggable 拖动
  .add('Draggable', () => {
    return {
      components: {
        Draggable
      },
      props: {
        list: {
          default: array('list', [1, 2, 3, 4])
        },
        componentData: {
          default: object('componentData', null)
        },
        tag: {
          default: text('tag', 'div')
        },
        noTransition: {
          default: boolean('noTransition', false)
        },
        animation: {
          default: text('animation', '500')
        },
        ghostClass: {
          default: text('ghost-class')
        }
      },
      template:
      `<Draggable
        :list='list'
        :componentData='componentData'
        :tag='tag'
        :noTransition='noTransition'
        :animation='animation'
      >
      <div v-for='(item,index) in list' style='background:pink;margin-bottom:10px;' :key='index'>{{item}}</div>
      </Draggable>
      `
    }
  }, {
    readme: {
      content: DraggableReadme
    }
  })
  // icon 图标
  .add('Pl-Svg', () => {
    return {
      components: { PlSvg },
      props: {
        name: {
          default: text('name', 'icon-jinru-c1d1c')
        },
        fill: {
          default: color('fill')
        },
        width: {
          default: text('width', '')
        },
        height: {
          default: text('height', '')
        }
      },
      template:
      `<PlSvg
        :name='name'
        :fill='fill'
        :width='width'
        :height='height'
      />
      `
    }
  }, {
    readme: {
      content: PlSvgReadme,
      sidebar: PlSvgCode
    }
  })
  // 分享组件
  .add('Share', () => {
    return {
      components: { Share },
      props: {
        qrcodeText: {
          default: text('qrcodeText', 'https://dev.xijun.youpenglai.com/pljs/detail/lesson/1206804513524047872?123')
        },
        qrcodeImageName: {
          default: text('qrcodeImageName', '二维码')
        },
        // 二维码中心的缩略图
        thumbnail: {
          default: text('thumbnail', '')
        },
        show: {
          default: boolean('show', false)
        }
      },
      data() {
        return {
          showDialog: false
        }
      },
      template:
      `<div>
        <el-button @click='showDialog = true'>点击</el-button>
        <Share
            :qrcodeText='qrcodeText'
            :qrcodeImageName='qrcodeImageName'
            :thumbnail='thumbnail'
            :show.sync='showDialog'
        />
      </div>
      `
    }
  }, {
    readme: {
      content: ShareReadme,
      sidebar: ShareCode
    }
  })

storiesOf('WechatAdmin/File')
  .addDecorator(withKnobs)
  // 编辑图片
  .add('Edit-Image', () => {
    return {
      components: { EditImage },
      props: {
      },
      data() {
        return {
          showDialog: false,
          imgUrl: '',
          width: 10,
          height: 10,
          url: '',
          forced: false
        }
      },
      methods: {
        createObjectUrl(blob) {
          let url
          if (window.createObjectURL) { // basic
            url = window.createObjectURL(blob)
          } else if (window.URL) { // mozilla(firefox)
            url = window.URL.createObjectURL(blob)
          } else if (window.webkitURL) { // webkit or chrome
            url = window.webkitURL.createObjectURL(blob)
          }
          return url
        },
        changeFile(e) {
          const file = e.target.files[0];
          const url = this.createObjectUrl(file);
          this.imgUrl = url;
          this.showDialog = true;
        }
      },
      template:
      `<div>
        <input type='file' accept='image/jpeg,image/png' @change='changeFile' />
        <EditImage
            :show.sync='showDialog'
            :width='width'
            :height='height'
            :url.sync='imgUrl'
            :forced.sync='forced'
        />
       </div>
      `
    }
  }, {
    readme: {
      content: EditImageReadme,
      sidebar: EditImageCode
    }
  })
  // 图片选择器
  .add('File-Selector', () => {
    return {
      components: { FileSelector },
      props: {
        boxWidth: {
          default: number('boxWidth', 72)
        },
        boxHeight: {
          default: number('boxHeight', 72)
        },
        listLength: {
          default: number('listLength', 0)
        },
        uploadText: {
          default: text('uploadText', '上传图片')
        },
        marginLeft: {
          default: number('marginLeft', 20)
        },
        borderRadius: {
          default: number('borderRadius', 0)
        }
      },
      template:
      `<FileSelector
        :boxWidth='boxWidth'
        :boxHeight='boxHeight'
        :listLength='listLength'
        :uploadText='uploadText'
        :marginLeft='marginLeft'
        :borderRadius='borderRadius'
      />
      `
    }
  }, {
    readme: {
      content: FileSelectorReadme,
      sidebar: FileSelectorCode
    }
  })
  // 上传组件
  .add('Image-Manager', () => {
    return {
      components: { ImageManager },
      props: {
        list: {
          default: array('list', [])
        },
        disabledDraggable: {
          default: boolean('disabledDraggable')
        },
        showList: {
          default: boolean('showList', true)
        },
        showSelector: {
          default: boolean('showSelector', true)
        },
        size: {
          default: number('size', 4)
        },
        count: {
          default: number('count', 1)
        },
        videoCount: {
          default: number('videoCount', 0)
        },
        totalCount: {
          default: number('totalCount', 0)
        },
        videoSize: {
          default: number('videoSize', 20)
        },
        allowVideo: {
          default: boolean('allowVideo')
        },
        needEdit: {
          default: boolean('needEdit', true)
        },
        multiple: {
          default: boolean('multiple')
        },
        deleteTruth: {
          default: boolean('deleteTruth')
        },
        width: {
          default: number('width', 100)
        },
        height: {
          default: number('height', 100)
        },
        boxWidth: {
          default: number('boxWidth', 100)
        },
        boxHeight: {
          default: number('boxHeight', 100)
        },
        borderRadius: {
          default: number('borderRadius', 0)
        },
        hideEditBtn: {
          default: boolean('hideEditBtn')
        },
        uploadText: {
          default: text('uploadText', '上传图片')
        },
        customFileType: {
          default: object('customFileType', null)
        }
      },
      template:
      `<ImageManager
        :list='list'
        :disabledDraggable='disabledDraggable'
        :showList='showList'
        :showSelector='showSelector'
        :size='size'
        :count='count'
        :videoCount='videoCount'
        :totalCount='totalCount'
        :videoSize='videoSize'
        :allowVideo='allowVideo'
        :needEdit='needEdit'
        :multiple='multiple'
        :deleteTruth='deleteTruth'
        :width='width'
        :height='height'
        :boxWidth='boxWidth'
        :boxHeight='boxHeight'
        :borderRadius='borderRadius'
        :hideEditBtn='hideEditBtn'
        :uploadText='uploadText'
        :customFileType='customFileType'
      />
      `
    }
  }, {
    readme: {
      content: ImageManagerReadme,
      sidebar: ImageManagerCode
    }
  })

