const { parentPort, workerData } = require('worker_threads');

function heavyComputation(number) {
	console.log('number', number);

	let sum = 0;

	for (let i = 0; i < number; i++) {
		sum += i;
	}

	return sum;
}

parentPort.on('message', data => {});

const result = heavyComputation(workerData);
parentPort.postMessage(result);
