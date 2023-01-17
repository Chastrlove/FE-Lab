const inputValue = 'abcdaaabbccccdddefgaaa';

let count = 0
const d = inputValue.replace(/(\w)\1+/g,(match,$1,index)=>{
  count++
  return $1
});

console.log(count)
console.log(d)
