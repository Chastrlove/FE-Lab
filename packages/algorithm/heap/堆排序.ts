import { buildMaxHeap, maxHeapify, swap } from "./堆化";

//先构建一次最大堆，
//然后每次都将堆顶部的的最大值与最后的值交换，使得当前最大堆的最大值放到尾部
//此时除去最后的值，将顶部的值重新堆化即可
//如此循环

const heapSort = (array) => {
  buildMaxHeap(array, array.length);
  for (let i = array.length - 1; i >= 0; i--) {
    swap(array, 0, i);
    maxHeapify(array, i, 0);
  }
};

const array = [1, 8, 4, 6, 3, 2, 9];

heapSort(array);

console.log(array);
