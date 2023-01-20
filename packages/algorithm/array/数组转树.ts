const arrayToTree = (input)=>{

  const traverse = (list:Array<any>,parentId = 0)=>{
    const returnTree = []
    list.forEach((item)=>{
      if(item.parentId === parentId){
        returnTree.push({
          ...item,
          children:traverse(list,item.id)
        })
      }
    })
    return returnTree
  }
  return traverse(input);
}


const arr = [{
  id: 2,
  name: '部门B',
  parentId: 0
},
  {
    id: 3,
    name: '部门C',
    parentId: 1
  },
  {
    id: 1,
    name: '部门A',
    parentId: 2
  },
  {
    id: 4,
    name: '部门D',
    parentId: 1
  },
  {
    id: 5,
    name: '部门E',
    parentId: 2
  },
  {
    id: 6,
    name: '部门F',
    parentId: 3
  },
  {
    id: 7,
    name: '部门G',
    parentId: 2
  },
  {
    id: 8,
    name: '部门H',
    parentId: 4
  }
]
const d = arrayToTree(arr)
console.log(d)
