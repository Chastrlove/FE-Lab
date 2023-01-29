import { levelOrderCreateTree, TreeNode } from "../base";
//https://www.bilibili.com/video/BV16g4y1B7hj/?vd_source=99e9fe3ac0cdf1b29c55b0fb2ef5dbc0

const lowestCommonAncestor = function (root, p, q) {
  //如果在递归的过程中发现了当前节点就是p或者q则直接返回
  if (!root || root === q || root === p) {
    return root;
  }
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  //如果左右两侧都找到了p或者q,则说明当前节点是公共父节点
  if (left && right) {
    return root;
  }
  //如果只找到了部分
  //在哪个子树找到了就返回哪个
  return left || right;
};

const root = levelOrderCreateTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
const common = lowestCommonAncestor(root, root?.left, root?.left?.right?.right);
console.log(common);
