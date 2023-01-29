/*输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3
输出: [3,3,5,5,6,7]*/

const maxSlidingWindow = (nums, k) => {
  const deque: number[] = []; //double-ended queue，双端队列
  const result:number[] = [];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    //如果最长的那个数与当前比较的数无法在同一个窗口里，则删除
    if (i -k + 1 > deque[0]) {
      deque.shift();
    }
    //从后往前删除比当前值小的
    while (num >= nums[deque[deque.length - 1]]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  console.log(result)
  return result;
};

maxSlidingWindow([1,3,1,2,0,5], 3);
