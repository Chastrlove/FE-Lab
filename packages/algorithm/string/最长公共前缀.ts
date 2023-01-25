const longestCommonPrefix = function(strs) {
  if (strs === null || strs.length === 0) return "";
  if(strs.length === 1) return strs[0]
  let min = 0, max = 0
  for(let i = 1; i < strs.length; i++) {
    //字符串比大小会比各个字符 “ac”>"abcd"
    if(strs[min] > strs[i]) min = i
    if(strs[max] < strs[i]) max = i
  }
  for(let j = 0; j < strs[min].length; j++) {
    if(strs[min].charAt(j) !== strs[max].charAt(j)) {
      return strs[min].substring(0, j)
    }
  }
  return strs[min]
};

const prefix = longestCommonPrefix(["ab","abcb","ac"]);
console.log(prefix)
