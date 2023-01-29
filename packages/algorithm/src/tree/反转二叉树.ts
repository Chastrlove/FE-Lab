const reverseBinaryTree = (root)=>{
  const temp = root.left;
  root.left = root.right;
  root.right= temp;
  if(root.left){
    reverseBinaryTree(root.left)
  }
  if(root.right){
    reverseBinaryTree(root.right)
  }
  return root
}


const reverseBinaryTree1 = (root)=>{
  const stack =[root];
  while(stack.length > 0){
    const node = stack.pop()
    const temp = node.left;
    node.left = node.right;
    node.right= temp;
    if(root.left){
      stack.push(root.left)
    }
    if(root.right){
      stack.push(root.right)
    }
  }
  return root
}
