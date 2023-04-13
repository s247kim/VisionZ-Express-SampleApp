import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import hpp from "hpp";

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

app.use("/api", apiRouter);

const port = +process.env.PORT || 8443;
app.listen(port, () => {
  console.log(`Express Server started on port ${port}`);
});
