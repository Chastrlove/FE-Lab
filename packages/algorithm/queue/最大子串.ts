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
      //要注意 最大子串的窗口移动，是将start移动到前面重复的char的索引+1上
      start = Math.max(start, charIndex + 1);
    }
    ans =  Math.max(ans, i -  start + 1 )
    charIndexMap.set(char, i);
  }
  return ans
};

const lengthOfLongestSubstring1 = function(s:string) {
  let arr:string[] = [], max = 0,maxSubString=""
  for(let i = 0; i < s.length; i++) {
    let index = arr.indexOf(s[i])
    if(index !== -1) {
      arr.splice(0, index+1); //滑动窗口
    }
    arr.push(s.charAt(i));
    if(arr.length>max){
      maxSubString = arr.join("")
    }
    max = Math.max(arr.length, max);
  }
  return max
};
lengthOfLongestSubstring1("abcdbcbb")

// lengthOfLongestSubstring("abcdbcbb");
