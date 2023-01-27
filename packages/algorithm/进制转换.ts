
const BigNumber = require('bignumber.js');

BigNumber.config({DECIMAL_PLACES:50, ROUNDING_MODE: 4})

const float = "10.00011001100110011001100110011001100110011001100110011010"

const twoToTen=(float)=>{
  const [int,decimal] = float.split('.')
  let intCount = int.split("").reverse().reduce((prev,count,index)=>{
    return new BigNumber(prev).plus(Math.pow(2,Number(index+1))).multipliedBy(Number(count) )
  },0)
  let decimalCount = decimal.split("").reduce((prev,count,index)=>{
    return new BigNumber(prev).plus(new BigNumber(1).dividedBy(Math.pow(2,Number(index+1))).multipliedBy(Number(count)) )
  },0)

  return intCount.plus(decimalCount)
}


//小数部分
function DecimalToBinary(val){
  var number = val.toString();          //to string
  var inDex = number.indexOf(".");      //search for .
  var fraction = number.slice(inDex+1); //slice out after . string
  var leng = fraction.length;           //find length
  if(leng == 0) return "";
  fraction = number.slice(inDex);
  number = Number(fraction);
  fraction = ".";
  for(let i=0;i<64;i++){
    number *= 2;
    if(number == 1){
      fraction+= "1";
      break;
    }
    else if(number < 1){
      fraction+= "0";
    }
    else{
      number-=1;
      fraction+= "1";
    }
  }
  return fraction;
}





