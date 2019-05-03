const colors = [
	[0xaf, 0x2b, 0x4f],
	[0xf4, 0x80, 0x69],
	[0xed, 0xce, 0xc7],
	[0x74, 0xad, 0x8f],
	[0xf4, 0xc6, 0x69],
	[0x74, 0xa2, 0xad],
];


function color(idx, opacity=1) {
	const c = colors[idx % colors.length];
	return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${opacity})`;
}


export function DoughnutData(data, selectors, opacities) {
	if (data.length === 0) {
		return {labels: [], datasets: []};
	}

	return {
		labels: selectors.label ? data.map(d => d[selectors.label]) : data.map((_, i) => i),
		datasets: (selectors.values || []).map(sel => ({
			data: data.map(d => d[sel]),
			borderColor: data.map((_, i) => color(i, opacities.border)),
			backgroundColor: data.map((_, i) => color(i, opacities.background)),
		})),
	};
}


export function BubbleData(data, selectors, opacities) {
	if (data.length === 0) {
		return {datasets: []};
	}

	const classes = [...new Set(data.map(d => d[selectors.c]))];

	return {
		datasets: classes.map((cls, i) => ({
			label: cls || '',
			data: data.filter(d => d[selectors.c] === cls).map(d => ({
				x: selectors.x ? d[selectors.x] : 0,
				y: selectors.y ? d[selectors.y] : 0,
				r: selectors.r ? d[selectors.r] : 5,
			})),
			borderColor: color(i, opacities.border),
			backgroundColor: color(i, opacities.background),
		})),
	};
}


export function SeriesData(data, selectors, opacities) {
	if (data.length === 0) {
		return {labels: [], datasets: []};
	}

	const labels = selectors.x ? data.map(x => x[selectors.x]) : data.map((_, i) => i);

	return {
		labels: labels,
		datasets: (selectors.ys || []).map((label, i) => ({
			label: label,
			data: data.map(d => d[label]),
			borderColor: color(i, opacities.border),
			backgroundColor: color(i, opacities.background),
		})),
	};
}
