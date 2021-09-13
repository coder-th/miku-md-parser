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
/**
 * 防抖函数
 * @param func 执行函数
 * @param delay 延迟时间 ms
 * @param immediate 是否立即执行
 */
export function debounce(func: Function, delay = 200, immediate = false): Function {
  let timer: number | undefined;

  return function (this: unknown, ...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    if (immediate) {
      func.apply(that, args); // 确保引用函数的指向正确，并且函数的参数也不变
      immediate = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(that, args);
    }, delay) as unknown as number;
  };
}
