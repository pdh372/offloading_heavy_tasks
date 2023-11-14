// piscina.js
const Piscina = require('piscina');
const path = require('path');

const piscinaSumBigArray = new Piscina({
	filename: path.join(__dirname, 'worker.js'),
	maxThreads: 2,
	maxQueue: 1,
});

module.exports = {
	piscinaSumBigArray,
};
