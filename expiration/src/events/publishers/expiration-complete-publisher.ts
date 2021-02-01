import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent,
} from '@xdurandaltickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
