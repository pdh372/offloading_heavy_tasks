const app = require('express')();

const {
	Worker,
	// isMainThread,
	// parentPort,
	// workerData,
} = require('node:worker_threads');

app.get('/block', (req, res) => {
	let sum = 0;

	for (let i = 0; i < 10_000_000_000; i++) {
		sum += i;
	}

	return res.json({ result: sum });
});

app.get('/worker_threads', (req, res) => {
	const worker = new Worker('./worker_threads.js', {
		workerData: req.query.number,
	});

	worker.on('message', resFromWorker => {
		res.json({ resFromWorker });
	});
	worker.on('error', error => console.log(error));
	worker.on('exit', code => {
		if (code !== 0)
			reject(new Error(`Worker stopped with exit code ${code}`));
	});

	// worker.postMessage(workerData);
});

app.get('/', (req, res) => {
	return res.json({ result: 'huy' });
});

app.get('/promise', async (req, res) => {
	const sum = await new Promise(resolve => {
		let sum = 0;

		for (let i = 0; i < 10_000_000_000; i++) {
			sum += i;
		}
		resolve(sum);
	});

	res.json(sum);
});

app.listen(3000, () => {
	console.log('running');
});
