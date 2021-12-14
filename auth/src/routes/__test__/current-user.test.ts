import request from "supertest";
import app from "../../app";
import { signin } from "../../test/helpers";

it("responds with details about the current user", async () => {
  const cookie = await signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(400);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});
