const data = import('../../data');
const fullCardDistData = data.fullCardDistributions;

(async function () {
	// const data = require('../../data');
	// const fullCardDistData = data.fullCardDistributions;

	const portfolioMethods = {
		strategySpread(bankRoll, strategy) {
			if (typeof fullCardDist !== 'array')
				throw 'Must provide a full card distribution object';
			for (fighter in strategy) {
				fighter[1] = bankRoll * fighter[1];
			}
			return strategy;
		},
	};

	const staticForm = document.getElementById('static-form');
	if (staticForm) {
		const bankRollElement = document.getElementById('betting-bank-roll');
		const errorContainer = document.getElementById('error-container');
		const setNForgetContainer = document.getElementById('set-n-forget');
		const kellyContainer = document.getElementById('kelly');
		const parlayContainer = document.getElementById('parlay');

		// const fullCardDist = await fullCardDistData.getAllFullCardDistributions();
		// console.log(fullCardDist);

		// const fullCardDist = await require('../../data').fullCardDistributions.getAllFullCardDistributions()

		staticForm.addEventListener('submit', (event) => {
			event.preventDefault();

			try {
				errorContainer.classList.add('hidden');
				setNForgetContainer.classList.add('hidden');
				kellyContainer.classList.add('hidden');
				parlayContainer.classList.add('hidden');

				const bankRollValue = bankRollElement.value;
				const parsedBankRollValue = parseInt(bankRollValue);

				// const setNForget = portfolioMethods.strategySpread(
				// 	parsedBankRollValue,
				// 	fullCardDist.setNForget,
				// );
				// const kelly = portfolioMethods.strategySpread(
				// 	parsedBankRollValue,
				// 	fullCardDist.kelly,
				// );

				// const resultListElement = document.createElement('li');
				// resultListElement.innerHTML = 'Test';

				// resultListElement.innerHTML =
				// 	'The SetNForget strategy: ' +
				// 	setNForget +
				// 	' and the Kelly strategy ' +
				// 	kelly;

				const resultSetNForgetElement = document.createElement('li');
				resultSetNForgetElement.innerHTML =
					'Set N Forget: ' + (parsedBankRollValue * Math.random()).toFixed(2);

				const resultKellyElement = document.createElement('li');
				resultKellyElement.innerHTML =
					'Kelly: ' + (parsedBankRollValue * Math.random()).toFixed(2);

				const resultParlayElement = document.createElement('li');
				resultParlayElement.innerHTML =
					'Parlay: ' + (parsedBankRollValue * Math.random()).toFixed(2);

				setNForgetContainer.appendChild(resultSetNForgetElement);
				kellyContainer.appendChild(resultKellyElement);
				parlayContainer.appendChild(resultParlayElement);

				setNForgetContainer.classList.remove('hidden');
				kellyContainer.classList.remove('hidden');
				parlayContainer.classList.remove('hidden');

				staticForm.reset();
			} catch (e) {
				console.log(e);
				errorContainer.innerHTML = 'Invalid input';
				errorContainer.classList.remove('hidden');
			}
		});
	}
})();
