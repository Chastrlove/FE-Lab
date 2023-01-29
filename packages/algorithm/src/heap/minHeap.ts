import { minHeapify, swap } from "./堆化";

export class MinHeap {
  public heap: number[] = [];
  public heapify(i: number) {
    minHeapify(this.heap, this.heap.length, i);
  }

  public insert(num) {
    this.heap.push(num);
    let endIndex = this.heap.length - 1;

    while (endIndex > 0) {
      const parentIndex = (endIndex - 1) >>> 1;
      if (this.heap[parentIndex] > this.heap[endIndex]) {
        swap(this.heap, parentIndex, endIndex);
        endIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  public getHead = () => {
    return this.heap.length > 0 ? this.heap[0] : null;
  };
  public removeHead() {
    if (this.heap.length > 1) {
      swap(this.heap, 0, this.heap.length - 1);
      const popValue = this.heap.pop();
      this.heapify(0);
      return popValue;
    }
    return null;
  }
}
/*const minHeap = new MinHeap();

minHeap.insert(1);
minHeap.insert(2);
minHeap.insert(3);
minHeap.insert(4);
minHeap.insert(5);
console.log(minHeap.removeHead());
console.log(minHeap.heap);*/
