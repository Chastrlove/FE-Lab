import { createLinkedHead, ListNode } from "./base";

export const mergeLink = (list1, list2) => {
  let head = new ListNode(-1);
  let prev = head;
  while (list2 || list1) {
    if (list1 && list2) {
      if (list1.val > list2.val) {
        prev.next = list2;
        list2 = list2.next;
      } else {
        prev.next = list1;
        list1 = list1.next;
      }
      prev = prev.next;
    } else if (list2) {
      prev.next = list2;
      break;
    } else {
      prev.next = list1;
      break;
    }
  }
  return head.next;
};

console.log(mergeLink(createLinkedHead([1, 2, 4]), createLinkedHead([1, 3, 4])));
