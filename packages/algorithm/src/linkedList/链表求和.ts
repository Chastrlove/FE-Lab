import { createLinkedHead, ListNode } from "../base";

//从个位往上
const sum = (left, right) => {
  const preHead = new ListNode(-1);
  let prev = preHead;
  let add = 0;
  while (left || right) {
    const value = (left?.val ?? 0) + (right?.val ?? 0) + add;
    const newNode = new ListNode(value % 10);
    add = Math.floor(value / 10);
    prev.next = newNode;
    prev = prev.next;
    if (left) {
      left = left.next;
    }
    if (right) {
      right = right.next;
    }
  }
  if (add) {
    prev.next = new ListNode(add);
  }
  return preHead.next;
};


const node1 = createLinkedHead([7, 1, 6]);
const node2 = createLinkedHead([5, 9, 2]);

sum(node1, node2);
