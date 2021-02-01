import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedEvent } from '@xdurandaltickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	// create an instance of the listener
	const listener = new TicketUpdatedListener(natsWrapper.client);

	// Create and save a ticket
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	// create a fake data object
	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		version: ticket.version + 1,
		title: 'theatre',
		price: 30,
		userId: mongoose.Types.ObjectId().toHexString(),
	};
	// create a fake message object
	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};
	//@ts-ignore

	return { listener, ticket, data, msg };
};

it('finds, updates, and saves a ticket', async () => {
	const { msg, data, ticket, listener } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
	expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
	const { msg, data, listener } = await setup();
	await listener.onMessage(data, msg);
	expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has skipped a version number', async () => {
	const { msg, data, listener, ticket } = await setup();
	data.version = 10;
	await expect(listener.onMessage(data, msg)).rejects.toThrow();
	expect(msg.ack).not.toHaveBeenCalled();
});
