import { ListNode } from '../base';

/**
 * Merge two sorted linked lists
 * @param {ListNode} l1 - The first node of a linked list.
 * @param {ListNode} l2 - The second linked list.
 * @returns The head of the merged list.
 */
const mergeLinkNode = (l1: ListNode, l2: ListNode) => {
  const dummyHead = new ListNode(-1);
  let current = dummyHead;
  while (l1 !== null && l2 !== null) {
    if (l1.val < l2.val) {
      current.next = l1;
      l1.next = l1.next.next;
    } else {
      current.next = l2;
      l2.next = l2.next.next;
    }
    current = current.next
  }
  current.next = l1 === null ? l2 : l1;
  return dummyHead.next;
};
