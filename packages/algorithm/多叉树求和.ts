function layerSum(root,searchDepth) {
  const sums = []
  let depth = 0
  const traverse = (children) => {
    const sum = children.reduce((prev, current, index) => {
      if (current.children) {
        traverse(current.children);
      }
      return prev + current.value;
    }, 0);
    sums.push(sum)
  };
  traverse([root]);
  return sums
}

const res = layerSum({
  value: 2,
  children: [
    { value: 6, children: [{ value: 1 }] },
    { value: 3, children: [{ value: 2 }, { value: 3 }, { value: 4 }] },
    { value: 5, children: [{ value: 7 }, { value: 8 }] },
  ],
},1);

console.log(res);
