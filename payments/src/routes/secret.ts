import { requireAuth, validateRequest } from "@jvptickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments/secret",
  requireAuth,
  [body("amount").isFloat({ gt: 0 }), body("orderId").notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { amount, orderId } = req.body;

    const intent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        orderId,
      },
    });

    res.send({ clientSecret: intent.client_secret });
  }
);

export { router as getSecret };
