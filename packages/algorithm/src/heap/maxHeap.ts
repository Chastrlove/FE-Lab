import { maxHeapify, swap } from "./堆化";

export class MaxHeap {
  public heap: number[] = [];
  public heapify(i: number) {
    maxHeapify(this.heap, this.heap.length, i);
  }

  public insert(num) {
    this.heap.push(num);
    let endIndex = this.heap.length - 1;

    while (endIndex > 0) {
      const parentIndex = (endIndex - 1) >>> 1;
      if (this.heap[parentIndex] < this.heap[endIndex]) {
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

/*const maxHeap = new MaxHeap();

maxHeap.insert(1);
maxHeap.insert(2);
maxHeap.insert(3);
maxHeap.insert(4);
maxHeap.insert(5);
maxHeap.removeHead();
console.log(maxHeap.heap);*/
