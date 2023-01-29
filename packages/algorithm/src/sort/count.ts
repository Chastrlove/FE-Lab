//只可用于已知范围
export const countSort = (input, maxValue) => {
  const bullet = new Array(maxValue + 1);
  const res: number[] = [];

  for (let i = 0; i < input.length; i++) {
    if (bullet[input[i]]) {
      bullet[input[i]]++;
    } else {
      bullet[input[i]] = 1;
    }
  }
  for (let i = 0; i < bullet.length; i++) {
    if (bullet[i] > 0) {
      while (bullet[i]--) {
        res.push(i);
      }
    }
  }
  return res
};


[1,2,3,6].forEach((value, key) => {
  // 利用映射关系（出现频率作为下标）将数据分配到各个桶中
 console.log()
})
