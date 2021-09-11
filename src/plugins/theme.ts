const COLOR_MAP = {
  bg: '--bg-color',
  border: '--border-color',
  font: '--font-color',
};
const BuiltInTheme = {
  red: { font: '#f5222d', bg: '#fff5f5', border: '#ff4d4f' },
  orange: { font: '#ff7a45', bg: '#fff2e8', border: '#fa541c' },
  yellow: { font: '#ffc53d', bg: '#fffbe6', border: '#faad14' },
  green: { font: '#73d13d', bg: '#f6ffed', border: '#52c41a' },
  cyan: { font: '#36cfc9', bg: '#e6fffb', border: '#13c2c2' },
  blue: { font: '#40a9ff', bg: '#e6f7ff', border: '#1890ff' },
  purple: { font: '#f759ab', bg: '#fff0f6', border: '#eb2f96' },
};
export type MdThemeType = keyof typeof BuiltInTheme;
/**
 * 切换主题颜色
 * @param type
 */
export function changeTheme(type) {
  const docEle = document.documentElement;
  for (const key of Object.keys(COLOR_MAP)) {
    docEle.style.setProperty(COLOR_MAP[key], BuiltInTheme[type][key]);
  }
}
/**
 * 用户修改或者自定义主题颜色
 * @param type
 * @param config
 */
export function setTheme<
  T extends MdThemeType | 'custom',
  U extends typeof BuiltInTheme[MdThemeType]
>(type: T, config: U) {
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
      });
    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlStr, 'text/html');
    htmlStr = prettierCode(dom);
    // 设置默认主题
    changeTheme(type);
  }

  return htmlStr;
}
function prettierCode(document: Document): string {
  document.querySelectorAll<HTMLElement>('pre').forEach((blockPre) => {
    let lang = 'markdown';
    const block = blockPre.children[0] as HTMLElement;
    block.className.replace(/(?:(hljs language-))(\w+)/gi, (...args: any[]) => {
      lang = args[2];
      return args[0];
    });
    blockPre.style.position = 'relative';
    blockPre.style.fontSize = '15px';
    blockPre.style.borderRadius = '5px';
    blockPre.style.padding = '1em';
    blockPre.className = 'hljs';
    blockPre.style.backgroundColor = block.style.backgroundColor;
    blockPre.dataset.lang = lang;
    const copyELe = document.createElement('span');
    copyELe.innerText = lang;
    copyELe.style.position = 'absolute';
    copyELe.style.top = '10px';
    copyELe.style.right = '10px';
    copyELe.style.cursor = 'pointer';
    copyELe.className = 'copy';
    copyELe.dataset.lang = lang;
    blockPre.appendChild(copyELe);
  });
  return document.body.innerHTML;
}
