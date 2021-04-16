/**
 * 递归版本
 * @param value
 * @constructor
 */

function TreeNode(value) {
  this.value = value;
  this.left = this.right = null;
}

function traversal(root) {
  console.log(root.value); //前序遍历
  if (root.left) {
    traversal(root.left);
  }
  // console.log(root.value); //中序遍历
  if (root.right) {
    traversal(root.right);
  }
  // console.log(root.value); //后序遍历
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
traversal(root);
