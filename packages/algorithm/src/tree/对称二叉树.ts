const isSymmetricTree = (root) => {
  if (!root) {
    return true;
  }
  const isEqual = (left, right) => {
    if (!left && !right) {
      return true;
    }
    if (!left || !right) {
      return false;
    }
    return (
      left.value === right.value &&
      isEqual(left.left, right.right) &&
      isEqual(left.right, right.left)
    );
  };
  return isEqual(root.left, root.right);
};


const isSymmetric = function(root) {
  if(!root) return true
  let stack = [root.left, root.right]
  while(stack.length) {
    let right = stack.pop()
    let left = stack.pop()
    if(left && right) {
      if(left.value !== right.value) return false
      stack.push(left.left)
      stack.push(right.right)
      stack.push(left.right)
      stack.push(right.left)
    } else if(left || right) {
      return false
    }
  }
  return true
};
