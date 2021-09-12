import { extendCopy, CopyClassName } from './copy';
import { extendToc } from './toc';
/**
 * 给Md渲染器扩展功能模块
 */
export function extendMd() {
  extendCopy(CopyClassName);
  extendToc();
}
