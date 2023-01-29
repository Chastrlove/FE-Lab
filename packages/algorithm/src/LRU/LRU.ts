/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.kVMap = {};
  this.capacity = capacity
  this.currentCapcity = 0;
  this.head = new CacheNode(); //最新的数据
  this.tail = new CacheNode(); //最老的数据
  this.head.next = this.tail;
  this.tail.prev = this.head;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  const node = this.kVMap[key]
  if(!node) return -1;
  this.deleteNode(node)
  this.appendToHead(node)
  return node.value
};


LRUCache.prototype.deleteNode = function(deleteNode){
  const nextNode = deleteNode.next;
  const prevNode = deleteNode.prev
  prevNode.next = nextNode ;
  nextNode.prev = prevNode
}

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  let existNode =  this.kVMap[key];
  if(!existNode){
    if(this.currentCapcity >= this.capacity){
      this.removeTail()
      this.currentCapcity--
    }
    const newNode = new CacheNode(key,value)
    this.appendToHead(newNode)
    this.kVMap[key] = newNode
    this.currentCapcity++
  }else {
    existNode.value = value;
    this.deleteNode(existNode)
    this.appendToHead(existNode)
  }

};

LRUCache.prototype.removeTail=function(){
  const tailNode = this.tail.prev
  this.deleteNode(tailNode);
  delete this.kVMap[tailNode.key]
}

LRUCache.prototype.appendToHead=function(node){
  this.head.next.prev = node
  node.next = this.head.next
  this.head.next = node
  node.prev = this.head;
}


class CacheNode{
  constructor(key,value){
    this.value = value;
    this.key = key;
    this.prev = null,
    this.next = null
  }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
var obj = new LRUCache(1);
obj.put(2, 1);
console.log(obj.get(2));
