class ListNode {
  constructor(key, value) {
    this.value = value;
    this.key = key;
    this.next = null;
    this.prev = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.hash = {};
    this.count = 0;
    //this.curPoint指向最新的节点，this.curPoint.next指向最老的节点
    this.curPoint= null
  }
  get(key) {
    const node = this.hash[key]
    if (node) {
      this.moveToHead(node);
      return node.value;
    }
    return -1;
  }
  put(key, value) {
    const node = this.hash[key];
    if (node) {
      node.value = value;
      this.moveToHead(node);
      return;
    }
    if (this.count=== this.capacity) {
      this.deleteCache();
    }
    const curNode = new ListNode(key, value);
    this.hash[key] = curNode;
    this.addToHead(curNode)
    this.count++
  }

  addToHead(curNode){
    if (this.curPoint) {
      curNode.next = this.curPoint.next;
      this.curPoint.next.prev = curNode;
      this.curPoint.next = curNode;
      curNode.prev = this.curPoint;
    } else {
      curNode.next = curNode;
      curNode.prev = curNode;
    }
    this.curPoint = curNode;
  }
  moveToHead(accessNode) {
    if(accessNode.key === this.curPoint.key){
      return
    }
    accessNode.prev.next = accessNode.next;
    accessNode.next.prev = accessNode.prev;
    accessNode.next = this.curPoint.next;
    this.curPoint.next.prev = accessNode;
    this.curPoint.next = accessNode;
    accessNode.prev = this.curPoint;
    this.curPoint = accessNode;
  }
  deleteCache(){
    let oldestKey = this.popTail()
    delete this.hash[oldestKey]
    this.count--
  }
  popTail() {
    const rmKey= this.curPoint.next.key
    this.curPoint.next.next.prev=this.curPoint
    this.curPoint.next = this.curPoint.next.next;
    return rmKey
  }
}

const aa = new LRUCache(2);

aa.put(2, 1);
aa.put(3, 2);

aa.get(3);
aa.get(2);
aa.put(4, 3);
aa.get(2);
aa.get(3);
aa.get(4);

