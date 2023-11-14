// server.js

const express = require('express');
const { v4 } = require('uuid');
const app = express();
const port = 3000;
const { queueWorkerThreads } = require('./rabbitmq');
const { handleDataFromSub } = require('./redis');
const sumData = require('./worker');

app.get('/', (req, res) => {
	const uuid = v4();
	queueWorkerThreads.send({
		message: { number: +req.query.number || 100_000_000, channel_id: uuid },
	});

	handleDataFromSub({ res, channel_id: uuid });
});

app.get('/no-worker-thread', (req, res) => {
	const sum = sumData({ number: req.query.number || 100_000_000 });
	return res.json({ sum });
});

app.get('/basic', (req, res) => {
	return res.json('ok');
});

app.listen(port, async () => {
	await queueWorkerThreads.setup();

	queueWorkerThreads.createConsumer();
	queueWorkerThreads.createConsumer();

	console.log(`listening on port = ${port}`);
});
