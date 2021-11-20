import mongoose from "mongoose";
import { requireAuth, validateRequest } from "@jvptickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser?.id,
  }).populate("ticket");

  res.send(orders);
});

router.post(
  "/api/orders/tickets",
  requireAuth,
  [
    body("title").notEmpty().withMessage("title must be provided"),
    body("price").notEmpty().withMessage("price must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { price, title } = req.body;
    const ticket = Ticket.build({
      price,
      title,
    });
    ticket.save();

    res.send(ticket);
  }
);

export { router as listOrderRouter };
