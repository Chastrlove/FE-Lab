/**
 * LRU，最近最少使用，把数据加入一个链表中，按访问时间排序，发生淘汰的时候，把访问时间最旧的淘汰掉。
 */

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.capacity = capacity;
  this.queue = new Map();
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  const value = this.queue.get(key);
  if (typeof value !== 'undefined') {
    this.queue.delete(key);
    this.queue.set(key, value);
    return value;
  }
  return -1;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  if (!this.queue.has(key)) {
    if (this.queue.size == this.capacity) {
      const deleteKey = this.queue.keys().next().value;
      this.queue.delete(deleteKey);
    }
    this.queue.set(key, value);
    return;
  }
  this.queue.delete(key);
  this.queue.set(key, value);
};

var obj = new LRUCache(2);
obj.put(2, 6);
obj.put(1, 1);
obj.put(2, 3);
obj.put(4, 1);
console.log(obj.get(1));
console.log(obj.get(2));
