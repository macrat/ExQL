<script>
import {Doughnut} from 'vue-chartjs';

import optionsFor from './options';
import {DoughnutData} from './DataParser';


export default {
	extends: Doughnut,
	props: ['data', 'label', 'values'],
	mounted() {
		this.renderChart(this.chartData, optionsFor(this.data));
	},
	watch: {
		chartData() {
			console.log(this.label);
			this.renderChart(this.chartData, optionsFor(this.data));
		},
	},
	computed: {
		chartData() {
			return DoughnutData(this.data, {label: this.label, values: this.values}, {
				border: 0.9,
				background: 0.7,
			});
		},
	},
};
</script>
