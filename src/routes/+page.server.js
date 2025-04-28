import { fail, redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/session';
import client from '$lib/server/db.js';

export const load = async () => {
	try {
		const mongoClient = await client.connect();
		const db = mongoClient.db('adminhood');
		const newsCollection = db.collection('news');
		const options = {
			sort: { createdAt: -1 },
			projection: { _id: 0 }
		};

		const rawNews = await newsCollection.find({}, options).toArray();

		const news = rawNews.map((order) => ({
			...order,
			createdAt: order.createdAt.toLocaleTimeString('en-US', {
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
				timeZone: 'America/Mexico_City'
			})
		}));

		return {
			news
		};
	} catch (e) {
		console.log(e);
	}
};

export const actions = {
	post: async ({ request }) => {
		const data = await request.formData();
		const post = data.get('new');
		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('adminhood');
			const news = db.collection('news');
			const doc = {
				post,
				createdAt: new Date()
			};
			await news.insertOne(doc);
		} catch (error) {
			console.log(error);
		}
	},
	adminMode: async ({ locals }) => {
		const isAdmin = locals.user.admin;
		const googleId = locals.user.googleId;

		try {
			const mongoClient = await client.connect();
			const db = mongoClient.db('adminhood');
			const orders = db.collection('users');
			const filter = { googleId };
			const updateDoc = {
				$set: {
					admin: !isAdmin
				}
			};
			await orders.updateOne(filter, updateDoc);

			locals.user.admin = true;
		} catch (error) {
			console.log(error);
		}
	},
	signOut: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, '/login');
	}
};
