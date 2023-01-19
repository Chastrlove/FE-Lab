import { createLinkedHead, ListNode } from "../base";
import { mergeLink } from "./合并链表";
const mergeLinkNodes = (lists: ListNode[]) => {
  const length = lists.length;
  if(length===0){
    return null;
  }
  if (length === 1) {
    return lists[0];
  }
  const middle = Math.floor((length + 1) / 2);
  const node1 = mergeLinkNodes(lists.slice(0, middle));
  const node2 = mergeLinkNodes(lists.slice(middle, length));
  return mergeLink(node1, node2);
};

mergeLinkNodes([
  createLinkedHead([1, 4, 5]),
  createLinkedHead([1, 3, 4]),
  createLinkedHead([2, 6]),
]);
