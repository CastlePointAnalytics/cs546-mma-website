$(document).ready(() => {
	$('#submit').click((e) => {
		e.preventDefault();
		const bankRoll = $('#betting-bank-roll');
		portfolioSpread(bankRoll);
	});
});

function portfolioSpread(bankRoll) {}
