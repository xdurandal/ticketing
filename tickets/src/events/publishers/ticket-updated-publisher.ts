import {
	Publisher,
	Subjects,
	TicketUpdatedEvent,
} from '@xdurandaltickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
