import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import { ApiConfig, ApiConfigKit, WeChat } from "tnwx";
import { AddressInfo } from "net";
import * as uuid from "uuid";

const app = express();

app.use(express.static(path.resolve("./static")));

app.get("/wx-config-api/wx/getJsapiSignature", async (req, res) => {
  let appId = ApiConfigKit.getApiConfig.getAppId;
  let timestamp = `${Math.floor(new Date().getTime() / 1000)}`;
  let nonceStr = uuid.v1();
  let url = req.query.requestUrl; //填写完整页面的URL包括参数
  // 生成签名
  let signature = await WeChat.jssdkSignature(nonceStr, timestamp, url);
  res.send({
    appId: appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    url: url,
  });
});

app.get("/wxcheck", async (req, res) => {
  const { signature,timestamp, nonce,echostr } = req.query
  res.send(WeChat.checkSignature(signature, timestamp,nonce, echostr))
});

const server = app.listen(8001, "localhost", () => {
  let addressInfo: AddressInfo = <AddressInfo>server.address();
  if (addressInfo) {
    let host = addressInfo.address;
    let port = addressInfo.port;
    // 亦可以读取配置文件
    let devApiConfig = new ApiConfig(
      "wx743e9c2812fb3e2b",
      "34fc1c1a831e61bb52af6406d163fe38",
      "token"
    );
    // let proApiConfig = new ApiConfig(
    //   "wx0ac22947e8d7f437",
    //   "cd35d0cd5783a2fd47c488a80d5aa807",
    //   "Javen",
    //   true,
    //   "GFLxP8ppqcgQbI0yivtMkY4pkOAOiapHhQsCOgYUnYK"
    // );
    // let miniApiConfig = new ApiConfig(
    //   "wxf30d9b9b316d5de4",
    //   "bf0f1a06ba7cc16be643a250ca40213b"
    // );

    // 支持多公众号
    ApiConfigKit.putApiConfig(devApiConfig);
    // ApiConfigKit.putApiConfig(proApiConfig);
    // ApiConfigKit.putApiConfig(miniApiConfig);
    ApiConfigKit.setCurrentAppId(devApiConfig.getAppId);
    // QyApiConfigKit.setCurrentAppId(qyMiniApiConfig.getAppId, qyMiniApiConfig.getCorpId);
    // 开启开发模式,方便调试
    ApiConfigKit.devMode = true;

    // HttpKit.setHttpDelegate = new AxiosHttpKit();
    // ApiConfigKit.setCache = new DefaultCache();
    // ApiConfigKit.devMode = false
    if (ApiConfigKit.isDevMode()) {
      console.log("服务器已启动, 地址是：http://%s:%s", host, port);
    } else {
      console.log("未开启 debug 模式无法查看日志");
    }
  }
});
