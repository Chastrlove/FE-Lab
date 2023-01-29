import { levelOrderCreateTree } from "../base";

const isBalanceTree = (root) => {
  const isBalance = (node) => {
    if (!node) {
      return 0;
    }
    const leftDepth = isBalance(node.left);
    const rightDepth = isBalance(node.right);
    if (leftDepth === -1 || rightDepth === -1 || Math.abs(leftDepth - rightDepth) > 1) {
      return -1;
    }
    return Math.max(leftDepth, rightDepth) + 1;
  };
  return isBalance(root) !== -1;
};
//     1
//   2   2
//  3     3
// 4       4
const tree = levelOrderCreateTree([1, 2, 2, 3, null, null, 3, 4, null, null, 4]);

console.log(isBalanceTree(tree));
