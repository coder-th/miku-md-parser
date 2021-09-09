import { Md } from '@type/md';
import itContainer from 'markdown-it-container';
/**
 * 自定义容器
 * @param md
 */
function addMdContainer(md: Md) {
  md.use(itContainer, 'spoiler', {
    // 自定义块容器

    validate: function (params) {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },

    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';
      } else {
        // closing tag
        return '</details>\n';
      }
    },
  });
}
export default addMdContainer;
