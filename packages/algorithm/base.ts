export class ListNode {
  public val: number;
  public next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

export const createLinkedHead = (input: Array<number>) => {
  let head = null;
  let ans = null;
  for (let c of input) {
    const node = new ListNode(c);
    if (head) {
      ans.next = node;
      ans = ans.next;
    } else {
      head = node;
      ans = head;
    }
  }
  return head;
};
