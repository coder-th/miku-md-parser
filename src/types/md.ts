import markdownIt from 'markdown-it';
export type Md = markdownIt & {
  _render: boolean;
  addPlugin: (fn: (md: Md) => Md | void) => Md;
  renderMd: (source: string) => { html: string; toc: string };
};
export interface IParser {
  lineNumbers?: boolean;
  toc: {
    enable: boolean;
  };
}
