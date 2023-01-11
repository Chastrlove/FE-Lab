class MyPromise {
    private static PENDING = 'pending';
    private static RESOLVED = 'resolved';
    private static REJECTED = 'rejected';
    public value
    public reason
    public status = MyPromise.PENDING;
    public rejectedQueues = []
    public resolvedQueues = []

    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (err) {
            this.reject(err);
        }

    }

    resolve = (value) => {
        this.value = value

        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.RESOLVED
        }
        this.resolvedQueues.forEach(cb => cb(this.value))
    }

    reject = (reason) => {
        this.reason = reason
        if (this.status === MyPromise.PENDING) {
            this.status = MyPromise.REJECTED
        }
        this.resolvedQueues.forEach(cb => cb(this.reason))
    }

    then = (onFulfilled, onRejected) => {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason
        }
        return new MyPromise((resolve,reject)=>{

            if (this.status === MyPromise.PENDING) {
                this.resolvedQueues.push((value)=>{
                    resolve(onFulfilled(value))
                })
                this.rejectedQueues.push((value)=>{
                    reject(onRejected(value))
                })
            }

            if (this.status === MyPromise.RESOLVED) {
                const returnValue = onFulfilled(this.value)
                resolve(returnValue)
            }

            if (this.status === MyPromise.REJECTED) {
                const returnValue = onRejected(this.reason)
                reject(returnValue)
            }
        })
    }
}

const a = new MyPromise((resolve) => {
    // setTimeout(() => {
    //     resolve(123)
    // }, 1000)
    resolve(123)
})

a.then((value) => {
    console.log(value)
    return 23
}, (err) => {
    console.log(err)
}).then((value) => {
    console.log(value)
}, (err) => {
    console.log(err)
})


const a = /(?<=（)[^（）]+(?=）)/.exec('(特别授权)姜志国（特别授权)');
console.log(a)
