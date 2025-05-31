/**
 * Replaces the start of a string if it matches a pattern
 * @param target The string to modify
 * @param pattern The pattern to match at the start of the string
 * @param prefix The string to prepend to the modified string
 * @returns The modified string if pattern matches, otherwise the original string
 */
export function leftReplacer(
  target: string,
  pattern: string,
  prefix: string = ''
): string {
  let i: number;
  for (i = 0; i < pattern.length; i++) {
    if (target[i] !== pattern[i]) {
      return target;
    }
  }
  return prefix + target.slice(i);
}
