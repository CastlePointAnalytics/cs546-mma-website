$(document).ready(() => {
	globalUserArith();
});

function globalUserArith() {
	$.ajax({
		method: 'GET',
		async: true,
		url: '/user/globalUserStats',
		// contentType: 'application/json',
	}).then((worldDict) => {
		let header = <h2>Global Users</h2>;
		$('#globalUserStats').append(header);
		// for (let country in worldDict) {
		// 	let li = `<li>${country}</li>`;
		// }
	});
}
