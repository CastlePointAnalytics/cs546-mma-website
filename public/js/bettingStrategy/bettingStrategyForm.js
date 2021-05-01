$(document).ready(() => {
	$('#submit').click((e) => {
		e.preventDefault();
		const bankRoll = $('#betting-bank-roll').val();
		portfolioSpread(bankRoll);
	});
});

function bettingMethodArith(fullCardDist, bankRoll) {
	fullCardDist.setNForget.forEach((fighter) => {
		fighter[1] = (fighter[1] * bankRoll).toFixed(2);
		let li = `<li>Bet $<b>${fighter[1]}</b> on ${fighter[0]}</li>`;
		$('#set-n-forget').append(li);
	});

	fullCardDist.kelly.forEach((fighter) => {
		fighter[1] = (fighter[1] * bankRoll).toFixed(2);
		let li = `<li>Bet $<b>${fighter[1]}</b> on ${fighter[0]}</li>`;
		$('#kelly').append(li);
	});

	$('#main-card').append('<h3>CPA Main Card Parlay consists of:</h3>');
	fullCardDist.parlay.mainCard.forEach((fighter) => {
		let li = `<li>${fighter}</li>`;
		$('#main-card').append(li);
	});

	$('#prelims').append('<h3>CPA Prelims Parlay consists of:</h3>');
	fullCardDist.parlay.prelims.forEach((fighter) => {
		let li = `<li>${fighter}</li>`;
		$('#prelims').append(li);
	});

	$('#cpa-signature').append('<h3>CPA Signature Parlay consists of:</h3>');
	fullCardDist.parlay.CPASignatureParlay.forEach((fighter) => {
		let li = `<li>${fighter}</li>`;
		$('#cpa-signature').append(li);
	});

	$('#underdog').append('<h3>CPA Underdog:</h3>');
	fullCardDist.parlay.CPASignatureParlay.forEach((fighter) => {
		let li = `<li>${fighter}</li>`;
		$('#underdog').append(li);
	});
}

function portfolioSpread(bankRoll) {
	$.ajax({
		method: 'GET',
		async: true,
		url: '/fullCardDistributions/apiData',
		contentType: 'application/json',
	}).then((data) => {
		$('#set-n-forget').empty();
		$('#kelly').empty();
		$('#parlay').empty();
		$('#main-card').empty();
		$('#prelims').empty();
		$('#cpa-signature').empty();
		$('#underdog').empty();
		bettingMethodArith(data[0], bankRoll);
	});
}
