import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}
	const username = locals.user.name;
	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('chucky');
		const ordersCollection = db.collection('orders');
		const query = { prepared: false };
		const rawOrders = await ordersCollection.find(query, { sort: { createdAt: -1 } }).toArray();

		const orders = rawOrders.map((order) => ({
			...order,
			_id: order._id.toString(),
			createdAt: order.createdAt.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			})
		}));

		return {
			orders,
			userPicture: locals.user.picture,
			username
		};
	} catch (e) {
		console.log(e);
	}
};

import client from '$lib/server/db.js';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const orderId = data.get('orderId');
		console.log('order id: ', orderId);
		const googleId = new locals.user.googleId();

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('adminhood');
			const users = db.collection('units');
			const query = { googleId };
			const user = await users.findOne(query);
			const customerName = user.name;

			const orders = db.collection('orders');

			await orders.insertOne({
				customerId,
				customerName,
				address,
				location,
				items,
				totalPrice,
				createdAt: new Date(),
				delivered: false,
				prepared: false
			});
			console.log('orden creada');

			notifUser(adminGoogleId, 'Tienes un nuevo pedido');

			//revalidatePath("/")
			//return { successMsg: "order created" }
		} catch (e) {
			console.error(e);
			//return { error: "Failed to create order" }
		}
	}
};
