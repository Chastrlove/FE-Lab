let numChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
let numUnit = ['', '十', '百', '千'];
let numSection = ['', '万', '亿', '万亿', '亿亿'];


function transform (value){
  const valueArray = String(value).split("").reverse()
  let text = ""
  for(let i in valueArray){
    const value = Number(valueArray[i]);
    const char = numChar[value];
    const unit = value === 0 ? "" :numUnit[Number(i)%4]
    let section = ""
    if(Number(i)%4 === 0){
      section = numSection[Math.floor((Number(i )+ 1)/4)]
      text = text.replace(/零+/g,"零").replace(/零+$/, '');
    }
    text = char + unit + section + text

  }
  console.log(text)
  return text
}


transform(1234560)
transform(100010001)

