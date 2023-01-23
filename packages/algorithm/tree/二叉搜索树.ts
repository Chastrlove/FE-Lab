//二叉搜索树中第K小的元素
//二叉搜索树的中序遍历对于搜索树来说刚好是从打大小的排列

import { createTreeNode, levelOrderCreateTree } from "../base";

const getK = (root, k) => {
  const stack = [];
  let cur = root;
  let count = 0
  while (stack.length || cur) {
    if (cur) {
      stack.push(cur);
      cur = cur.left;
    } else {
      cur = stack.pop();
      count++
      if(count===k){
        console.log('k:',cur.value);
      }
      console.log(cur.value);
      cur = cur.right;
    }
  }
};

const root = levelOrderCreateTree([3,1,4,null,2]);

getK(root,1);

