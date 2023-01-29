import {quickSort} from "./quick"
export const bucketSort = (arr) => {
  let min = arr[0];
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    } else if (arr[i] > max) {
      max = arr[i];
    }
  }

  const bucketSize = 5;
  const bucketCount = Math.floor((max - min) / bucketSize) +1; //注意这里不是ceil,因为索引从0开始
  const buckets = new Array(bucketCount);
  for (let j = 0; j < buckets.length; j++) {
    buckets[j] = [];
  }
  //利用映射函数将数据分配到各个桶中
  for (let k = 0; k < arr.length; k++) {
    buckets[Math.floor((arr[k] - min) / bucketSize)].push(arr[k]);
  }
  let res = []
  for (let f = 0; f < buckets.length; f++) {
    quickSort(buckets[f])
    res.push(...buckets[f])
  }
  return res
};

bucketSort([1, 7, 8, 6,12,17,7,0,52]);
