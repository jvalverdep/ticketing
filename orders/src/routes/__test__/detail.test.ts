import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { JestHelpers } from "../../test/helpers";

it("fetches the order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const cookieUser = JestHelpers.expressSessionMock();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookieUser)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookieUser)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if an user tries to fetch ", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const cookieUser = JestHelpers.expressSessionMock();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookieUser)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a erquest to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", JestHelpers.expressSessionMock())
    .expect(401);
});
