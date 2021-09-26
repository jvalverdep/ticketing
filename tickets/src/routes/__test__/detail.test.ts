import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { signinMock } from "../../test/helpers";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const cookie = signinMock();
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

  expect(ticketResponse.body.title).toBe(title);
  expect(ticketResponse.body.price).toBe(price);
});
