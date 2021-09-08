import markdownIt from 'markdown-it';
declare global {
  type Md = markdownIt & {
    _render: boolean;
  };
  interface IParser {
    lineNumbers?: boolean;
    toc: {
      enable: boolean;
    };
  }
}
