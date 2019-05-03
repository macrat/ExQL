<script>
import {Bubble} from 'vue-chartjs';

import optionsFor from './options';
import {BubbleData} from './DataParser';


export default {
	extends: Bubble,
	props: ['data', 'x', 'y', 'r', 'c'],
	mounted() {
		this.renderChart(this.chartData, optionsFor(this.data));
	},
	watch: {
		chartData() {
			this.renderChart(this.chartData, optionsFor(this.data));
		},
	},
	computed: {
		chartData() {
			return BubbleData(this.data, {x: this.x, y: this.y, r: this.r, c: this.c}, {
				border: 1.0,
				background: 0.1,
			});
		},
	},
};
</script>
