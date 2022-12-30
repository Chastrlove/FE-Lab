// 模拟请求
function request(url) {
  return new Promise((r) => {
    const time = Math.random() * 100;
    setTimeout(() => r(url), time);
  });
}

function multipleRequest(urls: number[], maxCount = 3) {
  return new Promise((resolve, reject) => {
    let currentIndex = 0;
    let res = [];
    const requestAction = (url) => {
      let index = currentIndex++;
      console.log("开始：" + index, new Date().toLocaleString());
      const next = () => {
        if (currentIndex < urls.length) {
          requestAction(urls[currentIndex]);
        } else {
          if (index === currentIndex - 1) { //结束的时候 currentIndex一定已经与length相等
            resolve(res);
          }
        }
      };
      request(url)
        .then((result) => {
          res[index] = result;
          console.log("结束：" + index, new Date().toLocaleString());
          next()
        })
        .catch((e) => {
          res[index] = e;
          console.log("结束：" + index, new Date().toLocaleString());
          next()
        });
    };
    while (currentIndex < maxCount) {
      requestAction(urls[currentIndex]);
    }
  });
}

multipleRequest([1, 2, 3, 4, 5, 6, 7, 8], 3).then((res) => {
  console.log(res);
});
