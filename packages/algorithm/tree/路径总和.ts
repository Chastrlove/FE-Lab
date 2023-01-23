const hasPathSum = (root, sum) => {
  if (!root) {
    return false;
  }
  //这里不能直接用root.value === sum作为条件，例如
  /*   1
     2      求sum=1,root.value虽然满足，但他不是叶子节点 */
  if (root.left === null && root.right === null) return root.value === sum;
  const findValue = sum - root.value;
  const left = hasPathSum(root.left, findValue);
  const right = hasPathSum(root.right, findValue);
  if (!left && !right) {
    return false;
  }
  return true;
};
