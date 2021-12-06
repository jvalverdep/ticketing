import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { signinMock } from "../../test/helpers";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signinMock())
    .send({
      title: "some title",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "some title",
      price: 20,
    })
    .expect(401);
});

// should be 403
it("returns a 401 if user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", signinMock())
    .send({
      title: "new ticket",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signinMock())
    .send({
      title: "ticket changes",
      price: 10,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = signinMock();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "new ticket",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: -10,
    })
    .expect(400);
});

it("updates the ticket by providing valid inputs", async () => {
  const cookie = signinMock();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 20,
    })
    .expect(201);

  const id = response.body.id;
  const newTitle = "new title";
  const newPrice = 50;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${id}`);

  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});

it("publishes an event", async () => {
  const cookie = signinMock();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 20,
    })
    .expect(201);

  const id = response.body.id;
  const newTitle = "new title";
  const newPrice = 50;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = signinMock();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "title",
      price: 20,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  ticket!.set({ orderId });
  ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "something else",
      price: 10,
    })
    .expect(400);
});
