export const findIndexOrLast = (nums, target, isFirst = true) => {
  let left = 0;
  let right = nums.length - 1;
  let ans = -1;
  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    if (nums[middle] == target) {
      ans = middle;
      if (isFirst) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
      continue
    }
    if (nums[middle] > target) {
      right = middle - 1;
    } else {
      left = middle + 1;
    }
  }
  return ans;
};

const findRange = (nums, target) => {
  const index = findIndexOrLast(nums, target);
  const lastIndex = findIndexOrLast(nums, target, false);
  return [index, lastIndex];
};

console.log(findRange([5,7,7,8,8,10], 8));
