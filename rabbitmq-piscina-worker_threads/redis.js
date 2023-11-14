//redis.js
const redis = require('redis');
const CHANNEL_WORKER_THREADS = 'channel_worker_threads';

const client = redis.createClient({ password: 'redis123456' });

const publisher = client.duplicate();
const subscriber = client.duplicate();

publisher.connect();
subscriber.connect();

const handleDataFromSub = ({ res, channel_id }) => {
	subscriber.subscribe(channel_id, async message => {
		await subscriber.unsubscribe(channel_id);
		const parsed = JSON.parse(message);
		res.json({ sum: parsed.data });
	});
};

module.exports = {
	publisher,
	constant: {
		CHANNEL_WORKER_THREADS,
	},
	handleDataFromSub,
};
