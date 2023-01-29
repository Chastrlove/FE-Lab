import { levelOrderCreateTree } from "../base";

const getPath = (root, node, paths) => {
  paths.push(root);
  if (root === node) {
    return true;
  }
  if (root.left && getPath(root.left, node, paths)) {
    return true;
  }
  if (root.right && getPath(root.right, node, paths)) {
    return true;
  }
  paths.pop();
  return false;
};

const root = levelOrderCreateTree([1, 2, 3, 4, 5]);
const paths = [];
getPath(root, root?.left?.right, paths);
console.log(paths);
