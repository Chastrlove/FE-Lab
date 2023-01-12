/**
 * 栈版本
 * @param value
 * @constructor
 */

function TreeNode(value) {
  this.value = value;
  this.left = this.right = null;
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.left.right.left = new TreeNode(6);
root.left.right.right = new TreeNode(7);

const preOrder = (root) => {
  const stack = [];
  // root && stack.push(root);
  // let p;
  // while (stack.length) {
  //     p = stack.pop();
  //     visit(p);
  //     p.right && stack.push(p.right);
  //     p.left && stack.push(p.left);
  // }

  let cur = root;
  while (cur || stack.length > 0) {
    if (cur) {
      console.log(cur.value);
      stack.push(cur);
      cur = cur.left;
    } else {
      cur = stack.pop();
      cur = cur.right;
    }
  }
};

// console.log("前序");
// preOrder(root);

const inOrder = (root) => {
  let cur = root;
  const stack = [];
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

// console.log("中序");
// inOrder(root);

/**
 * Given a binary tree, return the post-order traversal of its nodes' values
 * @param root - The root node of the binary tree.
 */
const postOrder = (root) => {
  const stack = [];
  const result = [];
  stack.push(root);
  while (stack.length > 0) {
    const cur = stack.pop();
    result.push(cur.value);
    cur.left && stack.push(cur.left);
    cur.right && stack.push(cur.right);
  }
  while (result.length > 0) {
    console.log(result.pop())
  }
};

function PostOrder2(T, visit = x => console.log(x.val)) {
  const stack = [];
  let p = T, pre = null;
  while (stack.length || p) {
    if (p) {
      stack.push(p)
      p = p.left;
    } else {
      p = stack.pop();
      if (!p.right || p.right === pre) {//没有右子树或刚访问过右子树
        visit(p);
        pre = p
        p = null;
      } else {//有右子树并且没有访问
        stack.push(p);
        stack.push(p.right);//右子树入栈
        p = p.right.left;//转向右子树的左子树
      }
    }
  }
}


console.log("后序");
postOrder(root);
