export function extendToc() {
  setTimeout(() => {
    const nodes = document.getElementsByClassName('md-toc-li');
    for (let i = 0, len = nodes.length; i < len; i++) {
      highlightWhenClick(nodes[i], nodes);
    }
  }, 0);
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
      nodes[i].classList.remove('active');
    }
    //这里要阻止事件冒泡的进行，因为深层次的目录点击会执行父元素的事件
    e.stopPropagation();
    // 标记当前激活的元素
    ele.classList.add('active');
  });
}
