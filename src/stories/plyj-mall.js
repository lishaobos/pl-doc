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
      props: {
        show: boolean('show', false)
      },
      data() {
        return {
          showCitySelector: false
        }
      },
      template:
      `<div>
        <el-input @focus='showCitySelector = true'>点击</el-input>
        <CitySelector
        :show.sync='showCitySelector'
        @select=''
        />
      </div>`
    }
  })
