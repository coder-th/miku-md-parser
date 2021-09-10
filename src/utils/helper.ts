import { isObject } from './is';

export function isRender(md) {
  if (md._render) {
    console.warn('您当前已经渲染了，请在`render`之前添加/设置该插件');
    return true;
  }
  return false;
}
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}
