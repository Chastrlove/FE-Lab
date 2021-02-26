Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);


    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }

    //
    fBound.prototype = Object.create(this.prototype)

    return fBound;
}


var value = 2;

var foo = {
    value: 1
};



function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value)
}

bar.prototype.value = 1;

var bindFoo = bar.bind2(foo, 'jiangshan');

var obj = new bindFoo();


console.log(obj)
