import { Ticket } from "../entities/ticket";
import { Subject } from "./subject";

export interface TicketUpdatedEvent {
  subject: Subject.TicketUpdated;
  data: Ticket;
}
