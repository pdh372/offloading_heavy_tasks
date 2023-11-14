const main = () => {
	try {
		const promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject('Loi Roi');
			}, 3000);
		});
	} catch (error) {
		// console.log('error::', error.message);
	}

	console.log(123);
};

main();
