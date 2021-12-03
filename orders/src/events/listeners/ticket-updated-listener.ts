import { Message } from "node-nats-streaming";
import { Listener, Subject, TicketUpdatedEvent } from "@jvptickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], message: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket not found");

    const { title, price, version } = data;
    ticket.set({ title, price, version });
    await ticket.save();

    message.ack();
  }
}
