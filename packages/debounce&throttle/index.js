const debounce = (func, wait = 500, immediate = true) => {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        if (!timer && immediate) {
            func.apply(this, args);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
};


const throttle = (func, wait = 500) => {
    let timer = null, lastTime = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastTime >= wait) {
            lastTime = now;
            func.apply(this, args);
        } else {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                lastTime = now;
                func.apply(this, args);
            }, wait);
        }

    };
};
