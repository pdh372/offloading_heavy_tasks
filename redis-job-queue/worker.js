// worker.js

module.exports = jobData => {
	const result = heavyComputation(jobData);
	return result;
};

function heavyComputation(data) {
	let sum = 0;
	for (let i = 1; i <= data; i++) {
		sum += i;
	}

	return sum;
}
