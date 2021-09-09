import markdownIt from 'markdown-it';
import injectMdPlugins from '../plugins';
import { highlightCode } from '../plugins/hightlight';
import { IParser, Md } from '../types/md';
import { isRender } from '../utils/helper';

const _globalData: { md: null | Md } = {
  md: null,
};

function createMd(config: IParser): Md {
  const md = new markdownIt({
    quotes: '“”‘’',
    // 设置代码高亮的配置
    highlight: (code, lang) => {
      return highlightCode(md, code, lang);
    },
  });
  (md as Md)._render = false; // 当前已经渲染过了
  _globalData.md = md as Md;
  // 添加内置的插件
  injectMdPlugins(md);
  return md;
}
/**
 * 创建一个渲染器
 * @param source
 * @param config
 * @returns
 */
export function createMdParser(config: IParser = { toc: { enable: true } }) {
  const md = createMd(config);
  function renderMd(source: string) {
    const html = md.render(`${source}`) as string;
    const { toc } = config;
    let tocStr = '';
    if (toc.enable) {
      const parser = new DOMParser();
      const dom = parser.parseFromString(md.render(`[[toc]]${source}`), 'text/html');
      tocStr = (dom.childNodes[0] as HTMLDivElement).getElementsByClassName('table-of-contents')[0]
        .innerHTML;
    }
    return {
      html,
      toc: tocStr,
    };
  }
  function addPlugin(this: any, fn: (md: Md) => Md | void) {
    if (isRender(md)) return;
    fn(md);
    return this;
  }
  md.addPlugin = addPlugin;
  md.renderMd = renderMd;
  return md;
}
/**
 * 获取当前的渲染器
 * @returns
 */
export function getCurrentMd() {
  return _globalData.md;
}
