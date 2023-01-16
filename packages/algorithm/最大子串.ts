/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let start = 0;
  let ans = 0;
  const charIndexMap = new Map();

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    const charIndex = charIndexMap.get(char)
    if(charIndex !== undefined) {
      start = Math.max(start, charIndex + 1);
    }
    ans =  Math.max(ans, i -  start + 1 )
    charIndexMap.set(char, i);
  }
  return ans
};

lengthOfLongestSubstring("abcabcbb");
