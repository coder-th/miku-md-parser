import markdownIt from 'markdown-it';
export type Md = markdownIt & {
  _render: boolean;
};
export interface IParser {
  lineNumbers?: boolean;
  toc: {
    enable: boolean;
  };
}
