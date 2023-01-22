const group = new Map([
  [")","("],
  ["]","["],
  ["}","{"]
])
const isValid = function(s) {
  const stack:string[] = []
  for(let i of s){
    if(group.has(i)){
      const prev = stack.pop();
      if(group.get(i) !== prev){
        return false
      }
    }else{
      stack.push(i);
    }

  }
  return stack.length === 0
};

console.log(isValid("()[]{}{"));
console.log(isValid("([]{}){}"))

