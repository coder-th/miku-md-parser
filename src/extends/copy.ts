import ClipboardJS from 'clipboard';
type Source = string | Element | NodeListOf<Element>;
export const CopyClassName = 'md-copy';
/**
 * 添加复制功能
 * @param target
 */
export function extendCopy(target: Source) {
  setTimeout(function () {
    //这时候就渲染好了，因为该操作比较耗时，所以放在异步线程做了
    const codeBlocks = document.querySelectorAll('pre');
    if (codeBlocks.length) {
      for (const code of Object.values(codeBlocks)) {
        code.addEventListener('mouseenter', (e) => {
          setTimeout(() => {
            (e.target as any).getElementsByClassName('md-copy')[0].innerText = '点我复制';
          }, 300);
        });
        code.addEventListener('mouseleave', (e) => {
          setTimeout(() => {
            (e.target as any).getElementsByClassName('md-copy')[0].innerText = (
              e.target as any
            ).dataset.lang;
          }, 500);
        });
      }
    }
    resolveCopyEvent(target);
  }, 0);
}
/**
 * 处理复制事件
 * @param source
 */
function resolveCopyEvent(source: Source) {
  const clipboard = new ClipboardJS(
    typeof source !== 'string' ? source : source.startsWith('.') ? source : '.' + source,
    {
      target: function (trigger) {
        return trigger.previousElementSibling!;
      },
    }
  );
  clipboard.on('success', function (e) {
    const trigger = e.trigger as HTMLElement;
    addNotify('😀   复制成功  😀', 1000);
    setTimeout(() => {
      trigger.innerHTML = trigger.dataset.lang!;
    }, 3000);
    e.clearSelection();
  });
}

function addNotify(msg: string, duration = 3000) {
  const m = document.createElement('div');
  m.innerHTML = msg;
  m.className = 'md-notify';
  document.body.appendChild(m);
  setTimeout(function () {
    const d = 0.5;
    setTimeout(function () {
      document.body.removeChild(m);
    }, d * 1000);
  }, duration);
}
