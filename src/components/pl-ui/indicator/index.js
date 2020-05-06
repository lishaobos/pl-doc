import Vue from 'vue'
import IndicatorComponent from './Indicator.vue'
const IndicatorConstructor = Vue.extend(IndicatorComponent)
const instance = new IndicatorConstructor({
  el: document.createElement('div')
})
export class Indicator {
  static open(text) {
    if (instance.open) {
      return
    }
    if (typeof text === 'string' || typeof text === 'number') {
      instance.text = text
    } else {
      instance.text = ''
    }
    instance.open = true
    document.body.appendChild(instance.$el)
  }
  static close() {
    instance.open = false
    document.body.removeChild(instance.$el)
  }
}
