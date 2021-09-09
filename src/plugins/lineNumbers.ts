// markdown-it plugin for generating line numbers.
// It depends on preWrapper plugin.

export function lineNumbers(md) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);
    const code = rawCode.slice(
      rawCode.indexOf('<code class="hljs language-'),
      rawCode.indexOf('</code>')
    );
    const lines = code.split('\n');
    let finalCode = rawCode;
    if (lines.length) {
      const firstItem = lines[0];
      const lineFirstHead = firstItem.slice(0, firstItem.indexOf('<span'));
      const lineFirstFoot = firstItem.slice(firstItem.indexOf('<span'));
      lines[0] = lineFirstFoot;
      const lineNumbersCode = lines
        .filter((item) => item)
        .map((item, index) => `<span class="line-number">${index + 1}</span>${item}<br>`);
      lineNumbersCode[0] = lineFirstHead + lineNumbersCode[0];
      finalCode = rawCode
        .replace(code, lineNumbersCode.join(''))
        .replace('extra-class', 'line-numbers-mode');
    }
    return finalCode;
  };
}
