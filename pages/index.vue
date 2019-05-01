<template>
	<v-app dark>
		<app-header :drawer.sync=drawer />
		<app-drawer
			:drawer=drawer
			@upload="$refs.file.click()"
			@open="$refs.cards.create($event)" />

		<v-content>
			<query-card-list ref=cards />
		</v-content>

		<input ref=file type=file @change=upload style="display: none" multiple />
	</v-app>
</template>

<script>
import path from 'path';

import AppHeader from '~/components/AppHeader';
import AppDrawer from '~/components/AppDrawer';
import QueryCardList from '~/components/QueryCardList';


export default {
	components: {AppHeader, AppDrawer, QueryCardList},
	data() {
		return {drawer: true};
	},
	methods: {
		upload({target: {files}, srcElement}) {
			for (let file of files) {
				let name = path.basename(file.name, path.extname(file.name)).replace(/(^[^a-zA-Z_]|[^a-zA-Z0-9_])/g, 'X');

				if (this.$store.state.tables.list.includes(name)) {
					let i = 2;
					while (this.$store.state.tables.list.includes(`${name}_${i}`)) {
						i++;
					}
					name = `${name}_${i}`;
				}

				const reader = new FileReader();
				reader.addEventListener('load', () => {
					console.log('loaded', name, reader.result);
					this.$store.dispatch('tables/load', {name: name, type: file.type, data: reader.result});
					this.$store.commit('tables/updated');
				});
				reader.readAsArrayBuffer(file);
			}
			srcElement.value = '';
		},
	},
};
</script>
