export class ListNode {
  public val: number;
  public next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

export const createLinkedHead = (input: Array<number>): ListNode => {
  let head = null as unknown as ListNode;
  let ans = null as unknown as ListNode;
  for (let c of input) {
    const node = new ListNode(c);
    if (head) {
      ans.next = node;
      ans = ans.next;
    } else {
      head = node;
      ans = head;
    }
  }
  return head;
};

export class TreeNode {
  public value: number;
  constructor(value) {
    this.value = value;
  }
  public left?: TreeNode;
  public right?: TreeNode;
}
//   1
// 2   3
//4 5 6 7
export const createTreeNode = () => {
  const root = new TreeNode(1);
  root.left = new TreeNode(2);
  root.right = new TreeNode(3);
  root.left.left = new TreeNode(4);
  root.left.right = new TreeNode(5);
  root.right.left = new TreeNode(6);
  root.right.right = new TreeNode(7);
  return root;
};

export function levelOrderCreateTree(arr) {
  if (arr.length === 0) return null;
  let root = new TreeNode(arr[0]);
  let queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    let current = queue.shift();
    let left = arr[i] !== null ? new TreeNode(arr[i]) : null;
    let right = arr[i + 1] !== null ? new TreeNode(arr[i + 1]) : null;
    current.left = left;
    current.right = right;
    if (left !== null) queue.push(left);
    if (right !== null) queue.push(right);
    i += 2;
  }
  return root;
}

export const swap = (array, i, j) => {
  const temp = array[j];
  array[j] = array[i];
  array[i] = temp;
};

// console.log(levelOrderCreateTree([3,5,1,6,2,0,8,null,null,7,4]))
