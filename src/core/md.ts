import markdownIt from 'markdown-it';
import { injectMdPlugins, setBuiltInPlugins } from '../plugins';
import { createMdContainer } from '../plugins/container';
import { highlightCode } from '../plugins/hightlight';
import { initTheme } from '../plugins/theme';
import { IParser, Md } from '../types/md';
import { isRender } from '../utils/helper';
const _globalData: { md: null | Md } = {
  md: null,
};
function createMd(): Md {
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
 * 生成目录
 * @param md
 * @param toc
 * @param source
 */
function generateToc(md: Md, toc: IParser['toc'], source: string) {
  let tocStr = '';
  if (toc.enable) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(md.render(`[[toc]]${source}`), 'text/html');
    tocStr = (dom.childNodes[0] as HTMLDivElement).getElementsByClassName('table-of-contents')[0]
      .innerHTML;
  }
  md._render = true;

  md.toc = tocStr;
}
/**
 * 创建一个渲染器
 * @param source
 * @param config
 * @returns
 */
export function createMdParser(config: Partial<IParser> = {}) {
  const md = createMd();
  /**
   * 用户集成更过Markdown插件
   * @param this
   * @param fn
   * @returns
   */
  md.addPlugin = function (this, fn) {
    if (isRender(md)) return this;
    fn(md);
    return this;
  };
  /**
   * 设置插件
   * @param this
   * @param name 插件的名称
   * @param config 该插件的配置
   * @param enable 是否开启该插件(默认开启)
   * @returns
   */
  md.setPlugin = function (this, name, config, enable) {
    if (isRender(md)) return this;
    setBuiltInPlugins(name, config, enable);
    return this;
  };
  /**
   * 用户调用render得到解析后的
   * @param source
   * @param config
   * @returns
   */
  md.renderMd = function (source) {
    // 添加内置的插件
    injectMdPlugins(md);
    // 解析md字符串
    const html = md.render(`${source}`) as string;
    md.html = initTheme(`<div class="md">${html}</div>`, config.theme || 'blue');
    // 生成toc目录
    generateToc(md, config.toc || { enable: true }, source);
    md.createMdContainer = createMdContainer;
    return md;
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
