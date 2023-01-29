// 比较含有退格的字符串，"<-"代表退格键，"<"和"-"均为正常字符
// 输入："a<-b<-", "c<-d<-"，结果：true，解释：都为""
// 输入："<-<-ab<-", "<-<-<-<-a"，结果：true，解释：都为"a"
// 输入："<-<ab<-c", "<<-<a<-<-c"，结果：false，解释："<ac" !== "c"

function start(str1, str2) {

}
const work = (chars)=>{
  const charsArray = chars.split("");
  let insertChars = ""
  charsArray.reduce((prev,current,index)=>{
    if(index === 1){
      insertChars = insertChars+ prev
    }
    insertChars = insertChars+ current
    if(prev === "<" && current === "-"){
      insertChars = insertChars.slice(0,Math.max(insertChars.length-3,0))
    }
    return current
  })
  console.log(insertChars)
}

work("a<-b<-")
work("<-<ab<-c")

