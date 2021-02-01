import {
	Publisher,
	Subjects,
	OrderCancelledEvent,
} from '@xdurandaltickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
