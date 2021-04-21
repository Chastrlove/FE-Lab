import * as express from "express";
import * as path from "path";
import { AddressInfo } from "net";
import * as contentDisposition from "content-disposition";

const app = express();

app.use(
  express.static(path.resolve("./public"), {
    setHeaders(res, path) {
      res.setHeader("Cache-Control", "no-store");
      if (path.includes("png")) {
        res.setHeader(
          "Content-Disposition",
          contentDisposition(path, {
            type: "inline",
          })
        );
      }
    },
  })
);

const server = app.listen(8001, "0.0.0.0", () => {
  let addressInfo: AddressInfo = <AddressInfo>server.address();
  if (addressInfo) {
    let host = addressInfo.address;
    let port = addressInfo.port;
    console.log("服务器已启动, 地址是：http://%s:%s", host, port);
  }
});
