import {
	Publisher,
	OrderCreatedEvent,
	Subjects,
} from '@xdurandaltickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
