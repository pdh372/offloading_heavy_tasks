// workerService.js
const Piscina = require('piscina');
const path = require('path');

const piscinaRedisInQueue = new Piscina({
	filename: path.join(__dirname, 'worker.js'),
});

module.exports = {
	piscinaRedisInQueue,
};
