import { createLinkedHead, ListNode } from "../base";

export const mergeKLinks = (lists) => {
  let preHead = new ListNode(-1);
  for (let index in lists) {
    let linkHead = lists[index];
    let prev = preHead;
    if (Number(index) === 0) {
      prev.next = linkHead;
    }else{
      while (linkHead && prev){
        if(!prev.next){
          prev.next = linkHead;
          break;
        }
        if(linkHead.val> (prev.next?.val ?? -1)){
          prev = prev.next
        }else{
          const linkHeadNext = linkHead.next;
          linkHead.next = prev.next;
          prev.next = linkHead;
          linkHead = linkHeadNext;
          prev = prev.next
        }
      }
    }
  }
  return preHead.next
}

mergeKLinks([createLinkedHead([1,4,5]),createLinkedHead([1,3,4]),createLinkedHead([2,6])])

