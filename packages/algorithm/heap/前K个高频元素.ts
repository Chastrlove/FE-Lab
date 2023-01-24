import { swap } from "../base";

const topKFrequent = (nums, k) => {
  const map = new Map();
  nums.forEach((num) => {
    if (map.has(num)) {
      const count = map.get(num);
      map.set(num, count + 1);
    } else {
      map.set(num, 1);
    }
  });
  // 如果元素数量小于等于 k
  if (map.size <= k) {
    return [...map.keys()];
  }
  let i = 0;
  const heap: number[] = [];
  map.forEach((value, key) => {
    if (i < k) {
      heap.push(key);
      if (i === k - 1) {
        buildMinHeap(heap, map, heap.length);
      }
    } else {
      if (value > map.get(heap[0])) {
        heap[0] = key;
        minHeapify(heap, map, heap.length, 0);
      }
    }
    i++;
  });
  return heap;
};

const buildMinHeap = (array, map, heapSize) => {
  for (let i = heapSize - 1; i >= 0; i--) {
    minHeapify(array, map, heapSize, i);
  }
};

let minHeapify = (array, map, heapSize, k) => {
  while (2 * k + 1 < heapSize) {
    const leftSon = 2 * k + 1;
    const rightSon = 2 * k + 2;
    let smallest;
    if (rightSon < heapSize && map.get(array[rightSon]) < map.get(array[leftSon])) {
      smallest = rightSon;
    } else {
      smallest = leftSon;
    }
    if (map.get(array[k]) < map.get(array[smallest])) {
      break;
    }
    swap(array, k, smallest);
    k = smallest;
  }
};

let topKFrequentNew = function (nums, k) {
  let map = new Map(),
    arr = [...new Set(nums)];
  nums.map((num) => {
    if (map.has(num)) map.set(num, map.get(num) + 1);
    else map.set(num, 1);
  });

  // 如果元素数量小于等于 k
  if (map.size <= k) {
    return [...map.keys()];
  }

  return bucketSort(map, k);
};

// 桶排序
let bucketSort = (map, k) => {
  let arr: Array<Array<number>> = [];
  let res: Array<number> = [];
  map.forEach((value, key) => {
    // 利用映射关系（出现频率作为下标）将数据分配到各个桶中
    if (!arr[value]) {
      arr[value] = [key];
    } else {
      arr[value].push(key);
    }
  });
  // 倒序遍历获取出现频率最大的前k个数
  for (let i = arr.length - 1; i >= 0 && res.length < k; i--) {
    if (arr[i]) {
      res.push(...arr[i]);
    }
  }
  return res;
};

const a = topKFrequentNew([1, 1, 1, 1, 2, 2, 3], 2);

console.log(a);
