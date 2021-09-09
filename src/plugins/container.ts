import { Md } from '../types/md';
import itContainer from 'markdown-it-container';
import { getCurrentMd } from '../index';
import { isRegExp } from 'src/utils/is';
type BaseType = 'success' | 'warning' | 'error' | 'tips' | 'spoiler';
interface IContainer<T> {
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

/**
 * 创建自定义容器
 * @param md
 */
export function createMdContainer<T>(config: IContainer<T>) {
  const md = getCurrentMd();
  const { type, validate, render } = config;
  if (md) {
    // 详情容器(折叠)
    md.use(itContainer, type, {
      validate: function (params) {
        if (isRegExp(validate)) {
          // 用户传了正则
          const reg = new RegExp(validate);
          return params.trim().match(reg);
        } else {
          // 用户传了函数
          return validate(params);
        }
      },
      render: function (tokens, idx) {
        return render(tokens, idx, md);
      },
    });
  } else {
    console.warn('当前您还没有调用createMdParser');
  }
}
/**
 * 创建基础的容器(内置)
 */
export function createBaseContainer() {
  const baseType: BaseType[] = ['success', 'warning', 'error', 'tips', 'spoiler'];
  baseType.forEach((type) => {
    const validate = new RegExp(`^${type}(.*)$`);
    const render = (tokens, idx, md) => {
      const m = tokens[idx].info.trim().match(validate);
      if (tokens[idx].nesting === 1) {
        if (type === 'spoiler') {
          return (
            `<details class="md-${type}"><summary>` +
            (md.utils.escapeHtml(m[1].trim()) || '点我查看详情') +
            '</summary>\n'
          );
        } else {
          return `<div class="md-${type}"><p>` + md.utils.escapeHtml(m[1].trim()) + '</p>\n';
        }
        // opening tag
      } else {
        if (type === 'spoiler') {
          // closing tag
          return '</details>\n';
        } else {
          return '</div>\n';
        }
      }
    };
    createMdContainer({ type, validate, render });
  });
}
