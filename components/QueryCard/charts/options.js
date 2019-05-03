export default labels => ({
	responsive: true,
	maintainAspectRatio: false,
	legend: {
		display: labels && labels.length <= 40,
		position: labels && labels.length > 10 ? 'right' : 'top',
		labels: {fontColor: 'white'},
	},
});
