import markdownIt from 'markdown-it';
import { MdThemeType } from '../plugins/theme';
import { builtInPlugins } from '../plugins';
export type BaseType = 'success' | 'warning' | 'danger' | 'tip' | 'details';
export interface IContainer<T> {
  /**
   * 该容器的标识
   */
  type: T extends BaseType ? BaseType : string;
  /**
   * 该容器的验证器。当返回true的时候，才会进行render
   */
  validate: RegExp | ((params: string) => boolean);
  /**
   * 渲染函数，一定得实现
   */
  render: (tokens: string[], idx: number, md: Md) => string;
}
export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? _DeepPartialArray<U>
  : T extends object
  ? _DeepPartialObject<T>
  : T | undefined;
export type _DeepPartialArray<T> = Array<DeepPartial<T>>;
export type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };
export type Md = markdownIt & {
  _render: boolean;
  addPlugin: (fn: (md: Md) => Md | void) => Md;
  renderMd: (source: string) => { html: string; toc: string };
  setPlugin: <
    T extends typeof builtInPlugins,
    P extends keyof typeof builtInPlugins,
    U extends DeepPartial<T[P]['config']>
  >(
    this: any,
    name: P,
    config?: U,
    enable?: boolean
  ) => Md;
  createMdContainer: <T>(md: Md, config: IContainer<T>) => void;
  html: string;
  toc: string;
};
export interface IParser {
  toc: {
    enable: boolean;
  };
  theme: MdThemeType;
}
