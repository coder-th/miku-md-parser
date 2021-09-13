import { IParser } from '../types/md';
import { extendCopy, CopyClassName } from './copy';
import { extendToc } from './toc';
/**
 * 给Md渲染器扩展功能模块
 */
export function extendMd(config: IParser) {
  extendCopy(CopyClassName, config.copy);
  extendToc(config.toc);
}
