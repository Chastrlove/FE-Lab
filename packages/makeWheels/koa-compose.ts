// 题目需求

const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
const a = async (next) => {
  console.log(1);
  await next();
  console.log(1.1);
};

const b = async (next) => {
  console.log(2);
  await next();
  console.log(2.1);
};

const c = async (next) => {
  console.log(3);
  await next();
  console.log(3.1);
};

/*a(()=>{
  b(()=>{
    c(()=>{

    })
  })
})*/

let middleware = [a, b, c];

let composeFn = compose(middleware);
composeFn("123333", async () => {
  await sleep(2321);
  console.log("1233");
});

//实现compose函数
function compose(middlewares) {
  return (context, next) => {
    const dispatch = (index) => {
      let func = middlewares[index];
      if (index === middlewares.length) {
        func = next;
      }

      if (!func) {
        return Promise.resolve();
      }

      try{
        return Promise.resolve(func(dispatch.bind(null, ++index)));
      }catch (e){
        return Promise.reject(e)
      }


    };
    return dispatch(0);
  };
}
