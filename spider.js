const fetch = require("node-fetch");
fetch("https://splcgk.court.gov.cn/gzfwww/ktgglist?pageNo=1", {
    "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://splcgk.court.gov.cn/gzfwww/ktgg",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "bt=&fydw=%E6%9D%AD%E5%B7%9E%E5%B8%82%E8%90%A7%E5%B1%B1%E5%8C%BA%E4%BA%BA%E6%B0%91%E6%B3%95%E9%99%A2&pageNum=1",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
}).then(async(value)=>console.log(await value.text()));
