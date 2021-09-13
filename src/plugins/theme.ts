import { CopyClassName } from '../extends/copy';

const COLOR_MAP = {
  bg: '--bg-color',
  border: '--border-color',
  font: '--font-color',
  grid: '--grid-color',
};
const BuiltInTheme = {
  red: { font: '#f5222d', bg: '#fff5f5', border: '#ff4d4f', grid: 'rgba(255,197,193,0.2)' },
  orange: { font: '#ff7a45', bg: '#fff2e8', border: '#fa541c', grid: 'rgba(255,211,185,0.15)' },
  yellow: { font: '#ffc53d', bg: '#fffbe6', border: '#faad14', grid: 'rgba(255,226,139,0.2)' },
  green: { font: '#73d13d', bg: '#f6ffed', border: '#52c41a', grid: 'rgba(170,233,137,0.2)' },
  cyan: { font: '#36cfc9', bg: '#e6fffb', border: '#13c2c2', grid: 'rgba(167,244,233,0.2)' },
  blue: { font: '#40a9ff', bg: '#e6f7ff', border: '#1890ff', grid: 'rgba(174,227,253,0.2)' },
  purple: { font: '#f759ab', bg: '#fff0f6', border: '#eb2f96', grid: 'rgba(255,208,227,0.2)' },
};
export type MdThemeType = keyof typeof BuiltInTheme;
/**
 * 切换主题颜色
 * @param type
 */
export function changeTheme(type: MdThemeType) {
  const docEle = document.documentElement;
  for (const key of Object.keys(COLOR_MAP)) {
    docEle.style.setProperty(COLOR_MAP[key], BuiltInTheme[type][key]);
  }
}
/**
 * 用户切换自定义主题
 * @param config
 */
export function changeCustomTheme(config: typeof BuiltInTheme[MdThemeType]) {
  const docEle = document.documentElement;
  for (const key of Object.keys(config)) {
    docEle.style.setProperty(COLOR_MAP[key], config[key]);
  }
}
/**
 * 用户修改内置主题颜色
 * @param type
 * @param config
 */
export function setBuiltInTheme<T extends MdThemeType, U extends typeof BuiltInTheme[MdThemeType]>(
  type: T,
  config: Partial<U>
) {
  for (const key of Object.keys(config)) {
    if (Object.prototype.hasOwnProperty(type)) {
      // 用户修改的内置的主题
      BuiltInTheme[type as MdThemeType][key] = config[key];
    }
  }
}
/**
 * 初始化主题
 * @param htmlStr
 * @param type
 * @returns
 */
export function initTheme(htmlStr: string, type: MdThemeType) {
  if (htmlStr) {
    htmlStr = htmlStr
      .replace(/\<code\>/gi, (val) => {
        return `<code class="md-single-code">`;
      })
      .replace(/\<img/gi, (val) => {
        return `<img style="max-width: 100%;" `;
      })
      .replace(/\<blockquote/gi, (val) => {
        return `<blockquote class="md-blockquote"`;
      })
      .replace(/\<table/gi, (val) => {
        return `<table class="md-table"`;
      })
      .replace(/\<hr/gi, (val) => `<hr class="md-hr"`)
      .replace(/\<a\s/gi, () => `<a class="md-wave"`);
    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlStr, 'text/html');
    htmlStr = prettierCode(dom);
    // 设置默认主题
    changeTheme(type);
  }

  return htmlStr;
}
/**
 * 美化代码区块
 * @param document
 * @returns
 */
function prettierCode(document: Document): string {
  document.querySelectorAll<HTMLElement>('pre').forEach((blockPre) => {
    let lang = 'markdown';
    const block = blockPre.children[0] as HTMLElement;
    block.className.replace(/(?:(hljs language-))(\w+)/gi, (...args: any[]) => {
      lang = args[2];
      return args[0];
    });
    block.style.padding = '40px 15px 10px 0';
    block.style.borderRadius = '5px';
    blockPre.className = 'md-pre-block';
    blockPre.dataset.lang = lang;
    const copyELe = document.createElement('span');
    copyELe.innerText = lang;
    copyELe.className = CopyClassName;
    copyELe.dataset.lang = lang;
    blockPre.appendChild(copyELe);
    const beautifyEle = document.createElement('div');
    beautifyEle.className = 'md-ting';
    ['red', 'yellow', 'green'].forEach((className) => {
      const span = document.createElement('span');
      span.className = className;
      beautifyEle.appendChild(span);
    });
    blockPre.appendChild(beautifyEle);
  });
  return document.body.innerHTML;
}
