<template>
	<v-navigation-drawer app :permanent=drawer>
		<v-list subheader>
			<v-toolbar flat />
			<v-subheader>tables</v-subheader>

			<v-list-tile @click.stop="$emit('upload')">
				<v-list-tile-action><v-icon>add_box</v-icon></v-list-tile-action>
				<v-list-tile-content>IMPORT</v-list-tile-content>
			</v-list-tile>

			<v-list-tile @click.stop="$emit('open', name)" v-for="name in $store.state.tables.list">
				<v-list-tile-action></v-list-tile-action>

				<v-list-tile-content v-if="remove[name] === undefined">{{ name }}</v-list-tile-content>
				<v-list-tile-content v-else><v-progress-linear :value="remove[name]" /></v-list-tile-content>

				<v-list-tile-action v-if="remove[name] === undefined"><v-btn icon @click.stop="startRemove(name)"><v-icon color=gray>delete</v-icon></v-btn></v-list-tile-action>
				<v-list-tile-action v-else><v-btn icon @click.stop="cancelRemove(name)"><v-icon color=gray>cancel</v-icon></v-btn></v-list-tile-action>
			</v-list-tile>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
export default {
	props: ['drawer'],
	data() {
		return {
			remove: {},
		};
	},
	methods: {
		startRemove(name) {
			this.$set(this.remove, name, 0);
			const startTime = new Date();

			const update = () => {
				if (this.remove[name] === undefined) {
					return;
				}

				this.$set(this.remove, name, (new Date() - startTime) / 20);

				if (this.remove[name] < 100) {
					setTimeout(update, 100);
				} else {
					this.$store.dispatch('tables/remove', {name});
					this.$set(this.remove, name, undefined);
				}
			}
			update();
		},
		cancelRemove(name) {
			this.$set(this.remove, name, undefined);
		},
	},
};
</script>
