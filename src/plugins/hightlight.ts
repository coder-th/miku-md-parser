import { Md } from '../types/md';
import hljs from 'highlight.js'; // 引入highlight.js库
import 'highlight.js/styles/atom-one-dark.css'; // 引入github风格的代码高亮样式
/**
 * 高亮代码块
 * @param md
 * @param code
 * @param language
 * @returns
 */
export function highlightCode(md: Md, code: string, language: string) {
  language = language ? language : 'markdown';
  if (language && hljs.getLanguage(language)) {
    try {
      return (
        `<pre><code class="hljs language-${language}">` +
        hljs.highlight(code, { language }).value +
        '</code></pre>'
      );
    } catch (__) {}
  }
  return '<pre class="hljs"><code>' + md.utils.escapeHtml(code) + '</code></pre>';
}
export type CodeTheme =
  | 'github'
  | 'dracula'
  | 'atom-one-dark'
  | 'atom-one-light'
  | 'dark'
  | 'github-dark'
  | 'idea'
  | 'xcode'
  | 'vs2015';
/**
 * 切换代码高亮的主题
 * @param codeHighLightTheme
 */
export function changeCodeTheme(codeHighLightTheme: CodeTheme) {
  const head = document.head;
  const oldLink = head.getElementsByClassName('highlightjs-style-link');

  if (oldLink.length) head.removeChild(oldLink[0]);

  const newLink = document.createElement('link');
  newLink.setAttribute('rel', 'stylesheet');
  newLink.setAttribute('type', 'text/css');
  newLink.setAttribute('class', 'highlightjs-style-link');
  newLink.setAttribute(
    'href',
    `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/${codeHighLightTheme}.min.css`
  );
  newLink.onerror = () => {
    console.error('主题获取失败，请稍后重试或尝试其它主题');
  };
  head.appendChild(newLink);
}
