// server.js
const express = require('express');
const { v4 } = require('uuid');
const app = express();
const port = 3000;
const { redisClient, sub, key } = require('./redis');

app.get('/push', async (req, res) => {
	try {
		const uuid = v4();
		await redisClient.lPush(
			key,
			JSON.stringify({
				number: req.query.number || 100_000,
				channel_id: uuid,
			}),
		);

		sub.subscribe(uuid, async (message, channel_id) => {
			await sub.unsubscribe(channel_id);
			const parseData = JSON.parse(message);
			res.json({ sum: parseData.sum });
		});
	} catch (error) {
		return res.json(error.message);
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
