import { maxHeapify } from "./堆化";
import { MaxHeap } from "./maxHeap";
import { MinHeap } from "./minHeap";

const input = [1, 2, 4, 5, 6, 8, 9, 13,1];

class MiddleFinder {
  // 大顶堆，用来保存前 n/2 小的元素
  public maxHeap = new MaxHeap();
  // 小顶堆，用来保存后 n/2 小的元素
  public minHeap = new MinHeap();

  public addNum = (num) => {
    const minHead = this.minHeap.getHead(); //小顶堆的最小值
    if (!this.maxHeap.heap.length || (minHead !== null && num < minHead)) {
      this.maxHeap.insert(num);
    } else {
      this.minHeap.insert(num);
    }
    const leftLength = this.maxHeap.heap.length;
    const rightLength = this.minHeap.heap.length;
    /* 为奇数时
    shouldLeftLength = (leftLength + rightLength) / 2 + 1;
    shouldRightLength = (leftLength + rightLength) / 2 - 1;
    简化写法*/
    let shouldRightLength = (leftLength + rightLength) >>> 1;
    if (rightLength < shouldRightLength) {
      const value = this.maxHeap.removeHead();
      this.minHeap.insert(value);
    } else if (rightLength > shouldRightLength) {
      const value = this.minHeap.removeHead();
      this.maxHeap.insert(value);
    }
  };

  public findMedian = () => {
    const leftLength = this.maxHeap.heap.length;
    const rightLength = this.minHeap.heap.length;
    if ((leftLength + rightLength) % 2) {
      return this.maxHeap.getHead();
    }
    return ((this.maxHeap.getHead() ?? 0) + (this.minHeap.getHead() ?? 0)) / 2;
  };
}

const middleFinder = new MiddleFinder();

for (let c of input) {
  middleFinder.addNum(c);
}
console.log(middleFinder.findMedian());
