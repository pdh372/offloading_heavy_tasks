const amqp = require('amqplib');

const AMQP_URL = 'amqp://localhost';

async function startWorker() {
	const conn = await amqp.connect(AMQP_URL);
	const channel = await conn.createChannel();

	const queue = 'tasks_queue';

	await channel.assertQueue(queue, { durable: true });
	console.log('Worker is waiting for tasks');

	channel.consume(queue, msg => {
		const task = JSON.parse(msg.content.toString());
		const result = heavyComputation(task.number); // Replace with your actual computation

		console.log('Processed task:', task);

		channel.sendToQueue(
			msg.properties.replyTo,
			Buffer.from(JSON.stringify(result)),
			{
				correlationId: msg.properties.correlationId,
			},
		);

		channel.ack(msg);
	});
}

function heavyComputation(number) {
	// Simulate a heavy task
	let sum = 0;

	for (let i = 0; i < number; i++) {
		sum++;
	}

	return sum;
}

startWorker().catch(console.warn);
