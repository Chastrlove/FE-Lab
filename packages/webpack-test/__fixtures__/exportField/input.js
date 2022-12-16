import {a} from './aa'

const xx = (cv)=>{
  document.createElement(cv)
  return cv(a)
}

xx((params)=>{params.a=123})

document.createElement(a)
