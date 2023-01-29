import { createLinkedHead } from "../base";

const node = createLinkedHead([1, 2, 3, 4, 5, 6]);

const getMiddleNode = (head) => {
  let fast = head;
  let slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
  }
  return slow
};
getMiddleNode(node)
