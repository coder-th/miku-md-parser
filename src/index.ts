import markdownIt from 'markdown-it';
import addBuiltInPlugins from './plugins/builtIn';
import { highlightCode } from './plugins/hightlight';
import { IParser, Md } from './types/md';
/**
 * 创建一个渲染器
 * @param source
 * @param config
 * @returns
 */
export function createMdParser(config: IParser = { toc: { enable: true } }) {
  const md = new markdownIt({
    quotes: '“”‘’',
    // 设置代码高亮的配置
    highlight: (code, lang) => {
      return highlightCode(md, code, lang);
    },
  });
  md._render = false; // 当前已经渲染过了
  // 添加内置的插件
  addBuiltInPlugins(md);
  function render(source: string) {
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
  function addPlugin(fn: (md: Md) => Md | void) {
    if (md._render) {
      console.warn('您当前已经渲染了，请在`render`之前添加该插件');
      return;
    }
    fn(md);
  }

  return {
    render,
    addPlugin,
  };
}
export { changeCodeTheme } from './plugins/hightlight';
