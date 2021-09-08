import anchorPlugin from 'markdown-it-anchor';
import tableContent from 'markdown-it-table-of-contents';
import markdownItEmoji from 'markdown-it-emoji';
import markdownItTaskList from 'markdown-it-task-lists';
import itSub from 'markdown-it-sub';
import itSup from 'markdown-it-sup';
import itIns from 'markdown-it-ins';
import itMark from 'markdown-it-mark';
import itAbbr from 'markdown-it-abbr';
/**
 * 添加内置的插件
 * @param md
 */
function addBuiltInPlugins(md: Md) {
  md.use(markdownItTaskList, { enable: true }) // 任务列表
    .use(anchorPlugin) // 文章目录路由
    .use(tableContent, { includeLevel: [2, 3, 4] }) // 文章目录级别
    .use(markdownItEmoji) // 文章表情包
    .use(itSub) // 下标
    .use(itSup) // 上标
    .use(itMark) // 标记
    .use(itAbbr) // 缩写注释
    .use(itIns) // 插入
    .use(require('markdown-it-container'), 'spoiler', {
      // 自定义块容器

      validate: function (params) {
        console.log('validate', params);

        return params.trim().match(/^spoiler\s+(.*)$/);
      },

      render: function (tokens, idx) {
        const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
        console.log('tokens', tokens);

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
export default addBuiltInPlugins;
