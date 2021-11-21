import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { JestHelpers } from "../../test/helpers";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).not.toEqual(404);
});

it("Returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const cookie = JestHelpers.expressSessionMock();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const cookie = JestHelpers.expressSessionMock();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "asdasd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});
it("reserves a ticket", async () => {
  const cookie = JestHelpers.expressSessionMock();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // const someRandomTicketId = new mongoose.Types.ObjectId();
  const createdOrder = await Order.findById(response.body.id);

  expect(createdOrder?.ticket.id).toBeDefined();
});

it("emits an order created event", async () => {
  const cookie = JestHelpers.expressSessionMock();

  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
