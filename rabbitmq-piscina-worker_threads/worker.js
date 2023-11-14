//worker.js

const sumData = ({ number }) => {
	let sum = 0;
	for (let i = 1; i < number; i++) {
		sum += i;
	}
	console.log('sum::', sum);
	return sum;
};

module.exports = sumData;
