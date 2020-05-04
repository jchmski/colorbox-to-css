document.querySelector('button').addEventListener('click', () => {
	const prefix = document.querySelector('input').value;
	const variables = document.querySelector('.variables')
	let i = 1;

	if (prefix.length < 1) return;

	try {
		var colors = JSON.parse(document.querySelector('textarea').value);
	} catch (error) {
		console.error(error);
		return;
	}


	variables.innerHTML = `<div>:root {</div>`;

	for (const color in colors) {
		const div = document.createElement('div');
		div.innerHTML = `<div>    --${prefix}-${(i++ * 100)}: ${colors[color]};</div>`;
		variables.appendChild(div);
	}

	variables.innerHTML += `<div>}</div>`;
});