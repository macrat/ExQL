<script>
import {Bar} from 'vue-chartjs';

import options from './options';
import {SeriesData} from './DataParser';


export default {
	extends: Bar,
	props: ['data', 'x', 'ys'],
	mounted() {
		this.renderChart(this.chartData, options);
	},
	watch: {
		chartData() {
			this.renderChart(this.chartData, options);
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
