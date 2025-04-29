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
			const orders = db.collection('unidades');
			const filter = { googleId };
			const updateDoc = {
				$set: {
					prepared: true,
					preparedAt: new Date()
				}
			};

			await orders.updateOne(filter, updateDoc);
		} catch (error) {
			console.log(error);
		}
	}
};
