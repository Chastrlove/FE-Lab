export const threeSum = (input) => {
  const res: any[] = [];
  input = input.sort((a, b) => a - b);
  for (let i = 0; i < input.length; i++) {
    if (input[i] > 0) break; //如果排完序之后，当前是正数，那么永远无法在其后面选出负数和
    if (i > 0 && input[i] === input[i - 1]) continue; //去重
    const current = input[i];
    let left = i + 1;
    let right = input.length - 1;
    while (left < right) {
      const sum = current + input[left] + input[right];
      if (sum > 0) {
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        res.push([current, input[left], input[right]]);
        right--;
        left++;
        while (input[left] === input[left - 1]) {
          left++;
        }
        while (input[right] === input[right + 1]) {
          right--;
        }
      }
    }
  }
  console.log(res);
};

threeSum([-1, 0, 1, 2, -1, -4, -2, -3, 3, 0, 4]);
