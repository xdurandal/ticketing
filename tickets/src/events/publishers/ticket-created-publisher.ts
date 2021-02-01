import {
	Publisher,
	Subjects,
	TicketCreatedEvent,
} from '@xdurandaltickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
