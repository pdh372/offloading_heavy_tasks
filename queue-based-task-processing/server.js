const express = require('express');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const AMQP_URL = 'amqp://localhost';

app.post('/start-computation', async (req, res) => {
	const correlationId = uuidv4();
	const task = {
		number: req.body.number,
		correlationId,
	};

	// Send the task to the queue and await the result
	const result = await sendToQueueAndWaitForResult(task);
	console.log('result::', result);
	res.json({ result });
});

async function sendToQueueAndWaitForResult(task) {
	const conn = await amqp.connect(AMQP_URL);
	const channel = await conn.createChannel();

	const queue = 'tasks_queue';
	const resultQueue = 'result_queue';

	await channel.assertQueue(queue, { durable: true });
	await channel.assertQueue(resultQueue, { durable: true });

	// Consume the result in the resultQueue
	const result = await new Promise((resolve, reject) => {
		channel.consume(
			resultQueue,
			msg => {
				if (msg.properties.correlationId === task.correlationId) {
					const result = JSON.parse(msg.content.toString());
					resolve(result);
					channel.ack(msg);
				}
			},
			{ noAck: false },
		);

		// Send the task to the tasks_queue
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)), {
			correlationId: task.correlationId,
			replyTo: resultQueue,
		});
	});

	// Clean up and close connections
	setTimeout(() => {
		channel.close();
		conn.close();
	}, 500); // Adjust this timeout as necessary

	return result;
}

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
