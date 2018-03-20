/**
 * @file Appends a zero-width space character (\U200B) after every occurence of
 *       `delimiter` in `inputString`. This is done so that the browser will know
 *       where to break a long string in case it needs to be wrapped in an element.
 * @module lineBreakIt
 * @author Zhong-yuen Lee <z.y.lee@soton.ac.uk>
 * @param inputString The arbitrarily-long string to sprinkle zero-width spaces on
 * @param delimiter   The delimiter for this function to look for. Zero-width spaces
 *                    will be appended to every occurence of this delimiter
 * @return The string `inputString` with a zero-width space after every `delimiter`
 *         character
 */
export default function(inputString: string, delimiter: string | RegExp) {
  if (typeof delimiter === "string") {
    return inputString.split(delimiter).join(`${delimiter}\u200b`);
  } else if (delimiter instanceof RegExp) {
    // Our 'cursor' to keep track of the position of the last found delimiter in the
    // input string
    let prevIndex = 0;
    let execResult: RegExpExecArray | null;
    let r = '';
    while ((execResult = delimiter.exec(inputString)) !== null) {
      // Extract each new chunk of text between the next found pair of delimiters,
      // append zero-width space, then add to result
      r += inputString.slice(prevIndex, execResult.index + 1) + '\u200b';
      // Set our cursor's position to the current delimiter's position
      prevIndex = execResult.index + 1;
    }
    return r + inputString.slice(prevIndex, inputString.length);
  }
  return `Delimiter type ain't right. Expected string or RegExp. Got ${typeof delimiter}`;
}
