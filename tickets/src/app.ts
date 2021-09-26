import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import morgan from "morgan";

import { currentUser, errorHandler, NotFoundError } from "@jvptickets/common";
import { createTicketRouter } from "./routes/new";
import { detailTicketRouter } from "./routes/detail";
import { listTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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

app.use(createTicketRouter);
app.use(detailTicketRouter);
app.use(listTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
