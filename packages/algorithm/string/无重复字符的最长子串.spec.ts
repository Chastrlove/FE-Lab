import { describe, expect, it } from "vitest";

const maxUniqString = (input: string) => {
  const map = new Map();
  let startIndex = 0;
  let max = 0;
  let index = 0;
  let chars = "";
  while (index < input.length) {
    const char = input.charAt(index);
    if (map.has(char)) {
      startIndex = Math.max(map.get(char) + 1,startIndex);
    }
    map.set(char, index);
    if (index - startIndex +1 > max) {
      chars = input.substring(startIndex, index+1);
    }
    max = Math.max(index - startIndex +1, max);
    index++;
  }
  return chars;
};

describe("maxUniqString", () => {
  it("norma", () => {
    expect(maxUniqString("abcdbsa")).equal("cdbsa");
  });
});
