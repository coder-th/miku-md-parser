/**
 * 切换主题颜色
 * @param type
 */
export function changeTheme(type) {}

export function initTheme(htmlStr: string) {
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
