const input = [3,4,1,2,2,4,5,6,24,1,3,6]

//前后比较，如果相同，就把后面的数组删掉，能保持数组索引不出错
const deDuplication=(list)=>{
  for(let i =0;i<list.length;i++){
    for(let j = i+1;j<list.length;j++){
      if(list[i] === list[j]){
        list.splice(j,1)
      }
    }
  }
  console.log(list)
}

const swap =(list,i,j)=>{
  const temp = list[i];
  list[i]=list[j];
  list[j]=temp
}

const sort = (list)=>{
  for(let i =0;i<list.length;i++ ){
   for(let j = i+1;j<list.length;j++){
     if(list[i]>list[j]){
       swap(list,i,j)
     }
   }
  }
}
sort(input);

deDuplication((input))
