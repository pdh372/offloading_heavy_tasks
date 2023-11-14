const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
	// Đây là main thread
	const worker = new Worker(__filename);

	worker.on('message', message => {
		console.log(`Tính toán từ worker: ${message}`);
	});

	worker.postMessage('Bắt đầu tính toán');
} else {
	// Đây là worker thread
	parentPort.on('message', message => {
		if (message === 'Bắt đầu tính toán') {
			// Thực hiện một số tính toán phức tạp tại đây...
			const result = performComplexCalculation();
			parentPort.postMessage(result);
		}
	});

	function performComplexCalculation() {
		// Giả sử đây là một tác vụ tính toán phức tạp
		let sum = 0;
		for (let i = 0; i < 1e8; i++) {
			sum += Math.sqrt(i);
		}
		return sum;
	}
}
