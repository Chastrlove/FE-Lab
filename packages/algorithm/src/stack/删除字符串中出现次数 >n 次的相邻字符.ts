const deleteSameNString = (s, n) => {
  const stack: string[] = [];
  for (let i=0; i< s.length ;i++) {
    const char = s[i]
    const prev = stack.pop();
    if (!prev) {
      stack.push(char);
    } else {
      if (prev["0"] !== char) {
        stack.push(prev);
        stack.push(char);
      } else if(prev.length < n -1 || prev["0"] === s[i+1]) {
        //一次push多个字符
        stack.push(prev+char);
      }
    }
  }
  return stack.join("");
};

console.log(deleteSameNString("deeedbbcccbdaa", 2));
