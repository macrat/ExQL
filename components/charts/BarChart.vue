<script>
import {Bar} from 'vue-chartjs';

import optionsFor from './options';
import {SeriesData} from './DataParser';


export default {
	extends: Bar,
	props: ['data', 'x', 'ys'],
	mounted() {
		this.renderChart(this.chartData, optionsFor(this.ys));
	},
	watch: {
		chartData() {
			this.renderChart(this.chartData, optionsFor(this.ys));
		},
	},
	computed: {
		chartData() {
			return SeriesData(this.data, {x: this.x, ys: this.ys}, {
				border: 0.0,
				background: 1.0,
			});
		},
	},
};
</script>
