<template>
	<v-navigation-drawer app :permanent=drawer>
		<v-list subheader>
			<v-toolbar flat />
			<v-subheader>tables</v-subheader>

			<v-list-tile @click.stop="$emit('upload')">
				<v-list-tile-action><v-icon>add_box</v-icon></v-list-tile-action>
				<v-list-tile-content>IMPORT</v-list-tile-content>
			</v-list-tile>

			<template v-for="name in $store.state.tables.list">
				<v-list-tile @click.stop="$emit('open', name)" v-if="removeTimer[name] === undefined">
					<v-list-tile-action></v-list-tile-action>

					<v-list-tile-content>{{ name }}</v-list-tile-content>

					<v-list-tile-action>
						<v-btn icon @click.stop="startRemove(name)"><v-icon color=gray>delete</v-icon></v-btn>
					</v-list-tile-action>
				</v-list-tile>
				<v-snackbar v-else :value=true :bottom=true :left=true :timeout=3000>
					Table has removed
					<v-btn flat @click="cancelRemove(name)">dismiss</v-btn>
				</v-snackbar>
			</template>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
export default {
	props: ['drawer'],
	data() {
		return {
			removeTimer: {},
		};
	},
	methods: {
		startRemove(name) {
			this.$set(this.removeTimer, name, setTimeout(() => {
				this.$store.dispatch('tables/remove', {name});
				this.$set(this.removeTimer, name, undefined);
			}, 4000));
		},
		cancelRemove(name) {
			clearTimeout(this.removeTimer[name]);
			this.$set(this.removeTimer, name, undefined);
		},
	},
};
</script>
