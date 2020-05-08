const input = document.querySelector('input');
const textarea = document.querySelector('textarea');

const cssify = () => {
	const prefix = document.querySelector('input').value.replace(/[^A-z0-9]/g, '');
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
		div.innerHTML = `<div>    --${prefix}-${(i++ * 100)}: ${colors[color]}; <span style="background: ${colors[color]}"></span></div>`;
		variables.appendChild(div);
	}

	variables.innerHTML += `<div>}</div>`;
}

document.addEventListener('DOMContentLoaded', () => cssify());

document.addEventListener('input', (e) => {
	if (e.target === input || e.target === textarea) {
		cssify();
	}
});

document.querySelector('.copy').addEventListener('click', () => {
	navigator.permissions.query({ name: "clipboard-write" }).then(result => {
		if (result.state == "granted" || result.state == "prompt") {
			navigator.clipboard.writeText(document.querySelector('.variables').innerText);
		}
	});
});