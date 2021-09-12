const headersInfo: { offsetTop: number; id: string }[] = []; // 记录每一个标题的位置和锚点
export const TocCls = {
  HEADER: 'md-h-level',
  LI: 'md-toc-li',
  ACTIVE: 'active',
  UL: 'md-toc-ul',
};
export function extendToc() {
  setTimeout(() => {
    const nodes = document.getElementsByClassName(TocCls.LI);
    for (let i = 0, len = nodes.length; i < len; i++) {
      highlightWhenClick(nodes[i], nodes);
    }
    recordHeaderInfo();
    highLightWhenScroll();
  }, 0);
}
/**
 * 记录每一个标题的位置和锚点
 * @param ele
 */
function recordHeaderInfo() {
  const headerELe = document.getElementsByClassName(TocCls.HEADER);
  for (let index = 0; index < headerELe.length; index++) {
    const ele = headerELe[index];
    headersInfo.push({ id: ele.id, offsetTop: document.getElementById(ele.id)?.offsetTop || 0 });
  }
}

/**
 * 高亮当前点击的目录
 * @param ele
 * @param nodes
 */
function highlightWhenClick(ele: Element, nodes: HTMLCollectionOf<Element>) {
  ele.addEventListener('click', (e: Event) => {
    // 移除所有的active
    for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].classList.remove(TocCls.ACTIVE);
    }
    //这里要阻止事件冒泡的进行，因为深层次的目录点击会执行父元素的事件
    e.stopPropagation();
    // 标记当前激活的元素
    ele.classList.add(TocCls.ACTIVE);
  });
}
/**
 * 滚动时高亮标题
 */
function highLightWhenScroll() {
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    for (let i = 0, len = headersInfo.length; i < len; i++) {
      if (headersInfo[i].offsetTop - scrollTop >= 0) {
        // 移除所有的active
        const nodes = document.getElementsByClassName(TocCls.LI);
        for (let j = 0, len = nodes.length; j < len; j++) {
          const href = nodes[j].getElementsByTagName('a')[0].href;
          const id = href.substr(href.indexOf('#') + 1);
          if (headersInfo[i].id === id) {
            nodes[j].classList.remove(TocCls.ACTIVE);
            nodes[j].classList.add(TocCls.ACTIVE);
          } else {
            nodes[j].classList.remove(TocCls.ACTIVE);
          }
        }
        return;
      }
    }
    // 如果走到这里，说明滚到底部了
    // 移除所有的active
    const nodes = document.getElementsByClassName(TocCls.LI);
    for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].classList.remove(TocCls.ACTIVE);
    }
    nodes[nodes.length - 1].classList.add(TocCls.ACTIVE);
  });
}
