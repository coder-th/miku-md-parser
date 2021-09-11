import { extendCopy, CopyClassName } from './copy';
/**
 * 给Md渲染器扩展功能模块
 */
export function extendMd() {
  extendCopy(CopyClassName);
}
