import app from "./src/app";
import { sequelize } from "./src/db/models/index";

import { createServer } from "http";

import webPush from "./src/utils/webPush";

const port: number = Number(process.env.PORT) || 5005;

const server = createServer(app);

webPush();

server.listen(port, async () => {
  console.log(`정상적으로 서버를 시작하였습니다.  http://localhost:${port}`);

  // authenticate 메소드로 연결 확인
  await sequelize
    .authenticate()
    .then(async () => {
      console.log("connection success");
    })
    .catch((e: Error) => {
      console.log(e);
    });
});

export default server;
