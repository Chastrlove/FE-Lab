const reverseWords = function (s:string) {
  let left = 0;
  let right = s.length - 1;
  while (s.charAt(left) === " ") {
    left++;
  }
  while (s.charAt(right) === " ") {
    right++;
  }
  let queue:string[] = []
  let word = "";
  while (left <= right) {
    const char = s.charAt(left);
    if (char !== " ") {
      word = word + char;
    }else{
      queue.unshift(word);
      word= ""
    }
    left++;
  }
  queue.unshift(word);
  console.log(queue);
  return queue.join(" ")
};

reverseWords("the sky is blue");
