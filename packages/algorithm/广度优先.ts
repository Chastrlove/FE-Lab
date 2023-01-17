function TreeNode(value) {
  this.value = value;
  this.left = this.right = null;
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(7);

const bfsDepth = (root,searchDepth) => {
  const stack = [root];
  const res = [];
  let depth = 0
  while (stack.length > 0) {
    const temp = [];
    //获取该层级的节点数
    const length  = stack.length;
    if(searchDepth === depth){
      console.log(length)
    }
    for (let i = 0; i < length; i++) {
      const node = stack.shift();
      temp.push(node.value);
      if (node.left) {
        stack.push(node.left);
      }
      if (node.right) {
        stack.push(node.right);
      }
    }
    res.push(temp);
    depth++
  }
  return res
};

const bfs = (root) => {
  const stack = [root];
  while (stack.length > 0) {
    console.log(stack.length);
    const node = stack.shift();

    if (node.left) {
      stack.push(node.left);
    }
    if (node.right) {
      stack.push(node.right);
    }
  }
};

const a = bfsDepth(root,1);
console.log(a)
