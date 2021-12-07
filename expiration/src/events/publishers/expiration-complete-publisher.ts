import {
  ExpirationCompleteEvent,
  Publisher,
  Subject,
} from "@jvptickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}
