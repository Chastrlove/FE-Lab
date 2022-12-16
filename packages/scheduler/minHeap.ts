const peek = (heap) => {
  return heap.length === 0 ? null : heap[0];
};

const push = (heap, node) => {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
};

const pop = (heap) => {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  // JavaScript 的 pop 方法删除并返回数组的最后一个元素
  const last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
};

const siftUp = (heap, node, i) => {
  let index = i;
  while (index > 0) {
    //完全二叉树 如果根节点为索引为0，则父节点与左子节点的关系是2n+1，与右子节点的关系是2n+2。
    // 因此如果知道的子节点的索引，只要(子节点的索引值 - 1) / 2 后取整就得到了父节点的索引  , 而x >>> 1表示的就是除以 2 后取整。
    const parentIndex = (index - 1) >>> 1;
    const parentNode = heap[parentIndex];
    if (compare(node, parentNode) < 0) {
      heap[parentIndex] = node;
      heap[index] = parentNode;
      index = parentIndex;
    } else {
      return;
    }
  }
};

/*取出最后一个节点，替换掉根节点
将节点“下沉”到正确位置*/
const siftDown = (heap, node, i) => {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  /**
   * 因为 2x + 2(右节点) <= length - 1
   * 所以 x <= length/2 - 1.5
   *
   * 我们知道 y >>> 1 ，在 y 为正数的情况下，计算的结果为 y/2 - 0.5 或者 y/2
   *
   * 如果 x <= length/2 - 1.5
   * 那么肯定 x < length/2 - 0.5 以及 x < length/2
   * 所以肯定 x < length >>> 1
   * 如果直接使用length做循环条件，需要考虑left为undefined的情况
   */
  while (index < halfLength) {
    const leftIndex = 2 * index + 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];
    if (compare(left, node) < 0) {
      //left最小的情况
      if (rightIndex < length && compare(left, right) < 0) {
        heap[leftIndex] = node;
        heap[index] = left;
        index = leftIndex;
      } else {
        heap[rightIndex] = node;
        heap[index] = right;
        index = rightIndex;
      }
    } else if (rightIndex < length && compare(node, right) > 0) {
      heap[rightIndex] = node;
      heap[index] = right;
      index = rightIndex;
    } else {
      return
    }
  }
};

const compare = (a, b) => {
  // 首先比较 sortIndex，其次是 id
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
};

// 测试代码
let taskQueue = [
  { sortIndex: 2 },

  { sortIndex: 5 },
  { sortIndex: 7 },
  { sortIndex: 12 },
  { sortIndex: 22 },
  { sortIndex: 17 },
  { sortIndex: 25 },
];
pop(taskQueue);
console.log(JSON.stringify(taskQueue));
