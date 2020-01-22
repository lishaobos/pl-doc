import { configureReadme } from 'storybook-readme';
import Vue from 'vue'

import Element from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

configureReadme({
//   codeTheme: 'far',
//   header: `

  // ### 朋来雅集
  // 1111111111111111

  // ---

  // `,
  //   footer: `

  // ---

  // 2222222222222222

// `,
});

import './wechat-admin';
import './plyj-mall'
