import { storiesOf } from '@storybook/vue';
import { withKnobs, boolean } from '@storybook/addon-knobs';

//
import CitySelector from '@plyjMallComponents/CitySelector'

storiesOf('PlyjMall')
  .addDecorator(withKnobs)
  .add('City-Selector', () => {
    return {
      components: {
        CitySelector
      },
      data() {
        return {
          showCitySelector: false
        }
      },
      props: {
        show: boolean('show', false)
      },
      template:
      `<div>
        <el-button @click='showCitySelector = true'>点击</el-button>
        <CitySelector
        :show.sync="showCitySelector"
        />
      </div>`
    }
  })
