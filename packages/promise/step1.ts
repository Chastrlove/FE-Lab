class MyPromise {
    public onFulfilled?: Function
    public onRejected?: Function

    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (err) {
            this.reject(err);
        }

    }

    resolve = (value) => {
        this.onFulfilled?.(value)
    }

    reject = (value) => {
        this.onRejected?.(value)
    }

    then = (onFulfilled, onRejected) => {
        this.onFulfilled = onFulfilled
        this.onRejected = onRejected
    }
}

const a = new MyPromise((resolve) => {
    setTimeout(() => {
        resolve(123)
    }, 1000)
    // bug:resolve 函数的执行时机需要在 then 方法将回调函数注册了之后，在 resolve 之后在去往赋值回调函数，其实已经完了，没有任何意义。
    // resolve(123)
})

a.then((value) => {
    console.log(value)
}, (err) => {
    console.log(err)
})
