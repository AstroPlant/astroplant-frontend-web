/** Count the occurences of `characer` in `haystack`. The character to search
 * for must be a single UTF-16 code unit (one "character" in JavaScript, i.e.,
 * `character.length === 1`).
 */
export function countCharOccurrences(
  character: string,
  haystack: string,
): number {
  if (character.length !== 1) {
    throw new Error("The needle to search for must be exactly one character.");
  }

  let count = 0;

  for (const char of haystack) {
    if (character === char) {
      count += 1;
    }
  }

  return count;
}
