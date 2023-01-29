const nums1 = [1, 2, 2,4, 1];
const nums2 = [2, 2,4];

const intersection = (...args) => {
  return [
    ...new Set(
      args.reduce((prev, current) => {
        return prev.filter((item, index) => {
          if (current.indexOf(item) > -1) {
            return true;
          }
          return false;
        });
      }),
    ),
  ];
};

console.log(intersection(nums1,nums2));
