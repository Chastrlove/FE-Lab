import { ListNode } from "../base";

const circle = new ListNode(4);
circle.next = new ListNode(5);
circle.next = new ListNode(6, circle);

const head = new ListNode(1, new ListNode(2, new ListNode(3, circle)));

const checkLinkCircle = (headNode: ListNode) => {
  let slow = headNode;
  let fast = headNode;
  let isCircled = false;

  while (fast && fast.next) {
    //避免只有一个节点undefined===undefined
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      isCircled = true;
      break;
      // return true
    }
  }
  if (!isCircled) {
    return false;
  }
  fast = headNode;
  while (fast !== slow) {
    fast = fast.next;
    slow = slow.next;
  }
  return fast;
};

console.log(checkLinkCircle(head));
