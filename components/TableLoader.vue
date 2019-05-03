<template>
	<v-dialog persistent no-click-animation v-model=shown>
		<v-card>
			<v-card-actions>
				<v-spacer />
				<v-card flat class=headline>{{ file.name }}</v-card>
				<v-spacer />
				<v-btn icon @click.stop="shown = false"><v-icon>close</v-icon></v-btn>
			</v-card-actions>

			<v-form v-model=valid>
				<v-card-text>
					<div>OPTIONS</div>

					<v-switch label="use header" v-model=options.headers />

					<v-text-field label="separator" placeholder="," v-model=options.separator v-if="file.type == 'text/csv'" />
				</v-card-text>

				<v-card-text>
					<div>COLUMNS</div>

					<v-layout row wrap>
						<v-flex v-for="[from, to] in Object.entries(options.columns)" :key=from style="margin: 0 8px">
							<v-text-field :label=from v-model=options.columns[from] placeholder="(don't use)" clearable />
						</v-flex>
					</v-layout>
				</v-card-text>
			</v-form>

			<v-card-text>
				<div>PREVIEW</div>

				<v-data-table :headers=headers :items=data :rows-per-page-items=[-1] hide-actions>
					<template #items={item}>
						<td v-for="h in headers">{{ item[h.value] }}</td>
					</template>
				</v-data-table>
			</v-card-text>

			<v-divider />

			<v-card-actions>
				<v-spacer />

				<v-btn flat @click.stop="shown = false">cancel</v-btn>
				<v-btn :light=valid :disabled=!valid @click.stop=storeTable>load</v-btn>
			</v-card-actions>
		</v-card>

		<input ref=file type=file @change=selected style="display: none" multiple />
	</v-dialog>
</template>

<script>
import path from 'path';


export default {
	data: () => ({
		shown: false,
		file: {name: 'debug.csv'},
		data: [],
		options: {
			headers: true,
			separator: ',',
			columns: {},
		},
		valid: true,
	}),
	computed: {
		headers() {
			return Object.entries(this.options.columns).map(([from, to]) => ({text: to, value: from, sortable: false})).filter(x => x.text);
		},
	},
	watch: {
		'options.headers': function() {
			this.loaded();
		},
		'options.separator': function() {
			this.loaded();
		},
	},
	methods: {
		async storeTable() {
			this.$store.dispatch('tables/load', {file: this.file, options: this.options});
			this.shown = false;
		},
		async loaded() {
			this.shown = true;

			this.data = await this.$sql.previewTable(this.file, this.options);
			this.options.columns = Object.keys(this.data[0]).reduce((xs, x) => {
				xs[x] = x;
				return xs;
			}, {});
		},
		selected({target: {files}, srcElement}) {
			for (let file of files) {
				let name = path.basename(file.name, path.extname(file.name));
				const type = path.extname(file.name) === '.xls' ? 'application/vnd.ms-excel' : file.type;

				if (this.$store.state.tables.list.includes(name)) {
					let i = 2;
					while (this.$store.state.tables.list.includes(`${name}_${i}`)) {
						i++;
					}
					name = `${name}_${i}`;
				}

				if (!name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
					name = `[${name.replace('[', '(').replace(']', ')')}]`;
				}

				const reader = new FileReader();
				reader.addEventListener('load', () => {
					console.log('loaded', name, reader.result);
					this.file = {name: name, type: type, url: reader.result};
					this.loaded();
				});
				reader.readAsDataURL(file);
			}
			srcElement.value = '';
		},
		load() {
			this.$refs.file.click();
		},
	},
};
</script>
