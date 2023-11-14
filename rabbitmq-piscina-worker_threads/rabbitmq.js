// rabbitmq.js
const amqp = require('amqplib');
const { piscinaSumBigArray } = require('./piscina');
const { publisher, constant } = require('./redis');

async function connect() {
	try {
		const connection = await amqp.connect('amqp://localhost');
		return { connection };
	} catch (error) {
		console.error('Error connecting to RabbitMQ', error);
		process.exit(1);
	}
}

function setupWorkerThreadsByRabbitMQM() {
	const exchangeName = 'exchange::worker_threads';
	const routingKey = 'rk::worker_threads';
	const queueName = 'q::worker_threads';

	let connection;
	let channelSendMessage;

	async function setup() {
		if (connection || channelSendMessage) return;

		const connectData = await connect();

		connection = connectData.connection;
		channelSendMessage = await connection.createChannel();

		await channelSendMessage.assertExchange(exchangeName, 'direct', {
			durable: true,
		});
		await channelSendMessage.assertQueue(queueName, { durable: true });
		await channelSendMessage.bindQueue(queueName, exchangeName, routingKey);

		console.info(`RabbitMQ:: ${exchangeName} ${queueName}`);
	}

	async function send({ message }) {
		try {
			if (!channelSendMessage) return false;
			channelSendMessage.publish(
				exchangeName,
				routingKey,
				Buffer.from(JSON.stringify(message)),
			);
			return true;
		} catch (error) {
			console.error(`error:: ${error.message}`);
			return false;
		}
	}

	async function createConsumer() {
		try {
			const channelReceiveMessage = await connection.createChannel();
			channelReceiveMessage.prefetch(1);

			channelReceiveMessage.consume(queueName, async function (msg) {
				const dataReceive = JSON.parse(msg.content.toString());

				const result = await piscinaSumBigArray.run({
					number: dataReceive.number,
				});

				publisher.publish(
					dataReceive.channel_id,
					JSON.stringify({
						data: result,
					}),
				);

				channelReceiveMessage.ack(msg);
			});

			return {};
		} catch (error) {
			console.error(`error:: ${error.message}`);
			return {};
		}
	}

	async function closeConnection() {
		try {
			await connection.close();
			return true;
		} catch (error) {
			console.log('error closeConnection:::', error.message);
			return false;
		}
	}

	return { send, createConsumer, setup, closeConnection };
}

module.exports = {
	queueWorkerThreads: setupWorkerThreadsByRabbitMQM(),
};
