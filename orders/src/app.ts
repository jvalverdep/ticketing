import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import morgan from "morgan";

import { currentUser, errorHandler, NotFoundError } from "@jvptickets/common";
import { createOrderRouter } from "./routes/new";
import { detailOrderRouter } from "./routes/detail";
import { listOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(morgan("dev"));

app.use(currentUser);

app.use(createOrderRouter);
app.use(detailOrderRouter);
app.use(listOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
