export function isRender(md) {
  if (md._render) {
    console.warn('您当前已经渲染了，请在`render`之前添加该插件');
    return true;
  }
  return false;
}
