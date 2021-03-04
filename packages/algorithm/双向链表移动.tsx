class ListNode {
    constructor(key, value) {
        this.value = value;
        this.key = key;
        this.next = null;
        this.prev = null;
    }
}

class LRUCache1 {
    constructor(capacity) {
        this.capacity = capacity;
        this.hash = {};
    }
    curPoint = null;
    get(key) {
        if (this.hash[key]) {
            this.moveToHead(key);
            return this.hash[key].value;
        }
        return -1;
    }
    set(key, value) {
        const curNode = new ListNode(key, value);
        this.hash[key] = curNode;
        this.addToHead(curNode)
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
    moveToHead(key) {
        if(key === this.curPoint.key){
            return
        }
        const accessNode = this.hash[key];
        accessNode.prev.next = accessNode.next;
        accessNode.next.prev = accessNode.prev;
        accessNode.next = this.curPoint.next;
        this.curPoint.next.prev = accessNode;
        this.curPoint.next = accessNode;
        accessNode.prev = this.curPoint;
        this.curPoint = accessNode;
    }
}

const aa = new LRUCache1(2);

aa.set("a", "1");

aa.set("b", "2");
aa.set("c", "3");


aa.get("b");

console.log(aa);
