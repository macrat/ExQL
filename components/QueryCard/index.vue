<template>
	<v-flex v-if=!removeTimer>
		<v-card flat>
			<v-tabs v-model=active>
				<v-tab><v-icon>table_chart</v-icon></v-tab>
				<v-tab><v-icon>show_chart</v-icon></v-tab>
				<v-tab><v-icon>bar_chart</v-icon></v-tab>
				<v-tab><v-icon>bubble_chart</v-icon></v-tab>
				<v-tab><v-icon>pie_chart</v-icon></v-tab>
				<v-spacer />
				<v-btn icon @click.stop=download><v-icon>save_alt</v-icon></v-btn>
				<v-btn icon @click.stop="startRemove()"><v-icon>close</v-icon></v-btn>
			</v-tabs>

			<v-card-text>
				<table-viewer :value=result v-if="active === 0" />
				<line-viewer :value=result :x.sync=label :ys.sync=values v-else-if="active === 1" />
				<bar-viewer :value=result :x.sync=label :ys.sync=values v-else-if="active === 2" />
				<bubble-viewer :value=result v-bind.sync=bubbleOption v-else-if="active === 3" />
				<doughnut-viewer :value=result :label.sync=label :values.sync=values v-else-if="active === 4" />

				<query-editor :value=value :error=error @input="$emit('change', $event)" />
				<pre v-if="error !== null" flat class=red--text style="white-scape: pre-wrap">{{ error }}</pre>
			</v-card-text>

			<a style="display: none" :href=downloader.url :download=downloader.name ref=downloader />
		</v-card>
	</v-flex>
	<v-snackbar v-else :value=true bottom :timeout=3000>
		Query card has removed
		<v-btn flat @click="cancelRemove()">dismiss</v-btn>
	</v-snackbar>
</template>

<script>
import Vue from 'vue';

import QueryEditor from './QueryEditor';
import TableViewer from './TableViewer';
import LineViewer from './LineViewer';
import BarViewer from './BarViewer';
import BubbleViewer from './BubbleViewer';
import DoughnutViewer from './DoughnutViewer';


export default {
	props: ['value'],
	components: {QueryEditor, TableViewer, LineViewer, BarViewer, BubbleViewer, DoughnutViewer},
	data: () => ({
		active: 1,
		label: null,
		values: [],
		bubbleOption: {x: null, y: null, r: null, c: null},
		error: null,
		lastValidCols: new Set(),
		downloader: {url: '', name: ''},
		removeTimer: null,
	}),
	asyncComputed: {
		result: {
			default: Object.assign([], {columns: []}),
			async get () {
				this.$store.state.tables.stateID;  // just reference

				try {
					const result = await this.$sql.execute(this.value);
					this.error = null;
					return result;
				} catch(e) {
					console.error(e);
					this.error = e;
					return Object.assign([], {columns: []});
				}
			},
		},
	},
	watch: {
		result(val) {
			this.guessParams(val);
		},
	},
	mounted() {
		this.guessParams(this.result, true);
	},
	methods: {
		guessParams(val, force=false) {
			if (val.length === 0 && !force) {
				return;
			}

			const oldCols = this.lastValidCols;
			const newCols = new Set(val.columns.map(x => x.name));
			const diffs = val.columns.filter(x => x.type === 'number' || x.type === 'date').map(x => x.name).filter(x => !oldCols.has(x));

			if (!this.label || !newCols.has(this.label)) {
				const strings = val.columns.filter(x => x.type === 'string');
				if (strings.length > 0) {
					this.label = strings[0].name;
				}
			}
			if (!this.bubbleOption.c || !newCols.has(this.bubbleOption.c)) {
				const strings = val.columns.filter(x => x.type === 'string');
				if (strings.length > 0) {
					this.bubbleOption.c = strings[0].name;
				}
			}

			this.values = this.values.concat(diffs).filter(x => newCols.has(x));

			if ((!this.bubbleOption.x || !newCols.has(this.bubbleOption.x)) && this.values.length > 0) {
				this.bubbleOption.x = this.values[0];
			}
			if ((!this.bubbleOption.y || !newCols.has(this.bubbleOption.y)) && this.values.length > 1) {
				this.bubbleOption.y = this.values[1];
			}
			if ((!this.bubbleOption.r || !newCols.has(this.bubbleOption.r)) && this.values.length > 2) {
				this.bubbleOption.r = this.values[2];
			}

			if (this.values.length === 0) {
				this.active = 0;
			}

			this.lastValidCols = newCols;
		},
		download() {
			const d = new Date();
			const fname = `ExQL-${String(d.getFullYear()).padStart(4, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;

			const canvas = this.$el.querySelector('canvas');
			if (canvas) {
				this.downloader.name = fname + '.png';
				this.downloader.url = canvas.toDataURL();
			} else {
				this.downloader.name = fname + '.csv';
				this.downloader.url = this.$sql.convertToCSV(fname, this.result);
			}
			Vue.nextTick(() => {
				this.$refs.downloader.click();
			});
		},
		startRemove() {
			this.removeTimer = setTimeout(() => this.$emit('remove'), 4000);
		},
		cancelRemove() {
			clearTimeout(this.removeTimer);
			this.removeTimer = null;
		},
	},
};
</script>
