import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import hpp from "hpp";
import mysql from "mysql2";

import { apiRouter } from "./src/routes";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

app.use(helmet());
app.use(compression());

const corsOption: CorsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOption));
app.options("*", cors(corsOption));

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "VisionZ_Express",
  password: "password",
  database: "VisionZ_Practice",
});
console.log("DB Pool Created");
app.use((req, res, next) => {
  res.locals.pool = pool.promise();
  next();
});

app.use("/api", apiRouter);

app.get("/ex", (req, res) => {
  setTimeout(() => {
    res.send({ hello: "world" });
  }, 1000);
});

const port = +process.env.PORT || 8443;
app.listen(port, () => {
  console.log(`Express Server started on port ${port}`);
});
