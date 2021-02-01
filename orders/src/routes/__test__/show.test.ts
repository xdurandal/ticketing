import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});

	await ticket.save();

	return ticket;
};

it('fetches the order', async () => {
	const ticketOne = await buildTicket();
	const userOne = global.signin();

	//Make request to build an order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', userOne)
		.send({ ticketId: ticketOne.id })
		.expect(201);
	//make request to feth the order
	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', userOne)
		.send()
		.expect(200);
	expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to access another users order', async () => {
	const ticketOne = await buildTicket();
	const userOne = global.signin();

	//Make request to build an order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', userOne)
		.send({ ticketId: ticketOne.id })
		.expect(201);
	//make request to feth the order
	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', global.signin())
		.send()
		.expect(401);
	// expect(fetchedOrder.id).toEqual(order.id);
});
