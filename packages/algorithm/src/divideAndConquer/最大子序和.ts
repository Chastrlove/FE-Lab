export const maxSubSum = (input: number[]) => {
  let max = input[0];
  let prev = input[0];
  //prev 只能是他自己，或者前数之和
  //表示法：dp[n] = Math.max(dp[n−1]+nums[n], nums[n])
  for (let i = 1; i < input.length; i++) {
    if (prev < 0) {
      prev = input[i];
    } else {
      prev = prev + input[i];
    }
    max = Math.max(prev, max);
  }
  return max;
};

maxSubSum([4, -1, 2, 1, -5, 4]);
