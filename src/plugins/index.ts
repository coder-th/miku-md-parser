import anchorPlugin, { AnchorOptions } from 'markdown-it-anchor';
import tableContent from 'markdown-it-table-of-contents';
import markdownItEmoji from 'markdown-it-emoji';
import markdownItTaskList from 'markdown-it-task-lists';
import itSub from 'markdown-it-sub';
import itSup from 'markdown-it-sup';
import itIns from 'markdown-it-ins';
import itMark from 'markdown-it-mark';
import itAbbr from 'markdown-it-abbr';
import { BaseType, Md } from '../types/md';
import { createBaseContainer, createMdContainer } from './container';
import { preWrapper } from './preWrapper';
import { lineNumbers } from './lineNumbers';
import { deepMerge } from '../utils/helper';
export const builtInPlugins = {
  // 任务列表
  TASK_LIST: {
    name: 'task-list',
    plugin: markdownItTaskList,
    enable: true,
    isCustom: false,
    config: { enable: true },
  },
  // 文章目录路由
  ANCHOR: {
    name: 'anchor',
    plugin: anchorPlugin,
    enable: true,
    isCustom: false,
    config: {} as AnchorOptions,
  },
  // 文章目录级别
  TABLE_CONTENT: {
    name: 'table-content',
    plugin: tableContent,
    enable: true,
    isCustom: false,
    config: { includeLevel: [2, 3, 4] },
  },
  // 文章表情包
  EMOJI: {
    name: 'emoji',
    plugin: markdownItEmoji,
    enable: true,
    isCustom: false,
    config: {} as any,
  },
  // 下标
  SUB: {
    name: 'sub',
    plugin: itSub,
    enable: true,
    isCustom: false,
    config: {} as any,
  },
  // 上标
  SUP: {
    name: 'sup',
    plugin: itSup,
    enable: true,
    isCustom: false,
    config: {} as any,
  },
  // 标记
  MARK: {
    name: 'mark',
    plugin: itMark,
    enable: true,
    isCustom: false,
    config: {} as any,
  },
  // 缩写注释
  ABBR: {
    name: 'abbr',
    plugin: itAbbr,
    enable: true,
    isCustom: false,
    config: {} as any,
  },
  // 插入
  INS: {
    name: 'ins',
    plugin: itIns,
    enable: true,
    isCustom: false,
    config: {} as any,
  },
  // 自定义容器
  BASE_CONTAINER: {
    name: 'base-container',
    plugin: createBaseContainer,
    enable: true,
    isCustom: true,
    config: {
      use: ['success', 'warning', 'error', 'tips', 'spoiler'] as BaseType[],
      addContainer: createMdContainer,
    },
  },
  // 代码区域包裹元素
  PRE_WRAPPER: {
    name: 'pre-wrapper',
    plugin: preWrapper,
    enable: true,
    isCustom: true,
    config: {},
  },
  // 代码块行号
  LINE_NUMBERS: {
    name: 'line-numbers',
    plugin: lineNumbers,
    enable: true,
    isCustom: true,
    config: {},
  },
};

/**
 * 添加内置的插件
 * @param md
 */
export function injectMdPlugins(md: Md) {
  for (const plugin of Object.values(builtInPlugins)) {
    if (!plugin.enable || !plugin) return;
    if (plugin.isCustom) {
      // 自定义的插件,直接执行函数就可以
      plugin.plugin(md, plugin.config);
    } else {
      md.use(plugin.plugin, plugin.config);
    }
  }
}

/**
 * 设置内置的插件
 * @param name
 * @param enable
 * @param config
 */
export const setBuiltInPlugins = (name, config, enable = true) => {
  builtInPlugins[name].enable = enable;
  builtInPlugins[name].config = config
    ? deepMerge(builtInPlugins[name].config, config)
    : builtInPlugins[name].config;
};
