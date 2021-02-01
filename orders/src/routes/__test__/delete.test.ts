import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
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

it('marks an order as cancelled', async () => {
	const ticketOne = await buildTicket();
	const user = global.signin();

	//Make request to build an order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticketOne.id })
		.expect(201);
	//make request to cancel the order
	const deletedOrder = await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(204);
	//expect that its canceled
	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should publish an event when deleted', async () => {
	const ticketOne = await buildTicket();
	const user = global.signin();

	//Make request to build an order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticketOne.id })
		.expect(201);
	//make request to cancel the order
	const deletedOrder = await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(204);
	//expect that its canceled
	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
