import { OrderStatus } from "@jvptickets/common";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Order } from "../../models/order";
import { JestHelpers } from "../../test/helpers";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

// jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  const cookie = JestHelpers.expressSessionMock();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      paymentIntent: "asd",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const cookie = JestHelpers.expressSessionMock();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      paymentIntent: "asd",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = JestHelpers.expressSessionMock(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      orderId: order.id,
      paymentIntent: "asd",
    })
    .expect(400);
});

it("returns a 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = JestHelpers.expressSessionMock(userId);
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  const fakeIntentId = "1231jasdhdh5h5jasjdasd";

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      paymentIntent: fakeIntentId,
      orderId: order.id,
    })
    .expect(201);

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions.source).toEqual("tok_visa");
  // expect(chargeOptions.amount).toEqual(20 * 100);
  // expect(chargeOptions.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: fakeIntentId,
  });
  expect(payment).not.toBeNull();
});
