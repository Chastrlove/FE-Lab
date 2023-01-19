import { createLinkedHead } from "../base";

const deleteEndNode = (head, n) => {
  let fast = head;
  let slow = head;
/*  let count = 0;
  while (fast) {
    if (fast.next) {
      if (count === n) {
        break;
      }
      fast = fast.next;
      count++;
    } else {
      break;
    }
  }
  if (count < n - 1) {
    return head;
  }

  if (count === n - 1) {
    return head.next;
  }*/

  //如果只考虑n是有效场景
  // 快先走 n 步
  while(--n) {
    fast = fast.next
  }
  if(!fast.next) return head.next
  while (fast && fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return head
};

const d = deleteEndNode(createLinkedHead([1,5]), 2);
console.log(d);
