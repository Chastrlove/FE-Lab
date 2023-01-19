//1.遍历第一个链表，放入Map,然后遍历第二个，查看是否有重复的
//2.双指针，如果遍历的两个的链表长度一致，那么就可以同时移动，并比较

const getIntersectionNode = (head1, head2) => {
  let p1 = head1;
  let p2 = head2;
  while (p1 || p2) {
    if (p1 === p2) {
      return p1;
    }
    //如果有任意一个到达终点，他的下一个位置就是另一链表的头
    //领先的步数，就是另一条链表需要多走的节点数，当另一个指针也到达另一条链表时，他们的步伐一致了
    //图解
    //---------- -----
    //----- ----------
    p1 = !p1 ? head2 : p1.next;
    p2 = !p2 ? head1 : head2.next;
  }
  return null;
};
