const loop = (n = 1) => {
	let sum = 1;
	for (let i = 0; i < n; i++) {
		sum++;
	}

	return sum;
};

process.on('message', message => {
	const imagePath = message.imagePath;
	console.log(imagePath);

	loop(100_000_000);

	process.send({ thumbnailPath: '/path/to/thumbnail.jpg' });
});
