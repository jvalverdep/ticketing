import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  const publisher = new TicketCreatedPublisher(stan);

  const data = {
    id: "123",
    title: "concert 123",
    price: 20,
  };

  await publisher.publish(data);
  console.log(":D");
});
