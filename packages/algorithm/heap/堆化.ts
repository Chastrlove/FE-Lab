//从最后一个非叶子节点开始，从后往前做 siftDown().形成最小堆
//第一个设定为0
//父子满足2i+1 2i+1
//初始选择最接近叶子的一个父结点，与其两个儿子中较小的一个比较，若大于儿子，则与儿子交换。
//交换后再与新的儿子比较并交换，直至没有儿子。
//再选择较浅深度的父亲结点，重复上述步骤。
//如果是最大堆，相当于让当前 与 left、right中最大的那个比，把大的移上去

export const minHeapify = (array, heapSize, k) => {
  while (2 * k + 1 < heapSize) {
    const leftSon = 2 * k + 1;
    const rightSon = 2 * k + 2;
    let smallest;
    if (rightSon < heapSize && array[rightSon] < array[leftSon]) {
      smallest = rightSon;
    } else {
      smallest = leftSon;
    }
    if (array[k] < array[smallest]) {
      break;
    }
    swap(array, k, smallest);
    k = smallest;
  }
};

export const maxHeapify = (array, heapSize, k) => {
  while (2 * k + 1 < heapSize) {
    const leftSon = 2 * k + 1;
    const rightSon = 2 * k + 2;
    let largest;
    if (rightSon < heapSize && array[rightSon] > array[leftSon]) {
      largest = rightSon;
    } else {
      largest = leftSon;
    }
    if (array[k] > array[largest]) {
      break;
    }
    swap(array, k, largest);
    k = largest;
  }
};

export const buildMinHeap = (array, heapSize) => {
  for (let i = heapSize - 1; i >= 0; i--) {
    minHeapify(array, heapSize, i);
  }
};
export const buildMaxHeap = (array, heapSize) => {
  for (let i = heapSize - 1; i >= 0; i--) {
    maxHeapify(array, heapSize, i);
  }
};

export const swap = (array, i, j) => {
  const temp = array[j];
  array[j] = array[i];
  array[i] = temp;
};
//   1
// 8   4
//6 3 2 9
const array = [1, 8, 4, 6, 3, 2, 9];
buildMaxHeap(array, 7);
// console.log(array);
