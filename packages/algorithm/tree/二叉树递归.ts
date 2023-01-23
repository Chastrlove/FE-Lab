/**
 * 递归版本
 * @param value
 * @constructor
 */
import { createTreeNode, TreeNode } from "../base";

const root = createTreeNode();
//   1
// 2   3
//4 5 6 7
const preOrderTraverse = (node:TreeNode)=>{
  console.log(node.value);
  if(node.left){
    preOrderTraverse(node.left)
  }
  if(node.right){
    preOrderTraverse(node.right)
  }
}

const inOrderTraverse = (node:TreeNode)=>{
  if(node.left){
    inOrderTraverse(node.left)
  }
  console.log(node.value);
  if(node.right){
    inOrderTraverse(node.right)
  }
}

const postOrderTraverse = (node:TreeNode)=>{
  if(node.left){
    postOrderTraverse(node.left)
  }
  if(node.right){
    postOrderTraverse(node.right)
  }
  console.log(node.value);
}


postOrderTraverse(root)
