const nums1 = [1, 2, 3, 0, 0, 0];
const nums2 = [1, 2, 6];

let l1 = 3;
let l2 = 3;
let m = l1 - 1;
let n = l2 - 1;

let tail = l1 + l2 - 1;

while (n >= 0) { //如果n已经为-1,说明已经不需要移动了
  if (m == -1) { //边界case,如果老的num1已经全部被移动，但是num2还没走完
    nums1[tail] = nums2[n--];
  } else {
    const a = nums1[m];
    const b = nums2[n];
    if (b > a) {
      nums1[tail] = b;
      n--;
    } else {
      nums1[tail] = a;
      m--;
    }
  }
  tail--;
}

console.log(nums1);
