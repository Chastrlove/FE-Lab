/**
 * 迭代版本
 * @param value
 * @constructor
 */

import { createTreeNode, TreeNode } from "../base";

const root = createTreeNode();
//   1
// 2   3
//4 5 6 7

const preOrderTraverse = (root: TreeNode) => {
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    console.log(node?.value);
    if (node?.right) {
      stack.push(node.right);
    }
    if (node?.left) {
      stack.push(node.left);
    }
  }
};

const inOrderTraverse = (root: TreeNode) => {
  const stack = [];
  let cur = root;
  while (stack.length > 0 || cur) {
    if (cur) {
      stack.push(cur);
      cur = cur.left;
    } else {
      cur = stack.pop();
      console.log(cur.value);
      cur = cur.right;
    }
  }
};

//   1
// 2   3
//4 5 6 7

/*2 3    ->3
2 6 7  ->7*/
// 遍历顺序为根右左 ，最后倒序就得到左右根
const postOrderTraverse = (root: TreeNode) => {
  const stack = [root];
  const res = []
  while (stack.length > 0) {
    const node = stack.pop();
    res.push(node.value)
    if (node?.left) {
      stack.push(node.left);
    }
    if (node?.right) {
      stack.push(node.right);
    }
  }
 while(res.length){
    console.log(res.pop())
 }
};

inOrderTraverse(root);
