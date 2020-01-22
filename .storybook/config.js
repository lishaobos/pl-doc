import Vue from 'vue';
import { configure, addDecorator, addParameters } from '@storybook/vue';
import { addReadme } from 'storybook-readme/vue';
import { themes, create } from '@storybook/theming';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const basicTheme = create({
  base: 'light',
  brandTitle: '朋来雅集',
  brandUrl: 'http://www.baidu.com',
  brandImage: "https://mallcdn.youpenglai.com/static/penglai-yaji/8de0eecd-3c73-4f5c-9af4-087cab85b61a.png"
});


addParameters({
  viewport: {
    viewports: {...INITIAL_VIEWPORTS}, // newViewports would be an ViewportMap. (see below for examples)
    // defaultViewport: 'iphone6',
  },
  options: {
    showPanel: true,
    panelPosition: 'right',
    theme: basicTheme,
    // theme: themes.dark,
  },
  readme: {
    // You can set the global code theme here.
    codeTheme: 'github',
  },
});

addDecorator(addReadme);

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
