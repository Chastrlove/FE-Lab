const permutation = (input) => {
  const backtrack = (list, index) => {
    if (index === list.length - 1) {
      return [[list[index]]];
    }
    const content = backtrack(list, index + 1);
    const temp = [];
    const size = content[0].length;
    for (let i = 0; i < content.length; i++) {
      for (let j = 0; j <= size; j++) {
        const clone = [...content[i]];
        clone.splice(j, 0, list[index]);
        temp.push(clone);
      }
    }
    return temp;
  };

  return backtrack(input, 0);
};

const swap = (arr, i, j) => {
  if (i != j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

const permute = function (input) {
  const res = [];
  const backtrack = (list, depth, res) => {
    if (depth === list.length - 1) {
      res.push([...list]);
      return;
    }
    for (let i = depth; i < list.length; i++) {
      swap(list, i, depth);
      //这里一定要是depth+1，而不是i+1, 因为第一次循环交换完之后，其实同层级的排列还没做完
      backtrack(list, depth + 1, res);
      swap(list, i, depth);
    }
  };
  backtrack(input, 0, res);
  return res;
};

console.log(permutation([1, 2, 3]));
