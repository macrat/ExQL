<script>
import {Line} from 'vue-chartjs';

import options from './options';
import {SeriesData} from './DataParser';


export default {
	extends: Line,
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
				border: 1.0,
				background: 0.1,
			});
		},
	},
};
</script>
