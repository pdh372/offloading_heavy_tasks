// redis.js

const redis = require('redis');
const { piscinaRedisInQueue } = require('./piscina');

const chanelName = 'handler';
const key_queue_message = 'key_queue_message';

const redisClient = redis.createClient({ password: 'redis123456' });
redisClient
	.connect()
	.then(() => console.log('redis: connected'))
	.catch(err => console.log('redis connect error::', err.message));

const sub = redisClient.duplicate();
sub.connect()
	.then(() => console.log('redis sub: connected'))
	.catch(err => console.log('redis connect error::', err.message));
sub.subscribe(chanelName, (message, chanelName) => {
	console.log(`channel ${chanelName} receive message = ${message}`);
});

const pub = redisClient.duplicate();
pub.connect()
	.then(() => console.log('redis pub: connected'))
	.catch(err => console.log('redis connect error::', err.message));

async function handleTaskInList() {
	while (true) {
		const data = await redisClient.blPop(key_queue_message, 1);
		if (!data) continue;
		const { element } = data;
		const parsedData = JSON.parse(element);
		const result = await piscinaRedisInQueue.run(parsedData.number);
		pub.publish(parsedData.channel_id, JSON.stringify({ sum: result }));
	}
}

handleTaskInList();

module.exports = {
	redisClient,
	pub,
	sub,
	chanelName,
	key: key_queue_message,
};
