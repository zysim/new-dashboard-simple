export default function(inputText: string, delimiter: string | RegExp) {
  if (typeof delimiter === "string") {
    return inputText.split(delimiter).join(`${delimiter}\u200b`);
  } else if (delimiter instanceof RegExp) {
    let prevIndex = 0;
    let execResult: RegExpExecArray | null;
    let r = '';
    while ((execResult = delimiter.exec(inputText)) !== null) {
      r += inputText.slice(prevIndex, execResult.index + 1) + '\u200b';
      prevIndex = execResult.index + 1;
    }
    return r + inputText.slice(prevIndex, inputText.length);
  }
  return `Delimiter type ain't right. Expected string or RegExp. Got ${typeof delimiter}`;
}
