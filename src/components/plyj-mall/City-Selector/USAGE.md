### :smile: 源代码

```js
<template>
  <div
    :class="$style.citySelector"
    v-if="show"
  >
    <div
      :class="$style.mask"
      @click="$emit('update:show', false)"
    />
    <div :class="{[$style.selector]: true, [$style.visabled]: visabled}">
      <div :class="$style.selected">
        <span
          :class="{[$style.active]: !(Boolean(city) || Boolean(counties))}"
          v-text="province ? province.name : '请选择'"
          @click="returnBack(province, 'province')"
        />
        <span
          v-if="cityList.length > 0"
          :class="{[$style.active]: Boolean(city) && !Boolean(counties)}"
          v-text="city ? city.name : '请选择'"
          @click="returnBack(city, 'city')"
        />
        <span
          v-if="countiesList.length > 0"
          :class="{[$style.active]: Boolean(counties) && !Boolean(town)}"
          v-text="counties ? counties.name : '请选择'"
          @click="returnBack(counties, 'counties')"
        />
        <span
          v-if="townList.length > 0"
          :class="{[$style.active]: Boolean(town)}"
          v-text="town ? town.name : '请选择'"
        />
      </div>
      <div :class="$style.list">
        <ul
          :class="$style.cityList"
          v-if="cityList.length === 0 && countiesList.length === 0"
          @click="provinceClick"
        >
          <li
            v-for="(p, i) of provinceList"
            :key="i"
            v-text="p.locationName"
            :data-name="p.locationName"
            :data-code="p.locationCode"
            :class="{ [$style.active]: province && (province.code === p.locationCode) }"
          />
        </ul>
        <ul
          :class="$style.cityList"
          v-if="cityList.length > 0 && countiesList.length === 0"
          @click="cityClick"
        >
          <li
            v-for="(c, i) of cityList"
            :key="i"
            v-text="c.locationName"
            :data-name="c.locationName"
            :data-code="c.locationCode"
            :class="{ [$style.active]: city && (city.code === c.locationCode) }"
          />
        </ul>
        <ul
          :class="$style.cityList"
          v-if="countiesList.length > 0 && townList.length === 0"
          @click="countiesClick"
        >
          <li
            v-for="(c, i) of countiesList"
            :key="i"
            v-text="c.locationName"
            :data-name="c.locationName"
            :data-code="c.locationCode"
            :class="{ [$style.active]: counties && (counties.code === c.locationCode) }"
          />
        </ul>
        <ul
          :class="$style.cityList"
          v-if="townList.length > 0"
          @click="townClick"
        >
          <li
            v-for="(t, i) of townList"
            :key="i"
            v-text="t.locationName"
            :data-name="t.locationName"
            :class="{ [$style.active]: town && (town.code === t.locationCode) }"
            :data-code="t.locationCode"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getCityListByParentId } from '@apis'
export default {
  name: 'CitySelector',
  data() {
    return {
      visabled: false,
      cityList: [],
      countiesList: [],
      townList: [],
      provinceList: [],
      province: null,
      city: null,
      counties: null,
      town: null
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show(val) {
      if (val) {
        setTimeout(() => {
          this.visabled = true
        }, 100)
      } else {
        this.visabled = false
      }
    }
  },
  async created() {
    try {
      const { data: { result }} = await getCityListByParentId(0)
      this.provinceList = result || []
    } catch (e) {
      throw e
    }
  },
  deactivated() {
    this.cityList = []
    this.countiesList = []
    this.townList = []
    this.province = null
    this.city = null
    this.counties = null
    this.town = null
  },
  destroyed() {
    this.cityList = []
    this.countiesList = []
    this.townList = []
    this.province = null
    this.city = null
    this.counties = null
    this.town = null
  },
  methods: {
    clear() {
      this.cityList.splice(0, 999)
      this.countiesList.splice(0, 999)
      this.townList.splice(0, 999)
      this.province = null
      this.city = null
      this.counties = null
      this.town = null
    },
    async provinceClick(e) {
      if (e.target.tagName !== 'LI') return
      let target = e.target
      let name = target.dataset['name']
      let code = target.dataset['code']
      this.province = {
        name,
        code
      }
      try {
        const { data: { result }} = await getCityListByParentId(code)
        this.cityList = result || []
      } catch (e) {
        throw e
      }
    },
    async cityClick(e) {
      if (e.target.tagName !== 'LI') return
      let target = e.target
      let name = target.dataset['name']
      let code = target.dataset['code']
      this.city = {
        name,
        code
      }
      try {
        const { data: { result }} = await getCityListByParentId(code)
        this.countiesList = result || []
        if (this.countiesList.length === 0) {
          this.$emit('select', [this.province, this.city])
          this.$emit('update:show', false)
        }
      } catch (e) {
        throw e
      }
    },
    async countiesClick(e) {
      if (e.target.tagName !== 'LI') return
      let target = e.target
      let name = target.dataset['name']
      let code = target.dataset['code']
      this.counties = {
        name,
        code
      }
      try {
        const { data: { result }} = await getCityListByParentId(code)
        this.townList = result || []
        if (this.townList.length === 0) {
          this.$emit('select', [this.province, this.city, this.counties])
          this.$emit('update:show', false)
        }
      } catch (e) {
        throw e
      }
    },
    townClick(e) {
      if (e.target.tagName !== 'LI') return
      let target = e.target
      let name = target.dataset['name']
      let code = target.dataset['code']
      this.town = {
        name,
        code
      }
      this.$emit('select', [this.province, this.city, this.counties, this.town])
      this.$emit('update:show', false)
    },
    returnBack(data, flag) {
      this[flag] = data
      if (flag === 'counties') {
        this.town = null
        this.counties = null
        this.townList = []
        return
      }
      if (flag === 'city') {
        this.town = null
        this.city = null
        this.counties = null
        this.countiesList = []
        this.townList = []
        return
      }
      if (flag === 'province') {
        this.province = null
        this.city = null
        this.counties = null
        this.town = null
        this.cityList = []
        this.countiesList = []
        this.townList = []
      }
    }
  }
}
</script>

<style scale module lang="scss">
  .city-selector {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
  }
  .selector {
    position: absolute;
    left: 0;
    bottom: -100%;
    width: 100%;
    height: 750;
    background-color: #fff;
    transition: bottom 0.2s ease-in-out;
    &.visabled {
      bottom: 0;
    }
    .selected {
      position: relative;
      height: 100px;
      line-height: 100px;
      padding: 0 30px;
      font-size: 0;
      overflow: scroll;
      white-space: nowrap;
      border: 1px solid #e7e7e7;
      span {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        font-size: 30px;
        &.active {
          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: #ec742e;
          }
        }
      }
    }
    .list {
      display: flex;
    }
    .city-list {
      width: 100%;
      height: 650px;
      padding: 0 30px;
      font-size: 30px;
      line-height: 90px;
      overflow: auto;
      li.active {
        color: #ec742e;
        font-weight: bold;
      }
    }
  }
</style>
```