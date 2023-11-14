const { fork } = require('child_process');

function processImage(imagePath) {
	return new Promise((resolve, reject) => {
		const child = fork('./child-process/process-image.js');

		child.on('message', message => {
			resolve(message); // Resolve promise with the result from the child process
			// console.log(message);
		});

		child.on('error', reject); // Reject the promise if there's an error

		child.on('exit', code => {
			if (code !== 0) {
				reject(new Error(`Child process exited with code ${code}`));
			}
		});

		child.send({ imagePath }); // Send the image path to the child process
	});
}

const loop = (n = 1) => {
	let sum = 1;
	for (let i = 0; i < n; i++) {
		sum++;
	}

	return sum;
};

async function main() {
	try {
		processImage('/path/to/image.jpg');
		const sum = loop(100);

		console.log(sum);
	} catch (error) {
		console.log('error::', error.message);
	}
}

main();
