import express, { Request, Response } from 'express';

import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 4000;
import route from "./routes/index.route"

app.use('/', route);

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});
