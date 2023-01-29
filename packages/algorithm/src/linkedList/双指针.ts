/**
 * 救生艇问题
 * 为了让船尽可能坐的多：
 * 1.假设先让最轻的人上船，那么与之同乘的人应尽可能重，所以从最重的人开始选
 * 2.如果相加大于limit，那么说明最重的人无法与人同乘（单独一艘），那么继续寻找次重的人
 * @param people
 * @param limit
 */
const numRescueBoats = function (people: any[], limit) {
  people.sort((a, b) => a - b);
  let i = 0,
    j = people.length - 1;
  let ans = 0;

  while (i <= j) {
    ans++;
    if (people[i] + people[j] <= limit) {
      i++;
    }
    j--;
  }
  return ans;
};

console.log(numRescueBoats([44, 10, 29, 12, 49, 41, 23, 5, 17, 26], 50));
