import { buildMinHeap, minHeapify,swap } from "./堆化";
//不断把最小的数剔除出去
//为什么不能用最大堆？因为一旦遇到了最大的数，后面的数无法堆化
const findKthLargest = (list, k) => {
  buildMinHeap(list, 4);
  for (let i = k; i < list.length; i++) {
    if(list[i] > list[0]){
      swap(list,0,i);
      minHeapify(list,4,0)
    }
  }
};
const nums = [4, 5, 1, 6, 2, 7, 3, 8,9];
findKthLargest(nums, 4);
console.log(nums[0])
