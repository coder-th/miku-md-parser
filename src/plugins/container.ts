import { BaseType, Md } from '../types/md';
import itContainer from 'markdown-it-container';
import { isRegExp } from '../utils/is';

/**
 * 创建自定义容器
 * @param md
 */
export const createMdContainer: Md['createMdContainer'] = function (md, config) {
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
};
/**
 * 创建基础的容器(内置)
 */
export function createBaseContainer(md, config) {
  // 与用户配置的自定义插件合并
  const baseType = (['success', 'warning', 'error', 'tips', 'spoiler'] as BaseType[]).filter(
    (item) => config.use.includes(item)
  );
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
    createMdContainer<BaseType>(md, { type, validate, render });
  });
}
