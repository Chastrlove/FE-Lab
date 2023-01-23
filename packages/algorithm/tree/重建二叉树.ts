import { TreeNode } from "../base";
/*对于任意一颗树而言，前序遍历的形式总是
[ 根节点, [左子树的前序遍历结果], [右子树的前序遍历结果] ]
即根节点总是前序遍历中的第一个节点。而中序遍历的形式总是
[ [左子树的中序遍历结果], 根节点, [右子树的中序遍历结果] ]*/

const buildTree = (preOrder, inOrder) => {
  if (preOrder.length) {
    const head = new TreeNode(preOrder.shift());
    const index = inOrder.indexOf(head.value);
    head.left = buildTree(preOrder.slice(0, index), inOrder.slice(0, index));
    // ************此处不需要+1，是因为已经shift过了
    head.right = buildTree(preOrder.slice(index), inOrder.slice(index + 1));
    return head;
  }
  return null;
};
//   1
// 2   3
//4 5 6 7
const preorder = [1, 2, 4, 5, 3, 6, 7];
const inorder = [4, 2, 5, 1, 6, 3, 7];
const root =buildTree(preorder, inorder);
console.log(root)
