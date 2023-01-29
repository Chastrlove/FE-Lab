function deleteCode(str){
  //限制字符串长度和输入内容
  let p = /^[a-z]+$/g
  if(!p.test(str) || str.length > 20){
    console.log("输入不合格")
    return
  }
  let m = new Map()
  let arr = str.split("")
  arr.forEach((item)=>{
    if(m.has(item)){
      m.set(item,m.get(item)+1)
    }else{
      m.set(item,1)
    }
  })
  let min = Math.min(...m.values())
  for(let key of m.keys()){
    if(m.get(key) === min){
      let reg = new RegExp(key)
      str = str.replace(reg,"")
    }
  }
  console.log(str)

}
deleteCode("aabcddd")

