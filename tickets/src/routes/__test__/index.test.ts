import request from "supertest";
import app from "../../app";
import { signinMock } from "../../test/helpers";

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", signinMock()).send({
    title: "asdk",
    price: 20,
  });
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets");

  expect(response.body.length).toEqual(3);
});
