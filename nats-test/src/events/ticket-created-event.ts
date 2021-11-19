import { Ticket } from "../entities/ticket";
import { Subject } from "./subject";

export interface TicketCreatedEvent {
  subject: Subject.TicketCreated;
  data: Ticket;
}
