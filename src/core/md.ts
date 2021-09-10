import markdownIt from 'markdown-it';
import { injectMdPlugins, setBuiltInPlugins } from '../plugins';
import { createMdContainer } from '../plugins/container';
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
  (md as Md)._render = false; // 标识是否已经渲染
  _globalData.md = md as Md;
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
    // 添加内置的插件
    injectMdPlugins(md);
    const html = md.render(`${source}`) as string;
    const { toc } = config;
    let tocStr = '';
    if (toc.enable) {
      const parser = new DOMParser();
      const dom = parser.parseFromString(md.render(`[[toc]]${source}`), 'text/html');
      tocStr = (dom.childNodes[0] as HTMLDivElement).getElementsByClassName('table-of-contents')[0]
        .innerHTML;
    }
    md._render = true;
    md.html = html;
    md.toc = tocStr;
    md.createMdContainer = createMdContainer;

    return md;
  }
  /**
   * 用户集成更过Markdown插件
   * @param this
   * @param fn
   * @returns
   */
  function addPlugin(this: any, fn: (md: Md) => Md | void) {
    if (isRender(md)) return this;
    fn(md);
    return this;
  }
  md.addPlugin = addPlugin;
  md.renderMd = renderMd;
  md.setPlugin = function (this, name, config, enable) {
    if (isRender(md)) return this;
    setBuiltInPlugins(name, config, enable);
    return this;
  };

  return md;
}

/**
 * 获取当前的渲染器
 * @returns
 */
export function getCurrentMd() {
  return _globalData.md;
}
