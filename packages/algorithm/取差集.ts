

const nums1 = [1, 2, 2,4, 1];
const nums2 = [2, 2,4,5,9];

const  xor =(nums1,nums2)=>{
  const union = new Set([...nums1,...nums2]);
  return Array.from(union).filter((c)=>{
    return (nums1.includes(c) && !nums2.includes(c) )|| (!nums1.includes(c) && !nums1.includes(c))
  })
}
console.log(xor(nums1,nums2))

