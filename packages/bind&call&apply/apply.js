Function.prototype.myApply=function(thisArg,args){
    const fn = Symbol('fn')
    thisArg = thisArg || window
    thisArg[fn] = this
    const result = thisArg[fn](...args)
    delete thisArg[fn]
    return result
}

console.log(Array.prototype.push.myApply([1,2],[4,7]))
