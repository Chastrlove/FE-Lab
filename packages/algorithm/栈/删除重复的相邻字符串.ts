const deleteSameKString = (s, n) => {
  const stack: string[] = [];
  for (let char of s) {
    const prev = stack.pop();
    if (!prev) {
      stack.push(char);
    } else {
      if (prev["0"] !== char) {
        stack.push(prev);
        stack.push(char);
      } else if(prev.length < n -1) {
        //一次push多个字符
        stack.push(prev+char);
      }
    }
  }
  return stack.join("");
};

console.log(deleteSameKString("deeedbbcccbdaa", 2));
