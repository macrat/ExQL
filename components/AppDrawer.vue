<template>
	<div>
		<v-navigation-drawer app :permanent=drawer>
			<v-list subheader>
				<v-toolbar flat />
				<v-subheader>tables</v-subheader>

				<v-list-tile @click.stop="$emit('upload')">
					<v-list-tile-action><v-icon>add_box</v-icon></v-list-tile-action>
					<v-list-tile-content>IMPORT</v-list-tile-content>
				</v-list-tile>

				<v-slide-x-transition v-for="name in $store.state.tables.list" :key=name>
					<v-list-tile
						@click.stop="open(name)"
						v-show="removeTimer[name] === undefined">

						<v-list-tile-action></v-list-tile-action>

						<v-list-tile-content>{{ name }}</v-list-tile-content>

						<v-list-tile-action>
							<v-btn icon @click.stop="startRemove(name)"><v-icon color=gray>delete</v-icon></v-btn>
						</v-list-tile-action>
					</v-list-tile>
				</v-slide-x-transition>
			</v-list>
		</v-navigation-drawer>

		<div v-for="name in $store.state.tables.list" :key=name>
			<v-snackbar :value="removeTimer[name] !== undefined" bottom :timeout=3000>
				Table has removed
				<v-btn flat @click="cancelRemove(name)">dismiss</v-btn>
			</v-snackbar>
		</div>
	</div>
</template>

<script>
export default {
	props: ['drawer'],
	data: () => ({
		removeTimer: {},
	}),
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
        open(name) {
            if (!name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                name = `[${name}]`;
            }
            this.$emit('open', name);
        },
	},
};
</script>
