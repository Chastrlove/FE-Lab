// const onCoinChange = (coins, amount) => {
//   const dps = Array(amount + 1).fill(amount + 1);
//
//   dps[0] = 0;
//
//   for (let i = 0; i < dps.length; i++) {
//     for (let coin of coins) {
//       if (i < coin) {
//         continue;
//       }
//       dps[i] = Math.min(dps[i], 1 + dps[i - coin]);
//     }
//   }
//   return dps[amount];
// };
//
// console.log(onCoinChange([1, 2, 5], 11));

