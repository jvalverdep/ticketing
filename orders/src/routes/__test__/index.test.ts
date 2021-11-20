import request from "supertest";
import app from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { JestHelpers } from "../../test/helpers";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it("fetches order for an particular user", async () => {
  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const cookieUser1 = JestHelpers.expressSessionMock();
  const cookieUser2 = JestHelpers.expressSessionMock();

  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookieUser1)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as user #2
  const {
    body: { id: orderId1 },
  } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookieUser2)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const {
    body: { id: orderId2 },
  } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookieUser2)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", cookieUser2)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body).toHaveLength(2);
  expect(response.body[0].id).toEqual(orderId1);
  expect(response.body[1].id).toEqual(orderId2);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
