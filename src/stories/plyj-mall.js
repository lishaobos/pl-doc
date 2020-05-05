import { storiesOf } from '@storybook/vue';
import { withKnobs, boolean, number, text, color, array } from '@storybook/addon-knobs';

// 地区选择
import CitySelector from '@plyjMallComponents/City-Selector'
import CitySelectorReadme from '@plyjMallComponents/City-Selector/README.md'
import CitySelectorCode from '@plyjMallComponents/City-Selector/USAGE.md'

// 数量选择器
import Count from '@plyjMallComponents/Count'
import CountReadme from '@plyjMallComponents/Count/README.md'
import CountCode from '@plyjMallComponents/Count/USAGE.md'

// 选择图片
import ImgCorp from '@plyjMallComponents/Img-Corp'
import ImgCorpReadme from '@plyjMallComponents/Img-Corp/README.md'
import ImgCorpCode from '@plyjMallComponents/Img-Corp/USAGE.md'

import ModuleTitle from '@plyjMallComponents/Module-Title'
import ModuleTitleReadme from '@plyjMallComponents/Module-Title/README.md'
import ModuleTitleCode from '@plyjMallComponents/Module-Title/USAGE.md'

import NoContent from '@plyjMallComponents/No-Content'
import NoContentReadme from '@plyjMallComponents/No-Content/README.md'
import NoContentCode from '@plyjMallComponents/No-Content/USAGE.md'

import TopText from '@plyjMallComponents/Top-Text'
import TopTextReadme from '@plyjMallComponents/Top-Text/README.md'
import TopTextCode from '@plyjMallComponents/Top-Text/USAGE.md'

// 海报弹窗
import SharePoster from '@plyjMallComponents/Share-Poster'
import SharePosterReadme from '@plyjMallComponents/Share-Poster/README.md'
import SharePosterCode from '@plyjMallComponents/Share-Poster/USAGE.md'

// 进度条
import Progress from '@plyjMallComponents/Progress'
import ProgressReadme from '@plyjMallComponents/Progress/README.md'
import ProgressCode from '@plyjMallComponents/Progress/USAGE.md'

// 播放器
import PaidPlayerReadme from '@plyjMallComponents/Paid-Player/README.md'

// 分页组件
import LoadMoreReadme from '@plyjMallComponents/Load-More/README.md'
import LoadMoreCode from '@plyjMallComponents/Load-More/USAGE.md'


storiesOf('Plyj-Mall')
  .addDecorator(withKnobs)
  // 地区选择
  .add('City-Selector', () => {
    return {
      components: {
        CitySelector
      },
      data() {
        return {
          value: '',
          showCitySelector: false
        }
      },
      methods: {
        select(val) {
          this.value = val.map(({ name }) => name).join('/')
        }
      },
      template:
      `<div>
        <el-input @focus='showCitySelector = true' :value='value'>点击</el-input>
        <CitySelector
        :show.sync='showCitySelector'
        @select='select'
        />
      </div>`
    }
  }, {
    readme: {
      content: CitySelectorReadme,
      sidebar: CitySelectorCode
    }
  })
  // 数量选择器
  .add('Count', () => {
    return {
      components: {
        Count
      },
      props: {
        max: {
          default: number('max', Number.MAX_VALUE)
        },
        min: {
          default: number('min', 1)
        },
        disabled: {
          default: boolean('disabled', false)
        }
      },
      data() {
        return {
          count: 1
        }
      },
      methods: {
        change(count, next) {
          this.count = count
          next()
        }
      },
      template:
      `<Count
        :max='max'
        :min='min'
        :count='count'
        :disabled='disabled'
        @change='change'
       />`
    }
  }, {
    readme: {
      content: CountReadme,
      sidebar: CountCode
    }
  })
  // 图片选择
  .add('Img-Corp', () => {
    return {
      components: {
        ImgCorp
      },
      data() {
        return {
          img: {}
        }
      },
      methods: {
        submitImg() {}
      },
      template:
      `<ImgCorp
        :proportion="{ w: 50, h: 50 }"
        @submit="submitImg"
        v-model="img"
       >
        <button>点击</button>
       </ImgCorp>`
    }
  }, {
    readme: {
      content: ImgCorpReadme,
      sidebar: ImgCorpCode
    }
  })
  // 分页组件
  .add('Load-More', () => {
    return {
      template: '<div />'
    }
  }, {
    readme: {
      content: LoadMoreReadme,
      sidebar: LoadMoreCode
    }
  })
  .add('Module-Title', () => {
    return {
      components: {
        ModuleTitle
      },
      props: {
        title: {
          default: text('title', 'Module-Title')
        },
        prefixIcon: {
          default: text('prefixIcon', '')
        },
        suffixIcon: {
          default: text('suffixIcon', '')
        },
        iconColor: {
          default: color('iconColor', '#a8a8a8')
        },
        tip: {
          default: text('tip', '')
        },
        badge: {
          default: text('badge', '标记')
        }
      },
      template:
      `<ModuleTitle
        :title='title'
        :prefixIcon='prefixIcon'
        :suffixIcon='suffixIcon'
        :iconColor='iconColor'
        :tip='tip'
        :badge='badge'
      />`
    }
  }, {
    readme: {
      content: ModuleTitleReadme,
      sidebar: ModuleTitleCode
    }
  })
  //
  .add('No-Content', () => {
    return {
      components: {
        NoContent
      },
      props: {
        text: {
          default: text('text', '没东西了')
        },
        icon: {
          default: text('icon', 'icon-no-content')
        }
      },
      template:
      `<NoContent
        :text='text'
        :icon='icon'
       />`
    }
  }, {
    readme: {
      content: NoContentReadme,
      sidebar: NoContentCode
    }
  })
  //
  .add('Top-Text', () => {
    return {
      components: { TopText },
      props: {
        title: {
          default: text('title', 'title')
        },
        tip: {
          default: text('tip', 'tip')
        }
      },
      template:
      `<TopText
        :title='title'
        :tip='tip'
       />`
    }
  }, {
    readme: {
      content: TopTextReadme,
      sidebar: TopTextCode
    }
  })
  .add('Share-Poster', () => {
    return {
      components: { SharePoster },
      data() {
        return {
          show: false,
          poster: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2651188926,402822664&fm=26&gp=0.jpg'
        }
      },
      template:
      `<div>
        <button @click='show = true'>点击</button>
        <SharePoster 
          :show.sync='show'
          :poster='poster'
        />
      </div>`
    }
  }, {
    readme: {
      content: SharePosterReadme,
      sidebar: SharePosterCode
    }
  })
  // 进度条
  .add('Progress', () => {
    return {
      components: { Progress },
      props: {
        steps: {
          default: array('steps', [1, 2, 3, 4, 5])
        },
        active: {
          default: number('active', 0)
        },
        direction: {
          default: text('direction', 'horizontal')
        },
        activeColor: {
          default: color('activeColor', '#F2B036')
        }
      },
      template:
      `<Progress
        :steps='steps'
        :active='active'
        :direction='direction'
        :activeColor='activeColor'
       />`
    }
  }, {
    readme: {
      content: ProgressReadme,
      sidebar: ProgressCode
    }
  })
  //
  .add('Paid-Player', () => {
    return {
      template: '<div />'
    }
  }, {
    readme: {
      content: PaidPlayerReadme
    }
  })

