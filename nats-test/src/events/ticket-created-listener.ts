import { Message } from "node-nats-streaming";
import { Subject } from "./subject";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Ticket } from "../entities/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: Ticket, msg: Message): void {
    console.log("Event data:", data);

    msg.ack();
  }
}
