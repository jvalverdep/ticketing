import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import morgan from "morgan";

import { currentUser, errorHandler, NotFoundError } from "@jvptickets/common";
import { createChargeRouter } from "./routes/new";
import { getSecret } from "./routes/secret";

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

app.use(getSecret);
app.use(createChargeRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
