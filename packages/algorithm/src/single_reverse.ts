/**
 * 单链表翻转
 */

import { ListNode } from "./base";

//双指针
const reverseLinkNode = (headNode: ListNode) => {
  let prev = null;
  let current = headNode;
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
};

//递归
const reverseLinkNode1 = (headNode: ListNode) => {
  if (headNode.next === null || headNode.val === null) {
    return headNode;
  }
  const returnNode = reverseLinkNode1(headNode.next);
  headNode.next.next = headNode;
  headNode.next = null;
  return returnNode;
};

//就地逆置法
const reverseLinkNode2 = (headNode: ListNode) => {
  let begin = headNode; //代表原有头指针
  let head = headNode; //代表翻转后的头指针
  let end = headNode.next;

  while (end !== null) {
    begin.next = end.next;
    end.next = head;
    head = end;
    end = begin.next
  }
  return head;
};

const headNode = new ListNode(
  1,
  new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5, undefined)))),
);

const c = reverseLinkNode2(headNode);
