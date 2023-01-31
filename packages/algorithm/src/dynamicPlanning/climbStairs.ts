//爬楼梯，每次可爬一步或两步，
//所以对于任意第n级台阶而言，都相当于第(n-1)个台阶的方案数 + (n-2)个台阶的方案数
//分解条件 第0个台阶只有一种方案（为了好计算，现实中很难理解），第1个台阶只有一种方案

export const climbStairs = (n) => {
  let n1 = 1;
  let n2 = 1;
  let summary = 1;
  for (let i = 2; i <= n; i++) {
    summary = n1 + n2;
    n2 = n1;
    n1 = summary;
  }
  return summary
};

climbStairs(1);
