$(document).ready(() => {
	previousFightCard();
});

function boutOutcomeGraphics(bout, index) {
	if (bout.winner == 'fighter1') {
		$(`#${index}_left`).css({ color: 'green' });
		$(`#${index}_right`).css({ color: '#ee0000' });
	} else {
		$(`#${index}_left`).css({ color: '#ee0000' });
		$(`#${index}_right`).css({ color: 'green' });
	}
}

function previousFightCard() {
	$.ajax({
		method: 'GET',
		async: true,
		url: '/previousFightCard/apiData',
		contentType: 'application/json',
	}).then((data) => {
		index = 0;
		data.forEach((bout) => {
			boutOutcomeGraphics(bout, index++);
		});
	});
}
