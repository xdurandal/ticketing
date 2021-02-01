import {
	Subjects,
	Publisher,
	PaymentCreatedEvent,
} from '@xdurandaltickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
