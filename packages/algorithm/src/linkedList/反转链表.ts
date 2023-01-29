import { createLinkedHead } from "../base";

const reverseLink = (head) => {
  if (!head || !head.next) {
    return head;
  }
  const next = head.next;
  const prev = reverseLink(next);
  next.next = head;
  head.next = null;
  return prev;
};

const head = createLinkedHead([1, 2,3,4,5,6]);
const c = reverseLink(head);
console.log(c);
